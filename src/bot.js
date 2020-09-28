require('dotenv').config();

const { Client, MessageAttachment, MessageEmbed  } = require('discord.js');

const client = new Client();

// READY EVENT
client.on('ready', () => {
    console.log('I am ready!');
});


// MESSAGE EVENT
client.on('message', message => {
    // WHAT'S MY AVATAR
    if (message.content === 'Avatar') {
      message.reply(message.author.displayAvatarURL());
    }

    // SEND A GIF


    // TRANSLATE MESSAGE


    // TELL ME A JOKE


    // LET'S PLAY A LITTLE GAME
});  


// LOG THE BOT IN THE SERVER
client.login(process.env.DISCORDJS_BOT_TOKEN);

