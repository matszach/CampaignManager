class LocationViewController extends VoViewController{

    html = `
    <div class='componentDiv'>
        <div class='componentTitleDiv'>
            <p class='componentTitle'>Locations</p>
        </div>
        <div class='componentBrowseDiv'>
            <select id='locationBrowseSelect' class='browseSelect' 
                onchange='locationView.loadSelectedItem()' onfocus='this.selectedIndex = -1;'></select> 
            <input type='text' id='locationBrowseSearch' class='browseSearch' 
                onchange='locationView.loadSelectItemsBySearch()' placeholder='Search ...'/>
        </div>
        <div class='componentItemViewDiv'>
            <input type='text' id='locationViewName' class='viewTextfield'  placeholder='Location name ...'/>
            <textarea id='locationViewDescription' class='viewTextarea' 
                spellcheck="false" placeholder='Location description ...'></textarea>
        </div>
        <div class='componentButtonDiv'>
            <input type='submit' id='locationNewButton' class='viewNewButton' 
                onclick='locationView.createNewItem()' value='New'/>
            <input type='submit' id='locationSaveButton' class='viewSaveButton' 
                onclick='locationView.saveOrUpdateCurrentItem()' value='Save'/>
            <input type='submit' id='locationDeleteButton' class='viewDeleteButton' 
                onclick='locationView.deleteCurrentItem()' value='Delete'/>        
        </div>
    </div>
    `;

    browseSearchId = '#locationBrowseSearch';
    browseSelectId = '#locationBrowseSelect';

    constructor(locationRepository){
        super(locationRepository);
    }

    constructNewItem(){
        return new Location();
    }

    constructItemFromView(){
        var o = new Location();
        o.name = $('#locationViewName').val();
        o.description = $('#locationViewDescription').val();
        return o;
    }

    showItem(o){
        $('#locationViewName').val(o.name);
        $('#locationViewDescription').val(o.description);
    }

}







