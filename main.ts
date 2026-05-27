
const oledFont: uint8[] = [
  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
  0x00,0x00,0x5F,0x00,0x00,0x00,0x00,0x00,
  0x00,0x00,0x07,0x00,0x07,0x00,0x00,0x00,
  0x00,0x14,0x7F,0x14,0x7F,0x14,0x00,0x00,
  0x00,0x24,0x2A,0x7F,0x2A,0x12,0x00,0x00,
  0x00,0x23,0x13,0x08,0x64,0x62,0x00,0x00,
  0x00,0x36,0x49,0x55,0x22,0x50,0x00,0x00,
  0x00,0x00,0x05,0x03,0x00,0x00,0x00,0x00,
  0x00,0x1C,0x22,0x41,0x00,0x00,0x00,0x00,
  0x00,0x41,0x22,0x1C,0x00,0x00,0x00,0x00,
  0x00,0x08,0x2A,0x1C,0x2A,0x08,0x00,0x00,
  0x00,0x08,0x08,0x3E,0x08,0x08,0x00,0x00,
  0x00,0xA0,0x60,0x00,0x00,0x00,0x00,0x00,
  0x00,0x08,0x08,0x08,0x08,0x08,0x00,0x00,
  0x00,0x60,0x60,0x00,0x00,0x00,0x00,0x00,
  0x00,0x20,0x10,0x08,0x04,0x02,0x00,0x00,
  0x00,0x3E,0x51,0x49,0x45,0x3E,0x00,0x00,
  0x00,0x00,0x42,0x7F,0x40,0x00,0x00,0x00,
  0x00,0x62,0x51,0x49,0x49,0x46,0x00,0x00,
  0x00,0x22,0x41,0x49,0x49,0x36,0x00,0x00,
  0x00,0x18,0x14,0x12,0x7F,0x10,0x00,0x00,
  0x00,0x27,0x45,0x45,0x45,0x39,0x00,0x00,
  0x00,0x3C,0x4A,0x49,0x49,0x30,0x00,0x00,
  0x00,0x01,0x71,0x09,0x05,0x03,0x00,0x00,
  0x00,0x36,0x49,0x49,0x49,0x36,0x00,0x00,
  0x00,0x06,0x49,0x49,0x29,0x1E,0x00,0x00,
  0x00,0x00,0x36,0x36,0x00,0x00,0x00,0x00,
  0x00,0x00,0xAC,0x6C,0x00,0x00,0x00,0x00,
  0x00,0x08,0x14,0x22,0x41,0x00,0x00,0x00,
  0x00,0x14,0x14,0x14,0x14,0x14,0x00,0x00,
  0x00,0x41,0x22,0x14,0x08,0x00,0x00,0x00,
  0x00,0x02,0x01,0x51,0x09,0x06,0x00,0x00,
  0x00,0x32,0x49,0x79,0x41,0x3E,0x00,0x00,
  0x00,0x7E,0x09,0x09,0x09,0x7E,0x00,0x00,
  0x00,0x7F,0x49,0x49,0x49,0x36,0x00,0x00,
  0x00,0x3E,0x41,0x41,0x41,0x22,0x00,0x00,
  0x00,0x7F,0x41,0x41,0x22,0x1C,0x00,0x00,
  0x00,0x7F,0x49,0x49,0x49,0x41,0x00,0x00,
  0x00,0x7F,0x09,0x09,0x09,0x01,0x00,0x00,
  0x00,0x3E,0x41,0x41,0x51,0x72,0x00,0x00,
  0x00,0x7F,0x08,0x08,0x08,0x7F,0x00,0x00,
  0x00,0x41,0x7F,0x41,0x00,0x00,0x00,0x00,
  0x00,0x20,0x40,0x41,0x3F,0x01,0x00,0x00,
  0x00,0x7F,0x08,0x14,0x22,0x41,0x00,0x00,
  0x00,0x7F,0x40,0x40,0x40,0x40,0x00,0x00,
  0x00,0x7F,0x02,0x0C,0x02,0x7F,0x00,0x00,
  0x00,0x7F,0x04,0x08,0x10,0x7F,0x00,0x00,
  0x00,0x3E,0x41,0x41,0x41,0x3E,0x00,0x00,
  0x00,0x7F,0x09,0x09,0x09,0x06,0x00,0x00,
  0x00,0x3E,0x41,0x51,0x21,0x5E,0x00,0x00,
  0x00,0x7F,0x09,0x19,0x29,0x46,0x00,0x00,
  0x00,0x26,0x49,0x49,0x49,0x32,0x00,0x00,
  0x00,0x01,0x01,0x7F,0x01,0x01,0x00,0x00,
  0x00,0x3F,0x40,0x40,0x40,0x3F,0x00,0x00,
  0x00,0x1F,0x20,0x40,0x20,0x1F,0x00,0x00,
  0x00,0x3F,0x40,0x38,0x40,0x3F,0x00,0x00,
  0x00,0x63,0x14,0x08,0x14,0x63,0x00,0x00,
  0x00,0x03,0x04,0x78,0x04,0x03,0x00,0x00,
  0x00,0x61,0x51,0x49,0x45,0x43,0x00,0x00,
  0x00,0x7F,0x41,0x41,0x00,0x00,0x00,0x00,
  0x00,0x02,0x04,0x08,0x10,0x20,0x00,0x00,
  0x00,0x41,0x41,0x7F,0x00,0x00,0x00,0x00,
  0x00,0x04,0x02,0x01,0x02,0x04,0x00,0x00,
  0x00,0x80,0x80,0x80,0x80,0x80,0x00,0x00,
  0x00,0x01,0x02,0x04,0x00,0x00,0x00,0x00,
  0x00,0x20,0x54,0x54,0x54,0x78,0x00,0x00,
  0x00,0x7F,0x48,0x44,0x44,0x38,0x00,0x00,
  0x00,0x38,0x44,0x44,0x28,0x00,0x00,0x00,
  0x00,0x38,0x44,0x44,0x48,0x7F,0x00,0x00,
  0x00,0x38,0x54,0x54,0x54,0x18,0x00,0x00,
  0x00,0x08,0x7E,0x09,0x02,0x00,0x00,0x00,
  0x00,0x18,0xA4,0xA4,0xA4,0x7C,0x00,0x00,
  0x00,0x7F,0x08,0x04,0x04,0x78,0x00,0x00,
  0x00,0x00,0x7D,0x00,0x00,0x00,0x00,0x00,
  0x00,0x80,0x84,0x7D,0x00,0x00,0x00,0x00,
  0x00,0x7F,0x10,0x28,0x44,0x00,0x00,0x00,
  0x00,0x41,0x7F,0x40,0x00,0x00,0x00,0x00,
  0x00,0x7C,0x04,0x18,0x04,0x78,0x00,0x00,
  0x00,0x7C,0x08,0x04,0x7C,0x00,0x00,0x00,
  0x00,0x38,0x44,0x44,0x38,0x00,0x00,0x00,
  0x00,0xFC,0x24,0x24,0x18,0x00,0x00,0x00,
  0x00,0x18,0x24,0x24,0xFC,0x00,0x00,0x00,
  0x00,0x00,0x7C,0x08,0x04,0x00,0x00,0x00,
  0x00,0x48,0x54,0x54,0x24,0x00,0x00,0x00,
  0x00,0x04,0x7F,0x44,0x00,0x00,0x00,0x00,
  0x00,0x3C,0x40,0x40,0x7C,0x00,0x00,0x00,
  0x00,0x1C,0x20,0x40,0x20,0x1C,0x00,0x00,
  0x00,0x3C,0x40,0x30,0x40,0x3C,0x00,0x00,
  0x00,0x44,0x28,0x10,0x28,0x44,0x00,0x00,
  0x00,0x1C,0xA0,0xA0,0x7C,0x00,0x00,0x00,
  0x00,0x44,0x64,0x54,0x4C,0x44,0x00,0x00,
  0x00,0x08,0x36,0x41,0x00,0x00,0x00,0x00,
  0x00,0x00,0x7F,0x00,0x00,0x00,0x00,0x00,
  0x00,0x41,0x36,0x08,0x00,0x00,0x00,0x00,
  0x00,0x02,0x01,0x01,0x02,0x01,0x00,0x00,
  0x00,0x02,0x05,0x05,0x02,0x00,0x00,0x00 
];


