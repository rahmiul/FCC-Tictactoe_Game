var MYAPP = {
    gameInPlay: false,
    winCombo: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]
    ],
    timeOuts: [],
    playerScore: 0,
    computerScore: 0,
    initialVal: function () {
        this.gameBoard = {
            1: "",
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "",
            8: "",
            9: ""
        };
        this.numFilledIn = 0;
    },
    drawBoard: function () {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.moveTo(100, 0);
        ctx.lineTo(100, 300);
        ctx.stroke();
        ctx.moveTo(200, 0);
        ctx.lineTo(200, 300);
        ctx.stroke();
        ctx.moveTo(0, 100);
        ctx.lineTo(300, 100);
        ctx.stroke();
        ctx.moveTo(0, 50);
        ctx.lineTo(300, 50);
        ctx.stroke();
        $("#canvas").fadeIn(600);
    },

    initialGame: function (className) {
        MYAPP.initialVal();
        MYAPP.gameInPlay = true;
        MYAPP.turn = MYAPP.game.whoTurn();
        MYAPP.playerSymbol = $("." + className).text();
        MYAPP.computerSymbol = MYAPP.playerSymbol === "X" ? "O" : "X";
        MYAPP.display.hideContainer();
        MYAPP.drawBoard();
        MYAPP.display.showBoard();
        MYAPP.display.whoTurn(MYAPP.turn);
        MYAPP.display.showScores();
        MYAPP.display.showResetButton();
        if (MYAPP.turn === 1) {
            $("li").click(function () {
                MYAPP.playerPlay($(this).attr("class"));
            });
        } else {
            MYAPP.computerPlay();
        }
    },
    reset: function () {
        MYAPP.initialVal();
        MYAPP.gameInPlay = false;
        MYAPP.display.hideWhoTurn(); //create new function
        MYAPP.display.showContainer();
        MYAPP.display.hideBoard();
        MYAPP.display.hideResetButton();
        MYAPP.display.hideScores(); //create new function
        MYAPP.playerScore = 0;
        MYAPP.computerScore = 0;
        MYAPP.game.resetScore();
        for (i = 1; i <= 9; i++) {
            $(".k" + i).text("");
        };
        clearTimeout(MYAPP.timeOuts);
        $(".inner-container, .gameBoard").css("opacity", "1");
    },
    minimax: function (board, option) {
        var huPlayer = MYAPP.playerSymbol;
        var comPlayer = MYAPP.computerSymbol;
        var playerSymbol = option[0] === 1 ? huPlayer : comPlayer;
        var winning = function (board, playerSymbol) {
            return MYAPP.winCombo.some(function (combination) {
                var win = true;
                for (i = 0; i < combination.length; i++) {
                    if (board[combination[i] - 1] !== playerSymbol) {
                        win = false;
                    }
                }
                return win;
            });
        };

        var availableSpot = function (board) {
            var spot = [];
            for (var i = 0; i < board.length; i++) {
                if (board[i] !== huPlayer && board[i] !== comPlayer) {
                    spot.push(board[i]);
                }
            }
            return spot;
        };

        var availableArray = availableSpot(board);
        var newDepth = option[1] + 1;

        if (winning(board, huPlayer)) {
            return {
                score: option[1] - 10
            };
        } else if (winning(board, comPlayer)) {
            return {
                score: 10 - option[1]
            };
        } else if (availableArray.length === 0) {
            return {
                score: 0
            };
        }

        var moves = [];
        for (var i = 0; i < availableArray.length; i++) {
            var move = {};
            move.index = availableArray[i];
            board[availableArray[i] - 1] = playerSymbol;
            if (playerSymbol === huPlayer) {
                var result = MYAPP.minimax(board, [2, newDepth]);
                move.score = result.score;
            } else {
                var result = MYAPP.minimax(board, [1, newDepth]);
                move.score = result.score;
            }
            board[availableArray[i] - 1] = move.index;
            moves.push(move);
        }

        var bestMove;
        if (option[0] === 2) {
            var bestScore = -1000;
            for (i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            var bestScore = 1000;
            for (i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    },

    //score() is yield between score and depth
    //var availableSpot =

    //return win or not?
    //var depth(increase evtime you go to minimax)
    //var all move (score and position)[] move pool of loop
    //loop!! for every position in available spot
    //minimax()
    //{score and position}
    //choose the best loop
    //if computerplay choose the best score is highest score(10-depth) makin kecil depth makin bagus
    //if playerplay choose the best score is the lowest score()

    playerPlay: function (boardClass) {
        if (MYAPP.gameInPlay === true && MYAPP.turn === 1 && $("." + boardClass).text() === "") {
            $("." + boardClass).text(MYAPP.playerSymbol);
            MYAPP.numFilledIn += 1;
            MYAPP.game.updateBoard(boardClass, MYAPP.playerSymbol);
            var areYouWin = MYAPP.game.checkWin(MYAPP.playerSymbol, MYAPP.gameBoard);
            if (areYouWin[0] === true) {
                MYAPP.timeOuts.push(setTimeout(function () {
                    MYAPP.display.showWinCombination(areYouWin[1])
                }, 2000));
                MYAPP.timeOuts.push(setTimeout(function () {
                    MYAPP.display.hideWinCombination(areYouWin[1])
                }, 4000));
                MYAPP.display.showWinMessage(MYAPP.turn);
                MYAPP.display.hideWinMessage(MYAPP.turn);
                MYAPP.game.updateScore(MYAPP.turn);
                MYAPP.timeOuts.push(setTimeout(function () {
                    MYAPP.game.reset()
                }, 4500));
            } else if (MYAPP.numFilledIn >= 9) {
                MYAPP.display.showDrawMessage();
                MYAPP.display.hideDrawMessage();
                MYAPP.timeOuts.push(setTimeout(function () {
                    MYAPP.game.reset()
                }, 4500));
            } else {
                MYAPP.turn = 2;
                MYAPP.display.whoTurn(MYAPP.turn);
                MYAPP.computerPlay();
            }
        }
    },

    computerPlay: function () {
        var boardArray = MYAPP.game.boardArray(MYAPP.gameBoard);
        var move = MYAPP.minimax(boardArray, [2, 0]);
        var boardClass = "k" + move.index;
        MYAPP.game.updateBoard(boardClass, MYAPP.computerSymbol); //update object board
        MYAPP.numFilledIn += 1;
        MYAPP.timeOuts.push(setTimeout(function () {
            $(".k" + move.index).text(MYAPP.computerSymbol);
        }, 1500));
        var areYouWin = MYAPP.game.checkWin(MYAPP.computerSymbol, MYAPP.gameBoard);
        if (areYouWin[0] === true) {
            MYAPP.timeOuts.push(setTimeout(function () {
                MYAPP.display.showWinCombination(areYouWin[1])
            }, 2000));
            MYAPP.timeOuts.push(setTimeout(function () {
                MYAPP.display.hideWinCombination(areYouWin[1])
            }, 4000));
            MYAPP.display.showWinMessage(MYAPP.turn);
            MYAPP.display.hideWinMessage(MYAPP.turn);
            MYAPP.game.updateScore(MYAPP.turn);
            MYAPP.timeOuts.push(setTimeout(function () {
                MYAPP.game.reset()
            }, 4500));
        } else if (MYAPP.numFilledIn >= 9) {
            MYAPP.display.showDrawMessage();
            MYAPP.display.hideDrawMessage();
            MYAPP.timeOuts.push(setTimeout(function () {
                MYAPP.game.reset()
            }, 4500));
        } else {
            MYAPP.turn = 1;
            MYAPP.display.whoTurn(MYAPP.turn);
            $("li").click(function () {
                MYAPP.playerPlay($(this).attr("class"));
            });
        }
    },

    game: {
        whoTurn: function () {
            return Math.round(Math.random() * 2);
        },

        updateBoard: function (className, symbol) {
            var numberPattern = /\d+/g;
            var boardNum = className.match(numberPattern);
            MYAPP.gameBoard[boardNum] = symbol;
        },

        checkWin: function (symbol, board) {
            var gameBoard = MYAPP.gameBoard;
            var winCombos = MYAPP.winCombo;
            var winResult = [];
            var winner = winCombos.some(function (combination) {
                var winning = true;
                for (var i = 0; i < combination.length; i++) {
                    if (gameBoard[combination[i]] !== symbol) {
                        winning = false;
                    }
                }
                if (winning === true) {
                    winResult = combination;
                }
                return winning;
            });
            return [winner, winResult];
        },

        reset: function () {
            MYAPP.initialVal();
            for (i = 1; i <= 9; i++) {
                $(".k" + i).text("");
            }
            MYAPP.turn = MYAPP.game.whoTurn();
            MYAPP.display.whoTurn(MYAPP.turn);
            if (MYAPP.turn === 1) {
                $("li").click(function () {
                    MYAPP.playerPlay($(this).attr("class"));
                });
            } else {
                MYAPP.computerPlay();
            }
        },

        updateScore: function (turn) {
            MYAPP.timeOuts.push(
                setTimeout(function () {
                    if (MYAPP.turn === 1) {
                        MYAPP.playerScore += 1;
                        $('.points1').text(MYAPP.playerScore);
                    } else {
                        MYAPP.computerScore += 1;
                        $('.points2').text(MYAPP.computerScore);
                    }
                }, 2000));
        },

        boardArray: function (board) {
            var spot = [];
            for (i = 1; i < 10; i++) {
                if (board[i] !== "") {
                    spot.push(board[i]);
                } else {
                    spot.push(i);
                }
            }
            return spot;
        },
        resetScore: function () {
            $(".points1, .points2").text('0')
        }
    },

    display: {
        showBoard: function () {
            MYAPP.timeOuts.push(
                setTimeout(function () {
                    $(".gameBoard").fadeIn(1000);
                }, 500)
            );
        },

        hideBoard: function () {
            MYAPP.timeOuts.push(
                setTimeout(function () {
                    $(".gameBoard").fadeOut(1000);
                }, 500)
            );
        },

        showContainer: function () {
            MYAPP.timeOuts.push(
                setTimeout(function () {
                    $(".inner-container").fadeIn(1000);
                }, 1500)
            );
        },

        hideContainer: function () {
            MYAPP.timeOuts.push(
                setTimeout(function () {
                    $(".inner-container").fadeOut(1000);
                }, 500)
            );
        },

        showResetButton: function () {
            MYAPP.timeOuts.push(
                setTimeout(function () {
                    $(".reset").fadeIn(1000);
                }, 1500)
            );
        },

        hideResetButton: function () {
            MYAPP.timeOuts.push(
                setTimeout(function () {
                    $(".reset").fadeOut(1000);
                }, 500)
            );
        },

        showScores: function () {
            MYAPP.timeOuts.push(
                setTimeout(function () {
                    $(".scores").fadeIn(500);
                }, 500)
            );
        },
        hideScores: function () {
            $(".scores").fadeOut(500);
        },

        whoTurn: function (turn) {
            MYAPP.timeOuts.push(
                setTimeout(function () {
                    if (turn === 1) {
                        $(".userTurn").animate({
                                top: "-40px"
                            },
                            1000
                        );
                        $(".computerTurn").animate({
                                top: "0px"
                            },
                            1000
                        );
                    } else {
                        $(".computerTurn").animate({
                                top: "-40px"
                            },
                            1000
                        );
                        $(".userTurn").animate({
                                top: "0px"
                            },
                            1000
                        );
                    }
                }, 1000)
            );
        },
        hideWhoTurn: function () {
            $(".userTurn").animate({
                top: "0px"
            }, 0);
            $(".computerTurn").animate({
                top: "0px"
            }, 0);
        },

        showWinMessage: function (player) {
            if (player === 1) {
                MYAPP.timeOuts.push(
                    setTimeout(function () {
                        $(".inner-container, .gameBoard").css("opacity", "0.4");
                        $(".win-message").fadeIn(1000)
                    }, 3000));
            } else {
                MYAPP.timeOuts.push(
                    setTimeout(function () {
                        $(".inner-container, .gameBoard").css("opacity", "0.4");
                        $(".lose-message").fadeIn(1000)
                    }, 3000));
            }
        },

        hideWinMessage: function (player) {
            if (player === 1) {
                MYAPP.timeOuts.push(setTimeout(function () {
                    $(".inner-container, .gameBoard").css("opacity", "1");
                    $(".win-message").fadeOut(1000)
                }, 4500));
            } else {
                MYAPP.timeOuts.push(setTimeout(function () {
                    $(".lose-message").fadeOut(1000)
                }, 4500));
                MYAPP.timeOuts.push(setTimeout(function () {
                    $(".inner-container, .gameBoard").css("opacity", "1");
                }, 5500));
            }
        },

        showDrawMessage: function () {
            MYAPP.timeOuts.push(setTimeout(function () {
                $(".inner-container, .gameBoard").css("opacity", "0.4");
                $(".draw-message").fadeIn(1000)
            }, 500));
        },

        hideDrawMessage: function () {
            MYAPP.timeOuts.push(setTimeout(function () {
                $(".draw-message").fadeOut(1000)
            }, 4500));
            MYAPP.timeOuts.push(setTimeout(function () {
                $(".inner-container, .gameBoard").css("opacity", "1");
            }, 5500));
        },

        showWinCombination: function (combination) {

            var combination0 = 'k' + combination[0];
            var combination1 = 'k' + combination[1];
            var combination2 = 'k' + combination[2];
            console.log(combination0);
            $("." + combination0).css(
                "background-color",
                "black"
            );
            $("." + combination1).css(
                "background-color",
                "black"
            );
            $("." + combination2).css(
                "background-color",
                "black"
            )
        },

        hideWinCombination: function (combination) {
            var combination0 = 'k' + combination[0];
            var combination1 = 'k' + combination[1];
            var combination2 = 'k' + combination[2];
            console.log(combination1);
            $("." + combination0).css(
                "background-color",
                "rgba(0,0,0,0)",
            );
            $("." + combination1).css(
                "background-color",
                "rgba(0,0,0,0)"
            );
            $("." + combination2).css(
                "background-color",
                "rgba(0,0,0,0)"
            );
        }, //MYAPP.display.hideWinCombination
    } //MYAPP.display
} //MYAPP

$(document).ready(function () {
    console.log("documentready");
    $(".reset").click(function () {
        MYAPP.reset();
    });
    $(".xbutton").click(function () {
        var className = $(this).attr("class");
        MYAPP.initialGame(className);
    });
    $(".obutton").click(function () {
        var className = $(this).attr("class");
        MYAPP.initialGame(className);
    });
});