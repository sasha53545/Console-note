#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
/*******************************************/
function init() {
    fs.mkdir('.console-note', {recursive: true}, (err) => {
        if (err) {
            console.log('Was not able to create folder', err);
        }
        fs.readFile('.console-note/data.json', 'utf8', (err) => {
            if (err) {
                const initialData = {
                    messages: []
                }
                const stringifyData = JSON.stringify(initialData);
                fs.writeFile('.console-note/data.json', stringifyData, (err) => {
                    if (err) {
                        console.log('Was not able to create file: ', err);
                    } else {
                        console.log('Notes have been initialized');
                    }
                });
            } else {
                console.log('Notes have been already initialized here');
            }
        });
    });
}

function add(message) {
    fs.readFile('.console-note/data.json', 'utf8', (err, data) => {
        if (err) {
            console.log("You didnt initialize file");
        }
        if (message) {
            const parseData = JSON.parse(data);
            const date = new Date();
            const objMessageInArray = {
                message: message,
                date: date.toUTCString(),
                indexOfMessage: date.getTime()
            };
            parseData.messages.push(objMessageInArray);
            const stringifyData = JSON.stringify(parseData);
            fs.writeFile('.console-note/data.json', stringifyData, (err) => {
                if(err) {
                    console.log('--ERROR--');
                }
            });
        } else {
            console.log('You have to select the flag (-m / --message)');
        }
    });
}

function show() {
    fs.readFile('.console-note/data.json', 'utf8', (err, data) => {
        if (err) {
            console.log('--ERROR--');
        }
        const parseData = JSON.parse(data);
        console.log('--------------------------------------------------------------------------------------------------------');
        console.log(' N                          MESSAGE                                     DATE              INDEX(remove)');
        parseData.messages.forEach((element, i) => {
            console.log(String(i + 1).padStart(2, ' '), '|', element.message.padEnd(50, ' '),'|', element.date, '|', String(element.indexOfMessage),'|');
        });
        console.log('--------------------------------------------------------------------------------------------------------');
    });
}

function remove(index, all) {
    fs.readFile('.console-note/data.json', 'utf8', (err, data) => {
        if (err) {
            console.log('--ERROR--');
        }
        const parseData = JSON.parse(data);
        if (all) {
            parseData.messages.splice(0);
            const stringifyData = JSON.stringify(parseData);
            fs.writeFile('.console-note/data.json', stringifyData, (err) => {
                if (err) {
                    console.log('--ERROR--');
                };
            });
        } else {
            parseData.messages =  parseData.messages.filter((element) => {
                element.indexOfMessage !== parseInt(index);
            });
            const stringifyData = JSON.stringify(parseData);
            fs.writeFile('.console-note/data.json', stringifyData, (err) => {
                if (err) {
                    console.log('--ERROR--');
                };
            });
        }
    });
}

program
    .command('init') // sub-command name
    .description('initialize notes') // command description

    // function to execute when command is uses
    .action(function () {
        init();
    });

program
    .command('add') //sub-command name
    .description('add notes to .console-note/data.json') // command description
    .option('-m, --message <type>', 'Add message with optional type')

    // function to execute when command is uses
    .action(function (dir) {
        add(dir.message);
    });

program
    .command('show') // sub-command name
    .description('show notes') // command description
    .option('-a, --all', 'Add message with optional type')
    
    // function to execute when command is uses
    .action(function () {
        show();
    });

program
    .command('remove') //sub-command name
    .description('add notes to .console-note/data.json') // command description
    .option('-i, --index <type>', 'Add message with optional type')
    .option('-a, --all', 'Add message with optional type')

    // function to execute when command is uses
    .action(function (dir) {
        remove(dir.index, dir.all);
    });
 
// allow commander to parse `process.argv`
program.parse(process.argv);