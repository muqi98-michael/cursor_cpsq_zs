async function loadSolutionsContent() {
  const response = await fetch("/api/solutions-content");
  if (!response.ok) throw new Error("解决方案页内容加载失败");
  return response.json();
}

const PAGE_SIZE = 5;
let appData = null;
let draftFilters = null;
let appliedFilters = null;
let currentPage = 1;

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

function renderPageMeta(data) {
  document.getElementById("sidebar-title").textContent = data.sidebar.title;
  document.getElementById("sidebar-user-name").textContent = data.sidebar.user.name;
  document.getElementById("sidebar-user-role").textContent = data.sidebar.user.role;
  document.getElementById("breadcrumb").textContent = data.topbar.breadcrumb.join(" / ");
  document.getElementById("top-search").placeholder = data.topbar.searchPlaceholder;
  document.getElementById("page-title").textContent = data.page.title;
  document.getElementById("page-subtitle").textContent = data.page.subtitle;
  document.getElementById("create-btn").textContent = data.page.createButton;
}

function buildFilterOptions(data) {
  const industries = [...new Set(data.rows.map((row) => row.industry))];
  return {
    产品: ["全部产品", "产品场景库"],
    行业: ["全部行业", ...industries],
    创建时间: ["近30天", "近90天", "近180天", "全部时间"]
  };
}

function renderFilters(filters, optionsMap) {
  const root = document.getElementById("filters");
  root.innerHTML = "";
  filters.forEach((item) => {
    const block = document.createElement("div");
    block.className = "filter-item";
    const selectId = `filter-${item.label}`;
    const optionHtml = optionsMap[item.label]
      .map((option) => `<option value="${option}" ${draftFilters[item.label] === option ? "selected" : ""}>${option}</option>`)
      .join("");
    block.innerHTML = `<label>${item.label}</label><select id="${selectId}" class="filter-select">${optionHtml}</select>`;
    root.appendChild(block);
  });
}

