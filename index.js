const {Plugin} = require('powercord/entities')
let hide_interval = null;
module.exports = class hide_blocked extends Plugin {
    startPlugin(){
        powercord.api.commands.registerCommand({
            command: 'hideblocked',
            description: 'Automatically hide blocked messages every interval (default 500ms)',
            usage: '{c} <interval>',
            executor: (args) => start(args)
        });

        powercord.api.commands.registerCommand({
            command: 'unhideblocked',
            description: 'Unhide all blocked messages.',
            usage: '{c}',
            executor: (args) => stop()
        });
    }
    
    pluginWillUnload(){
        powercord.api.commands.unregisterCommand('hideblocked');
        powercord.api.commands.unregisterCommand('unhideblocked');
    }
}

function start(args){
    if (args == "" || !Number.isFinite(args)) args = 500;
    hide_interval = setInterval(hideBlocked, args);
}

function stop(){
    clearInterval(hide_interval);
    unhideBlocked();
}

function hideBlocked(){
    const blocked = document.querySelectorAll('[class^="groupStart"]'); // Find all "Blocked Messages"
    blocked.forEach(blokMsg => {
        if(blokMsg.style.display !== "none") blokMsg.style.display = "none"; // Hide the message if it's not already hidden.
    });
};

function unhideBlocked(){
    const blocked = document.querySelectorAll('[class^="groupStart"]');
    blocked.forEach(blokMsg => {
        if(blokMsg.style.display === "none") blokMsg.style.display = ""; // Unhide the messages if they were previously hidden.
    });
};
