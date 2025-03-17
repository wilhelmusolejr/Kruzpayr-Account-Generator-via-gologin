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
const TOKEN = process.env.TOKEN;
const profile_ids = [
  "67d3cfc81c7f4b4418d7623f",
  "67d6ffbe8ab652349ba4ca9b",
  "67d6ff89db994ecf4eb7159f",
];

async function processAccounts() {
  try {
    let accounts = await readCSV("accounts_database.csv");
    let processed_accounts = [];

    let index = 0;
    let limit = 50;
    for (const account of accounts) {
      if (account.ECOIN === "undefined") {
        console.clear();
        console.log("Processing account:", index, "of ", limit);

        const PROFILE_ID_CLONE =
          profile_ids[Math.floor(Math.random() * profile_ids.length)];
        await cloneGoLoginProfile(PROFILE_ID_CLONE);
        console.log("Profile cloned successfully");
        const profile_info = await getLatestProfile();

        try {
          const account_data = await login(profile_info.id, account);
          console.log("Found ecoin:", account.ECOIN);

          await deleteProfile(profile_info.id);

          if (account_data) {
            processed_accounts.push(account);
          }
        } catch (error) {
          console.error("❌ Error processing account:", error);
        }

        index++;
        if (index >= limit) {
          break;
        }
      }
    }

    // Write the updated data back to the CSV file
    await writeCSV("accounts_database.csv", accounts);
    console.log("✅ CSV file updated!");

    console.log("Processed accounts:", processed_accounts.length);
    for (const account of processed_accounts) {
      console.log(account.USERNAME, account.ECOIN);
    }
  } catch (error) {
    console.error("❌ ERROR:", error);
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
