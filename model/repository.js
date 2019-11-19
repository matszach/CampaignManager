/**
 * wrapper class for collection of vo items
 */
class Repository{

    // class that the repository stores
    storedType;

    // collection of stored items
    items = [];

    // id for next next item
    nextId = 0;


    // constructors
    constructor(type){
        this.storedType = type;
    }

    reload(loadedRepository){
        this.storedType = loadedRepository.storedType;
        this.items = loadedRepository.items;
        this.nextId = loadedRepository.nextId;
    }

    // put
    put(o){
        o.id = this.nextId++;
        this.items.push(o);
    }

    // update
    update(o){
        for(var i = 0; i < this.items.length; i++){
            if(!this.items[i]) continue;
            if(o.id == this.items[i].id){
                this.items[i] = o;
                return true;
            }
        }
        return false;
    }


    // find
    findById(id){
        for(var i = 0; i < this.items.length; i++){
            var item = this.items[i];
            if(!item) continue;
            if(item.id == id){   
                return item;
            }
        }
        return null;
    }

    findAllByName(name){
        var matchingItems = []
        for(var i = 0; i < this.items.length; i++){
            var item = this.items[i];
            if(!item) continue;
            if(item.name.includes(name)){   
                matchingItems.push(item);
            }
        }
        return matchingItems;
    }

    findAll(){
        return this.items;
    }

    // delete
    deleteById(id){
        for(var i = 0; i < this.items.length; i++){
            if(!this.items[i]) continue;
            if(this.items[i].id == id){
                delete this.items[i];
                return true;
            }
        }
        return false;
    }

}