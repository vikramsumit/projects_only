from PIL import Image, ImageFont, ImageDraw
from escpos.printer import Usb

# Update these IDs for your printer (use lsusb on Linux to find vendor/product id)
VENDOR_ID = 0x04b8   # example Epson vendor id
PRODUCT_ID = 0x0202  # example product id

def generate_receipt_image(data):
    """Generate receipt as a PIL image"""
    W, H = 384, 800  # typical thermal paper width is 384 pixels for 58mm printers
    img = Image.new("L", (W,H), 255)
    draw = ImageDraw.Draw(img)
    font = ImageFont.load_default()

    y = 5
    draw.text((10,y), "BATCH REPORT", font=font)
    y += 20

    for k in ["BATCH NO","MACH ID","TIME","DATE","AGGT10mm","AGGT20mm","AGGT30mm",
              "CEMT01","CEMT02","SAND01","SAND02","WATER","ADDITIVE","TOTAL WT","CUM"]:
        v = data.get(k,"")
        draw.text((10,y), f"{k:12} : {v}", font=font)
        y += 18

    return img

def print_receipt_escpos(data):
    """Send receipt image to USB ESC/POS printer"""
    img = generate_receipt_image(data)
    p = Usb(VENDOR_ID, PRODUCT_ID, timeout=0, in_ep=0x82, out_ep=0x01)
    p._raw(b'\x1b@\n')  # init
    p.image(img.convert("1"))
    p.text("\n\n")
    p.cut()

def save_receipt_pdf(data, filename="receipt.pdf"):
    """Save receipt image as a PDF"""
    img = generate_receipt_image(data)
    img.save(filename, "PDF")

if __name__ == "__main__":
    demo = {
        "BATCH NO": "* 2078",
        "MACH ID": "06652",
        "TIME": "07:20 PM",
        "DATE": "27-08-25",
        "AGGT10mm": "0000 Kgs",
        "AGGT20mm": "3120 Kgs",
        "CEMT01": "1000 Kgs",
        "SAND01": "1525 Kgs",
        "WATER": "522 Ltrs",
        "TOTAL WT": "6167.00 Kgs",
        "CUM": "000002.56"
    }

    # Save as PDF
    save_receipt_pdf(demo, "receipt.pdf")

    # OR print directly (if printer connected)
    # print_receipt_escpos(demo)
