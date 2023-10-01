// ready.js dosyası
module.exports = (client) => {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
  
    // Botun durumu ve etkinliğini ayarlayın
    client.user.setPresence({
      status: 'dnd', // Rahatsız Etmeyin durumu (dnd)
      activities: [
        {
          name: 'Visual Studio Code', // Etkinlik metni
          type: 'PLAYING', // Oynuyor (PLAYING) etkinlik tipi
        },
      ],
    });
  };
  