/**
 * Functions to operate Grove module.
 */
//% weight=10 color=#9F79EE icon="\uf108" block="OLED Display"
namespace groveoleddisplay {

    /**
     * Create Grove - Oled Display
     */
    //% blockId=grove_oled_create block="Create Oled Display"
    export function createOled(): SH1107G
    {
        let oled = new SH1107G();
        
        oled.init();
        oled.clearDisplayFast();
        
        return oled;
    }

    /**
     * Create Grove - Oled Display with faster clear
     */
    //% blockId=grove_oled_create_fast block="Create Oled Display Fast"
    export function createOledFast(): SH1107G
    {
        let oled = new SH1107G();
        
        oled.init();
        oled.clearDisplayFast();
        
        return oled;
    }

    export class SH1107G 
    {

        private sendData(data:number) {
            let buf: Buffer = pins.createBuffer(2);
            buf[0] = 0x40; // SeeedGrayOLED_Data_Mode
            buf[1] = data;

            pins.i2cWriteBuffer(0x3c, buf, false);
            // pins.i2cWriteBuffer(0x3c, buf);
        }

        private sendDataBuffer(data: number[], start: number, count: number) {
            let buf: Buffer = pins.createBuffer(count + 1);
            buf[0] = 0x40; // SeeedGrayOLED_Data_Mode
            for (let i = 0; i < count; i++) {
                buf[i + 1] = data[start + i];
            }
            pins.i2cWriteBuffer(0x3c, buf, false);
        }

