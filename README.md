# Grove - Oled Display Fast

This is a classroom-oriented fork of the MakeCode Grove - Oled Display(SH1107) package for micro:bit.

It keeps the original API and adds faster helpers for bitmap-heavy lessons:

- `clearDisplayFast()`
- `createOledFast()`
- `drawBitmapFast(row, column, rows, columns, bitmap)`
- `draw16Scale8(column, bitmap16)`
- `draw16Diff(column, before16, after16)`
- `showImage16(column, bitmap16)`
- `showAnimation16(column, frames16, frameCount, delay)`
- `drawBitmap16Scale8Fast(column, bitmap16)` as an alias

The fast bitmap helper sends several data bytes in one I2C write instead of resetting the OLED address for every byte.
Version 0.0.9 makes `showAnimation16()` run directly instead of using a background fiber.

For a full 128x128 image, use 16 page rows and 128 columns:

```typescript
let oled = groveoleddisplay.createOled()
oled.drawBitmapFast(0, 0, 16, 128, bitmap128)
```

For a 16x16 image scaled to 128x128, paste only the 32-byte source bitmap:

```typescript
let oled = groveoleddisplay.createOled()
oled.draw16Scale8(0, bitmap16)
```

![image](https://user-images.githubusercontent.com/18615354/47497569-1b9c0c00-d88d-11e8-98fb-06a9d1d6b7a3.png)

## Usage

### Connect

Simply connect Grove - Oled Display(SH1107) to the I2C port of Grove shiled, as the picture shown.

### Demo 1: Display numbers and strings

Let's start with a very simple program:

![](https://user-images.githubusercontent.com/18615354/47498729-b21dfc80-d890-11e8-8801-a08ebe25e58b.png)

- In this program, the second line `set oled to Create Oled Display` means we will create an object to use Oled Display, this step is important and nessary.
- Line `oled Clear display` means the display will be clear. This step is recommanded at the begin of a program.
- Line `oled Set display position at row 0 and column 0` is very useful. We can use this before `Display string` or `Dispaly integer number`, to set our display position. Note that there are 16 row and 128 column in Grove Oled Display, and `row 0, column 0` is at the upper left corner.

    ![image](https://user-images.githubusercontent.com/18615354/47498459-ec3ace80-d88f-11e8-96e3-3d4ccea0635e.png)

- Line `oled Display string "Hello!"` is to display a string "Hello!"

Try to download the program to your Microbit! Then you will find "Hello!" on the display. Now let's try a big program like this, and guess what will happen:

![image](https://user-images.githubusercontent.com/18615354/47500303-062ae000-d895-11e8-81d5-8d92c8e09509.png)


### Demo 2: Draw lines and rectangle

Let's draw 2 lines first:

![image](https://user-images.githubusercontent.com/18615354/47500608-d29c8580-d895-11e8-92be-66545c881f84.png)

- `oled Draw horizontal line start at x 0 and y 0, length 128` means draw a horizontal line. Please check the second picture of Demo 1, it also indicates the XY axis.


And draw a rectange by giving 2 XY coordinates.

![](https://user-images.githubusercontent.com/18615354/47501286-b4d02000-d897-11e8-9a52-a1eb826ba81a.png)


## License
MIT
