
window.addEventListener("DOMContentLoaded", function () {
    var elementId = "game-area1";
    var area = document.getElementById(elementId);
    var match, move, gameData;

    Jocly.createMatch("classic-chess")
        .then((_match) => {
                console.info("match created");
                match = _match;
                return match.getTurn()
            })
        .then( (player) => {
                console.info("Local Turn",player);
                return match.pickMove('e4');
            })
        .then( (_move) => {
                move = _move;
                console.info("Move",move);
                return match.getMoveString(move);
            })
        .then( (moveString) => {
                console.info("Move string",moveString);
                return match.playMove(move);
            })
        .then( () => {
                console.info("Move played");
                return match.attachElement(area)
            })
        .then( () => {
                console.info("Match attached");
                return match.getTurn()
            })
        .then( (player) => {
                console.info("Proxy Turn",player);
                var promise = new Promise( function(resolve, reject) {
                    setTimeout(()=>{
                        resolve();
                    },3000);
                });
                return promise;
            })
        .then( () => {
                return match.detachElement();
            })
        .then( () => {
                var promise = new Promise( function(resolve, reject) {
                    setTimeout(()=>{
                        resolve();
                    },1000);
                });
                return promise;
            })
        .then( () => {
                return match.pickMove('e5');
            })
        .then( (move) => {
                return match.playMove(move);
            })
        .then( () => {
                return match.attachElement(area)
            })
        .then( () => {
                console.info("attached")
                return match.pickMove('Nf3');
            })
        .then( (move) => {
                return match.playMove(move);
            })
        .then( () => {
                console.info("attached")
                return match.pickMove('a5');
            })
        .then( (move) => {
                return match.applyMove(move);
            })
        .then( (result) => {
                console.info("user=>",result);
                setTimeout(()=>{
                    match.abortUserTurn()
                        .then(()=>{
                            console.info("abortUserTurn succeeded");
                        },(err)=>{
                            console.info("abortUserTurn failed");                            
                        })
                },5000);
                return match.userTurn();
            })
        .then( (result) => {
                console.info("user move",result);
            },(err)=>{
                console.info("userTurn failed",err)
            })
        .then( () => {
            console.info("computer searching");
            return match.machineSearch();
        })
        .then( (result) => {
            return match.playMove(result.move);
        })
        .then( () => {
                setTimeout(()=>{
                    match.abortMachineSearch()
                        .then(()=>{
                            console.info("abortMachineSearch succeeded");
                        },(err)=>{
                            console.info("abortMachineSearch failed");                            
                        })
                },50);
                return match.machineSearch();
            })
        .then( (result) => {
                console.info("machine search",result);
            },(err)=>{
                console.info("machine search failed",err)
            })
        .then( ()=>{
                setTimeout(()=>{
                    match.setViewOptions({
                        notation: true
                    })
                },2000);
                setTimeout(()=>{
                    match.abortUserTurn()
                },4000);
                return match.userTurn()
            })
        .then( (result) => {
            },()=>{
            })
        .then( ()=>{
            return match.getFinished()
        })
        .then( (result)=>{
            console.info("Finished:",result);
            return match.rollback(-1)
        })
        .then( ()=>{
            return match.save()
        })
        .then( (data)=>{
            gameData = data;
            return match.rollback(0);
        })
        .then( ()=>{
            var promise = new Promise( function(resolve, reject) {
                setTimeout(()=>{
                    resolve();
                },1000);
            });
            return promise;
        })
        .then( ()=>{
            return match.load(gameData);
        })
        .then( ()=>{
            console.info("Test done")
        })
        .catch( (err) => {
            console.info("Failed",err);
        });
});

