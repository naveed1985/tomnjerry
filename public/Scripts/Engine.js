/* 
* To change this template, choose Tools | Templates
* and open the template in the editor.
*/

var ctx;

var GamePaused = false;

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
var MouseHoleCount = 0;
var map;
var mapValue = 0;
var board;


var SolidImg = new Image();
SolidImg.src = '/Images/S.png';
var EmptyImg = new Image();
EmptyImg.src = '/Images/E.png';
var FragileImg = new Image();
FragileImg.src = '/Images/F.png';
var HoleImg = new Image();
HoleImg.src = '/Images/H.png';
var MouseImg = new Image();
MouseImg.src = '/Images/M.png';
var TomImg = new Image();
TomImg.src = '/Images/Tom.jpg';
var FelixImg = new Image();
FelixImg.src = '/Images/Felix2.jpg';
var BombImg = new Image();
BombImg.src = '/Images/Bomb.jpg';
var UexpImg = new Image();
UexpImg.src = '/Images/explosionUp.jpg';
var DexpImg = new Image();
DexpImg.src = '/Images/explosionDown.jpg';
var RexpImg = new Image();
RexpImg.src = '/Images/explosionRight.jpg';
var LexpImg = new Image();
LexpImg.src = '/Images/explosionLeft.jpg';
var RArrowImg = new Image();
RArrowImg.src = '/Images/rightarrow.jpg';
var LArrowImg = new Image();
LArrowImg.src = '/Images/leftarrow.jpg';
var UArrowImg = new Image();
UArrowImg.src = '/Images/uparrow.jpg';
var DArrowImg = new Image();
DArrowImg.src = '/Images/downarrow.jpg';
var TArrowImg; // = new Image();
var FArrowImg;

var FelixX = 0;
var FelixY = 0;
var TomX = NCOLS - 1;
var TomY = NROWS - 1;
var MouseX;
var MouseY;
var oldMouse = 0;

var TomBombX;
var TomBombY;
var TomArrowX;
var TomArrowY;
var FelixBombX;
var FelixBombY;
var FelixArrowX;
var FelixArrowY;

var TomAddon;
var FelixAddon;

//Movement flags
var TOM_UP_PRESSED = false;
var TOM_DOWN_PRESSED = false;
var TOM_LEFT_PRESSED = false;
var TOM_RIGHT_PRESSED = false;

var FELIX_UP_PRESSED = false;
var FELIX_DOWN_PRESSED = false;
var FELIX_LEFT_PRESSED = false;
var FELIX_RIGHT_PRESSED = false;

// Bomb's flags snd variables
var Tom_bomb_activate = false;   // if true, then Tom has used activated bomb	
var Felix_bomb_activate = false; // if true, then Felix has used activated bomb
var Tom_bomb_explode = false;    // To keep 'explosion' images under check (for Tom)
var Felix_bomb_explode = false;  // To keep 'explosion' images under check (for Felix)
var Tom_arrow_activate = false;   // if true, then Tom has used activated arrow	
var Felix_arrow_activate = false; // if true, then Felix has used activated arrow
var TomBdir = 37;                // Store Tom's last movement
var FelixBdir = 68;              // Store Felix's last movement

var TbombMove;
var TarrowMove;
var FbombMove;
var FarrowMove;

var TmoveCount = 0;
var TAMCount = 0;
var FmoveCount = 0;
var FAMCount = 0;

var TomBcount = 10;               // Tom's bombs
var TomAcount = 10;               // Tom's arrows
var FelixBcount = 10;               // Felix's bombs
var FelixAcount = 10;               // Felix's arrows

var TomBcheck = 0;
var TomAcheck = 0;
var FelixBcheck = 0;
var FelixAcheck = 0;

