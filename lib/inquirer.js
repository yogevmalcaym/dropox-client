const inquirer = require('inquirer');

module.exports = {
    askForName: () => {
        const questions = [{
            name: 'username',
            type: 'input',
            message: 'Hello clien, what is your name?',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter a name';
                }
            }
        }];
        return inquirer.prompt(questions);
    }
}