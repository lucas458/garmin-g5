
// https://www.youtube.com/watch?v=FGX4QLsL2Rc


var timerCloseScreen = null;

function clearTimerCloseScreen(){

    if ( timerCloseScreen == null ){
        return;
    }

    clearTimeout(timerCloseScreen);
    timerCloseScreen = null;
}


function startTimerCloseScreen(){
    clearTimerCloseScreen();
    timerCloseScreen = setTimeout(onTimerCloseScreenTimeout, 2000);
}



function onTimerCloseScreenTimeout(){
    const currentContainerOpened = getCurrentContainerOpened();

    if ( currentContainerOpened == "popupValue" ){
        popupValueContainer.classList.remove("popupValueOpen");
    }

    clearTimerCloseScreen();
}


 


function setCompassRotative(angle){
    angle = Math.clamp(angle, 0, 360);
    compassRotative.style.transform = `rotate(${360-angle+90}deg)`;
    compassRotative.querySelectorAll(".fontMedium").forEach((e, i) => {
        e.style.transform = `rotate(${angle - (30 * i) - 90}deg)`;
    });
}





function setAltitude( altitude = 0 ){
    altitude = Math.clamp(altitude, -1400, 30000);

    if ( altitude > 0 ){
        altitudeStrip.style.transform = `translateY(${map(altitude, 0, 30000, 0, 18000)}px)`;
    }else{
        altitudeStrip.style.transform = `translateY(${map(altitude, -1400, 0, -840, 0)}px)`;
    }
    
    altitudeReadoutLeft.children[1].children[10].style.opacity = Math.trunc(altitude >= -900);
    altitudeReadoutLeft.classList.toggle("altitudeReadoutNegative100", altitude >= -980);
    altitudeReadoutLeft.classList.toggle("altitudeReadoutNegative", altitude < 0);
    
    const SIGNAL = Math.sign(altitude);
    altitude = Math.abs(altitude);
    
    altitudeReadoutLeft.children[1].lastElementChild.style.visibility = (altitude >= 1000) ? 'visible' : 'hidden';
    altitudeReadoutLeft.children[0].style.visibility = (altitude >= 9980) ? "visible" : "hidden";
    altitudeReadoutLeft.children[1].style.visibility = (altitude >= 980) ? "visible" : "hidden";
    
    altitudeReadoutLeft.children[0].style.transform = `translateY(${ getGraphOffetY(20, 10000-20, 10000, altitude%100000) * SIGNAL }px)`;
    altitudeReadoutLeft.children[1].style.transform = `translateY(${ getGraphOffetY(20, 1000-20, 1000, altitude%10000) * SIGNAL }px)`;
    altitudeReadoutLeft.children[2].style.transform = `translateY(${ getGraphOffetY(20, 100-20, 100, altitude%1000) * SIGNAL }px)`;

    if ( altitude >= 100 ){
        altitudeReadoutRight.children[0].style.transform = `translateY(${ (getGraphOffetY(20, 0, 20, altitude%100) + 100) * SIGNAL }px)`;
    }else{
        altitudeReadoutRight.children[0].style.transform = `translateY(${getGraphOffetY(20, 0, 20, altitude%100) * SIGNAL }px)`;
    }

    updateSelectedAltitude();
}





function setVerticalSpeed( verticalSpeed = 0 ){
    verticalSpeed = Math.clamp(verticalSpeed, -1200, 1200);

    if ( verticalSpeed > 0 ){
        verticalSpeedIndicatorBox.style.transform = 'rotate(180deg)';
        verticalSpeedDesiredValue.innerHTML = '+' + verticalSpeed;
    }else{
        verticalSpeedIndicatorBox.style.transform = 'rotate(0deg)';
        verticalSpeedDesiredValue.innerHTML = verticalSpeed;
    }
    
    verticalSpeedIndicatorBox.style.height = map(Math.abs(verticalSpeed), 0, 1200, 0, 85) + 'px';
    verticalSpeedIndicator.style.transform = `translateY(${map(verticalSpeed, 1200, -1200, -85, 85)}px)`;

}


function toggleVerticalSpeedVisiblity( isVisible ){
    verticalSpeedDesired.classList.toggle("verticalSpeedDesiredVisible", isVisible);
}


function setAltitudeAdjust( value ){
    altitudeAdjust.innerHTML = value;
}


function setAutopilotAltitude( altitudeValue = 0 ){
    altitudeValue = Math.clamp(altitudeValue, -1400, 30000);
    const index = Math.trunc((30000 - altitudeValue) / 100);
    document.querySelectorAll(".autopilotAutitude").forEach(e => e.classList.remove("autopilotAutitude"));
    altitudeStrip.querySelectorAll('.bigTickLong')[index].classList.add("autopilotAutitude");
    setSelectedAltitude(altitudeValue);
    altitudeDesiredValue.innerHTML = altitudeValue;
}



