
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
            area.parent().append($("<div>").addClass("game-winner-mini").text(txt));
        }

        function Listen(message) {
            var game = this;
            switch(message.type) {
                case "human-move":
                    if(message.finished)
                        NotifyWinner(message.winner);
                    else {
                        game.machineTurn({
                            level: game.config.model.levels[2],
                            threaded: true                                                
                        });
                    }
                    break;
                case "machine-move":
                    if(message.finished)
                        NotifyWinner(message.winner);
                    else
                        game.humanTurn();
                    break;
            }
        }

        $("<div>").addClass("game-area-mini-cont").append(area).appendTo($("body"));

        Jocly.createGame(gameName,area[0]).then((game) => {
            game.listen(Listen)
                .then(()=>{
                    game.humanTurn();
                });
        });

    }

})(jQuery);
