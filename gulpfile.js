/* jshint esversion:6 */
const path = require('path');
const fs = require('fs');

const gulp = require('gulp');
const debug = require('gulp-debug');
const del = require("del");
const through = require('through2');
const Vinyl = require("vinyl");
const merge = require('merge-stream');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const add = require('gulp-add');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const browserify = require('browserify');
const buffer = require("vinyl-buffer");
const source = require('vinyl-source-stream');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');
const gutil = require('gulp-util');

const modulifyHeaders = {
	model:
	`exports.model = Model = {
    Game: {},
    Board: {},
    Move: {}
};
`,
	view:
	`exports.view = View = {
    Game: {},
    Board: {},
    Move: {}
};
`
};

const allGames = {};

var moduleDirs = [];
var modulesMap = {};
var exclusiveGames = null;

if (typeof argv.defaultGames == "undefined" || argv.defaultGames)
	moduleDirs = fs.readdirSync("src/games").map((dir) => {
		return path.join("src/games", dir);
	});
if (argv.modules)
	moduleDirs = moduleDirs.concat(argv.modules.split(":"));
moduleDirs.forEach((dir) => {
	modulesMap[path.basename(dir)] = dir;
});

if (argv.games) {
	exclusiveGames = {};
	argv.games.split(":").forEach((game) => {
		exclusiveGames[game] = true;
	});
}

function HandleModuleGames(modelOnly) {

	return through.obj(function (file, enc, next) {
		// this is executed for every game module
		var push = this.push.bind(this);
		var moduleName = path.basename(file.path);
		var moduleManifest = require(file.path);
		var streams = [];
		moduleManifest.games.forEach((game) => {
			// this is executed for every game in the game module

			if (exclusiveGames && !exclusiveGames[game.name])
				return;
			if (typeof argv.obsolete != "undefined" && !argv.obsolete && game.config.model.obsolete)
				return;

			// same some game data so we can list all games later
			allGames[game.name] = {
				title: game.config.model["title-en"],
				summary: game.config.model.summary,
				thumbnail: game.config.model.thumbnail,
				module: moduleName,
				obsolete: game.config.model.obsolete
			};

			// create the game config file
			push(new Vinyl({
				path: moduleName + "/" + game.name + "-config.js",
				contents: new Buffer('exports.config = ' + JSON.stringify(game.config))
			}));

			// create some specified resources
			if (!modelOnly) {
				var resources = {
					model: ["thumbnail", "rules", "description", "credits"],
					view: ["css"]
				};
				["model", "view"].forEach((modelView) => {
					resources[modelView].forEach((field) => {
						var files = [];
						switch (typeof game.config[modelView][field]) {
							case "string":
								files.push(game.config[modelView][field]);
								break;
							case "object":
								for (var f in game.config[modelView][field])
									files.push(game.config[modelView][field][f]);
								break;
						}
						files = files.map((file) => {
							return path.join(modulesMap[moduleName], file);
						});
						var stream = gulp.src(files)
							.pipe(rename(function (path) {
								path.dirname = moduleName;
							}))
							.pipe(through.obj(function (file, enc, next) {
								push(file);
								next();
							}))
							;
						streams.push(stream);
					});
				});
			}

			// create model and view script files
			function Scripts(which) {
				var scripts = game[which + "Scripts"].map((script) => {
					return path.join(modulesMap[moduleName], script);
				});
				var fileName = moduleName + "/" + game.name + "-" + which + ".js";
				var stream = gulp.src(scripts)
					.pipe(gulpif(!argv.prod, sourcemaps.init()))
					.pipe(add('_', modulifyHeaders[which], true))
					.pipe(concat(fileName))
					.pipe(gulpif(argv.prod, uglify()))
					.on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
					.pipe(gulpif(!argv.prod, sourcemaps.write('.')))
					.pipe(through.obj(function (file, enc, next) {
						push(file);
						next();
					}));
				streams.push(stream);
			}
			if (modelOnly)
				Scripts("model");
			else
				["model", "view"].forEach(Scripts);
		});

		// create module common resources
		if (!modelOnly) {
			var stream = gulp.src(modulesMap[moduleName] + "/res/**/*")
				.pipe(rename(function (path) {
					path.dirname = moduleName + "/res/" + path.dirname;
				}))
				.pipe(through.obj(function (file, enc, next) {
					push(file);
					next();
				}))
				;
			streams.push(stream);
		}

		merge(streams)
			.on("finish", function () {
				next();
			});

	});
}

gulp.task("build-node-games", function () {
	return gulp.src(moduleDirs)
		.pipe(HandleModuleGames(true))
		.pipe(gulp.dest("dist/node/games"));
});

function ProcessJS(stream, concatName, skipBabel) {
	if (!argv.prod && concatName)
		stream = stream.pipe(sourcemaps.init());
	if (!skipBabel)
		stream = stream.pipe(babel({
			presets: ['es2015'],
			compact: !!argv.prod
		}));
	if (argv.prod)
		stream = stream.pipe(uglify())
			.on('error', function (err) {
				gutil.log(gutil.colors.red('[Error]'), err.toString());
				this.emit('end');
			});
	if (concatName)
		stream = stream.pipe(concat(concatName));
	if (!argv.prod && concatName)
		stream = stream.pipe(sourcemaps.write("."));
	return stream;
}

