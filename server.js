const express = require("express");
const path = require("path");
const fs = require("fs");
const { getHomepageContent } = require("./src/homepageGenerator");
const { getScenesListContent, getSceneDetail } = require("./src/scenesListGenerator");
const { getSolutionsListContent, getSolutionDetail } = require("./src/solutionsListGenerator");
const { getCasesListContent, getCaseDetail } = require("./src/casesListGenerator");
const { getUsersListContent } = require("./src/usersListGenerator");
const { getPermissionsConfigContent } = require("./src/permissionsConfigGenerator");
const { getSystemSettingsContent } = require("./src/systemSettingsGenerator");
const { getOpenManagementContent } = require("./src/openManagementGenerator");
const { getDashboardContent, getDashboardLayers } = require("./src/dashboardGenerator");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/homepage-content", (req, res) => {
  const homepageContent = getHomepageContent();
  res.json(homepageContent);
});

app.get("/api/dashboard-content", (req, res) => {
  const dashboardContent = getDashboardContent();
  res.json(dashboardContent);
});

app.get("/api/dashboard-layers", (req, res) => {
  const dashboardLayers = getDashboardLayers();
  res.json(dashboardLayers);
});

const layerDataDir = process.env.LAYER_DATA_DIR || path.join(__dirname, "data", "layers");

const layerFileMap = {
  "fddb1787-4aa1-4198-8571-088c78ef040a": "0add2116-41b2-47e1-8b02-1fd3ab3602f9.txt",
  "2ba3ce23-c775-4d50-bf02-2f394c6e3c60": "a2e1b2a0-32cf-49cf-ac05-3fb186e74ede.txt",
  "fba722a5-cd8b-4549-8de3-79b8d20b2f81": "5920d340-0dc0-4d48-bd7c-78a0a1bbbde4.txt",
  "758694ba-8efa-4aeb-9c22-64c66c35f5e1": "42cb5631-3de4-4d24-9695-68f73f891505.txt",
  "e05b02c7-821a-439f-9950-0f5ea48fb1d3": "7d9095e1-58c4-4780-bfe8-042c831f8d6a.txt",
  "725be0e1-3496-4542-93f6-0b3a3256ee4c": "146a95ff-8e8a-436e-ad4b-38ba05b5e2c3.txt",
  "22797a59-a88e-4035-b8cb-c8239ef559b7": "bb909a44-8221-48ff-9c96-394a2d836502.txt"
};

app.get("/api/layer/:id", (req, res) => {
  const layerId = req.params.id;
  const fileName = layerFileMap[layerId];
  if (!fileName) {
    res.status(404).json({ message: "该图层未接入渲染服务" });
    return;
  }
  const filePath = path.join(layerDataDir, fileName);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: "图层源文件未随项目打包，请检查 data/layers 或 LAYER_DATA_DIR 配置" });
    return;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    const layerData = parsed?.result?.[0]?.layerData;
    if (!layerData) {
      res.status(500).json({ message: "图层数据解析失败" });
      return;
    }
    res.json(layerData);
  } catch (error) {
    res.status(500).json({ message: "读取图层文件失败", detail: String(error?.message || error) });
  }
});

app.get("/api/scenes-content", (req, res) => {
  const scenesContent = getScenesListContent();
  res.json(scenesContent);
});

app.get("/api/solutions-content", (req, res) => {
  const solutionsContent = getSolutionsListContent();
  res.json(solutionsContent);
});

app.get("/api/solutions/:id", (req, res) => {
  const solution = getSolutionDetail(req.params.id);
  if (!solution) {
    res.status(404).json({ message: "解决方案不存在" });
    return;
  }
  res.json(solution);
});

app.get("/api/cases-content", (req, res) => {
  const casesContent = getCasesListContent();
  res.json(casesContent);
});

app.get("/api/cases/:id", (req, res) => {
  const item = getCaseDetail(req.params.id);
  if (!item) {
    res.status(404).json({ message: "案例不存在" });
    return;
  }
  res.json(item);
});

app.get("/api/users-content", (req, res) => {
  const usersContent = getUsersListContent();
  res.json(usersContent);
});

app.get("/api/permissions-content", (req, res) => {
  const permissionsContent = getPermissionsConfigContent();
  res.json(permissionsContent);
});

app.get("/api/settings-content", (req, res) => {
  const settingsContent = getSystemSettingsContent();
  res.json(settingsContent);
});

app.get("/api/open-management-content", (req, res) => {
  const openManagementContent = getOpenManagementContent();
  res.json(openManagementContent);
});

app.get("/api/scenes/:id", (req, res) => {
  const scene = getSceneDetail(req.params.id);
  if (!scene) {
    res.status(404).json({ message: "场景不存在" });
    return;
  }
  res.json(scene);
});

app.get("/scenes/:id/edit", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "scene-edit.html"));
});

app.get("/solutions/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "solution-detail.html"));
});

app.get("/users.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "users.html"));
});

app.get("/permissions.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "permissions.html"));
});

app.get("/settings.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "settings.html"));
});

app.get("/open-management.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "open-management.html"));
});

app.get("/cases.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cases.html"));
});

app.get("/cases/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "case-detail.html"));
});

app.get("/scenes/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "scene-detail.html"));
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
