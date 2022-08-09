from gettext import find
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
import json, os

def find_avaiable_user(dirname):
    POINT = 0
    path_f1 = os.path.relpath(".\\info\\accounts.txt", dirname)

    with open(path_f1, "r+") as f1:
        contents = f1.read()
        json_info = json.loads(contents)
        user_account = json_info["users"]

        for user in user_account:
            if user["status"] == "online":
                username = user["username"]
                password = user["password"]
                break

    return username, password

# moving the current user from the end of the list after logging out
def put_user_end(username, dirname):
    path_f1 = os.path.relpath(".\\info\\accounts.txt", dirname)

    with open(path_f1, "r+") as f1:
        contents = f1.read()
        json_info = json.loads(contents)
        user_account = json_info["users"]

        # finding user info with same username
        for idx, user in enumerate(user_account):
            if user["username"] == username:
                POINT = idx
                break
        
        # moving the current user to the end of the list
        temp = user_account.pop(POINT)
        user_account.append(temp)
        json_info["users"] = user_account
        f1.truncate(0)

    with open(path_f1, "r+") as f1:
        temp_string = json.dumps(json_info, indent=4)
        f1.write(temp_string)

def change_status_banned(username, dirname):
    path_f1 = os.path.relpath(".\\info\\accounts.txt", dirname)

    with open(path_f1, "r+") as f1:
        contents = f1.read()
        json_info = json.loads(contents)
        user_account = json_info["users"]

        for idx, user in enumerate(user_account):
            if user["username"] == username:
                user["status"] = "banned"
                break
        
        json_info["users"] = user_account
        f1.truncate(0)

        with open(path_f1, "r+") as f1:
            temp_string = json.dumps(json_info, indent=4)
            f1.write(temp_string)

def setup_driver():
    opts = Options()
    opts.page_load_strategy = 'none'
    opts.add_argument("user-agent=Mozilla/5.0 (Linux; Android 10; X2-HT Build/QP1A.191005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.101 Mobile Safari/537.36 Instagram 191.1.0.41.124 Android (29/10; 480dpi; 1080x1920; HTC/htc; X2-HT; htc_ocla1_sprout")

    PATH = "C:\Program Files (x86)\chromedriver.exe"
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=opts)
    return driver

def login_instagram(driver, bot_username, bot_password):
    driver.get("https://www.instagram.com/")
    time.sleep(random.uniform(3,5))
    try:
        login = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/section/main/article/div/div/div[2]/div[3]/button[1]")))
        print("Login page is ready!")
    except TimeoutException:
        print("Login page took too much time to load!")
    login.click()

    driver.implicitly_wait(2)

    username = driver.find_element(By.XPATH, "/html/body/div[1]/section/main/article/div/div/div[2]/form/div[1]/div[3]/div/label/input")
    username_string = bot_username

    # typing username
    for letter in username_string:
        username.send_keys(letter)
        time.sleep(random.uniform(0,0.5))

    time.sleep(1)

    password = driver.find_element(By.XPATH, "/html/body/div[1]/section/main/article/div/div/div[2]/form/div[1]/div[4]/div/label/input")
    password_string = bot_password

    time.sleep(1)

    # typing password
    for letter in password_string:
        password.send_keys(letter)
        time.sleep(random.uniform(0,0.5))

    time.sleep(1)    

    # clicking login button
    login = driver.find_elements(By.CLASS_NAME, "sqdOP.L3NKy.y3zKF")[1]
    time.sleep(random.uniform(0,0.5))
    login.click()

    time.sleep(random.uniform(5,6))

def check_save_login_info_noti(driver):
    try:
        not_now = driver.find_element(By.XPATH, "/html/body/div[1]/section/main/div/div/div/button")
        time.sleep(random.uniform(1,3))
        not_now.click()
    except NoSuchElementException:
        print("No check_save_login_info notification")
        return False
    return True

def add_insta_to_home_screen(driver):
    try:
        cancel = driver.find_element(By.XPATH, "/html/body/div[4]/div/div/div/div/div[3]/button[2]")
        time.sleep(random.uniform(0.5,2))
        cancel.click()
    except NoSuchElementException:
        print("No check_save_login_info notification")
        return False
    return True

