var jocly = require("../../dist/node");

var moveCount = 0;

process.on('uncaughtException', function(err) {
    console.error(err,err.stack)
});

function Turn(game) {
    game.machineTurn({
            level: game.config.model.levels[2],
        })
        .then(()=>{
        },(e)=>{
            console.error("cannot machine turn",e);
        })
        .catch((e)=>{
            console.error("error in machine turn",e);            
        })
        ;
}

function Listen(message) {
    //console.info("Top receives",message);
    switch(message.type) {
        case "machine-move":
            var move = this.getMoveString(message.move)
                .then((move)=>{
                    console.info(
                        ((!(moveCount%2) && ((moveCount>>1)+1)+".  ") || "")
                        +(moveCount%2 && "            " || "")+" "+move
                    );
                    moveCount++;
                    if(message.finished)
                        switch(message.winner) {
                            case 1: console.info("Player A wins"); break;
                            case -1: console.info("Player B wins"); break;
                            case 2: console.info("Draw"); break;
                        }
                    else
                        Turn(this);
                    });
            break;
    }
}

jocly.createGame("classic-chess")
    .then((game)=>{
        game.listen(Listen);
        Turn(game);
    },(e)=>{
        console.info("error",e);        
    })
    .catch((e)=>{
        console.info("error",e);                
    })
    ;

