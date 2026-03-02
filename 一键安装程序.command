#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

chmod +x "$0" 2>/dev/null || true
chmod +x "scripts/new-computer-run.sh" 2>/dev/null || true
chmod +x "scripts/clone-and-run.sh" 2>/dev/null || true

if [ ! -f "scripts/new-computer-run.sh" ]; then
  echo "未找到 scripts/new-computer-run.sh，请确认项目文件完整。"
  exit 1
fi

echo "==> 正在执行：一键安装程序"
bash "scripts/new-computer-run.sh"