function setAttitude(pitch, roll, yaw){
    pitch = Math.clamp(pitch, -90, 90);
    roll = Math.clamp(-roll, -180, 180);
    yaw = Math.clamp(yaw, 0, 360);
    
    let posY = 0;

    if ( AIRPLANE.ladderStep == 10 ){
        posY = map(pitch, -90, 90, -288, 288);
    }else{ 
        posY = map(pitch, -90, 90, -576, 576);
    }

    ladderRotation.style.transform = `rotate(${roll}deg)`;
    ladderMoving.style.transform = `translateY(${posY}px)`;

    skyGroundRotation.style.transform = `rotate(${roll}deg)`
    skyGroundMoving.style.transform = `translateY(${posY}px)`


    headingStrip.style.transform = `translateX(${map(360-yaw, 0,360,-1872,0)}px)`;
    
    //headingReadoutValue.firstElementChild.innerHTML = String(Math.round(yaw)).padStart(3,0) + '°';

    document.querySelectorAll(".headingReadoutValue").forEach(headingReadoutValue => {
        headingReadoutValue.firstElementChild.innerHTML = String(Math.round(yaw)).padStart(3,0) + '°';
    });


    bankIndicatorRotation.style.transform = `rotate(${Math.clamp(roll, -60, 60)}deg)`;
    
    let courseDiff      = AIRPLANE.selectedCourse - yaw + 360;
    let groundTrackDiff = AIRPLANE.selectedGroundTrack - yaw + 360;
    let headingDiff     = AIRPLANE.selectedHeading - yaw + 360;

    if ( yaw >= 180 ){
        courseDiff += 360;
        groundTrackDiff += 360;
        headingDiff += 360;
    }
    

    if ( AIRPLANE.selectedCourse > 180 ){
        courseDiff -= 360;
    }
    
    if ( AIRPLANE.selectedGroundTrack > 180 ){
        groundTrackDiff -= 360;
    }
    
    if ( AIRPLANE.selectedHeading > 180 ){
        headingDiff -= 360;
    }
    
    headingGroundTrackTriangle.style.transform = `translateX(${map(groundTrackDiff, 0,360,-1872,0)}px)`;
    headingCourse.style.transform = `translateX(${map(courseDiff, 0,360,-1872,0)}px)`;
    headingBug.style.transform = `translateX(${Math.clamp(map(headingDiff, 0,360,-1872,0), -96, 73)}px)`;    

    rotativeGroundTrackContainer.style.transform = `rotate(${AIRPLANE.selectedGroundTrack - 90 - yaw}deg)`;

    rotativeHeadingBug.style.transform = `rotate(${AIRPLANE.selectedHeading - yaw}deg)`;

    headingDesiredValue.innerHTML = String(AIRPLANE.selectedHeading).padStart(3,0) + '°';


    AIRPLANE.bearingPointers.forEach((bearing, bearingIndex) => {
        setBearingPointerRotation(bearingIndex, bearing.value - yaw);
    });

    setCourseDeviation(AIRPLANE.bearingSource.rotation - yaw, AIRPLANE.bearingSource.deviationPercent, AIRPLANE.bearingSource.isMagenta);
    setFlightDirectorPositions(AIRPLANE.flightDirectorHorizontal, AIRPLANE.flightDirectorVertical);
    setCompassRotative(yaw);
    setWindInformation(AIRPLANE.wind.speed, AIRPLANE.wind.direction, AIRPLANE.wind.direction - yaw);

}










function setSpeed( speed = 0 ){
    speed = Math.clamp(speed, 0, 300);
    
    speedStrip.style.transform = `translateY(${map(speed, 0, 300, 0, 1200)}px)`;
    
    speedReadoutLeft.children[0].children[10].style.visibility = (AIRPLANE.speed >= 100)? 'visible' : 'hidden';
    speedReadoutLeft.children[0].style.visibility = (speed >= 99) ? "visible" : "hidden";

    speedReadoutLeft.children[0].style.transform  = `translateY(${getGraphOffetY(20, 99, 100, speed%1000)}px)`;
    speedReadoutLeft.children[1].style.transform  = `translateY(${getGraphOffetY(20, 9, 10, speed%100)}px)`;
    speedReadoutRight.children[0].style.transform = `translateY(${getGraphOffetY(20, 0, 1, speed%10)}px)`;

    verticalSpeedReferenceListStaic.style.opacity = Math.trunc(speed <= 4);
    verticalSpeedReferenceListNormalMoving.style.transform = `translateY(${map(speed, 0, 300, 0, 1200)}px)`;

    speedColorList.style.transform = `translateY(${map(speed, 0, 300, 0, 1200)}px)`;

    updateSelectedSpeed();

}



// DO NOT USE DIRECTY
function updateSelectedSpeed(){
    const diff = AIRPLANE.speed - AIRPLANE.selectedSpeed;
    let posY = map(diff, 0, 300, 0, 1200);

    if ( pseudoLeftContainer.classList.contains("showGroundSpeedAndTemperature") ){
        posY = Math.clamp(posY, -93, 79);
    }else if ( pseudoLeftContainer.classList.contains("showGroundSpeedOnly") ){
        posY = Math.clamp(posY, -93, 92);
    }else{
        posY = Math.clamp(posY, -93, 112);
    } 

    speedBug.style.transform = `translateY(${posY}px)`;
    speedDesiredValue.innerHTML = AIRPLANE.selectedSpeed;

}



// DO NOT USE DIRECTY
function updateSelectedAltitude(){
    const diff = AIRPLANE.altitude - AIRPLANE.selectedAltitude;
    let posY = 0;

    if ( diff > 0 ){
        posY = map(diff, 0, 30000, 0, 18000);
    }else{
        posY = map(diff, -1400, 0, -840, 0);
    }

    
    if ( verticalSpeedDesired.classList.contains('verticalSpeedDesiredVisible') ){
        posY = Math.clamp(posY, -93, 73);
    }else{
        posY = Math.clamp(posY, -93, 93);
    }

    altitudeBug.style.transform = `translateY(${posY}px)`;


    if ( Math.abs(diff) < 1000 ){
        if ( !blinkAltitudeDesiredFlag1000 ){
            blinkAltitudeDesiredFlag1000 = true;
            blinkAltitudeDesired();
        }
    }else{
        blinkAltitudeDesiredFlag1000 = false;
    }
    
    if ( Math.abs(diff) < 200 ){
        if ( !blinkAltitudeDesiredFlag200 ){
            blinkAltitudeDesiredFlag200 = true;
            blinkAltitudeDesired();
        }
    }else{
        blinkAltitudeDesiredFlag200 = false;
    }

}


