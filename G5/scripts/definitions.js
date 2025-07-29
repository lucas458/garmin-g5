
var AIRPLANE = {

    IMU: {
        pitch: 0,
        roll: 0,
        yaw: 0
    },
    
    speed: 0,
    altitude: 0,
    verticalSpeed: 0,
    baro: '29.92',
    ladderStep: 10,

    headingViewMode: {
        isTrack: false,
        isMagenta: false
    },


    wind: {
        speed: 11,
        direction: 45//90
    },

    selectedCourse: 30,
    selectedGroundTrack: 150,
    selectedHeading: 0,

    selectedSpeed: 0,
    selectedAltitude: 0,
    selectedVerticalSpeed: 0,

    veriticalSpeedReferences: [
        {name: 'NE', value: 184},
        {name: 'NO', value: 146},
        {name: 'SO', value: 55},
        {name: 'S1', value: 62},
        {name: 'FE', value: 109},
        {name: 'A', value: 129},
        {name: 'X', value: 83},
        {name: 'Y', value: 91},
        {name: 'G', value: 87},
        {name: 'R', value: 52},
        {name: 'MC', value: 0},
        {name: 'YSE', value: 0},
    ],


    status: {
        // Lateral
        heading: false,
        track: false,

        // Central (cotrol)
        autopilot: false,
        flightDirector: false,
        yawDamper: false,
        level: false,


        // Vertical
        ias: false,
        verticalSpeed: false,
        altitude: false,

    },
    

    glideslope: {visible: false, value: 0},
    localizer: {visible: false, value: 0},

    flightDirectorHorizontal: 0,
    flightDirectorVertical: 0,
    
    bearingPointers: [
        {value: 30, source: 'GPS1'},
        {value: 60, source: 'GPS2'}
    ],

    bearingSource: {
        rotation: 120,
        deviationPercent: 50,
        isMagenta: true
    }

};





const DEFAULT_AIRSPEED_REFERENCES = [
    184,  // NE
    146,  // NO
    55,   // SO
    62,   // S1
    109,  // FE
    129,  // A
    83,   // X
    91,   // Y
    87,   // G
    52,   // R
    0,    // MC
    0     // YSE
]






const CONTAINER_ONCLICK = {
    'message': onClickContainerMessage,
    'popupSelector': onClickContainerPopupSelector,
    'popupValue': onClickContainerPopupValue,
    'popupConfirm': onClickContainerPopupConfirm,
    'dockSelector': onClickContainerDockSelector,
    'configurationScreen': onClickContainerConfigurationScreen,
    'configurationContainer': onClickContainerConfigurationMain,
    'popupConnection': onClickContainerPopupConnection,
    'menu': onClickContainerMenu

};



const CONTAINER_ONWHEEL = {
    'popupSelector': onWheelContainerPopupSelector,
    'popupValue': onWheelContainerPopupValue,
    'popupConfirm': onWheelContainerPopupConfirm,
    'currentContainerOpened': onWheelContainerPopupConfirm,
    'dockSelector': onWheelContainerDockSelector,
    'configurationScreen': onWheelContainerConfigurationGeneric,
    'configurationContainer': onWheelContainerConfigurationGeneric,
    'popupConnection': onWheelContainerPopupConnection,
    'menu': onWheelContainerMenu
};



const AUTOPILOT_ANNUNCIATIONS_COLOR = {
    'red': 'autopilotAnnunciationRed',
    'yellow': 'autopilotAnnunciationYellow',
    'white': 'autopilotAnnunciationWhite',
    'black': 'autopilotAnnunciationBlack',
    'blackError': 'autopilotAnnunciationBlackError'
};



