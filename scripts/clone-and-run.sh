#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/muqi98-michael/cursor_cpsq_zs.git}"
PROJECT_NAME="${PROJECT_NAME:-cursor_cpsq_zs}"
BRANCH="${BRANCH:-main}"

if ! command -v git >/dev/null 2>&1; then
  echo "未检测到 git，请先安装 git。"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "未检测到 Node.js，请先安装 Node.js 18+。"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "未检测到 npm，请先安装 npm。"
  exit 1
fi

echo "==> 当前目录: $(pwd)"
echo "==> 仓库地址: $REPO_URL"
echo "==> 项目目录: $PROJECT_NAME"

if [ ! -d "$PROJECT_NAME/.git" ]; then
  echo "==> 开始克隆仓库..."
  git clone --branch "$BRANCH" "$REPO_URL" "$PROJECT_NAME"
else
  echo "==> 检测到已存在仓库目录，跳过克隆。"
fi

cd "$PROJECT_NAME"
echo "==> 进入目录: $(pwd)"
echo "==> Node 版本: $(node -v)"
echo "==> npm 版本: $(npm -v)"

if [ ! -d "node_modules" ]; then
  echo "==> 安装依赖..."
  npm install
else
  echo "==> 检测到 node_modules，跳过安装。"
fi

echo "==> 启动服务..."
npm start
