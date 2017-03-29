
var progressBar;

function NotifyWinner(winner) {
    var txt;
    switch(winner) {
        case 1:  
            txt = "Player A wins";
            break;
        case -1:  
            txt = "Player B wins";
            break;
        case 2:  
            txt = "Draw";
            break;
    }
    alert(txt);
}

function PrintMove(game,move) {
    game.getMoveString(move)
        .then((move)=>{
            console.info("=>",move);
        });
}

function Listen(message) {
    var game = this;
    switch(message.type) {
        case "human-move":
            PrintMove(game,message.move);
            if(message.finished)
                NotifyWinner(message.winner);
            else {
                game.machineTurn({
                    level: game.config.model.levels[2],
                    threaded: true                                                
                });
                progressBar.style.display = "block";
            }
            break;
        case "machine-move":
            PrintMove(game,message.move);
            progressBar.style.display = "none";
            if(message.finished)
                NotifyWinner(message.winner);
            else
                game.humanTurn();
            break;
        case "machine-progress":
            progressBar.style.width = message.progress +"%";
            break;
    }
}

window.addEventListener("DOMContentLoaded", function () {
    progressBar = document.getElementById("progress-bar");
    var match = /\?game=([^&]+)/.exec(window.location.href);
    var gameName = match && match[1] || "classic-chess";
    var elementId = "game-area1";
    var area = document.getElementById(elementId);
    Jocly.createGame(gameName,area).then((game) => {
        game.listen(Listen)
            .then(()=>{
                game.humanTurn();
            });
    });
});

