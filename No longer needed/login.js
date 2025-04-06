import puppeteer from "puppeteer";
import GoLogin from "gologin";

import dotenv, { parse } from "dotenv";

dotenv.config();
const { connect } = puppeteer;

const TOKEN = process.env.TOKEN;

let homepage_url =
  "https://accounts.onstove.com/login?style_type=cf&redirect_url=https://cfph-goldrush.onstove.com/Wheel/";

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

  try {
    let toWaitSltr = ".facebook";
    await page.waitForSelector(toWaitSltr, { visible: true, timeout: 60000 });

    let emailInputSltr = "input#id";
    await page.waitForSelector(emailInputSltr);
    await page.type(emailInputSltr, account.USERNAME, { delay: 100 });
    console.log("Typing username: ", account.USERNAME);

    let passwordInputSltr = "input#password";
    await page.waitForSelector(passwordInputSltr);
    await page.type(passwordInputSltr, account.PASSWORD, { delay: 100 });
    console.log("Typing password: ***********");

    let loginBtnSltr2 = "button[type='button']";
    await page.waitForSelector(loginBtnSltr2, { visible: true });
    await page.focus(loginBtnSltr2);
    await page.click(loginBtnSltr2);

    console.log("Logging in...");

    await page.waitForFunction(
      () => {
        return (
          window.location.href ===
            "https://cfph-goldrush.onstove.com/Wheel/Index" ||
          document.querySelector(".stds-dialog-footer") !== null ||
          document.querySelector(".captcha-parent") !== null
        );
      },
      { timeout: 60000 }
    );

    // console.log("✅ Condition met!");

    // Get the condition met inside the browser
    const conditionMet = await page.evaluate(() => {
      if (
        window.location.href === "https://cfph-goldrush.onstove.com/Wheel/Index"
      ) {
        return "url";
      } else if (document.querySelector(".stds-dialog-footer")) {
        return "footer";
      } else if (document.querySelector(".captcha-parent")) {
        return "captcha";
      }
      return "unknown"; // Fallback (should never happen)
    });

    // Log based on the condition met
    if (conditionMet === "url") {
      // console.log("✅ URL has changed to WinningHistory.");
    } else if (conditionMet === "footer") {
      const footerSelector = ".stds-dialog-footer";
      const buttonSelector = ".stds-dialog-footer button";

      // Wait for the footer element to appear (optional: use try-catch to prevent errors if it doesn't exist)
      const footerExists = await page.$(footerSelector);

      if (footerExists) {
        // Wait for the button inside the footer to be available
        await page.waitForSelector(buttonSelector, { visible: true });

        // Click the button inside the footer
        await page.focus(buttonSelector);
        await page.click(buttonSelector);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        let loginBtnSltr2 = "button[type='button']";
        await page.waitForSelector(loginBtnSltr2, { visible: true });
        await page.focus(loginBtnSltr2);
        await page.click(loginBtnSltr2);

        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        await page.close();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await browser.close();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await GL.stop();
        return false;
      }
    } else if (conditionMet === "captcha") {
      await page.close();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await browser.close();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await GL.stop();
      return false;
    } else {
      await page.close();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await browser.close();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await GL.stop();
      return false;
    }

    await page.waitForSelector(".util-area .inner", {
      visible: true,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // const callname = await page.evaluate(() => {
    //   const element = document.querySelector(".util-area .inner .col.col4");
    //   return element ? element.innerText : null;
    // });

    // if (callname) {
    //   const extractedText = callname.split(",").pop().trim();
    //   console.log("✅ Extracted Text:", extractedText);
    // }

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const myECoinText = await page.evaluate(() => {
      const element = document.querySelector(".util-area .e-coin #myECoin");
      return element ? element.innerText : null;
    });

    // console.log("✅ myECoin Text:", myECoinText);
    account.ECOIN = myECoinText;
    account.login = true;
    // await new Promise((resolve) => setTimeout(resolve, 6000000));

    if (parseInt(myECoinText) === 0) {
      console.log("Ecoin is 0");
      await page.close();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await browser.close();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await GL.stop();
      return true;
    }

    page.on("dialog", async (dialog) => {
      console.log("Alert message:", dialog.message());
      account.GOLD_COIN = parseInt(myECoinText) * 2;
      account.ECOIN = "0";
      await dialog.dismiss(); // or dialog.accept() if you want to confirm the alert
    });

    if (parseInt(myECoinText) > 0) {
      await page.click(".coin-info.gold-coin a");
      await page.waitForSelector("#chargeAmt", {
        visible: true,
      });
      await page.type("#chargeAmt", myECoinText, { delay: 100 });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await page.click(".btn-charge");
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));

    await page.close();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await browser.close();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await GL.stop();

    return true;
  } catch (error) {
    await page.close();
    await browser.close();
    await GL.stop();
    return false;
  }
}

export default login;
