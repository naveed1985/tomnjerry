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
var map;
var board;


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
var BombImg = new Image();
BombImg.src = 'Images/Bomb.jpg';
var UexpImg = new Image();
UexpImg.src = 'Images/explosionUp.jpg';
var DexpImg = new Image();
DexpImg.src = 'Images/explosionDown.jpg';
var RexpImg = new Image();
RexpImg.src = 'Images/explosionRight.jpg';
var LexpImg = new Image();
LexpImg.src = 'Images/explosionLeft.jpg';

var FelixX = 0;
var FelixY = 0;
var TomX = NCOLS - 1;
var TomY = NROWS - 1;
var MouseX;
var MouseY;
var oldMouse = 0;

var TomBombX;
var TomBombY;
var FelixBombX;
var FelixBombY;

//Movement flags
var TOM_UP_PRESSED=false;
var TOM_DOWN_PRESSED=false;
var TOM_LEFT_PRESSED=false;
var TOM_RIGHT_PRESSED=false;

var FELIX_UP_PRESSED=false;
var FELIX_DOWN_PRESSED=false;
var FELIX_LEFT_PRESSED=false;
var FELIX_RIGHT_PRESSED=false;

// Bomb's flags snd variables
var Tom_bomb_activate = false;   // if true, then Tom has used activated bomb	
var Felix_bomb_activate = false; // if true, then Felix has used activated bomb
var Tom_bomb_explode = false;    // To keep 'explosion' images under check (for Tom)
var Felix_bomb_explode = false;  // To keep 'explosion' images under check (for Felix)
var TomBdir = 37;                // Store Tom's last movement
var FelixBdir = 68;              // Store Felix's last movement

var TbombMove;
var FbombMove;

var TmoveCount = 0;
var FmoveCount = 0;  

var TomBcount = 10;               // Tom's bombs
var FelixBcount = 10;               // Felix's bombs

var TomBcheck = 0;            
var FelixBcheck = 0;

var checklife = false;
//variables to hold intervalIds, would be used for clearing interval on Game Over
var drawIntervalId=0;
var mouseIntervalId=0;
var moveIntervalId=0;
var TomBIntervalId = 0;
var FelixBIntervalId = 0;

//Toss Varibales
var automode = 0;
var framenum = 0;
var framecnt = 0;
var flipping = null;
var choice = 0;
var headcnt = 0;
var tailcnt = 0;
var pict = new Array(3, 4, 1, 4);
var cachedimages = new Array(5);
var historical = true;
cachedimages[0] = new Image();
cachedimages[0].src = "Images/heads.jpg";
cachedimages[1] = new Image();
cachedimages[1].src = "Images/tailsma1.jpg";
cachedimages[2] = new Image();
cachedimages[2].src = "Images/tailsma.jpg";
cachedimages[3] = new Image();
cachedimages[3].src = "Images/heads1.jpg";
cachedimages[4] = new Image();
cachedimages[4].src = "Images/dist.jpg";
var tossWinner = 0;

// initializing system

function init() {
map = getParameterByName("Map");
	board = IO(map).split(/\r?\n/g);
	for(line in board)
		board[line]=board[line].split("");
		
    ctx = $('#canvas')[0].getContext("2d");
    Draw();
    drawIntervalId=setInterval(Draw, 10);
    mouseIntervalId=setInterval(DisplayMouse, 1000);
    moveIntervalId=setInterval(makeMove,CAT_SPEED);  //check if cats should move.
}
// map updates
function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if(results == null)
	return "";
  else
	return decodeURIComponent(results[1].replace(/\+/g, " "));
}
// controlling Tom's movement
function SetTomCoordinates(locx, locy) {
    if (board[locy][locx] == 'E') {
		// Dont let move over other cat
		if (locy != FelixY || locx != FelixX) {
			TomX = locx;
			TomY = locy;
		}
    }
}

