
function NotifyWinner(winner) {
    var txt = "?";
    if(winner==Jocly.PLAYER_A)
        txt = "Player A wins";
    else if(winner==Jocly.PLAYER_B)
        txt = "Player B wins";
    else if(winner==Jocly.DRAW)
        txt = "Draw";
    alert(txt);
}

function RunMatch(match, progressBar) {
    function NextMove() {
        match.getTurn()
            .then( (player) => {
                var promise;
                if(player==Jocly.PLAYER_A) 
                    promise = match.userTurn();
                else {
                    if(progressBar) {
                        progressBar.style.display = "block";
                        progressBar.style.width = 0;
                    }
                    promise = match.machineSearch({
                                progress: (progress) => {
                                    if(progressBar)
                                        progressBar.style.width = progress +"%";
                                }
                            })
                        .then( (result) => {
                            return match.playMove(result.move);
                        })
                        .then( () => {
                            if(progressBar)
                                progressBar.style.display = "none";            
                        });
                }
                promise.then( () => {
                        return match.getFinished()
                    })
                    .then( (result) => {
                        if(result.finished)
                            NotifyWinner(result.winner);
                        else
                            NextMove();
                    });
            })
    }
    NextMove();
}

window.addEventListener("DOMContentLoaded", function () {
    progressBar = document.getElementById("progress-bar");
    var m = /\?game=([^&]+)/.exec(window.location.href);
    var gameName = m && m[1] || "classic-chess";
    var elementId = "game-area1";
    var area = document.getElementById(elementId);
    Jocly.createMatch(gameName).then((match) => {
        match.attachElement(area)
            .then( () => {
                RunMatch(match,progressBar);
            });
    });
});

