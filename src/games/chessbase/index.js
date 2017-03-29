
var mvs = require("./chessbase.json");

var games = {};

for(var name in mvs.models) {
    games[name] = {
        name: name,
        modelScripts: mvs.models[name].js,
        config: {
            status: true,
            model: mvs.models[name]
        }
    }
}

for(var name in mvs.views) {
    games[name].viewScripts = mvs.views[name].js;
    games[name].config.view = mvs.views[name];
}

exports.games = Object.keys(games).map((name)=>{
    return games[name];
});

