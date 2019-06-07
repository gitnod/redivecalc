
// load HTML objects
var lvlCurrentRestrict = document.getElementById("lvlCurrentRestrict");
var lvlCurrentUb = document.getElementById("lvlCurrentUb");
var lvlCurrent1st = document.getElementById("lvlCurrent1st");
var lvlCurrent2nd = document.getElementById("lvlCurrent2nd");
var lvlCurrentEX = document.getElementById("lvlCurrentEX");
var lvlTargetRestrict = document.getElementById("lvlTargetRestrict");
var lvlTargetUb = document.getElementById("lvlTargetUb");
var lvlTarget1st = document.getElementById("lvlTarget1st");
var lvlTarget2nd = document.getElementById("lvlTarget2nd");
var lvlTargetEX = document.getElementById("lvlTargetEX");
var numberOfCharacters = document.getElementById("numberOfCharacters");
var addExpenditureButton = document.getElementById("addExpenditureButton");
var expenditureTableBody = document.getElementById("expenditureTableBody");
var result = document.getElementById("result");
var backButton = document.getElementById("backButton");

var manaSkillTable;
var lvlTableRows = [];
var manaExpenditures = [];

// compute mana expenditure given current and target skill levels
function computeManaExpenditure(currentLvl, targetLvl, characters) {

    // initialize mana expenditure
    var manaExpenditure = 0;

    // compute mana expenditure
    for(var k=0; k<4; k++) {
        if(targetLvl[k] >= currentLvl[k]) {
            manaExpenditure += manaSkillTable[targetLvl[k]-1]["Cumul"] - manaSkillTable[currentLvl[k]-1]["Cumul"];
        }
    }

    // multiply by number of characters
    manaExpenditure = manaExpenditure * characters;

    // return result
    return manaExpenditure;
}

// add expenditure to the table and the total expenditure variable
function addExpenditure(currentLvl, targetLvl, characters) {

    // initialize iterator
    var j=0;

    // check current and target levels are in the computable range
    var lvlCurrentInRange = true;
    var lvlTargetInRange = true;
    for(j=0; j<4; j++) {
        if(currentLvl[j] < 1) {
            lvlCurrentInRange = false;
        }
        if(targetLvl[j] > manaSkillTable.length) {
            lvlTargetInRange = false;
        }
    }

    if(lvlCurrentInRange = false) {
        dd
    }

    // read number of added rows
    rowNumber = lvlTableRows.length + 1;

    // initialize html info
    var lvlTableRowHtml = '';

    // fill in the table rows
    lvlTableRowHtml += '<tr>';
    for(j=0; j<4; j++) {
        lvlTableRowHtml += '<td>' + currentLvl[j] + '</td>';
    }
    for(j=0; j<4; j++) {
        lvlTableRowHtml += '<td>' + targetLvl[j] + '</td>';
    }
    lvlTableRowHtml += '<td>' + characters + '</td>';
    lvlTableRowHtml += '<td><button type="button" id="deleteTableRow' + rowNumber + '" onclick="deleteExpenditure(' + rowNumber + ')" class="btn btn-danger">삭제</button></td>';
    lvlTableRowHtml += '</tr>';

    // add table row to the table rows list
    lvlTableRows.push(lvlTableRowHtml);

    // add mana expenditure
    manaExpenditures.push(computeManaExpenditure(currentLvl, targetLvl, characters));

    // update display
    updateExpenditure();

}

// delete expenditure from the table and the total expenditure variable
function deleteExpenditure(rowNumber) {

    // delete table row
    lvlTableRows[rowNumber-1] = '';
    manaExpenditures[rowNumber-1] = 0;

    // update display
    updateExpenditure();

}

// update display
function updateExpenditure() {
    
    // initialize table html
    var lvlTableHtml = "";

    // update table
    for(var j=0; j<lvlTableRows.length; j++) {
        lvlTableHtml += lvlTableRows[j];
    }
    $("#expenditureTableBody").html(lvlTableHtml);

    // update total expenditure
    result.innerHTML = '소비 마나: ' + manaExpenditures.reduce(function(a,b) { return a+b; });
}

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

// toggle restricted input status
lvlCurrentRestrict.addEventListener("change", function() {

    // read current status
    if(this.checked == true) {
        lvlCurrent1st.value = lvlCurrentUb.value;
        lvlCurrent2nd.value = lvlCurrentUb.value;
        lvlCurrentEX.value = lvlCurrentUb.value;
        lvlCurrent1st.disabled = true;
        lvlCurrent2nd.disabled = true;
        lvlCurrentEX.disabled = true;
    } else {
        lvlCurrent1st.disabled = false;
        lvlCurrent2nd.disabled = false;
        lvlCurrentEX.disabled = false;
    }
})

// toggle restricted input status
lvlTargetRestrict.addEventListener("change", function() {

    // read current status
    if(this.checked == true) {
        lvlTarget1st.value = lvlTargetUb.value;
        lvlTarget2nd.value = lvlTargetUb.value;
        lvlTargetEX.value = lvlTargetUb.value;
        lvlTarget1st.disabled = true;
        lvlTarget2nd.disabled = true;
        lvlTargetEX.disabled = true;
    } else {
        lvlTarget1st.disabled = false;
        lvlTarget2nd.disabled = false;
        lvlTargetEX.disabled = false;
    }
})

// auto-change other fields if restricted input is on
lvlCurrentUb.addEventListener("change", function() {

    // change other fields if restricted input is on
    if(lvlCurrentRestrict.checked == true) {
        lvlCurrent1st.value = lvlCurrentUb.value;
        lvlCurrent2nd.value = lvlCurrentUb.value;
        lvlCurrentEX.value = lvlCurrentUb.value;
    }

})

// auto-change other fields if restricted input is on
lvlTargetUb.addEventListener("change", function() {

    // change other fields if restricted input is on
    if(lvlCurrentRestrict.checked == true) {
        lvlTarget1st.value = lvlTargetUb.value;
        lvlTarget2nd.value = lvlTargetUb.value;
        lvlTargetEX.value = lvlTargetUb.value;
    }

})

addExpenditureButton.addEventListener("click", function() {

    // read current levels
    var currentLvlArray = [];
    currentLvlArray.push(lvlCurrentUb.value);
    currentLvlArray.push(lvlCurrent1st.value);
    currentLvlArray.push(lvlCurrent2nd.value);
    currentLvlArray.push(lvlCurrentEX.value);

    // read target levels
    var targetLvlArray = [];
    targetLvlArray.push(lvlTargetUb.value);
    targetLvlArray.push(lvlTarget1st.value);
    targetLvlArray.push(lvlTarget2nd.value);
    targetLvlArray.push(lvlTargetEX.value);

    // add expenditure info
    addExpenditure(currentLvlArray, targetLvlArray, Number(numberOfCharacters.value));

})

// back to index.html
backButton.addEventListener("click", function() {
    window.location = '../';
})