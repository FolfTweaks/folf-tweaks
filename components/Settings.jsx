const { React } = require("powercord/webpack");
const { SwitchItem } = require("powercord/components/settings");

module.exports = ({ main, getSetting, toggleSetting }) => {
  console.log("wtf");

  return (
    <>
      {Object.values(main.modules).map((module) => {
        return (
          <SwitchItem
            key={module.id}
            value={module.enabled}
            onChange={() => module.toggle()}
            note={module.description}
          >
            {module.name}
          </SwitchItem>
        );
      })}
    </>
  );
};
