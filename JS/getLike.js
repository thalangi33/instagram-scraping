const { Builder, By, until, Key } = require("selenium-webdriver");
const fetch = require("node-fetch");
const fs = require("fs-extra");
require("chromedriver");
require("geckodriver");

export async function postLike(postID) {
  let end_cursor;
  let count;
  function random() {
    return Math.floor(Math.random() * 5000);
  }
  // async function sendHumanKeys(element, keys) {
  //   for (let i = 0; i < keys.length; i++) {
  //     await element.sendKeys(keys[i]);
  //     try {
  //       await driver.sleep(random() / 10);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // }

  // const driver = await new Builder().forBrowser("chrome").build();

  // await driver.get("https://www.instagram.com");
  // await driver.sleep(random());

  // let account = await driver.findElement(By.css("input._2hvTZ.pexuQ.zyHYP"));
  // await sendHumanKeys(account, userName);
  // await driver.sleep(random());
  // let accountPass = await driver.findElement(By.name("password"));
  // await sendHumanKeys(accountPass, password);
  // await driver.sleep(random());
  // await driver.findElement(By.css("button.sqdOP.L3NKy.y3zKF")).click();
  // await driver.sleep(random());
  // await driver.wait(until.elementsLocated(By.css("button._a9--._a9_1"), 10000));
  // await driver.findElement(By.css("button._a9--._a9_1")).click();
  // await driver.sleep(random());

  await driver.get(
    `https://www.instagram.com/graphql/query/?query_hash=d5d763b1e2acf209d62d22d184488e57&variables={%22shortcode%22:%22${postID}%22,%22include_reel%22:false,%22first%22:50}`
  );
  await driver
    .findElement(By.xpath("/html/body/pre"))
    .getText()
    .then((text) => {
      let likes = JSON.parse(text);
      let liker = likes.data.shortcode_media.edge_liked_by.edges;
      end_cursor =
        likes.data.shortcode_media.edge_liked_by.page_info.end_cursor;
      count =
        Math.floor(likes.data.shortcode_media.edge_liked_by.count / 50) + 1;
      liker.forEach((fol) => {
        fs.appendFile("./like.txt", `${fol.node.username}\n`, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    });

  console.log(end_cursor);
  for (let i = 1; i < count; i++) {
    await driver.get(
      `https://www.instagram.com/graphql/query/?query_hash=d5d763b1e2acf209d62d22d184488e57&variables={%22shortcode%22:%22${postID}%22,%22include_reel%22:false,%22first%22:50,%22after%22:%22${end_cursor}%22}`
    );
  }
}
