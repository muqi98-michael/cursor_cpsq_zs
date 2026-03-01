const fs = require("fs");
const path = require("path");

function loadUsersInput() {
  const filePath = path.join(__dirname, "..", "data", "users-list.input.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function getUsersListContent() {
  const input = loadUsersInput();
  return {
    source: input.meta,
    sidebar: input.sidebar,
    topbar: input.topbar,
    page: input.page,
    filters: input.filters,
    tableColumns: input.tableColumns,
    rows: input.rows,
    pagination: input.pagination
  };
}

module.exports = {
  getUsersListContent
};
