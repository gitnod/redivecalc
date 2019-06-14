// search characters from the keywords
function searchRediveCharactersByKeywords(keywordsArray, characterPositionsTable, characterTitlesMap, searchByBasicName, exactMatch) {

    // initialize list of searched characters
    var searchedCharacters = [];

    // initialize keyword inclusion indicator
    var includesKeyword = 0;

    // search for the character titles given the input, when allowing limited character search with basic names
    if(searchByBasicName == true) {

        if(exactMatch == false) {

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
                    includesKeyword += characterPositionsTable[j]["charKeywords"].split(" ").filter(function(value) { return value == keywordsArray[k]; }).length == 1;
                }
                if(includesKeyword > 0) {
                    searchedCharacters.push(characterTitlesMap.get(characterPositionsTable[j]["charKeywords"]));
                }
            }

        }

    } else {

        if(exactMatch == false) {

            for(var j=0; j < characterPositionsTable.length; j++) {
                includesKeyword = 0;
                for(var k=0; k < keywordsArray.length; k++) {
                    includesKeyword += characterPositionsTable[j]["charAttributes"].includes(keywordsArray[k]);
                }
                if(includesKeyword > 0) {
                    searchedCharacters.push(characterTitlesMap.get(characterPositionsTable[j]["charKeywords"]));
                }
            }

        } else {

            for(var j=0; j < characterPositionsTable.length; j++) {
                includesKeyword = 0;
                for(var k=0; k < keywordsArray.length; k++) {
                    includesKeyword += characterPositionsTable[j]["charAttributes"].split(" ").filter(function(value) { return value == keywordsArray[k]; }).length == 1;
                }
                if(includesKeyword > 0) {
                    searchedCharacters.push(characterTitlesMap.get(characterPositionsTable[j]["charKeywords"]));
                }
            }

        }

    }

    return searchedCharacters;

}

// read character lists from the character click checkboxes
function searchRediveCharactersFromCheckboxes(characterTitlesArray) {

    // initialize character array
    var characterInputByClick = [];

    // add all checked characters to the array
    var characterCheckbox;
    for(var j=0; j < characterTitlesArray.length; j++) {
        characterCheckbox = document.getElementById("check" + characterTitlesArray[j]);
        if(characterCheckbox.checked == true) {
            characterInputByClick.push(characterTitlesArray[j]);
        }
    }

    // return character inputs
    return characterInputByClick;
}

// initialize character click checkboxes
function initializeCheckboxes(formLabel, characterPositionsTable) {

    // initialize character labels
    var characterLabel = "";
    var characterLabelsArray = [];
    var characterLabelsMap = new Map;
    for(var j=0; j < characterPositionsTable.length; j++) {
        characterLabel = characterPositionsTable[j]["charKeywords"].split(" ");
        if(characterLabel.length == 1) {
            characterLabel = characterLabel[0];
        } else {
            characterLabel = characterLabel[0] + "(" + characterLabel[1] + ")";
        }
        characterLabelsArray.push(characterLabel);
        characterLabelsMap.set(characterLabel, j);
    }
    characterLabelsArray.sort();

    // add characters to the checkbox list
    var checkboxHtml = '';
    var charTitle = '';
    for(var j=0; j < characterLabelsArray.length; j++) {
        charTitle = characterPositionsTable[characterLabelsMap.get(characterLabelsArray[j])]["charTitle"];
        checkboxHtml += '<div id="check' + charTitle + 'container" class="custom-control custom-checkbox">';
        checkboxHtml += '<input type="checkbox" class="custom-control-input" id="check' + charTitle +'">';
        checkboxHtml += '<label class="custom-control-label" for="check' + charTitle + '">' + characterLabelsArray[j] + '</label></div>';
    }
    $("#" + formLabel).html(checkboxHtml);

}