var blinkAltitudeDesiredFlag200 = false;
var blinkAltitudeDesiredFlag1000 = false;


function toggleAltitudeDesiredYellow(state){
    altitudeDesired.classList.toggle("altitudeDesiredYellow", state);
}


function blinkAltitudeDesired(){
    altitudeDesired.classList.remove("altitudeDesiredYellow");

    for (let i = 0; i < 10; i++){
        setTimeout(toggleAltitudeDesiredYellow, 500 * i);
    }
}


function setSelectedAltitude( altitude ) {
    AIRPLANE.selectedAltitude = Math.clamp(altitude, -1400, 30000);
    blinkAltitudeDesiredFlag200 = true;
    blinkAltitudeDesiredFlag1000 = true;
    updateSelectedAltitude();
}


function setSelectedSpeed( speed ){
    AIRPLANE.selectedSpeed = Math.clamp(speed, 0, 300);
    updateSelectedSpeed();
}



function setHeadingViewMode( isTrack = false, isMagenta ){

    if ( isMagenta == null ){
        isMagenta = isTrack;
    }
    
    document.querySelectorAll(".headingReadout").forEach(headingReadout => {
        headingReadout.querySelector(".headingReadoutTRK").style.opacity = Math.trunc(isTrack);
        headingReadout.querySelector(".headingReadoutValue").lastElementChild.style.opacity = Math.trunc(isTrack);
        headingReadout.querySelector(".headingReadoutValue").firstElementChild.style.color = isMagenta ? '#bb509d' : '#fff';
    });

}





function setGlideLocalizerThumbType(containerReference, isDiamond = false, isDiamondGreen = true ){

    if ( !isDiamond ){
        containerReference.innerHTML = '<div class="glideLocalizerThumbTriangle"></div>';
    }
    
    containerReference.innerHTML = '<div class="glideLocalizerThumbDiamond"></div>';
    containerReference.firstElementChild.classList.toggle("glideLocalizerThumbDiamondGreen", isDiamondGreen);

}



function setGlideThumbType(isDiamond = false, isDiamondGreen = false){
    setGlideLocalizerThumbType(glideslopeContainer.querySelector('.glideLocalizerThumbContainer'), isDiamond, isDiamondGreen);
}


function setLocalizerThumbType(isDiamond = false, isDiamondGreen = false){
    setGlideLocalizerThumbType(localizerContainer.querySelector('.glideLocalizerThumbContainer'), isDiamond, isDiamondGreen);
}



function setGlidePosition( percent = 0 ){
    percent = Math.clamp(percent, -100, 100);
    glideslopeContainer.querySelector('.glideLocalizerThumbContainer > div').style.transform = `translateX(${map(percent, -100, 100, -45, 45)}px)`;
}


function setLocalizerPosition( percent ){
    percent = Math.clamp(percent, -100, 100);
    localizerContainer.querySelector('.glideLocalizerThumbContainer > div').style.transform = `translateX(${map(percent, -100, 100, -45, 45)}px)`;
}


function setTurnRateTrend( percent = 0 ){
    percent = Math.clamp(percent, -100, 100);
    const absolutePercent = Math.abs(percent);
    turnRateIndicatorTrendContainer.classList.toggle("turnRateIndicatorTrendToLeft", percent < 0);
    turnRateIndicatorTrend.style.transform = `translateX(${map(absolutePercent, 0, 100, -60, -20)}px)`;
}


function setSlipIndicatorBall( percent = 0 ){
    percent = Math.clamp(percent, -100, 100);
    slipIndicatorBall.style.transform = `translateX(${map(percent, -100, 100, -26, 26)}px)`;
}





function setGroundspeed( value = 0 ){
    value = Math.trunc(Math.clamp(value, 0, 999));
    groundSpeedContainer.children[1].innerHTML = value;
}


function setOAT( value = 0, isCelsius = true ){
    value = Math.trunc(Math.clamp(value, -999, 999));
    const OUTPUT = value + ( isCelsius? "°C" : "°F" );
    outsideAirTemperatureContainer.lastElementChild.innerHTML    = OUTPUT;
    outsideAirTemperatureContainerHsi.lastElementChild.innerHTML = OUTPUT;
}


function setCurrentDerisedTrackContainer( value = 0, isCurrentTrack = true ){
    value = Math.trunc(Math.clamp(value, 0, 999));
    currentDesiredTrackContainer.children[0].innerHTML = isCurrentTrack? "TRK" : "DTK";
    currentDesiredTrackContainer.children[1].innerHTML = value + '°';
}


function setWindInformation( speed = 0, direction = 0, rotationAngle = 0 ){
    speed         = Math.trunc(speed);
    direction     = Math.trunc(direction);
    rotationAngle = (rotationAngle + 360) % 360;

    windContent.children[0].innerHTML = speed + ' KT';
    windContent.children[1].innerHTML = direction;
    windArrow.style.transform = `rotate(${rotationAngle}deg)`;
}


function setBearingDistance( distance = 0 ){
    bearingDistance.children[1].innerHTML = distance.toFixed(1);
}


