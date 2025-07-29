
Math.clamp = (value, min, max) => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
};


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


function radToDeg( radian = 0 ){
    return radian * 180 / Math.PI;
}


function getGraphOffetY( stepY = 25, thX = 90, thX2 = 100, valueX = 0 ){
    const segmentIndex = Math.trunc(valueX / thX2);
    let currentY = valueX % thX2;

    if ( currentY <= thX ){
        currentY = thX;
    }
    
    return stepY * segmentIndex + map(currentY, thX, thX2, 0, stepY);

}


function getNumericoWithSignal( str = '' ) {
    const mathObject = str.replace(/,/g, '.').match(/[+-]?\d*\.?\d+/);

    if ( !mathObject ) return '';

    const value = parseFloat(mathObject[0]);
    
    return (value >= 0 ? '+' : '') + value;
}
