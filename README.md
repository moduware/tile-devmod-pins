# DevMod pins tile

DevMod pin tile can be used in different modes based on the pin number and pin type selected as below:
- GPIO I        
- GPIO O          
- ADC        
- PWM

## GPIO I 
In GPIO I mode pin numbers 0-15 may act as an input that can accept digital values HIGH/LOW from the firmware module and show them in the tile. In this mode the devmod tile is useful in reading the status(ON/OFF) of any hardware switch connected to the module.

## GPIO O
In GPIO O mode pin numbers 0-15 may act as an output that can communicate digital values HIGH/LOW. These values can be selected in tile and be sent to the firmware module from the tile only. Using this mode the devmod tile is capable of driving any circuit external/internal to the hardware module with the digital values of HIGH/LOW.

## ADC
In ADC mode the pin number 0-2 may act as an ADC(analog to digital convertor) that can accept the analog voltage values from any analog electrical device like potentiometer and show these analog voltage values in tile(Here the maximum voltage will be 3.3V as msp module is operating at 3.3V only).

## PWM
In PWM mode the pin number 4-5 may act as PWM(Pulse Width Modulation) that can communicate PWM values from tile to the firmware. these values can be varied between 0-100% duty cycle of the clock available.PWM values sent can be useful to drive different elecrical circuits and devices like servo motor, LEDs etc.

# DevMod pin tile snapshot
![snapshot]


## Useful links:
- [WebView tile template and TODO: How webview tile works][webview-template]

[Live Preview][preview]

[preview]: https://material.io/resizer/#device=handset&url=https%3A%2F%2Fnexpaq.github.io%2Ftile-devmod-pins%2F&width=360
[snapshot]:https://github.com/moduware/tile-devmod-pins/blob/updates/devmod%20pins%20tile/2017-11-08-12-58-54.png
