const { Builder, By, until, Key } = require("selenium-webdriver");
const fetch = require("node-fetch");
const fs = require("fs-extra");
require("chromedriver");
require("geckodriver");
// import { postLike } from "./getLike.js";

async function getLike(target, userName, password) {
  let postID = [];
  let end_cursor;
  let postNo;
  function random() {
    return Math.random() * 5000;
  }
  async function sendHumanKeys(element, keys) {
    for (let i = 0; i < keys.length; i++) {
      await element.sendKeys(keys[i]);
      try {
        await driver.sleep(random() / 10);
      } catch (e) {
        console.log(e);
      }
    }
  }

  const driver = await new Builder().forBrowser("chrome").build();
  await driver.get("https://www.instagram.com");
  await driver.sleep(random());

  let account = await driver.findElement(By.css("input._2hvTZ.pexuQ.zyHYP"));
  await sendHumanKeys(account, userName);
  await driver.sleep(random());
  let accountPass = await driver.findElement(By.name("password"));
  await sendHumanKeys(accountPass, password);
  await driver.sleep(random());
  await driver.findElement(By.css("button.sqdOP.L3NKy.y3zKF")).click();
  // await driver.sleep(random());
  await driver.wait(until.elementsLocated(By.css("button._a9--._a9_1"), 10000));
  await driver.findElement(By.css("button._a9--._a9_1")).click();
  await driver.sleep(random());

  await driver.switchTo().newWindow("tab");
  await driver.get(
    `https://www.instagram.com/graphql/query/?query_hash=69cba40317214236af40e7efa697781d&variables={%22id%22:%22${target}%22,%22first%22:50}`
  );
  await driver
    .findElement(By.xpath("/html/body/pre"))
    .getText()
    .then((text) => {
      let posts = JSON.parse(text);
      let post = posts.data.user.edge_owner_to_timeline_media.edges;
      end_cursor =
        posts.data.user.edge_owner_to_timeline_media.page_info.end_cursor;
      postNo = posts.data.user.edge_owner_to_timeline_media.count;
      for (let i = 0; i < 50; i++) {
        postID[i] = post[i].node.shortcode;
      }
    });

  console.log(postID);
  let count = Math.floor(postNo / 50) + 1;
  for (let i = 1; i <= 2; i++) {
    await driver.get(
      `https://www.instagram.com/graphql/query/?query_hash=69cba40317214236af40e7efa697781d&variables={%22id%22:%22${target}%22,%22first%22:50,%22after%22:%22${end_cursor}%22}`
    );
    await driver
      .findElement(By.xpath("/html/body/pre"))
      .getText()
      .then((text) => {
        let posts = JSON.parse(text);
        let post = posts.data.user.edge_owner_to_timeline_media.edges;
        end_cursor =
          posts.data.user.edge_owner_to_timeline_media.page_info.end_cursor;
        for (let j = 0; j < 50; j++) {
          if (post[i] == null) {
            break;
          }
          postID[50 * i + j] = post[i].node.shortcode;
        }
      });
    await driver.sleep(random() * 3);
  }

  console.log(postID);
  // postLike(postID[1]);
  // postID.forEach((shortcode) => {
  //   postLike(shortcode);
  //   await driver.sleep(random()*100);
  // });
}

getLike(273583714, "ceplutenocnarovich", "look4kol");
