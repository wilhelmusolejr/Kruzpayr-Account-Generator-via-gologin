import cloneGoLoginProfile from "./clone_profile.js";
import { getLatestProfile } from "./list_profile.js";
import login from "./login.js";
import getProfile from "./get_profile.js";
import updateProfile from "./update_profile.js";
import { readCSV, writeCSV } from "./accounts_preparation.js";
import { checkProxy, updateProxy } from "./proxy.js";
import { getRandomProxy } from "./proxy.js";

import dotenv from "dotenv";

dotenv.config();

const PROFILE_ID_CLONE = process.env.PROFILE_ID_CLONE;

async function processAccounts() {
  try {
    // let accounts = await readCSV("accounts.csv");

    for (const account of accounts) {
      if (account.ISLOGGEDIN === "unknown") {
        try {
          await cloneGoLoginProfile(PROFILE_ID_CLONE);
          const profile_info = await getLatestProfile();

          // Get random proxy
          const proxy = await getRandomProxy();
          await updateProxy(profile_info.id, proxy);

          const login_feedback = await login(profile_info.id, account);

          if (login_feedback.isLoggedIn) {
            let profile_data = await getProfile(profile_info.id);
            profile_data.name = account.EMAIL;
            profile_data.note = `${login_feedback.balance}`;
            await updateProfile(profile_data);
            console.log("✅ Login successful for account:", account.EMAIL);
            account.ISLOGGEDIN = "TRUE";
            account.ISNEEDVERIF = "FALSE";
            account.USERNAME = login_feedback.username;
            account.BALANCE = login_feedback.balance;
          } else {
            console.log("❌ Login failed for account:", account.EMAIL);
            account.ISLOGGEDIN = "FALSE";
          }
        } catch (error) {
          account.ISLOGGEDIN = "unknown";
          console.error("⚠️ Error processing account:", account.EMAIL, error);
        }
      }
    }

    // Write the updated data back to the CSV file
    await writeCSV("accounts.csv", accounts);
    console.log("✅ CSV file updated!");
  } catch (error) {
    console.error("❌ Failed to read CSV:", error);
  }
}

// ✅ Run the function
processAccounts();
