
var ip                  = 'localhost';
var port                = '3224';
var queryString         = "?buttonClear=false";
var flagButton          = false;
var errorCounter        = 0;
var timerRepaetRequest  = null;


function getCurrentIp(){

    const ipButtons = popupConnectionList.children[1].querySelectorAll(".dockSelectorButton");

    return Array.from(ipButtons)
            .map(e => e.innerHTML)
            .join(".");

}


function getCurrentPort(){
    return popupConnectionList.children[2].querySelector(".dockSelectorButton").innerHTML;
}



function sendRequest() {

    if ( errorCounter >= 5 ){
        errorCounter = 0;
        console.warn("FIM");
        popupConnection.classList.add("popupConnectionOpen");
        return;
    }

    if ( timerRepaetRequest != null ){
        clearTimeout(timerRepaetRequest);
        timerRepaetRequest = null;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', `http://${ip}:${port}${queryString}`, true);
    xhr.mode = 'no-cors';
    
    xhr.onreadystatechange = () => { 

        if ( !(xhr.readyState == 4 && xhr.status == 200) ){
            return;
        }
        
        if ( xhr.responseText != "{}" ){
            const jsonData = JSON.parse(xhr.responseText);
            updateByDataJSON(jsonData);
        }

        sendRequest();
        
    }


    xhr.onerror = () => {
        console.clear();
        errorCounter++; 
        timerRepaetRequest = setTimeout(sendRequest, 100);
    };

    xhr.send(); 
    
}





function updateByDataJSON( jsonData = {} ){
    
    const buttonChanged = jsonData.currentButton != "x";
    queryString = "?buttonClear=" + (buttonChanged);

    if ( buttonChanged ){
        if ( !flagButton ){
            flagButton = true;
            // console.warn(jsonData.currentButton);

            switch (jsonData.currentButton) {
                case "click":
                    ENCODER_BUTTON.onClick();
                    break;
                case "press":
                    ENCODER_BUTTON.onLongPress();
                    break;
                case "cw":
                    onWheelEvent(true);
                    break;
                case "ccw":
                    onWheelEvent(false);
                    break;
            }

        }
    }else{
        flagButton = false;
    }


    // PITCH, ROLL, YAW
    AIRPLANE.IMU.pitch = jsonData.IMU[0];
    AIRPLANE.IMU.roll = -jsonData.IMU[1];
    AIRPLANE.IMU.yaw = jsonData.IMU[2];
    
    // CURRENT
    AIRPLANE.altitude = jsonData.altitude;
    AIRPLANE.speed = jsonData.speed;
    AIRPLANE.verticalSpeed = jsonData.verticalSpeed;
    
    // AUTOPILOT
    AIRPLANE.selectedAltitude = jsonData.autopilotAltitude;
    AIRPLANE.selectedSpeed = jsonData.autopilotSpeed;
    AIRPLANE.selectedHeading = jsonData.autopilotHeading;

    // BEARING
    AIRPLANE.bearingSource.rotation = jsonData.hsiBearingNeedle;
    AIRPLANE.bearingSource.deviationPercent = map(jsonData.hsiCdiNeedle, -127, 127, -100, 100);
    
    // FLIGHT DIRECTOR
    AIRPLANE.flightDirectorHorizontal = radToDeg(jsonData.flightDirectorPitch);
    AIRPLANE.flightDirectorVertical   = radToDeg(jsonData.flightDirectorRoll);

    // TOP GREEN CONTENT
    messageText.innerHTML = jsonData.flightDirectorState +  " - "+  AIRPLANE.flightDirectorHorizontal + " | " + AIRPLANE.flightDirectorVertical;

    // Set Default
    setSpeed(jsonData.speed); 
    setAltitude(jsonData.altitude);
    
    setAutopilotAltitude(AIRPLANE.selectedAltitude);
    setSelectedSpeed(AIRPLANE.selectedSpeed);

    setAttitude(AIRPLANE.IMU.pitch, AIRPLANE.IMU.roll, AIRPLANE.IMU.yaw);

    setVerticalSpeed( AIRPLANE.verticalSpeed );




    
    setAltitudeAdjust(jsonData.baroAdjust);
    setSlipIndicatorBall(0);
    
    setHeadingViewMode(false, false);
    
    setGlideThumbType(false, false);
    setLocalizerThumbType(false, false);

    setTurnRateTrend(50);
}

