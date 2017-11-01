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
      list_el.addEventListener('click', pinClickHandler);
      list_el.children[1].addEventListener('click', pinTypeClickHandler);
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

  // If percent changed we need send updated configuration
  var $pin = this.parentNode.parentNode;
  var data = getPinData($pin);

  //console.log(data.pinNumber, data.pinType, data.value);
  makeUpdateConfiguration(data.pinNumber, data.pinType, data.value); 
}

function pinTypeClickHandler(e) {
  var $pin = this.parentNode;
	if($pin.id == 'pin-3') return;
	var pinNumber = parseInt($pin.dataset.id);
  var pinType = parseInt($pin.dataset.type);

  // changing pin type to next one
  pinType++;
	if(pinType == 2 && pinNumber > 2) {
        pinType++;
	}
	if(pinType == 3 && (pinNumber < 4 || pinNumber > 5)) {
		pinType++;
	}
	if(pinType > 3) pinType = 0;
	$pin.dataset.type = pinType;
}

/**
 * Handles the pin click and using the DOM(Document object model) generates the pinNumber and pinTYPE 
 * Updates the type in tile when any pin is clicked and type change is expected 
 * Call makeUpdateConfiguration fucntion to create the pin update array  
 */
function pinClickHandler(e) {
	var $pin = this;
	if($pin.id == 'pin-3') return;
	var data = getPinData($pin);

  //console.log(data.pinNumber, data.pinType, data.value);
  makeUpdateConfiguration(data.pinNumber, data.pinType, data.value); 
}

function getPinData($pin) {
	var pinNumber = parseInt($pin.dataset.id);
  var pinType = parseInt($pin.dataset.type);

  // getting value of pin
  var value = getPinValue($pin, pinType);

  return {
    pinNumber: pinNumber,
    pinType: pinType,
    value: value
  };
}

/**
 * Get value of the passed pin DOM element
 * 
 * @param {DOMElement} $pin 
 * @returns HIGH\LOW\0-100
 */
function getPinValue($pin, pinType) {
  var value = 0;
  if(pinType == PIN_TYPE.GPIO_OUTPUT) {
    var controller = $pin.getElementsByClassName('output-lowhigh-toggler')[0];
    var value = controller.dataset.value;
  } else if(pinType == PIN_TYPE.PWM) {
    var controller = $pin.getElementsByClassName('output-percent')[0];
    var value = parseInt(controller.value);
  }
  return value;
}