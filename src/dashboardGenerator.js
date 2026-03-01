const fs = require("fs");
const path = require("path");

function loadDashboardInput() {
  const filePath = path.join(__dirname, "..", "data", "dashboard.input.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function loadDashboardLayers() {
  const filePath = path.join(__dirname, "..", "data", "dashboard.layers.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function getDashboardContent() {
  const input = loadDashboardInput();
  return {
    source: input.meta,
    sidebar: input.sidebar,
    topbar: input.topbar,
    header: input.header,
    metrics: input.metrics,
    distributions: input.distributions,
    trend: input.trend,
    updates: input.updates,
    ranking: input.ranking
  };
}

function getDashboardLayers() {
  return loadDashboardLayers();
}

module.exports = {
  getDashboardContent,
  getDashboardLayers
};