def turn_on_notification(driver):
    try:
        cancel = driver.find_element(By.XPATH, "/html/body/div[5]/div/div/div/div/div[3]/button[2]")
        cancel.click()
    except NoSuchElementException:
        print("No turn_on_notification")
        return False
    return True

def going_to_homepage(driver):
    homepage = WebDriverWait(driver, 3).until(EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/nav/div/div/div/div/div/div[1]/a")))
    homepage.click()
    print("Going to homepage!")

def click_explore_section(driver):
    explore = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/nav/div/div/div/div/div/div[2]/a")))
    explore.click()
    print("Going to explore_section!")

def activity_section_click(driver):
    activity = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/nav/div/div/div/div/div/div[4]/a")))
    activity.click()
    print("Going to activity_section!")

def cancel_notificaition(driver):
    try:
        while driver.find_element(By.XPATH, "/html/body/div[5]/div"):
            # click cancel for add Instagram to your Home screen
            add_insta_to_home_screen(driver)
            # forgot what notification
            turn_on_notification(driver)
    except NoSuchElementException:
        print("No presentation")

def cross_add_to_home(driver):
    cross = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/div[2]/div/div[1]/button")))
    cross.click()
    print("Cross the bar!")

def scrolling(driver, load_num):
    SCROLL_PAUSE_TIME = 5

    # Get scroll height
    last_height = driver.execute_script("return document.body.scrollHeight")
    total_height = 0
    count_load = 1

    while True:
        # get random height
        random_height = random.randint(300, 500)
        total_height = total_height + random_height
        # scroll the random height
        driver.execute_script("window.scrollBy(0, arguments[0]);", random_height)
        last_height = driver.execute_script("return document.body.scrollHeight")
        time.sleep(1)

        print("This is total_height: {}".format(total_height))
        print("This is last height: {}".format(last_height))

        # if scroll down to the bottom of the page
        if total_height >= last_height:
            # Wait to load page
            time.sleep(SCROLL_PAUSE_TIME)
            total_height = last_height
            print("This is total_height after arriving to bottom height: {}".format(total_height))
            print("This is last height after arriving to bottom height: {}".format(last_height))

            # Calculate new scroll height and compare with last scroll height
            new_height = driver.execute_script("return document.body.scrollHeight")
            print("This is new height: {}".format(new_height))
            if new_height == last_height:
                print("Finished scrolling to the end")
                break
            if count_load == load_num:
                print("Finished scrolling {} times".format(load_num))
                break
            last_height = new_height
            count_load = count_load + 1

def homepage_scrolling(driver, load_num):
    going_to_homepage(driver)
    scrolling(driver, load_num)
    going_to_homepage(driver)

def explore_scrolling(driver, load_num):
    click_explore_section(driver)
    scrolling(driver, load_num)
    going_to_homepage(driver)

def saving_random_post_explore(driver, load_num):
    click_explore_section(driver)
    # finding a random post to scroll down to
    try:
        random_post = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/div[1]/div/div[{}]/div[{}]/div/a/div[1]/div[2]".format(random.randint(1,4), random.randint(1,5)))))
        driver.execute_script("arguments[0].scrollIntoView();", random_post)
        time.sleep(2)
        random_post.click()
        print("Clicking on a random post!")
    except TimeoutException:
        print("Clicking on a random post took too long!")

    # finding the number of avaliable save buttons >> available posts
    try:
        save_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "div > button._abl- > div._abm0 > svg._ab6-")))
        time.sleep(random.uniform(5,7))
        save_button = driver.find_elements(By.CSS_SELECTOR, "div > button._abl- > div._abm0 > svg._ab6-")
        random_num = random.randint(1, len(save_button))
        print("This is the random num: {}".format(random_num))
        print("1 This is the number of save_button: {}".format(len(save_button)))
    except TimeoutException:
        print("Too long to find the number of post!")

    # scrolling to the chosen posts and saving it
    try:
        for i in range(0, load_num):    
            random_post = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/section/div[1]/div/article[{}]".format(random_num))))
            driver.execute_script("arguments[0].scrollIntoView();", random_post)
            location = save_button[random_num - 1].location.get("y")
            driver.execute_script("window.scrollTo(0, arguments[0]);", location)

            if random.randint(1, 2) == 1:
                save_button[random_num - 1].click()
            time.sleep(3)

            save_button = driver.find_elements(By.CSS_SELECTOR, "div > button._abl- > div._abm0 > svg._ab6-")
            random_num = random.randint(len(save_button) - 3, len(save_button) - 1)

            print("This is the random num: {}".format(random_num))
            print("2 This is the number of save_button: {}".format(len(save_button)))
            print("This is {} times scrolled".format(i))
    except TimeoutException:
        print("Too long to load different posts!")
    
    going_to_homepage(driver)

