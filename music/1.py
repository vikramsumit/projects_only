from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# Step 1: Setup Chrome
options = Options()
options.add_argument("--start-maximized")   # Open browser in full size
options.add_argument("--disable-notifications")  # Disable popups

# Step 2: Launch Chrome using WebDriver Manager (auto handles chromedriver)
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# Step 3: Open JioMart checkout review page
driver.get("https://www.jiomart.com/checkout/review")

try:
    # Step 4: Wait for "Make Payment" button and click it
    make_payment_button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.XPATH, "//div[contains(text(),'Make Payment')]"))
    )
    make_payment_button.click()
    print("✅ Clicked 'Make Payment' – redirecting to Payment Gateway...")

except Exception as e:
    print("❌ Could not click 'Make Payment':", e)

# Keep browser open so you can finish payment manually
input("Press Enter to close browser...")  
driver.quit()
