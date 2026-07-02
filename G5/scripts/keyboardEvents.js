

onkeyup = onblur = (event) => {
    event.preventDefault();
    const KEY_NAME = (event.key != undefined && event.key.length == 1)? event.key.toLowerCase() : event.key;

    if ( KEYCONTROLLER[KEY_NAME] ){
        KEYCONTROLLER[KEY_NAME].pressed = false;
        KEYCONTROLLER[KEY_NAME].event = event;
    } 

    if ( event.type == 'blur' ){
        ENCODER_BUTTON.pressed = false;
    }
};


onkeydown = (event) => {
    event.preventDefault();
    const KEY_NAME = (event.key != undefined && event.key.length == 1)? event.key.toLowerCase() : event.key;

    if ( KEYCONTROLLER[KEY_NAME] ){
        KEYCONTROLLER[KEY_NAME].pressed = true;
        KEYCONTROLLER[KEY_NAME].event = event;
        return;
    }
    
};



var KEYCONTROLLER = {
    // PITCH
    "ArrowUp": {
        pressed: false,
        event: null,
        callback: (event) => {

            if ( event.shiftKey ){
                AIRPLANE.flightDirectorHorizontal = Math.clamp(AIRPLANE.flightDirectorHorizontal-1, -46, 46);
                setFlightDirectorPositions(AIRPLANE.flightDirectorHorizontal, AIRPLANE.flightDirectorVertical);
                return;
            }

            if ( event.ctrlKey ){
                AIRPLANE.glideslope.value = Math.clamp(AIRPLANE.glideslope.value-1, -100, 100);
                setGlidePosition(AIRPLANE.glideslope.value);
                return;
            }

            AIRPLANE.IMU.pitch = Math.clamp(AIRPLANE.IMU.pitch - Math.cos(AIRPLANE.IMU.roll*Math.PI/180) ,-90,90);
            setAttitude(AIRPLANE.IMU.pitch,AIRPLANE.IMU.roll,AIRPLANE.IMU.yaw);
        }
    },
    "ArrowDown": {
        pressed: false,
        event: null,
        callback: (event) => {

            if ( event.shiftKey ){
                AIRPLANE.flightDirectorHorizontal = Math.clamp(AIRPLANE.flightDirectorHorizontal+1, -46, 46);
                setFlightDirectorPositions(AIRPLANE.flightDirectorHorizontal, AIRPLANE.flightDirectorVertical);
                return;
            }

            if ( event.ctrlKey ){
                AIRPLANE.glideslope.value = Math.clamp(AIRPLANE.glideslope.value+1, -100, 100);
                setGlidePosition(AIRPLANE.glideslope.value);
                return;
            }

            AIRPLANE.IMU.pitch = Math.clamp(AIRPLANE.IMU.pitch+ Math.cos(AIRPLANE.IMU.roll*Math.PI/180) ,-90,90);
            setAttitude(AIRPLANE.IMU.pitch,AIRPLANE.IMU.roll,AIRPLANE.IMU.yaw);
        }
    },

    // ROLL
    "ArrowLeft": {
        pressed: false,
        event: null,
        callback: (event) => {

            if ( event.shiftKey ){
                AIRPLANE.flightDirectorVertical = Math.clamp(AIRPLANE.flightDirectorVertical-1, -46, 46);
                setFlightDirectorPositions(AIRPLANE.flightDirectorHorizontal, AIRPLANE.flightDirectorVertical);
                return;
            }

            if ( event.ctrlKey ){
                AIRPLANE.localizer.value = Math.clamp(AIRPLANE.localizer.value-1, -100, 100);
                setLocalizerPosition(AIRPLANE.localizer.value);
                return;
            }

            AIRPLANE.IMU.roll--;
            if ( AIRPLANE.IMU.roll < -180 ){
                AIRPLANE.IMU.roll = 180;
            }
            setAttitude(AIRPLANE.IMU.pitch,AIRPLANE.IMU.roll,AIRPLANE.IMU.yaw);
        }
    },
    "ArrowRight": {
        pressed: false,
        event: null,
        callback: (event) => {

            if ( event.shiftKey ){
                AIRPLANE.flightDirectorVertical = Math.clamp(AIRPLANE.flightDirectorVertical+1, -46, 46);
                setFlightDirectorPositions(AIRPLANE.flightDirectorHorizontal, AIRPLANE.flightDirectorVertical);
                return;
            }

            if ( event.ctrlKey ){
                AIRPLANE.localizer.value = Math.clamp(AIRPLANE.localizer.value+1, -100, 100);
                setLocalizerPosition(AIRPLANE.localizer.value);
                return;
            }

            AIRPLANE.IMU.roll++;
            if ( AIRPLANE.IMU.roll > 180 ){
                AIRPLANE.IMU.roll = -180;
            }
            setAttitude(AIRPLANE.IMU.pitch,AIRPLANE.IMU.roll,AIRPLANE.IMU.yaw);
        }
    },
    
    // YAW
    "q": {
        pressed: false,
        event: null,
        callback: (event) => {

            if ( event.shiftKey ){
                AIRPLANE.slip = Math.clamp(AIRPLANE.slip-1, -100, 100);
                setSlipIndicatorBall(AIRPLANE.slip);
                return;
            }

            if ( event.ctrlKey ){
                AIRPLANE.turnRate = Math.clamp(AIRPLANE.turnRate-1, -100, 100);
                setTurnRateTrend(AIRPLANE.turnRate);
                return;
            }

            AIRPLANE.IMU.yaw--;
            if ( AIRPLANE.IMU.yaw < 0 ){
                AIRPLANE.IMU.yaw = 359;
            }
            setAttitude(AIRPLANE.IMU.pitch,AIRPLANE.IMU.roll,AIRPLANE.IMU.yaw);
        }
    },
    "e": {
        pressed: false,
        event: null,
        callback: (event) => {

            if ( event.shiftKey ){
                AIRPLANE.slip = Math.clamp(AIRPLANE.slip+1, -100, 100);
                setSlipIndicatorBall(AIRPLANE.slip);
                return;
            }

            if ( event.ctrlKey ){
                AIRPLANE.turnRate = Math.clamp(AIRPLANE.turnRate+1, -100, 100);
                setTurnRateTrend(AIRPLANE.turnRate);
                return;
            }

            AIRPLANE.IMU.yaw = (AIRPLANE.IMU.yaw + 1) % 360;
            setAttitude(AIRPLANE.IMU.pitch,AIRPLANE.IMU.roll,AIRPLANE.IMU.yaw);
        }
    },


    // SPEED
    "1": {
        pressed: false,
        event: null,
        callback: (event) => {
            AIRPLANE.speed = Math.clamp(AIRPLANE.speed-0.1, 0, 300);
            setSpeed(AIRPLANE.speed);
        }
    },
    "2": {
        pressed: false,
        event: null,
        callback: (event) => {
            AIRPLANE.speed = Math.clamp(AIRPLANE.speed+0.1, 0, 300);
            setSpeed(AIRPLANE.speed);
        }
    },
    

    // ALTITUDE
    "3": {
        pressed: false,
        event: null,
        callback: (event) => {
            AIRPLANE.altitude = Math.clamp(AIRPLANE.altitude-1, -1400, 30000);
            setAltitude(AIRPLANE.altitude);
        }
    },
    "4": {
        pressed: false,
        event: null,
        callback: (event) => {
            AIRPLANE.altitude = Math.clamp(AIRPLANE.altitude+1, -1400, 30000);
            setAltitude(AIRPLANE.altitude);
        }
    },


};