var checklife = false;
//variables to hold intervalIds, would be used for clearing interval on Game Over
var drawIntervalId = 0;
var mouseIntervalId = 0;
var addonIntervalId = 0;
var moveIntervalId = 0;
var TomBIntervalId = 0;
var TomAIntervalId = 0;
var FelixBIntervalId = 0;
var FelixAIntervalId = 0;

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
cachedimages[0].src = "/Images/heads.jpg";
cachedimages[1] = new Image();
cachedimages[1].src = "/Images/tailsma1.jpg";
cachedimages[2] = new Image();
cachedimages[2].src = "/Images/tailsma.jpg";
cachedimages[3] = new Image();
cachedimages[3].src = "/Images/heads1.jpg";
cachedimages[4] = new Image();
cachedimages[4].src = "/Images/dist.jpg";
var tossWinner = 0;

// initializing system

function init() {
    
    map = getParameterByName("Map");
    
    var mValue = getParameterByName("value");
    if(mValue != ""){
        mapValue = parseInt(mValue);
    }
    var sTom = getParameterByName("TomScore");
    if(sTom != ""){
        scoreTom = sTom;
    }
   
    var sFelix = getParameterByName("FelixScore");
    if(sFelix != ""){
        scoreFelix = sFelix;
    }
   
    if(map != ""){
        board = IO(map).split(/\r?\n/g);
        for (line in board)
            board[line] = board[line].split("");
    }
   

    ctx = $('#canvas')[0].getContext("2d");
   
    Draw();
   
    drawIntervalId = setInterval(Draw, 10);
   
    mouseIntervalId = setInterval(DisplayMouse, 1000);
   
    addonIntervalId = setInterval(DisplayAddon, 3000);
   
    moveIntervalId = setInterval(makeMove, CAT_SPEED);  //check if cats should move.
 
    $('#LivesTom').text(lifeTom);
    $('#LivesTom').text(lifeTom);
    $('#LivesFelix').text(lifeFelix);
    $('#LivesFelix').text(lifeFelix);
    $('#ScoreTom').text(scoreTom);
    $('#ScoreFelix').text(scoreFelix);
    $('#BombTom').text(TomBcount);
    $('#BombFelix').text(FelixBcount);

}
// map updates
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
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
    } else if (board[locy][locx] == 'F' || board[locy][locx] == 'S') {
        HandleAddonTom(locx, locy);
    }
}

function SetFelixCoordinates(locx, locy) {
    if (board[locy][locx] == 'E') {
        // Dont let move over other cat
        if (locx != TomX || locy != TomY) {
            FelixX = locx;
            FelixY = locy;
        }
    } else if (board[locy][locx] == 'F' || board[locy][locx] == 'S') {
        HandleAddonFelix(locx, locy);
    }
}