        private sendRepeatedData(data: number, count: number) {
            let buf: Buffer = pins.createBuffer(count + 1);
            buf[0] = 0x40; // SeeedGrayOLED_Data_Mode
            for (let i = 0; i < count; i++) {
                buf[i + 1] = data;
            }
            pins.i2cWriteBuffer(0x3c, buf, false);
        }

        private sendByteBuffer(buf: Buffer) {
            pins.i2cWriteBuffer(0x3c, buf, false);
        }

        private sendCommand(cmd:number) {
            
            let buf: Buffer = pins.createBuffer(2);
            buf[0] = 0x80;  // SeeedGrayOLED_Command_Mode
            buf[1] = cmd;

            pins.i2cWriteBuffer(0x3c, buf, false);
            // pins.i2cWriteBuffer(0x3c, buf);
        }

        /**
         * Init Grove - OLED Display
         */
        //% blockId=grove_oled_init block="%oled|Init Grove - OLED Display"
        //% advanced=true
        init() {
            this.sendCommand(0xae);  // Display OFF 
            this.sendCommand(0xd5);  // Set Dclk
            this.sendCommand(0x50);  // 100Hz
            this.sendCommand(0x20);  // Set row address
            this.sendCommand(0x81);  // Set contrast control
            this.sendCommand(0x80);  
            this.sendCommand(0xa0);  // Segment remap
            this.sendCommand(0xa4);  // Set Entire Display ON 
            this.sendCommand(0xa6);  // Normal display
            this.sendCommand(0xad);  // Set external VCC
            this.sendCommand(0x80);
            this.sendCommand(0xc0);  // Set Common scan direction
            this.sendCommand(0xd9);  // Set phase leghth
            this.sendCommand(0x1f);
            this.sendCommand(0xdb);  // Set Vcomh voltage
            this.sendCommand(0x27);
            this.sendCommand(0xaf);  // Display ON
            this.sendCommand(0xb0);
            this.sendCommand(0x00);
            this.sendCommand(0x11);
        }

        /**
         * Set display position
         * @param row which row to display, range from 0 to 15.
         * @param col which col to display, range from 0 to 127.
         */
        //% blockId=grove_oled_set_text_xy block="%oled|Set display position at row|%row|and column|%col"
        //% row.min=0 row.max=15
        //% col.min=0 col.max=127
        setTextXY(row:number, col:number) {
            let col_l:number = col % 16;
            let col_h:number = (col / 16)+0x10;

            this.sendCommand(0xb0+row);
            this.sendCommand(col_l);
            this.sendCommand(col_h);
        }

        /**
         * Clear display
         */
        //% blockId=grove_oled_clear_display block="%oled|Clear display"
        clearDisplay() {
            for(let i:number=0; i<16;i++){
                this.sendCommand(0xb0+i);
                this.sendCommand(0x0);
                this.sendCommand(0x10);
                for(let j=0; j<128;j++){ 
                  this.sendData(0x00);  
                }
            }
        }

        /**
         * Clear display with fewer I2C writes
         */
        //% blockId=grove_oled_clear_display_fast block="%oled|Clear display fast"
        clearDisplayFast() {
            for (let row = 0; row < 16; row++) {
                this.sendCommand(0xb0 + row);
                this.sendCommand(0x0);
                this.sendCommand(0x10);
                this.sendRepeatedData(0x00, 128);
            }
        }

