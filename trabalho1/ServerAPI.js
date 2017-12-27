function getPrologRequest(requestString, onSuccess, onError, port) {
    var requestPort = port || 8081
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

    request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
    request.onerror = onError || function () { console.log("Error waiting for response"); };
    request.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        console.log(request.responseText)
      }
    }

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
    return request
}

function makePlay(player, playor, playds) {
    let play = '['+playor[0].toLowerCase()+','+playor[1]+','+playds[0].toLowerCase()+','+playds[1]+']';
    // Get Parameter Values
    var requestString = "[1," +String(player) + "," + String(play) +"]";

    // Make Request
    return getPrologRequest(requestString, handleReplyMakePlay);
}

//Handle the Reply
function handleReplyMakePlay(data) {
    //OK ou BadRequest!!
}

function makeAIPlay(player, difficulty) {
    // Get Parameter Values
    var requestString = "[2," +String(player) + "," + String(difficulty) +"]";

    // Make Request
    return getPrologRequest(requestString, handleReplyMakeAIPlay);
}

function handleReplyMakeAIPlay(data) {
    //AI PLAY ou BadRequest!!
}

function getBoard() {
    // Get Parameter Values
    var requestString = "[3]";

    // Make Request
    return getPrologRequest(requestString, handleReplyGetBoard);
}

function handleReplyGetBoard(data) {
    //Board ou BadRequest!!
}

function getGame_is_over(player) {
    // Get Parameter Values
    var requestString = "[4,"+String(player)+ "]";

    // Make Request
    return getPrologRequest(requestString, handleReplyGetGame_is_over);
}

function handleReplyGetGame_is_over(data) {
    //OK ou Player 1/2 Lost,(Reason), ou DRAW!!
}

function setBoard(stateboard) {
    let board = '[[';
    let aux = [];
    for(let i = 0; i < 8; i++){
      for(let j = 0; j < 11; j++){
        //console.log(stateboard[i][j])
        aux.push(stateboard[i][j][stateboard[i][j].length - 1])
      }
      board = board + String(aux);
      aux = [];
      board = board + '],['
    }
    for(let i = 0; i < 10; i++){
      aux.push(stateboard[8][i])
    }
    board = board + String(aux);
    board = board + ']]';
    // Get Parameter Values
    var requestString = prepareToSendBoard(board);

    // Make Request
    return getPrologRequest(requestString, handleReplySetBoard);
}

function handleReplySetBoard(data) {
    //OK ou BadRequest!!
}


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
    boardToSend+="]"
    return boardToSend;
}
