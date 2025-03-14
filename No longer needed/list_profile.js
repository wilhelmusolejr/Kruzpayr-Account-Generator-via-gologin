import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.TOKEN;

async function getGoLoginProfiles() {
  const url = "https://api.gologin.com/browser/v2";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch profiles: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return null;
  }
}

async function getLatestProfile() {
  const profiles = await getGoLoginProfiles();

  if (!profiles || !profiles.profiles.length) {
    return null;
  }

  // Sort profiles from newest to oldest based on `createdAt`
  const sortedProfiles = profiles.profiles.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return sortedProfiles[0];
}

export { getLatestProfile, getGoLoginProfiles };
