const { Plugin } = require("powercord/entities");
const Settings = require("./components/Settings");
const {
  React,
  getModule,
  FluxDispatcher,
  i18n: { Messages },
} = require("powercord/webpack");

module.exports = class FolfTweaks extends Plugin {
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
    powercord.api.settings.unregisterSettings(this.entityID);
  }

  spotifyListener(e) {
    if (!e.isPremium) {
      FluxDispatcher.dirtyDispatch({ ...e, isPremium: true });
    }
  }

  // Highly shitty code ahead, preemptive eye bleach advised.
  updateModules() {
    try {
      const { getSetting, toggleSetting } = powercord.api.settings._fluxProps(
        this.entityID
      );
      if (getSetting("highQualityStream", false)) {
        if (!this.activatedModules.highQualityStream) {
          console.log("Enabling stream patch...");
          const RequirementsModule = getModule(
            ["ApplicationStreamResolutionRequirements"],
            false
          );
          this.defaultValueCache["ApplicationStreamFPSRequirements"] = {
            ...RequirementsModule.ApplicationStreamFPSRequirements,
          };
          this.defaultValueCache["ApplicationStreamResolutionRequirements"] = {
            ...RequirementsModule.ApplicationStreamResolutionRequirements,
          };
          this.activatedModules.highQualityStream = true;
          Object.keys(
            RequirementsModule.ApplicationStreamFPSRequirements
          ).forEach(
            (key) =>
              (RequirementsModule.ApplicationStreamFPSRequirements[key] = null)
          );
          Object.keys(
            RequirementsModule.ApplicationStreamResolutionRequirements
          ).forEach(
            (key) =>
              (RequirementsModule.ApplicationStreamResolutionRequirements[
                key
              ] = null)
          );
        }
      } else if (this.activatedModules.highQualityStream) {
        console.log("Disabling stream patch...");
        const RequirementsModule = getModule(
          ["ApplicationStreamResolutionRequirements"],
          false
        );
        if (this.defaultValueCache["ApplicationStreamFPSRequirements"])
          RequirementsModule.ApplicationStreamFPSRequirements = this.defaultValueCache[
            "ApplicationStreamFPSRequirements"
          ];
        if (this.defaultValueCache["ApplicationStreamResolutionRequirements"])
          RequirementsModule.ApplicationStreamResolutionRequirements = this.defaultValueCache[
            "ApplicationStreamResolutionRequirements"
          ];
        delete this.defaultValueCache["ApplicationStreamFPSRequirements"];
        delete this.defaultValueCache[
          "ApplicationStreamResolutionRequirements"
        ];
        this.activatedModules.highQualityStream = false;
      }

      if (getSetting("extraFps", false)) {
        if (!this.activatedModules.extraFps) {
          console.log("Enabling FPS patch...");
          const RequirementsModule = getModule(
            ["ApplicationStreamResolutionRequirements"],
            false
          );
          this.defaultValueCache["ApplicationStreamFPS"] = {
            ...RequirementsModule.ApplicationStreamFPS,
          };
          this.defaultValueCache["ApplicationStreamFPSButtons"] = [
            ...RequirementsModule.ApplicationStreamFPSButtons,
          ];
          this.defaultValueCache[
            "ApplicationStreamFPSButtonsWithSuffixLabel"
          ] = [
            ...RequirementsModule.ApplicationStreamFPSButtonsWithSuffixLabel,
          ];
          this.defaultValueCache["ApplicationStreamFPSRequirements"] = {
            ...RequirementsModule.ApplicationStreamFPSRequirements,
          };
          this.activatedModules.extraFps = true;
          const fps = [120, 180, 240, 300];
          fps.forEach((e) => {
            RequirementsModule.ApplicationStreamFPS[e] = "FPS_" + e;
            RequirementsModule.ApplicationStreamFPSButtons.push({
              value: e,
              label: e,
            });
            RequirementsModule.ApplicationStreamFPSButtonsWithSuffixLabel.push({
              value: e,
            });
            RequirementsModule.ApplicationStreamFPSRequirements[e] = null;
          });
        }
      } else if (this.activatedModules.extraFps) {
        console.log("Disabling FPS patch...");
        const RequirementsModule = getModule(
          ["ApplicationStreamResolutionRequirements"],
          false
        );
        if (this.defaultValueCache["ApplicationStreamFPS"])
          RequirementsModule.ApplicationStreamFPS = this.defaultValueCache[
            "ApplicationStreamFPS"
          ];
        if (this.defaultValueCache["ApplicationStreamFPSButtons"])
          RequirementsModule.ApplicationStreamFPSButtons = this.defaultValueCache[
            "ApplicationStreamFPSButtons"
          ];
        if (
          this.defaultValueCache["ApplicationStreamFPSButtonsWithSuffixLabel"]
        )
          RequirementsModule.ApplicationStreamFPSButtonsWithSuffixLabel = this.defaultValueCache[
            "ApplicationStreamFPSButtonsWithSuffixLabel"
          ];
        if (this.defaultValueCache["ApplicationStreamFPSRequirements"])
          RequirementsModule.ApplicationStreamFPSRequirements = this.defaultValueCache[
            "ApplicationStreamFPSRequirements"
          ];
        delete this.defaultValueCache["ApplicationStreamFPS"];
        delete this.defaultValueCache["ApplicationStreamFPSButtons"];
        delete this.defaultValueCache[
          "ApplicationStreamFPSButtonsWithSuffixLabel"
        ];
        delete this.defaultValueCache["ApplicationStreamFPSRequirements"];
        this.activatedModules.extraFps = false;
      }

      if (getSetting("freeSpotify", false)) {
        if (!this.activatedModules.freeSpotify) {
          console.log("Enabling Spotify listener...");
          FluxDispatcher.subscribe(
            "SPOTIFY_PROFILE_UPDATE",
            this.spotifyListener
          );
        }
      } else if (this.activatedModules.freeSpotify) {
        console.log("Disabling Spotify listener...");
        FluxDispatcher.unsubscribe(
          "SPOTIFY_PROFILE_UPDATE",
          this.spotifyListener
        );
      }
    } catch (e) {
      console.log("Error ocurred while updating modules", e);
    }
  }
};
