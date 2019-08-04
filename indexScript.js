var sarenCalcButton = document.getElementById("sarenCalcButton");
var yukariCalcButton = document.getElementById("yukariCalcButton");
var manaCalcButton = document.getElementById("manaCalcButton");
var expCalcButton = document.getElementById("expCalcButton");

// to saren distance calculator
sarenCalcButton.addEventListener("click", function() {
    window.location = './saren/';
})

// to yukari skill target calculator
yukariCalcButton.addEventListener("click", function() {
    window.location = './yukari/';
})

// to mana expenditure calculator
manaCalcButton.addEventListener("click", function() {
    window.location = './mana/';
})

// to exp expenditure calculator
expCalcButton.addEventListener("click", function() {
    window.location = './exp/';
})