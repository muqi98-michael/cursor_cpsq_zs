const fs = require("fs");
const path = require("path");

function loadOpenManagementInput() {
  const filePath = path.join(__dirname, "..", "data", "open-management.input.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function getOpenManagementContent() {
  const input = loadOpenManagementInput();
  return {
    source: input.meta,
    sidebar: input.sidebar,
    topbar: input.topbar,
    page: input.page,
    cardsTop: input.cardsTop,
    cardsBottom: input.cardsBottom
  };
}

module.exports = {
  getOpenManagementContent
};
