import { readdir } from 'fs'
import path from 'path';
import { BotClient } from '../BotClient';
import { Command } from '../Structures/Command';
const dirPath = path.join(__dirname, '/Commands').replace(/(.Loaders)/gmi, '')
export default class CommandLoader {
    constructor(client: BotClient) {
        readdir(`${dirPath}`, async (err, f) => {
            await client.database.guilds.upsert({
                create: {
                    id: client.guildId,
                },
                update: {
                    id: client.guildId,
                },
                where: {
                    id: client.guildId
                }
            })
            if (err) throw new RangeError("Command Loader Error: " + err)
            for (const category of f) {
                let module = await client.database.modules.findFirst({
                    where: {
                        guildId: client.guildId,
                        name: category
                    }
                })
                if (!module) {
                    module = await client.database.modules.create({
                        data: {
                            isActive: true,
                            name: category,
                            guildId: client.guildId,
                        },
                    })
                }
                readdir(`${dirPath}/${category}`, async (err, cmds) => {
                    for (const cmd of cmds) {
                        if (err) return console.error(' | [ COMMANDS ]  ' + err)

                        const CommandFile = require(`../Commands/${category}/${cmd}`).default;
                        delete require.cache[require.resolve(`../Commands/${category}/${cmd}`)]

                        const command: Command = new CommandFile(client)

                        client.commands.set(command.commandSettings.name, command)
                        client.commandsArray.push(command.builder)

                        let commandDB = await client.database.commands.findFirst({
                            where:  {
                                moduleId: module.id,
                                name: command.commandSettings.name,
                            }
                        })

                        if(!commandDB) {
                            commandDB = await client.database.commands.create({
                                data: {
                                    isActive: true,
                                    name: command.commandSettings.name,
                                    moduleId: module.id,
                                    guildId: client.guildId
                                },
                            })
                            let data = command.commandSettings.defaultPermissions.map(p => {
                                return {
                                    commandId: commandDB.id,
                                    name: p.toString(),
                                    type: "DEFAULTPERMISSION"
                                }
                            })
                            await client.database.permissions.createMany({
                                skipDuplicates: true,
                                data
                            })
                        }

                        console.log(' | ' + '[ COMMANDS ]  ' + cmd.replace('.js', '').replace('.ts', '').replace('Command', '') + ' - Command Loaded with Sucess')
                    }
                })
            }
        })
    }
}