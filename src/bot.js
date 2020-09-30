require('dotenv').config();

const https = require('https');
const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const client = new Client();
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

// READY EVENT
client.on('ready', () => {
  console.log('I am ready!');
});

// MESSAGE EVENT
client.on('message', (message) => {
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

    // SEND GIF
    this.sendGif(gif_search);
  }

  // TRANSLATE MESSAGE
  if (words.length > 2 && words[0] === 'watson') {
    // LANGUAGE TO TRANSLATE TO
    const lang = words[1];

    // USER TEXT
    const text = message.content.replace(words[0], '').replace(words[1], '');

    // TRANSLATE MESSAGE
    this.translate(text, lang);
  }

  // TELL ME A JOKE

  // LET'S PLAY A LITTLE GAME
});

// METHODS

// SEND GIF
function sendGif(search) {
  https.get(
    `https://api.giphy.com/v1/gifs/search?q=${search}&api_key=${process.env.GIPHY_API_TOKEN}&limit=1`,
    (response) => {
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

        // SEND GIF
        message.channel.send(gif.images.original.url);
      });
    }
  );
}

// TRANSLATE
function translate(text, lang) {
  // WATSON CONFIG
  const languageTranslator = new LanguageTranslatorV3({
    version: '2018-05-01',
    authenticator: new IamAuthenticator({
      apikey: process.env.IBM_WATSON_API_KEY,
    }),
    serviceUrl:
      'https://api.eu-gb.language-translator.watson.cloud.ibm.com/instances/41557138-600a-4e93-9c7c-f8a21186db64',
  });

  // CHECK USER LANG IS AVAILABLE
  languageTranslator
    .listLanguages()
    .then((languages) => {
      if (!languages.result.languages.map((item) => item.language).includes(lang)) {
        // LANGUAGE NOT AVAILABLE
        message.channel.send('This language is not available');
      }
    })
    .catch((err) => {
      console.log('error:', err);
    });

  // IDENTIFY MESSAGE LANGUAGE
  languageTranslator
    .identify({ text: text })
    .then((identifiedLanguages) => {
      // MOST PROBABLE LANGUAGE
      const most_probable_language = identifiedLanguages.result.languages.shift().language;

      // SET LANGUAGES
      const translateParams = {
        text: text,
        modelId: most_probable_language + '-' + lang,
      };

      // TRANSLATE;
      languageTranslator
        .translate(translateParams)
        .then((translationResult) => {
          const text_translated = translationResult.result.translations.shift().translation;

          // SEND MESSAGE
          message.channel.send(text_translated);
        })
        .catch((err) => {
          console.log('error:', err);
        });
    })
    .catch((err) => {
      console.log('error:', err);
    });
}

// LOG THE BOT IN THE SERVER
client.login(process.env.DISCORDJS_BOT_TOKEN);
