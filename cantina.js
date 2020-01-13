//program :  catina.js
//author:  Victor Chan
//Date:  Jan 11, 2020
//
//Purpose of Program:
// 
//1. read json file name from command line
//2. open file 
//3. parse it

//4. wait for selectors input from command line


//
const fs = require('fs')
const _ = require('lodash');
const traverse = require('traverse');
const stringify = require('json-stringify-safe');
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

const PROGRAM_NAME = "cantina.js";


const jsonFileLocation = "./SystemViewController.json";

function promptInput(prompt, handler) {
    rl.question(prompt, input => {
        if (handler(input) !== false) {
            promptInput(prompt, handler);
        } else {
            rl.close();
        }
    });
};


// ==================================================
function findViews(data, selection, selectionType) {


    var acc = [];

    switch (selectionType) {
        case "class":
            traverse(data).forEach(function(x) {


                if (typeof(x.class) != 'undefined') {
                    if (x.class === selection) {

                        acc.push(x);
                    }
                }

            }, []);
            break;
        case "identifier":

            traverse(data).forEach(function(x) {


                if (typeof(x.identifier) != 'undefined') {
                    if (x.identifier === selection) {


                        acc.push(x);
                    }
                }

            }, []);


            break;
        case "className":

            traverse(data).forEach(function(x) {

                if (typeof(x.classNames) != 'undefined') {

                    if (x.classNames.includes(selection)) {


                        acc.push(x);
                    }
                }

            }, []);


            break;

    }

    return acc;
};

// =========================================================


fs.readFile(jsonFileLocation, 'utf8', (err, fileContents) => {
    if (err) {
        console.error(err)
        process.exit(1);
    }
    try {
        const data = JSON.parse(fileContents);

        var selectionType = null;
        var selection = null;

        promptInput('Catina view selector app: pls enter selection value or exit> ', input => {
            switch (input) {

                case 'exit':
                    console.log('Normal Exit :Bye!');
                    return false;
                default:

                    var prefixChar = input.substr(0, 1);

                    switch (prefixChar) {
                        case ".":
                            selectionType = "className";
                            selection = input.substr(1);
                            break;
                        case "#":
                            selectionType = "identifier";
                            selection = input.substr(1);
                            break;
                        default:
                            selectionType = "class";
                            selection = input;
                            break;
                    }
                    console.log("\n prefixChar:" + prefixChar);
                    var accumulatedViews = [];
                    accumulatedViews = findViews(data, selection, selectionType);
                    console.log("\n input:" + JSON.stringify(input));
                    console.log("\n accumulatedViews:" + JSON.stringify(accumulatedViews));
                    console.log("\n accumulatedViews count:" + accumulatedViews.length)
                    break;
            }
        });

    } catch (err) {
        console.error(err)
    }

})