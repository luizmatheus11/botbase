import { Event } from "../Structures/Event"
import { Interaction, PermissionResolvable } from 'discord.js';
import { BotClient } from '../BotClient';



export default class InteractionCreate extends Event {
    constructor(client: BotClient) {
        super(client, {
            name: "interactionCreate"
        })
    }

    async run(i: Interaction) {
        if (i.isChatInputCommand()) {
            const cmd = this.client.commands.get(i.commandName)
            if (cmd) {
                let member = i.guild.members.cache.get(i.user.id)
                const module = await this.client.database.modules.findFirst({
                    where: {
                        guildId: i.guildId,
                        commands: {
                            some: {
                                name: i.commandName
                            }
                        },
                    },
                    include: {
                        commands: {
                            where: {
                                name: i.commandName,
                                guildId: i.guildId,
                            },
                            include: {
                                permissions: {
                                    select: {
                                        name: true,
                                        type: true,
                                    }
                                }
                            }
                        }
                    }
                })
                if (module.isActive && module.commands[0].isActive) {
                    let perm = !!module.commands[0].permissions.find(perm => perm.name == i.user.id || member.roles.cache.hasAll(perm.name) || member.permissions.has(perm.name as PermissionResolvable))
                    if (perm) return cmd.runSlash(i)
                } else {
                    return i.reply({
                        content: 'O modulo/comando está desativado.'
                    })
                }
            }
        }
    }

}