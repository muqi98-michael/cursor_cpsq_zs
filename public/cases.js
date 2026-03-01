async function loadCasesContent() {
  const sources = ["./cases-content.json", "/api/cases-content"];
  for (const url of sources) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch (error) {
      // try next source
    }
  }
  throw new Error("客户案例列表加载失败");
}

function withBase(path) {
  const listRoute = window.AppRoutes?.getRouteForLabel("客户案例") || "";
  const base = listRoute.replace(/\/cases\.html.*$/, "");
  return `${base}${path}`;
}

function toCaseDetailUrl(caseId) {
  return withBase(`/case-detail.html?id=${encodeURIComponent(caseId)}`);
}

function renderNav(containerId, items) {
  const root = document.getElementById(containerId);
  root.innerHTML = "";
  items.forEach((item) => {
    const label = item.label || item;
    const button = document.createElement("button");
    button.className = `nav-item${item.active ? " active" : ""}`;
    const icon = window.AppRoutes?.getNavIconSvg(label) || "•";
    button.innerHTML = `<span class="nav-icon">${icon}</span><span class="nav-label">${label}</span>`;
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

function renderFilters(data) {
  const root = document.getElementById("filters");
  root.innerHTML = data.filters
    .map((item) => `<div class="filter-item"><label>${item.label}</label><div class="fake-select">${item.value}</div></div>`)
    .join("");
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
    tr.className = "scene-row";
    tr.dataset.caseId = row.caseId;
    tr.innerHTML = `
      <td class="cell-ellipsis col-name">${row.name}</td>
      <td><span class="tag industry">${row.industry}</span></td>
      <td class="cell-ellipsis col-solution">${row.solution}</td>
      <td class="cell-ellipsis col-scene">${row.scene}</td>
      <td>${row.updatedAt}</td>
      <td class="summary-clamp">${row.summary}</td>
      <td class="row-actions"><button class="action-link" data-id="${row.caseId}" type="button">查看详情</button></td>
    `;
    body.appendChild(tr);
  });
  document.getElementById("page-info").textContent = "显示 1 到 6 条，共 24 条记录";
  document.getElementById("page-buttons").innerHTML = `
    <button class="page-btn active">1</button>
    <button class="page-btn">2</button>
    <button class="page-btn">3</button>
    <button class="page-btn">4</button>
  `;
}

function bindRowEvents() {
  document.getElementById("table-body").addEventListener("click", (event) => {
    const action = event.target.closest(".action-link");
    if (action) {
      window.location.href = toCaseDetailUrl(action.dataset.id);
      return;
    }
    const row = event.target.closest("tr.scene-row");
    if (row && row.dataset.caseId) {
      window.location.href = toCaseDetailUrl(row.dataset.caseId);
    }
  });
}

async function bootstrap() {
  try {
    const data = await loadCasesContent();
    renderNav("main-nav", data.sidebar.mainNav);
    renderNav("manage-nav", data.sidebar.manageNav);
    renderNav("system-nav", data.sidebar.systemNav);
    renderMeta(data);
    renderFilters(data);
    renderTable(data);
    bindRowEvents();
  } catch (error) {
    document.body.innerHTML = "<main style='padding:24px'>客户案例页加载失败。</main>";
    console.error(error);
  }
}

bootstrap();
