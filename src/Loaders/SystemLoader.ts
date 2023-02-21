import { readdir } from 'fs'
import { BotClient } from '../BotClient';
import path from 'path';
const dirPath = path.join(__dirname, '/System').replace(/(.Loaders)/gmi, '')

export default class SystemLoader {
    constructor(client: BotClient) {
        readdir(`${dirPath}`, (err, files) => {
            if (err) return;
            files.forEach(category => {
                readdir(`${dirPath}/${category}`, async (err, cmds) => {
                    if(err) return;
                    for (const cmd of cmds) {

                        const System = require(`../System/${category}/${cmd}`).default
                        delete require.cache[require.resolve(`../System/${category}/${cmd}`)]
                        const listener = new System(client)

                        console.log(` | [${category}] - Event [${listener.name}] - Loaded with sucess`)

                        client.on(listener.name, (...args) => {
                            listener.run(...args)
                        })
                    }
                })
            })
        })
    }
}