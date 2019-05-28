var sarenCalcButton = document.getElementById("sarenCalcButton");
var yukariCalcButton = document.getElementById("yukariCalcButton");

// go to saren distance calculator
sarenCalcButton.addEventListener("click", function() {
    window.location = './saren/';
})

// go to yukari skill target calculator
yukariCalcButton.addEventListener("click", function() {
    window.location = './yukari/';
})