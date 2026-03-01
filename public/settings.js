async function loadSettingsContent() {
  const sources = ["./settings-content.json", "/api/settings-content"];
  for (const url of sources) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch (error) {
      // try next source
    }
  }
  throw new Error("系统设置内容加载失败");
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

function renderRows(targetId, rows) {
  const root = document.getElementById(targetId);
  root.innerHTML = "";
  rows.forEach((item) => {
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML = `
      <span class="item-name">${item.name}</span>
      <span class="item-value">${item.value}</span>
      <span class="item-desc">${item.desc}</span>
      <span class="item-op">配置</span>
    `;
    root.appendChild(row);
  });
}

function renderTemplates(modules) {
  const root = document.getElementById("template-modules");
  root.innerHTML = "";
  modules.forEach((module) => {
    const block = document.createElement("section");
    block.className = "tpl-block";
    block.innerHTML = `
      <h4 class="tpl-title">${module.title}</h4>
      <p class="tpl-desc">${module.desc}</p>
      <div class="field-tags">${module.fields.map((field) => `<span class="field-tag">${field}</span>`).join("")}</div>
      <div class="card-actions">
        <button class="ghost-btn" type="button">编辑</button>
        <button class="ghost-btn" type="button">预览</button>
        <button class="ghost-btn" type="button">重置</button>
      </div>
    `;
    root.appendChild(block);
  });
}

function renderTabs(data) {
  const root = document.getElementById("tabs");
  root.innerHTML = "";
  const sectionIdMap = {
    系统参数: "section-system-params",
    模板管理: "section-template-management",
    安全设置: "section-security-settings",
    通知设置: "section-notify-settings"
  };

  function setActiveTab(activeName) {
    root.querySelectorAll(".tab-btn").forEach((button) => {
      button.classList.toggle("active", button.dataset.tabName === activeName);
    });
  }

  data.tabs.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = `tab-btn${tab === data.activeTab ? " active" : ""}`;
    btn.dataset.tabName = tab;
    btn.textContent = tab;
    btn.addEventListener("click", () => {
      setActiveTab(tab);
      const targetId = sectionIdMap[tab];
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    root.appendChild(btn);
  });

  const sections = Object.entries(sectionIdMap)
    .map(([tabName, id]) => ({ tabName, element: document.getElementById(id) }))
    .filter((item) => item.element);

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      let activeName = data.activeTab;
      const currentTop = window.scrollY + 110;
      sections.forEach((section) => {
        if (section.element.offsetTop <= currentTop) {
          activeName = section.tabName;
        }
      });
      setActiveTab(activeName);
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function renderMeta(data) {
  document.getElementById("sidebar-title").textContent = data.sidebar.title;
  document.getElementById("sidebar-user-name").textContent = data.sidebar.user.name;
  document.getElementById("sidebar-user-role").textContent = data.sidebar.user.role;
  document.getElementById("breadcrumb").textContent = data.topbar.breadcrumb.join(" > ");
  document.getElementById("top-search").placeholder = data.topbar.searchPlaceholder;
  document.getElementById("page-title").textContent = data.page.title;
  document.getElementById("page-subtitle").textContent = data.page.subtitle;
}

async function bootstrap() {
  try {
    const data = await loadSettingsContent();
    renderNav("main-nav", data.sidebar.mainNav);
    renderNav("manage-nav", data.sidebar.manageNav);
    renderNav("system-nav", data.sidebar.systemNav);
    renderMeta(data);
    renderTabs(data);
    renderRows("system-params", data.systemParams);
    renderTemplates(data.templateModules);
    renderRows("security-settings", data.securitySettings);
    renderRows("notify-settings", data.notifySettings);
    renderRows("upload-settings", data.uploadSettings);
  } catch (error) {
    document.body.innerHTML = "<main style='padding:24px'>系统设置页加载失败。</main>";
    console.error(error);
  }
}

bootstrap();
