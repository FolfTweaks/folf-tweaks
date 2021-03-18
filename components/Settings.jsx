const { React } = require('powercord/webpack')
const { SwitchItem } = require('powercord/components/settings')


module.exports = ({ main, getSetting, toggleSetting }) => {
    toggleSetting_ = (name) => {
        toggleSetting(name);
        main.updateModules();
    }

    return (<>
        <SwitchItem
            value={getSetting('highQualityStream')}
            onChange={() => toggleSetting_('highQualityStream')}
            note='Unlock nitro-only stream qualities.'
        >High Quality Streams</SwitchItem>
        <SwitchItem
            value={getSetting('extraFps')}
            onChange={() => toggleSetting_('extraFps')}
            note='Adds a few extra FPS options for streams.'
        >More FPS</SwitchItem>
        <SwitchItem
            value={getSetting('freeSpotify')}
            onChange={() => toggleSetting_('freeSpotify')}
            note="Patches Discord's spotify premium check mode."
        >Free listen along</SwitchItem>
    </>);
}
