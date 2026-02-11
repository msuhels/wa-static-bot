// ============================================
// WhatsApp Cloud API Static Bot
// A simple bot with Products and Services buttons
// ============================================

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const axios = require('axios');

// Initialize Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json())

// Configuration from environment variables
const PORT = process.env.PORT || 3000;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// WhatsApp API base URL
const WHATSAPP_API_URL = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;

app.get('/', (req, res) => {
  res.json({message:'Welcome to the WhatsApp Bot!'});
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Send a text message to a WhatsApp user
 * @param {string} to - Recipient phone number
 * @param {string} message - Text message to send
 */
async function sendTextMessage(to, message) {
  try {
    await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`✅ Text message sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending text message:', error.response?.data || error.message);
  }
}

/**
 * Send interactive buttons (Products and Services)
 * @param {string} to - Recipient phone number
 */
async function sendButtons(to) {
  try {
    await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: 'Welcome to our company!\nPlease choose one of the options below.'
          },
          action: {
            buttons: [
              {
                type: 'reply',
                reply: {
                  id: 'products',
                  title: 'Products'
                }
              },
              {
                type: 'reply',
                reply: {
                  id: 'services',
                  title: 'Services'
                }
              }
            ]
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`✅ Buttons sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending buttons:', error.response?.data || error.message);
  }
}

/**
 * Send product selection buttons
 * @param {string} to - Recipient phone number
 */
async function sendProductButtons(to) {
  try {
    await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: 'Here are our products:\n\nPlease select a product:'
          },
          action: {
            buttons: [
              {
                type: 'reply',
                reply: {
                  id: 'product_a',
                  title: 'Product A'
                }
              },
              {
                type: 'reply',
                reply: {
                  id: 'product_b',
                  title: 'Product B'
                }
              },
              {
                type: 'reply',
                reply: {
                  id: 'product_c',
                  title: 'Product C'
                }
              }
            ]
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`✅ Product buttons sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending product buttons:', error.response?.data || error.message);
  }
}

/**
 * Send service selection buttons
 * @param {string} to - Recipient phone number
 */
async function sendServiceButtons(to) {
  try {
    // WhatsApp interactive buttons are limited to 3 buttons
    // We'll send first 3 services, then send remaining as separate message
    await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: 'Here are our services:\n\nPlease select a service:'
          },
          action: {
            buttons: [
              {
                type: 'reply',
                reply: {
                  id: 'service_a',
                  title: 'Service A'
                }
              },
              {
                type: 'reply',
                reply: {
                  id: 'service_b',
                  title: 'Service B'
                }
              },
              {
                type: 'reply',
                reply: {
                  id: 'service_c',
                  title: 'Service C'
                }
              }
            ]
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Send Service D as a separate button message (WhatsApp limitation: max 3 buttons)
    setTimeout(async () => {
      await axios.post(
        WHATSAPP_API_URL,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: {
              text: 'Or choose this service:'
            },
            action: {
              buttons: [
                {
                  type: 'reply',
                  reply: {
                    id: 'service_d',
                    title: 'Service D'
                  }
                }
              ]
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
    }, 1000); // Send after 1 second delay
    
    console.log(`✅ Service buttons sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending service buttons:', error.response?.data || error.message);
  }
}

// ============================================
// WEBHOOK ENDPOINTS
// ============================================

/**
 * GET /webhook
 * Webhook verification endpoint for Meta
 * Meta will send a verification request with challenge token
 */
app.get('/api/webhooks/whatsapp', (req, res) => {
  // Parse query parameters
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Check if mode and token are present
  if (mode && token) {
    // Verify the token matches our VERIFY_TOKEN
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verified successfully');
      // Respond with the challenge token to complete verification
      res.status(200).send(challenge);
    } else {
      console.log('❌ Webhook verification failed');
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

/**
 * POST /webhook
 * Webhook event receiver for incoming WhatsApp messages
 * Handles user messages and button clicks
 */
app.post('/api/webhooks/whatsapp', async (req, res) => {
  try {
    // Extract the body from the request
    const body = req.body;
console.log(body);
    // Check if this is a WhatsApp message event
    if (body.object === 'whatsapp_business_account') {
      // Loop through entries (usually just one)
      for (const entry of body.entry) {
        // Get changes array
        const changes = entry.changes;

        for (const change of changes) {
          const value = change.value;

          // Check if there are messages
          if (value.messages && value.messages.length > 0) {
            const message = value.messages[0];
            const from = message.from; // Sender's phone number
            const messageType = message.type;

            console.log(`📩 Received message from ${from}, type: ${messageType}`);

            // Handle different message types
            if (messageType === 'text') {
              // User sent a text message - send welcome buttons
              console.log(`💬 Text message: ${message.text.body}`);
              await sendButtons(from);
            } else if (messageType === 'interactive') {
              // User clicked a button
              const buttonId = message.interactive.button_reply.id;
              console.log(`🔘 Button clicked: ${buttonId}`);

              // Handle main menu button clicks
              if (buttonId === 'products') {
                // Send product selection buttons
                await sendProductButtons(from);
              } else if (buttonId === 'services') {
                // Send service selection buttons
                await sendServiceButtons(from);
              } 
              // Handle product selections
              else if (buttonId === 'product_a') {
                await sendTextMessage(from, 'You have selected Product A, we will contact you shortly.');
              } else if (buttonId === 'product_b') {
                await sendTextMessage(from, 'You have selected Product B, we will contact you shortly.');
              } else if (buttonId === 'product_c') {
                await sendTextMessage(from, 'You have selected Product C, we will contact you shortly.');
              }
              // Handle service selections
              else if (buttonId === 'service_a') {
                await sendTextMessage(from, 'You have selected Service A, we will contact you shortly.');
              } else if (buttonId === 'service_b') {
                await sendTextMessage(from, 'You have selected Service B, we will contact you shortly.');
              } else if (buttonId === 'service_c') {
                await sendTextMessage(from, 'You have selected Service C, we will contact you shortly.');
              } else if (buttonId === 'service_d') {
                await sendTextMessage(from, 'You have selected Service D, we will contact you shortly.');
              }
            }
          }

          // Mark message as read (optional but good practice)
          if (value.messages && value.messages.length > 0) {
            const messageId = value.messages[0].id;
            try {
              await axios.post(
                WHATSAPP_API_URL,
                {
                  messaging_product: 'whatsapp',
                  status: 'read',
                  message_id: messageId
                },
                {
                  headers: {
                    'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
            } catch (error) {
              // Silently fail - marking as read is not critical
            }
          }
        }
      }
    }

    // Always respond with 200 to acknowledge receipt
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Error processing webhook:', error.message);
    // Still send 200 to prevent Meta from retrying
    res.sendStatus(200);
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('🚀 WhatsApp Bot Server Started');
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🔗 Webhook URL: http://localhost:${PORT}/api/webhooks/whatsapp`);
  console.log('✅ Ready to receive messages!');
});