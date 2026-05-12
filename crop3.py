import sys
from PIL import Image

input_path = "pp2.jpg"
output_path = "hero-headshot.webp"

try:
    img = Image.open(input_path)
    width, height = img.size
    print(f"Original size: {width}x{height}")
    
    # We want to crop slightly to center the face, but shifted LEFT
    # Left crop: 5%
    # Right crop: 15% 
    # Top/Bottom: 10%
    left = int(width * 0.05)
    top = int(height * 0.10)
    right = int(width * 0.85)
    bottom = int(height * 0.90)
    
    cropped_img = img.crop((left, top, right, bottom))
    
    # Resize to standard size
    cropped_img.thumbnail((800, 800))
    
    cropped_img.save(output_path, "WEBP", quality=90)
    print(f"Successfully shifted left and cropped to {cropped_img.size[0]}x{cropped_img.size[1]}")
    
except Exception as e:
    print(f"Error: {e}")
