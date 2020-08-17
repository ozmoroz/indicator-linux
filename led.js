const spi = require('spi-device');

/** The number of LEDs on the board */
const NUM_LEDS = 20

/** Expand each bit of the of the original message into 4 bits:
 * 0 becomes 1000, 1 -> 1110
 * @returns an array of 4 bytes (the original byte expanded 4 times)
 */
function expand_byte(b) {
    return [6, 4, 2, 0].map(ibit =>
        ((b >> (ibit + 1))&1) * 0x60 +
        ((b >> (ibit + 0))&1) * 0x06 +
        0x88
    )
}

/** Writes an array of GRB data to the LEDs.
 * @param device - The opened SPI device to write to.
 * @param data - An array of [g, r, b] bytes to write into the LEDs.
 */
function write_grb(device, data) {
    // The first byte has to be zero (for the reset?)
    const tx = [0x00]
    data.forEach(rgb => {	
    	rgb.forEach(byte => {
	    tx.push(...expand_byte(byte));
	})
    })
    // An SPI message is an array of one or more read+write transfers
    const message = [{
        sendBuffer: Buffer.from(tx),
	speedHz: Math.floor(4/1.05e-6),
        byteLength: tx.length,
    }];
    return device.transferSync(message)	    
}

const leds = spi.openSync(0, 1);

// write_rgb(leds, [[0, 0, 0], [255, 0, 0], [0, 255, 0], [0, 0, 255]]);
const buf = new Array(NUM_LEDS);
for(let i=0; i<buf.length; i++){
	buf[i] = [0, 100, 0]
}
write_grb(leds, buf);

leds.closeSync();



