from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import time

# ✅ Set ChromeDriver Path
chrome_driver_path = r"C:\chromedriver\chromedriver-win64\chromedriver.exe"

# ✅ Folder to Save Screenshots
# save_folder = "Patliputra_Results"
# os.makedirs(save_folder, exist_ok=True)

# ✅ Start WebDriver
service = Service(chrome_driver_path)
driver = webdriver.Chrome(service=service)

# ✅ Open the Marksheet Website
url = "https://lu.indiaexaminfo.co.in/result_patliputra.aspx"
driver.get(url)

# ✅ Initialize WebDriverWait
wait = WebDriverWait(driver, 10)

# ✅ Select Session
session_dropdown = Select(wait.until(EC.presence_of_element_located((By.ID, "lstYr"))))
session_dropdown.select_by_value("SEMESTER(2023-25)")

# ✅ Select Exam Type
exam_type_dropdown = Select(driver.find_element(By.ID, "lstCrs"))
exam_type_dropdown.select_by_visible_text("PG (Regular)")

# ✅ Select Course
course_dropdown = Select(driver.find_element(By.ID, "lstSem"))
course_dropdown.select_by_visible_text("SEM-1")

# ✅ Loop Through Roll Numbers
for roll in range(2420191070001, 2420191070061):
    driver.get(url)
    
    try:
        print(f"Fetching marksheet for Roll No: {roll}")

        # ✅ Enter Roll Number
        roll_input = wait.until(EC.presence_of_element_located((By.ID, "txtRoll")))
        roll_input.clear()
        roll_input.send_keys(str(roll))

        # ✅ Click "Show Marksheet"
        # driver.find_element(By.ID, "cmdOK").click()
        # ✅ Wait until the "Show Marksheet" button is clickable and then click it
        button = wait.until(EC.element_to_be_clickable((By.ID, "cmdOK")))
        # button.click()
        driver.execute_script("arguments[0].click();", button)

        # button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "cmdOK")))
        # button.click()

        # ✅ Wait for Marksheet to Load
        time.sleep(10)

        # ✅ Save as PDF
        # driver.execute_script("window.print();")
        # print(f"Saved: {os.path.join(save_folder, f'result_{roll}.pdf')}")
        
        time.sleep(10)
        button2 = wait.until(EC.element_to_be_clickable((By.ID, "baseSvg")))
        # driver.find_element(By.ID, "baseSvg").click()
        driver.execute_script("arguments[0].click();", button2)

    except Exception as e:
        print(f"Error processing Roll No. {roll}: {e}")

# ✅ Quit Browser After Completion
driver.quit()
print("✅ All marksheets downloaded successfully!")

# for roll in range(2420191070001, 2420191070061):
#     try:
#         print(f"Fetching marksheet for Roll No: {roll}")

#         # ✅ Refresh Page to Reset Form
#         driver.refresh()
#         time.sleep(2)  # Wait for the page to reload

#         # ✅ Enter Roll Number
#         roll_input = wait.until(EC.presence_of_element_located((By.ID, "txtRoll")))
#         roll_input.clear()
#         roll_input.send_keys(str(roll))

#         # ✅ Click "Show Marksheet"
#         button = wait.until(EC.element_to_be_clickable((By.ID, "cmdOK")))
#         button.click()

#         # ✅ Wait for Marksheet to Load
#         time.sleep(5)

#         # ✅ Take Screenshot Instead of Printing
#         screenshot_path = os.path.join(save_folder, f"marksheet_{roll}.png")
#         driver.save_screenshot(screenshot_path)
#         print(f"✅ Screenshot Saved: {screenshot_path}")

#     except Exception as e:
#         print(f"❌ Error processing Roll No. {roll}: {e}")

# # ✅ Quit Browser After Completion
# driver.quit()
# print("✅ All marksheets downloaded successfully!")
