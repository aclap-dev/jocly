
/*
 * Displays winner
 */
function NotifyWinner(winner) {
    var text = "Draw";
    if(winner==Jocly.PLAYER_A)
        text = "A wins";
    else if(winner==Jocly.PLAYER_B)
        text = "B wins";
    $("#game-status").text(text);
}

/*
 * Run the game
 */
function RunMatch(match, progressBar) {
    function NextMove() {
        // whose turn is it ?
        match.getTurn()
            .then((player) => {
                // display whose turn
                $("#game-status").text(player==Jocly.PLAYER_A?"A playing":"B playing");
                var mode = $("#mode").val();
                // first make sure there is no user input or machine search in progress
                var promise = match.abortUserTurn() // just in case one is running
                    .then( () => {
                        return match.abortMachineSearch(); // just in case one is running
                    });
                if((player==Jocly.PLAYER_A && (mode=="self-self" || mode=="self-comp")) ||
                    (player==Jocly.PLAYER_B && (mode=="self-self" || mode=="comp-self")))
                        // user to play
                        promise = promise.then( () => {
                            // reques user input
                            return match.userTurn()
                        })
                    else {
                        // machine to play
                        if(progressBar) {
                            progressBar.style.display = "block";
                            progressBar.style.width = 0;
                        }
                        promise = promise.then( () => {
                                return match.getConfig();
                            })
                            .then( (config) => {
                                // get machine level
                                var which = player==Jocly.PLAYER_A ? "a" : "b";
                                var levelIndex = $("#select-level-"+which).val();
                                var level = {
                                    maxDepth: -1, // kind of random
                                }
                                if(levelIndex>=0)
                                    level = config.model.levels[levelIndex];
                                // start machine search
                                return match.machineSearch({
                                    level: level,
                                    progress: (progress) => {
                                        if (progressBar)
                                            progressBar.style.width = progress + "%";
                                    }
                                })
                            })
                            .then((result) => {
                                // at this point we know the machine move but it has not been played yet
                                // let's play that move
                                return match.playMove(result.move);
                            });
                    }

                promise.then(() => {
                        // is game over ?
                        return match.getFinished()
                    })
                    .then((result) => {
                        if (result.finished)
                            NotifyWinner(result.winner);
                        else
                            NextMove();
                        })
                    .catch((e)=>{
                        console.warn("Turn aborted:",e);
                    })
                    .then(() => {
                        if (progressBar)
                            progressBar.style.display = "none";
                    });
            })
    }
    match.getFinished()
        .then( (result) => {
            // make sure the game is not finished to request next move
            if(!result.finished)
                NextMove();
        });
}

