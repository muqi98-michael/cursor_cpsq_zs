async function loadUsersContent() {
  const sources = ["./users-content.json", "/api/users-content"];
  for (const url of sources) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch (error) {
      // try next source
    }
  }
  throw new Error("用户管理内容加载失败");
}

let appData = null;

function getNavIconSvg(label) {
  return window.AppRoutes?.getNavIconSvg(label) || "•";
}

function renderNav(containerId, items) {
  const root = document.getElementById(containerId);
  root.innerHTML = "";
  items.forEach((item) => {
    const button = document.createElement("button");
    button.className = `nav-item${item.active ? " active" : ""}`;
    const label = item.label || item;
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
  document.getElementById("top-search").placeholder = data.topbar.searchPlaceholder;
  document.getElementById("page-title").textContent = data.page.title;
  document.getElementById("page-subtitle").textContent = data.page.subtitle;
  document.getElementById("create-btn").textContent = data.page.createButton;
}

function renderFilters() {
  const root = document.getElementById("filters");
  root.innerHTML = `
    <div class="filter-item">
      <label>关键词</label>
      <div class="fake-select">搜索用户名、姓名或邮箱...</div>
    </div>
    <div class="filter-item">
      <label>部门</label>
      <div class="fake-select">全部部门</div>
    </div>
    <div class="filter-item">
      <label>权限</label>
      <div class="fake-select">全部权限</div>
    </div>
  `;
}

function renderTable(data) {
  const head = document.getElementById("table-head-row");
  const body = document.getElementById("table-body");
  head.innerHTML = "";
  body.innerHTML = "";
  data.tableColumns.forEach((col) => {
    const th = document.createElement("th");
    th.textContent = col;
    head.appendChild(th);
  });
  data.rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.username}</td>
      <td>${row.name}</td>
      <td class="cell-ellipsis col-email">${row.email}</td>
      <td>${row.department}</td>
      <td>${row.permission}</td>
      <td class="row-actions">
        <button class="action-link" type="button" title="编辑">编辑</button>
      </td>
    `;
    body.appendChild(tr);
  });
  document.getElementById("page-info").textContent = "显示 1 到 5 条，共 23 条记录";
  document.getElementById("page-buttons").innerHTML = `
    <button class="page-btn active">1</button>
    <button class="page-btn">2</button>
    <button class="page-btn">3</button>
  `;
}

async function bootstrap() {
  try {
    appData = await loadUsersContent();
    renderNav("main-nav", appData.sidebar.mainNav);
    renderNav("manage-nav", appData.sidebar.manageNav);
    renderNav("system-nav", appData.sidebar.systemNav);
    renderMeta(appData);
    renderFilters();
    renderTable(appData);
  } catch (error) {
    document.body.innerHTML = "<main style='padding:24px'>用户管理页加载失败。</main>";
    console.error(error);
  }
}

bootstrap();
