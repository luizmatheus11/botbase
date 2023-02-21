import { Event } from "../Structures/Event"
import { BotClient } from '../BotClient';


export default class ReadyListener extends Event {
    constructor(client: BotClient) {
        super(client, {
            name: "ready"
        })
    }

    async run() {
        console.log(`Logando o ${this.client.user.tag}`)
        await this.client.database.bots.upsert({
            create: {
                id: this.client.user.id,
                token: this.client.token,
                lastDateStarted: new Date(),
                guildId: this.client.guildId
            }, 
            update: {
                lastDateStarted: new Date()
            },
            where: {
                id: this.client.user.id
            }
        })
        this.client.registryCommands()
    }
}