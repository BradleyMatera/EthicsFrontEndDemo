# Node Secrets Tutorial Demo

This project demonstrates three ways to manage secrets in a Node.js app, and best practices for keeping secrets safe.

## Structure

- `index.html` — Main tutorial page, interactive demo
- `style.css` — All styles for the page
- `main.js` — Handles dropdowns and secret visibility
- `/secrets/secrets.json` — Example shared secrets file (should be hidden from git)
- `.env` — Example environment variable file (should be hidden from git)
- `.gitignore` — Ensures secrets files are not committed

## Demo: Three Ways to Use Secrets

1. **Hardcoded Secret**
   - Secret is directly in code (not recommended)
   - Example: `const secretKey = "hardcoded123";`
2. **Shared Secrets File**
   - Secret stored in `secrets.json` and loaded by app
   - Example: `const secrets = require("./secrets.json");`
3. **Non-shared Secrets File (.env)**
   - Secret stored in `.env` and loaded with `dotenv` package
   - Example: `process.env.API_KEY`

## How to Run

1. Clone the repo
2. Open `index.html` in your browser
3. Use the dropdowns to show/hide secrets and see how each method works

## Keeping Secrets Safe
- **Never commit secrets to your repo!**
- Use `.gitignore` to hide `/secrets/secrets.json` and `.env`
- Use real secrets managers (AWS, HashiCorp Vault, etc.) for production

## Resources
- [HashiCorp 5 Best Practices for Secrets Management](https://www.hashicorp.com/resources/5-best-practices-for-secrets-management)

---
This tutorial is for educational purposes only. Do not use these patterns for production secrets management.
