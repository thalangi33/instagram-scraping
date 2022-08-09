import json, os
DIRNAME = os.path.dirname(__file__)

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

# acc = find_avaiable_user(DIRNAME)
# USERNAME = acc[0]
# PASSWORD = acc[1]

USERNAME = "fapnurahavich"

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

acc_info = find_avaiable_user(DIRNAME)

print(acc_info[0])
print(acc_info[1])

change_status_banned(acc_info[0], DIRNAME)

put_user_end(acc_info[0], DIRNAME)
