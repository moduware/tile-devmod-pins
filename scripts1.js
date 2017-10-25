// Create variables for data and module type 
var last_data = [];
var currentModuleType = 'msp'; // msp

/*
    Function to generate new pages for 
*/



function generatePages() {
	var $pages = document.getElementById('pages'),
            number = 2,
			html = '';

	for(var i = 1; i <= number; i++) {
		html += '<div class="page page-' + i + '"><ul></ul></div>';
	}
	$pages.style.width = 100 * number + '%';
	$pages.innerHTML = html;
}
/*
    Pin generator

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
				list_el.getElementsByClassName('output-lowhigh-toggler')[0].addEventListener('click', selectLowHighClickHandler);
				list_el.getElementsByClassName('output-percent')[0].addEventListener('change', percentChangeHandler);
				$list.insertBefore(list_el, null);
		}

	}
}

function setMode(mode) {
	var supportedMods = ['msp'];
	// ignoring unsupported modes
	var index = supportedMods.indexOf(mode);
	if(index == -1) return;
	// next index or first index if last mode
	var nextIndex = (index + 1);

	// Configuring header
	Nexpaq.Header.cleanButtons();
	Nexpaq.Header.addButton({title: mode.toUpperCase()}, function() { setMode(supportedMods[nextIndex]); });

	// Switching mode
	currentModuleType = document.body.dataset.module = mode;
	
	// Reseting animation to first page
	document.getElementById('pages').style.transform = 'translateX(0)';
	document.getElementById('pages').style.webkitTransform = 'translateX(0)';

	// Regenerate layout for current mode
	generatePages()
	generatePins();
}



/* =========== ON PAGE LOAD HANDLER */
document.addEventListener('DOMContentLoaded', function(event) {
	// Creating header on top of tile
  Nexpaq.Header.create('DevMod Pins');

	document.getElementById('prev-page').addEventListener('click', prevButtonClickHandler);
	document.getElementById('next-page').addEventListener('click', nextButtonClickHandler);

	//nexpaqAPI.DevMod.addEventListener("onDataReceived", dataReceived);
    // Reseting animation to first page
    document.getElementById('pages').style.transform = 'translateX(0)';
	document.getElementById('pages').style.webkitTransform = 'translateX(0)';
    
    
    // Regenerate layout for current mode
	setMode('msp');
    
	
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
 * Handles successful module driver loaded event
 * 
 */
function moduleDriverLoadedHandler() {
	console.log('Custom module driver loaded');
}

/**
 * Works with raw data from module
 * 
 * @param {any} data 
 */
function rawModuleDataHandler(data) {
	// Raw data, received as Base64 encoded string, we need decode it into byte array
	var decodedData = Uint8Array.from(atob(data)), c => c.charCodeAt(0);
	// Passing to data handler
	dataReceived(decodedData);
}

/**
 * Actions to perform before exiting tile
 * 
 */
function beforeExitActions() {
	// restoring default module driver
	Nexpaq.API.Driver.RestoreDefault(Nexpaq.Arguments[0]);
}