$(document).ready(function () {
    var progressBar = document.getElementById("progress-bar");
    var m = /\?game=([^&]+)/.exec(window.location.href);
    var gameName = m && m[1] || "classic-chess";
    var elementId = "applet";
    var area = document.getElementById(elementId);

    Jocly.createMatch(gameName).then((match) => {
        // get game configuration to setup control UI
        match.getConfig()
            .then( (config) => {
                $("#game-title").show().text(config.model["title-en"]);
                $("#close-games span").show();
                $("#game-status").show();

                var viewOptions = config.view;
                // fills Skins dropdown with available skins
                viewOptions.skins.forEach(function(skin) {
                    $("<option/>").attr("value",skin.name).text(skin.title).appendTo($("#options-skin"));
                });
                $("#options").show();
                // get options for the game view
                match.getViewOptions()
                    .then( (options) => {
                        $("#options-skin").show().val(options.skin);
                        if(options.sounds!==undefined)
                            $("#options-sounds").show().children("input").prop("checked",options.sounds);
                        $("#options-notation").hide();
                        if(options.notation!==undefined)
                            $("#options-notation").show().children("input").prop("checked",options.notation);
                        $("#options-moves").hide();
                        if(options.showMoves!==undefined)
                            $("#options-moves").show().children("input").prop("checked",options.showMoves);
                        $("#options-autocomplete").hide();
                        if(options.autocomplete!==undefined)
                            $("#options-autocomplete").show().children("input").prop("checked",options.autocomplete);

                        $("#view-options").on("change",function() {
                            var opts={};
                            if($("#options-skin").is(":visible")) 
                                opts.skin=$("#options-skin").val();
                            if($("#options-notation").is(":visible"))
                                opts.notation=$("#options-notation-input").prop("checked");
                            if($("#options-moves").is(":visible"))
                                opts.showMoves=$("#options-moves-input").prop("checked");
                            if($("#options-autocomplete").is(":visible"))
                                opts.autoComplete=$("#options-autocomplete-input").prop("checked");
                            if($("#options-sounds").is(":visible"))
                                opts.sounds=$("#options-sounds-input").prop("checked");
                            // changed options, tell Jocly about it
                            match.setViewOptions(opts)
                                .then( () => {
                                    RunMatch(match,progressBar);                                
                                })
                        });

                        $("#anaglyph-input").on("change",function() {
                            if($(this).is(":checked"))
                                match.viewControl("enterAnaglyph");
                            else
                                match.viewControl("exitAnaglyph");
                        });

                        // the match need to be attached to a DOM element for displaying the board
                        match.attachElement(area)
                            .then( () => {
                                RunMatch(match,progressBar);
                            });

                    });

                if(config.view.switchable)
                    $("#view-as").show().on("change",()=>{
                        var playerMode = $("#view-as").val();
                        var player;
                        if(playerMode=="player-a")
                            player = Jocly.PLAYER_A;
                        else if(playerMode=="player-b")
                            player = Jocly.PLAYER_B;
                        if(player)
                            match.viewAs(player)
                                .then( () => {
                                    RunMatch(match,progressBar);                                
                                });
                    });

                // configure computer levels
                ["a","b"].forEach( (which) => {
                    $("#level-"+which).hide();
                    $("<option/>").attr("value","-1").text("Random").appendTo($("#select-level-"+which));
                    config.model.levels.forEach( (level, index) => {
                        $("<option/>").attr("value",index).text(level.label).appendTo($("#select-level-"+which));
                    });
                    $("#select-level-"+which).val(0);
                });

                // dropdown to change the players (user/machine)
                $("#mode-panel").on("change", () => {
                    switch($("#mode").val()) {
                        case "self-self": $("#level-a,#level-b").hide(); break;
                        case "comp-comp": $("#level-a,#level-b").show(); break;
                        case "self-comp": $("#level-a").hide(); $("#level-b").show(); break;
                        case "comp-self": $("#level-b").hide(); $("#level-a").show(); break;
                    }
                    RunMatch(match,progressBar);
                });
                $("#mode").val("self-comp").trigger("change");

                $("#restart").on("click",function() {
                    // restart match from the beginning
                    match.rollback(0)
                        .then( () => {
                            RunMatch(match,progressBar);
                        });
                });

                $("#takeback").on("click",function() {
                    match.getPlayedMoves()
                        .then( (playedMoves) => {
                            // we want to go back to the last user move
                            var mode = $("#mode").val();
                            var lastUserMove = -1;
                            if( 
                                ((playedMoves.length % 2 == 1) && (mode=="self-self" || mode=="self-comp")) ||
                                ((playedMoves.length % 2 == 0) && (mode=="self-self" || mode=="comp-self"))
                                )
                                    lastUserMove = playedMoves.length - 1;
                            else if( 
                                ((playedMoves.length % 2 == 1) && (mode=="self-self" || mode=="comp-self")) ||
                                ((playedMoves.length % 2 == 0) && (mode=="self-self" || mode=="self-comp"))
                                )
                                    lastUserMove = playedMoves.length - 2;
                            if(lastUserMove>=0)
                                match.rollback(lastUserMove)
                                    .then( () => {
                                        RunMatch(match,progressBar);
                                    });
                            
                        });
                });

                // yeah, using the fullscreen API is not as easy as it should be
                var requestFullscreen = area.requestFullscreen || area.webkitRequestFullscreen || 
                    area.webkitRequestFullScreen || area.mozRequestFullScreen;
                if(requestFullscreen) {
                    $(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange",()=>{
                        var isFullscreen = document.webkitFullscreenElement || document.webkitFullScreenElement || 
                            document.mozFullScreenElement || document.fullscreenElement;
                        if(isFullscreen)
                            area.style.display = "block";
                        else
                            area.style.display = "table-cell";
                    });
                    $("#fullscreen").show().on("click",function() {
                        requestFullscreen.call(area);
                    });
                }

                $("#links").on("click",()=>{
                    $("#controls").hide();
                    $("#games").show();
                });

                $("#close-games span").on("click",()=>{
                    $("#controls").show();
                    $("#games").hide();
                });

                // list all available games
                Jocly.listGames()
                    .then( (games)=>{
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
                                    var url0 = window.location;
                                    var url = url0.origin + url0.pathname + "?game=" + gameName;
                                    window.location = url;
                                }).appendTo($("#game-list"));
                        }
                    });

                $("#mode-panel").show();
            });
    });
});

