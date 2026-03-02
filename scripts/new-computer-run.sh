#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo "==> 项目目录: $PROJECT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "未检测到 Node.js，请先安装 Node.js 18+ 再重试。"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "未检测到 npm，请先安装 npm 再重试。"
  exit 1
fi

echo "==> Node 版本: $(node -v)"
echo "==> npm 版本: $(npm -v)"

if [ ! -d "node_modules" ]; then
  echo "==> 首次运行，安装依赖..."
  npm install
else
  echo "==> 检测到 node_modules，跳过安装。"
fi

echo "==> 启动服务..."
npm start
