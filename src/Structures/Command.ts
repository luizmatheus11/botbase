import { Message, Interaction, PermissionResolvable } from 'discord.js';
import { BotClient } from '../BotClient';
export interface Command {
    client: BotClient;
    commandSettings: CommandOptions
    builder: any;
}
export interface CommandOptions {
    name: string;
    defaultPermissions: PermissionResolvable[];
    devOnly?: boolean
    public?: boolean
}
export class Command {
    constructor(client: BotClient, options: CommandOptions) {
        this.client = client;
        this.commandSettings = {
            name: options.name || null,
            devOnly: options?.devOnly ?? false,
            defaultPermissions: options.defaultPermissions || ["Administrator"],
            public: options?.public || false,

        }
    }
    async run(client: BotClient, args: string[], message: Message) {}
    async runSlash(i: Interaction) {}
}