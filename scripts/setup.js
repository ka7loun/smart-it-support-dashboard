const fs = require("fs")
const path = require("path")

console.log("🚀 Setting up Smart IT Support Dashboard...")

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local")
if (!fs.existsSync(envPath)) {
  console.log("❌ .env.local file not found!")
  console.log("Please create .env.local with your Supabase and Gemini API credentials.")
  process.exit(1)
}

console.log("✅ Environment file found")

// Check if node_modules exists
const nodeModulesPath = path.join(process.cwd(), "node_modules")
if (!fs.existsSync(nodeModulesPath)) {
  console.log("❌ Dependencies not installed!")
  console.log("Please run: npm install")
  process.exit(1)
}

console.log("✅ Dependencies installed")

console.log("🎉 Setup complete!")
console.log("")
console.log("Next steps:")
console.log("1. Run the SQL scripts in your Supabase dashboard:")
console.log("   - scripts/01-create-tables.sql")
console.log("   - scripts/02-seed-data.sql")
console.log("   - scripts/03-helper-functions.sql")
console.log("")
console.log("2. Start the development server:")
console.log("   npm run dev")
console.log("")
console.log("3. Open http://localhost:3000 in your browser")
