from PIL import Image
try:
    img = Image.open('src/assets/magnifier-icon3.png').convert('RGBA')
    w, h = img.size
    alpha = img.split()[3]
    
    min_x, min_y, max_x, max_y = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            if alpha.getpixel((x, y)) < 50:
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
                found = True
    if found:
        print(f"Transparent bounds: {min_x}, {min_y}, {max_x}, {max_y}")
        print(f"Percentage: Left={min_x/w*100:.2f}%, Top={min_y/h*100:.2f}%, SizeW={(max_x - min_x)/w*100:.2f}%, SizeH={(max_y - min_y)/h*100:.2f}%")
    else:
        print("No transparent area found.")
except Exception as e:
    print(f"Error: {e}")
