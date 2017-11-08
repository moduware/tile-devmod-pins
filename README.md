## DevMod pins tile
DevMod pin tile can be used in different modes based on the pin number and pin type selected as below:
- GPIO I        
- GPIO O          
- ADC        
- PWM

### GPIO I 
In GPIO I mode pin numbers 0-15 may act as an input that can accept digital values HIGH/LOW from the firmware module and show them in the tile. In this mode the devmod tile is useful in reading the status(ON/OFF) of any hardware switch connected to the module.

### GPIO O
In GPIO O mode pin numbers 0-15 may act as an output that can communicate digital values HIGH/LOW. These values can be selected in tile and be sent to the firmware module from the tile only. Using this mode the devmod tile is capable of driving any circuit external/internal to the hardware module with the digital values of HIGH/LOW.

### ADC
In ADC mode the pin number 0-2 may act as an ADC(analog to digital convertor) that can accept the analog voltage values from any analog electrical device like potentiometer and show these analog voltage values in tile(Here the maximum voltage will be 3.3V as msp module is operating at 3.3V only).

### PWM
In PWM mode the pin number 4-5 may act as PWM(Pulse Width Modulation) that can communicate PWM values from tile to the firmware. these values can be varied between 0-100% duty cycle of the clock available.PWM values sent can be useful to drive different elecrical circuits and devices like servo motor, LEDs and piezo speaker etc.

## Hardware required
- 1 x Breadboard
- Male – female connectors and jumper wires
- 1 x MSP430G2553 module
- 1 x Nexpaq developer’s board
- 1 x MSP-EXP430G2 launch Pad
- 1 x Android phone
- Depending on the mode used developer might need LEDs for GPIO I, push button for GPIO O, potentiometer for ADC and piezo speaker for PWM.

## Software required

- [Code Composer Studio IDE][ccs] for firmware design and module flashing.
- Any code editor (like [Atom][atom], [Visual Studio Code][vscode], [Sublime Text][sublime], [Brackets][brackets], etc..) for tile.
- Nexpaq application
  - [Unstable developer's version][unstableapp] (more features)
  - [Stable user's version][stableapp] (more reliable)

## DevMod pin tile snapshot
![snapshot]


## Useful links:
- [WebView tile template and TODO: How webview tile works][webview-template]

[snapshot]:https://github.com/moduware/tile-devmod-pins/blob/updates/devmod%20pins%20tile/2017-11-08-12-58-54.png
[stableapp]: https://nexpaq.com/app
[unstableapp]: https://nexpaq.com/app-dev
[ccs]: http://www.ti.com/tool/CCSTUDIO
[atom]: https://atom.io/
[vscode]: https://code.visualstudio.com/
[sublime]: https://www.sublimetext.com/
[webview-template]: https://github.com/nexpaq/webview-tile-template
[brackets]: http://brackets.io/
