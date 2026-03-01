# Calicat MCP 首页生成示例

一个本地轻量级 Web 应用，基于 Calicat 图层的 MCP 数据生成首页内容并渲染。

## 已使用的图层信息

- `file_id`: `2026964440132292608`
- `selected_layer_id`: `e0e02d60-d6bf-49b0-aee8-4fd40c393411`
- MCP 工具：`user-user-calicat/get_design_data`
- 图层-页面关系台账：`docs/mcp-layer-page-map.md`（支持 1 页面关联多个新老图层）

## GitHub 连接信息（已存储）

- 远程仓库（origin）：`https://github.com/muqi98-michael/cursor_cpsq_zs.git`
- Pages 地址：`https://muqi98-michael.github.io/cursor_cpsq_zs/`

## 迁移到另一台电脑（Cursor）

推荐方式（最稳）：

```bash
git clone https://github.com/muqi98-michael/cursor_cpsq_zs.git
cd cursor_cpsq_zs
npm install
npm start
```

如果你是“打包目录”拷贝过去：

- 请确保连同隐藏目录 `.git` 一起拷贝，否则会丢失 GitHub 连接关系。
- 到新电脑后执行：`npm install && npm start`
- 直接用 Cursor 打开该目录即可继续开发。
- 或执行一键脚本：`bash scripts/new-computer-run.sh`

## 一键克隆 + 启动（任意目录执行）

在任意目录执行下面命令：

```bash
bash /path/to/cursor_cpsq_zs/scripts/clone-and-run.sh
```

可选环境变量（不传则用默认值）：

- `REPO_URL`（默认：`https://github.com/muqi98-michael/cursor_cpsq_zs.git`）
- `PROJECT_NAME`（默认：`cursor_cpsq_zs`）
- `BRANCH`（默认：`main`）

示例：

```bash
REPO_URL="https://github.com/muqi98-michael/cursor_cpsq_zs.git" PROJECT_NAME="demo_proj" BRANCH="main" bash /path/to/cursor_cpsq_zs/scripts/clone-and-run.sh
```

## 本地运行

```bash
npm install
npm start
```

启动后访问：

- 首页：`http://localhost:3000`
- MCP 图层实现索引页（本轮新增）：`http://localhost:3000/mcp-pages.html`
- 登录页（本轮新增）：`http://localhost:3000/login.html`
- 通用图层渲染页：`http://localhost:3000/prototype.html?node=<node-id>`
- 概览仪表盘页（新图层实现）：`http://localhost:3000/dashboard.html`
- 产品场景列表页：`http://localhost:3000/scenes.html`
- 场景详情页（示例）：`http://localhost:3000/scenes/SC-2023001`
- 供应商协同详情页（图层实现）：`http://localhost:3000/scenes/SC-2023002`
- 场景编辑页（示例）：`http://localhost:3000/scenes/SC-2023001/edit`
- 生成内容接口：`http://localhost:3000/api/homepage-content`
- 概览仪表盘接口：`http://localhost:3000/api/dashboard-content`
- 概览仪表盘图层清单：`http://localhost:3000/api/dashboard-layers`
- MCP 图层接口（本轮新增）：`http://localhost:3000/api/layer/<node-id>`
- 列表页内容接口：`http://localhost:3000/api/scenes-content`
- 场景详情接口（示例）：`http://localhost:3000/api/scenes/SC-2023001`
- 健康检查：`http://localhost:3000/health`

## 目录说明

- `data/design-layer.input.json`：从 MCP 图层提炼出的结构化输入
- `data/dashboard.input.json`：概览仪表盘图层提炼出的结构化输入
- `data/dashboard.layers.json`：概览仪表盘全部未隐藏图层清单（id/name/type/level）
- `src/homepageGenerator.js`：根据图层输入生成首页内容
- `src/dashboardGenerator.js`：根据图层输入生成概览仪表盘内容
- `src/scenesListGenerator.js`：根据图层输入生成产品场景列表页内容
- `public/prototype.html|css|js`：按图层坐标渲染的通用页面（像素贴近原型）
- `public/mcp-pages.html`：MCP 图层实现索引页
- `docs/mcp-layer-page-map.md`：MCP 图层与本地页面关系台账（建议每次图层变更后追加记录）
- `public/`：前端页面与样式
- `server.js`：轻量 Express 服务
