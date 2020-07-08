//Game start
var ready = 1;
var row = 12;
var col = 12;
var move = 2;
var player = 'X';
var com = 'O';
var gameType = 0;
var table = document.getElementById('chessBoard');

//Khởi tạo mảng lưu giá trị
var board = new Array();
var stack = [];
for (var i = 1; i <= row; i++) {
    board[i] = new Array();
    for (var j = 1; j <= col; j++) {
        board[i][j] = 'E';
    }
}

//Các giá trị có thể đi
var possible = new Array();
for (var i = 1; i <= row; i++) {
    possible[i] = new Array();
    for (var j = 1; j <= col; j++) {
        possible[i][j] = false;
    }
}

//Vẽ bàn cờ
for (var i = 1; i <= row; i++) {
    table.innerHTML = table.innerHTML + `<div class="row row${i}"></div>`
    for (var j = 1; j <= col; j++) {
        var curRow = document.querySelector(`.row${i}`);
        curRow.innerHTML = curRow.innerHTML + `<div class="box _${i}${j}" data-row="${i}" data-col="${j}"></div>`;
    }
}

//1 Người
document.querySelector('#onePlayer').addEventListener('click', mainOnePlayer)
//2 Người
document.querySelector('#twoPlayer').addEventListener('click', mainTwoPlayer)

//Undo
// document.querySelector('#undo').addEventListener('click', function () {
//     if (ready == 1) {
//         undo();
//         setTimeout(() => { undo() }, 200)
//     }
// })
// document.querySelector('#reset').addEventListener('click', reset)

$('#undo').click( function () {
    if (ready == 1) {
        undo();
        setTimeout(() => { undo() }, 200)
    }
})
$('#reset').click(reset)

function undo() {
    var outBoard = stack.pop();
    if (outBoard) {
        board[outBoard.r][outBoard.c] = 'E';
        if ($(`._${outBoard.r}${outBoard.c}`).html() == player) {
            $(`._${outBoard.r}${outBoard.c}`).removeClass('green');
        }
        if ($(`._${outBoard.r}${outBoard.c}`).html() == com) {
            $(`._${outBoard.r}${outBoard.c}`).removeClass('blue');
        }
        $(`._${outBoard.r}${outBoard.c}`).html('');
    }
}


// function undo() {
//     var outBoard = stack.pop();
//     if (outBoard) {
//         board[outBoard.r][outBoard.c] = 'E';
//         if (document.querySelector(`._${outBoard.r}${outBoard.c}`).innerHTML == player) {
//             document.querySelector(`._${outBoard.r}${outBoard.c}`).classList.remove('green')
//             // $(`._${outBoard.r}${outBoard.c}`).removeClass('green');
//         }
//         if (document.querySelector(`._${outBoard.r}${outBoard.c}`).innerHTML == com) {
//             document.querySelector(`._${outBoard.r}${outBoard.c}`).classList.remove('blue');
//         }
//         document.querySelector(`._${outBoard.r}${outBoard.c}`).innerHTML = '';
//     }
// }

function reset() {
    ready = 1;
    move = 1;
    stack = [];
    for (var i = 1; i <= row; i++) {
        for (var j = 1; j <= col; j++) {
            possible[i][j] = false;
            board[i][j] = 'E';
            if ($(`._${i}${j}`).html() == player) {
                $(`._${i}${j}`).removeClass('green');
            }
            if ($(`._${i}${j}`).html() == com) {
                $(`._${i}${j}`).removeClass('blue');
            }
            $(`._${i}${j}`).html('')
        }
    }
}

function checkBoardEmpty(board) {
    for (var i = 1; i <= row; i++) {
        for (var j = 1; j <= col; j++) {
            if (board[i][j] !== 'E') {
                return false;
            }
        }
    }
    return true;
}

function checkTie(board) {
    for (var i = 1; i <= row; i++) {
        for (var j = 1; j <= col; j++) {
            if (board[i][j] == 'E') {
                return false;
            }
        }
    }
    return true;
}

function checkWin(board) {
    var valueStr = getValueString(board);
    if (/XXXXX/.test(valueStr)) {
        return player;
    }
    if (/OOOOO/.test(valueStr)) {
        return com
    }
};

