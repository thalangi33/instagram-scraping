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
    USERNAME = "choldybinabiridaniva";
    PASSWORD = "look4kol";

    // variables for fetching
    let status = await actions.statusGet();
    let url = "";
    let nextMaxId = status.nextMaxId;
    let countNum = status.countNum;

    // driver setup
    const driver = actions.setup();

    try {
        if (status.nextMaxId === "none") {
            url =
                "https://i.instagram.com/api/v1/friendships/273583714/followers/?count=100&search_surface=follow_list_page";
        } else {
            let nextMaxId = status.nextMaxId;
            url = `https://i.instagram.com/api/v1/friendships/273583714/followers/?count=100&max_id=${nextMaxId}`;
        }

        console.log(url);
        console.log(status.nextMaxId);

        let logoutUrl = "https://instagram.com/accounts/logout";

        let fetchNum = 5;
        let fetchTimes = 100;

        // login to instagram
        await actions.loginInstagram(driver, USERNAME, PASSWORD);
        await actions.checkSaveLoginInfoNoti(driver);
        await actions.addInstaToHomeScreen(driver);

        await driver.sleep(5000);
        await driver.sleep(5);

        await driver.switchTo().newWindow("tab");

        let countFetch = 1;
        let flagFinish = 0;

        for (let i = 0; i < fetchTimes; i++) {
            for (let j = 1; j < fetchNum + 1; j++) {
                // switch to tab 2
                await driver
                    .getAllWindowHandles()
                    .then(async function (handles) {
                        return driver.switchTo().window(handles[1]);
                    });
                await driver.get("https://www.instagram.com/");
                await driver.sleep(5000);
                await actions.cancelNotificaiton(driver);

                // random actions
                await actions.randomActionSelector(driver);

                // switch to tab 1
                await driver
                    .getAllWindowHandles()
                    .then(async function (handles) {
                        return driver.switchTo().window(handles[0]);
                    });
                await driver.sleep(actions.getRandomFloat(3000, 5000));
                await driver.get(url);
                await driver.sleep(actions.getRandomFloat(3000, 5000));
                //copying html response
                let htmlText = await driver
                    .wait(
                        until.elementLocated(By.xpath("/html/body/pre")),
                        5000
                    )
                    .getText();

                // text to json
                let jsonInfo = JSON.parse(htmlText);

                // write data into files
                if (jsonInfo.next_max_id != null) {
                    let pathF1 = `./fetch_data/follower_list/${countNum}_follower_list.txt`;
                    let pathF2 = `./fetch_data/follower_list_extra/${countNum}_follower_list_extra.txt`;
                    let pathF3 = `./fetch_data/response/${countNum}_response.txt`;

                    fs.appendFileSync(pathF3, htmlText, (e) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    let userItem = jsonInfo.users;
                    nextMaxId = jsonInfo.next_max_id;

                    console.log(nextMaxId);

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
                        let pathF1 = `./fetch_data/follower_list/${countNum}_follower_list.txt`;
                        let pathF2 = `./fetch_data/follower_list_extra/${countNum}_follower_list_extra.txt`;
                        let pathF3 = `./fetch_data/response/${countNum}_response.txt`;

                        fs.appendFileSync(pathF3, htmlText, (e) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        let userItem = jsonInfo.users;

                        fs.appendFileSync(
                            pathF1,
                            `##### FETCH_NUM = ${j}`,
                            (e) => {
                                if (err) {
                                    console.log(err);
                                }
                            }
                        );
                        fs.appendFileSync(
                            pathF2,
                            `##### FETCH_NUM = ${j}`,
                            (e) => {
                                if (err) {
                                    console.log(err);
                                }
                            }
                        );

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

                        console.log(
                            "-----Finished fetching all followers!-----"
                        );
                    }
                    if (jsonInfo.users == null) {
                        // write down the error in a file
                        let pathError = `./fetch_data/${countNum}_error.txt`;
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
                    await driver.get(logoutUrl);
                    await driver.quit();
                    flagFinish = 1;
                    break;
                }
            }

            if (flagFinish == 1) {
                break;
            }

            console.log(`Current FETCH_TIMES: ${i}`);

            // logout from the current session
            await driver.get(logoutUrl);

            // closing the second tab
            await driver.getAllWindowHandles().then(async function (handles) {
                return driver.switchTo().window(handles[1]);
            });
            await driver.close();

            // check whether reached fetchTimes limit
            if (i == fetchTimes - 1) {
                console.log("-----Reached FETCH_TIMES limit-----");
                console.log("-----Finished-----");
                break;
            }

            // wait some time
            await driver.sleep(3600000);

            // login to instagram after 1 hour on the first tab
            await driver.getAllWindowHandles().then(async function (handles) {
                return driver.switchTo().window(handles[0]);
            });
            await actions.loginInstagram(driver, USERNAME, PASSWORD);
            await actions.cancelNotificaiton(driver);
            await driver.sleep(5000);

            //create a second tab
            await driver.switchTo().newWindow("tab");
        }
    } catch (e) {
        console.log("Error is found: " + e.name);
        console.log(e);
        
        // write nextMaxId, countNum to status.txt
        status.nextMaxId = nextMaxId;
        status.countNum = countNum;
        await actions.writeStatus(status);

        driver.quit();
    }

    // console.log("hello");
    // await actions.checkSaveLoginInfoNoti(driver);
    // await actions.cancelNotificaiton(driver);

    // await actions.clickActivitySection(driver);
    //   await homepageScrolling(driver, 3);
    //   await exploreScrolling(driver, 4);
    //   await savingRandomPost(driver, 5);
}

main();
