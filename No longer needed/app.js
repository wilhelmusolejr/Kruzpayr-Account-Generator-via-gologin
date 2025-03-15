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

// const PROFILE_ID_CLONE = process.env.PROFILE_ID_CLONE;

const profile_ids = [
  "67d5bc1e1c7f4b4418eefc6a",
  "67d3cfc81c7f4b4418d7623f",
  "67d5bc3069fa345e7832b13d",
  "67d5bc2c1c7f4b4418eefc8b",
  "67d5bc2969fa345e7832b132",
];

const PROFILE_ID_CLONE =
  profile_ids[Math.floor(Math.random() * profile_ids.length)];

const TOKEN = process.env.TOKEN;
let limit = 100;

async function processAccounts() {
  try {
    let accounts = await readCSV("accounts_database.csv");
    let processed_accounts = [];

    let index = 0;
    for (const account of accounts) {
      console.log("Processing account:", index, "of ", limit);
      if (account.ECOIN === "undefined") {
        try {
          await cloneGoLoginProfile(PROFILE_ID_CLONE);
          const profile_info = await getLatestProfile();
          const account_data = await login(profile_info.id, account);

          await deleteProfile(profile_info.id);
          processed_accounts.push(account_data);
        } catch (error) {
          // account.ISLOGGEDIN = "unknown";
          // console.error("⚠️ Error processing account:", account.EMAIL, error);
        }

        index++;
        if (index >= limit) {
          break;
        }
      }
    }

    // Write the updated data back to the CSV file
    await writeCSV("accounts_database.csv", accounts);

    console.clear();
    console.log("✅ CSV file updated!");

    for (const account of processed_accounts) {
      console.log(account.USERNAME, account.ECOIN);
    }
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
