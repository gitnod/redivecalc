var manaCalcButton = document.getElementById("manaCalcButton");
var sarenCalcButton = document.getElementById("sarenCalcButton");
var yukariCalcButton = document.getElementById("yukariCalcButton");

// to mana expenditure calculator
manaCalcButton.addEventListener("click", function() {
    window.location = './mana/';
})

// to saren distance calculator
sarenCalcButton.addEventListener("click", function() {
    window.location = './saren/';
})

// to yukari skill target calculator
yukariCalcButton.addEventListener("click", function() {
    window.location = './yukari/';
})