const SYSTEM_MESSAGES = [
    "External Power Lost",                          // Aircraft power has been removed from the G5
    "Critical battery fault! Powering off",         // Battery has critical fault condition and the unit is about to power off to avoid damage to the battery
    "Battery fault",                                // Battery has a fault condition – unit needs service
    "Battery charger fault",                        // Battery charger has a fault condition – unit needs service
    "Low battery",                                  // Battery charge level is low
    "Hardware fault",                               // Unit has a hardware fault – unit needs service
    "Power supply fault",                           // Unit power supply fault detected – unit needs service
    "Unit temperature limit exceeded",              // Unit is too hot or too cold
    "Network address conflict",                     // Another G5 with the same address is detected on the network (most commonly a wiring error on one of the units
    "Communication error",                          // General communication error (most commonly appears in conjunction with Network Address Conflict message)
    "Factory calibration data invalid",             // Unit calibration data not valid – unit needs service
    "Magnetic field model database out of date",    // Internal magnetic field database is out of date - software update required
    "Magnetometer Hardware fault",                  // The magnetometer has detected a fault – unit needs service. Heading data may not be available
    "Using external GPS data",                      // GPS data from another network LRU is being used. The unit's internal GPS receiver is enabled, but unable to establish a GPS fix
    "Not receiving RS-232 data",                    // The G5 is not receiving RS-232 data from the GPS navigator – system needs service
    "Not receiving ARINC 429 data",                 // The G5 is not receiving ARINC 429 data from the navigation source – system needs service
    "GPS receiver fault",                           // The G5 on-board GPS receiver has a fault
    "ARINC 429 interface configuration error",      // The G5 ARINC 429 port is receiving information from an incorrect source – system needs service
    "Software version mismatch",                    // The G5 attitude indicator and the G5 HSI units have different software. Cross fill of baro, heading and altitude bugs is disabled

    "AFCS preflight test failed",                   // (google) 'usually indicates a problem with the Automatic Flight Control System (AFCS) during the preflight test'
];



const AUTOPILOT_ANNUNCIATIONS = [

    {
        text: 'AFCS',
        colorType: 'red'
    },
    {
        text: 'AP',
        colorType: 'yellow'
    },
    {
        text: 'AP',
        colorType: 'black'
    },
    {
        text: 'AP',
        colorType: 'blackError'
    },
    {
        text: 'PFT',
        colorType: 'white'
    },
    {
        text: 'TRIM DOWN',
        colorType: 'yellow'
    },
    {
        text: 'TRIM UP',
        colorType: 'yellow'
    }

];





const MENU_ACTIONS = {

    'message': () => {
        setMessage("AGCS Preflight test failed", true);
        return true;
    },

    'heading': () => {
        setPopupValueContent("Select Heading", String(AIRPLANE.selectedHeading).padStart(3,0) + '°' );
        startTimerCloseScreen();
        popupValueContainer.classList.add("popupValueOpen");
        return true;
    },

    'altitude': () => {
        setPopupValueContent("Select Altitude", String(AIRPLANE.selectedAltitude).padStart(3,0) + '°' );
        popupValueContainer.classList.add("popupValueOpen");
        return true;
    },

    'pitch': () => {
        return true;
    },

    'setup': () => {
        setDockSelectorContents('setup', true);
        return true;
    },

    'hsi': () => {
        setInterfaceScreen(false);
        return true;
    },

    'pfd': () => {
        setInterfaceScreen(true);
        return true;
    },

    'bearing_pointer': (menuItem) => {
        toggleMenuItem(menuItem);
        return false;
    },

    'connection': () => {
        popupConnection.classList.add("popupConnectionOpen");
        return true;
    }

};





var DOCK_SELECTOR_OPTIONS = {

    'setup': {
        title: 'Setup',
        hasBackButton: true,
        options: [
            
            {
                normal: false,
                label: 'Bearing Pointer 1',
                button: 'GPS1',
                onClick: () => {
                    console.log('pass 1');
                    toggleDockSelectorScreen(false);
                    setPopupSelector('bearing1', true);
                }
            },
            {
                normal: false,
                label: 'Bearing Pointer 2',
                button: 'VLOC2',
                onClick: () => {
                    console.log('pass 2');
                    toggleDockSelectorScreen(false);
                    setPopupSelector('bearing2', true);
                }
            }

        ]
    }


};




const POPUP_SELECTOR_OPTIONS = {

    'bearing1': {
        title: 'Bearing Pointer 1',
        options: [
            {
                label: 'None',
                onClick: () => { console.log('pass X1'); } 
            },
            {
                label: 'GPS1',
                onClick: () => { console.log('pass X2'); } 
            },
            {
                label: 'VLOC1',
                onClick: () => { console.log('pass X2'); } 
            },
        ]
    },
    
    'bearing2': {
        title: 'Bearing Pointer 2',
        options: [
            {
                label: 'None',
                onClick: () => { console.log('pass Y1'); } 
            },
            {
                label: 'GPS2',
                onClick: () => { console.log('pass Y2'); } 
            },
            {
                label: 'VLOC2',
                onClick: () => { console.log('pass Y2'); } 
            },
        ]
    },
    

};








