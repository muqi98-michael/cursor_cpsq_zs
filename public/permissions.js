async function loadPermissionsContent() {
  const response = await fetch("/api/permissions-content");
  if (!response.ok) throw new Error("权限配置内容加载失败");
  return response.json();
}

function getNavIconSvg(label) {
  return window.AppRoutes?.getNavIconSvg(label) || "•";
}

function renderNav(containerId, items) {
  const root = document.getElementById(containerId);
  root.innerHTML = "";
  items.forEach((item) => {
    const label = item.label || item;
    const button = document.createElement("button");
    button.className = `nav-item${item.active ? " active" : ""}`;
    button.innerHTML = `<span class="nav-icon">${getNavIconSvg(label)}</span><span class="nav-label">${label}</span>`;
    window.AppRoutes?.bindByLabel(button, label);
    root.appendChild(button);
  });
}

function renderMeta(data) {
  document.getElementById("sidebar-title").textContent = data.sidebar.title;
  document.getElementById("sidebar-user-name").textContent = data.sidebar.user.name;
  document.getElementById("sidebar-user-role").textContent = data.sidebar.user.role;
  document.getElementById("breadcrumb").textContent = data.topbar.breadcrumb.join(" > ");
  document.getElementById("page-title").textContent = data.page.title;
  document.getElementById("page-subtitle").textContent = data.page.subtitle;
  document.getElementById("save-btn").textContent = data.page.saveButton;
  document.getElementById("perm-search").placeholder = data.topbar.searchPlaceholder || "搜索权限...";
}

function renderTemplates(data) {
  const root = document.getElementById("template-row");
  root.innerHTML = "";
  data.templates.forEach((name) => {
    const btn = document.createElement("button");
    btn.className = `template-btn${name === data.activeTemplate ? " active" : ""}`;
    btn.textContent = name;
    root.appendChild(btn);
  });
}

function renderPermissionTree(data) {
  const root = document.getElementById("tree-root");
  root.innerHTML = "";
  const actionOrder = data.actionOrder || ["查看", "新增", "编辑", "删除", "下载"];
  const iconByModule = {
    产品场景库: "▦",
    产品解决方案: "◉",
    客户案例: "◫"
  };
  data.permissionTree.forEach((module) => {
    const section = document.createElement("section");
    section.className = "tree-module";
    section.innerHTML = `<h4 class="module-name"><span class="module-icon">${iconByModule[module.module] || "◌"}</span>${module.module}</h4>`;
    module.items.forEach((item) => {
      const actionStates = item.actionStates || {};
      const block = document.createElement("article");
      block.className = "perm-item";
      block.innerHTML = `
        <h4>${item.name}</h4>
        <div class="actions">
          ${actionOrder
            .map((action) => {
              const checked = Boolean(actionStates[action]);
              return `
                <div class="action-cell">
                  <span class="action-check${checked ? " checked" : ""}">${checked ? "✓" : ""}</span>
                  <span>${action}</span>
                </div>
              `;
            })
            .join("")}
        </div>
      `;
      section.appendChild(block);
    });
    root.appendChild(section);
  });
}

async function bootstrap() {
  try {
    const data = await loadPermissionsContent();
    renderNav("main-nav", data.sidebar.mainNav);
    renderNav("manage-nav", data.sidebar.manageNav);
    renderNav("system-nav", data.sidebar.systemNav);
    renderMeta(data);
    renderTemplates(data);
    renderPermissionTree(data);
  } catch (error) {
    document.body.innerHTML = "<main style='padding:24px'>权限配置页加载失败。</main>";
    console.error(error);
  }
}

bootstrap();
