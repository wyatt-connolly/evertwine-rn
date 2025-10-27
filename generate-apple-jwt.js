const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Your Apple Developer credentials
const TEAM_ID = "LD4RK5T7MJ";
const KEY_ID = "N42D6WNJFK";
const CLIENT_ID = "com.mycompany.evertwinedraft.oauth";

// Function to generate Apple Sign In JWT
function generateAppleJWT() {
  try {
    // Read the .p8 private key file
    // Replace 'path/to/your/key.p8' with the actual path to your .p8 file
    const privateKeyPath = process.argv[2];

    if (!privateKeyPath) {
      console.error("❌ Please provide the path to your .p8 file:");
      console.error("Usage: node generate-apple-jwt.js /path/to/your/key.p8");
      process.exit(1);
    }

    if (!fs.existsSync(privateKeyPath)) {
      console.error(`❌ File not found: ${privateKeyPath}`);
      process.exit(1);
    }

    const privateKey = fs.readFileSync(privateKeyPath, "utf8");

    // Current timestamp
    const now = Math.floor(Date.now() / 1000);

    // JWT payload for Apple Sign In
    const payload = {
      iss: TEAM_ID, // Your Team ID
      iat: now, // Issued at (current time)
      exp: now + 86400 * 180, // Expires in 6 months
      aud: "https://appleid.apple.com", // Apple's audience
      sub: CLIENT_ID, // Your Services ID (Client ID)
    };

    // JWT header
    const header = {
      alg: "ES256",
      kid: KEY_ID, // Your Key ID
      typ: "JWT",
    };

    // Generate the JWT
    const token = jwt.sign(payload, privateKey, {
      algorithm: "ES256",
      header: header,
    });

    console.log("✅ Apple Sign In JWT generated successfully!");
    console.log("");
    console.log("📋 Copy this JWT token and paste it into Supabase:");
    console.log("");
    console.log("─".repeat(80));
    console.log(token);
    console.log("─".repeat(80));
    console.log("");
    console.log("🔧 Supabase Configuration:");
    console.log(`   Client ID: ${CLIENT_ID}`);
    console.log(`   Team ID: ${TEAM_ID}`);
    console.log(`   Key ID: ${KEY_ID}`);
    console.log(`   Secret Key: [The JWT token above]`);
    console.log("");
    console.log(
      "⚠️  Important: This JWT expires in 6 months. You'll need to regenerate it before then."
    );
  } catch (error) {
    console.error("❌ Error generating JWT:", error.message);

    if (error.message.includes("PEM")) {
      console.error("");
      console.error(
        "💡 Make sure your .p8 file contains the complete private key:"
      );
      console.error("   -----BEGIN PRIVATE KEY-----");
      console.error("   [base64 content]");
      console.error("   -----END PRIVATE KEY-----");
    }

    process.exit(1);
  }
}

// Check if jsonwebtoken is installed
try {
  require.resolve("jsonwebtoken");
  generateAppleJWT();
} catch (error) {
  console.log("📦 Installing required dependency...");
  const { execSync } = require("child_process");

  try {
    execSync("npm install jsonwebtoken", { stdio: "inherit" });
    console.log("✅ jsonwebtoken installed successfully!");
    generateAppleJWT();
  } catch (installError) {
    console.error("❌ Failed to install jsonwebtoken. Please run:");
    console.error("   npm install jsonwebtoken");
    console.error("   Then run this script again.");
    process.exit(1);
  }
}
