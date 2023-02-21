import { BotClient } from './BotClient';
require('dotenv').config();
const client = new BotClient({
    token: process.env.TOKEN,
    guildId: '1040413460518944821'
})

client.start()