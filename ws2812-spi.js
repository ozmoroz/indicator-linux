// This is a port of ws2812-SPI python library
// https://github.com/nickovs/ws2812-SPI/blob/master/neoSPI.py

// User bytes are spread across four buffer bytes, encoded into bits 6
// and 2 of each byte with the top bits of each nibble set and the
// bottom bits of each nibble all clear.

// 0b00011011 -> 0b10001000 0b10001100 0b11001000 0b11001100

// _expanded_bits = [0x88, 0x8C, 0xC8, 0xCC];

// function _expand_byte(b, mv) {
//     # Spread a byte across four bytes of a memoryview
//     mv[0] = _expanded_bits[(b >> 6) & 0x3]
//     mv[1] = _expanded_bits[(b >> 4) & 0x3]
//     mv[2] = _expanded_bits[(b >> 2) & 0x3]
//     mv[3] = _expanded_bits[(b) & 0x3]
// }

// function _compress_byte(mv) {
//     # Pack four bytes in a memoryview into a single byte
//     b1, b2, b3, b4 = mv
//     T, B = 0x40, 0x04
//     v = (((b1 & T) << 1) | ((b1 & B) << 4) |
//          ((b2 & T) >> 1) | ((b2 & B) << 2) |
//          ((b3 & T) >> 3) | ((b3 & B)     ) |
//          ((b4 & T) >> 5) | ((b4 & B) >> 2) )
//     return v
// }

const spi = require('spi-device');

function write_rgb(device, data) {
    const tx = [0x00]	
    data.forEach(rgb => {	
    	rgb.forEach(byte => {
	    [3, 2, 1].forEach(ibit => {
                // print ibit, byte, ((byte>>(2*ibit+1))&1), ((byte>>(2*ibit+0))&1), [hex(v) for v in tx]
                tx.push(((byte>>(2*ibit+1))&1)*0x60 +
                        ((byte>>(2*ibit+0))&1)*0x06 +
                          0x88)
	    })
	})
    })
    // print [hex(v) for v in tx]
    // An SPI message is an array of one or more read+write transfers
    const message = [{
        sendBuffer: Buffer.from(tx),
        byteLength: tx.length,
    }];
    return device.transferSync(message)	    
    // spi.xfer(tx, int(4/1.05e-6))
}

const leds = spi.openSync(0, 1);
write_rgb(leds, [[0, 255, 0]]);
leds.closeSync();