function setBatteryInfo( percent = 100 ){
    percent = Math.clamp(percent, 0, 100);
    batteryInformation.children[0].innerHTML = Math.trunc(percent) + "%";
}







function setFlightDirectorPositions( horizontal = 0, vertical = 0 ){
    horizontal = Math.clamp(horizontal, -46, 46);
    vertical   = Math.clamp(vertical, -46, 46);
    flightDirectorHorizontal.style.transform = `translateY(${horizontal}px)`;
    flightDirectorVertical.style.transform = `translateX(${vertical}px)`;

    // const ANGLE = map(vertical, -46, 46, -15, 15);
    setFlightDirectorSingle(horizontal, vertical);

}



function setFlightDirectorSingle( pitch = 0, roll = 0 ){
    flightDirectorSingleMoveable.style.transform = `translateY(${pitch}px) rotate(${roll}deg)`;
}


function flightDirectorSingleMoveableVisible( isVisible = true, isActive = false ){
    const IMAGE = isActive? "../svg/clueMoveable.svg" : "../svg/clueMoveableBase.svg";
    flightDirectorSingleMoveable.querySelectorAll("img").forEach(img => img.src = IMAGE);
    flightDirectorSingleMoveable.style.display = isVisible? '' : 'none';
}


function setFlightDirectorVisibility( type = 0 ){
    // -1 is DEBUG (BARS & CLUE)
    //  0 is HIDDEN
    //  1 is BARS
    //  2 is CLUE
    // type = -1;

    flightDirectorContainer.classList.toggle("flightDirectorVisible", type == 1 || type == -1);
    flightDirectorFixed.classList.toggle("flightDirectorVisible", type == 1 || type == -1);
    flightDirectorSingleContainer.classList.toggle("flightDirectorSingleContainerVisible", type == 2 || type == -1);
}









function setBearingPointerRotation(bearingIndex = 0, angle = 0 ){
    const rotativeBearing = document.querySelectorAll(".rotativeBearing")[bearingIndex];

    if ( rotativeBearing == null ){
        return;
    }

    rotativeBearing.style.transform = `rotate(${angle}deg)`;
    
}



function setBearingPointerSource(bearingIndex = 0, sourceName = 'none'){
    const rotativeBearing = document.querySelectorAll(".rotativeBearing")[bearingIndex];

    if ( rotativeBearing == null ){
        return;
    }

    AIRPLANE.bearingPointers[bearingIndex].source = sourceName;
    DOCK_SELECTOR_OPTIONS['setup'].options[bearingIndex].button = sourceName

    const BEARING_VISIBLE = (sourceName.toLowerCase() != 'none');
    rotativeBearing.classList.toggle("rotativeBearingVisible", BEARING_VISIBLE);
    bearingTypeContent.children[bearingIndex].classList.toggle("bearingTypeVisible", BEARING_VISIBLE);
    bearingTypeContent.children[bearingIndex].lastElementChild.innerHTML = sourceName;

}



function setCourseDeviation(rotation = 0, deviationPercent = 0, isMagenta = true){
    deviationPercent = Math.clamp(deviationPercent, -100, 100);
    rotativeCourseDeviationContainer.classList.toggle("rotativeCourseDeviationContainerMagenta", isMagenta);
    rotativeCourseDeviationContainer.style.transform = `rotate(${rotation}deg)`;

    let posX = 0;

    if ( deviationPercent < 0 ){
        posX = map(deviationPercent, -100, 0, -62, 0);
    }else{
        posX = map(deviationPercent, 0, 100, 0, 64);
    }

    rotativeCourseDeviationContainer.querySelector(".rotativeArrowBodyLine").style.transform = `translateX(${posX}px)`;

}



function setAutopilotAnnunciationByIndex( index ){

    const ANNUNCIATION = AUTOPILOT_ANNUNCIATIONS[index];

    if ( ANNUNCIATION == null ){
        toggleAutopilotAnnunciation(false);
        return;
    }

    setAutopilotAnnunciation(ANNUNCIATION.text, ANNUNCIATION.colorType, true);
}



function setAutopilotAnnunciation(text = '', colorType, isVisible = true){
    const COLOR = AUTOPILOT_ANNUNCIATIONS_COLOR[colorType];
    
    if ( COLOR == null ){
        return;
    }
    
    autopilotAnnunciation.classList = "fontSmall2";
    autopilotAnnunciation.innerHTML = text;
    autopilotAnnunciation.classList.add(COLOR);
    autopilotAnnunciation.classList.toggle("autopilotAnnunciationVisible", isVisible);
}



function toggleAutopilotAnnunciation( isVisible ){
    autopilotAnnunciation.classList.toggle("autopilotAnnunciationVisible", isVisible);
}


function togglePitchTrimFail( isVisible ){
    autopilotAnnunciationPitchTrimFail.classList.toggle("autopilotAnnunciationVisible", isVisible);
}


function setSpeedAnnunciation( isMaxSpeed = true, isVisible = true ){
    autopilotAnnunciationSpeedMinMax.innerHTML = isMaxSpeed? "MAXSPD" : "MINSPD";
    autopilotAnnunciationSpeedMinMax.classList.toggle("autopilotAnnunciationVisible", isVisible);
}













function setPopupValueContent(title = 'text', value = '000', center = false){
    popupValueHeader.innerHTML = title;
    popupValue.innerHTML = value;
    popupValueContainer.classList.toggle("popupValueContainerCenter", center);

}


function openPopupValue(){
    startTimerCloseScreen();
    popupValueContainer.classList.add("popupValueOpen");
}







