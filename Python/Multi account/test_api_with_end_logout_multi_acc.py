from cgitb import html
from distutils.spawn import find_executable
from telnetlib import LOGOUT
import this
from urllib import response
from numpy import logical_and
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import random
import json
import os

def login_instagram(driver, bot_username, bot_password):
    login = driver.find_element(By.XPATH, "/html/body/div[1]/section/main/article/div/div/div[2]/div[3]/button[1]")
    login.click()

    driver.implicitly_wait(5)

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

bot_username = ["servilershov19907581", "gorfunrelyakimov"]
PASSWORD = "look4kol"

DIRNAME = os.path.dirname(__file__)

URL = "https://i.instagram.com/api/v1/friendships/273583714/followers/?count=100&search_surface=follow_list_page"
LOGOUT_URL = "https://instagram.com/accounts/logout"

FETCH_NUM = 3
FETCH_TIMES = 5

# setup
opts = Options()
opts.add_argument("user-agent=Mozilla/5.0 (Linux; Android 10; X2-HT Build/QP1A.191005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.101 Mobile Safari/537.36 Instagram 191.1.0.41.124 Android (29/10; 480dpi; 1080x1920; HTC/htc; X2-HT; htc_ocla1_sprout")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=opts)

# first login
driver.get("https://www.instagram.com/")

time.sleep(5)

# starting calling API to scrape

count_num = 1
count_fetch = 1
flag_finish = 0

for i in range(0, len(bot_username)):
    login_instagram(driver, bot_username[i], PASSWORD)
    driver.get(URL)
    time.sleep(2)

    for n in range(1, FETCH_NUM + 1):

        # copying html response
        html_text = driver.find_element(By.XPATH, "/html/body/pre").text

        # load html text into json
        json_info = json.loads(html_text)
        
        # write data into files
        if "next_max_id" in json_info:
            path_f1 = os.path.relpath(".\\fetch_data\\follower_list\\{}_follower_list.txt".format(count_fetch), DIRNAME)
            path_f2 = os.path.relpath(".\\fetch_data\\follower_list_extra\\{}_follower_list_extra.txt".format(count_fetch), DIRNAME)
            path_f3 = os.path.relpath(".\\fetch_data\\response\\{}_response.txt".format(count_fetch), DIRNAME)
            
            with open(path_f1, "w") as f1, open(path_f2, "w") as f2, open(path_f3, "w") as f3:

                f3.write(json.dumps(html_text))
                user_item = json_info["users"]
                next_max_id = json_info["next_max_id"]

                print(next_max_id)

                f1.write("##### FETCH_NUM = {}\n".format(n))
                f2.write("##### FETCH_NUM = {}\n".format(n))

                for item in user_item:
                    follower_info = json.dumps(item)
                    follower_info = json.loads(follower_info)
                    print(follower_info["username"])
                    f1.write("{} {}\n".format(count_num, follower_info["username"]))
                    f2.write("{} username: \"{}\", pk: \"{}\", is_private: \"{}\"\n".format(count_num, follower_info["username"], follower_info["pk"], follower_info["is_private"]))
                    count_num = count_num + 1
                
                f1.write("next_max_id = {}\n".format(next_max_id))
                f2.write("next_max_id = {}\n".format(next_max_id))

                print("##### FETCH_NUM = {}\n".format(n))

                URL = "https://i.instagram.com/api/v1/friendships/273583714/followers/?count=100&max_id={}&search_surface=follow_list_page".format(next_max_id)

                time.sleep(2)

            count_fetch = count_fetch + 1
            driver.get(URL)

        print("This is count_fetch: {}".format(count_fetch))
        print("This is count_num: {}".format(count_num))

        if not "next_max_id" in json_info:
            if "users" in json_info:
                path_f1 = os.path.relpath(".\\fetch_data\\follower_list\\{}_follower_list.txt".format(count_fetch), DIRNAME)
                path_f2 = os.path.relpath(".\\fetch_data\\follower_list_extra\\{}_follower_list_extra.txt".format(count_fetch), DIRNAME)
                path_f3 = os.path.relpath(".\\fetch_data\\response\\{}_response.txt".format(count_fetch), DIRNAME)
                
                with open(path_f1, "w") as f1, open(path_f2, "w") as f2, open(path_f3, "w") as f3:

                    f3.write(json.dumps(html_text))
                    user_item = json_info["users"]

                    f1.write("##### FETCH_NUM = {}\n".format(n))
                    f2.write("##### FETCH_NUM = {}\n".format(n))

                    for item in user_item:
                        follower_info = json.dumps(item)
                        follower_info = json.loads(follower_info)
                        print(follower_info["username"])
                        f1.write("{} {}\n".format(count_num, follower_info["username"]))
                        f2.write("{} username: \"{}\", pk: \"{}\", is_private: \"{}\"\n".format(count_num, follower_info["username"], follower_info["pk"], follower_info["is_private"]))
                        count_num = count_num + 1

                    print("##### FETCH_NUM = {}\n".format(n))

                    print("-----Finished fetching all followers!-----")

            if not "users" in json_info:
                # write down the error in a file
                path_error = os.path.relpath(".\\fetch_data\\error.txt", DIRNAME)
                with open(path_error, "w") as f_error:
                    f_error.write(json.dumps(html_text))
                
                print("-----Error from Instagram! Check the error file-----")

            # quit if finished scraping all users
            time.sleep(1)
            driver.get(LOGOUT_URL)
            driver.quit()
            flag_finish = 1
            break
    
    # break the loop when finished scraping         
    if flag_finish == 1:
        break

    # logout from the current session
    driver.get(LOGOUT_URL)

    # wait 1 hr + 3 mins
    time.sleep(3780)
    

