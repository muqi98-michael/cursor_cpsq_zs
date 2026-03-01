const fs = require("fs");
const path = require("path");

function loadPermissionsInput() {
  const filePath = path.join(__dirname, "..", "data", "permissions-config.input.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function getPermissionsConfigContent() {
  const input = loadPermissionsInput();
  return {
    source: input.meta,
    sidebar: input.sidebar,
    topbar: input.topbar,
    page: input.page,
    templates: input.templates,
    activeTemplate: input.activeTemplate,
    permissionTree: input.permissionTree,
    actionOrder: input.actionOrder || ["查看", "新增", "编辑", "删除", "下载"]
  };
}

module.exports = {
  getPermissionsConfigContent
};
