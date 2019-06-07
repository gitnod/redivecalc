
// load HTML objects
var lvlCurrentRestrict = document.getElementById("lvlCurrentUb");
var lvlCurrentUb = document.getElementById("lvlCurrentUb");
var lvlCurrent1st = document.getElementById("lvlCurrent1st");
var lvlCurrent2nd = document.getElementById("lvlCurrent2nd");
var lvlCurrentEX = document.getElementById("lvlCurrentEX");
var lvlTargetRestrict = document.getElementById("lvlTargetRestrict");
var lvlTargetUb = document.getElementById("lvlTargetUb");
var lvlTarget1st = document.getElementById("lvlTarget1st");
var lvlTarget2nd = document.getElementById("lvlTarget2nd");
var lvlTargetEX = document.getElementById("lvlTargetEX");
var addLvlInfo = document.getElementById("addLvlInfo");
var lvlTableBody = document.getElementById("lvlTableBody");
var result = document.getElementById("result");
var backButton = document.getElementById("backButton");

var manaSkillTable;

// load character position map after page load
window.onload = function() {

    // locate character position table file
    fileURLString = "https://raw.githubusercontent.com/gitnod/redivecalc/gh-pages/data/manaSkillTable.csv";

    // read character position table
    Papa.parse(fileURLString, {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {

            // save character position table
            manaSkillTable = results.data;

        }
    });

}

// back to index.html
backButton.addEventListener("click", function() {
    window.location = '../';
})