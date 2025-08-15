# Receipt Scanner Demo

A demo web application that allows users to upload receipt images, parse key details (vendor, date, amount) using [Mindee OCR](https://mindee.com), and automatically create expenses in [QuickBooks Online](https://quickbooks.intuit.com/) — all via secure [Netlify Functions](https://docs.netlify.com/functions/overview/).

📖 **Read the full blog post:** [From Notebooks to AI – A Receipt Scanner for the Whole Team](https://www.nunezalex.com/blog/receipt-scanning-webapp/)

---

## Features
- **Upload receipts** from your device
- **OCR parsing** with Mindee API to extract vendor, date, and amount
- **Secure QuickBooks API integration** to create and attach expenses
- **Frontend built with React + MUI**
- **Serverless backend** with Netlify Functions
- **Firestore** for storing OAuth tokens securely

## Tech Stack
- **Frontend:** React, Material UI, Framer Motion
- **Backend:** Netlify Functions (Node.js + Axios)
- **OCR:** Mindee API
- **Accounting:** QuickBooks Online API
- **Auth/Storage:** Firebase Firestore
- **Deployment:** Netlify

## Project Story
I built this demo to explore how small businesses could automate tedious expense entry without giving every employee full QuickBooks access.  
The goal was to:
1. Allow quick receipt uploads from any device.
2. Extract expense details using an OCR service.
3. Push data securely to QuickBooks through serverless functions.
4. Store and refresh OAuth tokens safely in Firestore.

The full write-up of the project, including architecture decisions and technical challenges, can be found in the [blog post](https://www.nunezalex.com/blog/receipt-scanning-webapp/).

## How It Works
1. User uploads a receipt image.
2. The image is sent to the backend (Netlify Function) for OCR processing via Mindee.
3. Parsed data is returned to the frontend for review.
4. On confirmation, the backend:
   - Creates an expense in QuickBooks
   - Uploads the receipt image as an attachment
5. OAuth tokens are securely stored and refreshed in Firestore.

## Getting Started

### Prerequisites
- Node.js 18+
- Netlify CLI installed (`npm install -g netlify-cli`)
- API keys for:
  - [Mindee OCR](https://developers.mindee.com/)
  - [QuickBooks Online](https://developer.intuit.com/)

### Installation
```bash
# Clone the repository
git clone https://github.com/ThatDudeAlex/receipt-scanner-demo.git
cd receipt-scanner-demo

# Install dependencies
npm install

# Run locally
npm run dev
```

### Running Netlify Functions locally
```bash
netlify dev
```
