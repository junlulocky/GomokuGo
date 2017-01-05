/**
 * UI
 * @author Airing
 */

var canvas = document.getElementById("chess");
var context = canvas.getContext("2d");
var me = true;              // who to play
var over = false;           // game over flag
var chessBoard = [];        // store chessman infos

/* context test: draw a diagonal line

context.strokeStyle = "#BFBFBF"
context.moveTo(0, 0);
context.lineTo(450, 450);
context.stroke();

*/

/**
 * start game: initiate the chess panel, let AI start with (7, 7)
 */
function startGame() {
    
    // initiate chess board
    for (var i = 0; i < 15; i++) {
        chessBoard[i] = [];
        for (var j = 0; j < 15; j++) {
            chessBoard[i][j] = 0;
        }
    }
    
    // clean chess panel
    cleanPanel();
    // draw chess panel
    drawPanel();
    
    // let the gamer play
    me = true;
    // set game over flag to be false
    over = false;
    
    // initiate all the related arrays
    for (var i = 0; i < count; i++) {
        myWin[i] = 0;
        gomokuWin[i] = 0;
    }
    
    // let the AI starts with (7,7), store the info
    oneStep(7, 7, false);
    chessBoard[7][7] = 2;
}

/**
 * clean panel
 */
function cleanPanel() {
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * draw the game panel
 * 15 pixel is the margin
 */
function drawPanel() {
    // if you want to draw the watermark, please put the following blocs into logo.onload
    for (var i = 0; i < 15; i++) {
        context.strokeStyle = "#BFBFBF";  // line color
        context.beginPath();
        context.moveTo(15 + i *30, 15);
        context.lineTo(15 + i *30, canvas.height - 15);
        context.closePath();
        context.stroke();

        context.beginPath();
        context.moveTo(15, 15 + i *30);
        context.lineTo(canvas.width - 15, 15 + i * 30);
        context.closePath();
        context.stroke();
    }

    /*
    // draw watermark
    var logo = new Image();
    logo.src = "images/logo.png";
    // NOTE: put the drawImage function into the onload function -> draw after the image loaded
    logo.onload = function() {
        context.drawImage(logo, 0, 0, 450, 450);
    }
    */
}

/**
 * draw a chessman
 * @param i     x axis
 * @param j     y axis
 * @param me    indicator of the color of the chessman
 */
function oneStep(i, j, me) {
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
    context.closePath();

    // chessman color gradient
    var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
    if (me) {
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
    } else {
        gradient.addColorStop(0, "#0A0A0A");
        gradient.addColorStop(1, "#636766");
    }
    context.fillStyle = gradient;
    context.fill();  // do not use stroke, stroke only draw the border
}


/**
 * canvas mouse click event
 * @param e
 */
canvas.onclick = function(e) {
    if (over) {
        return;
    }

    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);

    // if there is no chessman, it is availble to put the chessman here
    if(chessBoard[i][j] == 0) {
        // draw a chessman
        oneStep(i, j, me);
        // update the chessboard info 
        chessBoard[i][j] = 1;

        // iterate the array
        for (var k = 0; k < count; k ++) {
            if (wins[i][j][k]) {
                // if there is a winner, update flag +1, 5 times winner is the final winner
                myWin[k] ++;
                // never put 5 here! 
                gomokuWin[k] = 6;
                
                if (myWin[k] == 5) {
                    window.alert("You Win");
                    // game over
                    over = true;
                }
            }

        }
        

        // if there is no winner, AI to play 
        if (!over) {
            me = !me;
            gomokuGo();
        }
    }
};

