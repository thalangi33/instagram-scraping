from gettext import find
from logging import exception
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import NoSuchElementException    
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import random
from actions import *

USERNAME = "ljohn3629@gmail.com"
PASSWORD = "thisisjohnny508"

# setup the driver
driver = setup_driver()

# login to instagram
login_instagram(driver, USERNAME, PASSWORD)

# check if save_your_login_info notification exists
check_save_login_info_noti(driver)

# if presentation exist -> notifications
cancel_notificaition(driver)

cross_add_to_home(driver)

activity_pause(driver)