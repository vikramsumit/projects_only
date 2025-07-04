import os
from PyPDF2 import PdfReader, PdfWriter

def extract_pages(input_path, page_range, specific_pages, output_path):
    reader = PdfReader(input_path)
    writer = PdfWriter()
    total_pages = len(reader.pages)

    # Combine and deduplicate pages to extract
    pages_to_extract = set()

    # Add range pages
    if page_range:
        start, end = page_range
        if start < 1 or end > total_pages or start > end:
            raise ValueError(f"Range must be within 1 and {total_pages}, and start <= end")
        pages_to_extract.update(range(start - 1, end))

    # Add specific pages
    for page in specific_pages:
        if 1 <= page <= total_pages:
            pages_to_extract.add(page - 1)
        else:
            print(f"Warning: page {page} is out of range. Skipped.")

    # Sort the pages before writing
    for p in sorted(pages_to_extract):
        writer.add_page(reader.pages[p])

    with open(output_path, "wb") as f_out:
        writer.write(f_out)

    print(f"Extracted pages saved to '{output_path}'.")

if __name__ == "__main__":
    input_pdf = "/home/raju/code only/projects_only/pdf_scrap/pdf_env/BTECHIT.pdf"

    # --- User Inputs ---
    specific = input("Enter specific pages separated by comma (e.g., 1,7,10): ").strip()
    page_range = input("Enter range (e.g., 2-5), or leave blank: ").strip()

    # Parse inputs
    page_range_tuple = None
    if page_range:
        try:
            start, end = map(int, page_range.split('-'))
            page_range_tuple = (start, end)
        except:
            print("Invalid range format. Use start-end (e.g., 3-6).")
            exit(1)

    specific_pages = []
    if specific:
        try:
            specific_pages = [int(x.strip()) for x in specific.split(',') if x.strip()]
        except:
            print("Invalid specific pages. Use comma-separated numbers (e.g., 1,4,7).")
            exit(1)

    output_file = "extracted_custom.pdf"

    if not os.path.exists(input_pdf):
        print(f"File '{input_pdf}' not found.")
        exit(1)

    try:
        extract_pages(input_pdf, page_range_tuple, specific_pages, output_file)
    except Exception as e:
        print("Error:", e)
