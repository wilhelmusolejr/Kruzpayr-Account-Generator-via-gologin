import axios from "axios";
import generateAccountData from "./account_info_gen.js";
import { writeCSV, readCSV } from "./database_reader.js";

let account_data = generateAccountData();

async function getTermsState() {
  try {
    const response = await axios.post(
      "https://api.onstove.com/sim/v1/crossfire/save/terms",
      {
        type: "SIGN_UP",
        service_id: "10",
        viewarea_id: "STC_REWE",
        game_service_id: "CF_PH",
        game_viewarea_id: "SVC_AG",
        gds_info: {
          is_default: false,
          nation: "PH",
          regulation: "ETC",
          timezone: "Asia/Manila",
          utc_offset: 480,
          lang: "en",
          ip: "",
        },
      }
    );

    // console.log("Response:", response.data);
    // console.log("Extracted State:", response.data?.value?.state);
    return response.data?.value?.state;
  } catch (error) {
    console.error(
      "Error fetching state:",
      error.response?.data || error.message
    );
  }
}

async function registerUser(account_data) {
  const url = "https://api.onstove.com/sim/v1/crossfire/register";

  const state = await getTermsState();

  const payload = {
    state: state,
    ...account_data,
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.message === "OK") {
      console.log("✅ Registration Successful");
      console.log("-- username:", account_data.user_id);
      console.log("-- password:", account_data.user_password);

      const currentDate = new Date();
      const options = { month: "long", day: "numeric", year: "numeric" };
      const formattedDate = currentDate.toLocaleDateString("en-US", options);

      let year = Math.floor(Math.random() * (2024 - 1900 + 1)) + 1900;
      let randomDigit = Math.floor(Math.random() * (999 - 100 + 1)) + 100;

      let ign = `666.${year}.${randomDigit}`;

      let accounts = await readCSV("accounts_database.csv");
      accounts.push({
        USERNAME: account_data.user_id,
        PASSWORD: account_data.user_password,
        IGN: ign,
        REGISTER_DATE: formattedDate,
        ECOIN: "undefined",
        FIRSTNAME: account_data.first_name,
        LASTNAME: account_data.last_name,
        EMAIL: account_data.email,
        Q_ANSWER: account_data.question_answer,
        BIRTHDATE: account_data.birth_dt,
        ACCESS_TOKEN: response.data.value.access_token,
        REFRESH_TOKEN: response.data.value.refresh_token,
        NICKNAME: response.data.value.nickname,
      });

      await writeCSV("accounts_database.csv", accounts);
    }
  } catch (error) {
    console.error(
      "❌ Registration Failed:",
      error.response?.data || error.message
    );
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const registerMultipleUsers = async (number) => {
  for (let i = 0; i < number; i++) {
    let account_data = generateAccountData();

    await registerUser(account_data); // Register user
    console.log(`⏳ Waiting 5 seconds before next registration...`);
    await sleep(5000); // Wait 5 seconds
  }
};

registerMultipleUsers(20);
