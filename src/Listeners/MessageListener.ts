
const { PREFIX } = process.env;
import { Event } from '../Structures/Event';
import { Message } from 'discord.js';
import { BotClient } from '../BotClient';

export default class MessageListener extends Event {
  constructor(client: BotClient) {
    super(client, {
      name: "messageCreate"
    })
  }

  async run(message: Message): Promise<Message> {
    if (message.author.bot) return;

    let prefix = PREFIX;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g)

    const command = args.shift().toLowerCase()

    const cmd = this.client.commands.get(command)

    if (!cmd) return

    if (cmd.commandSettings.devOnly) {
      cmd.run(this.client, args, message)
    }
  }
}