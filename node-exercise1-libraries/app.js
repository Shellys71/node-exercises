const yargs = require('yargs');
const jokes = require('./jokes.js');

// Costumize yargs version
yargs.version('1.1.0');

// Add command
yargs.command({
    command: 'add',
    describe: 'Add a new joke',
    handler() {
        jokes.addJoke();
    }
});

// Remove command
yargs.command({
    command: 'remove',
    describe: 'Remove a joke',
    builder: {
        name: {
            describe: 'Name of the writer',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        jokes.removeJoke(argv.name);
    }
});

// List command
yargs.command({
    command: 'list',
    describe: 'List the jokes',
    handler() {
        jokes.listJokes();
    }
});

// Read command
yargs.command({
    command: 'read',
    describe: 'Read the jokes',
    builder: {
        name: {
            describe: 'Name of the writer',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        jokes.readJoke(argv.name);
    }
});

// Add id command
yargs.command({
    command: 'id',
    describe: 'Add id to a writer',
    builder: {
        name: {
            describe: 'Name of the writer',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        jokes.addId(argv.name);
    }
});


yargs.parse();

