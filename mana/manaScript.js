
// load HTML objects
var desc = document.getElementById("desc");

var calcTypeSimple = document.getElementById("calcTypeSimple");
var calcTypeAdvanced = document.getElementById("calcTypeAdvanced");

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

var calcRowSimple = document.getElementById("calcRowSimple");
var calcRowAdvanced = document.getElementById("calcRowAdvanced");
var calculateExpenditureButton = document.getElementById("calculateExpenditureButton");
var numberOfCharacters = document.getElementById("numberOfCharacters");
var addExpenditureButton = document.getElementById("addExpenditureButton");

var resultText = document.getElementById("resultText");
var resultTable = document.getElementById("resultTable");
var resultTableBody = document.getElementById("resultTableBody");
var backButton = document.getElementById("backButton");

var manaSkillTable;

var resultTableLength = 0;
var resultTableRows = new Object;
var manaExpenditures = new Object;

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
    var lvlTargetLargerThanCurrent = true;
    for(j=0; j<4; j++) {
        if(currentLvl[j] < 1) {
            lvlCurrentInRange = false;
        }
        if(targetLvl[j] > manaSkillTable.length) {
            lvlTargetInRange = false;
        }
        if(targetLvl[j] < currentLvl[j]) {
            lvlTargetLargerThanCurrent = false;
        }
    }

    if(lvlCurrentInRange == false) {

        resultText.innerHTML = '오류: 현재 스킬 레벨은 최소 1이어야 합니다.';

    } else if(lvlTargetInRange == false) {

        resultText.innerHTML = '오류: 목표 스킬 레벨은 최대 ' + manaSkillTable.length + '이어야 합니다.';

    } else if(lvlTargetLargerThanCurrent == false) {

        resultText.innerHTML = '오류: 목표 스킬 레벨은 현재 스킬 레벨보다 낮아야 합니다.';

    } else {

        // incrase number of rows by 1
        resultTableLength += 1;
        rowNumber = resultTableLength;

        // initialize html info
        var resultTableRowHtml = '';

        // fill in the table rows
        resultTableRowHtml += '<tr>';
        for(j=0; j<4; j++) {
            resultTableRowHtml += '<td>' + currentLvl[j] + '</td>';
        }
        for(j=0; j<4; j++) {
            resultTableRowHtml += '<td>' + targetLvl[j] + '</td>';
        }
        resultTableRowHtml += '<td>' + characters + '</td>';
        resultTableRowHtml += '<td><button type="button" id="deleteTableRow' + rowNumber + '" onclick="deleteExpenditure(' + rowNumber + ')" class="btn btn-danger">삭제</button></td>';
        resultTableRowHtml += '</tr>';

        // add table row to the table rows list
        resultTableRows[rowNumber] = resultTableRowHtml;

        // add mana expenditure
        manaExpenditures[rowNumber] = computeManaExpenditure(currentLvl, targetLvl, characters);

        // update display
        updateExpenditure();

    }

}

// delete expenditure from the table and the total expenditure variable
function deleteExpenditure(rowNumber) {

    // delete table row
    delete resultTableRows[rowNumber];
    delete manaExpenditures[rowNumber];

    // update display
    updateExpenditure();

}

// update display
function updateExpenditure() {
    
    // initialize table html
    var resultTableHtml = "";

    // update table
    for(var key in resultTableRows) {
        resultTableHtml += resultTableRows[key];
    }
    $("#resultTableBody").html(resultTableHtml);

    // update total expenditure
    if(manaExpenditures.length == 0) {
        resultText.innerHTML = '소비 마나: 0';
    } else {
        var totalExpenditure = 0;
        for(var key in manaExpenditures) {
            totalExpenditure += manaExpenditures[key];
        }
        resultText.innerHTML = '소비 마나: ' + totalExpenditure;
    }
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

// activate simple calcucation mode
calcTypeSimple.addEventListener("click", function() {

    // update calcType button aesthetics
    calcTypeSimple.className = "btn btn-success btn-block";
    calcTypeAdvanced.className = "btn btn-outline-success btn-block";

    // update calculation button row
    calcRowSimple.hidden = false;
    calcRowAdvanced.hidden = true;

    // hide result table
    resultTable.hidden = true;

    // update description
    desc.innerHTML = '캐릭터 하나의 스킬 레벨을 목표치까지 상승시키는데 필요한 마나를 계산합니다.';

    // trigger calc button click
    $('#calculateExpenditureButton').trigger("click");
})

// activate simple calcucation mode
calcTypeAdvanced.addEventListener("click", function() {

    // update calcType button aesthetics
    calcTypeSimple.className = "btn btn-outline-success btn-block";
    calcTypeAdvanced.className = "btn btn-success btn-block";

    // update calculation button row
    calcRowSimple.hidden = true;
    calcRowAdvanced.hidden = false;

    // unhide result table
    resultTable.hidden = false;

    // update description
    desc.innerHTML = '여러 캐릭터들의 스킬 레벨을 목표치까지 상승시키는데 필요한 마나를 계산합니다.';

    // update table
    updateExpenditure();
})



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

calculateExpenditureButton.addEventListener("click", function() {

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

    // display result
    resultText.innerHTML = '소비 마나: ' + computeManaExpenditure(currentLvlArray, targetLvlArray, 1);
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