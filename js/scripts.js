var last_data = [];
var currentModuleType = 'msp'; // msp

/**
 * Creates multiple pages for the tile environment and create page layout 
 */   
function generatePages(){
    var $pages = document.getElementById('pages'),
    number = 2,
    html = '';
    for(var i = 1; i <= number; i++){
        html += '<div class="page page-' + i + '"><ul></ul></div>';
	}
	$pages.style.width = 100 * number + '%';
	$pages.innerHTML = html;
}


/**  
 *  Generates page properties like page numbers and page styles 
 */

function setPage(number) {
	var $pages = document.getElementById('pages'),
			percent = -1 * 100 * (number - 1) / $pages.children.length;

	$pages.style.transform = "translateX(" + percent + "%)";
	$pages.style.webkitTransform = "translateX(" + percent + "%)";
}

/**
 *  Creates pin layout with associated DOM properties and associated functions 
 */ 
function generatePins() {
	var $pin_containers = document.getElementById('pages').children;
	for(var i=0; i<$pin_containers.length; i++) {
        
		var $list = $pin_containers[i].children[0];
		for(var j=0; j<8; j++) {
			var list_el = document.createElement('li');
			var number = (j + 8 * i);
			list_el.setAttribute('data-type', 0);
            list_el.setAttribute('data-id', number);
			list_el.id = 'pin-' + number;
			list_el.innerHTML = ' \
			  <div class="number">' + number + '</div> \
				<div class="name"></div> \
				<div class="controller"> \
					<div class="value">LOW</div> \
					<button class="output-lowhigh-toggler" data-value="LOW">LOW</button> \
					<select class="output-lowhigh"> \
						<option>LOW</option> \
						<option>HIGH</option> \
					</select> \
					<input class="output-percent" type="number" name="precent" value="0" min="0" max="100" step="1"> \
				</div>';
				list_el.children[1].addEventListener('click', pinClickHandler);
				list_el.getElementsByClassName('output-lowhigh-toggler')[0].addEventListener('click', lowHighToggler);
				list_el.getElementsByClassName('output-percent')[0].addEventListener('change', percentChangeHandler);
				$list.insertBefore(list_el, null);
		}

	}
    
}


/**  
 * Generates movement within pages using next button on the tile to go to next page in tile layout
 */

function nextButtonClickHandler(e) {
	var $pages = document.getElementById('pages'),
			currentPage = parseInt($pages.dataset.page);

	currentPage++;
	if(currentPage > $pages.children.length) currentPage = 1;

	$pages.dataset.page = currentPage;
	setPage(currentPage);
}

/**
 * Movement within pages using previous button on the tile to go to previous page in tile layout
 */

function prevButtonClickHandler(e) {
	var $pages = document.getElementById('pages'),
			currentPage = parseInt($pages.dataset.page);

	currentPage--;
	if(currentPage <= 0) currentPage = $pages.children.length;

	$pages.dataset.page = currentPage;
	setPage(currentPage);
}

/** 
 * FunctionlowHighToggler change the value from the button from LOW to HIGH and vice versa when changed   in app.
 *
 */
function lowHighToggler(e) {
	var $select = this.parentNode.getElementsByClassName('output-lowhigh')[0];
	if(this.textContent == "LOW") {
		this.textContent = "HIGH";
		this.dataset.value = "HIGH";
		$select.value = "HIGH";
	} else {
		this.textContent = "LOW";
		this.dataset.value = "LOW";
		$select.value = "LOW";
	}
   
}
/**
 * Handles the change of PWM percentage values by user 
 */
function percentChangeHandler(e) {
	var value = parseInt(this.value);
	if(isNaN(value)) value = 0;
	if(value < 0) value = 0;
	if(value > 100) value = 100;
	this.value = value;

}

/**
 * Handles the pin click and using the DOM(Document object model) generates the pinNumber and pinTYPE 
 * Updates the type in tile when any pin is clicked and type change is expected 
 * Call makeUpdateConfiguration fucntion to create the pin update array  
 */