function getDockSelectorNormalButton(label, icon){
    const dockSelectorWrapper = document.createElement("div");
    dockSelectorWrapper.classList.add("dockSelectorWrapper");
    dockSelectorWrapper.classList.add("dockSelectorWrapperNormal");
    dockSelectorWrapper.classList.add("dockSelectorButton");

    dockSelectorWrapper.innerHTML = ` 
        <div class="dockSelectorIcon">${icon}</div>
        <div class="dockSelectorLabel fontSmall2">${label}</div> 
    `;

    return dockSelectorWrapper;
}



function getDockSelectorNestedButton(label, button){
    const dockSelectorWrapper = document.createElement("div");
    dockSelectorWrapper.classList.add("dockSelectorWrapper");
    dockSelectorWrapper.classList.add("dockSelectorWrapperNested");

    dockSelectorWrapper.innerHTML = `
        <div class="dockSelectorLabel fontSmall2">${label}</div>
        <div class="dockSelectorButton fontSmall">${button}</div>
    `;

    return dockSelectorWrapper;
}


function toggleDockSelectorScreen( isOpen ){
    dockSelectorContainer.classList.toggle("dockSelectorOpen", isOpen);
}


function setDockSelectorContents( optionName = '', isOpen = true ){

    const OPTION = DOCK_SELECTOR_OPTIONS[optionName];

    if ( OPTION == null ){
        return;
    }

    dockSelectorWrapperList.innerHTML = '';
    dockSelectorWrapperList.setAttribute("group", optionName);
    dockSelectorHeader.innerHTML = OPTION.title;
    
    if ( OPTION.hasBackButton ){
        dockSelectorWrapperList.appendChild( getDockSelectorNormalButton("Back", '') );
    }

    OPTION.options.forEach(optionItem => {

        if ( optionItem.normal ){
            dockSelectorWrapperList.appendChild( getDockSelectorNormalButton(optionItem.label, optionItem.icon) );
        }else{
            dockSelectorWrapperList.appendChild( getDockSelectorNestedButton(optionItem.label, optionItem.button) );
        }

    });

    dockSelectorWrapperList.firstElementChild.classList.add("dockSelectorSelected");
    toggleDockSelectorScreen(isOpen);

}












function setMessage( text = '', isVisible = true ){
    messageText.innerHTML = text;
    messageContainer.classList.toggle("messageOpen", isVisible);
}


function toggleMessage( isVisible ){
    messageContainer.classList.toggle("messageOpen", isVisible);
}


function setMessageByIndex( index = 0, isVisible = true ){
    const MESSAGE = SYSTEM_MESSAGES[index];

    if ( MESSAGE == null ){
        return;
    }

    setMessage(MESSAGE, isVisible);
}








function togglePopupSelector( isOpen ){
    popupSelectorContainer.classList.toggle("popupSelectorOpen", isOpen);

    if ( !isOpen ){
        popupSelectorOptionList.innerHTML = "";
        popupSelectorContainer.removeAttribute('group');
    }

}


function getPopupSelectorGroup(){
    return popupSelectorContainer.getAttribute("group");
}


function setPopupSelector( optionName = 'bearing1', isOpen = true ){

    const OPTIONS = POPUP_SELECTOR_OPTIONS[optionName]; 

    if ( OPTIONS == null ){
        return;
    }

    popupSelectorContainer.setAttribute("group", optionName);
    popupSelectorHeader.innerHTML = OPTIONS.title;
    popupSelectorOptionList.innerHTML = "";

    OPTIONS.options.forEach(optionItem => {
        const popupSelectorOption = document.createElement("div");
        popupSelectorOption.classList.add("popupSelectorOption");
        popupSelectorOption.innerHTML = optionItem.label;
        popupSelectorOptionList.appendChild(popupSelectorOption);
    });

    popupSelectorOptionList.firstElementChild.classList.add("popupSelectorOptionSelected");
    togglePopupSelector(isOpen);

}









function getCurrentContainerOpened(){
    
    if ( messageContainer.classList.contains("messageOpen") ){
        return 'message';
    }

    if ( popupSelectorContainer.classList.contains("popupSelectorOpen") ){
        return 'popupSelector';
    }

    if ( popupValueContainer.classList.contains("popupValueOpen") ){
        return 'popupValue';
    }

    if ( popupConfirmContainer.classList.contains("popupConfirmOpen") ){
        return 'popupConfirm';
    }

    if ( dockSelectorContainer.classList.contains("dockSelectorOpen") ){
        return 'dockSelector'
    }
    
    if ( configurationModeScreen.classList.contains("configurationModeScreenOpen") ){
        return 'configurationScreen';
    }

    if ( configurationModeContainer.classList.contains("configurationModeContainerOpen") ){
        return 'configurationContainer';
    }

    if ( popupConnection.classList.contains("popupConnectionOpen") ){
        return 'popupConnection';
    }

    if ( menuContainer.classList.contains("menuOpen") ){
        return 'menu';
    }

    return null;
}












function setInterfaceScreen( isInterfaceTypeA ){
    interface_A.classList.toggle("interface_visible", isInterfaceTypeA);
    interface_B.classList.toggle("interface_visible", !isInterfaceTypeA); 

    frame.style.backgroundImage = (isInterfaceTypeA)? '' : 'url(images/GarminG5_DG.jpg.webp)';

    if ( isInterfaceTypeA ){
        generateMenuPfd();
        return;
    }

    generateMenuHsi();

}










