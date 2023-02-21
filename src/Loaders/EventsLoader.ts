import { readdir } from 'fs'
import { BotClient } from '../BotClient';
import path from 'path';
const dirPath = path.join(__dirname, '/Listeners').replace(/(.Loaders)/gmi, '')

export default class EventsLoader {
    constructor(client: BotClient) {
        readdir(`${dirPath}`, (err, files) => {
            if(err) throw new Error('Events Loader Error: ' + err)
            files.forEach((filename, info) => {
                const Listener = require(`../Listeners/${filename}`)
                const ListenerClass = Listener.default
                delete require.cache[require.resolve(`../Listeners/${filename}`)]
                const listener = new ListenerClass(client)
                
                console.log(' | [ ' + listener.name + ' ] ' + 'Loaded with sucess')
                client.on(listener.name, (...args) => {
                    listener.run(...args)
                })
            })
        })
    }
}