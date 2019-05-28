
// load HTML objects
var inputByText = document.getElementById("inputByText");
var inputByClick = document.getElementById("inputByClick");
var searchLimitedByBasicName = document.getElementById("searchLimitedByBasicName");
var displayAll = document.getElementById("displayAll");
var displayFront = document.getElementById("displayFront");
var displayMiddle = document.getElementById("displayMiddle");
var displayBack = document.getElementById("displayBack");
var clickCharactersInitialize = document.getElementById("clickCharactersInitialize");
var selectedParty = document.getElementById("selectedParty");
var selectedCharacter = document.getElementById("selectedCharacter");
var backButton = document.getElementById("backButton");

var characterPositionsTable;
var characterTitlesMap = new Map;
var characterTitlesArray = [];
var characterPositionsMap = new Map;
var characterLocationsMap = new Map;

// search characters and compute yukari's skill target
function searchCharactersAndUpdateResults() {

    // read text entries from the text input form
    var characterInput = inputByText.value.split(" ");

    // remove any empty entry
    characterInput = characterInput.filter(function(value, index, arr) { return value != ""; })

    // search characters with the text input
    var searchedCharacters = searchRediveCharactersByKeywords(characterInput, characterPositionsTable, characterTitlesMap, searchLimitedByBasicName.checked);

    // combine it with the character list from the checkboxes
    searchedCharacters = searchedCharacters.concat(searchRediveCharactersFromCheckboxes(characterTitlesArray));

    // add yukari to the character titles list
    if(searchedCharacters.includes("유카리") == false) {
        searchedCharacters.push("유카리");
    }

    // read character's positions
    var searchedPositions = [];
    for(var j=0; j < searchedCharacters.length; j++) {
        searchedPositions.push(characterPositionsMap.get(searchedCharacters[j]));
    }

    // initialize character position dictionary
    var searchedCharactersDictionary = new Object;

    // add all searched characters to the dictionary
    for(var j=0; j < searchedCharacters.length; j++) {
        searchedCharactersDictionary[characterPositionsMap.get(searchedCharacters[j])] = searchedCharacters[j];
    }

    // create character lists with the dictionary
    searchedCharactersArray = [];
    for(var key in searchedCharactersDictionary) {
        searchedCharactersArray.push(searchedCharactersDictionary[key]);
    }

    // update the party display
    selectedParty.innerHTML = '현재 파티: ' + searchedCharactersArray.join(", ");

    // check if the party size is 5 and return the result. If not, return an error
    if(searchedCharacters.length != 5) {
        selectedCharacter.innerHTML = '결과: 계산을 위해서는 5인이 파티를 구성해야 합니다.'
    } else {
        selectedCharacter.innerHTML = '전투 시작시 TP 주유 캐릭터: ' + searchSkillTarget(searchedCharactersArray, searchedPositions);
    }

}

// search yukari's still target from the character list
function searchSkillTarget(searchedCharactersArray, searchedPositions) {

    // determine skill target
    if(searchedCharactersArray[0] == "유카리") {

        return searchedCharactersArray[3];

    } else if(searchedCharactersArray[1] == "유카리") {

        if(searchedPositions[2] >= 600) {
            return searchedCharactersArray[4];
        } else {
            if(searchedCharactersArray[3] == "쿄우카" && searchedCharactersArray[4] == "할사키") {
                return searchedCharactersArray[2];
            } else {
                return searchedCharactersArray[3];
            }
        }

    } else if(searchedCharactersArray[2] == "유카리") {

        if(searchedCharactersArray[4] == "쿄우카") {
            if(searchedPositions[0] > 225) {
                return searchedCharactersArray[3];
            } else if(searchedPositions[0] < 215) {
                return searchedCharactersArray[2];
            }
        }
        if(searchedPositions[3] >= 600) {
            return searchedCharactersArray[2];
        } else {
            return searchedCharactersArray[3];
        }

    } else if(searchedCharactersArray[3] == "유카리") {

        if(searchedPositions[2] < 200) {
            if(searchedPositions[4] >= 600) {
                return searchedCharactersArray[2];
            } else {
                return searchedCharactersArray[3];
            }
        } else if(searchedPositions[2] > 205) {
            return searchedCharactersArray[3];
        }

    } else {

        if(searchedPositions[2] < 160 && searchedPositions[3] < 200) {
            return searchedCharactersArray[3];
        }
        if(searchedPositions[2] > 162) {
            return searchedCharactersArray[4];
        }

    }

    return "실험값이 없습니다.";
}

// load character position map after page load
window.onload = function() {

    // locate character position table file
    fileURLString = "https://raw.githubusercontent.com/gitnod/redivecalc/gh-pages/data/characterPositionsTable.csv";

    // read character position table
    Papa.parse(fileURLString, {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {

            // save character position table
            characterPositionsTable = results.data;

            // fill in the maps using the table
            characterPositionsMap.clear();
            characterTitlesMap.clear();
            for(var j=0; j < characterPositionsTable.length; j++) {
              characterTitlesMap.set(characterPositionsTable[j]["charKeywords"], characterPositionsTable[j]["charTitle"]);
              characterTitlesArray.push(characterPositionsTable[j]["charTitle"]);
              characterPositionsMap.set(characterPositionsTable[j]["charTitle"], characterPositionsTable[j]["charPosition"]);
              characterLocationsMap.set(characterPositionsTable[j]["charTitle"], characterPositionsTable[j]["charLocation"]);
            }

            // initialize choose-character-by-click list
            initializeCheckboxes("inputByClickCheckboxes", characterPositionsTable);

        }
    });

}

// change character list table when the text input changes
inputByText.addEventListener("keydown", function() {

    // suppress enter key from submitting the form
    if(event.key == "Enter") {
        event.preventDefault();
    }

    searchCharactersAndUpdateResults();

})

// change character list table when the text input option changes
searchLimitedByBasicName.addEventListener("click", function() {

    searchCharactersAndUpdateResults();

})

// change character list table when the character click dialog is dismissed
$("#clickCharacters").on("hidden.bs.modal", function(e) {

    searchCharactersAndUpdateResults();

})

// display characters according to their location categories
$("#clickCharactersDisplay :input").change(function() {

    // set location indicator according to the clicked button
    var location = -1;
    if(this.id == "displayFront") {
        location = 0;
    } else if(this.id == "displayMiddle") {
        location = 1;
    } else if(this.id == "displayBack") {
        location = 2;
    }

    // display characters that satisfy location criterion
    var characterCheckBox;
    if(location == -1) {
        for(var j=0; j < characterTitlesArray.length; j++) {
            characterCheckbox = document.getElementById("check" + characterTitlesArray[j] + "container");
            characterCheckbox.hidden = false;
        }
    } else {
        for(var j=0; j < characterTitlesArray.length; j++) {
            characterCheckbox = document.getElementById("check" + characterTitlesArray[j] + "container");
            characterCheckbox.hidden = (characterLocationsMap.get(characterTitlesArray[j]) != location);
        }
    }

});

clickCharactersInitialize.addEventListener("click", function() {
    // uncheck all entries
    var characterCheckbox;
    for(var j=0; j < characterTitlesArray.length; j++) {
        characterCheckbox = document.getElementById("check" + characterTitlesArray[j]);
        characterCheckbox.checked = false;
    }
})

// back to index.html
backButton.addEventListener("click", function() {
    window.location = '../';
})