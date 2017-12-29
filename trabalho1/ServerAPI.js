/**
 * Sends a Request to the prolog Server and returns a reply from it
 * @param {*} requestString 
 * @param {*} onSuccess 
 * @param {*} onError 
 * @param {*} port 
 */
function getPrologRequest(requestString, onSuccess, onError, port) {
    var requestPort = port || 8081;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

    request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
    request.onerror = onError || function () { console.log("Error waiting for response"); };
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
    return request;
}

//Handle the Reply
/**
 * Prints on the console the reply from the request
 */
function handleReply(data) {
    console.log(data.target.response);
}

/**
 * Send a Human Play to the prolog server
 * @param {*} player 
 * @param {*} playor 
 * @param {*} playds 
 */
function makePlay(player, playor, playds) {
    let play = '[' + playor[0].toLowerCase() + ',' + playor[1] + ',' + playds[0].toLowerCase() + ',' + playds[1] + ']';
    // Get Parameter Values
    var requestString = "[1," + String(player) + "," + String(play) + "]";

    // Make Request
    return getPrologRequest(requestString, handleReply);
}

/**
 * Requests the prolog server to make an AI play, returns the play made
 * @param {*} player 
 * @param {*} difficulty 
 */
function makeAIPlay(player, difficulty) {
    // Get Parameter Values
    var requestString = "[2," + String(player) + "," + String(difficulty) + "]";

    // Make Request
    return getPrologRequest(requestString, handleReply);
}

/**
 * Returns the current board from the server
 */
function getBoard() {
    // Get Parameter Values
    var requestString = "[3]";

    // Make Request
    return getPrologRequest(requestString, handleReply);
}

/**
 * Checks if the game is over, if it is returns who won
 * @param {*} player 
 */
function getGame_is_over(player) {
    // Get Parameter Values
    var requestString = "[4," + String(player) + "]";

    // Make Request
    return getPrologRequest(requestString, handleReply);
}

/**
 * Sets a board on the prolog server
 * @param {*} stateboard 
 */
function setBoard(stateboard) {
    let board = '[[';
    let aux = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 11; j++) {
            //console.log(stateboard[i][j])
            aux.push(stateboard[i][j][stateboard[i][j].length - 1])
        }
        board = board + String(aux);
        aux = [];
        board = board + '],['
    }
    for (let i = 0; i < 10; i++) {
        aux.push(stateboard[8][i])
    }
    board = board + String(aux);
    board = board + ']]';
    // Get Parameter Values
    var requestString = prepareToSendBoard(board);

    // Make Request
    return getPrologRequest(requestString, handleReply);
}

/**
 * Transform the board in a syntax error free string to prolog
 * @param {*} board 
 */
function prepareToSendBoard(board) {
    let admitedChars = ["1", "2", "3", "4", "5", "6", "7", "8", "[", "]", ",", "a", "c", "d", "e", "f", "g", "h", "i", "j", "_"];
    let boardToSend = "[5,";

    for (let i = 0; i < board.length; i++) {
        if (board[i] == "b") {
            if (board[i - 1] == "_" && board[i + 1] == "_")
                boardToSend += board[i];
            else
                boardToSend += "'" + board[i] + "'";
            continue;
        }


        if (admitedChars.indexOf(board[i]) === -1)
            boardToSend += "'" + board[i] + "'";

        else
            boardToSend += board[i];
    }
    boardToSend += "]";
    return boardToSend;
}