function getValueString(board) {
    var valStr = '';
    //Nối các dòng
    for (var i = 1; i <= row; i++) {
        valStr += 'S' + board[i].join('') + 'br';
    }

    //Nối các cột
    for (var j = 1; j <= col; j++) {
        valStr += 'S';
        for (var i = 1; i <= row; i++) {
            valStr += board[i][j];

        }
        valStr += 'br';
    }

    //Nối chéo trên phải
    for (var k = 1; k <= col; k++) {
        valStr += 'S';
        i = 1; j = k;
        while (i <= row && j <= col) {
            valStr += board[i][j];
            i++; j++;
        }
        valStr += 'br';
    }

    //Nối chéo trên trái
    for (var k = 1; k <= col; k++) {
        valStr += 'S';
        i = 1; j = k;
        while (i <= row && j >= 1) {
            valStr += board[i][j];
            i++; j--;
        }
        valStr += 'br';
    }


    //Nối chéo dưới phải
    for (var k = 1; k <= col; k++) {
        valStr += 'S';
        i = row; j = k;
        while (i >= 1 && j <= col) {
            valStr += board[i][j];
            i--; j++;
        }
        valStr += 'br';
    }

    //Nối chéo dưới trái
    for (var k = 1; k <= col; k++) {
        valStr += 'S';
        i = row; j = k;
        while (i >= 1 && j >= 1) {
            valStr += board[i][j];
            i--; j--;
        }
        valStr += 'br';
    }
    return valStr
}

