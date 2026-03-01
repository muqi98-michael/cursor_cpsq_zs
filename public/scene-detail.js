function getSceneIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[1] || "";
}

async function loadScene(sceneId) {
  const response = await fetch(`/api/scenes/${encodeURIComponent(sceneId)}`);
  if (!response.ok) throw new Error("场景不存在");
  return response.json();
}

function renderComplexList(targetId, list, className) {
  const root = document.getElementById(targetId);
  root.innerHTML = "";
  list.forEach((item) => {
    const div = document.createElement("div");
    div.className = className;
    if (typeof item === "string") {
      const isSolution = targetId === "solutions-list";
      const route = window.AppRoutes?.getRouteForLabel(isSolution ? "解决方案" : "客户案例");
      div.innerHTML = `
        <span class="side-leading-icon ${isSolution ? "solution" : "case"}">${isSolution ? "◉" : "◫"}</span>
        <div class="side-content"><p class="item-title">${item}</p></div>
        <span class="side-trailing">›</span>
      `;
      if (route) {
        div.style.cursor = "pointer";
        div.addEventListener("click", () => {
          window.location.href = route;
        });
      }
    } else if (item.name && item.size) {
      div.className = "attachment-item";
      div.innerHTML = `
        <span class="attachment-icon">📎</span>
        <div class="attachment-content">
          <p class="item-title">${item.name}</p>
          <p class="item-desc">${item.size}</p>
        </div>
        <button class="download-btn" type="button" title="下载">⤓</button>
      `;
    } else {
      div.innerHTML = `<p class="item-title">${item.title || item.name}</p><p class="item-desc">${item.desc || ""}</p>`;
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
  document.getElementById("breadcrumb").textContent = `首页 / 产品场景库 / ${scene.name}`;
  document.getElementById("scene-name").textContent = scene.name;
  document.getElementById("scene-subtitle").textContent = scene.subtitle;
  document.getElementById("scene-description").textContent = scene.description;
  document.getElementById("industry-tag").innerHTML = `<span class="tag">${scene.industry}</span>`;
  document.getElementById("meta-row").innerHTML = `
    <span>编辑者: ${scene.editor}</span>
    <span>更新时间: ${scene.updatedAt} 09:25</span>
    <span class="status-${scene.statusTone}">状态: ${scene.status}</span>
  `;

  renderComplexList("roles-list", scene.roles, "role-item");
  renderComplexList("pains-list", scene.pains, "point-item");
  renderComplexList("goals-list", scene.goals, "point-item");
  renderComplexList("features-list", scene.features, "feature-item");
  renderComplexList("solutions-list", scene.solutions, "side-item");
  renderComplexList("cases-list", scene.cases, "side-item");
  renderComplexList("attachments-list", scene.attachments, "attachment-item");

  document.getElementById("go-edit").addEventListener("click", () => {
    window.location.href = `/scenes/${scene.sceneId}/edit`;
  });
  document.getElementById("go-back").addEventListener("click", () => {
    window.location.href = "/scenes.html";
  });
}

async function bootstrap() {
  try {
    bindSidebarNavigation();
    const sceneId = getSceneIdFromPath();
    const scene = await loadScene(sceneId);
    renderScene(scene);
  } catch (error) {
    document.body.innerHTML = "<main style='padding:24px'>场景不存在或加载失败。</main>";
    console.error(error);
  }
}

bootstrap();
