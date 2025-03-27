const request = require('request');

const dictionary = (word, callback) => {
    const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word;

    request({url, json: true}, (error,  { body }) => {
        if (error) {
            callback('Unable to connect to dictionary services!', undefined);
        } else if (!body.length) {
            callback('Unable to find word. Try another search.', undefined);
        } else {
            callback(undefined, 'Definition: ' + body[0].meanings[0].definitions[0].definition + '. ' +
                'Synonyms: ' + body[0].meanings[0].synonyms + '. ' +
                'Part of speech: ' + body[0].meanings[0].partOfSpeech + '.');        
        }
    });
}

module.exports = dictionary;
