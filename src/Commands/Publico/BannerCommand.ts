import { BotClient } from '../../BotClient';
import { Command } from '../../Structures/Command';
import { Message,  Interaction, GuildMemberRoleManager, GuildMember, EmbedBuilder } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export default class Avatar extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: 'banner',
            defaultPermissions: ["SendMessages"]
        })
        this.builder = new SlashCommandBuilder().setName('banner').setDescription('Exibe o banner.').addUserOption(option => option.setName('user').setDescription('Usuario que deseja mostrar o banner.'))
    }
    async runSlash(i: Interaction) {
        if (i.isCommand()) {
            let guildMember = i.options.getMember('user') as GuildMember || i.member as GuildMember;
            let role = guildMember.roles.cache.filter(r => r.hoist).sort((b, a) => a.position - b.position || +a.id - +b.id).first();
            let userFetched = await this.client.users.fetch(guildMember.id, { force: true })
            if (!userFetched.bannerURL()) {
                i.reply({ content: `Usuário não possui banner.` })
                return;
            }
            let embed = new EmbedBuilder()
                .setAuthor({ name: guildMember.user.username, iconURL: "" || role.iconURL() })
                .setImage(userFetched.bannerURL({size: 2048}))
                .setColor(role.color || "#2f3136")
            i.reply({ embeds: [embed] })
        }
    }
}