function toggleConfigutarionMode( isOpen ){
    const currentButton = configurationModeContainer.querySelector(".genericButtonSelected");
    
    currentButton.classList.remove("genericButtonSelected");
    configurationModeContainer.querySelector(".genericMiniButton").classList.add("genericButtonSelected");
    configurationModeContainer.querySelector(".genericContentContainer").scrollTop = 0;
    configurationModeContainer.setAttribute("position", 0);
    
    configurationModeContainer.classList.toggle("configurationModeContainerOpen", isOpen);
    configurationModeScreen.classList.remove("configurationModeContainerOpen");
}



function toggleConfigutarionScreen(state){ 
    generateScrollThumbHeightByGenericScrollable(configurationModeScreen);
    configurationModeScreen.classList.toggle("configurationModeScreenOpen", state);

    setTimeout(()=>{
        configurationModeScreen.querySelector('.genericContentContainer').innerHTML = "";
    }, 120);
}





function togglePopupConfirm( isOpen ){

    if ( isOpen ){
        popupConfirmOptionList.firstElementChild.classList.toggle('popupConfirmOptionSelected', true);
        popupConfirmOptionList.lastElementChild.classList.toggle('popupConfirmOptionSelected', false);
    }

    popupConfirmContainer.classList.toggle("popupConfirmOpen", isOpen);
}





function turnOn(){
    toggleLCD(true);
    toggleSplashScreen(true);

    setTimeout(()=>{
        toggleLCD(false);
        toggleSplashScreen(false);
    }, 2000); // 2000
}


function turnOff(){
    toggleLCD(true);
}


function toggleSplashScreen(state){
    splashScreen.classList.toggle("splashScreenOpen", state);
}


function toggleLCD(disabled){
    lcdStateScreen.classList.toggle("lcdStateDisabled", disabled);
}












function getMenuButtonGeneric(name = 'back', text = 'Back', icon = '', unit){

    const menuItem = document.createElement("div");
    menuItem.classList.add("menuItem");
    menuItem.setAttribute('menu', name);

    if ( unit == null ){
        menuItem.innerHTML = `
        <div class="menuLabel">${text}</div>
        <div class="menuIcon fontMedium">${icon}</div>`;
    }else{
        menuItem.innerHTML = `
        <div class="menuLabel">${text}</div>
        <div class="menuIcon fontMedium">
            <div class="menuItemValue">${icon}</div>
            <div class="unitContainer">
                ${unit.split('').map(e => `<div>${e}</div>`).join('')}
            </div>
        </div>`;

    }

    return menuItem;
}


function getMenuButtonText(name = 'back', text = 'back', value = '0', showSignal = true, unit){

    if ( showSignal && getNumericoWithSignal(value) >= 0 ){
        value = '+' + value;
    } 
    const menuItem = getMenuButtonGeneric(name, text, value, unit);
    return menuItem;
}


function getMenuButtonToggle(name = 'back', text = 'back', active = true){

    const menuIconToggle = document.createElement("div");
    menuIconToggle.classList.add("menuIconToggle");
    menuIconToggle.classList.toggle("menuIconToggleActive", active);

    const menuItem = getMenuButtonGeneric(name, text, '');
    menuItem.querySelector(".menuIcon").appendChild(menuIconToggle);
    return menuItem;
}






function generateMenuPfd(){
    
    menuList.innerHTML = "";
    
    menuList.appendChild( getMenuButtonGeneric('back', 'Back', '') );
    menuList.appendChild( getMenuButtonGeneric('message', 'Message', '') );
    menuList.appendChild( getMenuButtonText('heading', 'Heading', AIRPLANE.selectedHeading.toString().padStart(3, 0) + "°", false, null) ); 
    menuList.appendChild( getMenuButtonText("altitude", "Altitude", AIRPLANE.selectedAltitude.toString().padStart(3, 0), false, 'ft') ); 
    // menuList.appendChild( getMenuButtonText("pitch", "Pitch", "0.0°", true, null) ); 
    menuList.appendChild( getMenuButtonGeneric('hsi', 'HSI', '') );
    menuList.appendChild( getMenuButtonGeneric('connection', 'Connection', '') );


    menuList.firstElementChild.classList.add("menuItemActive");
    menuList.setAttribute("position", 0);

    setTimeout(()=>{
        menuList.style.transform = "translateX(0px)";
        menuScrollThumb.style.left = '0px';
    }, 100);

}



function generateMenuHsi(){
    
    menuList.innerHTML = ""; 
    
    menuList.appendChild( getMenuButtonGeneric('back', 'Back', '') );
    menuList.appendChild( getMenuButtonGeneric('message', 'Message', '') );
    menuList.appendChild( getMenuButtonText('heading', 'Heading', AIRPLANE.selectedHeading.toString().padStart(3, 0) + "°", false, null) );  
    menuList.appendChild( getMenuButtonToggle('bearing_pointer', 'Bearing Pointer', true) );
    menuList.appendChild( getMenuButtonGeneric('pfd', 'PFD', '') );
    menuList.appendChild( getMenuButtonGeneric('setup', 'Setup', '') );
    menuList.appendChild( getMenuButtonGeneric('connection', 'Connection', '') );

    menuList.firstElementChild.classList.add("menuItemActive");
    menuList.setAttribute("position", 0);

    setTimeout(()=>{
        menuList.style.transform = "translateX(0px)";
        menuScrollThumb.style.left = '0px';
    }, 100);

}





function toggleMenuItem( menuItem ){

    if ( menuItem.querySelector(".menuIconToggle") == null ){
        return;
    }

    menuItem.querySelector(".menuIconToggle").classList.toggle("menuIconToggleActive");

}
















