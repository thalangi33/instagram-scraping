const { Builder, Capabilities, By, until, Key } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const error = require("selenium-webdriver/lib/error");
const fs = require("fs-extra");
const path = require("path");
const caps = new Capabilities();

var actions = require("./actions");
const { stat } = require("fs");

async function main() {
    USERNAME = "fapnurahavich";
    PASSWORD = "look4kol";

    // variables for fetching
    let status = await actions.statusGet();
    let url = "";
    let nextMaxId = status.nextMaxId;
    let countNum = status.countNum;
    let countFetch = status.countFetch;

    if (nextMaxId === "none") {
        url =
            "https://i.instagram.com/api/v1/friendships/273583714/followers/?count=100&search_surface=follow_list_page";
    } else {
        url = `https://i.instagram.com/api/v1/friendships/273583714/followers/?count=100&max_id=${nextMaxId}`;
    }

    console.log(url);
    console.log(nextMaxId);

    let logoutUrl = "https://instagram.com/accounts/logout";
    FETCHNUM = 5;

    // driver setup
    const driver = actions.setup();
    // setting the timeout conditions
    driver.manage().setTimeouts({ pageLoad: 10000 });

    try {
        // login to instagram
        await actions.loginInstagram(driver, USERNAME, PASSWORD);
        await actions.checkSaveLoginInfoNoti(driver);
        await actions.addInstaToHomeScreen(driver);

        // fetching followers
        await driver.sleep(5000);
        await driver.switchTo().newWindow("tab");

        for (let j = 1; j < FETCHNUM + 1; j++) {
            // switch to tab 2
            await driver.getAllWindowHandles().then(async function (handles) {
                return driver.switchTo().window(handles[1]);
            });
            await driver.get("https://www.instagram.com/");
            await driver.sleep(5000);
            await actions.cancelNotificaiton(driver);

            // random actions
            await actions.randomActionSelector(driver);

            // switch to tab 1
            await driver.getAllWindowHandles().then(async function (handles) {
                return driver.switchTo().window(handles[0]);
            });
            await driver.sleep(actions.getRandomFloat(3000, 5000));
            await driver.get(url);
            await driver.sleep(actions.getRandomFloat(3000, 5000));
            //copying html response
            let htmlText = await driver
                .wait(until.elementLocated(By.xpath("/html/body/pre")), 5000)
                .getText();

            // text to json
            let jsonInfo = JSON.parse(htmlText);

            // write data into files
            if (jsonInfo.next_max_id != null) {
                let pathF1 = `./fetch_data/follower_list/${countFetch}_follower_list.txt`;
                let pathF2 = `./fetch_data/follower_list_extra/${countFetch}_follower_list_extra.txt`;
                let pathF3 = `./fetch_data/response/${countFetch}_response.txt`;

                fs.appendFileSync(pathF3, htmlText, (e) => {
                    if (err) {
                        console.log(err);
                    }
                });
                let userItem = jsonInfo.users;
                nextMaxId = jsonInfo.next_max_id;

                console.log(nextMaxId);

                fs.appendFileSync(pathF1, `##### FETCH_NUM = ${j}\n`, (e) => {
                    if (err) {
                        console.log(err);
                    }
                });
                fs.appendFileSync(pathF2, `##### FETCH_NUM = ${j}\n`, (e) => {
                    if (err) {
                        console.log(err);
                    }
                });

                for (let item of userItem) {
                    console.log(item.username);
                    fs.appendFileSync(
                        pathF1,
                        `${countNum} ${item.username}\n`,
                        (e) => {
                            if (err) {
                                console.log(err);
                            }
                        }
                    );
                    fs.appendFileSync(
                        pathF2,
                        `${countNum} username: \"${item.username}\", pk: \"${item.pk}\", is_private: \"${item.is_private}\"\n`,
                        (e) => {
                            if (err) {
                                console.log(err);
                            }
                        }
                    );
                    countNum++;
                }

                fs.appendFileSync(
                    pathF1,
                    `next_max_id = ${nextMaxId}\n`,
                    (e) => {
                        if (err) {
                            console.log(err);
                        }
                    }
                );
                fs.appendFileSync(
                    pathF2,
                    `next_max_id = ${nextMaxId}\n`,
                    (e) => {
                        if (err) {
                            console.log(err);
                        }
                    }
                );

                console.log(`##### FETCH_NUM = ${j}\n`);

                url = `https://i.instagram.com/api/v1/friendships/273583714/followers/?count=100&max_id=${nextMaxId}`;

                await driver.sleep(2000);

                countFetch++;
                await driver.get(url);
            }

            console.log(`This is countFetch: ${countFetch}`);
            console.log(`This is countNum: ${countNum}`);

            if (jsonInfo.next_max_id == null) {
                if (jsonInfo.user != null) {
                    let pathF1 = `./fetch_data/follower_list/${countFetch}_follower_list.txt`;
                    let pathF2 = `./fetch_data/follower_list_extra/${countFetch}_follower_list_extra.txt`;
                    let pathF3 = `./fetch_data/response/${countFetch}_response.txt`;

                    fs.appendFileSync(pathF3, htmlText, (e) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    let userItem = jsonInfo.users;

                    fs.appendFileSync(pathF1, `##### FETCH_NUM = ${j}`, (e) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    fs.appendFileSync(pathF2, `##### FETCH_NUM = ${j}`, (e) => {
                        if (err) {
                            console.log(err);
                        }
                    });

                    for (let item of userItem) {
                        console.log(item.username);
                        fs.appendFileSync(
                            pathF1,
                            `${countNum} ${item.username}\n`,
                            (e) => {
                                if (err) {
                                    console.log(err);
                                }
                            }
                        );
                        fs.appendFileSync(
                            pathF2,
                            `${countNum} username: \"${item.username}\", pk: \"${item.pk}\", is_private: \"${item.is_private}\"\n`,
                            (e) => {
                                if (err) {
                                    console.log(err);
                                }
                            }
                        );
                        countNum++;
                    }

                    console.log(`##### FETCH_NUM = ${j}`);

                    console.log("-----Finished fetching all followers!-----");
                }
                if (jsonInfo.users == null) {
                    // write down the error in a file
                    let pathError = `./fetch_data/${countFetch}_error.txt`;
                    fs.appendFileSync(pathError, htmlText, (e) => {
                        if (err) {
                            console.log(err);
                        }
                    });

                    console.log(
                        "-----Error from Instagram! Check the error file-----"
                    );
                }

                await driver.sleep(1000);
                break;
            }
        }

        // closing the second tab
        await driver.getAllWindowHandles().then(async function (handles) {
            return driver.switchTo().window(handles[1]);
        });
        await driver.close();

        // logout from the current session
        await driver.getAllWindowHandles().then(async function (handles) {
            return driver.switchTo().window(handles[0]);
        });
        await driver.get(logoutUrl);
        await driver.close();

        // write nextMaxId, countNum to status.txt
        status.nextMaxId = nextMaxId;
        status.countNum = countNum;
        status.countFetch = countFetch;
        await actions.writeStatus(status);

        // wait some time before logging
        await driver.sleep(3600000);
    } catch (e) {
        console.log("Error is found: " + e.name);
        console.log(e);

        // write nextMaxId, countNum to status.txt
        status.nextMaxId = nextMaxId;
        status.countNum = countNum;
        status.countFetch = countFetch;
        await actions.writeStatus(status);

        driver.quit();
    }
}

main();
