const path = require('path');
const express = require('express');
const hbs = require('hbs');
const dictionary = require('./utils/dictionary.js');
const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials') 

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Dictionary',
        name: 'Shelly Saraev'
    });
});

app.get('/dictionary', (req, res) => {
    if(!req.query.word) {
        return res.send({
            arror: 'You must provide a word!'
        });
    }

    dictionary(req.query.word, (error, dictionaryData) => {
        if (error) {
            return res.send({ error });
        }

        res.send({
            word: req.query.word,
            defenition: dictionaryData
        });
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Shelly Saraev',
        errorMessage: 'Page not found.'
    });
});

app.listen(4000, () => {
    console.log('Server is up on port 4000.');
});

