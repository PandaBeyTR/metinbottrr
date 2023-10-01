const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const fs = require("fs");
const config = require("./config.js");

// Discord.js ile ilgili nesneleri içeri aktarır
const client = new Client({
  partials: [
    Partials.Message, // Mesajlar için
    Partials.Channel, // Metin kanalları için
    Partials.GuildMember, // Sunucu üyeleri için
    Partials.Reaction, // Mesaj tepkileri için
    Partials.GuildScheduledEvent, // Sunucu etkinlikleri için
    Partials.User, // Discord kullanıcıları için
    Partials.ThreadMember, // Konu üyeleri için
  ],
  intents: [
    GatewayIntentBits.Guilds, // Sunucu ile ilgili olaylar için
    GatewayIntentBits.GuildMembers, // Sunucu üyeleri ile ilgili olaylar için
    GatewayIntentBits.GuildBans, // Yasaklamaları yönetmek için
    GatewayIntentBits.GuildEmojisAndStickers, // Emojileri ve çıkartmaları yönetmek için
    GatewayIntentBits.GuildIntegrations, // Discord entegrasyonları için
    GatewayIntentBits.GuildWebhooks, // Discord web kancaları için
    GatewayIntentBits.GuildInvites, // Davetleri yönetmek için
    GatewayIntentBits.GuildVoiceStates, // Ses ile ilgili olaylar için
    GatewayIntentBits.GuildPresences, // Kullanıcı durumu için
    GatewayIntentBits.GuildMessages, // Sunucu mesajları için
    GatewayIntentBits.GuildMessageReactions, // Mesaj tepkileri için
    GatewayIntentBits.GuildMessageTyping, // Mesaj yazma durumu için
    GatewayIntentBits.DirectMessages, // Özel mesajlar için
    GatewayIntentBits.DirectMessageReactions, // Özel mesaj tepkileri için
    GatewayIntentBits.DirectMessageTyping, // Özel mesaj yazma durumu için
    GatewayIntentBits.MessageContent, // Mesaj içeriğini etkinleştirin
  ],
});

const prefix = config.prefix; // Prefix'i config.js dosyasından alın

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Botunuzun hazır olduğunda çalışacak olan event
client.once('ready', () => {
  require("./events/ready.js")(client); // ready.js dosyasını çağırın ve çalıştırın
});

// index.js

// ... (diğer kodlar)

// Komutları yükleme kısmına ekleyin
// Yeni katılan kişilere rol verme kısmı
client.on('guildMemberAdd', (member) => {
  // Yeni katılan kişinin bir bot mu yoksa bir üye mi olduğunu kontrol edin
  const isBot = member.user.bot;

  // Bot ise bot rolünü verin, değilse üye rolünü verin
  const roleId = isBot ? '1154077421155397754' : '1154077421155397761'; // Bot ve üye rollerinin kimliklerini (ID) buraya ekleyin

  const role = member.guild.roles.cache.get(roleId);

  if (role) {
    member.roles.add(role)
      .then(() => {
        console.log(`${member.user.tag} kişisine rol verildi: ${role.name}`);
      })
      .catch((error) => {
        console.error('Rol verme hatası:', error);
      });
  }
});

client.commands = new Collection();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// ...

// Reload komutunu kullanılabilir hale getirin
const reloadCommand = require('./commands/reload');
client.commands.set(reloadCommand.name, reloadCommand);

// ... (diğer kodlar)

// Mesajları işlemek için olay
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('Komutu çalıştırırken bir hata oluştu.');
  }
});

// Botunuzu başlatmak için tokeni config.js dosyasından alın
client.login(config.token).catch(e => {
  console.log("Girdiğiniz Bot Tokeni Yanlış veya Bot'un INTENTS'i KAPALI!");
});
