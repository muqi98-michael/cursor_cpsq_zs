async function loadOpenManagementContent() {
  const sources = ["./open-management-content.json", "/api/open-management-content"];
  for (const url of sources) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch (error) {
      // try next source
    }
  }
  throw new Error("开放管理内容加载失败");
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
  document.getElementById("breadcrumb").textContent = data.topbar.breadcrumb.join(" / ");
  document.getElementById("page-title").textContent = data.page.title;
  document.getElementById("page-subtitle").textContent = data.page.subtitle;
}

function renderTopCards(items) {
  const root = document.getElementById("open-top");
  root.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "open-card large";
    card.innerHTML = `
      <span class="open-icon ${item.tone || "blue"}">${item.icon || "卡"}</span>
      <h3 class="open-title">${item.title}</h3>
      <p class="open-desc">${item.desc}</p>
      <button class="open-action" type="button">${item.action || "查看详情"} ›</button>
    `;
    root.appendChild(card);
  });
}

function renderBottomCards(items) {
  const root = document.getElementById("open-bottom");
  root.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = `open-card${item.isAdd ? " open-add" : ""}`;
    if (item.isAdd) {
      card.innerHTML = `
        <div>
          <span class="open-icon gray">${item.icon || "+"}</span>
          <h3 class="open-title">${item.title}</h3>
        </div>
      `;
    } else {
      card.innerHTML = `
        <span class="open-icon ${item.tone || "green"}">${item.icon || "卡"}</span>
        <h3 class="open-title">${item.title}</h3>
        <p class="open-desc">${item.desc}</p>
      `;
    }
    root.appendChild(card);
  });
}

async function bootstrap() {
  try {
    const data = await loadOpenManagementContent();
    renderNav("main-nav", data.sidebar.mainNav);
    renderNav("manage-nav", data.sidebar.manageNav);
    renderNav("system-nav", data.sidebar.systemNav);
    renderMeta(data);
    renderTopCards(data.cardsTop);
    renderBottomCards(data.cardsBottom);
  } catch (error) {
    document.body.innerHTML = "<main style='padding:24px'>开放管理页加载失败。</main>";
    console.error(error);
  }
}

bootstrap();
