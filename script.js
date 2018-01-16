//Declare global variables
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var colourCode = [
  "red", //0
  "yellow", //1
  "green", //2
  "blue" //3
];
var soundCode = [
  redBeep = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
  yellowBeep = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
  greenBeep = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
  blueBeep = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
];
var beepSequence;
var roundSequence;
var loggingClicks;
var inputSequence;
var roundCounter;

//Main method
$(document).ready(function() {
  //Draw the canvas
  drawAllOff();
  //Beep click trigger
  $("#game").click(function(e) {
    //Declare click event variables
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    beep(Math.floor(x / 250));
    if (loggingClicks) {
      inputSequence.push(Math.floor(x / 250));
      compareSequences();
    }
  });
  //Start/Play Again button handler
  $("button").click(function() {
    playGame();
  });
  
});

//Main game function
function playGame() {
  //Revert HTML/CSS to game view
  $("#menu").css("display", "none");
  $("#game-menu").css("display", "block");
  $("#play-again-button").css("display", "none");
  $("#round-counter").html("Round 1");
  $("#restart-button").css("display", "initial");
  
  //Generate beep sequence array
  beepSequence = [];
  for (var i = 0; i < 20; i++) {
    beepSequence.push(Math.floor(Math.random() * 4));
  }
  
  roundCounter = 0;
  
  playRound();
  
}

function playRound() {
  clicksOff();
  roundSequence = [];
  for (var i = 0; i <= roundCounter; i++) {
    roundSequence.push(beepSequence[i]);
  }
  playSequence(0, roundCounter);
}


//Plays the beep sequence for the current round recursively because JavaScript is a pain in the ass
function playSequence(low, high) {
  beep(beepSequence[low]);
  if (low < high) {
    setTimeout(function() {
      playSequence(low + 1, high);
    }, 1000);
  }else {
    setTimeout(function() {
      clicksOn();
    }, 1000);
  }
}

function compareSequences() {
  if (inputSequence[inputSequence.length - 1] == roundSequence[inputSequence.length - 1]) {
    if (inputSequence.length == roundSequence.length) {
      clicksOff();
      console.log("pass");
      if (roundCounter != 19) {
        roundCounter++;
        setTimeout(function() {
          $("#round-counter").html("Round " + (roundCounter + 1));
          playRound();
        }, 1000);
      }else {
        $("#round-counter").html("You won all 20 rounds!");
        $("#play-again-button").css("display", "initial");
        $("#restart-button").css("display", "none");
      }
    }
  }else {
    clicksOff();
    console.log("fail");
    setTimeout(function() {
      if ($("#strict-toggle").is(":checked")) {
        $("#round-counter").html("Game Over");
        $("#play-again-button").css("display", "initial");
        $("#restart-button").css("display", "none");
      }else {
        $("#round-counter").html("You've made a mistake. Try again.");
        setTimeout(function() {
          $("#round-counter").html("Round " + (roundCounter + 1));
          playRound();
        }, 2000);
      }
    }, 1000);
  }
}

function clicksOn() {
  loggingClicks = true;
  inputSequence = [];
  document.getElementById('game').style.pointerEvents = 'auto';
}

function clicksOff() {
  loggingClicks = false;
  document.getElementById('game').style.pointerEvents = 'none';
}

//Draw all lights turned off
function drawAllOff() {
  //Draw black background
  ctx.rect(0, 0, 1000, 250);
  ctx.fillStyle = "black";
  ctx.fill();
  //Draw lights
  for (var i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(250 * i + 125, 125, 125, 0, 2 * Math.PI, true);
    ctx.fillStyle = colourCode[i];
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "purple";
    ctx.stroke();
  }
}

//Cause a light to beep
function beep(index) {
  //Change appearance of light
  ctx.beginPath();
  ctx.arc(250 * index + 125, 125, 125, 0, 2 * Math.PI, true);
  ctx.fillStyle = colourCode[index];
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "white";
  ctx.stroke();
  //Beep sound
  soundCode[index].play();
  //Change appearance back
  setTimeout(function() {
    ctx.beginPath();
    ctx.arc(250 * index + 125, 125, 125, 0, 2 * Math.PI, true);
    ctx.fillStyle = colourCode[index];
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "purple";
    ctx.stroke();
  }, 500);
}