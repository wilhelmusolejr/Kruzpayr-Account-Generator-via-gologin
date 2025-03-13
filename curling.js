import axios from "axios";
import generateAccountData from "./account_info_gen.js";

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
      console.log("✅ Registration Successful:", response.data);
      console.log("    Account Info:", account_data);
    }
  } catch (error) {
    console.error(
      "❌ Registration Failed:",
      error.response?.data || error.message
    );
  }
}

registerUser(account_data);
