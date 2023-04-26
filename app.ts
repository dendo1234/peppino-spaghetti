import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { VerifyDiscordRequest, getRandomEmoji } from "./app.service";
import { InteractionType, InteractionResponseType } from "discord-interactions";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const publicKey = process.env.PUBLIC_KEY

if (!publicKey) {
  throw Error("no public key")
}

app.use(express.json({ verify: VerifyDiscordRequest(publicKey) }))

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post('/interactions', async function (req: express.Request, res: express.Response) {
  // Interaction type and data
  const { type, id, data } = req.body;
  
  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
    
    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'hello world ' + getRandomEmoji(),
        },
      });
    }
  }
});

app.listen(port, () => {
  console.log('Listening on port', port);
});

