function getSolutionIdFromPath() {
  const queryId = new URLSearchParams(window.location.search).get("id");
  if (queryId) return queryId;
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[1] || "";
}

async function loadSolution(solutionId) {
  const sources = ["./solutions-details.json", `/api/solutions/${encodeURIComponent(solutionId)}`];
  for (const url of sources) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      if (url.endsWith(".json")) {
        const map = await response.json();
        if (map[solutionId]) return map[solutionId];
        continue;
      }
      return response.json();
    } catch (error) {
      // try next source
    }
  }
  throw new Error("解决方案不存在");
}

function renderTags(targetId, items) {
  const root = document.getElementById(targetId);
  root.innerHTML = "";
  const isAppTags = targetId === "related-apps";
  items.forEach((item, index) => {
    const span = document.createElement("span");
    const toneClass = isAppTags ? "purple" : index === 0 ? "blue" : "gray";
    span.className = `tag ${toneClass}`;
    span.textContent = item;
    root.appendChild(span);
  });
}

function renderProjectBackground(items) {
  const root = document.getElementById("project-background");
  root.innerHTML = "";
  items.forEach((item) => {
    const p = document.createElement("p");
    p.textContent = item;
    root.appendChild(p);
  });
}

function renderPainPoints(items) {
  const root = document.getElementById("pain-list");
  root.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    root.appendChild(li);
  });
}

function renderFeatures(items) {
  const root = document.getElementById("feature-list");
  root.innerHTML = "";
  items.forEach((item) => {
    const block = document.createElement("div");
    block.className = "feature-item";
    block.innerHTML = `<h5>${item.title}</h5><p>${item.desc}</p>`;
    root.appendChild(block);
  });
}

function renderValues(items) {
  const root = document.getElementById("value-list");
  root.innerHTML = "";
  const iconMap = {
    blue: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13 7h-2V5h2v2Zm0 12h-2v-8h2v8Zm-1-17a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/></svg>',
    purple: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v1.1c2.5.4 4.5 2 4.5 4.3h-2c0-1.5-1.4-2.5-3.5-2.5s-3.5 1-3.5 2.3c0 1.2 1 1.9 3.9 2.5 3 .6 5.1 1.7 5.1 4.3 0 2.3-1.9 3.9-4.5 4.3V21a1 1 0 1 1-2 0v-1.1c-2.9-.4-4.9-2.1-4.9-4.5h2c0 1.6 1.5 2.7 3.9 2.7s3.5-.9 3.5-2.2c0-1.2-.9-1.9-3.8-2.5-3.1-.7-5.1-1.8-5.1-4.4 0-2.3 1.9-4 4.5-4.4V4a1 1 0 0 1 1-1Z"/></svg>',
    orange: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4 0-7.5 2-7.5 4.5V20h15v-1.5C19.5 16 16 14 12 14Z"/></svg>',
    green: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 4 4 12h5v7h6v-7h5l-8-8Zm1 10v3h-2v-3h2Z"/></svg>',
    yellow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-4 12.8V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.2A7 7 0 0 0 12 2Zm2 15h-4v-1h4v1Zm0-3.3V14h-4v-.3l-.4-.3A5 5 0 1 1 14.4 13l-.4.3Z"/></svg>'
  };
  items.forEach((item) => {
    const tone = item.tone || "blue";
    const block = document.createElement("div");
    block.className = "value-item";
    block.innerHTML = `
      <span class="value-icon ${tone}">${iconMap[tone] || iconMap.blue}</span>
      <div>
        <h5>${item.title}</h5>
        <p>${item.desc}</p>
      </div>
    `;
    root.appendChild(block);
  });
}

function renderLinks(targetId, items) {
  const root = document.getElementById(targetId);
  root.innerHTML = "";
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "link-item";
    row.innerHTML = `
      <span class="link-left">
        <span class="link-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10.6 13.4a1 1 0 0 1 0-1.4l2.8-2.8a3 3 0 1 1 4.2 4.2l-2 2a3 3 0 0 1-4.2 0 1 1 0 1 1 1.4-1.4 1 1 0 0 0 1.4 0l2-2a1 1 0 1 0-1.4-1.4L12 14.8a1 1 0 0 1-1.4 0Zm2.8-2.8a1 1 0 0 1 0 1.4l-2.8 2.8a3 3 0 0 1-4.2-4.2l2-2a3 3 0 0 1 4.2 0 1 1 0 0 1-1.4 1.4 1 1 0 0 0-1.4 0l-2 2a1 1 0 0 0 1.4 1.4l2.8-2.8a1 1 0 0 1 1.4 0Z"/></svg>
        </span>
        <span>${item}</span>
      </span>
      <span class="link-arrow">›</span>
    `;
    root.appendChild(row);
  });
}

function renderSolution(solution) {
  document.title = `${solution.name} - 解决方案详情`;
  document.getElementById("breadcrumb").textContent = `首页 > 产品解决方案 > ${solution.name}`;
  document.getElementById("solution-name").textContent = solution.name;
  document.getElementById("meta-row").innerHTML = `
    <span>${solution.company || "某汽车制造集团有限公司"}</span>
    <span>编辑者: ${solution.editor}</span>
    <span>更新时间: ${solution.updatedAt}</span>
    <span>行业: ${solution.industryName || solution.industry || "-"}</span>
    <span class="status-${solution.statusTone}">状态: ${solution.status}</span>
  `;

  renderTags("related-products", solution.relatedProducts);
  renderTags("related-domains", solution.relatedDomains);
  renderTags("related-apps", solution.relatedApps);

  renderProjectBackground(solution.projectBackground || [solution.description]);
  renderPainPoints(solution.painPoints || []);
  renderFeatures(solution.featureDetails || solution.modules || []);
  renderValues(solution.valueItems || []);
  renderLinks("related-scenes", solution.relatedScenes || []);
  renderLinks("related-resources", solution.relatedResources || []);

  document.getElementById("go-edit").addEventListener("click", () => {
    window.alert("编辑功能开发中");
  });
  document.getElementById("go-download").addEventListener("click", () => {
    window.alert("下载功能开发中");
  });
}

function bindSidebarNav() {
  const items = document.querySelectorAll(".sidebar .nav-item");
  items.forEach((button) => {
    const label = button.querySelector("span:last-child")?.textContent || button.textContent;
    window.AppRoutes?.bindByLabel(button, label);
  });
}

async function bootstrap() {
  try {
    bindSidebarNav();
    const solutionId = getSolutionIdFromPath();
    const solution = await loadSolution(solutionId);
    renderSolution(solution);
  } catch (error) {
    document.body.innerHTML = "<main style='padding:24px'>解决方案不存在或加载失败。</main>";
    console.error(error);
  }
}

bootstrap();
