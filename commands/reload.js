// reload.js

module.exports = {
    name: 'reload',
    description: 'Belirli bir komutu yeniden yükler.',
    execute(message, args) {
      if (!args.length) return message.channel.send("Yeniden yüklemek istediğiniz komutu belirtmelisiniz.");
      const commandName = args[0].toLowerCase();
      const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
      if (!command) return message.channel.send(`\`${commandName}\` adlı bir komut bulunamadı.`);
    
      delete require.cache[require.resolve(`./${command.name}.js`)];
    
      try {
        const newCommand = require(`./${command.name}.js`);
        message.client.commands.set(newCommand.name, newCommand);
        message.channel.send(`\`${command.name}\` komutu başarıyla yeniden yüklendi.`);
      } catch (error) {
        console.error(error);
        message.channel.send(`\`${command.name}\` komutunu yeniden yüklerken bir hata oluştu.`);
      }
    },
  };
  