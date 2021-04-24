const { React, getModule } = require("powercord/webpack");

module.exports = class ExtraFps {
  id = "extraFps";
  name = "Extra FPS Options";
  description = "Adds extra FPS options for streams.";
  defaultValueCache = {};
  enabled = false;

  constructor(main) {
    console.log("Registering " + this.id);
    this.main = main;

    const { getSetting, updateSetting } = powercord.api.settings._fluxProps(
      this.main.entityID
    );

    this.getSetting = getSetting;
    this.updateSetting = updateSetting;
  }

  setEnabled(enabled) {
    this.updateSetting(this.id, enabled);
    this.enabled = enabled;
  }

  toggle() {
    if (this.enabled) this.disable();
    else this.enable();
  }

  enable() {
    if (this.enabled) return;
    console.log("Enabling FPS patch...");
    const RequirementsModule = getModule(
      ["ApplicationStreamSettingRequirements"],
      false
    );
    this.defaultValueCache["ApplicationStreamFPS"] = {
      ...RequirementsModule.ApplicationStreamFPS,
    };
    this.defaultValueCache["ApplicationStreamFPSButtons"] = [
      ...RequirementsModule.ApplicationStreamFPSButtons,
    ];
    this.defaultValueCache["ApplicationStreamFPSButtonsWithSuffixLabel"] = [
      ...RequirementsModule.ApplicationStreamFPSButtonsWithSuffixLabel,
    ];
    this.defaultValueCache["ApplicationStreamSettingRequirements"] = {
      ...RequirementsModule.ApplicationStreamSettingRequirements,
    };
    this.setEnabled(true);
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
      [0, 1080, 720, 480].forEach((fps) => {
        RequirementsModule.ApplicationStreamSettingRequirements.push({
          resolution: fps,
          fps: e,
        });
      });
    });
  }

  disable() {
    if (!this.enabled) return;
    console.log("Disabling FPS patch...");
    const RequirementsModule = getModule(
      ["ApplicationStreamSettingRequirements"],
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
    if (this.defaultValueCache["ApplicationStreamFPSButtonsWithSuffixLabel"])
      RequirementsModule.ApplicationStreamFPSButtonsWithSuffixLabel = this.defaultValueCache[
        "ApplicationStreamFPSButtonsWithSuffixLabel"
      ];
    if (this.defaultValueCache["ApplicationStreamSettingRequirements"])
      RequirementsModule.ApplicationStreamSettingRequirements = this.defaultValueCache[
        "ApplicationStreamSettingRequirements"
      ];
    delete this.defaultValueCache["ApplicationStreamFPS"];
    delete this.defaultValueCache["ApplicationStreamFPSButtons"];
    delete this.defaultValueCache["ApplicationStreamFPSButtonsWithSuffixLabel"];
    delete this.defaultValueCache["ApplicationStreamSettingRequirements"];
    this.setEnabled(false);
  }

  unload() {
    if (!this.enabled) return;
    this.disable();
    this.setEnabled(true);
  }
};
