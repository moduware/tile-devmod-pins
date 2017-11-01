var last_data = [];

/**
 * makeUpdateConfiguration function makes the pin configuration array of 3 byte to send to the firmware
 * @param {pinNumber},@param{pinType}
 * send pinNumber, pinType and value1 to the sendUpdateConfiguration function  
 *
 */
function makeUpdateConfiguration(pinNumber, pinType, value) {
	if(pinNumber == 3) return;
	var configuration = makePinConfiguration(pinNumber, pinType, value);
	sendPinConfiguration(configuration);
}

/**
 * Generates 2 or 3 bytes pin configuration, that is ready for transfer
 * 
 * @param {Integer} pinNumber 
 * @param {Integer} pinType 
 * @param {Integer\String} value 
 * @returns array of bytes
 */
function makePinConfiguration(pinNumber, pinType, value) {
	var configuration = [
		pinNumber,
		pinType
	];
	if(pinType == PIN_TYPE.GPIO_OUTPUT) {
		var value = (value == 'LOW' ? 0 : 1);
		configuration.push(value);
	} else if(pinType == PIN_TYPE.PWM) {
		configuration.push(value);
	}

	return configuration;
}

/**
 * sendUpdateConfiguration function recieves the update configuration data and transfers it to the firmware
 * @param {array} configuration bytes with configuration
 */
function sendPinConfiguration(configuration) {
	Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'SetPinModes', configuration);
}

/* 
* dataHandle function receive the array of data sent from hardware and break it into chunks of 4 bytes
* each of which contains pin number, pin type, value1, value2.
* @param{type}data
* call renderdata(pin_Update) function
*/
function dataHandle(data) {
	for(var i=0; i< data.length/4; i++) {
		var startIndex = i * 4;
		var endIndex = (i + 1) * 4;
		var pinUpdate = data.slice(startIndex, endIndex);
		renderPinData(pinUpdate);
	}
}


/**
 * renderPinData function receive pin update data(4 bytes) information sent from dataHandle function.
 * check the type of pin update and update the data in tile. 
 * @param{type}pinUpdate
 */
function renderPinData(pinUpdate) {
	var pinNumber = pinUpdate[0];
	var pinType = pinUpdate[1];
	var value = parsePinValue(pinType, pinUpdate[2], pinUpdate[3]);
	
	var $pin = document.getElementById('pin-' + pinNumber);
	$pin.dataset.type = pinType;
	if(pinType == PIN_TYPE.GPIO_INPUT) {
		var controller = $pin.getElementsByClassName('value')[0];
		controller.textContent = value;
	} else if(pinType == PIN_TYPE.ADC) {
		var controller = $pin.getElementsByClassName('value')[0];
		controller.textContent = value + ' V';
	}
}

/**
 * Parsing pin value out of raw bytes
 * 
 * @param {Integer} pinType 
 * @param {Byte} rawValue1 
 * @param {Byte} rawValue2 
 * @returns 
 */
function parsePinValue(pinType, rawValue1, rawValue2) {
	var value = 0;
	if(pinType == PIN_TYPE.GPIO_INPUT) {
		value = rawValue1 == 0 ? 'LOW':'HIGH';
	} else if(pinType == PIN_TYPE.ADC) {
		var v1 = rawValue1;
		var v2 = rawValue2;
		value = v1 * 256 + v2;
	}

	return value;
}

// Doing our actions when nexpaq API is ready
document.addEventListener('NexpaqAPIReady', function() {
	var jsonDriver = JSON.stringify(driver);
    
	Nexpaq.API.Driver.LoadFromJson(Nexpaq.Arguments[0], jsonDriver, moduleDriverLoadedHandler);
	Nexpaq.API.Module.addEventListener('RawDataReceived', function(messageFromModule) {
		// Ignoring data from other modules
		if(messageFromModule.moduleUuid != Nexpaq.Arguments[0]) return;
		// We are interested only in standard data stream
		if(messageFromModule.dataSource != '2800') return;
		// Passing data to handler
		rawModuleDataHandler(messageFromModule.data);
	});

	// We also will want to turn LED of when user leaves our tile, so lets track this event
	Nexpaq.API.addEventListener('BeforeExit', beforeExitActions);
});

/**
 * Works with raw data from module
 * 
 * @param {any} data 
 */
function rawModuleDataHandler(data) {
	// Raw data, received as Base64 encoded string, we need decode it into byte array
	var decodedData = Uint8Array.from(atob(data), c => c.charCodeAt(0));
	// Passing to data handler
	dataHandle(decodedData);
}

/**
 * Handles successful module driver loaded event
 * 
 */
function moduleDriverLoadedHandler() {
	console.log('Custom module driver loaded');
}

/**
 * Actions to perform before exiting tile
 * 
 */

function beforeExitActions() {
	// restoring default module driver
	Nexpaq.API.Driver.RestoreDefault(Nexpaq.Arguments[0]);
}