// Setting check on cats' movements
function setMovementflag(evtCode, value) {
    if (evtCode == 37) { // Tom Left
        TOM_LEFT_PRESSED = value;
        TomBdir = evtCode;
    } else if (evtCode == 38) { //Tom Up
        TOM_UP_PRESSED = value;
        TomBdir = evtCode;
    } else if (evtCode == 39) { //Tom Right
        TOM_RIGHT_PRESSED = value;
        TomBdir = evtCode;
    } else if (evtCode == 40) { //Tom Down
        TOM_DOWN_PRESSED = value;
        TomBdir = evtCode;
    } else if (evtCode == 65) { //Felix Left
        FELIX_LEFT_PRESSED = value;
        FelixBdir = evtCode;
    } else if (evtCode == 87) { //Felix Up
        FELIX_UP_PRESSED = value;
        FelixBdir = evtCode;
    } else if (evtCode == 68) { //Felix Right
        FELIX_RIGHT_PRESSED = value;
        FelixBdir = evtCode;
    } else if (evtCode == 83) { //Felix Down
        FELIX_DOWN_PRESSED = value;
        FelixBdir = evtCode;
    } else if (evtCode == 66) {   // Bomb Selection for Tom
        if (TomBcheck == 0) { //to avoid multiple selection of Bomb on single press 
            TomBcheck = 1;
            if (TomBcount > 0) {
                Tom_bomb_activate = true;
                TomBcount -= 1; DecreaseBombTom();
                TomBombX = TomX; TomBombY = TomY; TbombMove = TomBdir;
                TmoveCount = 0;
                //ThrowTomBomb();
                TomBIntervalId = setInterval(ThrowTomBomb, 40);
            } else Tom_bomb_activate = false;
            //ThrowTomBomb();
        }


    } else if (evtCode == 90) { // Bomb Selection for Felix
        if (FelixBcheck == 0) {
            FelixBcheck = 1;
            if (FelixBcount > 0) {
                Felix_bomb_activate = true;
                FelixBcount -= 1; DecreaseBombFelix();
                FelixBombX = FelixX; FelixBombY = FelixY; FbombMove = FelixBdir;
                FmoveCount = 0;
                FelixBIntervalId = setInterval(ThrowFelixBomb, 40);
            } else Felix_bomb_activate = false;
        }


    } else if (evtCode == 86) { // Arrow selection form Tom
        if (TomAcheck == 0) { //to avoid multiple selection of Arrows on single press 
            TomAcheck = 1;
            if (TomAcount > 0) {
                Tom_arrow_activate = true;
                TomAcount -= 1; //DecreaseArrowTom();
                console.log(TomAcount);
                TomArrowX = TomX; TomArrowY = TomY; TarrowMove = TomBdir; TArrowImg = UArrowImg;
                TomAIntervalId = setInterval(ThrowTomArrow, 40);
            } else Tom_arrow_activate = false;
        }
    } else if (evtCode == 88) { // Arrow selection form Felix
        if (FelixAcheck == 0) { //to avoid multiple selection of Arrows on single press 
            FelixAcheck = 1;
            if (FelixAcount > 0) {
                Felix_arrow_activate = true;
                FelixAcount -= 1; //DecreaseArrowTom();
                console.log(FelixAcount);
                FelixArrowX = FelixX; FelixArrowY = FelixY; FarrowMove = FelixBdir; FArrowImg = UArrowImg;
                FelixAIntervalId = setInterval(ThrowFelixArrow, 40);
            } else Felix_arrow_activate = false;
        }
    }
}

function ThrowTomArrow() {
    if (Tom_arrow_activate) {
        var x, y;
        x = TomArrowX; y = TomArrowY;
        switch (TarrowMove) {

            case 37:   // Tom Left
                if (x - 1 < 0) TomArrowX = 0;
                else TomArrowX = x - 1;
                TomArrowY = y;
                TArrowImg = LArrowImg;
                break;

            case 38:   //Tom Up
                if (y - 1 < 0) TomArrowY = 0;
                else TomArrowY = y - 1;
                TomArrowX = x;
                TArrowImg = UArrowImg;
                break;

            case 39:   //Tom Right
                if (x + 1 > NCOLS) TomArrowX = NCOLS - 1;
                else TomArrowX = x + 1;
                TomArrowY = y;
                TArrowImg = RArrowImg;
                break;

            case 40:    //Tom Down
                if (y + 1 > NROWS) TomArrowY = NROWS - 1;
                else TomArrowY = y + 1;
                TomArrowX = x;
                TArrowImg = DArrowImg;
                break;
            default: break;
        }
    } else { ClearTArrows(); }
}

