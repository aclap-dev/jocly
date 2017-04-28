var Jocly = require("../..");

var moveCount = 0;

function RunMatch(match) {
    function NextMove() {
        var move;
        match.machineSearch()
            .then( (result) => {
                move = result.move;
                return match.getMoveString(move);
            })
            .then( (moveStr) => {
                console.info(
                    ((!(moveCount%2) && ((moveCount>>1)+1)+".  ") || "")
                    +(moveCount%2 && "            " || "")+" "+moveStr
                );
                moveCount++;
            })
            .then( () => {
                return match.applyMove(move);
            })
            .then( (result) => {
                if(result.finished) {
                    if(result.winner==Jocly.PLAYER_A)
                        console.info("Player A wins");
                    else if(result.winner==Jocly.PLAYER_B)
                        console.info("Player B wins");
                    else if(result.winner==Jocly.DRAW)
                        console.info("Draw");
                } else
                    NextMove();
            })
            .catch( (e) => {
                console.info("Error",e);
            })

    }
    NextMove();
}


Jocly.createMatch("classic-chess")
    .then((match)=>{
        RunMatch(match);
    })
    .catch((e)=>{
        console.info("Error creating match",e);                
    });

