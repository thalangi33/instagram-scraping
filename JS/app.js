const { Builder, By, until, Key } = require("selenium-webdriver");
const fs = require("fs-extra");
const chrome = require("selenium-webdriver/chrome");
const should = require("chai").should();
require("chromedriver");

async function postLike(
  id,
  postID,
  userName,
  password,
  driver,
  end_cursor_like = null
) {
  // No. of times needed to get all user data
  let count;
  // To record if there is next page
  let next_page;
  // get random no. from 0-5000
  function random(max) {
    return Math.random() * max;
  }
  // enter text word by word
  async function sendHumanKeys(element, keys) {
    for (let i = 0; i < keys.length; i++) {
      await element.sendKeys(keys[i]);
      try {
        await driver.sleep(random(500));
      } catch (e) {
        console.log(e);
      }
    }
  }

  fs.appendFile(
    `./posts/${postID}.txt`,
    `Post No.:${id}\nUsername of people who liked the post:\n`,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  console.log(end_cursor_like);

  await driver.getAllWindowHandles().then(async function (handles) {
    return driver.switchTo().window(handles[1]);
  });
  // if no end cursor, get first 50 users
  if (end_cursor_like == null) {
    await driver.get(
      `https://www.instagram.com/graphql/query/?query_hash=d5d763b1e2acf209d62d22d184488e57&variables={%22shortcode%22:%22${postID}%22,%22include_reel%22:false,%22first%22:50}`
    );
    await driver
      .findElement(By.xpath("/html/body/pre"))
      .getText()
      .then((text) => {
        let likes = JSON.parse(text);
        let liker = likes.data.shortcode_media.edge_liked_by.edges;
        end_cursor_like =
          likes.data.shortcode_media.edge_liked_by.page_info.end_cursor;
        count =
          Math.floor(likes.data.shortcode_media.edge_liked_by.count / 50) + 1;
        liker.forEach((fol) => {
          fs.appendFile(
            `./posts/${postID}.txt`,
            `${fol.node.username}\n`,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        });
      });
    await driver.sleep(random(5000));
  }

  // get the rest users
  while (true) {
    await driver.getAllWindowHandles().then(async function (handles) {
      return driver.switchTo().window(handles[1]);
    });

    try {
      await driver.get(
        `https://www.instagram.com/graphql/query/?query_hash=d5d763b1e2acf209d62d22d184488e57&variables={%22shortcode%22:%22${postID}%22,%22include_reel%22:false,%22first%22:50,%22after%22:%22${end_cursor_like}%22}`
      );
      await driver
        .findElement(By.xpath("/html/body/pre"))
        .getText()
        .then((text) => {
          let likes = JSON.parse(text);
          let liker = likes.data.shortcode_media.edge_liked_by.edges;
          end_cursor_like =
            likes.data.shortcode_media.edge_liked_by.page_info.end_cursor;
          next_page =
            likes.data.shortcode_media.edge_liked_by.page_info.has_next_page;
          liker.forEach((fol) => {
            fs.appendFile(
              `./posts/${postID}.txt`,
              `${fol.node.username}\n`,
              (err) => {
                if (err) {
                  console.log(err);
                }
              }
            );
          });
        });
      if (next_page == false) {
        break;
      }
    } catch (err) {
      console.log(err);
      break;
    }

    await driver.sleep(random(2500));
    // back to ig page and do random stuffs
    await driver.getAllWindowHandles().then(async function (handles) {
      return driver.switchTo().window(handles[0]);
    });
    await driver.sleep(random(2500));
    await driver.wait(until.elementsLocated(By.css("div._acut"), 10000));
    let el = await driver.findElements(By.css("div._acut"));
    let temp = Math.floor(random(5));
    await el[temp].click();
    await driver.sleep(random(7500));
    switch (temp) {
      case 0:
        break;
      case 1:
        await driver.wait(until.elementsLocated(By.css("div._aagx"), 10000));
        await driver.findElement(By.css("div._aagx")).click();
        break;
      case 2:
        await driver.wait(
          until.elementsLocated(
            By.css("div.futnfnd5.li38xygf.q0p5rdf8.mudwbb97"),
            10000
          )
        );
        await driver
          .findElement(By.css("div.futnfnd5.li38xygf.q0p5rdf8.mudwbb97"))
          .click();
        break;
      case 3:
        await driver.wait(until.elementsLocated(By.css("div._aagx"), 10000));
        await driver.findElement(By.css("div._aagx")).click();
        break;
      case 4:
        await driver.wait(until.elementsLocated(By.css("div._aa73"), 10000));
        await driver.findElement(By.css("div._aa73")).click();
        break;
      default:
        console.log("Error");
        break;
    }
    await driver.sleep(random(2500));
  }
  await driver.getAllWindowHandles().then(async function (handles) {
    return driver.switchTo().window(handles[0]);
  });
  let el = await driver.findElements(By.css("div._acut"));
  await el[5].click();
  await driver.wait(until.elementsLocated(By.css("div._abm4"), 10000));
  let button = await driver.findElements(By.css("div._abm4"));
  await button[1].click();
  await driver.sleep(random(50000));
  // login ig account
  let account = await driver.findElement(By.name("username"));
  await sendHumanKeys(account, userName);
  await driver.sleep(random(5000));
  let accountPass = await driver.findElement(By.name("password"));
  await sendHumanKeys(accountPass, password);
  await driver.findElement(By.css("button.sqdOP.L3NKy.y3zKF")).click();
  await driver.sleep(15000);
  await driver.findElement(By.css("button.sqdOP.yWX7d.y3zKF")).click();
  await driver.wait(until.elementsLocated(By.css("button._a9--._a9_1"), 10000));
  await driver.findElement(By.css("button._a9--._a9_1")).click();
  await driver.sleep(random(5000));
}

// the main function
async function getLike(
  target,
  userName,
  password,
  shortcode = null,
  end_cursor_like = null
) {
  let postID = [];
  let postNo;
  // get random no. with maximum max
  function random(max) {
    return Math.random() * max;
  }
  // enter text word by word
  async function sendHumanKeys(element, keys) {
    for (let i = 0; i < keys.length; i++) {
      await element.sendKeys(keys[i]);
      try {
        await driver.sleep(random(500));
      } catch (e) {
        console.log(e);
      }
    }
  }
  // async forEach function
  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  // set user-agent
  const opts = new chrome.Options();
  opts.addArguments([
    'user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"',
  ]);

  // open the drive and go to ig page
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(opts)
    .build();
  await driver.get("https://www.instagram.com");
  await driver.sleep(random(20000));

  // login ig account
  let account = await driver.findElement(By.name("username"));
  await sendHumanKeys(account, userName);
  await driver.sleep(random(5000));
  let accountPass = await driver.findElement(By.name("password"));
  await sendHumanKeys(accountPass, password);
  await driver.findElement(By.css("button.sqdOP.L3NKy.y3zKF")).click();
  await driver.sleep(15000);
  await driver.findElement(By.css("button.sqdOP.yWX7d.y3zKF")).click();
  await driver.wait(until.elementsLocated(By.css("button._a9--._a9_1"), 10000));
  await driver.findElement(By.css("button._a9--._a9_1")).click();
  await driver.sleep(random(5000));

  // start querying shortcode of kol's posts
  // get first 50 shortcodes
  await driver.switchTo().newWindow("tab");

  if (shortcode == null) {
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

    // get the rest shortcodes
    let count = Math.floor(postNo / 50);
    for (let i = 1; i <= count; i++) {
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
            if (post[j] == null) {
              break;
            }
            postID[50 * i + j] = post[j].node.shortcode;
          }
        });
      await driver.sleep(random(15000));
    }

    // start querying the user who liked the post
    // record the shortcodes of posts
    console.log(postID);
    let shortcodes = postID.toString();

    fs.appendFileSync("./post.txt", shortcodes, (err) => {
      if (err) {
        console.log(err);
      }
    });

    // get usernames of every posts
    for (let i = 0; i < postNo; i++) {
      await postLike(postID[i], userName, password, driver);
    }
  } else {
    let a;
    fs.readFileSync("post.txt", "utf8", function (err, data) {
      postID = data.split(",");
    });
    for (let i = 0; i < postID.length; i++) {
      try {
        postID[i].should.equal(shortcode);
      } catch (e) {
        continue;
      }
      a = i;
      break;
    }
    for (let i = a; i < postNo; i++) {
      await postLike(i, postID[i], userName, password, driver);
    }
  }

  await driver.quit();
}

getLike(273583714, "ceplutenocnarovich", "look4kol");
