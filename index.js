const { Plugin } = require("powercord/entities");
const Settings = require("./components/Settings");
const { React } = require("powercord/webpack");
const HighQualityStream = require("./modules/highQualityStream");
const ExtraFps = require("./modules/extraFps");
const FreeSpotify = require("./modules/freeSpotify");

module.exports = class FolfTweaks extends Plugin {
  modules = {
    highQualityStream: new HighQualityStream(this),
    extraFps: new ExtraFps(this),
    freeSpotify: new FreeSpotify(this),
  };

  activatedModules = {
    highQualityStream: false,
    extraFps: false,
    freeSpotify: false,
  };
  defaultValueCache = {};
  async startPlugin() {
    powercord.api.settings.registerSettings(this.entityID, {
      category: this.entityID,
      label: "Folf's Tweaks",
      render: (props) =>
        React.createElement(Settings, {
          ...props,
          main: this,
        }),
    });
    this.updateModules();
  }

  pluginWillUnload() {
    this.modules.forEach((m) => m.disable());
    powercord.api.settings.unregisterSettings(this.entityID);
  }

  toggleModule(name) {
    modules[name].toggle();
  }

  updateModules() {
    const { getSetting } = powercord.api.settings._fluxProps(this.entityID);
    Object.keys(this.modules).forEach((key) => {
      console.log(this.modules[key]);
      try {
        var module = this.modules[key];
        if (getSetting(key, false)) module.enable();
        else module.disable();
      } catch (e) {
        console.log("Failed to enabled " + key, e);
      }
    });
  }
};
