function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function colorFromFill(fill) {
  if (!Array.isArray(fill)) return "";
  const first = fill.find((item) => item && !item.hide && item.value);
  return first?.value?.value || "";
}

function toPx(value) {
  return typeof value === "number" ? `${value}px` : "";
}

function applyCommonStyle(element, node) {
  element.style.width = toPx(node.width);
  element.style.height = toPx(node.height);

  const matrix = node.$matrix || [1, 0, 0, 1, node.width / 2, node.height / 2];
  const centerX = Number(matrix[4] || 0);
  const centerY = Number(matrix[5] || 0);
  const left = centerX - Number(node.width || 0) / 2;
  const top = centerY - Number(node.height || 0) / 2;
  element.style.left = `${left}px`;
  element.style.top = `${top}px`;

  const fillColor = colorFromFill(node.$fill);
  if (fillColor) element.style.background = fillColor;

  const strokeColor = colorFromFill(node.$stroke);
  if (strokeColor && Number(node.strokeWidth || 0) > 0) {
    element.style.border = `${node.strokeWidth}px solid ${strokeColor}`;
  }

  if (Array.isArray(node.$radius) && node.$radius.length === 4) {
    element.style.borderRadius = `${node.$radius[0]}px ${node.$radius[1]}px ${node.$radius[2]}px ${node.$radius[3]}px`;
  }

  if (Array.isArray(node.$shadow) && node.$shadow[0]?.value?.value) {
    element.style.boxShadow = node.$shadow[0].value.value;
  }

  if (node.clip === true) {
    element.style.overflow = "hidden";
  }
}

function renderNode(node, parentEl) {
  const kind = node.type || "Frame";
  const isText = kind === "TextRect" || kind === "Paragraph";
  const el = document.createElement("div");
  el.className = `node ${isText ? "node-text" : ""}`;
  el.dataset.nodeId = node.id || "";
  el.dataset.nodeType = kind;
  el.title = `${node.name || "图层"} (${kind})`;

  applyCommonStyle(el, node);

  if (kind === "Circle") {
    el.style.borderRadius = "9999px";
  }

  if (kind === "Line") {
    el.style.height = "1px";
    const lineColor = colorFromFill(node.$stroke) || "#cbd5e1";
    el.style.background = lineColor;
    el.style.border = "0";
  }

  if (isText) {
    const text = typeof node.text === "string" ? node.text : "";
    el.textContent = text;
    el.style.fontSize = toPx(node.fontSize || 14);
    el.style.fontFamily = node.fontFamily || "PingFang SC, Microsoft YaHei, sans-serif";
    el.style.color = colorFromFill(node.$fontFill) || "#111827";
    el.style.textAlign = node.textAlign || "left";
    if (typeof node.lineHeight === "number" && typeof node.fontSize === "number") {
      el.style.lineHeight = `${Math.round(node.lineHeight * node.fontSize)}px`;
    }
    if (!text.trim() && node.name === "spacer") {
      el.classList.add("node-hidden-text");
    }
  }

  parentEl.appendChild(el);

  const children = Array.isArray(node.objects) ? node.objects : [];
  children.forEach((child) => renderNode(child, el));
}

async function bootstrap() {
  const id = getParam("node");
  if (!id) {
    document.body.innerHTML = "<main style='padding:24px'>缺少 node 参数，例如 /prototype.html?node=xxxx</main>";
    return;
  }

  const response = await fetch(`/api/layer/${encodeURIComponent(id)}`);
  if (!response.ok) {
    document.body.innerHTML = "<main style='padding:24px'>图层读取失败，请确认该 node 已接入。</main>";
    return;
  }

  const root = await response.json();
  const canvas = document.getElementById("canvas");
  canvas.innerHTML = "";
  canvas.style.width = `${root.width}px`;
  canvas.style.height = `${root.height}px`;
  document.getElementById("meta").textContent = `${root.name} | ${root.width} x ${root.height} | ${id}`;

  renderNode(root, canvas);
}

bootstrap().catch((error) => {
  document.body.innerHTML = "<main style='padding:24px'>页面渲染失败。</main>";
  console.error(error);
});
