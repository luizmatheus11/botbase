
import { Collection, Client, ApplicationCommandDataResolvable, Partials, GatewayIntentBits } from 'discord.js';
import { Utils } from './Utils/Utils';
import prisma from './Database';
import CommandLoader from './Loaders/CommandLoader';
import { Command } from './Structures/Command';
import EventsLoader from './Loaders/EventsLoader';
import SystemLoader from './Loaders/SystemLoader';


interface BotClientOptions {
    token: string;
    databaseuri?: string;
    guildId?: string;
}
export interface BotClient {
    token: string;
    commands: Collection<string, Command>
    aliases: Collection<string, string>
    cooldown: Collection<string, number>
    utils: Utils
    database: typeof prisma
    commandsArray: Array<ApplicationCommandDataResolvable>
    tempCall: Collection<string,{userId: string, time: number}>
    guildId: string;
}
export class BotClient extends Client {
    constructor(options: BotClientOptions) {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildScheduledEvents
            ], partials: [Partials.Channel]
        });
        this.token = options.token;
        this.guildId = options.guildId
        this.commands = new Collection()
        this.cooldown = new Collection()
        this.utils = new Utils()
        this.database = prisma
        this.commandsArray = []
        this.tempCall = new Collection()
    }

    async registryCommands() {

        this.guilds.cache.get(this.guildId).commands.set(this.commandsArray as ApplicationCommandDataResolvable[])

        console.log('Slash Commands carregados com sucesso!')
    }

    start() {
        this.initLoaders()
        super.login(this.token)
        return this;
    }

    initLoaders() {
        new SystemLoader(this)
        new EventsLoader(this)
        new CommandLoader(this)
    }

}