        private putChar(c:number) {
            if (c < 32 || c > 127) {
                c = 0; // space
            }
            else {
                c = c-32;
            }

            for(let i=0; i< 8;i++){
                this.sendData(oledFont[c*8+i]);
            }
        }

        /**
         * Display a string
         * @param s a string to display.
         */
        //% blockId=grove_oled_put_string block="%oled|Display string |%s|"
        putString(s:string) {
            for (let n=0;n<s.length;n++){
                this.putChar(s.charCodeAt(n));
            }
        }

        /**
         * Display a integer number
         * @param num a integer number to display.
         */
        //% blockId=grove_oled_put_number block="%oled|Display integer number |%num|"
        putNumber(num:number) {
            this.putString(num.toString());
        }

        /**
         * Display a bit map(32x32 max)
         * @param x_start 
         * @param y_start 
         * @param row_number
         * @param column_number
         * @param bitmap
         */
        //% blockId=grove_oled_draw_bitmap block="%oled|Draw bitmap start at row|%x_start|and column|%y_start|, size: row|%row_number|and column|%column_number|, bitmap:|%bitmap|"
        //% x.min=0 x.max=15
        //% y.min=0 y.max=127
        //% row_number.min=0 row_number.max=4
        //% column_number.min=0 column_number.max=32
        //% advanced=true
        drawBitmap(x_start:number,y_start:number,row_number:number,column_number:number,bitmap:number[]) {
            let x_end = x_start+row_number;
            let y_end = y_start+column_number;
            if (x_end > 16) x_end = 16;
            if (y_end > 128) y_end = 128;
            let x_offset = 0, y_offset = 0;

            for (let i=x_start; i<x_end; i++) {
                y_offset = 0;
                for (let j=y_start; j<y_end; j++) {
                    let temp_byte = bitmap[column_number*x_offset+y_offset];
                    y_offset++;
                    this.sendCommand(0xb0+i);
                    this.sendCommand(j % 16);
                    this.sendCommand(j/16 + 0x10);
                    this.sendData(temp_byte);
                }
                x_offset ++ ;
            }
            
        }

        /**
         * Display a bitmap with fewer I2C writes
         * @param x_start page row to start, range from 0 to 15.
         * @param y_start column to start, range from 0 to 127.
         * @param row_number number of page rows.
         * @param column_number number of columns.
         * @param bitmap bitmap bytes in page-major order.
         */
        //% blockId=grove_oled_draw_bitmap_fast block="%oled|Draw bitmap fast start at row|%x_start|and column|%y_start|, size: row|%row_number|and column|%column_number|, bitmap:|%bitmap|"
        //% x_start.min=0 x_start.max=15
        //% y_start.min=0 y_start.max=127
        //% row_number.min=1 row_number.max=16
        //% column_number.min=1 column_number.max=128
        //% advanced=true
        drawBitmapFast(x_start:number, y_start:number, row_number:number, column_number:number, bitmap:number[]) {
            let x_end = x_start + row_number;
            let y_end = y_start + column_number;
            if (x_start < 0) x_start = 0;
            if (y_start < 0) y_start = 0;
            if (x_end > 16) x_end = 16;
            if (y_end > 128) y_end = 128;

            let safeColumns = y_end - y_start;
            let offset = 0;
            for (let row = x_start; row < x_end; row++) {
                this.sendCommand(0xb0 + row);
                this.sendCommand(y_start % 16);
                this.sendCommand(Math.floor(y_start / 16) + 0x10);

                let sent = 0;
                while (sent < safeColumns) {
                    let count = Math.min(32, safeColumns - sent);
                    this.sendDataBuffer(bitmap, offset + sent, count);
                    sent += count;
                }
                offset += column_number;
            }
        }

        /**
         * Draw a 16x16 bitmap scaled to 128x128 with fewer pasted bytes
         * @param y_start column to start, range from 0 to 127.
         * @param bitmap16 16x16 bitmap bytes in page-major vertical 1bpp order.
         */
        //% blockId=grove_oled_draw_bitmap_16_scale8_fast block="%oled|Draw 16x16 bitmap scale 8 fast at column|%y_start|, bitmap:|%bitmap16|"
        //% y_start.min=0 y_start.max=127
        //% advanced=true
        drawBitmap16Scale8Fast(y_start:number, bitmap16:number[]) {
            this.draw16Scale8(y_start, bitmap16);
        }

