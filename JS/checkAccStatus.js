const { Builder, Capabilities, By, until, Key } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const error = require("selenium-webdriver/lib/error");
const fs = require("fs-extra");
const path = require("path");
const caps = new Capabilities();

var actions = require("./actions");

async function checkAccStatus() {
    let acc = await actions.findAvailableUser();
    console.log(acc);
    USERNAME = acc.username;
    PASSWORD = acc.password;
    let banFlag = false;

    const driver = actions.setupChrome();
    await actions.loginInstagram(driver, USERNAME, PASSWORD);

    await driver.getCurrentUrl().then((url) => {
        // if url contains "challenge", then the account is banned
        if (url.includes("challenge")) {
            console.log("Account is banned!");
            actions.changeStatusBanned(USERNAME);
            actions.putUserEnd(USERNAME);
            banFlag = true;
        }
    });

    if (banFlag === true) return;

    console.log("Account is NOT banned!");

    await driver.quit();
}

checkAccStatus();