function SetFelixCoordinates(locx, locy) {
    if (board[locy][locx] == 'E') {
		// Dont let move over other cat
		if (locx != TomX || locy != TomY) {
			FelixX = locx;
			FelixY = locy;
		}
    }
}

// Setting check on cats' movements
function setMovementflag(evtCode,value){
    if(evtCode == 37 ) { // Tom Left
        TOM_LEFT_PRESSED=value;
		TomBdir = evtCode;
    } else if(evtCode == 38) { //Tom Up
        TOM_UP_PRESSED=value;
		TomBdir = evtCode;
    } else if(evtCode == 39) { //Tom Right
        TOM_RIGHT_PRESSED=value;
		TomBdir = evtCode;
    } else if(evtCode == 40) { //Tom Down
        TOM_DOWN_PRESSED=value;
		TomBdir = evtCode;
    } else if(evtCode == 65 ) { //Felix Left
        FELIX_LEFT_PRESSED=value;
		FelixBdir = evtCode;
    } else if(evtCode == 87 ) { //Felix Up
        FELIX_UP_PRESSED=value;
		FelixBdir = evtCode;
    } else if(evtCode == 68 ) { //Felix Right
        FELIX_RIGHT_PRESSED=value;
		FelixBdir = evtCode;
    } else if(evtCode == 83 ) { //Felix Down
        FELIX_DOWN_PRESSED=value;
		FelixBdir = evtCode;
    }
	if(evtCode == 66) {
	if(TomBcheck == 0){ //to avoid multiple selection of Bomb on single press 
	TomBcheck = 1;
	if(TomBcount > 0)
{Tom_bomb_activate = true;
TomBcount -= 1; DecreaseBombTom();
TomBombX = TomX; TomBombY = TomY;  TbombMove = TomBdir;
TmoveCount = 0;
//ThrowTomBomb();
TomBIntervalId = setInterval(ThrowTomBomb, 40);
} else Tom_bomb_activate = false;
	//ThrowTomBomb();
	}
	}if(evtCode == 90) {
	if(FelixBcheck == 0) {
	FelixBcheck = 1;
if(FelixBcount > 0)
{ Felix_bomb_activate = true;
FelixBcount -= 1; DecreaseBombFelix();
FelixBombX = FelixX; FelixBombY = FelixY; FbombMove = FelixBdir;
FmoveCount = 0;
FelixBIntervalId = setInterval(ThrowFelixBomb, 40);
} else Felix_bomb_activate = false;
	}
}
}

function ThrowTomBomb() {
if(TmoveCount < 4 ) {
 var x, y;
x = TomBombX; y = TomBombY;
 TmoveCount = TmoveCount + 1;
 
 switch(TbombMove){ 
 
 case 37:   // Tom Left
        if(x-1 < 0) TomBombX = 0;
		else TomBombX = x - 1; 
		TomBombY = y; 
		break;

 case 38:   //Tom Up
		if(y-1 < 0) TomBombY = 0;
		else TomBombY = y - 1; 
		TomBombX = x; 
		break;

 case 39:   //Tom Right
		if(x+1 > NCOLS ) TomBombX = NCOLS - 1;
		else TomBombX = x + 1; 
		TomBombY = y; 
		break;

 case 40:    //Tom Down
		if (y+1 > NROWS) TomBombY = NROWS - 1;
		else TomBombY = y + 1; 
		TomBombX = x; 
		break;
default: break;
} 
}else { clearInterval(TomBIntervalId); 
var t = setTimeout('TomBombExp()',5000);}
}


