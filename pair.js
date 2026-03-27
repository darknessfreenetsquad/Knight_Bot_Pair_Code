import express from 'express';
import fs from 'fs';
import pino from 'pino';
import { 
  makeWASocket, 
  useMultiFileAuthState, 
  delay, 
  makeCacheableSignalKeyStore, 
  Browsers, 
  jidNormalizedUser, 
  fetchLatestBaileysVersion 
} from '@whiskeysockets/baileys';
import pn from 'awesome-phonenumber';

const app = express();
const router = express.Router();
const logger = pino({ level: 'fatal' });

const removeFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.rm(filePath, { recursive: true, force: true });
    }
  } catch (error) {
    logger.error('Error removing file:', error);
  }
};

router.get('/', async (req, res) => {
  const num = req.query.number?.replace(/[^0-9]/g, '');
  if (!num) {
    return res.status(400).send({ code: 'Phone number is required' });
  }

  const phone = pn('+' + num);
  if (!phone.isValid()) {
    return res.status(400).send({ 
      code: 'Invalid phone number. Please enter your full international number (e.g., 15551234567 for US, 447911123456 for UK, 84987654321 for Vietnam, etc.) without + or spaces.' 
    });
  }

  const sessionDir = './' + phone.getNumber('e164').replace('+', '');
  await removeFile(sessionDir);

  const initiateSession = async () => {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const KnightBot = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      printQRInTerminal: false,
      logger,
      browser: Browsers.windows('Chrome'),
    });

    KnightBot.ev.on('connection.update', async (update) => {
      const { connection, isNewLogin } = update;
      if (connection === 'open') {
        try {
          const userJid = jidNormalizedUser(num + '@s.whatsapp.net');
          const sessionFile = await fs.promises.readFile(`${sessionDir}/creds.json`);
          
          await KnightBot.sendMessage(userJid, {
            document: sessionFile,
            mimetype: 'application/json',
            fileName: 'creds.json',
          });

          await KnightBot.sendMessage(userJid, {
            image: { url: 'https:                                                      
            caption: `🎬 *KnightBot MD V2.0 Full Setup Guide!*\n\n🚀 Bug Fixes + New Commands + Fast AI Chat\n📺 Watch Now: https:                        
          });

          await KnightBot.sendMessage(userJid, {
            text: `⚠️Do not share this file with anybody⚠️\n ┌┤✑ Thanks for using Knight Bot │└────────────┈ ⳹ │©2025 Mr Unique Hacker └─────────────────┈ ⳹\n\n`,
          });

          await removeFile(sessionDir);
        } catch (error) {
          logger.error('//img.youtube.com/vi/-oz_u1iMgf8/maxresdefault.jpg' },
            caption: `🎬 *KnightBot MD V2.0 Full Setup Guide!*\n\n🚀 Bug Fixes + New Commands + Fast AI Chat\n📺 Watch Now: https://youtu.be/NjOipI2AoMk`,
          });

          await KnightBot.sendMessage(userJid, {
            text: `⚠️Do not share this file with anybody⚠️\n ┌┤✑ Thanks for using Knight Bot │└────────────┈ ⳹ │©2025 Mr Unique Hacker └─────────────────┈ ⳹\n\n`,
          });

          await removeFile(sessionDir);
        } catch (error) {
          logger.error('Error sending messages:', error);
          await removeFile(sessionDir);
        }
      }
    });

    if (!KnightBot.authState.creds.registered) {
      await delay(3000);
      try {
        const code = await KnightBot.requestPairingCode(num);
        const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;
        
                                                              
        const userJid = jidNormalizedUser(num + '// Send the pairing code to the user's WhatsApp number
        const userJid = jidNormalizedUser(num + '@s.whatsapp.net');
        await KnightBot.sendMessage(userJid, {
          text: `Your pairing code is: ${formattedCode}`,
        });

        res.send({ code: formattedCode });
      } catch (error) {
        logger.error('Error requesting pairing code:', error);
        res.status(503).send({ code: 'Failed to get pairing code' });
      }
    }

    KnightBot.ev.on('creds.update', saveCreds);
  };

  await initiateSession();
});

app.use(express.json());
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err);
});

export default router;
