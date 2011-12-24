/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var ctx;

var lifeTom = 3;
var lifeFelix = 3;
var scoreTom = 0;
var scoreFelix = 0;
var CAT_SPEED = 100;

var NROWS = 16;
var NCOLS = 20;
var BRICKHEIGHT = 35;
var BRICKWIDTH = 35;
var PADDING = 0;
var bricksCount = NROWS * NCOLS;

var board = IO("Map.txt").split(/\r?\n/g);

var SolidImg = new Image();
SolidImg.src = 'Images/S.png';
var EmptyImg = new Image();
EmptyImg.src = 'Images/E.png';
var FragileImg = new Image();
FragileImg.src = 'Images/F.png';
var HoleImg = new Image();
HoleImg.src = 'Images/H.png';
var MouseImg = new Image();
MouseImg.src = 'Images/M.png';
var TomImg = new Image();
TomImg.src = 'Images/Tom.jpg';
var FelixImg = new Image();
FelixImg.src = 'Images/Felix2.jpg';

var FelixX = 0;
var FelixY = 0;
var TomX = NCOLS - 1;
var TomY = NROWS - 1;
var MouseX;
var MouseY;

//Movement flags
var TOM_UP_PRESSED=false;
var TOM_DOWN_PRESSED=false;
var TOM_LEFT_PRESSED=false;
var TOM_RIGHT_PRESSED=false;
var FELIX_UP_PRESSED=false;
var FELIX_DOWN_PRESSED=false;
var FELIX_LEFT_PRESSED=false;
var FELIX_RIGHT_PRESSED=false;

//variables to hold intervalIds, would be used for clearing interval on Game Over
var drawIntervalId=0;
var mouseIntervalId=0;
var moveIntervalId=0;

function init() {
    ctx = $('#canvas')[0].getContext("2d");
    Draw();
    drawIntervalId=setInterval(Draw, 10);
    mouseIntervalId=setInterval(DisplayMouse, 1000);
    moveIntervalId=setInterval(makeMove,CAT_SPEED);  //check if cats should move.
}

function SetTomCoordinates(locx, locy) {
    if (board[locy][locx] == 'E') {
        TomX = locx;
        TomY = locy;
    }
}

function SetFelixCoordinates(locx, locy) {
    if (board[locy][locx] == 'E') {
        FelixX = locx;
        FelixY = locy;
    }
}

function setMovementflag(evtCode,value){
    if(evtCode == 37 ) { // Left
        TOM_LEFT_PRESSED=value;
    } else if(evtCode == 38) { // Up
        TOM_UP_PRESSED=value;
    } else if(evtCode == 39) { // Right
        TOM_RIGHT_PRESSED=value;
    } else if(evtCode == 40) { // Down
        TOM_DOWN_PRESSED=value;
    } else if(evtCode == 65 ) { // Left
        FELIX_LEFT_PRESSED=value;
    } else if(evtCode == 87 ) { // Up
        FELIX_UP_PRESSED=value;
    } else if(evtCode == 68 ) { // Right
        FELIX_RIGHT_PRESSED=value;
    } else if(evtCode == 83 ) { // Down
        FELIX_DOWN_PRESSED=value;
    }
}


//Key Borad Keys Event
function onKeyDown(evt) {
    setMovementflag(evt.keyCode,true);
}

function onKeyUP(evt) {
    setMovementflag(evt.keyCode,false);
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUP);

