import puppeteer from "puppeteer";
import GoLogin from "gologin";
const { connect } = puppeteer;

const TOKEN = "";

const accounts = [
  {
    username: "",
    password: "",
    browser_id: "",
  },
];

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
    await page.type(emailInputSltr, account.username, { delay: 100 });
    console.log("Typing username: ", account.username);

    let passwordInputSltr = "input#password";
    await page.waitForSelector(passwordInputSltr);
    await page.type(passwordInputSltr, account.password, { delay: 100 });
    console.log("Typing password: ***********");

    let loginBtnSltr2 = "button[type='button']";
    await page.waitForSelector(loginBtnSltr2, { visible: true });
    await page.focus(loginBtnSltr2);
    await page.click(loginBtnSltr2);

    console.log("Logging in...");

    await page.waitForFunction(
      () => {
        return (
          window.location.href === "https://cfph-goldrush.onstove.com/Wheel/" ||
          document.querySelector(".stds-dialog-footer") !== null ||
          document.querySelector(".captcha-parent") !== null
        );
      },
      { timeout: 60000 }
    );

    // Get the condition met inside the browser
    const conditionMet = await page.evaluate(() => {
      if (window.location.href.includes("cfph-goldrush.onstove.com/Wheel")) {
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
      let new_page = "https://cfph-goldrush.onstove.com/GPBoxFestival/Index";
      await page.goto(new_page, { waitUntil: "domcontentloaded" });

      await page.waitForSelector(".login-area", {
        visible: true,
        timeout: 60000,
      });

      // delay 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let alerts = [];

      // Set up the listener
      page.on("dialog", async (dialog) => {
        if (dialog.message().includes("is provided on your ingame storage.")) {
          let lotto = dialog
            .message()
            .replace("is provided on your ingame storage.", "")
            .trim();
          alerts.push(lotto);
        }

        await dialog.accept(); // you could use dialog.dismiss() for cancel
      });

      // ------------------------------------------
      // ------------------------------------------
      let ign = await page.evaluate(() => {
        let ign = document.querySelector(".login-area li:nth-child(1) span");
        return ign.innerText;
      });

      let daily_participation = await getDailyParticipation(page);
      let gp = await getGP(page);
      let gacha = await getItemCount(page, 4);
      let utility = await getItemCount(page, 5);
      let surprise = await getItemCount(page, 6);

      while (daily_participation < 10 && gp > 21000) {
        await page.click("#ul-category li:nth-child(1)");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await page.click("#ul-price li:nth-child(3)");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await page.click("#ul-count li:nth-child(2)");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await page.click(".ico.btn-make");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Getting new data
        daily_participation = await getDailyParticipation(page);
        gp = await getGP(page);
        gacha = await getItemCount(page, 4);
        utility = await getItemCount(page, 5);
        surprise = await getItemCount(page, 6);

        console.clear();
        console.log("----------------------------- ");
        console.log("In-game Name: ", ign);
        console.log("Game Point: ", gp.toLocaleString(), "GP");
        console.log("Daily Participation: ", daily_participation);
        console.log("Total Gacha: ", gacha);
        console.log("Total Utility: ", utility);
        console.log("Total Surprise: ", surprise);
        console.log("----------------------------- ");
        if (daily_participation < 10 && gp > 21000) {
          console.log(`The wizard is still crafting...`);
        }
      }

      alerts.forEach((alert, index) => {
        console.log("✨ ", alert);
      });

      // change URL TO
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
        await closeResources(page, browser, GL);
        return false;
      }
    } else if (conditionMet === "captcha") {
      await closeResources(page, browser, GL);
      return false;
    } else {
      await closeResources(page, browser, GL);
      return false;
    }

    await closeResources(page, browser, GL);
    return true;
  } catch (error) {
    await closeResources(page, browser, GL);
    return false;
  }
}

async function processAccountsWithDelay() {
  for (let i = 0; i < accounts.length; i++) {
    await login(accounts[i].browser_id, accounts[i]);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

// processAccountsWithDelay();

async function closeResources(page, browser, GL) {
  try {
    if (page) await page.close();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (browser) await browser.close();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (GL) await GL.stop();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (err) {
    console.error("Error closing resources:", err);
  }
}
async function getDailyParticipation(page) {
  try {
    return await page.evaluate(() => {
      const element = document.querySelector(
        ".login-area li:nth-child(3) span"
      );
      if (!element) return null;

      const text = element.innerText;
      const timesIndex = text.indexOf("Times");
      if (timesIndex === -1) return null;

      return parseInt(text.slice(0, timesIndex));
    });
  } catch (error) {
    console.error("Failed to get daily participation:", error);
    return null;
  }
}
async function getGP(page) {
  try {
    return await page.evaluate(() => {
      const element = document.querySelector(
        ".login-area li:nth-child(2) span"
      );
      if (!element) return null;

      const text = element.innerText;
      const gpIndex = text.indexOf("GP");
      if (gpIndex === -1) return null;

      return text.slice(0, gpIndex).trim().replace(",", "");
    });
  } catch (error) {
    console.error("Failed to get GP:", error);
    return null;
  }
}
async function getItemCount(page, listIndex) {
  try {
    return await page.evaluate((index) => {
      const selector = `.login-area li:nth-child(${index}) span`;
      const element = document.querySelector(selector);
      if (!element) return null;

      const text = element.innerText;
      const pcsIndex = text.indexOf("pcs");
      if (pcsIndex === -1) return null;

      return text.slice(0, pcsIndex).trim();
    }, listIndex);
  } catch (error) {
    console.error(
      `Failed to get item count at li:nth-child(${listIndex}):`,
      error
    );
    return null;
  }
}
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
