
// load HTML objects
var desc = document.getElementById("desc");

var calcTypeSimple = document.getElementById("calcTypeSimple");
var calcTypeAdvanced = document.getElementById("calcTypeAdvanced");

var lvlCurrent = document.getElementById("lvlCurrent");
var lvlTarget = document.getElementById("lvlTarget");
var lvlCharacters = document.getElementById("lvlCharacters");

var resultText = document.getElementById("resultText");
var expPotionResultHeader = document.getElementById("expPotionResultHeader");

var calculateExpButton = document.getElementById("calculateExpButton");

var backButton = document.getElementById("backButton");

var expCharacterTable;

var expPotionInventoryArray = {미니:0, 일반:0, 하이:0, 메가:0};
var expPotionValuesArray = {미니:60, 일반:300, 하이:1500, 메가:7500};
var expPotionInputsArray = {미니:"expPotionInputTier1", 일반:"expPotionInputTier2", 하이:"expPotionInputTier3", 메가:"expPotionInputTier4"};
var expPotionResultsArray = {미니:"expPotionResultTier1", 일반:"expPotionResultTier2", 하이:"expPotionResultTier3", 메가:"expPotionResultTier4"};
var expPotionResultUnit = "메가";

var requiredExpArray = [];

var resultTableLength = 0;
var resultTableRows = new Object;

function updateExpPotionInventoryFromInput() {
    for(key in expPotionInventoryArray) {
        expPotionInventoryArray[key] = Number($('#' + expPotionInputsArray[key]).val());
    }
}

function updateExpConsumptionArraySimple() {

    var isAdmissible = checkSanityOfLevels(lvlCurrent, lvlTarget);

    requiredExpArray = [];

    if(isAdmissible == true) {
        for(var j=0; j<lvlCharacters.value; j++) {
            requiredExpArray.push(expCharacterTable[lvlTarget.value-1]["Cumul"] - expCharacterTable[lvlCurrent.value-1]["Cumul"]);
        }
    }

}

function updatePotionResultUnit(unit) {
    
    expPotionResultUnit = unit;
    $("#calculateExpButton").trigger("click");

}

// check sanity of levels
function checkSanityOfLevels(currentLvl, targetLvl) {

    // initialize iterator
    var j=0;

    // check current and target levels are in the computable range
    var lvlCurrentInRange = true;
    var lvlTargetInRange = true;
    var lvlTargetLargerThanCurrent = true;

    if(currentLvl < 1) {
        lvlCurrentInRange = false;
    }
    if(targetLvl > expCharacterTable.length) {
        lvlTargetInRange = false;
    }
    if(targetLvl < currentLvl) {
        lvlTargetLargerThanCurrent = false;
    }

    if(lvlCurrentInRange == false) {

        resultText.innerHTML = '오류: 현재 레벨은 최소 1이어야 합니다.';
        return false;

    } else if(lvlTargetInRange == false) {

        resultText.innerHTML = '오류: 목표 레벨은 최대 ' + expCharacterTable.length + '이어야 합니다.';
        return false;

    } else if(lvlTargetLargerThanCurrent == false) {

        resultText.innerHTML = '오류: 목표 레벨은 현재 레벨보다 낮아야 합니다.';
        return false;

    } else {

        return true;

    }

}

function computeExpAmount(potionValues, potionInventory) {

    var amount = 0;

    for(var key in potionInventory) {
        amount += potionValues[key] * potionInventory[key];
    }

    return amount;
}

function consumeExpPotions(amount, potionValues, potionInventory) {

    // read keys of the exp potions
    var key = "";
    var keys = Object.keys(potionValues);

    // auxiliary variables
    var requiredInventory = 0;
    var refundableInventory = 0;
    var maxInventory = 0;

    // clone inventory
    var currentInventory = {};
    for(key in potionInventory) {
        currentInventory[key] = potionInventory[key];
    }

    // required exp counter
    var remainder = amount;

    // consume exp potions, first consume lowest tier and then higher tiers
    for(var j=0; j<keys.length; j++) {
        key = keys[j];
        requiredInventory = Math.ceil(remainder / potionValues[key]);
        if(currentInventory[key] > requiredInventory) {
            remainder -= requiredInventory * potionValues[key];
            currentInventory[key] -= requiredInventory;
        } else {
            remainder -= currentInventory[key] * potionValues[key];
            currentInventory[key] -= currentInventory[key];
        }
    }

    // if remainer is negative, cancel consumption of lower tier potions
    remainder = (-1) * remainder;
    // iterate from highest tier o the lower tiers
    for(var j=keys.length-1; j>=0; j--) {
        key = keys[j];
        refundableInventory = Math.floor(remainder / potionValues[key]);
        maxInventory = potionInventory[key] - currentInventory[key];
        if(maxInventory > refundableInventory) {
            remainder -= refundableInventory * potionValues[key];
            currentInventory[key] += refundableInventory;
        } else {
            remainder -= maxInventory * potionValues[key];
            currentInventory[key] += maxInventory;
        }
    }

    // return the inventory
    return currentInventory;
}

function initializeResultsDisplay() {
    for(var key in expPotionResultsArray) {
        $('#' + expPotionResultsArray[key]).html(0);
    }
}

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

calculateExpButton.addEventListener("click", function() {

    // read potion inventory and required levelups
    updateExpPotionInventoryFromInput();
    updateExpConsumptionArraySimple();

    // consume inventory for levelup
    var remainingInventory = expPotionInventoryArray;
    for(var j=0; j<requiredExpArray.length; j++) {
        remainingInventory = consumeExpPotions(requiredExpArray[j], expPotionValuesArray, remainingInventory);
    }

    // compute net inventory
    var netExp = computeExpAmount(expPotionValuesArray, remainingInventory);

    // display result
    if(netExp < 0) {
        resultText.innerHTML = "결과: 경험치 포션 부족";
        expPotionResultHeader.innerHTML = "추가구매 필요량:";
        initializeResultsDisplay();
        $('#' + expPotionResultsArray[expPotionResultUnit]).html(Math.ceil((-1) * netExp / expPotionValuesArray[expPotionResultUnit]));
    } else {
        resultText.innerHTML = "결과: 경험치 포션 충분";
        expPotionResultHeader.innerHTML = "레벨업 후 남은 보유량:";
        remainingInventory = expPotionInventoryArray;
        for(var j=0; j<requiredExpArray.length; j++) {
            remainingInventory = consumeExpPotions(requiredExpArray[j], expPotionValuesArray, remainingInventory);
        }
        initializeResultsDisplay();
        for(var key in remainingInventory) {
            $('#' + expPotionResultsArray[key]).html(remainingInventory[key]);
        }
    }

})

// back to index.html
backButton.addEventListener("click", function() {
    window.location = '../';
})