function mainOnePlayer() {
    function firstMove() {
        reset();
        var alertFirstMove = confirm("Bạn có muốn đi trước không?");
        if (alertFirstMove == true) {
            move = 1;
        } else {
            move = 2;
            comMove();
        }
    }
    firstMove()
    $('.box').unbind().click(playerMove);
    function playerMove() {
        if ($(this).html() !== '' || ready == 0) {
            return false;
        }
        var currentRow = parseInt(this.dataset.row);
        var currentCol = parseInt(this.dataset.col);
        stack.push({ r: currentRow, c: currentCol })
        if (move % 2 !== 0) {
            $(this).html(player);
            $(this).addClass('green');
            board[currentRow][currentCol] = player;
            move++;
        }
        else {
            $(this).html(com);
            $(this).addClass('blue');
            board[currentRow][currentCol] = com;
            move++;
        }

        if (findMove(board)) {
            var move = findMove(board);
            board[move.r][move.c] = com;
            $(`._${move.r}${move.c}`).html(com);
            $(`._${move.r}${move.c}`).addClass('blue');
            stack.push({ r: move.r, c: move.c })
            move++;
        }

        // checkWin
        var winner = checkWin(board);
        if (winner) {
            if (winner == player) {
                setTimeout(() => {
                    alert(player + ' win!!!');
                }, 1);
            }
            if (winner == com) {
                setTimeout(() => {
                    alert(com + ' win!!!');
                }, 1);
            }
            ready = 0;
        }

        if (checkTie(board) && winner == undefined) {
            setTimeout(() => {
                alert('Game Tie!!!');
            }, 1);
        }
    }

    function comMove() {
        var move = findMove(board);
        board[move.r][move.c] = com;
        document.querySelector(`._${move.r}${move.c}`).innerHTML = com;
        document.querySelector(`._${move.r}${move.c}`).classList.add('blue');
        stack.push({ r: move.r, c: move.c })
        move++;
    }

    function minimax(board, depth, isPlayer, alpha, beta) {
        var movePointer = 1;
        var noOfMove = 0;
        for (var i = 1; i <= row; i++) {
            for (var j = 1; j <= col; j++) {
                if (possible[i][j]) {
                    noOfMove++;
                }
            }
        }
        var winner = checkWin(board);
        if (winner === com) {
            return 999999999;
        }
        if (winner === player) {
            return -999999999;
        }
        if (depth === 1) {
            return movePoint(board)
        }
        if (checkTie(board) === true) {
            return 0;
        }
        if (isPlayer === com) {
            var maxValue = -Infinity;
            for (var i = 1; i <= row; i++) {
                for (var j = 1; j <= col; j++) {
                    if (board[i][j] === 'E' && possible[i][j]) {
                        board[i][j] = com;
                        var moveValue = minimax(board, depth + 1, player, alpha, beta);
                        board[i][j] = 'E';
                        if (moveValue > maxValue) {
                            maxValue = moveValue;
                        }
                        if (alpha < maxValue) {
                            alpha = maxValue;
                        }
                        if (beta <= alpha) {
                            return alpha;
                        }
                    }
                }
            }
            return alpha;
        }
        if (isPlayer === player) {
            var minValue = Infinity;
            for (var i = 1; i <= row; i++) {
                for (var j = 1; j <= col; j++) {
                    if (board[i][j] === 'E' && possible[i][j]) {
                        board[i][j] = player;
                        var moveValue = minimax(board, depth + 1, com, alpha, beta);
                        board[i][j] = 'E';
                        if (moveValue < minValue) {
                            minValue = moveValue;
                        }
                        if (beta > minValue) {
                            beta = minValue;
                        }
                        if (beta <= alpha) {
                            return beta;
                        }
                    }
                }
            }
            return beta;
        }
    }

    function findMove(board) {
        for (var i = 1; i <= row; i++) {
            for (var j = 1; j <= row; j++) {
                if (board[i][j] === 'E' && !possible[i][j]) {
                    for (var stepI = -1; stepI <= 1; stepI++) {
                        for (var stepJ = -1; stepJ <= 1; stepJ++) {
                            if (i + stepI >= 1 && i + stepI <= row && j + stepJ >= 1 && j + stepJ <= col) {
                                // console.log(board[i + stepI][j + stepJ]);
                                if (board[i + stepI][j + stepJ] !== 'E') {
                                    possible[i][j] = true;
                                }
                            }
                        }
                    }
                }
            }
        };

        if (checkTie(board) || checkWin(board)) {
            return false;
        }
        if (checkBoardEmpty(board)) {
            var r = Math.round(Math.random() * (row - 1)) + 1;
            var c = Math.round(Math.random() * (col - 1)) + 1;
            return { r: r, c: c };
        }
        var max = -Infinity;
        var move = { r: 0, c: 0, v: 0 };
        for (var i = 1; i <= row; i++) {
            for (var j = 1; j <= col; j++) {
                if (board[i][j] == 'E' && possible[i][j]) {
                    board[i][j] = com;
                    var moveValue = minimax(board, 0, player, -Infinity, Infinity);
                    board[i][j] = 'E';
                    if (moveValue > max) {
                        move = { r: i, c: j, v: moveValue };
                        max = moveValue;
                    }
                }
            }
        }
        return move;
    }

    function movePoint(board) {
        var pointCom = 0;
        var pointPlayer = 0;
        function moveCount(isPlayer) {
            var str = getValueString(board);
            var count = 0;
            var value = 0;
            // var regexp1 = (isPlayer == player) ? /[^X]X[XE]+[ES]/g : /[^O]O[OE]+[ES]/g;
            // var regexp2 = (isPlayer == player) ? /[ES]X[XE]+[^X]/g : /[ES]O[OE]+[^O]/g;
            // var	regexp3 = (isPlayer == player) ? /X/g : /O/g;
            var regexp1 = (isPlayer == player) ? /[^X][EX][EX][EX][EX][EX]E/g : /[^O][EO][EO][EO][EO][EO]E/g;
            var regexp2 = (isPlayer == player) ? /E[EX][EX][EX][EX][EX][^X]/g : /E[EO][EO][EO][EO][EO][^O]/g;
            var regexp3 = (isPlayer == player) ? /X/g : /O/g;
            var arrStr = str.match(regexp1).concat(str.match(regexp2));
            for (x of arrStr) {
                count = (x.match(regexp3) || []).length; //number of XO;
                // console.log(`mArray[x].match(regexp3) = ${mArray[x].match(regexp3)}    `);
                switch (count) {
                    case 5: value += 100000000; break;
                    case 4: value += 100000; break;
                    case 3: value += 1000; break;
                    case 2: value += 1; break;
                }
            }
            return value;
        }
        pointCom = moveCount(com);
        pointPlayer = moveCount(player)
        return pointCom - pointPlayer;
    }
}

function mainTwoPlayer() {
    reset();
    $('.box').unbind().click(playerMove);
    function playerMove() {
        if ($(this).html() !== '' || ready == 0) {
            return false;
        }
        var currentRow = parseInt(this.dataset.row);
        var currentCol = parseInt(this.dataset.col);
        stack.push({ r: currentRow, c: currentCol })
        if (move % 2 !== 0) {
            $(this).html(player);
            $(this).addClass('green');
            board[currentRow][currentCol] = player;
            move++;
        }
        else {
            $(this).html(com);
            $(this).addClass('blue');
            board[currentRow][currentCol] = com;
            move++;
        }

        // checkWin
        var winner = checkWin(board);
        if (winner) {
            if (winner == player) {
                setTimeout(() => {
                    alert(player + ' win!!!');
                }, 1);
            }
            if (winner == com) {
                setTimeout(() => {
                    alert(com + ' win!!!');
                }, 1);
            }
            ready = 0;
        }

        if (checkTie(board) && winner == undefined) {
            setTimeout(() => {
                alert('Game Tie!!!');
            }, 1);
        }
    }
}