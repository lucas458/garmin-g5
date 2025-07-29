

function onClickContainerMessage(){
    toggleMessage(false);
}


function onClickContainerPopupValue(){
    popupValueContainer.classList.remove("popupValueOpen");
    clearTimerCloseScreen();
}




function onClickContainerPopupSelector(){
    const OPTION = popupSelectorOptionList.querySelector('.popupSelectorOptionSelected');
    const INDEX  = Array.from(popupSelectorOptionList.children).indexOf(OPTION);
    const GROUP_NAME = getPopupSelectorGroup();

    if ( OPTION != null ){
        console.log("POPUP SELECTOR: (", GROUP_NAME, ")", INDEX, "VALUE:", OPTION.innerHTML);
        POPUP_SELECTOR_OPTIONS[GROUP_NAME].options[INDEX].onClick();

        if ( GROUP_NAME == "bearing1" ){
            setBearingPointerSource(0, OPTION.innerHTML);
        }else if ( GROUP_NAME == "bearing2" ){
            setBearingPointerSource(1, OPTION.innerHTML);
        }

    }

    togglePopupSelector(false);
}





function onClickContainerPopupConfirm(){
    const CONFIRM = popupConfirmOptionList.lastElementChild.classList.contains('popupConfirmOptionSelected');
    togglePopupConfirm(false);

    if ( !CONFIRM ){
        return;
    }

    if ( configurationModeButton == "Airspeed/13" ){
        console.log("RESET AIRSPEED REFERENCES");

        AIRPLANE.veriticalSpeedReferences.forEach((e, i) =>{
            e.value = DEFAULT_AIRSPEED_REFERENCES[i];
            configurationModeList['Airspeed'].buttonList[i+1].contetButton = (DEFAULT_AIRSPEED_REFERENCES[i] > 0) ? DEFAULT_AIRSPEED_REFERENCES[i] : "____";
            onClickContainerConfigurationMain();
        });
        
        generateVerticalSpeedVariablesStatic();
        generateVerticalSpeedVariablesNormal();
    }

    configurationModeButton = null;

}




function onClickContainerDockSelector(){
    const SELECTED = dockSelectorWrapperList.querySelector(".dockSelectorSelected");
    const INDEX  = Array.from(dockSelectorWrapperList.children).indexOf(SELECTED);
    
    if ( SELECTED == null ){
        return;
    }
    
    const GROUP_NAME = SELECTED.parentElement.getAttribute("group");
    const OPTION = DOCK_SELECTOR_OPTIONS[ GROUP_NAME ];
    
    if ( OPTION.hasBackButton ){

        if ( INDEX == 0 ){
            toggleDockSelectorScreen(false);
            return;
        }
        
        OPTION.options[INDEX - 1].onClick();
        return;
    }
    
    OPTION.options[INDEX].onClick();
}





function onClickContainerConfigurationScreen(){
    const currentMainName = configurationModeContainer.querySelector(".genericButtonSelected").innerHTML;
    const currentIndex = Array.from(configurationModeScreen.querySelectorAll('.genericBigButton')).indexOf(configurationModeScreen.querySelector(".genericButtonSelected"));
    console.log( currentMainName + '/' + currentIndex );
    configurationModeButton = currentMainName + '/' + currentIndex;

    if ( currentIndex > 0 && currentMainName == "Airspeed" && currentIndex < configurationModeList['Airspeed'].buttonList.length - 1 ){
        
        let value = parseInt(configurationModeList['Airspeed'].buttonList[currentIndex].contetButton);
        setPopupValueContent(configurationModeList['Airspeed'].buttonList[currentIndex].content, isNaN(value)? '____' : value, true );
        openPopupValue();
        return;
    }

    configurationModeList[currentMainName].buttonList[currentIndex].onclick();
}





function onClickContainerConfigurationMain(){
    const currentMainName = configurationModeContainer.querySelector(".genericButtonSelected").innerHTML;

    if ( currentMainName == "Exit Configuration Mode" ){
        toggleConfigutarionMode(false);
        return;
    }

    generateConfigurationScreen(configurationModeList[currentMainName].buttonList, configurationModeList[currentMainName].label);
    console.log('main:', currentMainName + ' as ' + configurationModeList[currentMainName].label );
    configurationModeScreen.classList.add("configurationModeScreenOpen");
}





function onClickContainerPopupConnection(){
    const buttonList = popupConnectionList.querySelectorAll(".dockSelectorButton");
    const currentButton = popupConnectionList.querySelector(".dockSelectorHovered");

    // Back
    if ( buttonList[0] == currentButton ){
        popupConnection.classList.remove("popupConnectionOpen");
        return;
    }

    // Connect
    if ( buttonList[6] == currentButton ){
        console.log("connect click");
        popupConnection.classList.remove("popupConnectionOpen");
        port = getCurrentPort();
        const newIp = getCurrentIp();
        ip = (newIp == "0.0.0.0")? "localhost" : newIp;
        sendRequest();
        return;
    }

    currentButton.classList.toggle("dockSelectorSelected");
}





function onClickContainerMenu(){
    const menuItemActive = menuContainer.querySelector(".menuItemActive");
    const menu           = menuItemActive.getAttribute("menu");
    
    if ( menu == 'back' || MENU_ACTIONS[menu](menuItemActive) ){
        menuContainer.classList.remove("menuOpen");

        setTimeout(()=>{
            menuList.style.transform = "translateX(0px)";
            menuScrollThumb.style.left = '0px';
        }, 100);

    }

}

