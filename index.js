/* Removes the "x blocked messages - show messages" tag when you block someone on Discord.
 * Does not use an interval; instead, subscribe to Flux events.
 * For use as a Powercord plugin.
 */

//TODO: Maybe a nice settings page
//TODO: Save user settings between reloads

const { Plugin } = require("powercord/entities");
const { React } = require("powercord/webpack");
const Settings = require("./Settings");

module.exports = class hide_blocked extends Plugin {
    startPlugin(){
        powercord.api.commands.registerCommand({
            command: "hideblocked",
            description: "Automatically hide blocked messages",
            usage: "{c}",
            executor: () => hideBlocked()
        });

        powercord.api.commands.registerCommand({
            command: "showblocked",
            description: "show all blocked messages and stop hiding them automatically",
            usage: "{c}",
            executor: () => showBlocked()
        });

        powercord.api.settings.registerSettings("hide-blocked", {
            category: this.entityID,
            label: "Hide Blocked Messages",
            render: (props) => React.createElement(Settings, {...props})
        });

        if (this.settings.get("auto-hide", true)){
            hideBlocked();
        }
        
    }

    pluginWillUnload(){
        powercord.api.commands.unregisterCommand("hideblocked");
        powercord.api.commands.unregisterCommand("showblocked");
        powercord.api.settings.unregisterSettings("hide-blocked");

        showBlocked();
    }
}

hideBlocked = () => { 
    if (document.querySelector('#hide-blocked-messages-css')) return;
    let style = document.createElement('style');
    style.id = 'hide-blocked-messages-css';
    style.innerHTML = '[class^="groupStart"] {display: none !important}'; // !important is probably unnecessary
    document.head.appendChild(style);
}

showBlocked = () => { 
    document.querySelector('#hide-blocked-messages-css')?.remove() 
}

