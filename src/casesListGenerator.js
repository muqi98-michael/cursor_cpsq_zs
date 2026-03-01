const fs = require("fs");
const path = require("path");

function loadCasesInput() {
  const filePath = path.join(__dirname, "..", "data", "cases-list.input.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function getCasesListContent() {
  const input = loadCasesInput();
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

function getCaseDetail(caseId) {
  return getCasesListContent().rows.find((row) => row.caseId === caseId) || null;
}

module.exports = {
  getCasesListContent,
  getCaseDetail
};
