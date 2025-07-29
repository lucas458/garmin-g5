


function generateVerticalSpeedStrip(){
    verticalSpeedStrip.innerHTML = '';

    for (let i = 0; i < 25; i++){
        const tick = document.createElement("div");
        tick.classList.add("miniTickShort");
        verticalSpeedStrip.appendChild(tick);
    }

    [2,7,17,22].forEach(e => {
        verticalSpeedStrip.children[e].classList = "miniTickLong";
        verticalSpeedStrip.children[e].classList.add("fontSmall")
        verticalSpeedStrip.children[e].innerHTML = `<div>${Math.abs(12-e)}</div>`;
    });

}





function generateAltitudeStrip(){

    altitudeStrip.innerHTML = "";

    for (let i = 30000; i >= -1400; i-=20){ 

        if ( i%100 == 0 ){
            const bigTickLong = document.createElement("div");
            bigTickLong.classList.add("bigTickLong");

            let valueLeft = Math.trunc(i/1000);
            valueLeft = (valueLeft == 0)? '' : valueLeft;

            let valueRight;

            if ( i > -1000 ){
                valueRight = String(i%1000).padStart(3,0);
            }else{
                valueRight = String(Math.abs(i%1000)).padStart(3,0);
            }

            bigTickLong.innerHTML = `
            <div class="fontMedium">${valueLeft}</div>
            <div class="fontSmall2">${valueRight}</div>`;
            altitudeStrip.appendChild(bigTickLong);

        }else{
            const bigTickShort = document.createElement("div");
            bigTickShort.classList.add("bigTickShort");
            altitudeStrip.appendChild(bigTickShort);
        }

    }


}





function generateLadder( step = 10 ){
    ladderMoving.innerHTML = "";

    
    if ( step != 5 && step != 10 ){
        step = 10;
    }

    const PATTERN = ["ladderLineLong", "ladderLineSmall", "ladderLineMedium", "ladderLineSmall"];

    AIRPLANE.ladderStep = step;

    for (let i = 0; i < 90; i+=step){

        PATTERN.forEach(e => {
            const ladderLine = document.createElement("div");
            ladderLine.classList = e;
            if ( e == "ladderLineLong" ){
                ladderLine.setAttribute("value", (90-i));
            }
            ladderMoving.appendChild(ladderLine);
        });

    }


    const ladderLineHorizon = document.createElement("div");
    ladderLineHorizon.id = "ladderLineHorizon";

    ladderMoving.appendChild(ladderLineHorizon);
    PATTERN.reverse();

    for (let i = 0; i < 90; i+=step){

        PATTERN.forEach(e => {
            const ladderLine = document.createElement("div");
            ladderLine.classList = e;
            if ( e == "ladderLineLong" ){
                ladderLine.setAttribute("value", (i+step));
            }
            ladderMoving.appendChild(ladderLine);
        });

    }



}





function generateSpeedStrip(){
    speedStrip.innerHTML = "";

    for (let i = 300; i >= 0; i-=10){
        const bigTickLong = document.createElement("div");
        bigTickLong.classList.add("bigTickLong");
        bigTickLong.innerHTML = `<div class="fontMedium">${i}</div>`;
        speedStrip.appendChild(bigTickLong);
        
        if ( i > 0 ){
            const bigTickShort = document.createElement("div");
            bigTickShort.classList.add("bigTickShort");
            speedStrip.appendChild(bigTickShort);
        }

    }

}





function generateHeadingStrip(){

    headingStrip.innerHTML = "";

    for (let i = 0; i <= 80; i++){
        
        let value = (i*5 + 340) % 360 ;

        const miniTickLongVertical = document.createElement("div");
        miniTickLongVertical.classList.add("miniTickLongVertical");

        if ( value%10 != 5 ){
            miniTickLongVertical.classList.add("fontSmall");

            switch (value) {
                case 0:
                    value = 'N';
                    break;
                case 90:
                    value = 'E';
                    break;
                case 180:
                    value = 'E';
                    break;
                case 270:
                    value = 'W';
                    break;
            }

            miniTickLongVertical.innerHTML = `<div>${value}</div>`;
        }

        headingStrip.appendChild(miniTickLongVertical);

        for (let i = 0; i < 4; i++){
            const miniTickShortVertical = document.createElement("div");
            miniTickShortVertical.classList.add("miniTickShortVertical");
            headingStrip.appendChild(miniTickShortVertical);
        }

    }

}





