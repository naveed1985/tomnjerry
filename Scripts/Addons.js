var addons = ["drill", "jump", "pusher", "life"];
var addonDetail = ["Break Fragile Walls", "Jump Over Walls", "Push Fragile Walls", "Life plus"];
var addonsImgs = new Array(); // regular array (add an optional integer
addonsImgs[0] = new Image();
addonsImgs[0].src = 'Images/drill1.png';
addonsImgs[1] = new Image();
addonsImgs[1].src = 'Images/jump1.png';
addonsImgs[2] = new Image();
addonsImgs[2].src = 'Images/pusher1.png';
addonsImgs[3] = new Image();
addonsImgs[3].src = 'Images/life.png';
var AddonX = 0;
var AddonY = 0;
var oldAddonLoc = -1;
var selectedAddon = -1;

var tomAddonClearInterval;
var felixAddonClearInterval;

function SetTomAddon() {
    TomAddon = selectedAddon;
    selectedAddon = -1;
    $("#TomAddon").attr("src", "images/" + TomAddon + ".gif");
    $("#imgTDTom").text(addonDetail[TomAddon]);
    clearInterval(tomAddonClearInterval);
    tomAddonClearInterval = setInterval(ClearTomAddon, 10000);
}

function SetFelixAddon() {
    FelixAddon = selectedAddon;
    selectedAddon = -1;
    $("#FelixAddon").attr("src", "images/" + FelixAddon + ".gif");
    $("#imgTDFelix").text(addonDetail[FelixAddon]);
    clearInterval(felixAddonClearInterval);
    felixAddonClearInterval = setInterval(ClearFelixAddon, 10000);
}

function ClearTomAddon() {
    TomAddon = -1;
    $("#TomAddon").attr("src", "images/white.png");
    $("#imgTDTom").text("");
    clearInterval(tomAddonClearInterval);
}

function ClearFelixAddon() {
    FelixAddon = -1;
    $("#FelixAddon").attr("src", "images/white.png");
    $("#imgTDFelix").text("");
    clearInterval(felixAddonClearInterval);
}

// display  addon
function DisplayAddon() {
    var counter = 0;
    var rows = new Array();
    var cols = new Array();

    for (var i = 0; i < NROWS; i++) {
        for (var j = 0; j < NCOLS; j++) {
            if (board[i][j] == 'E') {
                rows[counter] = i;
                cols[counter] = j;
                counter++;
            }
        }
    }

    var randomnumber = -1;

    do {
        randomnumber = Math.floor(Math.random() * (counter + 1));
    } while ((randomnumber == oldAddonLoc) &&
            (rows[randomnumber] != FelixX || cols[randomnumber] != FelixY) &&
            (rows[randomnumber] != TomX || cols[randomnumber] != TomY) &&
            (rows[randomnumber] != TomBombX || cols[randomnumber] != TomBombY) &&
            (rows[randomnumber] != FelixBombX || cols[randomnumber] != FelixBombY)
    );

    oldAddonLoc = randomnumber;
    AddonX = cols[randomnumber];
    AddonY = rows[randomnumber];

    randomnumber = -1;
    do {
        randomnumber = Math.floor(Math.random() * addons.length);
    } while (selectedAddon == randomnumber);

    selectedAddon = randomnumber;

    return null;
}

function HandleAddonTom(locx, locy) {
    if (TomAddon == 0 && board[locy][locx] == 'F') { // drill
        board[locy][locx] = 'E';
        TomX = locx;
        TomY = locy;
    } else if (TomAddon == 1 || TomAddon == 2) { // jumper
        var newLocX = locx;
        var newLocY = locy;

        if (locy - 1 == TomY) { // moved down
            newLocY = locy + 1;
        } else if (locy + 1 == TomY) { // moved up
            newLocY = locy - 1;
        } else if (locx - 1 == TomX) { // moved right
            newLocX = locx + 1;
        } else if (locx + 1 == TomX) { // moved left
            newLocX = locx - 1;
        }

        if (board[newLocY][newLocX] == 'E' && (newLocX != FelixX || newLocY != FelixY)) {
            if (TomAddon == 1) {
                TomX = newLocX;
                TomY = newLocY;
            } else if (board[locy][locx] == 'F') {
                board[newLocY][newLocX] = 'F';
                board[locy][locx] = 'E';
                TomX = locx;
                TomY = locy;
            }
        }
    } else if (TomAddon == 3) { // Life
		IncreaseLifeTom();
	}
}

function HandleAddonFelix(locx, locy) {//, Addon, CurrectCatX, CurrectCatY, OtherCatX, OtherCatY) {
    if (FelixAddon == 0 && board[locy][locx] == 'F') { // drill
        board[locy][locx] = 'E';
        FelixX = locx;
        FelixY = locy;
    } else if (FelixAddon == 1 || FelixAddon == 2) { // jumper
        var newLocX = locx;
        var newLocY = locy;

        if (locy - 1 == FelixY) { // moved down
            newLocY = locy + 1;
        } else if (locy + 1 == FelixY) { // moved up
            newLocY = locy - 1;
        } else if (locx - 1 == FelixX) { // moved right
            newLocX = locx + 1;
        } else if (locx + 1 == FelixX) { // moved left
            newLocX = locx - 1;
        }

        if (board[newLocY][newLocX] == 'E' && (newLocX != TomX || newLocY != TomY)) {
            if (FelixAddon == 1) {
                FelixX = newLocX;
                FelixY = newLocY;
            } else if (board[locy][locx] == 'F') {
                board[newLocY][newLocX] = 'F';
                board[locy][locx] = 'E';
                FelixX = locx;
                FelixY = locy;
            }
        }
    } else if (FelixAddon == 3) { // Life
		IncreaseLifeFelix();
	}
}