function pinClickHandler(e) {
	var $pin = this.parentNode;
	if($pin.id == 'pin-3') return;
	var id = parseInt($pin.dataset.id);
    var type = parseInt($pin.dataset.type);
    type++;
	if(type == 2 && id > 2) {
        type++;
	}
	if(type == 3 && (id < 4 || id > 5)) {
		type++;
	}
    if(type > 3) type = 0;
	$pin.dataset.type = type;
    makeUpdateConfiguration(id, type);   
}

/**
 * Variable assignment for the possible pin types 
 * 
*/

var PIN_TYPE = {
    GPIO_INPUT: 0,
    GPIO_OUTPUT: 1,
    ADC: 2,
    PWM: 3
}

/**
 * makeUpdateConfiguration function makes the pin configuration array of 3 byte to send to the firmware
 * @param {pinNumber},@param{pinType}
 * send pinNumber, pinType and value1 to the sendUpdateConfiguration function  
 *
 */
function makeUpdateConfiguration(pinNumber, pinType) {
    var value1;
    if(pinNumber == 3) return;
    if((pinNumber <= 2) || (pinNumber >= 4 || pinNumber <= 15)) {
        if(pinType == PIN_TYPE.GPIO_INPUT){
            value1 = 0;
        }else if(pinType == PIN_TYPE.GPIO_OUTPUT) {
            value1 = button == "low" ? 0 : 1; // TODO: Value of low high button
        }else if(pinType == PIN_TYPE.ADC) {
            value1 = 0;
        }else if(pinType == PIN_TYPE.PWM) {
            value1 = pwm;                    // TODO: Value of PWM percentage
        }
    }
    sendUpdateConfiguration(pinNumber, pinType, value1);
}

/**
 * sendUpdateConfiguration function recieves the update configuration data and make an array of 4 bytes * send this 4 byte array to the gateway API to transfer to the firmware
 * @param{}pinNumber, @param{}pinType, @param{}value
 */


function sendUpdateConfiguration(pinNumber, pinType, value1) {
    var updateConfiguration = [];
    updateConfiguration.push(pinNumber, pinType, value1, 00);
    //console.log("config:", updateConfiguration);
    Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'SetPinModes', updateConfiguration);
}

/* 
* dataHandle function receive the array of data sent from hardware and break it into chunks of 4 bytes
* each of which contains pin number, pin type, value1, value2.
* @param{type}data
* call renderdata(pin_Update) function
*/

function dataHandle(data) {
    var pinUpdate =[];
    for(var i=0; i< data.length/4; i++) {
        pinUpdate[i] = data.slice(i*4, (i+1)*4);
        renderData(pinUpdate[i]);
    }
}
/**
 * renderData function receive pin update data(4 bytes) information sent from dataHandle function.
 * check the type of pin update and update the data in tile. 
 * @param{type}pinUpdate
 */

function renderData(pinUpdate) {
    var value;
    if(pinUpdate[1] == PIN_TYPE.GPIO_INPUT) {
        value = pinUpdate[2] == 0 ? 'LOW':'HIGH';
    }else if( pinUpdate[1] == PIN_TYPE.ADC) {
        var v1 = pinUpdate[2];
		var v2 = pinUpdate[3];
		value = ((v1 + v2) * 3.3) / 1023;
		value = value.toFixed(2);
    }
    
}

/* =========== ON PAGE LOAD HANDLER ============*/
document.addEventListener('DOMContentLoaded', function(event) {
	// Creating header on top of tile
  Nexpaq.Header.create('DevMod Pins');

	document.getElementById('prev-page').addEventListener('click', prevButtonClickHandler);
	document.getElementById('next-page').addEventListener('click', nextButtonClickHandler);

	//nexpaqAPI.DevMod.addEventListener("onDataReceived", dataReceived);

	generatePages()
	generatePins();
});

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