function generateCompassRotative(){

    compassRotative.innerHTML = "";

    const PATTERN = ['miniTickShort', 'miniTickLong', 'miniTickShort', 'miniTickLong', 'miniTickShort'];
    let angle = 0;

    for (let i = 0; i < 12; i++){

        let value = Math.trunc(30 * i / 10);

        switch (value) {
            case 0:
                value = 'N';
                break;
            case 9:
                value = 'E';
                break;
            case 18:
                value = 'S';
                break;
            case 27:
                value = 'W';
                break;
        }

        const bigTickLong = document.createElement("div");
        bigTickLong.innerHTML = `<div class="fontMedium">${value}</div>`;
        bigTickLong.classList.add("bigTickLong");
        bigTickLong.style.transform = `rotate(${angle}deg) translateY(-0.5px)`;

        bigTickLong.firstElementChild.style.transform =  `rotate(${-angle}deg)`;

        bigTickLong.firstElementChild.style.paddingLeft = (Math.cos(angle*Math.PI/180) * 2) + 'px';
        bigTickLong.firstElementChild.style.paddingTop = (Math.sin(angle*Math.PI/180) * 4) + 'px';

        compassRotative.appendChild(bigTickLong);

        angle += 5;
        
        PATTERN.forEach(e => {
            const tick = document.createElement("div");
            tick.classList.add(e);
            compassRotative.appendChild(tick);
            tick.style.transform = `rotate(${angle}deg)`;
            angle += 5;
        });

    }


}





function generateVerticalSpeedVariablesStatic(){
    verticalSpeedReferenceListStaic.innerHTML = '';

    const veriticalSpeedList = JSON.parse(JSON.stringify(AIRPLANE.veriticalSpeedReferences));
    veriticalSpeedList.sort((a, b) => b.value - a.value);

    veriticalSpeedList
        .filter(e => e.value > 0)
        .forEach(e => {
            const verticalSpeedReference = document.createElement("div");
            verticalSpeedReference.classList.add("verticalSpeedReference");
            verticalSpeedReference.innerHTML = `
            <div class="verticalSpeedReferenceValue fontSmall2">${e.value}</div>
            <div class="verticalSpeedReferenceLetter fontSmall">${e.name}</div>`;
            verticalSpeedReferenceListStaic.appendChild(verticalSpeedReference);
        });
    
}





function generateVerticalSpeedVariablesNormal(){
    verticalSpeedReferenceListNormalMoving.innerHTML = '';

    AIRPLANE.veriticalSpeedReferences
        .filter(e => e.value > 0)
        .forEach(e => {
            const verticalSpeedReference = document.createElement("div");
            verticalSpeedReference.classList.add("verticalSpeedReference");
            verticalSpeedReference.innerHTML = `<div class="verticalSpeedReferenceLetter fontSmall">${e.name}</div>`;
            verticalSpeedReference.style.transform = `translateY(${-map(e.value,0,300,0,1200)}px)`;
            verticalSpeedReferenceListNormalMoving.appendChild(verticalSpeedReference);
        });

}





function generateScrollThumbHeightByGenericScrollable( screenReference ){
    const viewportHeight = screenReference.querySelector(".genericContentWrapper").offsetHeight;
    const contentHeight  = screenReference.querySelector(".genericContentContainer").scrollHeight;
    const trackHeight    = viewportHeight;
    const thumbHeight    = viewportHeight / contentHeight * trackHeight;
    
    screenReference.querySelector(".genericScrollThumb").style.height = thumbHeight + 'px';
}


