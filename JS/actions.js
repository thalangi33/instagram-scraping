const { Builder, Capabilities, By, until, Key } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const error = require("selenium-webdriver/lib/error");
require("chromedriver");
const fs = require("fs-extra");
const caps = new Capabilities();

function setup() {
    const opts = new chrome.Options();
    caps.setPageLoadStrategy("none");
    opts.addArguments([
        "user-agent=Mozilla/5.0 (Linux; Android 10; X2-HT Build/QP1A.191005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.101 Mobile Safari/537.36 Instagram 191.1.0.41.124 Android (29/10; 480dpi; 1080x1920; HTC/htc; X2-HT; htc_ocla1_sprout",
    ]);

    const driver = new Builder()
        .withCapabilities(caps)
        .forBrowser("chrome")
        .setChromeOptions(opts)
        .build();

    // await driver.get("https://www.google.com")

    return driver;
}

async function readStatus() {
    const data = await fs.promises.readFile("status.txt", "utf8");
    return data;
}
async function statusGet(){
    let temp = {}
    await readStatus().then(data => {
        console.log(data)
        temp = JSON.parse(data)
    });
    return temp
}

async function writeStatus(jsonInfo) {
    fs.writeFileSync("status.txt", JSON.stringify(jsonInfo),(e) => {
        if (err) {
            console.log(err);
        }
    })
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

async function loginInstagram(driver, bot_username, bot_password) {
    await driver.get("https://www.instagram.com");

    let login = await driver.wait(
        until.elementLocated(
            By.xpath(
                "/html/body/div[1]/section/main/article/div/div/div[2]/div[3]/button[1]"
            )
        ),
        10000
    );
    console.log("Login page is ready!");
    await login.click();

    await driver.sleep(2000);

    let username = await driver.wait(
        until.elementLocated(
            By.xpath(
                "/html/body/div[1]/section/main/article/div/div/div[2]/form/div[1]/div[3]/div/label/input"
            )
        ),
        10000
    );
    let username_string = bot_username;

    for (const letter of username_string) {
        await username.sendKeys(letter);
        await driver.sleep(getRandomFloat(0, 500));
    }

    await driver.sleep(getRandomFloat(1000, 1500));

    let password = await driver.wait(
        until.elementLocated(
            By.xpath(
                "/html/body/div[1]/section/main/article/div/div/div[2]/form/div[1]/div[4]/div/label/input"
            )
        ),
        10000
    );

    let password_string = bot_password;

    for (const letter of password_string) {
        await password.sendKeys(letter);
        await driver.sleep(getRandomFloat(0, 500));
    }

    await driver.sleep(getRandomFloat(1000, 1500));

    let loginButton = await driver.wait(
        until.elementLocated(
            By.xpath(
                "/html/body/div[1]/section/main/article/div/div/div[2]/form/div[1]/div[6]/button"
            )
        ),
        10000
    );

    await driver.sleep(getRandomFloat(1000, 1500));

    await loginButton.click();

    await driver.sleep(getRandomFloat(5000, 6500));
}

async function checkSaveLoginInfoNoti(driver) {
    await driver.sleep(getRandomFloat(1000, 1500));
    let notNow = await driver
        .findElement(
            By.xpath("/html/body/div[1]/section/main/div/div/div/button")
        )
        .then(
            function (webElement) {
                webElement.click();
                return true;
            },
            function (err) {
                console.log("No checkSaveLoginInfoNoti");
                console.log(err.name);
                return false;
            }
        );
    return true;
}

async function addInstaToHomeScreen(driver) {
    await driver.sleep(getRandomFloat(2000, 3500));
    let cancel = await driver
        .findElement(
            By.xpath("/html/body/div[4]/div/div/div/div/div[3]/button[2]")
        )
        .then(
            function (webElement) {
                webElement.click();
                return true;
            },
            function (err) {
                console.log("No add insta to home screen notification");
                console.log(err.name);
                return false;
            }
        );
    return true;
}

async function turnOnNotificaiton(driver) {
    await driver.sleep(getRandomFloat(2000, 3500));
    let cancel = await driver
        .findElement(
            By.xpath("/html/body/div[5]/div/div/div/div/div[3]/button[2]")
        )
        .then(
            function (webElement) {
                webElement.click();
                return true;
            },
            function (err) {
                console.log("No turn_on_notification");
                console.log(err.name);
                return false;
            }
        );
    return true;
}

async function cancelNotificaiton(driver) {
    console.log("Running cancelNotificaiton");
    //click cancel for add Instagram to your Home screen
    await addInstaToHomeScreen(driver);
    // turn off the notification
    await turnOnNotificaiton(driver);
}

async function goToHomepage(driver) {
    let homepage = await driver.wait(
        until.elementLocated(
            By.xpath(
                "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/nav/div/div/div/div/div/div[1]/a"
            )
        ),
        10000
    );
    await homepage.click();
    console.log("Going to homepage!");
    cancelNotificaiton(driver);
}

async function clickExploreSection(driver) {
    let explore = await driver.wait(
        until.elementLocated(
            By.xpath(
                "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/nav/div/div/div/div/div/div[2]/a"
            )
        ),
        10000
    );
    await explore.click();
    console.log("Going to explore section!");
}

async function clickActivitySection(driver) {
    let activity = await driver.wait(
        until.elementLocated(
            By.xpath(
                // Error here
                "/tml/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/nav/div/div/div/div/div/div[4]/a"
            )
        ),
        10000
    );
    await activity.click();
    console.log("Going to activity section!");
}

async function scrolling(driver, loadNum) {
    let scrollPauseTime = 5000;
    // get scroll height
    let lastHeight = await driver.executeScript(
        "return document.body.scrollHeight"
    );
    let totalHeight = 0;
    let countLoad = 1;

    while (true) {
        // get random height
        let randomHeight = getRandomFloat(300, 500);
        totalHeight = totalHeight + randomHeight;
        // scroll the random height
        await driver.executeScript(
            "window.scrollBy(0, arguments[0]);",
            randomHeight
        );
        lastHeight = await driver.executeScript(
            "return document.body.scrollHeight"
        );
        await driver.sleep(1000);

        console.log(`This is total height: ${totalHeight}`);
        console.log(`This is last height: ${lastHeight}`);

        // if scroll down to the bottom of the page
        if (totalHeight >= lastHeight) {
            // wait to load page
            await driver.sleep(scrollPauseTime);
            totalHeight = lastHeight;
            console.log(
                `This is total_height after arriving to bottom height: ${totalHeight}`
            );
            console.log(
                `This is last height after arriving to bottom height: ${lastHeight}`
            );

            // calculate new scroll height and compare with last scroll height
            let newHeight = await driver.executeScript(
                "return document.body.scrollHeight"
            );
            console.log(`This is the new height: ${newHeight}`);
            if (newHeight == lastHeight) {
                console.log("Finished scrolling to the end");
                break;
            }
            if (countLoad == loadNum) {
                console.log(`Finished scrolling ${loadNum} times`);
                break;
            }
            lastHeight = newHeight;
            countLoad++;
        }
    }
}

async function homepageScrolling(driver, loadNum) {
    await goToHomepage(driver);
    await scrolling(driver, loadNum);
    await goToHomepage(driver);
}

async function exploreScrolling(driver, loadNum) {
    await clickExploreSection(driver);
    await scrolling(driver, loadNum);
    await goToHomepage(driver);
}

async function savingRandomPost(driver, loadNum) {
    await clickExploreSection(driver);
    // finding a random post to scroll down to
    let randomPost = await driver.wait(
        until.elementLocated(
            By.xpath(
                `/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/div[1]/div/div[${Math.floor(
                    getRandomFloat(1, 5)
                )}]/div[${Math.floor(
                    getRandomFloat(1, 6)
                )}]/div/a/div[1]/div[2]`
            )
        ),
        10000
    );
    await driver.sleep(2000);
    await driver.executeScript("arguments[0].scrollIntoView();", randomPost);
    await driver.sleep(2000);
    await randomPost.click();
    console.log("Clicking on a random post!");

    // finding the number of avaliable save buttons >> available posts
    let saveButton = await driver.wait(
        until.elementLocated(By.css("span._aamz button._abl-")),
        3000
    );
    console.log("This is the first save button: ", saveButton);
    await driver.sleep(5000);
    saveButton = await driver.findElements(By.css("span._aamz button._abl-"));
    console.log(`This is the number of save button: ${saveButton.length}`);
    let randomNum = Math.floor(getRandomFloat(1, saveButton.length + 1));
    console.log(`This is the random number: ${randomNum}`);

    // scrolling to the chosen posts and saving it
    for (let i = 0; i < loadNum; i++) {
        randomPost = await driver.wait(
            until.elementLocated(
                By.xpath(
                    `/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/section/div[1]/div/article[${randomNum}]`
                )
            ),
            3000
        );
        await driver.executeScript(
            "arguments[0].scrollIntoView();",
            randomPost
        );
        await driver.sleep(3000);

        await driver.executeScript(
            "arguments[0].scrollIntoView()",
            saveButton[randomNum - 1]
        );
        await driver.sleep(3000);

        if (Math.random(getRandomFloat(1, 3)) == 1) {
            saveButton[randomNum - 1].click();
        }
        await driver.sleep(3000);

        saveButton = await driver.findElements(
            By.css("span._aamz button._abl-")
        );
        randomNum = Math.floor(
            getRandomFloat(saveButton.length - 3, saveButton.length)
        );

        console.log(`This is the random num: ${randomNum}`);
        console.log(`This is the number of save button: ${saveButton.length}`);
        console.log(`This is ${i} times scrolled`);
    }

    await goToHomepage(driver);
    await cancelNotificaiton(driver);
}

async function directMessage(driver, sendeeString) {
    await driver.get("https://www.instagram.com/direct/inbox/");
    await driver.sleep(1000);
    await driver.get("https://www.instagram.com/direct/new/");

    let sendee = await driver.wait(
        until.elementLocated(
            By.xpath(
                "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/div/section/div[2]/div/div[1]/div/div[2]/input"
            )
        )
    );
    await sendee.click();

    await driver.sleep(2000);

    for (const letter of sendeeString) {
        await sendee.sendKeys(letter);
        await driver.sleep(getRandomFloat(0, 0.5));
    }
    await driver.sleep(1000);

    await driver.get("https://www.instagram.com/");
    await cancelNotificaiton(driver);
}

async function activityPause(driver) {
    await clickActivitySection(driver);
    await driver.sleep(5000);
    await driver.get("https://www.instagram.com/explore/people/");
    console.log("Going to the people suggestion");
    await driver.sleep(5000);
    await goToHomepage(driver);
    await cancelNotificaiton(driver);
}

async function goToProfilePage(driver) {
    let profile = await driver.wait(
        until.elementLocated(
            By.xpath(
                "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/nav/div/div/div/div/div/div[5]/a"
            )
        )
    );
    await profile.click();
    await driver.sleep(getRandomFloat(1000, 3000));
}
async function postsClick(driver) {
    let posts = await driver.wait(
        until.elementLocated(
            By.xpath(
                "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/div[1]/a[1]"
            )
        )
    );
    await posts.click();
}
async function feedsClick(driver) {
    let feeds = await driver.wait(
        until.elementLocated(
            By.xpath(
                "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/div[1]/a[2]"
            )
        )
    );
    await feeds.click();
}
async function savedClick(driver) {
    let saved = await driver.wait(
        until.elementLocated(
            By.xpath(
                "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/div[1]/a[3]"
            )
        )
    );
    await saved.click();
}
async function taggedClick(driver) {
    let tagged = await driver.wait(
        until.elementLocated(
            By.xpath(
                "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/div[1]/a[4]"
            )
        )
    );
    await tagged.click();
}
async function profilePageActions(driver, loopTimes) {
    let tabsProfile = [postsClick, feedsClick, savedClick, taggedClick];
    await goToProfilePage(driver);
    for (let i = 0; i < loopTimes; i++) {
        let randomTab = Math.floor(getRandomFloat(0, 4));
        await tabsProfile[randomTab](driver);
        await driver.sleep(getRandomFloat(1000, 3000));
        if (randomTab == 2) {
            await scrolling(driver, 5);
            await goToProfilePage(driver);
        }
    }
    await goToHomepage(driver);
    await cancelNotificaiton(driver);
}
let randomString = ["apple", "banana", "orange"];
let randomActions = [
    homepageScrolling,
    exploreScrolling,
    savingRandomPost,
    directMessage,
    activityPause,
    profilePageActions,
];
async function randomActionSelector(driver) {
    let randomActionNum = Math.floor(getRandomFloat(0, 6));
    switch (randomActionNum) {
        case 0:
            await randomActions[0](driver, Math.floor(getRandomFloat(1, 4)));
            break;
        case 1:
            await randomActions[1](driver, Math.floor(getRandomFloat(1, 4)));
            break;
        case 2:
            await randomActions[2](driver, Math.floor(getRandomFloat(1, 4)));
            break;
        case 3:
            await randomActions[3](
                driver,
                randomString[Math.floor(getRandomFloat(0, 3))]
            );
            break;
        case 4:
            await randomActions[4](driver);
            break;
        case 5:
            await randomActions[5](driver, Math.floor(getRandomFloat(1, 4)));
            break;
        default:
            break;
    }
    await cancelNotificaiton(driver);
}

module.exports = {
    getRandomFloat,
    readStatus,
    statusGet,
    writeStatus,
    loginInstagram,
    setup,
    checkSaveLoginInfoNoti,
    addInstaToHomeScreen,
    turnOnNotificaiton,
    cancelNotificaiton,
    goToHomepage,
    clickExploreSection,
    clickActivitySection,
    scrolling,
    homepageScrolling,
    exploreScrolling,
    savingRandomPost,
    directMessage,
    activityPause,
    profilePageActions,
    randomActionSelector,
};
