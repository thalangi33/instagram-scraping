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

async function loginInstagram(driver, bot_username, bot_password) {
  await driver.get("https://www.instagram.com");

  let login = await driver.wait(
    until.elementLocated(
      By.xpath(
        "/html/body/div[1]/section/main/article/div/div/div[2]/div[3]/button[1]"
      )
    )
  );
  console.log("Login page is ready!");
  await login.click();

  await driver.sleep(2000);

  let username = await driver.wait(
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

  let password = await driver.wait(
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

  let loginButton = await driver.wait(
    until.elementLocated(
      By.xpath(
        "/html/body/div[1]/section/main/article/div/div/div[2]/form/div[1]/div[6]/button"
      )
    )
  );

  await driver.sleep(getRandomFloat(1000, 1500));

  await loginButton.click();

  await driver.sleep(getRandomFloat(5000, 6500));
}

async function checkSaveLoginInfoNoti(driver) {
  await driver.sleep(getRandomFloat(2000, 3500));
  try {
    let notNow = await driver.wait(
      until.elementLocated(By.css("button.sqdOP.yWX7d.y3zKF")),
      100000
    );
    console.log("notNow found!");
    await driver.sleep(getRandomFloat(1000, 3000));
    await notNow.click();
    console.log("notNow clicked!");
  } catch (e) {
    // if (e.name === "TimeoutError")
    console.log(e.name);
    return false;
  }
  return true;
}

async function addInstaToHomeScreen(driver) {
  await driver.sleep(getRandomFloat(2000, 3500));
  try {
    let cancel = await driver.wait(
      until.elementLocated(By.css("button._a9--._a9_1")),
      100000
    );
    await driver.sleep(getRandomFloat(1000, 3000));
    await cancel.click();
  } catch (e) {
    if (e.name === "NoSuchElementError")
      console.log("No add insta to home screen notification");
    return false;
  }
  return true;
}

async function turnOnNotificaiton(driver) {
  await driver.sleep(getRandomFloat(2000, 3500));
  try {
    let cancel = await driver.wait(
      until.elementLocated(By.css("button._a9--._a9_1")),
      100000
    );
    await driver.sleep(getRandomFloat(1000, 3000));
    await cancel.click();
  } catch (e) {
    if (e.name === "NoSuchElementError") console.log("No turn on notification");
    return false;
  }
  return true;
}
async function cancelNotificaiton(driver) {
  try {
    while (driver.findElement(By.xpath("/html/body/div[5]/div"))) {
      // click cancel for add Instagram to your Home screen
      await addInstaToHomeScreen(driver);
      // turn off the notification
      await turnOnNotificaiton(driver);
    }
  } catch (e) {
    if (e.name === "NoSuchElementError") console.log("No presentation");
  }
}

async function goToHomepage(driver) {
  let homepage = await driver.wait(
    until.elementLocated(
      By.xpath(
        "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/nav/div/div/div/div/div/div[1]/a"
      )
    ),
    3000
  );
  await homepage.click();
  console.log("Going to homepage!");
}

async function clickExploreSection(driver) {
  let explore = await driver.wait(
    until.elementLocated(
      By.xpath(
        "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/nav/div/div/div/div/div/div[2]/a"
      )
    ),
    3000
  );
  await explore.click();
  console.log("Going to explore section!");
}

async function clickActivitySection(driver) {
  let activity = await driver.wait(
    until.elementLocated(
      By.xpath(
        "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/nav/div/div/div/div/div/div[4]/a"
      )
    ),
    3000
  );
  await activity.click();
  console.log("Going to homepage!");
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
  try {
    let randomPost = await driver.wait(
      until.elementLocated(
        By.xpath(
          `/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/div[1]/div/div[${Math.floor(
            getRandomFloat(1, 5)
          )}]/div[${Math.floor(getRandomFloat(1, 6))}]/div/a/div[1]/div[2]`
        )
      ),
      3000
    );
    await driver.sleep(2000);
    await driver.executeScript("arguments[0].scrollIntoView();", randomPost);
    await driver.sleep(2000);
    await randomPost.click();
    console.log("Clicking on a random post!");
  } catch (e) {
    console.log(e);
    return;
  }
  try {
    let saveButton = await driver.wait(
      until.elementLocated(
        By.css("div > button._abl- > div._abm0 > svg._ab6-:nth-child(1)")
      ),
      3000
    );
    saveButton = driver.findElements(
      By.css("div > button._abl- > div._abm0 > svg._ab6-")
    );
    let randomNum = Math.floor(getRandomFloat(1, saveButton.length + 1));
    console.log(`This is the random number: ${randomNum}`);
    console.log(`This is the number of save button: ${saveButton}`);
  } catch (e) {
    console.log(e);
    return;
  }
  try {
    for (let i = 0; i < loadNum; i++) {
      randomPost = await driver.wait(
        until.elementLocated(
          By.xpath(
            `/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/section/div[1]/div/article[${randomNum}]`
          )
        ),
        3000
      );
      await driver.executeScript("arguments[0].scrollIntoView();", randomNum);
      await driver.sleep(3000);

      await driver.executeScript(
        "window.scrollTo(0, arguments[0]);",
        saveButton[randomNum - 1].location.get("y")
      );
      await driver.sleep(3000);

      if (Math.random(getRandomFloat(1, 3)) == 1) {
        saveButton[randomNum - 1].click();
      }
      await driver.sleep(3000);

      saveButton = await driver.findElements(
        By.css("div > button._abl- > div._abm0 > svg._ab6-")
      );
      randomNum = Math.floor(
        getRandomFloat(saveButton.length - 3, saveButton.length)
      );

      console.log(`This is the random num: ${randomNum}`);
      console.log(`This is the number of save button: ${saveButton.length}`);
      console.log(`This is ${i} times scrolled`);
    }
  } catch (e) {
    console.log(e);
  }
  await goToHomepage(driver);
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

  for (const letter in sendeeString) {
    await sendee.sendKeys(letter);
    await driver.sleep(getRandomFloat(0, 0.5));
  }
  await driver.sleep(1000);

  await driver.get("https://www.instagram.com/");
}

async function activityPause(driver) {
  await clickActivitySection(driver);
  await driver.sleep(5000);
  await driver.get("https://www.instagram.com/explore/people/");
  console.log("Going to the people suggestion");
  await driver.sleep(5000);
  await goToHomepage(driver);
}

async function main() {
  USERNAME = "fapnurahavich";
  PASSWORD = "look4kol";

  const driver = setup();
  await loginInstagram(driver, USERNAME, PASSWORD);
  await checkSaveLoginInfoNoti(driver);
  await addInstaToHomeScreen(driver);
  await turnOnNotificaiton(driver);
  // console.log("hello");
  // await cancelNotificaiton(driver);
  await homepageScrolling(driver, 3);
  await exploreScrolling(driver, 4);
  await savingRandomPost(driver, 5);
}

main();