        /**
         * Draw a 16x16 bitmap scaled to 128x128 with fewer pasted bytes
         * @param y_start column to start, range from 0 to 127.
         * @param bitmap16 16x16 bitmap bytes in page-major vertical 1bpp order.
         */
        //% blockId=grove_oled_draw_16_scale_8 block="%oled|Draw 16x16 scale 8 fast at column|%y_start|, bitmap:|%bitmap16|"
        //% y_start.min=0 y_start.max=127
        //% advanced=true
        draw16Scale8(y_start:number, bitmap16:number[]) {
            if (y_start < 0) y_start = 0;
            if (y_start > 127) y_start = 127;
            let safeColumns = Math.min(128, 128 - y_start);
            let rowBuffer: Buffer = pins.createBuffer(129);
            rowBuffer[0] = 0x40;

            for (let page = 0; page < 16; page++) {
                this.sendCommand(0xb0 + page);
                this.sendCommand(y_start % 16);
                this.sendCommand(Math.floor(y_start / 16) + 0x10);

                let sourcePage = Math.floor(page / 8);
                let sourceBit = page % 8;
                let target = 1;

                for (let sourceX = 0; sourceX < 16; sourceX++) {
                    let sourceByte = bitmap16[sourcePage * 16 + sourceX];
                    let expanded = (sourceByte & (0x01 << sourceBit)) ? 0xff : 0x00;
                    for (let repeat = 0; repeat < 8; repeat++) {
                        rowBuffer[target] = expanded;
                        target++;
                    }
                }

                if (safeColumns == 128) {
                    this.sendByteBuffer(rowBuffer);
                } else {
                    let partialBuffer: Buffer = pins.createBuffer(safeColumns + 1);
                    partialBuffer[0] = 0x40;
                    for (let i = 0; i < safeColumns; i++) {
                        partialBuffer[i + 1] = rowBuffer[i + 1];
                    }
                    this.sendByteBuffer(partialBuffer);
                }
            }
        }

        /**
         * Draw only changed pixels between two 16x16 frames scaled to 128x128
         * @param y_start column to start, range from 0 to 127.
         * @param before16 previous 16x16 bitmap bytes in page-major vertical 1bpp order.
         * @param after16 next 16x16 bitmap bytes in page-major vertical 1bpp order.
         */
        //% blockId=grove_oled_draw_16_diff block="%oled|Draw 16x16 scale 8 diff at column|%y_start|, before:|%before16|after:|%after16|"
        //% y_start.min=0 y_start.max=127
        //% advanced=true
        draw16Diff(y_start:number, before16:number[], after16:number[]) {
            if (y_start < 0) y_start = 0;
            if (y_start > 127) y_start = 127;

            for (let sourceY = 0; sourceY < 16; sourceY++) {
                let sourcePage = Math.floor(sourceY / 8);
                let sourceBit = sourceY % 8;
                let sourceX = 0;

                while (sourceX < 16) {
                    let beforeByte = before16[sourcePage * 16 + sourceX];
                    let afterByte = after16[sourcePage * 16 + sourceX];
                    let beforeOn = (beforeByte & (0x01 << sourceBit)) != 0;
                    let afterOn = (afterByte & (0x01 << sourceBit)) != 0;

                    if (beforeOn == afterOn) {
                        sourceX++;
                    } else {
                        let runStart = sourceX;
                        let runValue = afterOn;
                        sourceX++;

                        while (sourceX < 16) {
                            beforeByte = before16[sourcePage * 16 + sourceX];
                            afterByte = after16[sourcePage * 16 + sourceX];
                            beforeOn = (beforeByte & (0x01 << sourceBit)) != 0;
                            afterOn = (afterByte & (0x01 << sourceBit)) != 0;
                            if (beforeOn == afterOn || afterOn != runValue) break;
                            sourceX++;
                        }

                        let oledColumn = y_start + runStart * 8;
                        let columns = (sourceX - runStart) * 8;
                        if (oledColumn < 128) {
                            if (oledColumn + columns > 128) columns = 128 - oledColumn;
                            this.sendCommand(0xb0 + sourceY);
                            this.sendCommand(oledColumn % 16);
                            this.sendCommand(Math.floor(oledColumn / 16) + 0x10);
                            this.sendRepeatedData(runValue ? 0xff : 0x00, columns);
                        }
                    }
                }
            }
        }

