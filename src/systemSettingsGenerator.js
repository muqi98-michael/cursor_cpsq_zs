const fs = require("fs");
const path = require("path");

function loadSystemSettingsInput() {
  const filePath = path.join(__dirname, "..", "data", "system-settings.input.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function getSystemSettingsContent() {
  const input = loadSystemSettingsInput();
  return {
    source: input.meta,
    sidebar: input.sidebar,
    topbar: input.topbar,
    page: input.page,
    tabs: input.tabs,
    activeTab: input.activeTab,
    systemParams: input.systemParams,
    templateModules: input.templateModules,
    securitySettings: input.securitySettings,
    notifySettings: input.notifySettings,
    uploadSettings: input.uploadSettings
  };
}

module.exports = {
  getSystemSettingsContent
};
