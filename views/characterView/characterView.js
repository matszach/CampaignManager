class CharacterViewController extends VoViewController{

    html = `
    <div class='componentDiv'>
        <div class='componentTitleDiv'>
            <p class='componentTitle'>Characters</p>
        </div>
        <div class='componentBrowseDiv'>
            <select id='characterBrowseSelect' class='browseSelect' 
                onchange='characterView.loadSelectedItem()' onfocus='this.selectedIndex = -1;'></select> 
            <input type='text' id='characterBrowseSearch' class='browseSearch' 
                onchange='characterView.loadSelectItemsBySearch()' placeholder='Search ...'/>
        </div>
        <div class='componentItemViewDiv'>
            <input type='text' id='characterViewName' class='viewTextfield' placeholder='Character name ...'/>
            <select id='characterViewLocation' class='viewSelect'></select>
            <textarea id='characterViewDescription' class='viewTextarea' 
                spellcheck="false" placeholder='Character description ...'></textarea>
        </div>
        <div class='componentButtonDiv'>
            <input type='submit' id='locationNewButton' class='viewNewButton' 
                onclick='characterView.createNewItem()' value='New'/>
            <input type='submit' id='locationSaveButton' class='viewSaveButton' 
                onclick='characterView.saveOrUpdateCurrentItem()' value='Save'/>
            <input type='submit' id='locationDeleteButton' class='viewDeleteButton' 
                onclick='characterView.deleteCurrentItem()' value='Delete'/>         
        </div>
    </div>
    `;

    browseSearchId = '#characterBrowseSearch';
    browseSelectId = '#characterBrowseSelect';

    locationRepository;

    constructor(characterRepository, locationRepository){
        super(characterRepository);
        this.locationRepository = locationRepository;
    }

    constructNewItem(){
        return new Character();
    }

    constructItemFromView(){
        var o = new Character();
        o.name = $('#characterViewName').val();
        o.locationId = $('#characterViewLocation').val();
        o.description = $('#characterViewDescription').val();
        return o;
    } 

    showItem(o){
        $('#characterViewName').val(o.name);
        this.loadLocationsOptions(o.locationId);
        $('#characterViewDescription').val(o.description);
    }

    loadLocationsOptions(characterLocationId){
        var selectionHTML = '';
        if(!characterLocationId || characterLocationId == -1){
            selectionHTML += '<option value=-1 selected>Location unknown</option>';
        } else {
            selectionHTML += '<option value=-1>Location unknown</option>';
        }
        var loadedItems = this.locationRepository.findAll();
        for(var i = 0; i < loadedItems.length; i++){
            var loc = loadedItems[i];
            if(characterLocationId == loc.id){
                selectionHTML += `<option value=${loc.id} selected>${loc.name}</option>`;
            } else {
                selectionHTML += `<option value=${loc.id}>${loc.name}</option>`;
            }
        }
        $('#characterViewLocation').html(selectionHTML)
    }

}







