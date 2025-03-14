import cloneGoLoginProfile from "./clone_profile.js";
import { getLatestProfile } from "./list_profile.js";
import { readCSV, writeCSV } from "./database_reader.js";

import login from "./login.js";

// import getProfile from "./get_profile.js";
// import updateProfile from "./update_profile.js";
// import { checkProxy, updateProxy } from "./proxy.js";
// import { getRandomProxy } from "./proxy.js";

import dotenv from "dotenv";

dotenv.config();

const PROFILE_ID_CLONE = process.env.PROFILE_ID_CLONE;
const TOKEN = process.env.TOKEN;

async function processAccounts() {
  try {
    let accounts = await readCSV("accounts_database.csv");

    for (const account of accounts) {
      if (account.ECOIN === "undefined") {
        account.username = account.USERNAME;
        account.password = account.PASSWORD;

        try {
          await cloneGoLoginProfile(PROFILE_ID_CLONE);
          const profile_info = await getLatestProfile();
          const account_data = await login(profile_info.id, account);

          if (account_data.login) {
            account.ECOIN = account_data.credits;
            account.IGN = account_data.callname;
          }

          console.log(account_data);

          await deleteProfile(profile_info.id);
        } catch (error) {
          // account.ISLOGGEDIN = "unknown";
          // console.error("⚠️ Error processing account:", account.EMAIL, error);
        }
      }
    }

    // Write the updated data back to the CSV file
    await writeCSV("accounts_database.csv", accounts);
    console.log("✅ CSV file updated!");
  } catch (error) {
    console.error("❌ Failed to read CSV:", error);
  }

  return;
}

// ✅ Run the function
processAccounts();

async function deleteProfile(profileId) {
  try {
    const response = await fetch(
      `https://api.gologin.com/browser/${profileId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log(`Profile ${profileId} deleted successfully`);
  } catch (error) {
    console.error("❌ Error deleting profile:", error.message);
  }
}
