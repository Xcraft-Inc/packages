# GamePi13

## st7789

### How it works

```
   R      G      B   → BYTE SWAP

b00000 000 000 00000   BLACK
x   0    0     0   0 → 0x0000

b11111 111 111 11111   WHITE
x   F    F     F   F → 0xFFFF

b11111 000 000 00000   RED
x   F    8     0   0 → 0x00F8

b00000 111 111 00000   GREEN
x   0    7     E   0 → 0xE007

b00000 000 000 11111   BLUE
x   0    0     1   F → 0x1F00

b11111 111 111 00000   YELLOW
x   F    F     E   0 → 0xE0FF

b11111 000 000 11111   MAGENTA
x   F    8     1   F → 0x1FF8

b00000 111 111 11111   CYAN
x   0    7     F   F → 0xFF07
```

### Shell script

```sh
#!/bin/sh

FB="/dev/fb2"
PIXELS=57600

# Convert RGB → RGB565 swapped
rgb() {
    R=$1; G=$2; B=$3
    R5=$((R>>3)); G6=$((G>>2)); B5=$((B>>3))
    VAL=$(( (R5<<11) | (G6<<5) | B5 ))
    printf "%02x%02x" $((VAL&0xFF)) $((VAL>>8))
}

# Draw a color
show() {
    NAME=$1; R=$2; G=$3; B=$4
    HEX=$(rgb $R $G $B)
    echo "=== $NAME (RGB: $R,$G,$B) → 0x$HEX ==="
    yes "$HEX" | head -n $PIXELS | xxd -r -p > $FB
    sleep 1
}

# De-blank
echo 0 > /sys/class/graphics/fb2/blank 2>/dev/null

# Demo
show "NOIR"      0   0   0
show "ROUGE"     255 0   0
show "VERT"      0   255 0
show "BLEU"      0   0   255
show "JAUNE"     255 255 0
show "CYAN"      0   255 255
show "MAGENTA"   255 0   255
show "ORANGE"    255 128 0
show "ROSE"      255 192 203
show "VIOLET"    128 0   255
show "BLANC"     255 255 255
show "GRIS"      128 128 128
```
