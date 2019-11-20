class Map{
    fields;
    locationPositions;
    constructor(sizeX, sizeY){
        this.fields = UTIL.createArray2D(sizeX, sizeY);
        this.locationPositions = [];
    }
    reload(loadedMap){
        this.fields = loadedMap.fields;
        this.locationPositions = loadedMap.locationPositions;
    }
}

class MapEditorData{
    zoomState = 0;
    mapPosition;
    savedColors;
    constructor(sizeX, sizeY){
        this.zoomState = 100;
        this.mapPosition = {
            x: Math.floor(sizeX/2), 
            y: Math.floor(sizeY/2)
        } 
        this.savedColors = ['#ff0000', '#00ff00', '#0000ff', 
                            '#ffff00', '#00ffff', '#ff00ff',
                            '#000000', '#ffffff', '#ffffff',
                            '#ffffff', '#ffffff', '#ffffff'];
    }

    reload(loadedMapEditordata){
        this.zoomState = loadedMapEditordata.zoomState;
        this.mapPosition = loadedMapEditordata.mapPositon;
        this.savedColors = loadedMapEditordata.savedColors;
    }
}