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
      ["ApplicationStreamResolutionRequirements"],
      false
    );
    this.defaultValueCache["ApplicationStreamFPSRequirements"] = {
      ...RequirementsModule.ApplicationStreamFPSRequirements,
    };
    this.defaultValueCache["ApplicationStreamResolutionRequirements"] = {
      ...RequirementsModule.ApplicationStreamResolutionRequirements,
    };
    this.setEnabled(true);
    Object.keys(RequirementsModule.ApplicationStreamFPSRequirements).forEach(
      (key) => (RequirementsModule.ApplicationStreamFPSRequirements[key] = null)
    );
    Object.keys(
      RequirementsModule.ApplicationStreamResolutionRequirements
    ).forEach(
      (key) =>
        (RequirementsModule.ApplicationStreamResolutionRequirements[key] = null)
    );
  }

  disable() {
    if (!this.enabled) return;
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
    delete this.defaultValueCache["ApplicationStreamResolutionRequirements"];
    this.setEnabled(false);
  }

  unload() {
    if (!this.enabled) return;
    this.disable();
    this.setEnabled(true);
  }
};
