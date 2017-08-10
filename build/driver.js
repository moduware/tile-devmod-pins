var driver = {
    "type": "nexpaq.module.devmod",
    "version": "1.0.0",
    "commands": [
        {
            "name": "SetPinModes",
            "title": "Set Pin Modes",
            "description": "Configures pins of module to one of modes: GPIO I, GPIO O, ADC or PWM. Array length 15 for MSP or 26 for MAX.",
            "command": "2700"
        },
        {
            "name": "SetPWMValues",
            "title": "SetPWMValues",
            "description": "Sets PWM values for module pins. Two pins on MSP or 19 pins on MAX.",
            "command": "2702"
        }
    ]/*,
    "data": [
        {
            "name": "SensorStateChangeResponse",
            "title": "Sensor State Change Reponse",
            "description": "Response to sensor state change command",
            "source": "2701",
            "variables": [
                {
                    "name": "result",
                    "title": "Result",
                    "description": "Result of turn sensor on or off request",
                    "data": [0],
                    "state": {
                        "00": "success",
                        "01": "failure"
                    }
                }
            ]
        },
        {
            "name": "EmissivityChangeResponse",
            "title": "Emissivity Change Request Response",
            "description": "Response to change emissivity setting of sensor",
            "source": "2703",
            "variables": [
                {
                    "name": "result",
                    "title": "Result",
                    "description": "Result of attempt to set new emissivity value",
                    "data": [0],
                    "state": {
                        "00": "success",
                        "01": "bad_value",
                        "02": "eeprom_fault"
                    }
                }
            ]
        },
        {
            "name": "SensorValue",
            "title": "Sensor Value",
            "description": "Value from Temperature and Humidity sensor",
            "source": "2800",
            "variables": [
                {
                    "name": "humidity",
                    "title": "Humidity",
                    "description": "Ambient humidity detected by module",
                    "data": [0, 1],
                    "format": "175.75 * ({0} * 256 + {1} / 4 * 4) / 65536 - 46.85",
                    "source": "data"
                },
                {
                    "name": "ambient_temperature",
                    "title": "Ambient Temperature",
                    "description": "Ambient temperature detected by module",
                    "data": [4, 5],
                    "format": "({0} * 256 + {1}) * 0.02 - 273.15",
                    "source": "data"
                },
                {
                    "name": "object_temperature",
                    "title": "Object Temperature",
                    "description": "Object temperature detected by module",
                    "data": [2, 3],
                    "format": "({0} * 256 + {1}) * 0.02 - 273.15",
                    "source": "data"
                }
            ]
        }
    ]*/
};