function renderTable(columns, rows) {
  const headRow = document.getElementById("table-head-row");
  const body = document.getElementById("table-body");
  headRow.innerHTML = "";
  body.innerHTML = "";
  columns.forEach((col) => {
    const th = document.createElement("th");
    th.textContent = col;
    headRow.appendChild(th);
  });

  if (!rows.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="table-empty" colspan="${columns.length}">暂无符合条件的数据</td>`;
    body.appendChild(tr);
    return;
  }

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.className = "scene-row";
    tr.dataset.solutionId = row.solutionId;
    tr.innerHTML = `
      <td class="cell-ellipsis col-name">${row.name}</td>
      <td><span class="tag industry">${row.industry}</span></td>
      <td class="col-resource"><span class="tag solution">场景(${row.sceneCount})</span><span class="tag case">案例(${row.caseCount})</span></td>
      <td>${row.editor}</td>
      <td>${row.createdAt}</td>
      <td>${row.updatedAt}</td>
      <td><span class="tag status-${row.statusTone}">${row.status}</span></td>
      <td class="row-actions">
        <button class="action-link" data-action="view" data-id="${row.solutionId}" type="button" title="查看">查看</button>
        <button class="action-link" data-action="edit" data-id="${row.solutionId}" type="button" title="编辑">编辑</button>
        <button class="action-link" data-action="more" data-id="${row.solutionId}" type="button" title="更多">更多</button>
      </td>
    `;
    body.appendChild(tr);
  });
}

function renderPagination(totalCount, page) {
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const from = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, totalCount);
  document.getElementById("page-info").textContent =
    totalCount === 0 ? "显示 0 条，共 0 条记录" : `显示 ${from} 到 ${to} 条，共 ${totalCount} 条记录`;
  const root = document.getElementById("page-buttons");
  root.innerHTML = "";
  for (let p = 1; p <= totalPages; p += 1) {
    const btn = document.createElement("button");
    btn.className = `page-btn${p === page ? " active" : ""}`;
    btn.textContent = String(p);
    btn.dataset.page = String(p);
    root.appendChild(btn);
  }
}

function toDate(text) {
  return new Date(`${text}T00:00:00`);
}

function filterByTimeRange(rows, timeRange) {
  if (timeRange === "全部时间") return rows;
  const maxTime = rows.reduce((acc, row) => Math.max(acc, toDate(row.createdAt).getTime()), 0);
  const daysMap = { 近30天: 30, 近90天: 90, 近180天: 180 };
  const dayCount = daysMap[timeRange] || 30;
  const minTime = maxTime - dayCount * 24 * 60 * 60 * 1000;
  return rows.filter((row) => toDate(row.createdAt).getTime() >= minTime);
}

function getFilteredRows() {
  const keyword = appliedFilters.search.trim();
  let rows = [...appData.rows];
  if (appliedFilters.行业 !== "全部行业") rows = rows.filter((row) => row.industry === appliedFilters.行业);
  rows = filterByTimeRange(rows, appliedFilters.创建时间);
  if (keyword) {
    rows = rows.filter((row) => row.name.includes(keyword) || row.editor.includes(keyword) || row.industry.includes(keyword));
  }
  return rows;
}

function renderInteractiveTable() {
  const filteredRows = getFilteredRows();
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * PAGE_SIZE;
  renderTable(appData.tableColumns, filteredRows.slice(start, start + PAGE_SIZE));
  renderPagination(filteredRows.length, currentPage);
}

function bindFilterSelectEvents() {
  ["产品", "行业", "创建时间"].forEach((label) => {
    const select = document.getElementById(`filter-${label}`);
    if (!select) return;
    select.addEventListener("change", () => {
      draftFilters[label] = select.value;
    });
  });
}

function bindEvents(filterOptions) {
  document.getElementById("query-btn").addEventListener("click", () => {
    draftFilters.search = document.getElementById("top-search").value;
    appliedFilters = { ...draftFilters };
    currentPage = 1;
    renderInteractiveTable();
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    draftFilters = { 产品: "全部产品", 行业: "全部行业", 创建时间: "近30天", search: "" };
    appliedFilters = { ...draftFilters };
    currentPage = 1;
    document.getElementById("top-search").value = "";
    appData.filters = appData.filters.map((item) => ({ ...item, value: draftFilters[item.label] }));
    renderFilters(appData.filters, filterOptions);
    bindFilterSelectEvents();
    renderInteractiveTable();
  });

  document.getElementById("page-buttons").addEventListener("click", (event) => {
    const target = event.target.closest(".page-btn");
    if (!target) return;
    const nextPage = Number(target.dataset.page);
    if (!Number.isNaN(nextPage) && nextPage > 0) {
      currentPage = nextPage;
      renderInteractiveTable();
    }
  });

  document.getElementById("table-body").addEventListener("click", (event) => {
    const action = event.target.closest(".action-link");
    if (action) {
      const solutionId = action.dataset.id;
      if (!solutionId) return;
      window.location.href = `/solutions/${solutionId}`;
      return;
    }
    const row = event.target.closest("tr.scene-row");
    if (row && row.dataset.solutionId) {
      window.location.href = `/solutions/${row.dataset.solutionId}`;
    }
  });
}

async function bootstrap() {
  try {
    appData = await loadSolutionsContent();
    const filterOptions = buildFilterOptions(appData);
    draftFilters = { 产品: "全部产品", 行业: "全部行业", 创建时间: "近30天", search: "" };
    appliedFilters = { ...draftFilters };
    renderNav("main-nav", appData.sidebar.mainNav);
    renderNav("manage-nav", appData.sidebar.manageNav);
    renderNav("system-nav", appData.sidebar.systemNav);
    renderPageMeta(appData);
    renderFilters(appData.filters, filterOptions);
    bindFilterSelectEvents();
    bindEvents(filterOptions);
    renderInteractiveTable();
    window.AppRoutes?.bindByLabel(document.getElementById("create-btn"), "新增解决方案");
  } catch (error) {
    document.body.innerHTML = "<main style='padding:24px'>解决方案页加载失败，请检查服务状态。</main>";
    console.error(error);
  }
}

bootstrap();
