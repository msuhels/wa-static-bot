# WhatsApp Static Bot - Complete Setup Guide

A simple, beginner-friendly WhatsApp bot using WhatsApp Cloud API that responds with Products and Services buttons.

## 📋 Features

- ✅ Welcome message with interactive buttons
- ✅ Products list (3 items)
- ✅ Services list (4 items)
- ✅ Single file implementation
- ✅ No database required
- ✅ Easy to understand and modify

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:

```env
PORT=3000
WHATSAPP_TOKEN=your_actual_token_here
PHONE_NUMBER_ID=your_phone_id_here
VERIFY_TOKEN=your_verify_token_here
```

### 3. Run the Application

```bash
node app.js
```

Or for development with auto-restart:

```bash
npm run dev
```

## 🔧 How to Get WhatsApp API Credentials

### Step 1: Create Meta Developer Account

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Log in or create an account
3. Create a new app and select "Business" type

### Step 2: Set Up WhatsApp

1. In your app dashboard, add "WhatsApp" product
2. Go to WhatsApp > Getting Started
3. You'll see your **Phone Number ID** - copy this
4. Generate a **Temporary Access Token** (or create a permanent one)

### Step 3: Configure Webhook

1. Expose your local server using ngrok:
   ```bash
   ngrok http 3000
   ```

2. In Meta dashboard, go to WhatsApp > Configuration
3. Click "Edit" on Webhook
4. Enter your webhook URL: `https://your-ngrok-url.ngrok.io/webhook`
5. Enter your `VERIFY_TOKEN` (the one you set in .env)
6. Subscribe to `messages` webhook field

### Step 4: Add Test Phone Number

1. In WhatsApp > Getting Started
2. Add your phone number to receive test messages
3. You'll receive a verification code on WhatsApp

## 📱 How It Works

### User Flow

1. **User sends any message** → Bot replies with welcome message + 2 buttons
2. **User clicks "Products"** → Bot sends list of 3 products
3. **User clicks "Services"** → Bot sends list of 4 services

### Code Structure

```
app.js
├── Environment setup (dotenv)
├── Express server configuration
├── Helper Functions
│   ├── sendTextMessage()
│   └── sendButtons()
└── Webhook Endpoints
    ├── GET /webhook (verification)
    └── POST /webhook (message handling)
```

## 🛠️ Customization

### Change Products

Edit the `productsMessage` in app.js:

```javascript
const productsMessage = `Here are our products:\n\n1. Your Product A\n2. Your Product B\n3. Your Product C`;
```

### Change Services

Edit the `servicesMessage` in app.js:

```javascript
const servicesMessage = `Here are our services:\n\n1. Your Service A\n2. Your Service B\n3. Your Service C\n4. Your Service D`;
```

### Change Welcome Message

Edit the `sendButtons()` function:

```javascript
body: {
  text: 'Your custom welcome message here!'
}
```

## 🐛 Troubleshooting

### Bot doesn't respond

- Check if server is running (`node app.js`)
- Verify webhook is configured correctly in Meta dashboard
- Check console for error messages
- Ensure WHATSAPP_TOKEN and PHONE_NUMBER_ID are correct

### Webhook verification fails

- Ensure VERIFY_TOKEN in .env matches what you entered in Meta dashboard
- Check that ngrok is running and URL is correct

### "Invalid token" error

- Your access token may have expired
- Generate a permanent access token in Meta dashboard

## 📝 Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `3000` |
| `WHATSAPP_TOKEN` | Access token from Meta | `EAAx...` |
| `PHONE_NUMBER_ID` | Your WhatsApp Business Phone ID | `123456789` |
| `VERIFY_TOKEN` | Custom token for webhook verification | `my_secret_123` |

## 🌐 API Endpoints

### GET /webhook
- **Purpose**: Webhook verification by Meta
- **Called by**: Meta WhatsApp Cloud API during setup

### POST /webhook
- **Purpose**: Receives incoming messages and button clicks
- **Called by**: Meta WhatsApp Cloud API when users interact

## 📚 Resources

- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Meta Developer Portal](https://developers.facebook.com/)
- [ngrok Download](https://ngrok.com/download)

## ⚠️ Important Notes

- This bot uses a **temporary access token** by default, which expires in 24 hours
- For production, generate a **permanent access token**
- Keep your `.env` file secure and never commit it to version control
- The bot responds to ALL messages with the welcome buttons

## 📄 License

ISC

---

Made with ❤️ for learning WhatsApp Cloud API
