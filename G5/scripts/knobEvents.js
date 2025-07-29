

function onWheelContainerPopupSelector( isUp, speed ){
    console.log('popup selector');
    const currentOption = popupSelectorOptionList.querySelector(".popupSelectorOptionSelected");

    if ( isUp ){
        if ( currentOption.nextElementSibling != null ){ 
            currentOption.classList.remove("popupSelectorOptionSelected");
            currentOption.nextElementSibling.classList.add("popupSelectorOptionSelected");
        }
        return;
    }
    
    if ( currentOption.previousElementSibling != null ){ 
        currentOption.classList.remove("popupSelectorOptionSelected");
        currentOption.previousElementSibling.classList.add("popupSelectorOptionSelected");
    }

}





function onWheelContainerPopupValue( isUp, speed ){
    console.log('popup value');

    startTimerCloseScreen();

    // IN DOCK-SELECTOR
    if ( dockSelectorContainer.classList.contains("dockSelectorOpen") ){
        return;
    }


    // IN CONFIGURATION-SCREEN

    if ( configurationModeButton != null ){

        const configurationModeButtonName = configurationModeButton.split("/")[0];
        const configurationModeButtonIndex = parseInt(configurationModeButton.split("/")[1]);

        if ( configurationModeButtonName == "Airspeed" ){
            console.log("gira: "+ configurationModeButtonName + "/" + configurationModeButtonIndex);
            let value = parseInt(configurationModeList['Airspeed'].buttonList[configurationModeButtonIndex].contetButton);

            if ( isNaN(value) ){
                value = 0;
            }

            value += isUp? 1 : -1;
            value = Math.clamp(value, 0, 300);
            AIRPLANE.veriticalSpeedReferences[configurationModeButtonIndex - 1].value = value;
            generateVerticalSpeedVariablesStatic();
            generateVerticalSpeedVariablesNormal();

            if ( value == 0 ){
                value = '____';
            }

            setPopupValueContent(configurationModeList['Airspeed'].buttonList[configurationModeButtonIndex].content, value, true);
            configurationModeScreen.querySelector('.genericContentContainer').children[configurationModeButtonIndex].lastElementChild.innerHTML = value;
            configurationModeList['Airspeed'].buttonList[configurationModeButtonIndex].contetButton = value;
        }





    }


    
    // IN MENU
    const menuItemActive = menuContainer.querySelector(".menuItemActive");
    const menu = menuItemActive.getAttribute("menu");

    if ( menu == "heading" ){

        if ( isUp ){
            AIRPLANE.selectedHeading = (AIRPLANE.selectedHeading + 1) % 360;
        }else if ( --AIRPLANE.selectedHeading < 0 ){
            AIRPLANE.selectedHeading = 359;
        }

        setPopupValueContent("Select Heading", String(AIRPLANE.selectedHeading).padStart(3,0) + '°' );
        setAttitude(AIRPLANE.IMU.pitch, AIRPLANE.IMU.roll, AIRPLANE.IMU.yaw);
        return;
    }
    
    if ( menu == "altitude" ) {
        AIRPLANE.selectedAltitude += isUp? 100 : -100;
        AIRPLANE.selectedAltitude = Math.clamp(AIRPLANE.selectedAltitude, -1400, 30000);
        setPopupValueContent("Select Altitude", String(AIRPLANE.selectedAltitude).padStart(3,0) + '°' );
        setAutopilotAltitude(AIRPLANE.selectedAltitude);
    }

}






function onWheelContainerPopupConfirm( isUp, speed ){
    popupConfirmOptionList.firstElementChild.classList.toggle('popupConfirmOptionSelected', !isUp);
    popupConfirmOptionList.lastElementChild.classList.toggle('popupConfirmOptionSelected', isUp);
}






function onWheelContainerDockSelector( isUp, speed ){
    console.log('dock selector');
    const currentOptionWrapper = dockSelectorWrapperList.querySelector(".dockSelectorSelected");

    if ( isUp ){
        if ( currentOptionWrapper.nextElementSibling != null ){
            currentOptionWrapper.classList.remove("dockSelectorSelected");
            currentOptionWrapper.nextElementSibling.classList.add("dockSelectorSelected");
        }
        return;
    }
    
    if ( currentOptionWrapper.previousElementSibling != null ){ 
        currentOptionWrapper.classList.remove("dockSelectorSelected");
        currentOptionWrapper.previousElementSibling.classList.add("dockSelectorSelected");
    }
}





