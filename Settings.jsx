const { React } = require('powercord/webpack');
const { SwitchItem } = require('powercord/components/settings');
module.exports = class Settings extends React.PureComponent {
    constructor(props){
        super(props);
    }
    render(){ 
        const { getSetting, toggleSetting } = this.props;
        return (
            <div>
                <SwitchItem
                    onChange={(e) => {
                        toggleSetting('auto-hide');
                    }}
                    value={getSetting('auto-hide', true)}
                    note="Immediately starts hiding blocked messages on startup (applies next reload)."
                >Auto Hide on Startup</SwitchItem>
            </div>
        )
    }
}