function ThrowFelixBomb() {
if(FmoveCount < 4) {
var x, y;
x = FelixBombX; y = FelixBombY;
 FmoveCount = FmoveCount + 1;

 switch(FbombMove){ 
 
 case 65:  //Felix Left
		if(x-1 < 0) FelixBombX = 0;
		else FelixBombX = x - 1; 
		FelixBombY = y; 
		break;
case 87:   //Felix Up
		if(y-1 < 0) FelixBombY = 0;
		else FelixBombY = y - 1; 
		FelixBombX = x;
		break;
 case 68:    //Felix Right
		if(x+1 > NCOLS ) FelixBombX = NCOLS - 1;
		else FelixBombX = x + 1; 
		FelixBombY = y; 
		break;
  case 83:   //Felix Down
		if (y+1 > NROWS) FelixBombY = NROWS - 1;
		else FelixBombY = y + 1; 
		FelixBombX = x; 
		break;
 default: break;
} } else { clearInterval(FelixBIntervalId); 
var t = setTimeout('FelixBombExp()',5000);}
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
                          //  console.log("x = "+x);
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
					InitializeTom();
				}
			}
			
		} 
                //dont do 'elsif' here, both could move simultaneously, which is not possible in case of elseif.
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
					InitializeFelix();
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

// display  mouse
function DisplayMouse() {
    var randomnumber = -1;

	do {
		randomnumber = Math.floor(Math.random() * 6);
	} while (randomnumber == oldMouse);
	
	oldMouse = randomnumber;
	
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

// throw bomb

function Draw()
{
//FragileBricks();
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
            } // Tom Bomb
			if(Tom_bomb_activate && TomBombY == i && TomBombX == j) { //creating image of bomb
			img = BombImg;
			} if(Tom_bomb_explode){ //creating image for bomb explosion
			if (checklife){ Checklife(TomBombY,TomBombX); checklife = false;}
			RemoveFragile(TomBombY,TomBombX);
			if(TomBombY-1 == i && TomBombX == j){
			img = UexpImg;
			} if(TomBombY+1 == i && TomBombX == j){
			img = DexpImg;
			}if(TomBombY == i && TomBombX-1 == j){
			img = LexpImg;
			}if(TomBombY == i && TomBombX+1 == j){
			img = RexpImg;
			}
			TomBcheck = 0;
			}
			// Felix bomb 
			if(Felix_bomb_activate && FelixBombY == i && FelixBombX == j) {
			img = BombImg;
			} if(Felix_bomb_explode){
			if(checklife){ Checklife(FelixBombY,FelixBombX); checklfe = false; }
			RemoveFragile(FelixBombY,FelixBombX);
			if(FelixBombY-1 == i && FelixBombX == j){
			
			img = UexpImg;
			} if(FelixBombY+1 == i && FelixBombX == j){
			img = DexpImg;
			}if(FelixBombY == i && FelixBombX-1 == j){
			img = LexpImg;
			}if(FelixBombY == i && FelixBombX+1 == j){
			img = RexpImg;
			}
			FelixBcheck = 0;
			}

            ctx.drawImage(img,
                (j * (BRICKWIDTH + PADDING)) + PADDING,
                (i * (BRICKHEIGHT + PADDING)) + PADDING,
                BRICKWIDTH, BRICKHEIGHT);
        }
    }
}

function RemoveFragile(x,y)
{ var i, j;
i = x; j = y;
if(board[i][j] == 'F') board[i][j] = 'E';
if(i-1 > -1){if(board[i-1][j] == 'F') board[i-1][j] = 'E';}
if(i+1 > NROWS){if(board[i+1][j] == 'F') board[i+1][j] = 'E';}
if(j-1 > -1){if(board[i][j-1] == 'F') board[i+1][j-1] = 'E';}
if(j+1 > NCOLS){if(board[i][j+1] == 'F') board[i+1][j+1] = 'E';}
else return null;
}

// Functions to keep animations of 'Bomb' and 'explosion' under control
function TomBombExp()
{ // Activate explosion images
Tom_bomb_activate = false;
Tom_bomb_explode = true;
checklife = true;
var t = setTimeout('ClearTomB()',1000);
}
function ClearTomB()
{ // clear explosion images
Tom_bomb_explode = false;
}

