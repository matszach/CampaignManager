class MapViewController extends ViewController{

    // const
    baseFieldSize = 25;
    baseLineSize = 0.5;

    minScale = 25;
    maxScale = 400;
    scaleStep = 5;
    defaultScale = 100;

    // path
    objectPath = 'mapView';

    html = `
    <div class='componentDiv'>
        <div class='componentTitleDiv'>
            <p class='componentTitle'>Map</p>
        </div>
        <div class='componentContentDiv'>
            <div id='mapCanvasDiv'>
                <canvas id='mapCanvas' 
                    onmousemove='${this.objectPath}.mouseMoveHandle(event)' 
                    onmouseenter='${this.objectPath}.mouseEnterHandle(event)' 
                    onmouseout='${this.objectPath}.mouseExitHandle(event)' 
                    onmousedown='${this.objectPath}.mouseDownHandle(event)' 
                    onmouseup='${this.objectPath}.mouseUpHandle(event)'>
                </canvas>    
            </div>
            <div id='mapToolsDiv'>
                <div id='colorPaletteDiv' class='mapEditorToolDiv'></div>
                <div id='colorEditDiv' class='mapEditorToolDiv'>
                    <input type='color' id='colorChooser' onchange='${this.objectPath}.updateSelectedColor()'/>
                </div>
                <div id='zoomSliderDiv' class='mapEditorToolDiv'>
                    <input type='range' id='zoomSlider' class='mapToolsSlider' 
                        onchange='${this.objectPath}.updateFromZoomSlider()' 
                        value='${this.defaultScale}' min='${this.minScale}' 
                        max='${this.maxScale}' step='${this.scaleStep}'/>
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
        this.mouseReset();
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
        $('#zoomSliderDiv').on('wheel', e => this.handleMouseWheel(e));
        this.displayOnMapCanvasInterval = setInterval(this.displayOnMapCanvas, 50);
        $('#mapCanvas').bind('contextmenu', () => {return false});      
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

        var canvasHeight = $('#mapCanvas').height();
        var canvasWidth = $('#mapCanvas').width();

        var canvas = document.getElementById('mapCanvas');
        if(!canvas) return;
        var ctx = canvas.getContext('2d');

        // reset
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // size variables
        var xMin = mapView.mapEditorData.mapPositionX;
        var yMin = mapView.mapEditorData.mapPositionY;
        var xMax = canvasWidth + xMin;
        var yMax = canvasHeight + yMin;
        var fieldSize = mapView.baseFieldSize * mapView.mapEditorData.zoomState / 100;

        mapView.displayMapGrid(ctx, xMin, xMax, yMin, yMax, fieldSize, canvasWidth, canvasHeight);

        
        // // fields
        // var fields = mapView.map.fields;
        // for(var x = 0; x < xLim + 1; x++){
        //     for(var y = 0; y < yLim + 1; y++){
        //         if(fields[x][y]){
        //             ctx.fillStyle = fields[x][y];
        //             ctx.fillRect(x, y, fieldSize, fieldSize);
        //         } else { 
        //             ctx.fillStyle = '#FFFFFF';
        //             ctx.fillRect(x * fieldSize, y * fieldSize, fieldSize, fieldSize);
        //         }
        //     }
        // }
    }

    displayMapGrid(ctx, xMin, xMax, yMin, yMax, fieldSize, canvasWidth, canvasHeight){
        ctx.beginPath();
        ctx.lineWidth = this.baseLineSize * mapView.mapEditorData.zoomState / 100;
        for(var x = xMin % fieldSize; x < xMax - xMin; x += fieldSize){
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
        }
        for(var y = yMin % fieldSize; y < yMax - yMin; y += fieldSize){
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
        }
        ctx.stroke();
    }



    /**
     * mouse actions on canvas ==========================================================================================
     */
    mouseIsActive = false;
    mouseX = 0;
    mouseY = 0;
    mouseIsRightDown = false;
    mouseIsLeftDown = false;

    mouseMoveHandle(event){
        var off = $('#mapCanvas').offset();
        this.handleCanvasDrag();
        this.mouseX = event.pageX - off.left;
        this.mouseY = event.pageY - off.top;
    }
    mouseEnterHandle(event){
        this.mouseIsActive = true;
        this.mouseMoveHandle(event);
    }
    mouseExitHandle(event){
        this.mouseIsActive = false;
        this.mouseX = 0;
        this.mouseY = 0;
    }
    mouseDownHandle(event){
        if(event.buttons == 0) { // no buttons
            // nothing
        } else if(event.buttons == 1) { // only left
            this.mouseLeftDownStart();
        } else if(event.buttons == 2) { // only right
            this.mouseRightDownStart();
        } else if(event.buttons == 3) { // both
            this.mouseLeftDownStart();
            this.mouseRightDownStart();
        }
    }
    mouseUpHandle(event){
        if(event.buttons == 0) { // no buttons
            this.mouseLeftDownEnd();
            this.mouseRightDownEnd();
        } else if(event.buttons == 1) { // only left
            this.mouseRightDownEnd();
        } else if(event.buttons == 2) { // only right
            this.mouseLeftDownEnd();
        } else if(event.buttons == 3) { // both
            // nothing
        }
    }


    mouseReset(){
        this.mouseIsActive = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseIsRightDown = false;
        this.mouseIsLeftDown = false;
    }

    mouseLeftDownStart(){
        this.mouseIsLeftDown = true;

    }
    mouseLeftDownEnd(){
        this.mouseIsLeftDown = false; 
    }
    mouseRightDownStart(){
        this.mouseIsRightDown = true;
        $('#mapCanvas').css('cursor', 'grabbing');

    }
    mouseRightDownEnd(){
        this.mouseIsRightDown = false; 
        $('#mapCanvas').css('cursor', 'crosshair');
    }

    /**
     * mouse actions on canvas proper ==========================================================================================
     */
    handleCanvasDrag(){
        if(this.mouseIsRightDown){
            var off = $('#mapCanvas').offset();
            var x = this.mouseX - event.pageX + off.left;
            var y = this.mouseY - event.pageY + off.top;
            this.mapEditorData.mapPositionX -= x;
            this.mapEditorData.mapPositionY -= y;
        }
    }

}
