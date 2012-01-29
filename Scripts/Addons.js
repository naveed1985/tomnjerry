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
    if (TomAddon == 3) { // Life
        IncreaseLifeTom();
    }
}

function SetFelixAddon() {
    FelixAddon = selectedAddon;
    selectedAddon = -1;
    $("#FelixAddon").attr("src", "images/" + FelixAddon + ".gif");
    $("#imgTDFelix").text(addonDetail[FelixAddon]);
    clearInterval(felixAddonClearInterval);
    felixAddonClearInterval = setInterval(ClearFelixAddon, 10000);
    if (FelixAddon == 3) { // Life
        IncreaseLifeFelix();
    }
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
            if (board[i][j] == 'E' &&
                i != FelixX && j != FelixY &&
                i != TomX && j != TomY) {
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
    } else if (TomAddon == 1 || TomAddon == 2) { // 1 = jumper  ---  2 = pusher
        var newLocX = locx;
        var newLocY = locy;

        var factorX = 0;
        var factorY = 0;

        if (locy - 1 == TomY) { // moved down
            newLocY = locy + 1;
            factorY = 1;
        } else if (locy + 1 == TomY) { // moved up
            newLocY = locy - 1;
            factorY = -1;
        } else if (locx - 1 == TomX) { // moved right
            newLocX = locx + 1;
            factorX = 1;
        } else if (locx + 1 == TomX) { // moved left
            newLocX = locx - 1;
            factorX = -1;
        }

        if (newLocX != FelixX || newLocY != FelixY) {
            if (board[newLocY][newLocX] == 'E' && board[locy][locx] == 'F' && TomAddon == 2) { // push - Checking for fragile, because if next block is fragile, we can move it, also checking that the block next to fragile is empty
                board[newLocY][newLocX] = 'F';
                board[locy][locx] = 'E';
                TomX = locx;
                TomY = locy;
            }

            if (TomAddon == 1) { // jump
                // Using simple if else structure to keep the code simple

                if (board[newLocY][newLocX] == 'E') { // move to next empty block
                    TomX = newLocX;
                    TomY = newLocY;
                } else if (board[newLocY + factorY][newLocX + factorX] == 'E') { // or the next
                    TomX = newLocX + factorX;
                    TomY = newLocY + factorY;
                } else if (board[newLocY + factorY * 2][newLocX + factorX * 2] == 'E') { // or the next
                    TomX = newLocX + factorX * 2;
                    TomY = newLocY + factorY * 2;
                } else if (board[newLocY + factorY * 3][newLocX + factorX * 3] == 'E') { // or the next
                    TomX = newLocX + factorX * 3;
                    TomY = newLocY + factorY * 3;
                } else if (board[newLocY + factorY * 4][newLocX + factorX * 4] == 'E') { // or the next
                    TomX = newLocX + factorX * 4;
                    TomY = newLocY + factorY * 4;
                }
            }
        }
    }
}

function HandleAddonFelix(locx, locy, rec) {//, Addon, CurrectCatX, CurrectCatY, OtherCatX, OtherCatY) {
    if (FelixAddon == 0 && board[locy][locx] == 'F') { // drill
        board[locy][locx] = 'E';
        FelixX = locx;
        FelixY = locy;
    } else if (FelixAddon == 1 || FelixAddon == 2) { // 1 = jumper  ---  2 = pusher
        var newLocX = locx;
        var newLocY = locy;

        var factorX = 0;
        var factorY = 0;

        if (locy - 1 == FelixY) { // moved down
            newLocY = locy + 1;
            factorY = 1;
        } else if (locy + 1 == FelixY) { // moved up
            newLocY = locy - 1;
            factorY = -1;
        } else if (locx - 1 == FelixX) { // moved right
            newLocX = locx + 1;
            factorX = 1;
        } else if (locx + 1 == FelixX) { // moved left
            newLocX = locx - 1;
            factorX = -1;
        }

        if (newLocX != TomX || newLocY != TomY) {
            if (board[newLocY][newLocX] == 'E' && board[locy][locx] == 'F' && FelixAddon == 2) { // push - Checking for fragile, because if next block is fragile, we can move it, also checking that the block next to fragile is empty
                board[newLocY][newLocX] = 'F';
                board[locy][locx] = 'E';
                FelixX = locx;
                FelixY = locy;
            }

            if (FelixAddon == 1) { // jump
                // Using simple if else structure to keep the code simple

                if (board[newLocY][newLocX] == 'E') { // move to next empty block
                    FelixX = newLocX;
                    FelixY = newLocY;
                } else if (board[newLocY + factorY][newLocX + factorX] == 'E') { // or the next
                    FelixX = newLocX + factorX;
                    FelixY = newLocY + factorY;
                } else if (board[newLocY + factorY * 2][newLocX + factorX * 2] == 'E') { // or the next
                    FelixX = newLocX + factorX * 2;
                    FelixY = newLocY + factorY * 2;
                } else if (board[newLocY + factorY * 3][newLocX + factorX * 3] == 'E') { // or the next
                    FelixX = newLocX + factorX * 3;
                    FelixY = newLocY + factorY * 3;
                } else if (board[newLocY + factorY * 4][newLocX + factorX * 4] == 'E') { // or the next
                    FelixX = newLocX + factorX * 4;
                    FelixY = newLocY + factorY * 4;
                }
            }
        }
    }
}