function onWheelContainerMenu( isUp, speed ){
    const currentMenu = menuContainer.querySelector(".menuItemActive");

    if ( isUp ){
        if ( currentMenu.nextElementSibling != null ){ 
            currentMenu.classList.remove("menuItemActive");
            currentMenu.nextElementSibling.classList.add("menuItemActive");
        }
    }else if ( currentMenu.previousElementSibling != null ){ 
        currentMenu.classList.remove("menuItemActive");
        currentMenu.previousElementSibling.classList.add("menuItemActive");
    }

    const buttonsPerView = 4;
    const index = Array.from(menuList.children).indexOf(menuContainer.querySelector(".menuItemActive"));
    const offset = menuList.children[1].offsetLeft;
    const menuItemRemains = (menuList.children.length - buttonsPerView);
    let position = parseInt( menuList.getAttribute("position") );

    if ( isUp ){
        position = Math.clamp(index - (buttonsPerView - 1), position, menuItemRemains);
    }else if ( index <= position ){
        position = index;
    }
    
    menuList.setAttribute("position", position);
    menuList.style.transform = `translateX(${position * -offset}px)`;
    menuScrollThumb.style.left = map(offset * position, 0, offset * menuItemRemains, 0, menuScrollTrack.offsetWidth - menuScrollThumb.offsetWidth) + 'px';

}





function onWheelContainerPopupConnection( isUp, speed ){
    console.log("connection: scroll");

    const buttonList = popupConnectionList.querySelectorAll(".dockSelectorButton");
    const currentButton = popupConnectionList.querySelector(".dockSelectorHovered");
    const currentIndex = Array.from(buttonList).indexOf(currentButton);
    const newIndex = isUp? (currentIndex + 1) : (currentIndex - 1);

    if ( currentButton.classList.contains("dockSelectorSelected") ){
        const MAX = parseInt( currentButton.getAttribute("max") );

        let currentValue = parseInt(currentButton.innerHTML);
        currentValue += isUp? speed : -speed;
        currentValue = Math.clamp(currentValue, 0, MAX);
        
        currentButton.innerHTML = currentValue;
        return;
    }
    
    if ( buttonList[newIndex] == null ){
        return;
    }
    
    currentButton.classList.remove("dockSelectorHovered");
    buttonList[newIndex].classList.add("dockSelectorHovered");
}





function onWheelContainerConfigurationGeneric( isUp, speed ){
    let genericScrollableElement = null;

    if ( configurationModeScreen.classList.contains("configurationModeScreenOpen") ){
        genericScrollableElement = document.getElementById("configurationModeScreen");
    }else if ( configurationModeContainer.classList.contains("configurationModeContainerOpen") ){
        genericScrollableElement = document.getElementById("configurationModeContainer");
    }
    
    if ( genericScrollableElement == null ){
        return;
    }
    
    const currentButton = genericScrollableElement.querySelector(".genericButtonSelected");
    let newButton = null;

    if ( !isUp ){

        if ( currentButton.previousElementSibling != null ){ 
            currentButton.classList.remove("genericButtonSelected");
            currentButton.previousElementSibling.classList.add("genericButtonSelected");
            newButton = currentButton.previousElementSibling; 
        }
    }else if ( currentButton.nextElementSibling != null ){ 
        currentButton.classList.remove("genericButtonSelected");
        currentButton.nextElementSibling.classList.add("genericButtonSelected"); 
        newButton = currentButton.nextElementSibling; 
    }
    

    if ( newButton == null ){
        return;
    }
    
    const buttonsPerView = (genericScrollableElement.id == "configurationModeContainer") ? 6 : 4;
    const buttonList = genericScrollableElement.querySelectorAll(".genericContentContainer > div")
    const index = Array.from(buttonList).indexOf(newButton);
    const offset = buttonList[1].offsetTop - genericScrollableElement.querySelector(".genericHeader").offsetHeight;
    const remains = (buttonList.length - buttonsPerView);
    let position = parseInt( genericScrollableElement.getAttribute("position") );

    if ( isUp ){
        position = Math.clamp(index - (buttonsPerView - 1), position, remains);
    }else if ( index <= position ){
        position = index;
    }
    
    const scrollTrackHeight = genericScrollableElement.querySelector(".genericScrollTrack").offsetHeight;
    const scrollThumbHeight = genericScrollableElement.querySelector(".genericScrollThumb").offsetHeight;
    
    genericScrollableElement.setAttribute("position", position);
    genericScrollableElement.querySelector(".genericContentContainer").scrollTop = position * offset;
    genericScrollableElement.querySelector(".genericScrollThumb").style.top = map(offset * position, 0, offset * remains, 0, scrollTrackHeight - scrollThumbHeight) + 'px';
    
}






// ****************************************************



