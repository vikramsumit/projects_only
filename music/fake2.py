from PIL import Image, ImageDraw, ImageFont
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import os, datetime

# Config
OUT_DIR = "out"
os.makedirs(OUT_DIR, exist_ok=True)

# Try to use a monospace font; fallback to default
def load_font(size):
    candidates = [
        "/usr/share/fonts/truetype/msttcorefonts/Courier_New.ttf",  # Courier New
        "/usr/share/fonts/truetype/msttcorefonts/consola.ttf",      # Consolas
        os.path.expanduser("~/.local/share/fonts/OCRA.ttf"),        # OCR-A manual install
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",      # fallback
        "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf",
    ]
    for p in candidates:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def generate_receipt_image(data, out_png):
    W, H = 600, 900
    bg = (255,255,255)
    img = Image.new("RGB", (W,H), bg)
    draw = ImageDraw.Draw(img)
    f_title = load_font(36)
    f_label = load_font(30)
    f_val   = load_font(30)

    y = 20
    # Title centered
    title = "BATCH REPORT"
    bbox = draw.textbbox((0,0), title, font=f_title)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((W-w)/2, y), title, font=f_title, fill=(0,0,0))
    y += 60

    # rows
    left_x = 20
    colon_x = 260
    value_x = 300
    line_h = 42

    for key in ["BATCH NO", "MACH ID", "TIME", "DATE",
                "AGGT10mm", "AGGT20mm",
                "CEMT01", "CEMT02", "SAND01", "SAND02",
                "WATER", "ADDITIVE", "TOTAL WT", "CUM"]:
        label = key.replace("AGGT10mm","AGGT 10mm").replace("AGGT20mm","AGGT 20mm").replace("AGGT30mm","AGGT 30mm")
        value = data.get(key, "")
        draw.text((left_x, y), label, font=f_label, fill=(0,0,0))
        draw.text((colon_x, y), ":", font=f_label, fill=(0,0,0))
        draw.text((value_x, y), str(value), font=f_val, fill=(0,0,0))
        y += line_h

    # footer
    # footer = "SAMPLE - NOT FOR OFFICIAL USE"
    # bbox = draw.textbbox((0,0), footer, font=f_label)
    # wf, hf = bbox[2] - bbox[0], bbox[3] - bbox[1]
    # draw.text(((W-wf)/2, H-60), footer, font=f_label, fill=(150,150,150))

    img.save(out_png, "PNG")
    print("Saved:", out_png)
    return out_png

def generate_pdf_from_png(png_path, pdf_path):
    c = canvas.Canvas(pdf_path, pagesize=letter)
    # scale image to page
    c.drawImage(png_path, 60, 120, width=480, preserveAspectRatio=True, mask='auto')
    c.showPage()
    c.save()
    print("Saved PDF:", pdf_path)

if __name__ == "__main__":
    data = {
        "BATCH NO": "* 2079",
        "MACH ID": "06652",
        "TIME": datetime.datetime.now().strftime("%I:%M %p"),
        "DATE": datetime.date.today().strftime("%d-%m-%y"),
        "AGGT10mm": "0000 Kgs",
        "AGGT20mm": "3120 Kgs",
        "AGGT30mm": "0000 Kgs",
        "CEMT01": "1000 Kgs",
        "CEMT02": "0000 Kgs",
        "SAND01": "1525 Kgs",
        "SAND02": "0000 Kgs",
        "WATER": "522 Ltrs",
        "ADDITIVE": "00.00 Ltrs",
        "TOTAL WT": "6167.00 Kgs",
        "CUM": "000002.56"
    }
    data = {
        "BATCH NO": "*2078",
        "MACH ID": "6652",
        "TIME": "07:20 PM",
        "DATE": "27-08-25",
        "AGGT10mm": "0000 Kgs",
        "AGGT20mm": "3120 Kgs",
        "CEMT01": "1000 Kgs",
        "CEMT02": "0000 Kgs",
        "SAND01": "1525 Kgs",
        "SAND02": "0000 Kgs",
        "WATER": "522 Ltrs",
        "ADDITIVE": "00.00 Ltrs",
        "TOTAL WT": "00.6167.00 Kgs",
        "CUM": "000002.56"
    }

    base_name = f"batch_{data['BATCH NO'].strip().replace('*','')}"
    png_path = os.path.join(OUT_DIR, base_name + ".png")
    pdf_path = os.path.join(OUT_DIR, base_name + ".pdf")

    # Generate both
    generate_receipt_image(data, png_path)
    generate_pdf_from_png(png_path, pdf_path)

