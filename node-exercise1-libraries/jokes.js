const fs = require('fs')
const chalk = require('chalk')
const giveMeAJoke = require('give-me-a-joke')
const chance = require('chance').Chance()

const addJoke = () => {
    const jokes = loadJokes()
    
    giveMeAJoke.getRandomDadJoke ((joke) => {         

        const duplicteJoke = jokes.find((joke) => joke.joke === joke)

        if (!duplicteJoke) {
            jokes.push ({
                name: chance.name(),
                age: chance.age(),
                joke
            })
            saveJokes(jokes)
            console.log(chalk.green.inverse('New joke added!'))
        } else {
            console.log(chalk.red.inverse('Joke taken! Try again!'))
        }
    });
}

const removeJoke = (name) => {
    const jokes = loadJokes()
    const jokesToKeep = jokes.filter((joke) => joke.name !== name)

    if (jokes.length > jokesToKeep.length) {
        console.log(chalk.green.inverse('Joke removed!'))
        saveJokes(jokesToKeep)
    } else {
        console.log(chalk.red.inverse('No joke found!'))
    }
}

const listJokes = () => {
    const jokes = loadJokes()

    console.log(chalk.underline.bold.magenta('Your jokes'))

    jokes.forEach(joke => {
        console.log(joke.joke)
    });
}

const readJoke = (name) => {
    const jokes = loadJokes()

    const jokeToRead = jokes.find((joke) => joke.name === name)

    if(jokeToRead) {
        console.log(chalk.cyan.underline(jokeToRead.name))
        console.log(jokeToRead.joke)
    } else {
        console.log(chalk.red.inverse('No joke found!'))
    }
}

const addId = (name) => {
    const jokes = loadJokes()

    const writerToAddId = jokes.find((joke) => joke.name === name)

    if(writerToAddId) {
        if (!writerToAddId.id) {
            writerToAddId.id = chance.ssn({ dashes: false })
            saveJokes(jokes)
            console.log(chalk.green.inverse('Id added!'))
        } else {
            console.log(chalk.red.inverse('This writer already has id!'))
        }
    } else {
        console.log(chalk.red.inverse('No writer found!'))
    }
}

const saveJokes = (jokes) => {
    const dataJSON = JSON.stringify(jokes)
    fs.writeFileSync('jokes.json', dataJSON)
}

const loadJokes = () => {
    try {
        const dataBuffer = fs.readFileSync('jokes.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}

module.exports = {
    addJoke: addJoke,
    removeJoke: removeJoke,
    listJokes: listJokes,
    readJoke: readJoke,
    addId: addId
}
