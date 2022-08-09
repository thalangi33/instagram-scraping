const { Builder, Capabilities, By, until, Key } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const fs = require("fs-extra");
const caps = new Capabilities();

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

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

async function login_instagram(driver, bot_username, bot_password) {
    await driver.get("https://www.instagram.com");

    let login = driver.wait(
        until.elementLocated(
            By.xpath(
                "/html/body/div[1]/section/main/article/div/div/div[2]/div[3]/button[1]"
            )
        )
    );
    console.log("Login page is ready!");
    login.click();

    await driver.sleep(2000);

    let username = driver.wait(
        until.elementLocated(
            By.xpath(
                "/html/body/div[1]/section/main/article/div/div/div[2]/form/div[1]/div[3]/div/label/input"
            )
        )
    );
    let username_string = bot_username;

    for (const letter of username_string) {
        await username.sendKeys(letter);
        await driver.sleep(getRandomFloat(0, 500));
    }

    await driver.sleep(getRandomFloat(1000, 1500));

    let password = driver.wait(
        until.elementLocated(
            By.xpath(
                "/html/body/div[1]/section/main/article/div/div/div[2]/form/div[1]/div[4]/div/label/input"
            )
        )
    );

    let password_string = bot_password;

    for (const letter of password_string) {
        await password.sendKeys(letter);
        await driver.sleep(getRandomFloat(0, 500));
    }

    await driver.sleep(getRandomFloat(1000, 1500));

    let loginButton = driver.wait(
        until.elementLocated(
            By.xpath(
                "/html/body/div[1]/section/main/article/div/div/div[2]/form/div[1]/div[6]/button"
            )
        )
    );

    await driver.sleep(getRandomFloat(1000, 1500));

    loginButton.click();

    await driver.sleep(getRandomFloat(5000, 6500));
}

async function checkSaveLoginInfoNoti(driver) {
    await driver.sleep(getRandomFloat(1000, 1500));
    try {
        let notNow = driver.wait(
            until.elementLocated(
                By.xpath("/html/body/div[4]/div/div/div/div/div[3]/button[2]")
            ),
            3000
        );
        console.log("notNow found!");
        await driver.sleep(getRandomFloat(1000, 3000));
        notNow.click();
        console.log("notNow clicked!");
    } catch (e) {
        // if (e.name === "TimeoutError")
            console.log(e.name);
        return false;
    }
    return true;
}

async function addInstaToHomeScreen(driver) {
    try {
        let cancel = driver.findElement(
            By.xpath("/html/body/div[4]/div/div/div/div/div[3]/button[2]")
        );
        await driver.sleep(getRandomFloat(1000, 3000));
        cancel.click();
    } catch (e) {
        if (e.name === "NoSuchElementError")
            console.log("No addInstaToHomeScreen notification");
        return false;
    }
    return true;
}

async function turnOnNotificaiton(driver) {
    try {
        let cancel = driver.findElement(
            By.xpath("/html/body/div[5]/div/div/div/div/div[3]/button[2]")
        );
        await driver.sleep(getRandomFloat(1000, 3000));
        cancel.click();
    } catch (e) {
        if (e.name === "NoSuchElementError")
            console.log("No addInstaToHomeScreen notification");
        return false;
    }
    return true;
}
async function cancelNotificaiton(driver) {
    try {
        while (driver.findElement(By.xpath("/html/body/div[5]/div"))) {
            // click cancel for add Instagram to your Home screen
            addInstaToHomeScreen(driver);
            // turn off the notification
            turnOnNotificaiton(driver);
        }
    } catch (e) {
        if (e.name === "NoSuchElementError") console.log("No presentation");
    }
}

async function main() {
    USERNAME = "fapnurahavich";
    PASSWORD = "look4kol";

    const driver = setup();
    await login_instagram(driver, USERNAME, PASSWORD);
    await checkSaveLoginInfoNoti(driver);
    // console.log("hello");
    // await cancelNotificaiton(driver);
}

main();
