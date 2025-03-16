import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.TOKEN;

async function cloneGoLoginProfile(profileId) {
  const url = `https://api.gologin.com/browser/${profileId}/clone`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to clone profile: ${response.status} - ${response.statusText}`
      );
    }

    const text = await response.text();
    if (!text) {
      // console.log("Okay clone profile");
      return true;
    }

    try {
      const data = JSON.parse(text);
      // console.log("Cloned Profile:", data);
      return data;
    } catch (error) {
      console.error("Error parsing JSON:", error, "Response:", text);
      return null;
    }
  } catch (error) {
    console.error("Error cloning profile:", error);
    return null;
  }
}

// Usage Example
// const PROFILE_ID = "67a7d7f603e945812001a6c1";
// cloneGoLoginProfile(PROFILE_ID, TOKEN).catch(console.error);

export default cloneGoLoginProfile;
