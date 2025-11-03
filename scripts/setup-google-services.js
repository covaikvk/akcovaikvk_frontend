const fs = require("fs");
const path = require("path");

const googleServices = process.env.GOOGLE_SERVICES_JSON;

if (!googleServices) {
  console.log("⚠️ GOOGLE_SERVICES_JSON env variable not found.");
  process.exit(0);
}

// This is where Expo expects it before prebuild
const rootPath = path.join(process.cwd(), "google-services.json");
const androidAppPath = path.join(process.cwd(), "android", "app", "google-services.json");

// Write at root for Expo plugin compatibility
fs.writeFileSync(rootPath, googleServices);
console.log("✅ google-services.json written to project root.");

// Also copy inside android/app for safety
fs.writeFileSync(androidAppPath, googleServices);
console.log("✅ google-services.json also written to android/app/");