def direct_message(driver, sendee_string):
    driver.get("https://www.instagram.com/direct/inbox/")
    time.sleep(1)
    driver.get("https://www.instagram.com/direct/new/")

    sendee = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/div/section/div[2]/div/div[1]/div/div[2]/input")))
    sendee.click()

    time.sleep(2)

    for letter in sendee_string:
            sendee.send_keys(letter)
            time.sleep(random.uniform(0,0.5))

    time.sleep(1)

    driver.get("https://www.instagram.com/")

def activity_pause(driver):
    activity_section_click(driver)
    time.sleep(5)
    driver.get("https://www.instagram.com/explore/people/")
    print("Going to the people suggestion")
    time.sleep(5)
    going_to_homepage(driver)

def going_to_profile_page(driver):
    profile = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/nav/div/div/div/div/div/div[5]/a")))
    profile.click()
    time.sleep(random.uniform(1,3))

def posts_click(driver):
    posts = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/div[1]/a[1]")))
    posts.click()

def feeds_click(driver):
    feeds = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/div[1]/a[2]")))
    feeds.click()

def saved_click(driver):
    saved = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/div[1]/a[3]")))
    saved.click()

def tagged_click(driver):
    tagged = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/div[1]/a[4]")))
    tagged.click()

def profile_page_actions(driver, loop_times):
    # array of tab_click fucntions
    tabs_profile = (posts_click, feeds_click, saved_click, tagged_click)

    # going to profile_page
    going_to_profile_page(driver)

    # looping the profile tabs for loop_times
    for i in range(0, loop_times + 1):
        random_tab = random.randint(0,3)
        tabs_profile[random_tab](driver)
        time.sleep(random.uniform(1,3))

    # if saved_tab is chosen, scroll it
        if random_tab == 2:
            scrolling(driver, 5)
            going_to_profile_page(driver)
    
    going_to_homepage(driver)

random_actions = (
    homepage_scrolling, 
    explore_scrolling, 
    saving_random_post_explore, 
    direct_message, 
    activity_pause, 
    profile_page_actions
)

random_string = ["apple", "orange", "banana"]

def random_actions_selector(driver):
    # choose a random action
    random_actions_num = random.randint(0, 5)

    # parameters for different actions
    if random_actions_num == 0:
        random_actions[random_actions_num](driver, random.randint(1,3))
    elif random_actions_num == 1:
        random_actions[random_actions_num](driver, random.randint(1,3))
    elif random_actions_num == 2:
        random_actions[random_actions_num](driver, random.randint(1,3))
    elif random_actions_num == 3:
        random_actions[random_actions_num](driver, random_string[random.randint(0,2)])
    elif random_actions_num == 4:
        random_actions[random_actions_num](driver)
    elif random_actions_num == 5:
        random_actions[random_actions_num](driver, random.randint(1,3))

    # if presentation found when going to homepage, press cancel
    cancel_notificaition(driver)

# create new tab (only 2 tabs in total, cannot add)
def create_new_tab(driver):
    tab_1 = driver.window_handles[0]
    driver.execute_script("window.open('about:blank', 'tab2');")
    tab_2 = driver.window_handles[1]
    driver.switch_to.window(tab_2)
    driver.execute_script("window.stop();")
    driver.get("https://www.instagram.com/")
    time.sleep(random.uniform(5,6))
    cancel_notificaition(driver)

    return tab_1, tab_2