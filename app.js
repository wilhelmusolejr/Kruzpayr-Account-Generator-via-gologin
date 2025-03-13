import dotenv from "dotenv";
import puppeteer from "puppeteer";
import GoLogin from "gologin";

dotenv.config();

const TOKEN = process.env.TOKEN;
const ID = process.env.PROFILE_ID_CLONE;

const { connect } = puppeteer;

async function app(PROFILE_ID) {
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
  console.log("Navigating to website...");
  await page.goto("https://cfph.onstove.com/", {
    waitUntil: "domcontentloaded",
    timeout: 10000,
  });

  // Sign in button
  const signUpBtn = `#signup-btn`;
  await page.waitForSelector(signUpBtn, { visible: true });
  console.log("Clicking Sign Up button...");
  await page.click(signUpBtn);

  const markAll = `input#overview`;
  await page.waitForSelector(markAll, { visible: true });
  console.log("Clicking 'Mark All' checkbox...");
  await page.click(markAll);

  console.log("Wait for 2 seconds");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("Done waiting");

  const agreeButtonSelector = "button.stds-button-primary";
  await page.waitForSelector(agreeButtonSelector, { visible: true });
  console.log("Clicking 'Agree and continue' button...");
  await page.click(agreeButtonSelector);

  const usernameSelector = 'input[autocomplete="username"]';
  await page.waitForSelector(usernameSelector);
  console.log("Typing into username input field...");
  await page.type(usernameSelector, "my_username", { delay: 100 });

  const passwordSelectors = await page.$$('input[autocomplete="new-password"]');
  if (passwordSelectors.length >= 2) {
    console.log("Typing into password field...");
    await passwordSelectors[0].click();
    await passwordSelectors[0].type("test_password", { delay: 50 });

    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Typing into confirm password field...");
    await passwordSelectors[1].click();
    await passwordSelectors[1].type("test_password", { delay: 50 });
  } else {
    console.error("⚠️ Could not find both password fields!");
  }

  const emailSelector = `input[maxlength="50"]`;
  await page.waitForSelector(emailSelector);
  await page.type(emailSelector, "jejejeje3@gmail.com");

  const firstNameSelector = `input[placeholder="First Name"]`;
  await page.waitForSelector(firstNameSelector);
  await page.type(firstNameSelector, "Denver");

  const lastNameSelector = `input[placeholder="Last Name"]`;
  await page.waitForSelector(lastNameSelector);
  await page.type(lastNameSelector, "Nuggets");

  const monthSelector = `#__layout > div > div.layout-body.pt-8 > div > div.mt-8.flex.gap-x-8 > div:nth-child(1) > div > div > button`;
  await page.waitForSelector(monthSelector);
  await page.click(monthSelector);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const monthListSelector = `#tippy-7 > div > div > div > ul`;
  await page.waitForSelector(monthListSelector);

  const listItems = await page.$$(monthListSelector + " > li");
  console.log(listItems.length);

  if (listItems.length > 0) {
    // Pick a random index
    const randomIndex = Math.floor(Math.random() * listItems.length);

    console.log(
      `Clicking random month: ${randomIndex + 1}/${listItems.length}`
    );

    // Click the random `<li>`
    await listItems[randomIndex].click();
  } else {
    console.error("⚠️ No list items found inside the UL!");
  }

  await new Promise((resolve) => setTimeout(resolve, 20000));

  // Get page title
  const title = await page.title();
  console.log("Page Title:", title);

  console.log("✅ Script completed successfully!");

  await page.close();
  await browser.close();
  await GL.stop();
}

app(ID);