function getGenericButtonNormal(content, icon = null){
    const genericBigButtonNormal = document.createElement("div");
    genericBigButtonNormal.classList.add("genericBigButton", "genericBigButtonNormal", "fontSmall2");

    if ( icon != null ){
        genericBigButtonNormal.innerHTML += `<div class="genericBigButtonIcon">${icon}</div>`;
    }

    genericBigButtonNormal.innerHTML += `<div class="genericBigButtonText">${content}</div>`;
    return genericBigButtonNormal;
}



function getGenericButtonCell(c1, c2, c3, isCellRight = false){
    const genericBigButtonCell = document.createElement("div");
    genericBigButtonCell.classList.add("genericBigButton", "fontSmall2");

    genericBigButtonCell.classList.toggle("genericBigButtonCell", !isCellRight);
    genericBigButtonCell.classList.toggle("genericBigButtonCellRight", isCellRight);

    genericBigButtonCell.innerHTML = `
    <div class="genericBigButtonCellWrapper">${c1}</div>
    <div class="genericBigButtonCellWrapper">${c2}</div>
    <div class="genericBigButtonCellWrapper">${c3}</div>`;
    return genericBigButtonCell;
}



function getGenericCheckbox(checked = false){
    const genericCheckbox = document.createElement("div");
    genericCheckbox.classList.add("genericCheckbox");
    genericCheckbox.classList.toggle("genericCheckboxChecked", checked);
    genericCheckbox.innerHTML = '<div class="genericCheckboxMark">&check;</div>';
    return genericCheckbox;
}



function getGenericBigButtonNestedButton(content, contentButton, disabled = false){
    const genericBigButtonNested = document.createElement("div");
    genericBigButtonNested.classList.add("genericBigButton", "genericBigButtonNested", "fontSmall2");
    genericBigButtonNested.classList.toggle("genericBigButtonDisabled", disabled);

    genericBigButtonNested.innerHTML = `
    <div class="genericBigButtonNestedText">${content}</div>
    <div class="genericBigButtonNestedButton">${contentButton}</div>`;
    return genericBigButtonNested;
}



function generateConfigurationScreen( buttonList = [], title = '' ){
    const genericContentContainer = configurationModeScreen.querySelector('.genericContentContainer');
    genericContentContainer.innerHTML = "";
    configurationModeScreen.querySelector(".genericHeader").innerHTML = title;
    
    buttonList.forEach(button => {

        if ( button.type == "normal" ){
            genericContentContainer.appendChild( getGenericButtonNormal(button.content, button.icon) );
        }else if ( button.type == "nested" ){
            genericContentContainer.appendChild( getGenericBigButtonNestedButton(button.content, button.contetButton, button.disabled) ); 
        }else if ( button.type == "cell" || button.type == "cellRight" ){

            let rawContent = [];

            button.contentList.forEach(contentItem => {

                if ( contentItem.mode == "text" ){
                    rawContent.push(contentItem.content);
                }else if ( contentItem.mode == "button" ){
                    rawContent.push(`<div class="genericBigButtonNestedButton">${contentItem.content}</div>`);
                }else if ( contentItem.mode == "checkbox" ){
                    const tempContainer = document.createElement("div");
                    tempContainer.appendChild( getGenericCheckbox(contentItem.checked) );
                    tempContainer.innerHTML += `<div class="genericBigButtonText">${contentItem.content}</div>`;                            
                    rawContent.push( tempContainer.innerHTML );
                }

            });

            genericContentContainer.appendChild( getGenericButtonCell(rawContent[0], rawContent[1], rawContent[2], button.type == "cellRight") );

        }

    });

    genericContentContainer.firstElementChild.classList.add("genericButtonSelected");
    generateScrollThumbHeightByGenericScrollable(configurationModeScreen);

}




// var testeButtonList = [

//     {
//         type: "normal",
//         onclick: () => {console.log("click pass");},
//         content: "ola mundo",
//         icon: 'X'
//     },
//     {
//         type: "cell",
//         onclick: () => {console.log("click pass");},
//         contentList: [
//             {mode: 'checkbox', content: "A1", checked: true},
//             {mode: 'text', content: 'A2'},
//             {mode: 'text', content: 'A3'},
//         ]
//     },
//     {
//         type: "cellRight",
//         onclick: () => {console.log("click pass");},
//         contentList: [
//             {mode: 'text', content: "A1"},
//             {mode: 'text', content: 'A2'},
//             {mode: 'button', content: 'A3'},
//         ]
//     },
//     {
//         type: "nested",
//         onclick: () => {console.log("click pass");},
//         disabled: false,
//         content: "label",
//         contetButton: "valor"
//     },
//     {
//         type: "normal",
//         onclick: () => {console.log("click pass");},
//         content: "ola mundo 2",
//         icon: 'Y'
//     },

// ];



// generateConfigurationScreen(testeButtonList);

    





/*
---- A:Autopilot master: AP (ON/OFF)
---- A:AUTOPILOT YAW DAMPER: YD (ON/OFF)
-- L:APArmR: 1=ALTS, 2=GS

L:APBmode:
2=ROL, 3=LVL, 4=HDG, 5=VOR, 6=LOC, 7=ILS, 8=BC, 9=TRK, 10=GPS, 11=GA, 12=TO
or
L:GMC507_PitchDispVar:
1=PIT, 2=ALT, 3=VS, 4=LVL, 5=GS, 11=GA, 12=TO, 13=IAS
or
L:APArmL:
1=VOR, 2=LOC, 3=BC



*/

