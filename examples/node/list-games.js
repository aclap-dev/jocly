var jocly = require("../..");

jocly.listGames()
    .then((games)=>{
        var gameNames = Object.keys(games).map((gameName) => {
            return games[gameName].title;
        });
        process.stdout.write(Object.keys(games).length+" games: "+gameNames.join(", ")+"\n");
    });


