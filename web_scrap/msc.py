from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Set ChromeDriver Path
chrome_driver_path = r"C:\chromedriver\chromedriver-win64\chromedriver.exe"

# Start WebDriver
service = Service(chrome_driver_path)
driver = webdriver.Chrome(service=service)

# Open the Marksheet Website
url = "https://lu.indiaexaminfo.co.in/result_patliputra.aspx"
driver.get(url)

# Initialize WebDriverWait
wait = WebDriverWait(driver, 10)

# Select Session
session_dropdown = Select(wait.until(EC.presence_of_element_located((By.ID, "lstYr"))))
session_dropdown.select_by_value("SEMESTER(2023-25)")

# Select Exam Type
exam_type_dropdown = Select(driver.find_element(By.ID, "lstCrs"))
exam_type_dropdown.select_by_visible_text("PG (Regular)")

# Select Course
course_dropdown = Select(driver.find_element(By.ID, "lstSem"))
course_dropdown.select_by_visible_text("SEM-1")

# Loop Through Roll Numbers
for roll in range(2420191070001, 2420191070061):
    try:
        print(f"Fetching marksheet for Roll No: {roll}")

        # Enter Roll Number
        roll_input = wait.until(EC.presence_of_element_located((By.ID, "txtRoll")))
        roll_input.clear()
        roll_input.send_keys(str(roll))

        # Click "Show Marksheet"
        button = wait.until(EC.element_to_be_clickable((By.ID, "cmdOK")))
        driver.execute_script("arguments[0].click();", button)

        # Wait for Marksheet to Load
        time.sleep(10)

        # Locate and Click the Download Button inside Shadow DOM
        wait.until(EC.frame_to_be_available_and_switch_to_it((By.TAG_NAME, "iframe")))

        # **Locate and Click the Download Button inside Shadow DOM**
        shadow_host = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "downloads-manager")))
        shadow_root = driver.execute_script("return arguments[0].shadowRoot", shadow_host)
        toolbar = shadow_root.find_element(By.CSS_SELECTOR, "cr-toolbar")
        toolbar_shadow = driver.execute_script("return arguments[0].shadowRoot", toolbar)
        download_button = toolbar_shadow.find_element(By.CSS_SELECTOR, "cr-toolbar [id='download']")
        
        # **Click Download Button**
        driver.execute_script("arguments[0].click();", download_button)

        print(f"Downloaded: result_{roll}.pdf")

        # **Switch back to default content**
        driver.switch_to.default_content()
        # Reset Page for Next Roll Number
        driver.get(url)
        time.sleep(5)

    except Exception as e:
        print(f"Error processing Roll No. {roll}: {e}")

# Quit Browser After Completion
driver.quit()
print("✅ All marksheets downloaded successfully!")
