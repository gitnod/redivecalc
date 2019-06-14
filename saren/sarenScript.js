
// load HTML objects
var inputByText = document.getElementById("inputByText");
var inputByClick = document.getElementById("inputByClick");
var searchLimitedByBasicName = document.getElementById("searchLimitedByBasicName");
var searchExactMatch = document.getElementById("searchExactMatch");
var displayAll = document.getElementById("displayAll");
var displayFront = document.getElementById("displayFront");
var displayMiddle = document.getElementById("displayMiddle");
var displayBack = document.getElementById("displayBack");
var clickCharactersInitialize = document.getElementById("clickCharactersInitialize");
var sarenList = document.getElementById("sarenList");
var backButton = document.getElementById("backButton");

var characterPositionsTable;
var characterTitlesMap = new Map;
var characterTitlesArray = [];
var characterPositionsMap = new Map;
var characterRelativePositionsMap = new Map;
var characterLocationsMap = new Map;
var displayedCharacters = [];

// add character to the character positions list
function addCharacterToList(charString) {
    // create list string
    // listString = charString + " (" + characterPositionsMap.get(charString) + ") (사렌과의 거리: " + characterRelativePositionsMap.get(charString) + ")";
    listString = charString + " (사렌과의 거리: " + characterRelativePositionsMap.get(charString) + ")";
    // create list entry
    var li = document.createElement("li");
    // set id to be the character name
    li.setAttribute("id",charString);
    // set list class
    li.className = "list-group-item text-center";
    // create entry item
    li.appendChild(document.createTextNode(listString));
    // add entry to the list
    sarenList.appendChild(li);
    // register character to the displayed character list
    displayedCharacters.push(charString);
}

// remove character from the character positions list
function removeCharacterFromList(charString) {
    // get designated item
    var li = document.getElementById(charString);
    // remove from the list
    sarenList.removeChild(li);
    // remove character from the displayed character list
    displayedCharacters = displayedCharacters.filter(function(value, index, arr) { return value != charString; });
}

// clear the character positions list
function clearList() {
    // read number of displayed characters
    var charactersLength = displayedCharacters.length;
    // remove all displayed characters
    for(var j=0; j < charactersLength; j++) {
        removeCharacterFromList(displayedCharacters[0]);
    }
}

// update the character positions list with the array
function updateList(searchedCharacters) {

    // add saren to the character titles list
    if(searchedCharacters.includes("사렌") == false) {
        searchedCharacters.push("사렌");
    }

    // initialize character position dictionary
    var searchedCharactersDictionary = new Object;

    // add all searched characters to the dictionary
    for(var j=0; j < searchedCharacters.length; j++) {
        searchedCharactersDictionary[characterPositionsMap.get(searchedCharacters[j])] = searchedCharacters[j];
    }

    // clear character positions list
    clearList();

    // create the character positions list from the dictionary
    for(var key in searchedCharactersDictionary) {
        addCharacterToList(searchedCharactersDictionary[key]);
    }

    // highlight character positions list
    highlightList();

}

// highlight saren and closest character in the list
function highlightList() {
    // read characters excluding saren
    var displayedCharactersExceptSaren = displayedCharacters.filter(function(value, index, arr) { return value != "사렌"; });
    // initialize character positions array
    var displayedCharactersTitlesArray = [];
    var displayedCharactersRelativePositionsArray = [];
    // read character positions
    for(var j=0; j < displayedCharactersExceptSaren.length; j++) {
        displayedCharactersTitlesArray.push(displayedCharactersExceptSaren[j]);
        displayedCharactersRelativePositionsArray.push(characterRelativePositionsMap.get(displayedCharactersExceptSaren[j]));
    }
    // compute index of minimum entry
    var minIndex = displayedCharactersRelativePositionsArray.indexOf(Math.min(...displayedCharactersRelativePositionsArray));
    // read objects representing saren and closest character
    var liSaren = document.getElementById("사렌");
    var liClosestCharacter = document.getElementById(displayedCharactersTitlesArray[minIndex]);
    // highlight saren and closest character
    liSaren.className = "list-group-item list-group-item-light text-center";
    if(displayedCharacters.length > 1) {
        liClosestCharacter.className = "list-group-item list-group-item-success text-center font-weight-bold";
    }
}

// search character lists from text input form and the character checkboxes
function searchCharactersAndUpdateList() {

    // read text entries from the text input form
    var characterInput = inputByText.value.split(" ");

    // remove any empty entry
    characterInput = characterInput.filter(function(value, index, arr) { return value != ""; })

    // search characters with the text input
    var searchedCharacters = searchRediveCharactersByKeywords(characterInput, characterPositionsTable, characterTitlesMap, searchLimitedByBasicName.checked, searchExactMatch.checked);

    // combine it with the character list from the checkboxes
    searchedCharacters = searchedCharacters.concat(searchRediveCharactersFromCheckboxes(characterTitlesArray));

    // update character positions list with the searched characters
    updateList(searchedCharacters);

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
              characterRelativePositionsMap.set(characterPositionsTable[j]["charTitle"], Math.abs(Number(characterPositionsTable[j]["charPosition"]) - 430));
              characterLocationsMap.set(characterPositionsTable[j]["charTitle"], characterPositionsTable[j]["charLocation"]);
            }

            // initialize choose-character-by-click list
            initializeCheckboxes("inputByClickCheckboxes", characterPositionsTable);

        }
    });

    // initialize displayed character list
    displayedCharacters.push("사렌");

}

// update character list table when the text input option changes
inputByText.addEventListener("keydown", function() {

    // suppress enter key from submitting the form
    if(event.key == "Enter") {
        event.preventDefault();
    }

    searchCharactersAndUpdateList();

})

// update character list table when the text input option changes
searchLimitedByBasicName.addEventListener("click", function() {

    searchCharactersAndUpdateList();

})

// update character list table when the text input option changes
searchExactMatch.addEventListener("click", function() {

    searchCharactersAndUpdateList();

})

// update character list table when the character click dialog is dismissed
$("#clickCharacters").on("hidden.bs.modal", function(e) {

    searchCharactersAndUpdateList();

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