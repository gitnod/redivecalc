
// load HTML objects
var desc = document.getElementById("desc");

var calcTypeSimple = document.getElementById("calcTypeSimple");
var calcTypeAdvanced = document.getElementById("calcTypeAdvanced");

var backButton = document.getElementById("backButton");

var expCharacterTable;

var expPotionArray = {미니:60, 일반:300, 하이:1500, 메가:7500};
var expPotionInputsArray = {미니:"expPotionInputTier1", 일반:"expPotionInputTier2", 하이:"expPotionInputTier3", 메가:"expPotionInputTier4"};

var resultTableLength = 0;
var resultTableRows = new Object;
var expExpenditures = new Object;

// load exp expenditure table after page load
window.onload = function() {

    // locate exp expenditure table file
    fileURLString = "https://raw.githubusercontent.com/gitnod/redivecalc/gh-pages/data/expCharacterTable.csv";

    // read exp expenditure table
    Papa.parse(fileURLString, {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {

            // save exp expenditure table
            expCharacterTable = results.data;

        }
    });

}

// activate simple calculation mode
calcTypeSimple.addEventListener("click", function() {

    // update calcType button aesthetics
    calcTypeSimple.className = "btn btn-success btn-block";
    calcTypeAdvanced.className = "btn btn-outline-success btn-block";

    // update calculation button row
    calcRowSimple.hidden = false;
    calcRowAdvanced.hidden = true;

    // hide result table
    resultTable.hidden = true;

    // trigger calc button click
    $('#calculateExpButton').trigger("click");
})

// activate advanced calculation mode
calcTypeAdvanced.addEventListener("click", function() {

    // update calcType button aesthetics
    calcTypeSimple.className = "btn btn-outline-success btn-block";
    calcTypeAdvanced.className = "btn btn-success btn-block";

    // update calculation button row
    calcRowSimple.hidden = true;
    calcRowAdvanced.hidden = false;

    // unhide result table
    resultTable.hidden = false;

    // update table
    // updateExpenditure();
})

// back to index.html
backButton.addEventListener("click", function() {
    window.location = '../';
})