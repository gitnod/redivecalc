
// load HTML objects
var inputByText = document.getElementById("inputByText");
var inputByClick = document.getElementById("inputByClick");
var searchLimitedByBasicName = document.getElementById("searchLimitedByBasicName");
var displayAll = document.getElementById("displayAll");
var displayFront = document.getElementById("displayFront");
var displayMiddle = document.getElementById("displayMiddle");
var displayBack = document.getElementById("displayBack");
var sarenList = document.getElementById("sarenList");
var backButton = document.getElementById("backButton");

var characterInputByText;
var characterInputByClick;
var characterPositionsTable;
var characterTitlesMap = new Map;
var characterTitlesArray = [];
var characterPositionsMap = new Map;
var characterRelativePositionsMap = new Map;
var characterLocationsMap = new Map;
var searchedCharacters = [];
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
function updateList(keywordsArray) {

    // initialize list of searched characters
    searchedCharacters = [];

    // initialize keyword inclusion indicator
    var includesKeyword = 0;

    // search for the character titles given the input, when allowing limited character search with basic names
    if(searchLimitedByBasicName.checked == true) {

        for(var j=0; j < characterPositionsTable.length; j++) {
            includesKeyword = 0;
            for(var k=0; k < keywordsArray.length; k++) {
                includesKeyword += characterPositionsTable[j]["charKeywords"].includes(keywordsArray[k]);
            }
            if(includesKeyword > 0) {
                searchedCharacters.push(characterTitlesMap.get(characterPositionsTable[j]["charKeywords"]));
            }
        }

    } else {

        for(var j=0; j < characterPositionsTable.length; j++) {
            includesKeyword = 0;
            for(var k=0; k < keywordsArray.length; k++) {
                includesKeyword += characterPositionsTable[j]["charAttributes"].includes(keywordsArray[k]);
            }
            if(includesKeyword > 0) {
                searchedCharacters.push(characterTitlesMap.get(characterPositionsTable[j]["charKeywords"]));
            }
        }

    }

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
    liSaren.className = "list-group-item list-group-item-dark text-center";
    if(displayedCharacters.length > 1) {
        liClosestCharacter.className = "list-group-item list-group-item-success text-center font-weight-bold";
    }
}

// load character position map after page load
window.onload = function() {

    // locate character position table file
    fileURLString = "https://raw.githubusercontent.com/gitnod/redivecalc/master/data/characterPositionsTable.csv";

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
              characterPositionsMap.set(characterPositionsTable[j]["charTitle"], characterPositionsTable[j]["charPosition"]);
              characterRelativePositionsMap.set(characterPositionsTable[j]["charTitle"], Math.abs(Number(characterPositionsTable[j]["charPosition"]) - 430));
              characterLocationsMap.set(characterPositionsTable[j]["charTitle"], characterPositionsTable[j]["charLocation"]);
            }

            ////////// initialize choose-character-by-click list //////////

            // create charTitles array
            characterTitlesArray = Array.from(characterPositionsMap.keys()).sort();

            // initialize the html code
            var checkboxHtml = '';
            // add characters to the checkbox list
            for(var j=0; j < characterTitlesArray.length; j++) {
                checkboxHtml += '<div id="check' + characterTitlesArray[j] + 'container" class="custom-control custom-checkbox">';
                checkboxHtml += '<input type="checkbox" class="custom-control-input" id="check' + characterTitlesArray[j] +'">';
                checkboxHtml += '<label class="custom-control-label" for="check' + characterTitlesArray[j] + '">' + characterTitlesArray[j] + '</label></div>';
            }
            $("#inputByClickCheckboxes").html(checkboxHtml);

        }
    });

    // initialize displayed character list
    displayedCharacters.push("사렌");

}

// change character list table when the text input changes
inputByText.addEventListener("keydown", function() {

    // suppress enter key from submitting the form
    if(event.key == "Enter") {
        event.preventDefault();
    }

    // read characters
    characterInputByText = this.value.split(" ");

    // remove any empty entry
    characterInputByText = characterInputByText.filter(function(value, index, arr) { return value != ""; })

    // update character positions list with the keywords
    updateList(characterInputByText);

})

searchLimitedByBasicName.addEventListener("click", function() {

    // read characters
    characterInputByText = inputByText.value.split(" ");

    // remove any empty entry
    characterInputByText = characterInputByText.filter(function(value, index, arr) { return value != ""; })

    // update character positions list with the keywords
    updateList(characterInputByText);

})

// display characters according to their location categories
displayAll.addEventListener("click", function() {

    var characterCheckBox;

    // display all characters
    for(var j=0; j < characterTitlesArray.length; j++) {
        characterCheckBox = document.getElementById("check" + characterTitlesArray[j] + "container");
        characterCheckBox.hidden = false;
    }

})

// display characters according to their location categories
displayFront.addEventListener("click", function() {

    var characterCheckbox;

    // display front (location == 0) characters
    for(var j=0; j < characterTitlesArray.length; j++) {
        characterCheckbox = document.getElementById("check" + characterTitlesArray[j] + "container");
        characterCheckbox.hidden = (characterLocationsMap.get(characterTitlesArray[j]) != 0);
    }

})

// display characters according to their location categories
displayMiddle.addEventListener("click", function() {

    var characterCheckbox;

    // display middle (location == 1) characters
    for(var j=0; j < characterTitlesArray.length; j++) {
        characterCheckbox = document.getElementById("check" + characterTitlesArray[j] + "container");
        characterCheckbox.hidden = (characterLocationsMap.get(characterTitlesArray[j]) != 1);
    }

})

// display characters according to their location categories
displayBack.addEventListener("click", function() {

    var characterCheckbox;

    // display back (location == 2) characters
    for(var j=0; j < characterTitlesArray.length; j++) {
        characterCheckbox = document.getElementById("check" + characterTitlesArray[j] + "container");
        characterCheckbox.hidden = (characterLocationsMap.get(characterTitlesArray[j]) != 2);
    }

})


// back to index.html
backButton.addEventListener("click", function() {
    window.location = '../';
})