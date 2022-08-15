from numpy import logical_and
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import NoSuchElementException    
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import random
import json
import os
from asset_actions import *

DIRNAME = os.path.dirname(__file__)

next_max_id = "QVFEckNrZkpOOXlmcU8zSHBaX0ZfRGxoTGZReGdDVjdoaEpUMHV1ZjdieGJrcEFuT1V0S1p1Um0wR3FYQ01NTTNjT1FTOTZnald2WHg4UGNLNm10VTJzZA=="
URL = "https://i.instagram.com/api/v1/friendships/273583714/followers/?count=100&max_id={}&search_surface=follow_list_page".format(next_max_id)

# URL = "https://i.instagram.com/api/v1/friendships/273583714/followers/?count=100&search_surface=follow_list_page"
LOGOUT_URL = "https://instagram.com/accounts/logout"

FETCH_NUM = 50
FETCH_TIMES = 4

# setup the driver
driver = setup_driver()

# find users
acc_info = find_avaiable_user(DIRNAME)

USERNAME = acc_info[0]
PASSWORD = acc_info[1]

# login to instagram
login_instagram(driver, USERNAME, PASSWORD)

# check if save_your_login_info notification exists
check_save_login_info_noti(driver)

# if presentation exist -> notifications
cancel_notificaition(driver)


time.sleep(1000)
time.sleep(5)

# create new tab (only 2 tabs in total, cannot add)
tabs = create_new_tab(driver)
tab_1 = tabs[0]
tab_2 = tabs[1]

count_num = 1
count_fetch = 1
flag_finish = 0

for i in range(0, FETCH_TIMES):

    for n in range(1, FETCH_NUM + 1):
        # switch to tab_2 for random actions
        driver.switch_to.window(tab_2)

        # random actions
        random_actions_selector(driver)

        # switch to tab_1 for fetching api
        driver.switch_to.window(tab_1)
        time.sleep(random.uniform(3,5))
        driver.get(URL)
        time.sleep(random.uniform(3,5))
        # copying html response
        html_text = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "/html/body/pre"))).text

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

    print("Current FETCH_TIMES: {}".format(FETCH_TIMES))

    # logout from the current session
    driver.get(LOGOUT_URL)

    # closing the second tab
    driver.switch_to.window(tab_2)
    driver.close()

    # check whether reached FETCH_TIMES limit
    if i == FETCH_TIMES - 1:
        print("-----Reached FETCH_TIMES limit-----")
        print("-----Finished-----")
        break

    # wait 1 hr + 3 mins
    time.sleep(10)

    # login to instagram after 1 hr on the first tab
    driver.switch_to.window(tab_1)
    login_instagram(driver, USERNAME, PASSWORD)
    cancel_notificaition(driver)
    time.sleep(5)

    # create a second tab again
    tabs = create_new_tab(driver)
    tab_1 = tabs[0]
    tab_2 = tabs[1]
