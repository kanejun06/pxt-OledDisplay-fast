let oled = groveoleddisplay.createOled()
let testFrame = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
]

oled.setBankAnimationFrame(1, 1, testFrame)
oled.showBankAnimationFrame(1, 1)
oled.playBankAnimation(1, 1, 1)
oled.clearScreen()
