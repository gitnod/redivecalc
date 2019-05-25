
// load HTML objects
var inputByText = document.getElementById("inputByText");
var sarenList = document.getElementById("sarenList");
var backButton = document.getElementById("backButton");

var characterInputByText;
var characterInputByClick;
var characterPositionsTable;
var characterPositionsMap = new Map;
var characterRelativePositionsMap = new Map;
var characterTitlesMap = new Map;
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

    // search for the character titles given the input
    for(var j=0; j < characterPositionsTable.length; j++) {
        includesKeyword = 0;
        for(var k=0; k < keywordsArray.length; k++) {
            includesKeyword += characterPositionsTable[j]["charNames"].includes(keywordsArray[k]);
        }
        if(includesKeyword > 0) {
            searchedCharacters.push(characterTitlesMap.get(characterPositionsTable[j]["charNames"]));
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
    liClosestCharacter.className = "list-group-item list-group-item-success text-center";
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
              characterTitlesMap.set(characterPositionsTable[j]["charNames"], characterPositionsTable[j]["charTitle"]);
              characterPositionsMap.set(characterPositionsTable[j]["charTitle"], characterPositionsTable[j]["charPosition"]);
              characterRelativePositionsMap.set(characterPositionsTable[j]["charTitle"], Math.abs(Number(characterPositionsTable[j]["charPosition"]) - 430));
          }
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

// back to index.html
backButton.addEventListener("click", function() {
    window.location = '../';
})