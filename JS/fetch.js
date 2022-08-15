const { Builder, By, until, Key } = require("selenium-webdriver");
const fs = require("fs-extra");
const chrome = require("selenium-webdriver/chrome");
const path = require("path");
const {
  setUp,
  loginInstagram,
  checkSaveLoginInfoNoti,
  addInstaToHomeScreen,
  randomActionSelector,
  getRandomFloat,
  cancelNotificaiton,
} = require("./actions");
require("chromedriver");

// add {exports.(function name) = (function name);} to actions.js

let username = "fapnurahavich";
let password = "look4kol";
let searchUser = "53yfp";

let nextMaxId =
  "QVFEckNrZkpOOXlmcU8zSHBaX0ZfRGxoTGZReGdDVjdoaEpUMHV1ZjdieGJrcEFuT1V0S1p1Um0wR3FYQ01NTTNjT1FTOTZnald2WHg4UGNLNm10VTJzZA==";
let url = `https://i.instagram.com/api/v1/friendships/273583714/followers/?count=100&max_id=${nextMaxId}`;

let logoutUrl = "https://instagram.com/accounts/logout";

let fetchNum = 3;
let fetchTimes = 3;

async function fetch() {
  // setup the driver
  let driver = setUp();

  // login to instagram
  await loginInstagram(driver, username, password);
  await checkSaveLoginInfoNoti(driver);
  await addInstaToHomeScreen(driver);

  await driver.sleep(1000);
  await driver.sleep(5);

  await driver.switchTo().newWindow("tab");

  let countNum = 1;
  let countFetch = 1;
  let flagFinish = 0;

  for (let i = 0; i < fetchTimes; i++) {
    for (let j = 1; j < fetchNum + 1; j++) {
      // switch to tab 2
      await driver.getAllWindowHandles().then(async function (handles) {
        return driver.switchTo().window(handles[1]);
      });

      // random actions
      await randomActionSelector(driver);

      // switch to tab 1
      await driver.getAllWindowHandles().then(async function (handles) {
        return driver.switchTo().window(handles[0]);
      });
      await driver.sleep(getRandomFloat(3000, 5000));
      await driver.get(url);
      await driver.sleep(getRandomFloat(3000, 5000));
      //copying html response
      let htmlText = await driver
        .wait(until.elementLocated(By.xpath("/html/body/pre")), 5000)
        .getText();

      // text to json
      let jsonInfo = JSON.parse(htmlText);

      // write data into files
      if (jsonInfo.next_max_id != null) {
        let pathF1 = path.relative(
          `.\\fetch_data\\follower_list\\${countFetch}_follower_list.txt`,
          __dirname
        );
        let pathF2 = path.relative(
          `.\\fetch_data\\follower_list_extra\\${countFetch}_follower_list_extra.txt`,
          __dirname
        );
        let pathF3 = path.relative(
          `.\\fetch_data\\response\\${countFetch}_response.txt`,
          __dirname
        );

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

        for (item in userItem) {
          console.log(item.username);
          fs.appendFileSync(pathF1, `${countNum} ${item.username}\n`, (e) => {
            if (err) {
              console.log(err);
            }
          });
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

        fs.appendFileSync(pathF1, `next_max_id = ${nextMaxId}\n`, (e) => {
          if (err) {
            console.log(err);
          }
        });
        fs.appendFileSync(pathF2, `next_max_id = ${nextMaxId}\n`, (e) => {
          if (err) {
            console.log(err);
          }
        });

        console.log(`##### FETCH_NUM = ${j}\n`);

        url = `https://i.instagram.com/api/v1/friendships/273583714/followers/?count=100&max_id=${nextMaxId}`;

        await driver.sleep(2000);

        countFetch++;
        await driver.get(url);
      }

      console.log(`This is countFetch: ${countFetch}`);
      console.log(`This is countNum: ${countNum}`);

      if (jsonInfo.next_max_id == null) {
        if (jsonInfo.usesr != null) {
          let pathF1 = path.relative(
            `.\\fetch_data\\follower_list\\${countFetch}_follower_list.txt`,
            __dirname
          );
          let pathF2 = path.relative(
            `.\\fetch_data\\follower_list_extra\\${countFetch}_follower_list_extra.txt`,
            __dirname
          );
          let pathF3 = path.relative(
            `.\\fetch_data\\response\\${countFetch}_response.txt`,
            __dirname
          );

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

          for (item in userItem) {
            console.log(item.username);
            fs.appendFileSync(pathF1, `${countNum} ${item.username}\n`, (e) => {
              if (err) {
                console.log(err);
              }
            });
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
          // write down the error ina file
          let pathError = path.relative(".\\fetch_data\\error.txt", __dirname);
          fs.appendFileSync(pathError, htmlText, (e) => {
            if (err) {
              console.log(err);
            }
          });

          console.log("-----Error from Instagram! Check the error file-----");
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
    await driver.sleep(100000);

    // login to instagram after 1 hour on the first tab
    await driver.getAllWindowHandles().then(async function (handles) {
      return driver.switchTo().window(handles[0]);
    });
    await loginInstagram(driver, username, password);
    await cancelNotificaiton(driver);
    await driver.sleep(5000);

    //create a second tab
    await driver.switchTo().newWindow("tab");
  }
}
