import { Message, TextChannel } from 'discord.js';
export class Utils {
    public deleteMessage(message: Message, time:number) {
        setTimeout(() => message.delete(), time)
    }
    public chunkArray(array, count) {
        const newArr = []
        for (var i = 0; i < array.length; i+=count)
          newArr[i/count] = array.slice(i, i+count)
        return newArr
    }
    public async  fetchAllMessages(channel: TextChannel) {
      let messages: Message[] = []
      let lastID: string | undefined;

      while (true) {
          const fetchedMessages = await channel.messages.fetch({
              limit: 100,
              ...(lastID && { before: lastID })
          })

          if (fetchedMessages.size === 0) {
              return messages;
          }

          messages = messages.concat(Array.from(fetchedMessages.values()));
          lastID = fetchedMessages.lastKey();
      }
  }

  public async splitMessage(text, { maxLength = 2_000, char = '\n', prepend = '', append = '' } = {}) {
    if (text.length <= maxLength) return [text];
    let splitText = [text];
    if (Array.isArray(char)) {
      while (char.length > 0 && splitText.some(elem => elem.length > maxLength)) {
        const currentChar = char.shift();
        if (currentChar instanceof RegExp) {
          splitText = splitText.flatMap(chunk => chunk.match(currentChar));
        } else {
          splitText = splitText.flatMap(chunk => chunk.split(currentChar));
        }
      }
    } else {
      splitText = text.split(char);
    }
    if (splitText.some(elem => elem.length > maxLength)) throw new RangeError('SPLIT_MAX_LEN');
    const messages = [];
    let msg = '';
    for (const chunk of splitText) {
      if (msg && (msg + char + chunk + append).length > maxLength) {
        messages.push(msg + append);
        msg = prepend;
      }
      msg += (msg && msg !== prepend ? char : '') + chunk;
    }
    return messages.concat(msg).filter(m => m);
  }
}