const fs = require("fs-extra");

function main() {
    htmlText =
        '{"message":"challenge_required","challenge":{"url":"https://i.instagram.com/challenge/?next=/api/v1/friendships/273583714/followers/%253Fcount%253D100%2526max_id%253DQVFBd2lXd1U3T1pZS1o1dzR3eGNmYkNxaTlUWDE1N1RrWWVWYWdadmI5a3EtV3VNenFhWDE3eHYzMHB6aGFsc2JpRi1YWTJhbV81cFNjc0tPRlREUkZUaw%25253D%25253D%2526search_surface%253Dfollow_list_page","api_path":"/challenge/","hide_webview_header":true,"lock":true,"logout":false,"native_flow":true,"flow_render_type":0},"status":"fail"}';

    jsonInfo = JSON.parse(htmlText);

    // if account is banned
    if (jsonInfo['"message"'] !== '"challenge_required"') {
        console.log("BANNED");
    }
}

// read accounts.txt
async function readAccount() {
    const data = await fs.promises.readFile("accounts.txt", "utf8");
    return data;
}

// get the info of all accounts
async function accountGet() {
    let temp = {};
    await readAccount().then((data) => {
        temp = JSON.parse(data);
    });
    return temp;
}

// find the first online available user
async function findAvailableUser() {
    let userAccount = await accountGet();
    console.log(userAccount);

    for (let user of userAccount["users"]) {
        if (user.status === "online") {
            username = user.username;
            password = user.password;
        }
    }
    return { username, password };
}

// change the status of the inputted username into banned
async function changeStatusBanned(username) {
    // get info about the accounts
    let userAccount = await accountGet();
    let tempUserAccount = userAccount["users"];

    // change the status of the inputted username into banned
    for (let user of tempUserAccount) {
        if (user["username"] === username) {
            user["status"] = "banned";
            break;
        }
    }
    userAccount["users"] = tempUserAccount;
    await fs.promises
        .writeFile("accounts.txt", JSON.stringify(userAccount, null, 4))
        .then(() => console.log("Success in changing the status into banned!"));
}

// putting inputted username at the end of the list
async function putUserEnd(username) {
    // get info about the accounts
    let userAccount = await accountGet();
    let tempUserAccount = userAccount["users"];

    // finding usre info with same username
    let result = tempUserAccount.find((user) => user.username === username);

    // moving the current user to the end of the list
    let temp = tempUserAccount.filter((user) => user.username !== username);
    temp.push(result);
    userAccount["users"] = temp;
    await fs.promises
        .writeFile("accounts.txt", JSON.stringify(userAccount, null, 4))
        .then(() => console.log("Success in changing the acc order!"));
}

async function reallyMain() {
    // let acc = await findAvailableUser();
    // console.log(acc);
    // USERNAME = acc.username;
    // PASSWORD = acc.password;

    // console.log("USERNAME: " + USERNAME);
    // console.log("PASSWORD: " + PASSWORD);

    await changeStatusBanned("fapnurahavich");
    await putUserEnd("fapnurahavich")
    console.log("Finished");
}

reallyMain();
