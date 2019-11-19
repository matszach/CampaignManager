// campaign info 
var campaignInfo = new CampaignInfo();

// repositories
var locationRepository = new Repository(Location);
var noteRepository = new Repository(Note);
var characterRepository = new Repository(Character);

// map and map editor
var map = new Map(DEFAULT_MAP_SIZE_X, DEFAULT_MAP_SIZE_Y);
var mapEditorData = new MapEditorData(DEFAULT_MAP_SIZE_X, DEFAULT_MAP_SIZE_Y);

// view controllers
var campaignInfoView = new CampaignInfoViewController(campaignInfo);
var locationView = new LocationViewController(locationRepository);
var noteView = new NoteViewController(noteRepository);
var characterView = new CharacterViewController(characterRepository, locationRepository);
var mapView = new MapViewController(map, mapEditorData);


/* ======================================== SAVING =================================================

/**
 * creates a campaign state object that is then strinified to a JSON format
 * and exported as a .json file
 */
function saveAndExportCampaignState(){
    var campaign = buildCampaignState()
    var stateString = JSON.stringify(campaign);
    var file = new Blob([stateString], {type: 'application/json'});
    var fileName = `${campaign.campaignInfo.title}-${campaign.campaignInfo.version}.json`;
    promptFileDownload(file, fileName);
}

/**
 * creates a campaign state object from current repositories
 */
function buildCampaignState(){
    var campaign = new CampaignState();
    campaign.campaignInfo = campaignInfo;
    campaign.characterRepository = characterRepository;
    campaign.locationRepository = locationRepository;
    campaign.noteRepository = noteRepository;
    campaign.map = map;
    campaign.mapEditorData = mapEditorData;
    return campaign;
}

/**
 * prompts a file download 
 * @param {Blob} file - file to be downloaded
 * @param {string} fileName - file's name
 */
function promptFileDownload(file, fileName){
    var a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/* ======================================== LOADING =================================================

/**
 * loads a .json campaign file, validates it and then applies it to the application fields
 */
function loadCampaignState(){
    promptFileInput();
}

/**
 * requests a file input
 */
function promptFileInput(){
    var input = document.createElement('input');
    input.id = 'tempFileInput';
    input.type = 'file';
    document.body.appendChild(input);
    input.setAttribute('onchange', 'loadFileOnInput()');
    input.click();
}

function loadFileOnInput(){
    var input = document.getElementById('tempFileInput');
    var file = input.files[0];
    if(!validateLoadedFile(file)) return;
    parseLoadedCampaignState(file);
    document.body.removeChild(input);
}

/**
 * Validates if the loaded object is of a valid type
 * @param {File} file - file that is suposed to be validated 
 * @returns - true if valid false if not
 */
function validateLoadedFile(file){
    if(!file.type || file.type != 'application/json'){
        alert('The selected file should have a ".json" extension.')
        return false;
    } 
    return true;
}

function parseLoadedCampaignState(file){
    var reader = new FileReader();
    reader.readAsText(file, "UTF- 8");
    reader.onload = e => {
        var jsonString = e.target.result;
        var state = JSON.parse(jsonString);
        if(!validateLoadedCampaignState(state)) return;
        applyLoadedCampaignState(state);
    }
}

/**
 * validates if the parsed object is a valid campaign state
 * @param {object} o - object parsed from json that is supposed to be validated
 * @returns - true if valied false if not 
 */
function validateLoadedCampaignState(o){
    if(!o.campaignInfo) {alertMissingField('campaignInfo'); return false;}
    if(!o.locationRepository) {alertMissingField('locationRepository'); return false;} 
    if(!o.characterRepository) {alertMissingField('characterRepository'); return false;} 
    if(!o.noteRepository) {alertMissingField('noteRepository'); return false;}
    if(!o.map) {alertMissingField('map'); return false;}
    if(!o.mapEditorData) {alertMissingField('mapEditorData'); return false;}
    return true; 
}

function alertMissingField(fieldName){
    alert(`The selected file is incomplete.\nMissing attribute "${fieldName}".`);
}

/**
 * applies the loaded campaign state to the application variables
 */
function applyLoadedCampaignState(o){
    campaignInfo.reload(o.campaignInfo)
    locationRepository.reload(o.locationRepository);
    noteRepository.reload(o.noteRepository);
    characterRepository.reload(o.characterRepository);
    map.reload(o.map);
    mapEditorData.reload(o.mapEditorData);
    campaignInfoView.toDisplay();
}

