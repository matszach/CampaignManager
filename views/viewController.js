/**
 * Displays a view to the workarea and performs it's logic 
 */
class ViewController{

    // view's html
    html;

    toDisplay(){
        this.show();
        this.init();
    }

    show(){
        $('#workAreaDiv').html(this.html);
    }

    init(){
        // abstract
    }

}

/**
 * ViewController for Vo type item views
 */
class VoViewController extends ViewController{

    // html element ids
    browseSelectId;
    browseSearchId;

    // repository for the Vo this view displays
    repository;

    // is the displayed item a new one a already existing one
    isCurrentItemNew;

    // displayed item id, not used when saving a new item
    currentItemId;


    constructor(repository){
        super();
        this.repository = repository;
    }

    init(){
        this.createNewItem();
    }

    // displays field values of the selected item in the views inputs
    showItem(o){
        // abstract
    }

    setCurrentItemAsNotNew(o){
        this.isCurrentItemNew = false;
        this.currentItemId = o.id;
    }

    setCurrentItemAsNew(){
        this.isCurrentItemNew = true;
        this.currentItemId = -1;
    }

    // constrcuts a new instace of displayed item type
    constructNewItem(){
        // abstract
    }

    // constructs an instance of the displayed item type from the values in the inputs
    constructItemFromView(){
        // abstract
    }


    // called when an item is selected for display
    displayItem(o){
        this.setCurrentItemAsNotNew(o);
        this.showItem(o);
    }

    // called when a new item is to be created
    createNewItem(){
        this.setCurrentItemAsNew();
        var o = this.constructNewItem();
        this.showItem(o);
        this.loadSelectItemsBySearch();
    }

    // called when delete is performed
    deleteCurrentItem(){
        if(!this.isCurrentItemNew){
            this.repository.deleteById(this.currentItemId);
        }
        this.createNewItem();
        this.loadSelectItemsBySearch();
    }

    // called when save is performed
    saveOrUpdateCurrentItem(){
        var o = this.constructItemFromView();
        if(this.isCurrentItemNew){
            this.repository.put(o);
            this.setCurrentItemAsNotNew(o);
        } else {
            o.id = this.currentItemId;
            this.repository.update(o);
        }
        this.loadSelectItemsBySearch();
    }

    // loading data for select
    loadSelectItemsBySearch(){
        var searchedNamePart = $(this.browseSearchId).val();
        var loadedItems = this.repository.findAllByName(searchedNamePart);
        var selectionHTML = '<option value=-1></option>';
        for(var i = 0; i < loadedItems.length; i++){
            var o = loadedItems[i];
            if(!this.isCurrentItemNew && o.id == this.currentItemId){
                selectionHTML += `<option value=${o.id} selected>${o.name}</option>`;
            } else {
                selectionHTML += `<option value=${o.id}>${o.name}</option>`;
            }
        }
        $(this.browseSelectId).html(selectionHTML)
    }

    // display item selected with item selection
    loadSelectedItem(){
        var id = $(this.browseSelectId).val();
        if(id > -1){
            var o = this.repository.findById(id);
            this.displayItem(o);
        }
    }

}
