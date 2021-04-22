const { React, getModule } = require("powercord/webpack");

module.exports = class HighQualityStream {
  id = "highQualityStream";
  defaultValueCache = {};
  enabled = false;
  name = "Free HQ Streams";
  description = "Unlocks Nitro-only stream qualities.";

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
    console.log("Enabling stream patch...");
    const RequirementsModule = getModule(
      ["ApplicationStreamSettingRequirements"],
      false
    );
    this.defaultValueCache["ApplicationStreamSettingRequirements"] = {
      ...RequirementsModule.ApplicationStreamSettingRequirements,
    };
    this.setEnabled(true);
    RequirementsModule.ApplicationStreamSettingRequirements = RequirementsModule.ApplicationStreamSettingRequirements.map(
      (setting) => {
        delete setting.userPremiumType;
        delete setting.guildPremiumTier;
        return setting;
      }
    );
  }

  disable() {
    if (!this.enabled) return;
    console.log("Disabling stream patch...");
    const RequirementsModule = getModule(
      ["ApplicationStreamSettingRequirements"],
      false
    );
    if (this.defaultValueCache["ApplicationStreamSettingRequirements"])
      RequirementsModule.ApplicationStreamSettingRequirements = this.defaultValueCache[
        "ApplicationStreamSettingRequirements"
      ];
    delete this.defaultValueCache["ApplicationStreamSettingRequirements"];
    this.setEnabled(false);
  }

  unload() {
    if (!this.enabled) return;
    this.disable();
    this.setEnabled(true);
  }
};