ENCODER_BUTTON = {
    pressed: false,
    timer: null,

    onLongPress: (event) => {
        console.log('middle long press');
        const currentContainerOpened = getCurrentContainerOpened();

        if ( currentContainerOpened != null ){
            return;
        }

        if ( interface_A.classList.contains("interface_visible") ){
            toggleConfigutarionMode(true);
            return;
        }
        
        if ( interface_B.classList.contains("interface_visible") ){
            
            let difference = (AIRPLANE.IMU.yaw - AIRPLANE.selectedHeading);
            
            if ( Math.abs(difference) >= 180 ){
                const SIGNAL = Math.sign(difference);
                difference -= 360 * SIGNAL;
            }
            
            rotativeHeadingBug.style.transition = '100ms';
            rotativeHeadingBug.style.transform = `rotate(${difference + AIRPLANE.selectedHeading - AIRPLANE.IMU.yaw}deg)`;
            AIRPLANE.selectedHeading = AIRPLANE.IMU.yaw;

            setTimeout(()=>{
                rotativeHeadingBug.style.transition = '';
                setAttitude(AIRPLANE.IMU.pitch, AIRPLANE.IMU.roll, AIRPLANE.IMU.yaw);
            }, 100);

        }

    },



    onClick: (event) => {
        
        if ( lcdStateScreen.classList.contains("lcdStateDisabled") ){
            return;
        }

        console.log('middle click');
        const currentContainerOpened = getCurrentContainerOpened();

        // MENU -- OPEN/CLOSE
        if ( currentContainerOpened == null ){

            menuContainer.querySelectorAll(".menuItemActive").forEach(el => el.classList.remove("menuItemActive"));
            menuContainer.querySelector(".menuItem").classList.add("menuItemActive");

            if ( interface_A.classList.contains("interface_visible") ){
                generateMenuPfd();
            }else{
                generateMenuHsi();
            }

            menuContainer.classList.add("menuOpen");
            return;

        }
        

        const EVENT_CLICK = CONTAINER_ONCLICK[currentContainerOpened];
        EVENT_CLICK();

    }

};






function onWheelEvent( isUp, speed = 1 ){
    
    const currentContainerOpened = getCurrentContainerOpened();
    

    // WHEEL: INTERFACE-A -- PFD (BARO ADJUST)
    if ( interface_A.classList.contains("interface_visible") && currentContainerOpened == null ){
        console.log('wheel: A');
        AIRPLANE.baro *= 100;
        AIRPLANE.baro += isUp? 1 : -1;
        AIRPLANE.baro = Math.clamp(AIRPLANE.baro, 2800, 3100) / 100;
        AIRPLANE.baro = AIRPLANE.baro.toFixed(2);
        setAltitudeAdjust(AIRPLANE.baro);
        return;
    }

    
    // WHEEL: INTERFACE-B -- HSI (SELECT HEADING)
    if ( interface_B.classList.contains("interface_visible") && currentContainerOpened == null ){
        console.log('wheel: B');

        if ( isUp ){
            AIRPLANE.selectedHeading = (AIRPLANE.selectedHeading + 1) % 360;
        }else if ( --AIRPLANE.selectedHeading < 0 ){
            AIRPLANE.selectedHeading = 359;
        }

        setAttitude(AIRPLANE.IMU.pitch, AIRPLANE.IMU.roll, AIRPLANE.IMU.yaw);
        return;
    }
    

    const EVENT_WHEEL = CONTAINER_ONWHEEL[currentContainerOpened];

    if ( EVENT_WHEEL == null ){
        return;
    }

    EVENT_WHEEL(isUp, speed);

}





var wheelLastTime = 0;
var wheelLastDelta = 0;

onwheel = (event) => {

    if ( lcdStateScreen.classList.contains("lcdStateDisabled") ){
        return;
    }

    const now = Date.now();
    const deltaTime = now - wheelLastTime;
    const delta = event.deltaY;

    if (deltaTime > 0) {
        let speed = Math.abs(delta / deltaTime);
        speed = Math.trunc(speed);
        speed = Math.clamp(speed, 1, 10);

        const isUp = (event.deltaY < 0); 
        onWheelEvent(isUp, speed);
    }

    wheelLastTime = now;
    wheelLastDelta = delta;
};




onmousedown = (event) => {

    if ( lcdStateScreen.classList.contains("lcdStateDisabled") ){
        return;
    }

    if ( event.button == 1 ){
        ENCODER_BUTTON.pressed = true;

        if ( ENCODER_BUTTON.timer == null ){
            ENCODER_BUTTON.timer = setTimeout(()=>{
                ENCODER_BUTTON.onLongPress(event); 
                ENCODER_BUTTON.timer = null;
            }, 500);
        }
    }
};


onmouseup = onblur = (event) => {

    if ( ENCODER_BUTTON.timer != null ){
        ENCODER_BUTTON.onClick(event);
    }
    clearTimeout(ENCODER_BUTTON.timer);
    ENCODER_BUTTON.timer = null;
    ENCODER_BUTTON.pressed = false; 
};


