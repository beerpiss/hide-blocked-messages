/* Removes the "x blocked messages - show messages" tag when you block someone on Discord.
 * Does not use an interval; instead, subscribe to Flux events.
 * For use as a Powercord plugin.
 */

//TODO: Maybe a nice settings page
//TODO: Save user settings between reloads

const { Plugin } = require("powercord/entities");
const { FluxDispatcher, React } = require("powercord/webpack");
const Settings = require("./Settings");

module.exports = class hide_blocked extends Plugin {
    startPlugin(){
        powercord.api.commands.registerCommand({
            command: "hideblocked",
            description: "Automatically hide blocked messages",
            usage: "{c}",
            executor: () => start()
        });

        powercord.api.commands.registerCommand({
            command: "unhideblocked",
            description: "Unhide all blocked messages and stop hiding them automatically",
            usage: "{c}",
            executor: () => stop()
        });

        powercord.api.settings.registerSettings("hide-blocked", {
            category: this.entityID,
            label: "Hide Blocked Messages",
            render: (props) => React.createElement(Settings, {...props})
        });

        if (this.settings.get("auto-hide", true)){
            start();
        }
    }

    pluginWillUnload(){
        powercord.api.commands.unregisterCommand("hideblocked");
        powercord.api.commands.unregisterCommand("unhideblocked");
        FluxDispatcher.unsubscribe("MESSAGE_CREATE", hideBlocked);
        FluxDispatcher.unsubscribe("LOAD_MESSAGES_SUCCESS", hideBlocked);
        FluxDispatcher.unsubscribe("RELATIONSHIP_UPDATE", hideBlocked);
        powercord.api.settings.unregisterSettings("hide-blocked");
    }
}

/* Subscribes to three events most useful in auto-removal:
 * MESSAGE_CREATE: When a new message is posted, not necessarily yours.
 * LOAD_MESSAGES_SUCCESS: When a channel is fully loaded.
 * RELATIONSHIP_UPDATE: When your relationships (friends, blocking, etc.) is updated
 */
function start(){
    hideBlocked();
    FluxDispatcher.subscribe("MESSAGE_CREATE", hideBlocked);
    FluxDispatcher.subscribe("LOAD_MESSAGES_SUCCESS", hideBlocked);
    FluxDispatcher.subscribe("RELATIONSHIP_UPDATE", hideBlocked);
}


function stop(){
    FluxDispatcher.unsubscribe("MESSAGE_CREATE", hideBlocked);
    FluxDispatcher.unsubscribe("LOAD_MESSAGES_SUCCESS", hideBlocked);
    FluxDispatcher.unsubscribe("RELATIONSHIP_UPDATE", hideBlocked);
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
