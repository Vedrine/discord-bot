require('dotenv').config();

const https = require('https');
const { Client, MessageAttachment, MessageEmbed  } = require('discord.js');
const client = new Client();

// READY EVENT
client.on('ready', () => {
    console.log('I am ready!');
});


// MESSAGE EVENT
client.on('message', message => {
    // SPLIT SENTENCE INTO WORDS
    const words = message.content.split(' ');

    // WHAT'S MY AVATAR
    if (message.content === 'Avatar') {
      message.reply(message.author.displayAvatarURL());
    }

    // SEND A GIF
    if (words.length >= 2 && words[0] === 'gif') {
      // USER SEARCH
      const gif_search = message.content.replace(words[0], '');

      https.get(`https://api.giphy.com/v1/gifs/search?q=${gif_search}&api_key=${process.env.GIPHY_API_TOKEN}&limit=1`, (response) => {
        // SET ENCODING OF RESPONSE TO UTF8
        response.setEncoding('utf8');
        let body = '';
        // LISTENS FOR THEN EVENT OF THE DATA BUFFER AND STREAM
        response.on('data', (d) => {
            // CONTINUOUSLY UPDATE STREAM WITH DATA FROM GIPHY
              body += d;
        });
        
        response.on('end', () => {
            // WHEN DATA IS FULLY RECEIVED PARSE INTO JSON
            let parsed = JSON.parse(body);

            gif = parsed.data.shift();

            message.channel.send(gif.images.original.url);
        });
      });
    }

    // TRANSLATE MESSAGE


    // TELL ME A JOKE


    // LET'S PLAY A LITTLE GAME
});  


// LOG THE BOT IN THE SERVER
client.login(process.env.DISCORDJS_BOT_TOKEN);