function ThrowFelixArrow() {
    if (Felix_arrow_activate) {
        var x, y;
        x = FelixArrowX; y = FelixArrowY;
        switch (FarrowMove) {

            case 65:   // Felix Left
                if (x - 1 < 0) FelixrrowX = 0;
                else FelixArrowX = x - 1;
                FelixArrowY = y;
                FArrowImg = LArrowImg;
                break;

            case 87:   //Felix Up
                if (y - 1 < 0) FelixArrowY = 0;
                else FelixArrowY = y - 1;
                FelixArrowX = x;
                FArrowImg = UArrowImg;
                break;

            case 68:   //Felix Right
                if (x + 1 > NCOLS) FelixArrowX = NCOLS - 1;
                else FelixArrowX = x + 1;
                FelixArrowY = y;
                FArrowImg = RArrowImg;
                break;

            case 83:    //Felix Down
                if (y + 1 > NROWS) FelixArrowY = NROWS - 1;
                else FelixArrowY = y + 1;
                FelixArrowX = x;
                FArrowImg = DArrowImg;
                break;
            default: break;
        }
    } else { ClearFArrows(); }
}

function ClearTArrows() {
    clearInterval(TomAIntervalId); TomAcheck = 0; Tom_arrow_activate = false;
}

function ClearFArrows() {
    clearInterval(FelixAIntervalId); FelixAcheck = 0; Felix_arrow_activate = false;
}

function ThrowTomBomb() {
    if (TmoveCount < 4) {
        var x, y;
        x = TomBombX; y = TomBombY;
        TmoveCount = TmoveCount + 1;

        switch (TbombMove) {

            case 37:   // Tom Left
                if (x - 1 < 0) TomBombX = 0;
                else TomBombX = x - 1;
                TomBombY = y;
                break;

            case 38:   //Tom Up
                if (y - 1 < 0) TomBombY = 0;
                else TomBombY = y - 1;
                TomBombX = x;
                break;

            case 39:   //Tom Right
                if (x + 1 > NCOLS) TomBombX = NCOLS - 1;
                else TomBombX = x + 1;
                TomBombY = y;
                break;

            case 40:    //Tom Down
                if (y + 1 > NROWS) TomBombY = NROWS - 1;
                else TomBombY = y + 1;
                TomBombX = x;
                break;
            default: break;
        }
    } else {
        clearInterval(TomBIntervalId);
        var t = setTimeout('TomBombExp()', 5000);
    }
}

function ThrowFelixBomb() {
    if (FmoveCount < 4) {
        var x, y;
        x = FelixBombX; y = FelixBombY;
        FmoveCount = FmoveCount + 1;

        switch (FbombMove) {

            case 65:  //Felix Left
                if (x - 1 < 0) FelixBombX = 0;
                else FelixBombX = x - 1;
                FelixBombY = y;
                break;
            case 87:   //Felix Up
                if (y - 1 < 0) FelixBombY = 0;
                else FelixBombY = y - 1;
                FelixBombX = x;
                break;
            case 68:    //Felix Right
                if (x + 1 > NCOLS) FelixBombX = NCOLS - 1;
                else FelixBombX = x + 1;
                FelixBombY = y;
                break;
            case 83:   //Felix Down
                if (y + 1 > NROWS) FelixBombY = NROWS - 1;
                else FelixBombY = y + 1;
                FelixBombX = x;
                break;
            default: break;
        }
    } else {
        clearInterval(FelixBIntervalId);
        var t = setTimeout('FelixBombExp()', 5000);
    }
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUP);
$(document).keypress(onKeyPRESS);

//Key Borad Keys Event
function onKeyDown(evt) {
    setMovementflag(evt.keyCode, true);
}

function onKeyUP(evt) {
    setMovementflag(evt.keyCode, false);
}

function onKeyPRESS(evt) {
    if (evt.charCode == 112) { // Game Pause
        if (GamePaused) {
            ResumeGame();
        }
        else {
            PauseGame();
        }
    }
}

function PauseGame() {
    GamePaused = true;

    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $("#PauseDialog").dialog("destroy");

    $("#PauseDialog").dialog({
        height: 100,
        modal: true,
        width: 200,
        show: 'slide',
        closeOnEscape: false,
        open: function (event, ui) { $(".ui-dialog-titlebar-close", $(this).parent()).hide(); }
    });
}

