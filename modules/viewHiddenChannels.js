const { Icon } = require("powercord/components");
const {
  React,
  getModule,
  getModuleByDisplayName,
} = require("powercord/webpack");
const { inject, uninject } = require("powercord/injector");

module.exports = class ViewHiddenChannels {
  id = "viewHiddenChannels";
  enabled = false;
  name = "View Hidden Channels";
  description =
    "EXPERIMENTAL! Show channels you do not have permission to see.";
  lockedChannels = [];

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

    const RequirementsModule = getModule(["getChannelPermissions"], false);
    const ChannelItem = getModule(
      (m) => m.default && m.default.displayName == "ChannelItem",
      false
    );
    const Tooltip = getModuleByDisplayName("Tooltip", false);
    const UnreadChannelUtils = getModule(
      ["hasUnread", "getMentionCount"],
      false
    );
    const classes = getModule(["iconItem"], false);
    const classes2 = getModule(["modeUnread"], false);

    inject("folf-permission-patch", RequirementsModule, "can", (args, res) => {
      if (args.length < 2 || !args[0].data || args[0].data != 1024n) return res;
      if (!res) {
        if (!this.lockedChannels.includes(args[1].id))
          this.lockedChannels.push(args[1].id);
        return true;
      }
      return res;
    });

    inject("folf-channel-render", ChannelItem, "default", (args, res) => {
      window.fuckywucky = res;
      if (this.lockedChannels.includes(args[0].channel.id)) {
        res.props.children.props.children[1].props.children[0].props.href = null;
        res.props.children.props.children[1].props.children[0].props.onClick = (
          _
        ) => {};
        res.props.children.props.onMouseDown = (_) => {};
        res.props.children.props.onMouseUp = (_) => {};

        const el = React.createElement(
          "div",
          { className: classes2.children },
          [
            undefined,
            React.createElement(
              "div",
              {
                className: classes.iconBase,
                channel: args[0].channel,
                guild: args[0].guild,
              },
              React.createElement(
                Tooltip,
                {
                  text: "Locked",
                },
                (props) =>
                  React.createElement(Icon, {
                    ...props,
                    name: "LockClosed",
                    className: classes.actionIcon,
                    width: 16,
                    height: 16,
                  })
              )
            ),
          ]
        );

        if (res.props.children.props.children[1].props.children.length > 1)
          res.props.children.props.children[1].props.children[1] = el;
        else res.props.children.props.children[1].props.children.push(el);
      }

      return res;
    });

    inject(
      "folf-disabledUnread",
      UnreadChannelUtils,
      "hasUnread",
      (args, res) => {
        if (this.lockedChannels.includes(args[0])) return false;
        return res;
      }
    );

    this.setEnabled(true);
  }

  disable() {
    if (!this.enabled) return;
    uninject("folf-permission-patch");
    uninject("folf-channel-render");
    uninject("folf-disabledUnread");
    this.setEnabled(false);
  }
};
