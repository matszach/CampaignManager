class NoteViewController extends VoViewController{

    html = `
    <div class='componentDiv'>
        <div class='componentTitleDiv'>
            <p class='componentTitle'>Notes</p>
        </div>
        <div class='componentBrowseDiv'>
            <select id='noteBrowseSelect' class='browseSelect' 
                onchange='noteView.loadSelectedItem()' onfocus='this.selectedIndex = -1;'></select>
            <input type='text' id='noteBrowseSearch' class='browseSearch' 
                onchange='noteView.loadSelectItemsBySearch()' placeholder='Search ...'/>
        </div>
        <div class='componentItemViewDiv'>
            <input type='text' id='noteViewTitle' class='viewTextfield' placeholder='Note title ...'/>
            <textarea id='noteViewContent' class='viewTextarea' 
                spellcheck="false" placeholder='Note content ...'></textarea>
        </div>
        <div class='componentButtonDiv'>
            <input type='submit' id='noteNewButton' class='viewNewButton' 
                onclick='noteView.createNewItem()' value='New'/>
            <input type='submit' id='noteSaveButton' class='viewSaveButton' 
                onclick='noteView.saveOrUpdateCurrentItem()' value='Save'/>
            <input type='submit' id='noteDeleteButton' class='viewDeleteButton' 
                onclick='noteView.deleteCurrentItem()' value='Delete'/> 
        </div>
    </div>
    `;

    browseSearchId = '#noteBrowseSearch';
    browseSelectId = '#noteBrowseSelect';

    constructor(noteRepository){
        super(noteRepository);
    }

    constructNewItem(){
        return new Note();
    }

    constructItemFromView(){
        var o = new Note();
        o.name = $('#noteViewTitle').val();
        o.content = $('#noteViewContent').val();
        return o;
    }

    showItem(o){
        $('#noteViewTitle').val(o.name);
        $('#noteViewContent').val(o.content);
    }

}







