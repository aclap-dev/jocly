
(function($) {

    $(document).ready(()=>{

        Jocly.listGames().then((games)=>{

            for(let gameName in games) {
                var game = games[gameName];

                $("<div>")
                    .addClass("game-descr")
                    .css({
                        backgroundImage: "url('"+game.thumbnail+"')"
                    })
                    .append($("<div>").addClass("game-descr-name").text(game.title))
                    .append($("<div>").addClass("game-descr-summary").text(game.summary))
                    .bind("click",()=>{
                        StartGame(gameName);
                    }).appendTo($("#game-list"));
            }

        });

    });

    function StartGame(gameName) {
        var area = $("<div>").addClass("game-area-mini");
        $("<div>").addClass("game-area-mini-cont").append(area).appendTo($("body"));

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

        Jocly.createMatch(gameName).then((match) => {
            match.attachElement(area[0])
                .then( () => {
                    RunMatch(match);
                });
        });

    }

})(jQuery);