var configurationModeButton = null;


var configurationModeList = {


    "Device Information": {
        label: "Device Information",

        buttonList: [
            {
                type: "normal",
                onclick: () => {toggleConfigutarionScreen(false);},
                content: "Back",
                icon: 'X'
            },
            {
                type: "cell",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'checkbox', content: "SFD1", checked: true},
                    {mode: 'text', content: 'G5'},
                    {mode: 'text', content: '5.00'},
                ]
            },
            {
                type: "cell",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'checkbox', content: "SFD2", checked: true},
                    {mode: 'text', content: 'G5'},
                    {mode: 'text', content: '5.00'},
                ]
            },
            {
                type: "cell",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'checkbox', content: "MAG", checked: true},
                    {mode: 'text', content: 'GMU 11'},
                    {mode: 'text', content: '2.00'},
                ]
            },
            {
                type: "cell",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'checkbox', content: "A429", checked: true},
                    {mode: 'text', content: 'GAD 298'},
                    {mode: 'text', content: '3.00'},
                ]
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Installation Type",
                contetButton: "Standalone<br>Instrument"
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Diagnostics...",
                icon: null
            }
        ]
    },


    "Atttiude": {
        label: "Atttiude Configuration",

        buttonList: [
            {
                type: "normal",
                onclick: () => {toggleConfigutarionScreen(false);},
                content: "Back",
                icon: 'X'
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Indicator Type",
                contetButton: "Normal"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Pitch Display",
                contetButton: "Normal"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Roll Display",
                contetButton: "Ground Pointer"
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Vibration Test...",
                icon: null
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Calibrate Yaw Offset...",
                icon: null
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Calibrate Pitch/Roll...",
                icon: null
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Pitch Calibration",
                contetButton: "+0.0°"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Roll Calibration",
                contetButton: "+0.0°"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "User Pitch Offset",
                contetButton: "Disabled"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Automatic<br>Declutter",
                contetButton: "Enabled"
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Restore Defaults...",
                icon: null
            }
        ]

    },


    "Air Data": {
        label: "Air Data Configuration",

        buttonList: [
            {
                type: "normal",
                onclick: () => {toggleConfigutarionScreen(false);},
                content: "Back",
                icon: 'X'
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Air Data Sensors",
                contetButton: "Enabled"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Vertical Speed<br>Indicator",
                contetButton: "+/-2000 fpm"
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Calibrate Static Pressure...",
                icon: null
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Restore Default...",
                icon: null
            }
        ]

    },


    "Airspeed": {
        label: "Airspeed Configuration",

        buttonList: [
            {
                type: "normal",
                onclick: () => {toggleConfigutarionScreen(false);},
                content: "Back",
                icon: 'X'
            },
            {
                type: "nested",
                // onclick: () => {console.log("click pass");},
                disabled: false,
                content: "VNE",
                contetButton: "184"
            },
            {
                type: "nested",
                // onclick: () => {console.log("click pass");},
                disabled: false,
                content: "VNO",
                contetButton: "146"
            },
            {
                type: "nested",
                // onclick: () => {console.log("click pass");},
                disabled: false,
                content: "VSO",
                contetButton: "55"
            },
            {
                type: "nested",
                // onclick: () => {console.log("click pass");},
                disabled: false,
                content: "VS1",
                contetButton: "62"
            },
            {
                type: "nested",
                // onclick: () => {console.log("click pass");},
                disabled: false,
                content: "VFE",
                contetButton: "109"
            },
            {
                type: "nested",
                // onclick: () => {console.log("click pass");},
                disabled: false,
                content: "VA",
                contetButton: "129"
            },
            {
                type: "nested",
                // onclick: () => {console.log("click pass");},
                disabled: false,
                content: "VX",
                contetButton: "83"
            },
            {
                type: "nested",
                // onclick: () => {console.log("click pass");},
                disabled: false,
                content: "VY",
                contetButton: "91"
            },
            {
                type: "nested",
                // onclick: () => {console.log("click pass");},
                disabled: false,
                content: "VG",
                contetButton: "87"
            },
            {
                type: "nested",
                // onclick: () => {console.log("click pass");},
                disabled: false,
                content: "VR",
                contetButton: "52"
            },
            {
                type: "nested",
                // onclick: () => {console.log("click pass");},
                disabled: false,
                content: "VMC",
                contetButton: "____"
            },
            {
                type: "nested",
                // onclick: () => {console.log("click pass");},
                disabled: false,
                content: "VYSE",
                contetButton: "____"
            },
            {
                type: "normal",
                onclick: () => {
                    console.log("click pass");
                    togglePopupConfirm(true);

                },
                content: "Restore Default...",
                icon: null
            }
        ]

    },


    "Magnetometer": {
        label: "Magnetometer Configuration",

        buttonList: [
            {
                type: "normal",
                onclick: () => {toggleConfigutarionScreen(false);},
                content: "Back",
                icon: 'X'
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Magnetometer",
                contetButton: "Enabled"
            },
            {
                type: "cellRight",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'text', content: "Status"},
                    {mode: 'checkbox', checked: true, content: ''},
                    {mode: 'text', content: 'Data Valid'},
                ]
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Otientation",
                contetButton: "Conenctor Aft"
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Interference Test...",
                icon: null
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Calibrate Magnetometer...",
                icon: null
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Restore Default...",
                icon: null
            }
        ]

    },


    "Flight Controls": {
        label: "Automatic Flight Controls Configuration",

        buttonList: [
            {
                type: "normal",
                onclick: () => {toggleConfigutarionScreen(false);},
                content: "Back",
                icon: 'X'
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Century Autopilot<br>Interface",
                contetButton: "Century 1C388"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "GPS Steering",
                contetButton: "Enabled"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "GPS Scale Factor",
                contetButton: "1.00"
            }
        ]

    },


    "Backlight": {
        label: "Backlight Configuration",

        buttonList: [
            {
                type: "normal",
                onclick: () => {toggleConfigutarionScreen(false);},
                content: "Back",
                icon: 'X'
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Current Mode",
                contetButton: "Automatic"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Default Mode",
                contetButton: "Automatic"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Minimum Photocell<br>Input",
                contetButton: "10%"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Minimum Display<br>Brightness",
                contetButton: "40%"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Maximum Photocell<br>Input",
                contetButton: "70%"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Filter Time Constant",
                contetButton: "6" // unidade: sec
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Restore Default...",
                icon: null
            }
        ]

    },


    "Display": {
        label: "Display Configuration",

        buttonList: [
            {
                type: "normal",
                onclick: () => {toggleConfigutarionScreen(false);},
                content: "Back",
                icon: 'X'
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "HSI Page",
                contetButton: "Disabled"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: true,
                content: "Powerup Page",
                contetButton: "PFD"
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Restore Default...",
                icon: null
            }
        ]

    },


    "Battery": {
        label: "Battery Status",

        buttonList: [
            {
                type: "normal",
                onclick: () => {toggleConfigutarionScreen(false);},
                content: "Back",
                icon: 'X'
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Show Battery<br>Status",
                contetButton: "When Using Battery"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Automatic<br>Power Off",
                contetButton: "On Ground Only"
            },
            {
                type: "cellRight",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'text', content: "Battery Status"},
                    {mode: 'checkbox', checked: true, content: ''},
                    {mode: 'text', content: 'Charged'},
                ]
            },
            {
                type: "cellRight",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'text', content: "Charge Level"},
                    {mode: 'text', content: '100%'},
                    {mode: 'text', content: ''},
                ]
            },
            {
                type: "cellRight",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'text', content: "Temperature"},
                    {mode: 'text', content: '87'}, // unidade: °f
                    {mode: 'text', content: ''},
                ]
            },
            {
                type: "cellRight",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'text', content: "Votlage"},
                    {mode: 'text', content: '3.97'}, // unidade: v
                    {mode: 'text', content: ''},
                ]
            },
            {
                type: "cellRight",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'text', content: "Lifetime Remaining"},
                    {mode: 'text', content: '100%'},
                    {mode: 'text', content: ''},
                ]
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Restore Default...",
                icon: null
            }
        ]

    },


    "GPS": {
        label: "GPS Configuration",

        buttonList: [
            {
                type: "normal",
                onclick: () => {toggleConfigutarionScreen(false);},
                content: "Back",
                icon: 'X'
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Internal GPS Receiver",
                contetButton: "Disabled"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "GPS Data Fields",
                contetButton: "Show"
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Restore Default...",
                icon: null
            }
        ]

    },


    "Navigation": {
        label: "Navigation Configuration",

        buttonList: [
            {
                type: "normal",
                onclick: () => {toggleConfigutarionScreen(false);},
                content: "Back",
                icon: 'X'
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: true,
                content: "Navigation Data",
                contetButton: "Enabled"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Selected Course",
                contetButton: "Enabled"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "VNAV Deviation<br>Scale",
                contetButton: "+/-1000 feet"
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Restore Default...",
                icon: null
            }
        ]

    },


    "Units": {
        label: "Units Configuration",

        buttonList: [
            {
                type: "normal",
                onclick: () => {toggleConfigutarionScreen(false);},
                content: "Back",
                icon: 'X'
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Altitude",
                contetButton: "Feet (ft)"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Distance",
                contetButton: "Nautical (nm)"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Airspeed",
                contetButton: "Nautical (kt)"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Ground Speed",
                contetButton: "Nautical (kt)"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Ground Track",
                contetButton: "Magnetic"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "vertical Speed",
                contetButton: "Feet/Minute"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Pressure",
                contetButton: "Inches (Hg)"
            },
            {
                type: "nested",
                onclick: () => {console.log("click pass");},
                disabled: false,
                content: "Data Field<br>Units Display",
                contetButton: "Normal"
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Restore Default...",
                icon: null
            }
        ]

    },


    "RS-232": {
        label: "RS-232 Configuration",

        buttonList: [
            {
                type: "normal",
                onclick: () => {toggleConfigutarionScreen(false);},
                content: "Back",
                icon: 'X'
            },
            {
                type: "cellRight",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'text', content: "Input Format"},
                    {mode: 'checkbox', checked: true, content: ''},
                    {mode: 'button', content: 'MapMX'},
                ]
            },
            {
                type: "cellRight",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'text', content: "Output Format"},
                    {mode: 'checkbox', checked: false, content: ''},
                    {mode: 'button', content: 'None'},
                ]
            },
            {
                type: "cellRight",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'text', content: "Baud Rate"},
                    {mode: 'text', content: ''},
                    {mode: 'text', content: '38400'},
                ]
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Restore Default...",
                icon: null
            }
        ]

    },


    "ARINC 429": {
        label: "ARINC 429 Configuration",

        buttonList: [
            {
                type: "normal",
                onclick: () => {toggleConfigutarionScreen(false);},
                content: "Back",
                icon: 'X'
            },
            {
                type: "cellRight",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'text', content: "Output 1"},
                    {mode: 'checkbox', checked: false, content: ''},
                    {mode: 'button', content: 'EFIS/Airdata 2 (SDI 1)'},
                ]
            },
            {
                type: "cellRight",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'text', content: "Output 2"},
                    {mode: 'checkbox', checked: false, content: ''},
                    {mode: 'button', content: 'None'},
                ]
            },
            {
                type: "cellRight",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'text', content: "Input 1"},
                    {mode: 'checkbox', checked: true, content: ''},
                    {mode: 'button', content: 'Garmin GPS (SDI 1)'},
                ]
            },
            {
                type: "cellRight",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'text', content: "Input 2"},
                    {mode: 'checkbox', checked: true, content: ''},
                    {mode: 'button', content: 'Garmin VOR/ILS (SDI 1)'},
                ]
            },
            {
                type: "cellRight",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'text', content: "Input 3"},
                    {mode: 'checkbox', checked: false, content: ''},
                    {mode: 'button', content: 'None'},
                ]
            },
            {
                type: "cellRight",
                onclick: () => {console.log("click pass");},
                contentList: [
                    {mode: 'text', content: "Input 4"},
                    {mode: 'checkbox', checked: false, content: ''},
                    {mode: 'button', content: 'None'},
                ]
            },
            {
                type: "normal",
                onclick: () => {console.log("click pass");},
                content: "Restore Default...",
                icon: null
            }
        ]

    },


};
