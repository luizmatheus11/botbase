import { ClientEvents } from 'discord.js';
import { BotClient } from '../BotClient';

export interface Event {
    name: keyof ClientEvents;
    client: BotClient;
}
interface EventOptions {
    name: keyof ClientEvents;
}
export class Event {
    constructor(client: BotClient, options: EventOptions) {
        this.name = options.name;
        this.client = client;
    }
    async run(...args: any[]): Promise<any> {}
}