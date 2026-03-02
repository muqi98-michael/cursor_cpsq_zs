function getSceneIdFromPath() {
  const queryId = new URLSearchParams(window.location.search).get("id");
  if (queryId) return queryId;
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[1] || "";
}

async function loadScene(sceneId) {
  const sources = ["./scenes-details.json", `/api/scenes/${encodeURIComponent(sceneId)}`];
  for (const url of sources) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      if (url.endsWith(".json")) {
        const map = await response.json();
        if (map[sceneId]) return map[sceneId];
        continue;
      }
      return response.json();
    } catch (error) {
      // try next source
    }
  }
  throw new Error("场景不存在");
}

function withBase(path) {
  const listRoute = window.AppRoutes?.getRouteForLabel("产品场景库") || "";
  const base = listRoute.replace(/\/scenes\.html.*$/, "");
  return `${base}${path}`;
}

function renderComplexList(targetId, list, className) {
  const root = document.getElementById(targetId);
  if (!root) return;
  root.innerHTML = "";
  if (!Array.isArray(list)) return;

  const listType = targetId.replace("-list", "");
  list.forEach((item) => {
    const div = document.createElement("div");
    div.className = className;
    if (listType === "roles" && item?.name) {
      div.className = "info-item role-item";
      div.innerHTML = `
        <span class="list-icon role">@</span>
        <div class="item-content">
          <p class="item-title">${item.name}</p>
          <p class="item-desc">${item.desc || ""}</p>
        </div>
      `;
    } else if ((listType === "pains" || listType === "goals") && item?.title) {
      const iconClass = listType === "pains" ? "pain" : "goal";
      const icon = listType === "pains" ? "!" : "v";
      div.className = "info-item point-item";
      div.innerHTML = `
        <span class="list-icon ${iconClass}">${icon}</span>
        <div class="item-content">
          <p class="item-title">${item.title}</p>
          <p class="item-desc">${item.desc || ""}</p>
        </div>
      `;
    } else if (listType === "features" && item?.title) {
      div.className = "feature-item";
      div.innerHTML = `
        <p class="item-title">${item.title}</p>
        <p class="item-desc">${item.desc || ""}</p>
      `;
    } else if (typeof item === "string") {
      const isSolution = targetId === "solutions-list";
      const route = window.AppRoutes?.getRouteForLabel(isSolution ? "解决方案" : "客户案例");
      const activeClass = isSolution && root.childElementCount === 0 ? "active" : "";
      div.innerHTML = `
        <span class="side-leading-icon ${isSolution ? "solution" : "case"}">${isSolution ? "◉" : "◫"}</span>
        <div class="side-content"><p class="item-title">${item}</p></div>
        <span class="side-trailing ${activeClass}">›</span>
      `;
      div.classList.add("side-item");
      if (activeClass) div.classList.add(activeClass);
      if (route) {
        div.style.cursor = "pointer";
        div.addEventListener("click", () => {
          window.location.href = route;
        });
      }
    } else if (item.name && item.size) {
      div.className = "attachment-item";
      div.innerHTML = `
        <span class="attachment-icon">${item.name.endsWith(".pdf") ? "PDF" : "XLS"}</span>
        <div class="attachment-content">
          <p class="item-title">${item.name}</p>
          <p class="item-desc">${item.size}</p>
        </div>
        <button class="download-btn" type="button" title="下载">⤓</button>
      `;
    } else {
      div.innerHTML = `<p class="item-title">${item?.title || item?.name || ""}</p><p class="item-desc">${item?.desc || ""}</p>`;
    }
    root.appendChild(div);
  });
}

function bindSidebarNavigation() {
  const navButtons = document.querySelectorAll(".sidebar .nav-item");
  navButtons.forEach((button) => {
    const label = button.querySelector("span:last-child")?.textContent || button.textContent;
    const route = window.AppRoutes?.getRouteForLabel(label);
    if (!route) return;
    button.addEventListener("click", () => {
      window.location.href = route;
    });
  });
}

function renderScene(scene) {
  document.title = `${scene.name} - 场景详情`;
  const breadcrumb = document.getElementById("breadcrumb");
  const sceneName = document.getElementById("scene-name");
  const sceneSubtitle = document.getElementById("scene-subtitle");
  const sceneDescription = document.getElementById("scene-description");
  const industryTag = document.getElementById("industry-tag");
  const businessDomainTag = document.getElementById("business-domain-tag");
  const metaRow = document.getElementById("meta-row");

  if (breadcrumb) breadcrumb.textContent = `首页 / 产品场景库 / ${scene.name}`;
  if (sceneName) sceneName.textContent = scene.name;
  if (sceneSubtitle) sceneSubtitle.textContent = scene.subtitle;
  if (sceneDescription) sceneDescription.textContent = scene.description;
  if (industryTag) industryTag.innerHTML = `<span class="tag">${scene.industry || "-"}</span>`;
  if (businessDomainTag) businessDomainTag.innerHTML = `<span class="tag">${scene.businessDomain || "-"}</span>`;
  if (metaRow) metaRow.innerHTML = `
    <span>编辑者: ${scene.editor}</span>
    <span>更新时间: ${scene.updatedAt} 09:25</span>
    <span class="status-${scene.statusTone}">状态: ${scene.status}</span>
  `;

  renderComplexList("roles-list", scene.roles, "role-item");
  renderComplexList("pains-list", scene.pains, "point-item");
  renderComplexList("goals-list", scene.goals, "point-item");
  renderComplexList("solutions-list", scene.solutions, "side-item");
  renderComplexList("cases-list", scene.cases, "side-item");
  renderComplexList("attachments-list", scene.attachments, "attachment-item");

  const goEdit = document.getElementById("go-edit");
  const goBack = document.getElementById("go-back");
  if (goEdit) {
    goEdit.addEventListener("click", () => {
      window.location.href = withBase(`/scene-edit.html?id=${encodeURIComponent(scene.sceneId)}`);
    });
  }
  if (goBack) {
    goBack.addEventListener("click", () => {
      window.location.href = withBase("/scenes.html");
    });
  }
}

async function bootstrap() {
  try {
    bindSidebarNavigation();
    const sceneId = getSceneIdFromPath();
    const scene = await loadScene(sceneId);
    renderScene(scene);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    document.body.innerHTML = `
      <main style="padding:24px;font-family:'PingFang SC','Microsoft YaHei',sans-serif">
        <p style="margin:0 0 8px">场景不存在或加载失败。</p>
        <p style="margin:0;color:#64748b;font-size:13px">错误信息：${message}</p>
      </main>
    `;
    console.error(error);
  }
}

bootstrap();