//Movement control
function makeMove() {
    var x = -1, y = -1;
	
	if (lifeTom > 0 && lifeFelix > 0) {
		if(TOM_UP_PRESSED || TOM_LEFT_PRESSED || TOM_RIGHT_PRESSED || TOM_DOWN_PRESSED ) {
			// Its Tom
			x = TomX; y = TomY;
			
                        if(TOM_LEFT_PRESSED){
                            x = x - 1;

                            if (x >= 0) {
                                    SetTomCoordinates(x, y);
                            }
                        } else if(TOM_RIGHT_PRESSED){
                            x = x + 1;
                            console.log("x = "+x);
                            if (x < NCOLS) {
                                    SetTomCoordinates(x, y);
                            }
                        } else if(TOM_UP_PRESSED){
                            y = y - 1;

                            if (y >= 0) {
                                    SetTomCoordinates(x, y);
                            }
                        } else if(TOM_DOWN_PRESSED){
                            y = y + 1;

                            if (y < NROWS) {
                                    SetTomCoordinates(x, y);
                            }
                        }
			
			if (x > -1 && y > -1 && x < NCOLS && y < NROWS && board[y][x] == 'H') {
				if(y == MouseY && x == MouseX) {
					MouseX = -1;
					MouseY = -1;
					IncreaseScoreTom();
				}
				else {
					TomX = NCOLS - 1;
					TomY = NROWS - 1;
					DecreaseLifeTom();
				}
			}
			
		} 
                //dont do elsif here, both could move simultaneously, which is not possible in case of elseif.
                if(  FELIX_LEFT_PRESSED || FELIX_UP_PRESSED || FELIX_RIGHT_PRESSED || FELIX_DOWN_PRESSED) {
			// Its Felix
			x = FelixX; y = FelixY;
			
                        if(FELIX_LEFT_PRESSED){
                            x = x - 1;

                            if (x >= 0) {
                                    SetFelixCoordinates(x, y);
                            }
                        } else if(FELIX_RIGHT_PRESSED){
                            x = x + 1;

                            if (x < NCOLS) {
                                    SetFelixCoordinates(x, y);
                            }
                        } else if(FELIX_UP_PRESSED){
                            y = y - 1;

                            if (y >= 0) {
                                    SetFelixCoordinates(x, y);
                            }
                        } else if(FELIX_DOWN_PRESSED){
                            y = y + 1;

                            if (y < NROWS) {
                                    SetFelixCoordinates(x, y);
                            }
                        }
			
			if (x > -1 && y > -1 && x < NCOLS && y < NROWS && board[y][x] == 'H') {
				if(y == MouseY && x == MouseX) {
					MouseX = -1;
					MouseY = -1;
					IncreaseScoreFelix();
				}
				else {
					FelixX = 0;
					FelixY = 0;
					DecreaseLifeFelix();
				}
			}
		}
	}
	
	if(lifeTom < 1 || lifeFelix < 1)
	{
		if (scoreTom < scoreFelix) {
			jAlert('Congratulations Felix You Won the Game', 'Game Over');
					clearInterval(drawIntervalId);
					clearInterval(mouseIntervalId);
					clearInterval(moveIntervalId);
		}
		else if(scoreTom > scoreFelix){
			jAlert('Congratulations Tom You Won the Game', 'Game Over');
					clearInterval(drawIntervalId);
					clearInterval(mouseIntervalId);
					clearInterval(moveIntervalId);
		}
		else {
			jAlert('Game Draw', 'Game Over');
					clearInterval(drawIntervalId);
					clearInterval(mouseIntervalId);
					clearInterval(moveIntervalId);
		}
	}
}

function DisplayMouse() {
    var randomnumber = Math.floor(Math.random() * 6);
    
    var counter = 0;
    for (i=0; i < NROWS; i++) {
        for (j=0; j < NCOLS; j++) {
            if(board[i][j] == 'H') {
                if(counter == randomnumber) {
                    MouseX = j;
                    MouseY = i;
                    return null;
                }
                else
                    counter++;
            }
        }
    }
}

function Draw()
{
    brickCounter = 0;
    var img;

    for (i=0; i < NROWS; i++) {
        for (j=0; j < NCOLS; j++) {
            
            brickCounter++;
            
            if(TomY == i && TomX == j && lifeTom > 0) {
                img = TomImg;
            } else if(FelixY == i && FelixX == j && lifeFelix > 0) {
                img = FelixImg;
            } else if (board[i][j] == 'F') {
                img = FragileImg;
            } else if (board[i][j] == 'S') {
                img = SolidImg;
            } else if (board[i][j] == 'E') {
                img = EmptyImg;
            } else if (board[i][j] == 'H') {
                img = HoleImg;
            }
            if(MouseX == j && MouseY == i) {
                    img = MouseImg;
            }

//            rect((j * (BRICKWIDTH + PADDING)) + PADDING, 
//                    (i * (BRICKHEIGHT + PADDING)) + PADDING,
//                        BRICKWIDTH, BRICKHEIGHT);

            ctx.drawImage(img,
                (j * (BRICKWIDTH + PADDING)) + PADDING,
                (i * (BRICKHEIGHT + PADDING)) + PADDING,
                BRICKWIDTH, BRICKHEIGHT);
        }
    }
}

function IO(U, V) {//LA MOD String Version. A tiny ajax library.  by, DanDavis
    var X = !window.XMLHttpRequest ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
    X.open(V ? 'PUT' : 'GET', U, false );
    X.setRequestHeader('Content-Type', 'text/html')
    X.send(V ? V : '');
    return X.responseText;
}

function DecreaseLifeTom() {
    $('#LivesTom').text("Lives : " + --lifeTom);
}

function DecreaseLifeFelix() {
    $('#LivesFelix').text("Lives : " + --lifeFelix);
}

function IncreaseScoreTom() {
    $('#ScoreTom').text("Score : " + ++scoreTom);
}

function IncreaseScoreFelix() {
    $('#ScoreFelix').text("Score : " + ++scoreFelix);
}