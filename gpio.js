let gpio = require('gpio');
const pinnumber = 1;
gpio.pins[pinnumber].setType(gpio.OUTPUT);

let val = 0, dir = 0;
setInterval(() => {
    val += dir ? 0.03 : -0.03;
    if(val < 0) { val = 0; dir = 1; }
    if(val > 1) { val = 1; dir = 0; }

    gpio.pins[pinnumber].setValue(val);
}, 30);
