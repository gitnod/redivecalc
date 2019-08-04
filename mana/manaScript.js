
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

var gearButtonSimple = document.getElementById("gearButtonSimple");
var gearButtonAdvanced = document.getElementById("gearButtonAdvanced");
var gearEquipCheckbox = document.getElementById("gearEquipCheckbox");
var gearUpgradeCheckbox = document.getElementById("gearUpgradeCheckbox");
// var gearPresetLowRank = document.getElementById("gearPresetLowRank");
// var gearPresetHigherRank = document.getElementById("gearPresetHigherRank");
var gearInputSilver = document.getElementById("gearInputSilver");
var gearInputGold = document.getElementById("gearInputGold");
var gearInputPurple = document.getElementById("gearInputPurple");

var numberOfCharacters = document.getElementById("numberOfCharacters");
var addExpenditureButton = document.getElementById("addExpenditureButton");

var resultText = document.getElementById("resultText");
var resultTable = document.getElementById("resultTable");
var resultTableBody = document.getElementById("resultTableBody");
var backButton = document.getElementById("backButton");

var manaSkillTable;

// text string format: 은(d), 금(d), 보라(d)
var gearRegExp = /은\((\d)\),\s금\((\d)\),\s보라\((\d)\)/;
var gearInputsId = {은:"gearInputSilver", 금:"gearInputGold", 보라:"gearInputPurple"};
var gearEquipManaExpenditureArray = {은:10000, 금:25000, 보라:40000}; // https://www.youtube.com/watch?v=USfhgSKtSWA 06:30
var gearUpgradeManaExpenditureArray = {은:24000, 금:240000, 보라:360000};
// var gearPresetLowRankArray = {은:1, 금:5, 보라:0};
// var gearPresetHigherRankArray = {은:0, 금:3, 보라:0};

var resultTableLength = 0;
var resultTableRows = new Object;
var manaExpenditures = new Object;

// initialize gear equip and upgrade dialog and display
function initializeGearInfo() {

    for(var key in gearInputsId) {
        $('#' + gearInputsId[key]).val(0);
    }
    gearEquipCheckbox.checked = true;
    gearUpgradeCheckbox.checked = true;
    updateGearDisplay();
}

// create gear input dictionary from the text
function parseGearInfo() {

    var dictionary = new Object;
    for(var key in gearInputsId) {
        dictionary[key] = $('#' + gearInputsId[key]).val();
    }
    return dictionary;
}

// update gear upgrade display
function updateGearDisplay() {

    var gearText = [];
    for(var key in gearInputsId) {
        gearText.push(key + '(' + $('#' + gearInputsId[key]).val() + ')');
    }
    if(gearEquipCheckbox.checked == true) {
        gearText.push("장착 &#10003;");
    } else {
        gearText.push("장착 &#10007;");
    }
    if(gearUpgradeCheckbox.checked == true) {
        gearText.push("강화 &#10003;");
    } else {
        gearText.push("강화 &#10007;");
    }
    gearButtonSimple.innerHTML = gearText.join(', ');
    gearButtonAdvanced.innerHTML = gearText.join(', ');
}

// parse gear upgrade information from the text
function computeManaExpenditureForGears(gearDictionary) {

    var manaExpenditure = 0;
    var spendManaOnEquip = 0;
    var spendManaOnUpgrade = 0;

    if(gearEquipCheckbox.checked == true)   { spendManaOnEquip = 1; }
    if(gearUpgradeCheckbox.checked == true) { spendManaOnUpgrade = 1; }

    for(var key in gearDictionary) {
        manaExpenditure += gearDictionary[key] * (spendManaOnEquip * gearEquipManaExpenditureArray[key] + spendManaOnUpgrade * gearUpgradeManaExpenditureArray[key]);
    }

    return manaExpenditure;
}

// compute mana expenditure given current and target skill levels
function computeManaExpenditure(currentLvl, targetLvl, gearDictionary, characters) {

    // initialize mana expenditure
    var manaExpenditure = 0;

    // compute mana expenditure for skill level up
    for(var k=0; k<4; k++) {
        if(targetLvl[k] >= currentLvl[k]) {
            manaExpenditure += manaSkillTable[targetLvl[k]-1]["Cumul"] - manaSkillTable[currentLvl[k]-1]["Cumul"];
        }
    }

    // compute mana expenditure for gear upgrade
    manaExpenditure += computeManaExpenditureForGears(gearDictionary);

    // multiply by number of characters
    manaExpenditure = manaExpenditure * characters;

    // return result
    return manaExpenditure;
}

// check sanity of levels
function checkSanityOfLevels(currentLvl, targetLvl) {

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
        return false;

    } else if(lvlTargetInRange == false) {

        resultText.innerHTML = '오류: 목표 스킬 레벨은 최대 ' + manaSkillTable.length + '이어야 합니다.';
        return false;

    } else if(lvlTargetLargerThanCurrent == false) {

        resultText.innerHTML = '오류: 목표 스킬 레벨은 현재 스킬 레벨보다 낮아야 합니다.';
        return false;

    } else {

        return true;

    }

}

