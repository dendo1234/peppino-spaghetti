import 'dotenv/config';
import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';
import express from "express"

export function VerifyDiscordRequest(clientKey: string) {
  return function (req: express.Request, res: express.Response, buf: Buffer, encoding: string) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    try {
        if (!signature || !timestamp) {
            throw new Error('Bad request signature')
        }

        const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);

        if (!isValidRequest) {
        throw new Error('Bad request signature');
        }
    }
    catch(err) {
        if (err instanceof Error) {
            res.status(401).send('Bad request signature');
            throw err
        }
        res.status(500)
        throw err
    }

  };
}

interface options {
    method: string
    body: string
}
export async function DiscordRequest(endpoint: string, options: options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;

  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId: string, commands: string) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
