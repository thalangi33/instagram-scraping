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

def setup_driver():
    opts = Options()
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
        time.sleep(2)
        driver.execute_script("arguments[0].scrollIntoView();", random_post)
        time.sleep(2)
        random_post.click()
        print("Clicking on a random post!")
    except TimeoutException:
        print("Clicking on a random post took too long!")

    # finding the number of avaliable save buttons >> available posts
    try:
        save_button = WebDriverWait(driver, 3).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "div > button._abl- > div._abm0 > svg._ab6-:nth-child(1)")))
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
            time.sleep(3)

            driver.execute_script("window.scrollTo(0, arguments[0]);", save_button[random_num - 1].location.get("y"))
            time.sleep(3)

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

# USERNAME = "ljohn3629@gmail.com"
# PASSWORD = "thisisjohnny508"

# # setup the driver
# driver = setup_driver()

# # login to instagram
# login_instagram(driver, USERNAME, PASSWORD)

# # check if save_your_login_info notification exists
# check_save_login_info_noti(driver)

# # if presentation exist -> notifications
# try:
#     while driver.find_element(By.XPATH, "/html/body/div[5]/div"):
#         # click cancel for add Instagram to your Home screen
#         add_insta_to_home_screen(driver)
#         # forgot what notification
#         turn_on_notification(driver)
# except NoSuchElementException:
#     print("No presentation")

# # clicking on explore section
# # try:
# # time.sleep()
# # explore_section = driver.find_element(By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/nav[2]/div/div/div/div/div/div[2]/a/div[2]")
# # explore_section.click()

# cross = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/div[2]/div/div[1]/button")))
# cross.click()
# print("Cross the bar!")
# # except TimeoutException:
# #     print("Explore_section took too long to load!")

# # going to the explore section
# click_explore_section(driver)

# # finding a random post to scroll down to
# try:
#     random_post = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/div[1]/div/div[{}]/div[{}]/div/a/div[1]/div[2]".format(random.randint(1,4), random.randint(1,5)))))
#     time.sleep(2)
#     driver.execute_script("arguments[0].scrollIntoView();", random_post)
#     time.sleep(2)
#     random_post.click()
#     print("Clicking on some random post!")
# except TimeoutException:
#     print("Clicking on some random post took too long!")

# # /html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/section/div[1]/div/article[2]
# # /html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/section/div[1]/div/article[3]

# # save button
# # /html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/section/div[1]/div/article[1]/div/div[3]/div/div/section[1]/span[3]/div/div/button
# # /html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/section/div[1]/div/article[2]/div/div[3]/div/div/section[1]/span[3]/div/div/button
# # /html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/section/div[1]/div/article[1]/div/div[3]/div/div/section[1]/span[4]/div/div/button/div/svg/polygon
# # /html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/section/div[1]/div/article[1]/div/div[3]/div/div/section[1]/span[4]/div/div/button
# random_num = random.randint(1,4)
# print("This is the random num: {}".format(random_num))
# random_post = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/section/div[1]/div/article[{}]".format(random_num))))
# driver.execute_script("arguments[0].scrollIntoView();", random_post)
# time.sleep(5)

# # webdriver.executeScript("arguments[0].scrollIntoView(true); window.scrollBy(0, -window.innerHeight / 4);", element);

# save_button = WebDriverWait(driver, 3).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "div > button._abl- > div._abm0 > svg._ab6-:nth-child(1)".format(random_num))))

# save_button = driver.find_elements(By.CSS_SELECTOR, "div > button._abl- > div._abm0 > svg._ab6-")

# driver.execute_script("window.scrollBy(0, arguments[0]);", save_button[random_num - 1].location.get("y"))

# save_button[random_num - 1].click()

# def scrolling_explore_only(driver):
#     click_explore_section(driver)

# # Find users to follow
# driver.get("https://www.instagram.com/explore/")
# search_bar = driver.find_element(By.XPATH, "//input[@value='']")
# # search_bar = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "input[@value='']")))

# search_bar.click()

# user_to_follow = "nike"

#  # typing username
# for letter in user_to_follow:
#     search_bar.send_keys(letter)
#     time.sleep(random.uniform(0,0.5))

# search_bar.send_keys(Keys.ENTER)

# search_result = WebDriverWait(driver, 3).until(EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/div/ul/li[1]/a/div")))
# search_result.click()

# follow_button = WebDriverWait(driver, 3).until(EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/header/section/div[3]/div/div[1]/button")))
# follow_button.click()