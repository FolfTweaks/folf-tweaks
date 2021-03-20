const { React, FluxDispatcher } = require("powercord/webpack");

module.exports = class FreeSpotify {
  id = "freeSpotify";
  name = "Listen Along Patch";
  description =
    "Patches Discord's Spotify premium check to make listen along work without Spotify premium.";
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

  spotifyListener(e) {
    if (!e.isPremium) {
      FluxDispatcher.dirtyDispatch({ ...e, isPremium: true });
    }
  }

  enable() {
    if (this.enabled) return;
    console.log("Enabling Spotify listener...");
    FluxDispatcher.subscribe("SPOTIFY_PROFILE_UPDATE", this.spotifyListener);
    this.setEnabled(true);
  }

  disable() {
    if (!this.enabled) return;
    console.log("Disabling Spotify listener...");
    FluxDispatcher.unsubscribe("SPOTIFY_PROFILE_UPDATE", this.spotifyListener);
    this.setEnabled(false);
  }
};
