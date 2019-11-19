class MapViewController extends ViewController{

    html = `
    <div class='componentDiv'>
        <div class='componentTitleDiv'>
            <p class='componentTitle'>Map</p>
        </div>
        <div class='componentContentDiv'>
            <div id='mapCanvasDiv'>
                <canvas id='mapCanvas'></canvas>    
            </div>
            <div id='mapToolsDiv'>
                <div id='colorPaletteDiv' class='mapEditorToolDiv'>
                
                </div>
            </div>
        </div>
    </div>
    `;

    map;
    mapEditorData;

    constructor(map, mapEditorData){
        super()
        this.map = map;
        this.mapEditorData = mapEditorData;
    }

    init(){ 
        this.attachListeners();
        this.fitMapCanvasToDiv();
        this.initToolsState();
    }

    /**
     * loading tool state
     */
    initToolsState(){
        this.loadColorPalette();
    }

    loadColorPalette(){
        var paletteHTML = '';
        for(var i = 0; i < this.mapEditorData.savedColors.length; i++){
            if(i % 3 == 0){
                paletteHTML += '<div class="colorPaletteRow">\n';
            }
            paletteHTML += `<div class="colorPaletteSingleColorSpan" style="background-color: ${this.mapEditorData.savedColors[i]}"></div>\n`;
            if(i % 3 == 2){
                paletteHTML += '</div>\n';
            }
        }
        console.log(paletteHTML);
        $('#colorPaletteDiv').html(paletteHTML);
    }

    
    /**
     * attaching view dependant listeners and intervals
     */
    attachListeners(){
        $(window).on('resize', e => this.resizeCanvasEvent(e));
    }

    /**
     * fitting the canvas to it's div
     */
    resizeCanvasEvent(event){
        // drop resize listener if the map canvas no longer exists
        if(!$('#mapCanvas').length){
            $(window).off('resize');
        // else apply resize
        } else {
            this.fitMapCanvasToDiv();
        }
    }

    fitMapCanvasToDiv(){
        $('#mapCanvas').width($('#mapCanvasDiv').width());
        $('#mapCanvas').height($('#mapCanvasDiv').height());
    }

}
