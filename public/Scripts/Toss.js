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

//Starting Toss Functionality
$(document).ready(function () {
    $('#coinImageDiv').hide();
    $('#effect').hide();

    $('#tossDiv').click(function () {
        $('#coinImageDiv').css("z-index", "1");
    });

    $('#nextLevelDiv').click(function () {
        mapValue++;
        $('#nextLevel').attr('href', 'game.html?Map=Map' + mapValue + '.txt&value=' + mapValue + '&TomScore=' + scoreTom + '&FelixScore =' + scoreFelix);
        window.location = 'game.html?Map=Map' + mapValue + '.txt&value=' + mapValue + '&TomScore=' + scoreTom + '&FelixScore =' + scoreFelix;
    });

    $('#coinParent').click(function () {
        posclicked(0);
        setTimeout(function () {
            runEffect();
        }, 1000);
    });
});

function tossClick() {
    $('#coinImageDiv').show();
}

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

function runEffect() {
    // get effect type from 
    var selectedEffect = "slide";

    // most effect types need no options passed by default
    var options = {};
    // some effects have required parameters
    if (selectedEffect === "scale") {
        options = { percent: 100 };
    } else if (selectedEffect === "size") {
        options = { to: { width: 280, height: 185} };
    }

    // run the effect
    var str = $("p:first").text();
    $("#winner").html(tossWinner + " Wins");
    $("#effect").show(selectedEffect, options, 500, callback);
};

function callback() {
    setTimeout(function () {
        //$( "#coinImageDiv:visible" ).removeAttr( "style" ).fadeOut();
        $('#coinParent').hide();
        $('#effect').hide();
        $('#coinImageDiv').css("z-index", "0");
        $('#toss').attr('href', 'maps.html');
        window.location = 'maps.html';
    }, 3000);
};
// Ending Toss Functionality