gulp.task("build-node-core", function () {

	var joclyCoreStream =
		ProcessJS(gulp.src([
			"src/core/jocly.core.js",
		]));

	var joclyBaseStream =
		ProcessJS(gulp.src([
			"src/core/jocly.util.js",
			"src/core/jocly.uct.js",
			"src/core/jocly.game.js"
		]));

	var allGamesStream = source('jocly-allgames.js');
	allGamesStream.end('exports.games = ' + JSON.stringify(allGames));
	allGamesStream = ProcessJS(allGamesStream.pipe(buffer()));

	return merge(joclyCoreStream, allGamesStream, joclyBaseStream)
		.pipe(gulp.dest("dist/node"));

});

function CopyLicense(target) {
	return gulp.src(["COPYING.md", "CONTRIBUTING.md", "AGPL-3.0.txt"])
		.pipe(gulp.dest(target));
}

gulp.task("copy-browser-license", function () {
	return CopyLicense("dist/browser");
});

gulp.task("copy-node-license", function () {
	return CopyLicense("dist/node");
});

gulp.task("build-node", function (callback) {
	runSequence("build-node-games", ["build-node-core", "copy-node-license"], callback);
});

gulp.task("build-browser-games", function () {
	return gulp.src(moduleDirs)
		.pipe(HandleModuleGames(false))
		.pipe(gulp.dest("dist/browser/games"));
});

gulp.task("build-browser-core", function () {

	var _ProcessJS = function (s) { return s; };

	var b = browserify({
		entries: "src/browser/jocly.js",
		debug: true,
		standalone: "Jocly"
	});

	var joclyBrowserStream = ProcessJS(b.bundle()
		.pipe(source('jocly.js'))
		.pipe(buffer()));

	var joclyCoreStream = ProcessJS(gulp.src([
		"src/core/jocly.core.js",
	]));

	var joclyBaseStream = ProcessJS(gulp.src([
		"src/core/jocly.util.js",
		"src/core/jocly.uct.js",
		"src/core/jocly.game.js"
	]), "jocly.game.js", true);

	var joclyExtraScriptsStream = ProcessJS(gulp.src([
		"src/browser/jocly.aiworker.js",
		"src/browser/jocly.embed.js"
	]));

	var joclyExtraStream = gulp.src([
		"src/browser/jocly.embed.html"
	]);

	var joclyResStream = gulp.src("src/browser/res/**/*")
		.pipe(rename(function (path) {
			path.dirname = "res/" + path.dirname;
		}));

	var allGamesStream = source('jocly-allgames.js');
	allGamesStream.end('exports.games = ' + JSON.stringify(allGames));
	allGamesStream = ProcessJS(allGamesStream.pipe(buffer()));

	return merge(joclyBrowserStream, joclyCoreStream, allGamesStream, joclyBaseStream,
		joclyExtraStream, joclyExtraScriptsStream, joclyResStream)
		.pipe(gulp.dest("dist/browser"));

});

gulp.task("build-browser-xdview", function () {
	const lib = "third-party/";
	const src = "src/";
	const srcLib = "src/lib/";
	const nmLib = "node_modules/";

	var libs = ProcessJS(gulp.src([
		lib + "three.js",
		nmLib + "jquery/dist/jquery.js"
	]));

	var packedLibs = ProcessJS(gulp.src([
		lib + "SubdivisionModifier.js",
		lib + "tween.js",
		lib + "tween.fix.js",
		srcLib + "JoclyOrbitControls.js",
		lib + "DeviceOrientationControls.js",
		lib + "Projector.js",
		lib + "threex.domevent.js",
		lib + "threex.domevent.object3d.js",
		lib + "StereoEffect.js",
		lib + "AnaglyphEffect.js",
		srcLib + "VRGamepad.js",
		lib + "VRControls.js",
		lib + "VREffect.js",
		lib + "OBJLoader.js",
		lib + "MTLLoader.js",
		lib + "kalman.js",
		src + "browser/jocly.ar.js",
		src + "browser/jocly.state-machine.js",
		src + "browser/jocly.xd-view.js"
	]), "jocly-xdview.js", true);

	return merge(libs, packedLibs)
		.pipe(gulp.dest("dist/browser"))
		;

});

gulp.task("build-browser", function (callback) {
	runSequence("build-browser-games", ["build-browser-core",
		"build-browser-xdview", "copy-browser-license"], callback);
});


gulp.task("build", function (callback) {
	runSequence("clean", ["build-browser", "build-node"], callback);
});

gulp.task("clean", function () {
	return del(["dist/*"], { force: true });
});

gulp.task("watch", function () {
	gulp.watch(moduleDirs.map((dir) => { return dir + "/**/*"; }), ["build-node-games", "build-browser-games"]);
	gulp.watch("src/{browser,core,lib}/**/*", ["build-browser-core", "build-browser-xdview"]);
	gulp.watch("src/{node,core}/**/*", ["build-node-core"]);
});

gulp.task("help", function () {
	var help = `
usage: gulp [<commands>] [<options>]

commands:
    build: generate clean project build
    watch: watch project and build dynamically on changes

options:
    --prod: generate for production
    --no-default-games: do not process game module from default src/games directory
    --modules <modules>: process additional game modules from specified directories (colon separated)
    --games <games>: process exclusively the specified games (colon separated)
    --no-obsolete: do not include games marked as obsolete
`;
	console.log(help);
	process.exit(0);
});
