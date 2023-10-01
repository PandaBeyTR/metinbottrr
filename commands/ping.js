module.exports = {
  name: 'ping',
  description: 'Botun pingini gösterir.',
  execute(message) {
    message.reply(`Pong! Bot gecikmesi: ${message.client.ws.ping}ms`);
  },
};