// add expenditure to the table and the total expenditure variable
function addExpenditure(currentLvl, targetLvl, gearDictionary, characters) {

    // initialize iterator
    var j=0;

    // check sanity of inputs
    isAdmissible = checkSanityOfLevels(currentLvl, targetLvl);

    if(isAdmissible == true) {

        // increase number of rows by 1
        resultTableLength += 1;
        rowNumber = resultTableLength;

        // initialize html info
        var resultTableRowHtml = '';

        // make deep copies of inputs
        var stringCurrentLvl = currentLvl.slice();
        var stringTargetLvl = targetLvl.slice();
        var stringGearDictionary = jQuery.extend(true, {}, gearDictionary);
        var stringGearChecked = new Object;

        // replace 0 with blank if current and target skill level match
        for(j=0; j<4; j++) {
            if(targetLvl[j] == currentLvl[j]) {
                stringCurrentLvl[j] = '';
                stringTargetLvl[j] = '';
            }
        }

        // replace 0 with blank in number of gears considered
        var countGears = 0;
        for(var key in gearDictionary) {
            countGears += gearDictionary[key];
            if(gearDictionary[key] == 0) {
                stringGearDictionary[key] = '';
            }
        }

        // replace check and cross marks with blank if no gear considered
        if(countGears == 0) {
            stringGearChecked["equip"] = '<td></td>';
            stringGearChecked["upgrade"] = '<td></td>';
        } else {
            if(gearEquipCheckbox.checked == true) {
                stringGearChecked["equip"] = '<td> &#10003; </td>';
            } else {
                stringGearChecked["equip"] = '<td> &#10007; </td>';
            }
            if(gearUpgradeCheckbox.checked == true) {
                stringGearChecked["upgrade"] = '<td> &#10003; </td>';
            } else {
                stringGearChecked["upgrade"] = '<td> &#10007; </td>';
            }
        }

        // fill in the table rows
        resultTableRowHtml += '<tr>';
        for(j=0; j<4; j++) {
            resultTableRowHtml += '<td>' + stringCurrentLvl[j] + '</td>';
        }
        for(j=0; j<4; j++) {
            resultTableRowHtml += '<td>' + stringTargetLvl[j] + '</td>';
        }
        for(var key in gearDictionary) {
            resultTableRowHtml += '<td>' + stringGearDictionary[key] + '</td>';
        }
        resultTableRowHtml += stringGearChecked["equip"];
        resultTableRowHtml += stringGearChecked["upgrade"];
        resultTableRowHtml += '<td>' + characters + '</td>';
        resultTableRowHtml += '<td><button type="button" id="deleteTableRow' + rowNumber + '" onclick="deleteExpenditure(' + rowNumber + ')" class="btn btn-danger btn-sm">삭제</button></td>';
        resultTableRowHtml += '</tr>';

        // add table row to the table rows list
        resultTableRows[rowNumber] = resultTableRowHtml;

        // add mana expenditure
        manaExpenditures[rowNumber] = computeManaExpenditure(currentLvl, targetLvl, gearDictionary, characters);

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

// load mana expenditure table after page load
window.onload = function() {

    // locate mana expenditure table file
    fileURLString = "https://raw.githubusercontent.com/gitnod/redivecalc/gh-pages/data/manaSkillTable.csv";

    // read mana expenditure table
    Papa.parse(fileURLString, {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {

            // save mana expenditure table
            manaSkillTable = results.data;

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

    // update description
    desc.innerHTML = '캐릭터 하나의 스킬 레벨 상승과 장비 장착 및 강화에 필요한 마나를 계산합니다.';

    // trigger calc button click
    $('#calculateExpenditureButton').trigger("click");
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

    // update description
    desc.innerHTML = '여러 캐릭터들의 스킬 레벨 상승과 장비 장착 및 강화에 필요한 마나를 계산합니다.';

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
    currentLvlArray.push(Number(lvlCurrentUb.value));
    currentLvlArray.push(Number(lvlCurrent1st.value));
    currentLvlArray.push(Number(lvlCurrent2nd.value));
    currentLvlArray.push(Number(lvlCurrentEX.value));

    // read target levels
    var targetLvlArray = [];
    targetLvlArray.push(Number(lvlTargetUb.value));
    targetLvlArray.push(Number(lvlTarget1st.value));
    targetLvlArray.push(Number(lvlTarget2nd.value));
    targetLvlArray.push(Number(lvlTargetEX.value));

    // check sanity of inputs
    isAdmissible = checkSanityOfLevels(currentLvlArray, targetLvlArray);

    // display result
    if(isAdmissible == true) {
        resultText.innerHTML = '소비 마나: ' + computeManaExpenditure(currentLvlArray, targetLvlArray, parseGearInfo(), 1);
    }

})

/*

gearPresetLowRank.addEventListener("click", function() {

    for(var key in gearInputsId) {
        $('#' + gearInputsId[key]).val(gearPresetLowRankArray[key]);
    }
    $('#gearUpgradeDialog').modal('hide');
})

gearPresetHigherRank.addEventListener("click", function() {

    for(var key in gearInputsId) {
        $('#' + gearInputsId[key]).val(gearPresetHigherRankArray[key]);
    }
    $('#gearUpgradeDialog').modal('hide');
})

*/

$("#gearDialog").on("hidden.bs.modal", function(e) {

    updateGearDisplay();

})

addExpenditureButton.addEventListener("click", function() {

    // read current levels
    var currentLvlArray = [];
    currentLvlArray.push(Number(lvlCurrentUb.value));
    currentLvlArray.push(Number(lvlCurrent1st.value));
    currentLvlArray.push(Number(lvlCurrent2nd.value));
    currentLvlArray.push(Number(lvlCurrentEX.value));

    // read target levels
    var targetLvlArray = [];
    targetLvlArray.push(Number(lvlTargetUb.value));
    targetLvlArray.push(Number(lvlTarget1st.value));
    targetLvlArray.push(Number(lvlTarget2nd.value));
    targetLvlArray.push(Number(lvlTargetEX.value));

    // add expenditure info
    addExpenditure(currentLvlArray, targetLvlArray, parseGearInfo(), Number(numberOfCharacters.value));

})

// back to index.html
backButton.addEventListener("click", function() {
    window.location = '../';
})