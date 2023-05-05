import 'dotenv/config';
import { InstallGlobalCommands } from './app.service';

const appId = process.env.APP_ID

if (!appId) throw new Error('no appid')
// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

const ALMOCO_COMMAND = {
  name: 'almoço',
  description: 'tá com fome?',
  type: 1,
}


const ALL_COMMANDS = [TEST_COMMAND, ALMOCO_COMMAND];

InstallGlobalCommands(appId, JSON.stringify(ALL_COMMANDS));