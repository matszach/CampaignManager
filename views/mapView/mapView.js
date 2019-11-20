class MapViewController extends ViewController{

    // const
    baseFieldSize = 25;
    baseLineSize = 0.5;

    minScale = 25;
    maxScale = 400;
    scaleStep = 5;
    defaultScale = 100;

    html = `
    <div class='componentDiv'>
        <div class='componentTitleDiv'>
            <p class='componentTitle'>Map</p>
        </div>
        <div class='componentContentDiv'>
            <div id='mapCanvasDiv'>
                <canvas id='mapCanvas' 
                    >
                </canvas>    
            </div>
            <div id='mapToolsDiv'>
                <div id='colorPaletteDiv' class='mapEditorToolDiv'></div>
                <div id='colorEditDiv' class='mapEditorToolDiv'>
                    <input type='color' id='colorChooser' onchange='mapView.updateSelectedColor()'/>
                </div>
                <div id='zoomSliderDiv' class='mapEditorToolDiv'>
                    <input type='range' id='zoomSlider' class='mapToolsSlider' 
                        onchange='mapView.updateFromZoomSlider()' 
                        value='${this.defaultScale}' min='${this.minScale}' max='${this.maxScale}' step='${this.scaleStep}'/>
                    <label class='mapToolsLabel' id='zoomSliderValueLabel'></label>
                </div>
            </div>
        </div>
    </div>
    `;

    // campaign data
    map;
    mapEditorData;

    // session-only data
    selectedColor;
    
    // intervals
    displayOnMapCanvasInterval;

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
     * loading tool state ==========================================================================================
     */
    initToolsState(){
        this.loadColorPalette();
        this.loadZoomSlider();
    }

    /**
     * color palette ==========================================================================================
     */
    loadColorPalette(){
        var paletteHTML = '';
        for(var i = 0; i < this.mapEditorData.savedColors.length; i++){
            paletteHTML += `<div class="colorPaletteSingleColorDiv" onclick="mapView.selectThisColor(this);"
                            style="background-color: ${this.mapEditorData.savedColors[i]}"></div>\n`;
        }
        $('#colorPaletteDiv').html(paletteHTML);
    }

    selectThisColor(element){
        this.selectedColor = rgbToHex(element.style.backgroundColor);
        $('.selectedColorDiv').removeClass('selectedColorDiv');
        element.classList.add('selectedColorDiv');
        $('#colorChooser').val(this.selectedColor);
    }

    updateSelectedColor(){
        $('.selectedColorDiv').css('background-color', $('#colorChooser').val());
        var postUpdateColorList = [];
        var palette = $('.colorPaletteSingleColorDiv').toArray();
        for(var i = 0; i < palette.length; i++){
            postUpdateColorList.push(rgbToHex(palette[i].style.backgroundColor));
        }
        this.mapEditorData.savedColors = postUpdateColorList;
    }

    /**
     * Zoom ==========================================================================================
     */
    loadZoomSlider(){
        var z = this.mapEditorData.zoomState;
        $('#zoomSlider').val(z);
        this.updateFromZoomSlider();
    }

    updateFromZoomSlider(){
        var zoom = $('#zoomSlider').val();
        mapView.mapEditorData.zoomState = zoom;
        $('#zoomSliderValueLabel').html(zoom + '%');
    }

    // mouse wheel scrolling
    handleMouseWheel(event){
        if(event.originalEvent.deltaY < 0){
            this.increaseZoom();
        } else {
            this.reduceZoom();
        }
        var z = this.mapEditorData.zoomState;
        $('#zoomSlider').val(z);
        $('#zoomSliderValueLabel').html(z + '%');
    }
    increaseZoom(){
        mapView.mapEditorData.zoomState = parseInt(mapView.mapEditorData.zoomState) + this.scaleStep;
        if(mapView.mapEditorData.zoomState > this.maxScale){
            mapView.mapEditorData.zoomState = this.maxScale;
        }
    }
    reduceZoom(){
        mapView.mapEditorData.zoomState = parseInt(mapView.mapEditorData.zoomState) - this.scaleStep;
        if(mapView.mapEditorData.zoomState < this.minScale){
            mapView.mapEditorData.zoomState = this.minScale;
        }
    }
    


    /**
     * attaching view dependant listeners and intervals ==========================================================================================
     */
    attachListeners(){
        $(window).on('resize', e => this.resizeCanvasEvent(e));
        $('#mapCanvas').on('wheel', e => this.handleMouseWheel(e));
        this.displayOnMapCanvasInterval = setInterval(this.displayOnMapCanvas, 50);
    }

    dropListeners(){
        $(window).off('resize');
        clearInterval(mapView.displayOnMapCanvasInterval); 
    }



    /**
     * fitting the canvas to it's div ==========================================================================================
     */
    resizeCanvasEvent(event){
        this.fitMapCanvasToDiv();
    }

    fitMapCanvasToDiv(){
        var canvas = document.getElementById('mapCanvas');
        canvas.width = $('#mapCanvasDiv').width();
        canvas.height = $('#mapCanvasDiv').height();
    }



    /**
     * displaying on canvas ==========================================================================================
     */
    displayOnMapCanvas(){
        if(!$('#mapCanvas').length){
            mapView.dropListeners();
        }
        mapView.displayMapGridAndFields();
    }

    displayMapGridAndFields(){

        var canvasHeight = $('#mapCanvas').height();
        var canvasWidth = $('#mapCanvas').width();

        var canvas = document.getElementById('mapCanvas');
        if(!canvas) return;
        var ctx = canvas.getContext('2d');

        // reset
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // size variables
        var xLim = canvasWidth / mapView.baseFieldSize / mapView.mapEditorData.zoomState * 100;
        var yLim = canvasHeight / mapView.baseFieldSize / mapView.mapEditorData.zoomState * 100;
        var fieldSize = mapView.baseFieldSize * mapView.mapEditorData.zoomState / 100;

        // fields
        var fields = mapView.map.fields;
        for(var x = 0; x < xLim; x++){
            for(var y = 0; y < yLim; y++){
                if(fields[x][y]){
                    ctx.fillStyle = fields[x][y];
                    ctx.fillRect(x, y, fieldSize, fieldSize);
                } else { // TO BE REMOVED LATER
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(x * fieldSize, y * fieldSize, fieldSize, fieldSize);
                }
            }
        }

        ctx.beginPath();
        ctx.lineWidth = this.baseLineSize * mapView.mapEditorData.zoomState / 100;

        // vertical grid lines
        for(var x = 0; x < xLim; x++){
            var xVal = x * fieldSize;
            ctx.moveTo(xVal, 0);
            ctx.lineTo(xVal, canvasHeight);
        }

        // horisontal grid lines
        for(var y = 0; y < yLim; y++){
            var yVal = y * fieldSize;
            ctx.moveTo(0, yVal);
            ctx.lineTo(canvasWidth, yVal);
        }
        ctx.stroke();

    }



    /**
     * mouse actions on canvas ==========================================================================================
     */
    isMouseOver = false;
    isMouseLeftDown = false;
    isMouseRightDown = false;

    mouseIn(){

    }
    mouseOut(){

    }
    mouseUp(){

    }
    mouseDown(){

    }
    mouseReset(){

    }

    actOnCanvas(){
        this.drawAtCursor();
    }



    /**
     * drawing on canvas ==========================================================================================
     */
    drawAtCursor(){
        console.log('draw');
    }

}
