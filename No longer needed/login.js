import puppeteer from "puppeteer";
import GoLogin from "gologin";

import dotenv from "dotenv";

dotenv.config();
const { connect } = puppeteer;

const TOKEN = process.env.TOKEN;

let homepage_url =
  "https://accounts.onstove.com/login?style_type=cf&redirect_url=https%3A%2F%2Fcfph-goldrush.onstove.com%2FMyInfo%2FWinningHistory";

async function login(PROFILE_ID, account) {
  const GL = new GoLogin({
    token: TOKEN,
    profile_id: PROFILE_ID,
  });

  const { status, wsUrl } = await GL.start().catch((e) => {
    console.trace(e);
    return { status: "failure" };
  });

  if (status !== "success") {
    console.log("Invalid status");
    return;
  }

  const browser = await connect({
    browserWSEndpoint: wsUrl.toString(),
    ignoreHTTPSErrors: true,
  });

  // -------------------
  // -------------------
  // -------------------

  const page = await browser.newPage();
  await page.goto(homepage_url, { waitUntil: "domcontentloaded" });

  // let loginBtnSltr = ".login-btn";
  // await page.waitForSelector(loginBtnSltr, { visible: true });
  // await page.click(loginBtnSltr);

  // console.log("Going to different page");
  // await new Promise((resolve) => setTimeout(resolve, 10000));

  let toWaitSltr = ".facebook";
  await page.waitForSelector(toWaitSltr, { visible: true, timeout: 60000 });
  console.log("facebook is found");

  let emailInputSltr = "input#id";
  await page.waitForSelector(emailInputSltr);
  await page.type(emailInputSltr, account.username, { delay: 100 });
  console.log("email input is found");

  let passwordInputSltr = "input#password";
  await page.waitForSelector(passwordInputSltr);
  await page.type(passwordInputSltr, account.password, { delay: 100 });
  console.log("password input is found");

  let loginBtnSltr2 = "button[type='button']";
  await page.waitForSelector(loginBtnSltr2, { visible: true });
  await page.focus(loginBtnSltr2);
  await page.click(loginBtnSltr2);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const footerSelector = ".stds-dialog-footer";
  const buttonSelector = ".stds-dialog-footer button";

  // Wait for the footer element to appear (optional: use try-catch to prevent errors if it doesn't exist)
  const footerExists = await page.$(footerSelector);

  if (footerExists) {
    console.log("✅ Footer exists! Clicking the button inside...");

    // Wait for the button inside the footer to be available
    await page.waitForSelector(buttonSelector, { visible: true });

    // Click the button inside the footer
    await page.focus(buttonSelector);
    await page.click(buttonSelector);

    console.log("✅ Button inside footer clicked!");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let loginBtnSltr2 = "button[type='button']";
    await page.waitForSelector(loginBtnSltr2, { visible: true });
    await page.focus(loginBtnSltr2);
    await page.click(loginBtnSltr2);
  } else {
    console.log("❌ Footer does not exist. Skipping button click.");
  }

  await page.waitForFunction(
    () =>
      window.location.href ===
      "https://cfph-goldrush.onstove.com/MyInfo/WinningHistory",
    { timeout: 60000 } // Wait up to 30 seconds
  );

  await page.waitForSelector(".util-area .inner", {
    visible: true,
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const callname = await page.evaluate(() => {
    const element = document.querySelector(".util-area .inner .col.col4");
    return element ? element.innerText : null;
  });

  if (callname) {
    const extractedText = callname.split(",").pop().trim();
    console.log("✅ Extracted Text:", extractedText);
    account.callname = extractedText;
  } else {
    console.log("❌ Element not found!");
  }

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const myECoinText = await page.evaluate(() => {
    const element = document.querySelector(".util-area .e-coin #myECoin");
    return element ? element.innerText : null;
  });

  console.log("✅ myECoin Text:", myECoinText);
  account.credits = myECoinText;
  account.login = true;

  // await new Promise((resolve) => setTimeout(resolve, 20000));

  // try {
  //   // let accounts = await readCSV("accounts.csv");
  //   let accounts = [
  //     {
  //       username: "dolores758",
  //       password: "boktitelo1",
  //     },
  //   ];

  //   for (const account of accounts) {
  //     console.log(account);
  //   }

  //   // Write the updated data back to the CSV file
  //   // await writeCSV("accounts.csv", accounts);
  //   console.log("✅ CSV file updated!");
  // } catch (error) {
  //   console.error("❌ Failed to read CSV:", error);
  // }

  await page.close();
  await browser.close();
  await GL.stop();

  return account;
}

export default login;
