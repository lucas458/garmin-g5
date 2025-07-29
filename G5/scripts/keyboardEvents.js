

onkeyup = onblur = (event) => {
    if ( KEYCONTROLLER[event.key] ){
        KEYCONTROLLER[event.key].pressed = false;
    } 

    if ( event.type == 'blur' ){
        ENCODER_BUTTON.pressed = false;
    }
};


onkeydown = (event) => {

    if ( KEYCONTROLLER[event.key] ){
        KEYCONTROLLER[event.key].pressed = true;
        return;
    }
    
};



var KEYCONTROLLER = {
    // PITCH
    "ArrowUp": {
        pressed: false,
        callback: () => {
            AIRPLANE.IMU.pitch = Math.clamp(AIRPLANE.IMU.pitch - Math.cos(AIRPLANE.IMU.roll*Math.PI/180) ,-90,90);
            setAttitude(AIRPLANE.IMU.pitch,AIRPLANE.IMU.roll,AIRPLANE.IMU.yaw);
        }
    },
    "ArrowDown": {
        pressed: false,
        callback: () => {
            AIRPLANE.IMU.pitch = Math.clamp(AIRPLANE.IMU.pitch+ Math.cos(AIRPLANE.IMU.roll*Math.PI/180) ,-90,90);
            setAttitude(AIRPLANE.IMU.pitch,AIRPLANE.IMU.roll,AIRPLANE.IMU.yaw);
        }
    },

    // ROLL
    "ArrowLeft": {
        pressed: false,
        callback: () => {
            AIRPLANE.IMU.roll--;
            if ( AIRPLANE.IMU.roll < -180 ){
                AIRPLANE.IMU.roll = 180;
            }
            setAttitude(AIRPLANE.IMU.pitch,AIRPLANE.IMU.roll,AIRPLANE.IMU.yaw);
        }
    },
    "ArrowRight": {
        pressed: false,
        callback: () => {
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
        callback: () => {
            AIRPLANE.IMU.yaw--;
            if ( AIRPLANE.IMU.yaw < 0 ){
                AIRPLANE.IMU.yaw = 359;
            }
            setAttitude(AIRPLANE.IMU.pitch,AIRPLANE.IMU.roll,AIRPLANE.IMU.yaw);
        }
    },
    "e": {
        pressed: false,
        callback: () => {
            AIRPLANE.IMU.yaw = (AIRPLANE.IMU.yaw + 1) % 360;
            setAttitude(AIRPLANE.IMU.pitch,AIRPLANE.IMU.roll,AIRPLANE.IMU.yaw);
        }
    },


    // SPEED
    "1": {
        pressed: false,
        callback: () => {
            AIRPLANE.speed = Math.clamp(AIRPLANE.speed-0.1, 0, 300);
            setSpeed(AIRPLANE.speed);
        }
    },
    "2": {
        pressed: false,
        callback: () => {
            AIRPLANE.speed = Math.clamp(AIRPLANE.speed+0.1, 0, 300);
            setSpeed(AIRPLANE.speed);
        }
    },
    

    // ALTITUDE
    "3": {
        pressed: false,
        callback: () => {
            AIRPLANE.altitude = Math.clamp(AIRPLANE.altitude-1, -1400, 30000);
            setAltitude(AIRPLANE.altitude);
        }
    },
    "4": {
        pressed: false,
        callback: () => {
            AIRPLANE.altitude = Math.clamp(AIRPLANE.altitude+1, -1400, 30000);
            setAltitude(AIRPLANE.altitude);
        }
    },


};




