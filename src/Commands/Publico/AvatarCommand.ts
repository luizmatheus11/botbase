import { BotClient } from '../../BotClient';
import { Command } from '../../Structures/Command';
import { Message, Interaction, GuildMemberRoleManager, GuildMember, EmbedBuilder } from 'discord.js';
import { EmbedAuthorOptions, SlashCommandBuilder } from '@discordjs/builders';

export default class Avatar extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: 'avatar',
            defaultPermissions: ["SendMessages"]
        })
        this.builder = new SlashCommandBuilder().setName('avatar').setDescription('Exibe o avatar.').addUserOption(option => option.setName('user').setDescription('Usuario que deseja mostrar o avatar.'))
    }
    async runSlash(i: Interaction) {
        if (i.isCommand()) {
            let guildMember = i.options.getMember('user') as GuildMember || i.member as GuildMember;
            let role = (guildMember.roles as GuildMemberRoleManager).cache.filter(r => r.hoist).sort((b, a) => a.position - b.position || +a.id - +b.id).first();
            let authorData:EmbedAuthorOptions = { name: guildMember.user.username }
            if(role) authorData.iconURL = role.iconURL()
            let embed = new EmbedBuilder()
                .setAuthor(authorData)
                .setImage(guildMember.displayAvatarURL({ size: 2048 }))
                .setColor(role?.color || "#2f3136")
            i.reply({ embeds: [embed] })
        }
    }
}