        private draw16Scale8Flat(y_start:number, frames16:number[], frameIndex:number) {
            if (y_start < 0) y_start = 0;
            if (y_start > 127) y_start = 127;
            let safeColumns = Math.min(128, 128 - y_start);
            let rowBuffer: Buffer = pins.createBuffer(129);
            rowBuffer[0] = 0x40;
            let frameOffset = frameIndex * 32;

            for (let page = 0; page < 16; page++) {
                this.sendCommand(0xb0 + page);
                this.sendCommand(y_start % 16);
                this.sendCommand(Math.floor(y_start / 16) + 0x10);

                let sourcePage = Math.floor(page / 8);
                let sourceBit = page % 8;
                let target = 1;

                for (let sourceX = 0; sourceX < 16; sourceX++) {
                    let sourceByte = frames16[frameOffset + sourcePage * 16 + sourceX];
                    let expanded = (sourceByte & (0x01 << sourceBit)) ? 0xff : 0x00;
                    for (let repeat = 0; repeat < 8; repeat++) {
                        rowBuffer[target] = expanded;
                        target++;
                    }
                }

                if (safeColumns == 128) {
                    this.sendByteBuffer(rowBuffer);
                } else {
                    let partialBuffer: Buffer = pins.createBuffer(safeColumns + 1);
                    partialBuffer[0] = 0x40;
                    for (let i = 0; i < safeColumns; i++) {
                        partialBuffer[i + 1] = rowBuffer[i + 1];
                    }
                    this.sendByteBuffer(partialBuffer);
                }
            }
        }

        private draw16DiffFlat(y_start:number, frames16:number[], beforeFrame:number, afterFrame:number) {
            if (y_start < 0) y_start = 0;
            if (y_start > 127) y_start = 127;
            let beforeOffset = beforeFrame * 32;
            let afterOffset = afterFrame * 32;

            for (let sourceY = 0; sourceY < 16; sourceY++) {
                let sourcePage = Math.floor(sourceY / 8);
                let sourceBit = sourceY % 8;
                let sourceX = 0;

                while (sourceX < 16) {
                    let byteOffset = sourcePage * 16 + sourceX;
                    let beforeByte = frames16[beforeOffset + byteOffset];
                    let afterByte = frames16[afterOffset + byteOffset];
                    let beforeOn = (beforeByte & (0x01 << sourceBit)) != 0;
                    let afterOn = (afterByte & (0x01 << sourceBit)) != 0;

                    if (beforeOn == afterOn) {
                        sourceX++;
                    } else {
                        let runStart = sourceX;
                        let runValue = afterOn;
                        sourceX++;

                        while (sourceX < 16) {
                            byteOffset = sourcePage * 16 + sourceX;
                            beforeByte = frames16[beforeOffset + byteOffset];
                            afterByte = frames16[afterOffset + byteOffset];
                            beforeOn = (beforeByte & (0x01 << sourceBit)) != 0;
                            afterOn = (afterByte & (0x01 << sourceBit)) != 0;
                            if (beforeOn == afterOn || afterOn != runValue) break;
                            sourceX++;
                        }

                        let oledColumn = y_start + runStart * 8;
                        let columns = (sourceX - runStart) * 8;
                        if (oledColumn < 128) {
                            if (oledColumn + columns > 128) columns = 128 - oledColumn;
                            this.sendCommand(0xb0 + sourceY);
                            this.sendCommand(oledColumn % 16);
                            this.sendCommand(Math.floor(oledColumn / 16) + 0x10);
                            this.sendRepeatedData(runValue ? 0xff : 0x00, columns);
                        }
                    }
                }
            }
        }

        /**
         * Show one 16x16 image scaled to 128x128
         * @param y_start column to start, range from 0 to 127.
         * @param bitmap16 16x16 bitmap bytes in page-major vertical 1bpp order.
         */
        //% blockId=grove_oled_show_image_16 block="%oled|Show 16x16 image at column|%y_start|, image:|%bitmap16|"
        //% y_start.min=0 y_start.max=127
        showImage16(y_start:number, bitmap16:number[]) {
            this.draw16Scale8(y_start, bitmap16);
        }