function ResumeGame() {
    GamePaused = false;
    $("#PauseDialog").dialog("destroy");
}

//Movement control
function makeMove() {
    var x = -1, y = -1;

    if (lifeTom > 0 && lifeFelix > 0) {
        if (TOM_UP_PRESSED || TOM_LEFT_PRESSED || TOM_RIGHT_PRESSED || TOM_DOWN_PRESSED) {
            // Its Tom
            x = TomX; y = TomY;

            if (TOM_LEFT_PRESSED) {
                x = x - 1;

                if (x >= 0) {
                    SetTomCoordinates(x, y);
                }
            } else if (TOM_RIGHT_PRESSED) {
                x = x + 1;
                //  console.log("x = "+x);
                if (x < NCOLS) {
                    SetTomCoordinates(x, y);
                }
            } else if (TOM_UP_PRESSED) {
                y = y - 1;

                if (y >= 0) {
                    SetTomCoordinates(x, y);
                }
            } else if (TOM_DOWN_PRESSED) {
                y = y + 1;

                if (y < NROWS) {
                    SetTomCoordinates(x, y);
                }
            }

            if (x > -1 && y > -1 && x < NCOLS && y < NROWS) {
                if (board[y][x] == 'H') {
                    if (y == MouseY && x == MouseX) {
                        MouseX = -1;
                        MouseY = -1;
                        IncreaseScoreTom();
                    }
                    else {
                        InitializeTom();
                    }
                }
                if (y == AddonY && x == AddonX) {
                    SetTomAddon();
                }
            }
        }
        //dont do 'elsif' here, both could move simultaneously, which is not possible in case of elseif.
        if (FELIX_LEFT_PRESSED || FELIX_UP_PRESSED || FELIX_RIGHT_PRESSED || FELIX_DOWN_PRESSED) {
            // Its Felix
            x = FelixX; y = FelixY;

            if (FELIX_LEFT_PRESSED) {
                x = x - 1;

                if (x >= 0) {
                    SetFelixCoordinates(x, y);
                }
            } else if (FELIX_RIGHT_PRESSED) {
                x = x + 1;

                if (x < NCOLS) {
                    SetFelixCoordinates(x, y);
                }
            } else if (FELIX_UP_PRESSED) {
                y = y - 1;

                if (y >= 0) {
                    SetFelixCoordinates(x, y);
                }
            } else if (FELIX_DOWN_PRESSED) {
                y = y + 1;

                if (y < NROWS) {
                    SetFelixCoordinates(x, y);
                }
            }

            if (x > -1 && y > -1 && x < NCOLS && y < NROWS) {
                if (board[y][x] == 'H') {
                    if (y == MouseY && x == MouseX) {
                        MouseX = -1;
                        MouseY = -1;
                        IncreaseScoreFelix();
                    }
                    else {
                        InitializeFelix();
                    }
                }
                if (y == AddonY && x == AddonX) {
                    SetFelixAddon();
                }
            }
        }
    }

    if (lifeTom < 1 || lifeFelix < 1) {
        if (scoreTom < scoreFelix) {
            jAlert('Congratulations Felix You Won the Game', 'Game Over');
            clearInterval(drawIntervalId);
            clearInterval(mouseIntervalId);
            clearInterval(moveIntervalId);
        }
        else if (scoreTom > scoreFelix) {
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
        if (mapValue < 5)
            $('#nextLevel').show();
    }
}

// display  mouse
function DisplayMouse() {

    if (MouseHoleCount == 0) {
        for (i = 0; i < NROWS; i++)
            for (j = 0; j < NCOLS; j++)
                if (board[i][j] == 'H')
                    MouseHoleCount = MouseHoleCount + 1;
    }

    var randomnumber = -1;

    do {
        randomnumber = Math.floor(Math.random() * MouseHoleCount);
    } while (randomnumber == oldMouse);

    oldMouse = randomnumber;

    var counter = 0;
    for (i = 0; i < NROWS; i++) {
        for (j = 0; j < NCOLS; j++) {
            if (board[i][j] == 'H') {
                if (counter == randomnumber) {
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

function Draw() {
    if (GamePaused == false) {
        //FragileBricks();
        brickCounter = 0;
        var img;
        for (i = 0; i < NROWS; i++) {
            for (j = 0; j < NCOLS; j++) {

                brickCounter++;

                if (TomY == i && TomX == j && lifeTom > 0) {
                    img = TomImg;
                } else if (FelixY == i && FelixX == j && lifeFelix > 0) {
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
                if (MouseX == j && MouseY == i) {
                    img = MouseImg;
                }
                if (AddonX == j && AddonY == i && selectedAddon != -1) {
                    img = addonsImgs[selectedAddon];
                }
                // Tom Bomb
                if (Tom_bomb_activate && TomBombY == i && TomBombX == j) { //creating image of bomb
                    img = BombImg;
                }
                if (Tom_bomb_explode) { //creating image for bomb explosion
                    if (checklife) { Checklife(TomBombY, TomBombX); checklife = false; }
                    RemoveFragile(TomBombY, TomBombX);
                    if (TomBombY - 1 == i && TomBombX == j) {
                        img = UexpImg;
                    } if (TomBombY + 1 == i && TomBombX == j) {
                        img = DexpImg;
                    } if (TomBombY == i && TomBombX - 1 == j) {
                        img = LexpImg;
                    } if (TomBombY == i && TomBombX + 1 == j) {
                        img = RexpImg;
                    }
                    TomBcheck = 0;
                }
                // Felix bomb 
                if (Felix_bomb_activate && FelixBombY == i && FelixBombX == j) {
                    img = BombImg;
                }
                if (Felix_bomb_explode) {
                    if (checklife) { Checklife(FelixBombY, FelixBombX); checklfe = false; }
                    RemoveFragile(FelixBombY, FelixBombX);
                    if (FelixBombY - 1 == i && FelixBombX == j) {
                        img = UexpImg;
                    } if (FelixBombY + 1 == i && FelixBombX == j) {
                        img = DexpImg;
                    } if (FelixBombY == i && FelixBombX - 1 == j) {
                        img = LexpImg;
                    } if (FelixBombY == i && FelixBombX + 1 == j) {
                        img = RexpImg;
                    }
                    FelixBcheck = 0;
                }

                if (Tom_arrow_activate && TomArrowY == i && TomArrowX == j) { img = TArrowImg; TArrowPath(TomArrowY, TomArrowX); }

                if (Felix_arrow_activate && FelixArrowY == i && FelixArrowX == j) { img = FArrowImg; FArrowPath(FelixArrowY, FelixArrowX); }

                ctx.drawImage(img,
                (j * (BRICKWIDTH + PADDING)) + PADDING,
                (i * (BRICKHEIGHT + PADDING)) + PADDING,
                BRICKWIDTH, BRICKHEIGHT);
            }
        }
    }
}

function TArrowPath(x, y) {
    var i, j;
    i = x; j = y;
    if (board[i][j] == 'F') { board[i][j] = 'E'; ClearTArrows(); }
    else if (board[i][j] == 'S') { ClearTArrows(); }
    else if (i == FelixY && j == FelixX) { InitializeFelix(); ClearTArrows(); }
    else if ((i == 0 && j == 0) || (i == 0 && j == NCOLS - 1) || (i == NROWS - 1 && j == 0) || (i == NROWS - 1 && j == NCOLS - 1))
    { ClearTArrows(); }
}


function FArrowPath(x, y) {
    console.log("Checked");
    var i, j;
    i = x; j = y;
    if (board[i][j] == 'F') { board[i][j] = 'E'; ClearFArrows(); }
    else if (board[i][j] == 'S') { ClearFArrows(); }
    else if (i == TomY && j == TomX) { InitializeTom(); ClearFArrows(); }
    else if ((i == 0 && j == 0) || (i == 0 && j == NCOLS - 1) || (i == NROWS - 1 && j == 0) || (i == NROWS - 1 && j == NCOLS - 1))
    { ClearFArrows(); }
}

function RemoveFragile(x, y) {
    var i, j;
    i = x; j = y;
    if (board[i][j] == 'F') board[i][j] = 'E';
    if (i - 1 > -1) { if (board[i - 1][j] == 'F') board[i - 1][j] = 'E'; }
    if (i + 1 < NROWS) { if (board[i + 1][j] == 'F') board[i + 1][j] = 'E'; }
    if (j - 1 > -1) { if (board[i][j - 1] == 'F') board[i][j - 1] = 'E'; }
    if (j + 1 < NCOLS) { if (board[i][j + 1] == 'F') board[i][j + 1] = 'E'; }
    else return null;
}

// Functions to keep animations of 'Bomb' and 'explosion' under control
function TomBombExp() { // Activate explosion images
    Tom_bomb_activate = false;
    Tom_bomb_explode = true;
    checklife = true;
    var t = setTimeout('ClearTomB()', 1000);
}
function ClearTomB() { // clear explosion images
    Tom_bomb_explode = false;
}

function FelixBombExp() { // Activate explosion images
    Felix_bomb_activate = false;
    Felix_bomb_explode = true;
    checklife = true;
    var t = setTimeout('ClearFelixB()', 1000);

}
function ClearFelixB() {// clear explosion images
    Felix_bomb_explode = false;
}

// check the presence of Tom or Felix in explosion area
function Checklife(y, x) {
    var i, j;
    j = x; i = y;
    if (i == TomY && j == TomX) InitializeTom();
    if (i - 1 == TomY && j == TomX) InitializeTom();
    if (i + 1 == TomY && j == TomX) InitializeTom();
    if (i == TomY && j - 1 == TomX) InitializeTom();
    if (i == TomY && j + 1 == TomX) InitializeTom();

    if (i == FelixY && j == FelixX) InitializeFelix();
    if (i - 1 == FelixY && j == FelixX) InitializeFelix();
    if (i + 1 == FelixY && j == FelixX) InitializeFelix();
    if (i == FelixY && j - 1 == FelixX) InitializeFelix();
    if (i == FelixY && j + 1 == FelixX) InitializeFelix();
}

// Reset Tom's psition and decrease life
function InitializeTom() {
    TomX = NCOLS - 1;
    TomY = NROWS - 1;
    DecreaseLifeTom();
}

// Reset Felix's psition and decrease life
function InitializeFelix() {
    FelixX = 0;
    FelixY = 0;
    DecreaseLifeFelix();
}

function CatchMouseTom(x, y) {

}

function CatchMouseFelix(x, y) {

}

function IO(U, V) {//LA MOD String Version. A tiny ajax library.  by, DanDavis
    var X = !window.XMLHttpRequest ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
    X.open(V ? 'PUT' : 'GET', U, false);
    X.setRequestHeader('Content-Type', 'text/html')
    X.send(V ? V : '');
    return X.responseText;
}

function IncreaseLifeTom() {
    $('#LivesTom').text(++lifeTom);
}

function DecreaseLifeTom() {
    $('#LivesTom').text(--lifeTom);
}

function IncreaseLifeFelix() {
    $('#LivesFelix').text(++lifeFelix);
}

function DecreaseLifeFelix() {
    $('#LivesFelix').text(--lifeFelix);
}

function IncreaseScoreTom() {
    $('#ScoreTom').text(++scoreTom);
}

function IncreaseScoreFelix() {
    $('#ScoreFelix').text(++scoreFelix);
}

function DecreaseBombTom() {
    $('#BombTom').text(TomBcount);
}

function DecreaseBombFelix() {
    $('#BombFelix').text(FelixBcount);
}
