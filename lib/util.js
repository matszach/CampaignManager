const UTIL = {

    /**
     * creates a jagged array (array of arrays) of a specified size
     * @param {Number} x - first size of the array 
     * @param {Number} y - second size of the array
     * @return the requested array
     */
    createArray2D(x, y){
        var arr = new Array(x);
        for(var i = 0; i < x; i++) arr[i] = new Array(y);
        return arr;
    },
}