        /**
         * Show 16x16 animation scaled to 128x128 in the background
         * @param y_start column to start, range from 0 to 127.
         * @param frames16 flattened 16x16 frame bytes, 32 bytes per frame.
         * @param frameCount number of frames.
         * @param delay frame delay in milliseconds.
         */
        //% blockId=grove_oled_show_animation_16 block="%oled|Show 16x16 animation at column|%y_start|, frames:|%frames16|frame count|%frameCount|delay(ms)|%delay"
        //% y_start.min=0 y_start.max=127
        //% frameCount.min=1 frameCount.max=64
        //% delay.min=20 delay.max=5000
        showAnimation16(y_start:number, frames16:number[], frameCount:number, delay:number) {
            if (frameCount <= 0) return;
            if (delay < 20) delay = 20;
            let oled = this;
            control.inBackground(function () {
                let current = 0;
                oled.draw16Scale8Flat(y_start, frames16, 0);
                while (true) {
                    let next = (current + 1) % frameCount;
                    oled.draw16DiffFlat(y_start, frames16, current, next);
                    current = next;
                    basic.pause(delay);
                }
            });
        }

        private drawPixel(x: number, y:number, data:number) {
            if (x<0) x = 0;
            else if (x>127) x = 127;
            if (y<0) y = 0;
            else if (y>127) y = 127;
            if (data < 0) data = 0;
            else if (data > 255) data = 255;

            this.setTextXY(x/8,y);
            this.sendData(data);
        }

        /**
         * Draw a horizontal line
         * @param x  
         * @param y
         * @param len
         */
        //% blockId=grove_oled_draw_hline block="%oled|Draw horizontal line start at x|%x|and y|%y|, length|%len|"
        //% y.min=0 y.max=127
        //% x.min=0 x.max=127
        //% len.min=1 len.max=128
        drawHLine(x: number, y: number, len: number) {
            let y_max = y + len;
            if (y_max > 128) y_max = 128;
            for (let i=y;i<y_max;i++) {
                this.drawPixel(x,i,0x01<<(x%8));
            }
        }

        /**
         * Draw a vertical line
         * @param x  
         * @param y
         * @param len
         */
        //% blockId=grove_oled_draw_vline block="%oled|Draw vertical line start at x|%x|and y|%y|, length|%len|"
        //% y.min=0 y.max=127
        //% x.min=0 x.max=127
        //% len.min=1 len.max=128
        drawVLine(x: number, y: number, len: number) {
            let x_min = 0, x_max = 0;
            x_min = Math.floor((x / 8));
            x_max = x + len;
            x_min = x_min * 8;
            if (x_max > 128) x_max = 128;
            while ((x_max % 8) != 0) {
                x_max++;
            }

            let last_bit = 0xff;
            for (let i=0;i<(x_max-x-len);i++) {
                last_bit = last_bit - (0x01<<(7-i));
            }
            let first_bit = 0xff;
            for (let i=0;i<(x-x_min);i++) {
                first_bit = first_bit - (0x01<<i);
            }
            
            if (x_max - x_min > 16) {
                this.drawPixel(x_min,y,first_bit);
                for (let i=x_min+8;i<x_max-8;i=i+8){
                    this.drawPixel(i,y,0xff);
                }
                this.drawPixel(x_max-1,y,last_bit);
            }
            else if (x_max - x_min == 16) {
                this.drawPixel(x_min,y,first_bit);
                this.drawPixel(x_max-1,y,last_bit);
            }
            else {
                this.drawPixel(x_min,y,(first_bit & last_bit));
            }
        }

        /**
         * Draw a rectangle
         * @param x1  
         * @param y1
         * @param x2
         * @param y2
         */
        //% blockId=grove_oled_draw_rec block="%oled|Draw a rectangle start at x|%x1|and y|%y1|, end at x|%x2|and y|%y2|"
        //% y1.min=0 y1.max=127
        //% x1.min=0 x1.max=127
        //% y2.min=0 y2.max=127
        //% x2.min=0 x2.max=127
        drawRec(x1: number, y1: number, x2:number, y2:number) {
            let temp = 0;
            if (y2<y1) {
                temp = y2;
                y2 = y1;
                y1 = temp;
            }
            if (x2<x1) {
                temp = x2;
                x2 = x1;
                x1 = temp;
            }

            this.drawHLine(x1,y1,y2-y1+1);
            this.drawHLine(x2,y1,y2-y1+1);
            this.drawVLine(x1,y1,x2-x1+1);
            this.drawVLine(x1,y2,x2-x1+1);

        }
    }

}
