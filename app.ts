import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { VerifyDiscordRequest, getRandomEmoji, parseDate } from "./app.service";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
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


  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
    
    if (name === 'test') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'hello world ' + getRandomEmoji(),
        },
      });
    }

    if (name == 'almoço') {

      //let almoco = "bla bla bla"
      const date = new Date()
      parseDate(date)

      const almoco = prisma.almoco.findFirst({
        where: {
          data: date
        }, 
        include: {
          alimentos: true
        }
      })
      console.log(almoco)

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: almoco
        }
      })
    }
  }
});

app.listen(port, () => {
  console.log('Listening on port', port);
});