function toggleAnnunciatorAutoPilot(isActive = true){
    AIRPLANE.status.autopilot = isActive;
    topContentList.children[1].firstElementChild.style.opacity = Math.trunc(isActive);
}


function toggleAnnunciatorYawDamper(isActive = true){
    AIRPLANE.status.yawDamper = isActive;
    topContentList.children[1].lastElementChild.style.opacity = Math.trunc(isActive);
}


function toggleAnnunciatorHeading(isActive = true){
    AIRPLANE.status.heading = isActive;
    AIRPLANE.status.track = false;

    topContentList.children[0].lastElementChild.style.opacity = Math.trunc(isActive);
    topContentList.children[0].lastElementChild.innerHTML = "HDG";
}


function toggleAnnunciatorTrack(isActive = true){
    AIRPLANE.status.track = isActive;
    AIRPLANE.status.heading = false;

    topContentList.children[0].lastElementChild.style.opacity = Math.trunc(isActive);
    topContentList.children[0].lastElementChild.innerHTML = "TRK";
}


function toggleAnnunciatorIas(isActive = true){
    AIRPLANE.status.ias = isActive;
    AIRPLANE.status.verticalSpeed = false;
    AIRPLANE.status.altitude = false;

    topContentList.children[2].children[0].innerHTML = "IAS";
    topContentList.children[2].children[1].innerHTML = AIRPLANE.selectedSpeed;
    topContentList.children[2].children[2].innerHTML = "ALTS";

}


function toggleAnnunciatorVerticalSpeed(isActive = true){
    AIRPLANE.status.ias = false;
    AIRPLANE.status.verticalSpeed = isActive;
    AIRPLANE.status.altitude = false;

    topContentList.children[2].children[0].innerHTML = "VS";
    topContentList.children[2].children[1].innerHTML = AIRPLANE.selectedVerticalSpeed;
    topContentList.children[2].children[2].innerHTML = "ALTS";

}


function toggleAnnunciatorAltitude(isActive = true){
    AIRPLANE.status.ias = false;
    AIRPLANE.status.verticalSpeed = isActive;
    AIRPLANE.status.altitude = false;

    topContentList.children[2].children[0].innerHTML = "ALT";
    topContentList.children[2].children[1].innerHTML = AIRPLANE.selectedAltitude;
    topContentList.children[2].children[2].innerHTML = "ALTS";
}



function disableMasterAnnunciatorLateral(){
    topContentList.children[0].children[0].innerHTML = "";
    topContentList.children[0].children[1].innerHTML = "";
}


function disableMasterAnnunciatorCentral(){
    topContentList.children[1].children[0].innerHTML = "";
    topContentList.children[1].children[1].innerHTML = "";
}


function disableMasterAnnunciatorVertical(){
    topContentList.children[2].children[0].innerHTML = "";
    topContentList.children[2].children[1].innerHTML = "";
    topContentList.children[2].children[2].innerHTML = "";
}








function keyboardUpdate(){
    Object.keys(KEYCONTROLLER).forEach(keyName => {

        if ( KEYCONTROLLER[keyName].pressed ){
            KEYCONTROLLER[keyName].callback(KEYCONTROLLER[keyName].event);
        }

        if ( KEYCONTROLLER[keyName].defaultRepeat ){
            KEYCONTROLLER[keyName].pressed = false;
        }

    });
    requestAnimationFrame(keyboardUpdate);
}




document.body.onclick = (event) => {
    if ( event.target.id == "main_screen" ){
        document.body.classList.toggle("bodyDark");
    }
};


lcd.onclick = () => {
    frame.classList.toggle("frameHidden");
};





onload = () => {
    
    // ANNUNCIATION
    disableMasterAnnunciatorLateral();
    disableMasterAnnunciatorCentral();
    disableMasterAnnunciatorVertical();


    // Menu
    generateMenuPfd();


    // Screen A -- PFD
    generateVerticalSpeedStrip();
    generateAltitudeStrip();
    generateLadder(10);
    generateSpeedStrip();
    generateHeadingStrip();
    generateVerticalSpeedVariablesStatic();
    generateVerticalSpeedVariablesNormal();

    // Screen B -- HSI
    generateCompassRotative();


    // Configuration Mode
    generateScrollThumbHeightByGenericScrollable(configurationModeContainer);
    


    setSpeed(0);
    setAltitude(0);

    setAutopilotAltitude(0);

    setSelectedSpeed(0);
    setAttitude(AIRPLANE.IMU.pitch, AIRPLANE.IMU.roll, AIRPLANE.IMU.yaw);

    setVerticalSpeed(0);
    toggleVerticalSpeedVisiblity(true);

    setAltitudeAdjust('29.92');
    setSlipIndicatorBall(0);
    
    setHeadingViewMode(false, false);
    
    setGlideThumbType(false, false);
    setLocalizerThumbType(false, false);


    setTurnRateTrend(0);
    setGroundspeed(0);
    setOAT(0, true);
    setCurrentDerisedTrackContainer(0);

    
    AIRPLANE.bearingPointers.forEach((bearing, bearingIndex) => {
        setBearingPointerRotation(bearingIndex, bearing.value);
        setBearingPointerSource(bearingIndex, bearing.source);
    });



    setFlightDirectorVisibility(2);
    
    // setInterfaceScreen(false);
    
    

    // setDockSelectorContents('setup', true);
    // setPopupSelector('bearing1', true);
    // popupConnection.classList.add("popupConnectionOpen");




    // Boot Screen
    setTimeout(turnOn, 500); // 500



    keyboardUpdate();

    blinkAltitudeDesiredFlag200 = false;

};