function FelixBombExp(){ // Activate explosion images
Felix_bomb_activate = false;
Felix_bomb_explode = true;
checklife = true;
var t = setTimeout('ClearFelixB()',1000);

}
function ClearFelixB()
{// clear explosion images
Felix_bomb_explode = false;
}

// check the presence of Tom or Felix in explosion area
function Checklife(y,x){
var i,j;
j = x; i = y;
if(i == TomY && j == TomX) InitializeTom();
if(i-1 == TomY && j == TomX) InitializeTom();
if(i+1 == TomY && j == TomX) InitializeTom();
if(i == TomY && j-1 == TomX) InitializeTom();
if(i == TomY && j+1 == TomX) InitializeTom();

if(i == FelixY && j == FelixX) InitializeFelix();
if(i-1 == FelixY && j == FelixX) InitializeFelix();
if(i+1 == FelixY && j == FelixX) InitializeFelix();
if(i == FelixY && j-1 == FelixX) InitializeFelix();
if(i == FelixY && j+1 == FelixX) InitializeFelix();
}

// Reset Tom's psition and decrease life
function InitializeTom(){
TomX = NCOLS - 1;
TomY = NROWS - 1;
DecreaseLifeTom();
}

// Reset Felix's psition and decrease life
function InitializeFelix(){
FelixX = 0;
FelixY = 0;
DecreaseLifeFelix();
}

function CatchMouseTom(x,y){

}

function CatchMouseFelix(x,y){

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

function DecreaseBombTom() {
    $('#BombTom').text("Bombs : " + TomBcount);
}

function DecreaseBombFelix() {
    $('#BombFelix').text("Bombs : " + FelixBcount);
}

//Starting Toss Functionality
function posclicked(posnum) {
	if (flipping == null) {
		if (Math.random() < 0.5) {
			choice = 0;
			headcnt++;
			var headcntTemp = document.getElementById("headcnt").value;
			headcntTemp.value++;
			tossWinner = "Tom";
		}
		else {
			choice = 2;
			tailcnt++;
			var tailcntTemp = document.getElementById("tailcnt").value;
			tailcntTemp.value++;
			tossWinner = "Felix";
		}
		if (!automode) {
			var headcntTemp = document.getElementById("headcnt").value;
			var tailcntTemp = document.getElementById("tailcnt").value;
			headcntTemp.value = 0;
			tailcntTemp.value = 0;
			framecnt = 0;
			animate();
		}
	}
}

function animate() {
	imageSrc = $("#coin").attr("src");
	framenum = (framecnt) % 4;
	window.document.coin.src = cachedimages[pict[framenum]].src;
	framecnt++;
	if ((framecnt > 8) && (framenum == choice)) {
	window.document.coin.src = cachedimages[framenum].src;
	flipping = null;
	}
	else
		flipping = setTimeout("animate()", 50);
}

$(document).ready(function() {
$('#coinParent').hide();
$('#effect').hide();
$('#toss').click(function(){ $('#coinParent').show();});

	$('#coinParent').click(function() {
		posclicked(0);
		setTimeout( function() {
		runEffect();
	}, 1000 );
		});	
		//runEffect();
});

function runEffect() {
			// get effect type from 
			var selectedEffect = "slide";

			// most effect types need no options passed by default
			var options = {};
			// some effects have required parameters
			if ( selectedEffect === "scale" ) {
				options = { percent: 100 };
			} else if ( selectedEffect === "size" ) {
				options = { to: { width: 280, height: 185 } };
			}

			// run the effect
			var str = $("p:first").text();
			$("#winner").html(tossWinner+" Wins");
			$("#selection").html(tossWinner+" Please select your map");
			$( "#effect" ).show( selectedEffect, options, 500, callback );
		};

function callback() {
			setTimeout(function() {
				//$( "#coinImageDiv:visible" ).removeAttr( "style" ).fadeOut();
				$('#coinParent').hide();
				$('#effect').hide();

			}, 1000 );
		};
// Ending Toss Functionality