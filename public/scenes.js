async function loadScenesContent() {
  const response = await fetch("/api/scenes-content");
  if (!response.ok) throw new Error("列表页内容加载失败");
  return response.json();
}

const PAGE_SIZE = 5;
let appData = null;
let draftFilters = null;
let appliedFilters = null;
let currentPage = 1;
let defaultFilters = null;

function getNavIconSvg(label) {
  const icons = {
    首页: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3 3 10v11h6v-7h6v7h6V10l-9-7Zm0 2.5L19 11v8h-2v-7H7v7H5v-8l7-5.5Z"/></svg>',
    产品场景库:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5a2 2 0 0 1 2-2h6v6H4V5Zm0 8h8v8H6a2 2 0 0 1-2-2v-6Zm10 8v-8h8v6a2 2 0 0 1-2 2h-6Zm8-18v8h-8V3h6a2 2 0 0 1 2 2Z"/></svg>',
    产品解决方案:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 1 4.9 12l-1.2 1.2a2 2 0 0 0-.6 1.4V18h-6v-1.4a2 2 0 0 0-.6-1.4L7.3 14A7 7 0 0 1 12 2Zm-2 18h4a2 2 0 0 1-4 0Z"/></svg>',
    客户案例:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 20h16v2H4v-2Zm2-2V8h12v10H6Zm2-8v6h2v-6H8Zm4 2v4h2v-4h-2Zm4-5h2v9h-2V7ZM6 4h10v2H6V4Z"/></svg>',
    概览: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h7v7H4V4Zm9 0h7v5h-7V4ZM4 13h7v7H4v-7Zm9-2h7v9h-7v-9Z"/></svg>',
    基础数据管理:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 7a8 3 0 1 0 16 0 8 3 0 0 0-16 0Zm0 5a8 3 0 1 0 16 0v5a8 3 0 1 1-16 0v-5Z"/></svg>',
    用户管理:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"/></svg>',
    权限管理:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2 4 6v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V6l-8-4Zm0 2.2L18 7v5c0 3.8-2.4 7.9-6 9.2C8.4 19.9 6 15.8 6 12V7l6-2.8Z"/></svg>',
    开放管理:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14V3ZM5 5h7v2H7v10h10v-5h2v7H5V5Z"/></svg>',
    操作日志:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13 3a9 9 0 1 0 8.9 10h-2A7 7 0 1 1 13 5V3Zm-1 4h2v6h-5v-2h3V7Zm5-4v2h3.6L16 9.6l1.4 1.4L22 6.4V10h2V3h-7Z"/></svg>',
    系统设置:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.4 13a7.8 7.8 0 0 0 .1-2l2-1.5-2-3.4-2.4 1a8.6 8.6 0 0 0-1.8-1l-.4-2.6h-4l-.4 2.6a8.6 8.6 0 0 0-1.8 1l-2.4-1-2 3.4L4.5 11a7.8 7.8 0 0 0 .1 2l-2 1.5 2 3.4 2.4-1a8.6 8.6 0 0 0 1.8 1l.4 2.6h4l.4-2.6a8.6 8.6 0 0 0 1.8-1l2.4 1 2-3.4-2-1.5ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/></svg>'
  };
  return icons[label] || icons["首页"];
}

function renderNav(containerId, items) {
  const root = document.getElementById(containerId);
  root.innerHTML = "";
  items.forEach((item) => {
    const button = document.createElement("button");
    button.className = `nav-item${item.active ? " active" : ""}`;
    const label = item.label || item;
    button.innerHTML = `
      <span class="nav-icon">${getNavIconSvg(label)}</span>
      <span class="nav-label">${label}</span>
    `;
    const route = window.AppRoutes?.getRouteForLabel(label);
    if (route) {
      button.addEventListener("click", () => {
        window.location.href = route;
      });
    }
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
  const statuses = [...new Set(data.rows.map((row) => row.status))];
  return {
    产品: ["全部产品", "产品场景库"],
    行业: ["全部行业", ...industries],
    状态: ["全部状态", ...statuses],
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
      .map((option) => {
        const selected = draftFilters[item.label] === option ? "selected" : "";
        return `<option value="${option}" ${selected}>${option}</option>`;
      })
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
    tr.dataset.sceneId = row.sceneId;
    tr.innerHTML = `
      <td>${row.sceneId}</td>
      <td>${row.name}</td>
      <td><span class="tag industry">${row.industry}</span></td>
      <td class="pain-point">${row.painPoint}</td>
      <td>
        <span class="tag solution">解决方案(${row.solutionCount})</span>
        <span class="tag case">案例(${row.caseCount})</span>
      </td>
      <td>${row.editor}</td>
      <td>${row.createdAt}</td>
      <td>${row.updatedAt}</td>
      <td><span class="tag status-${row.statusTone}">${row.status}</span></td>
      <td class="row-actions">
        <button class="action-link" data-action="view" data-id="${row.sceneId}" type="button" title="查看">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 5c5.5 0 9.5 4.6 10.8 6.3.3.4.3 1 0 1.4C21.5 14.4 17.5 19 12 19S2.5 14.4 1.2 12.7a1.2 1.2 0 0 1 0-1.4C2.5 9.6 6.5 5 12 5Zm0 2C8.2 7 5.1 10 3.3 12c1.8 2 4.9 5 8.7 5s6.9-3 8.7-5c-1.8-2-4.9-5-8.7-5Zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"/></svg>
        </button>
        <button class="action-link" data-action="edit" data-id="${row.sceneId}" type="button" title="编辑">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m4 16.3 10.9-10.9 3.7 3.7L7.7 20H4v-3.7Zm15.7-8.1-3.7-3.7 1.8-1.8a1.3 1.3 0 0 1 1.9 0l2 2a1.3 1.3 0 0 1 0 1.9l-2 1.8Z"/></svg>
        </button>
        <button class="action-link" data-action="more" data-id="${row.sceneId}" type="button" title="更多">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm6 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm6 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"/></svg>
        </button>
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
    totalCount === 0
      ? "显示 0 条，共 0 条记录"
      : `显示 ${from} 到 ${to} 条，共 ${totalCount} 条记录`;

  const root = document.getElementById("page-buttons");
  root.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.className = "page-btn";
  prevBtn.textContent = "<";
  prevBtn.disabled = page <= 1;
  prevBtn.dataset.page = String(page - 1);
  root.appendChild(prevBtn);

  for (let p = 1; p <= totalPages; p += 1) {
    const btn = document.createElement("button");
    btn.className = `page-btn${p === page ? " active" : ""}`;
    btn.textContent = String(p);
    btn.dataset.page = String(p);
    root.appendChild(btn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.className = "page-btn";
  nextBtn.textContent = ">";
  nextBtn.disabled = page >= totalPages;
  nextBtn.dataset.page = String(page + 1);
  root.appendChild(nextBtn);
}

function toDate(text) {
  return new Date(`${text}T00:00:00`);
}

function filterByTimeRange(rows, timeRange) {
  if (timeRange === "全部时间") return rows;
  const maxTime = rows.reduce((acc, row) => {
    const current = toDate(row.createdAt).getTime();
    return current > acc ? current : acc;
  }, 0);
  const daysMap = {
    近30天: 30,
    近90天: 90,
    近180天: 180
  };
  const dayCount = daysMap[timeRange] || 30;
  const minTime = maxTime - dayCount * 24 * 60 * 60 * 1000;
  return rows.filter((row) => toDate(row.createdAt).getTime() >= minTime);
}

function getFilteredRows() {
  const keyword = appliedFilters.search.trim();
  let rows = [...appData.rows];

  if (appliedFilters.产品 !== "全部产品") {
    rows = rows.filter(() => appliedFilters.产品 === "产品场景库");
  }
  if (appliedFilters.行业 !== "全部行业") {
    rows = rows.filter((row) => row.industry === appliedFilters.行业);
  }
  if (appliedFilters.状态 !== "全部状态") {
    rows = rows.filter((row) => row.status === appliedFilters.状态);
  }
  rows = filterByTimeRange(rows, appliedFilters.创建时间);

  if (keyword) {
    rows = rows.filter(
      (row) =>
        row.sceneId.includes(keyword) ||
        row.name.includes(keyword) ||
        row.painPoint.includes(keyword) ||
        row.editor.includes(keyword) ||
        row.industry.includes(keyword)
    );
  }

  return rows;
}

function renderInteractiveTable() {
  const filteredRows = getFilteredRows();
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filteredRows.slice(start, start + PAGE_SIZE);
  renderTable(appData.tableColumns, pageRows);
  renderPagination(filteredRows.length, currentPage);
}

function bindEvents(filterOptions) {
  document.getElementById("query-btn").addEventListener("click", () => {
    draftFilters.search = document.getElementById("top-search").value;
    appliedFilters = { ...draftFilters };
    currentPage = 1;
    renderInteractiveTable();
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    draftFilters = { ...defaultFilters };
    appliedFilters = { ...draftFilters };
    currentPage = 1;
    document.getElementById("top-search").value = "";
    appData.filters = appData.filters.map((item) => ({
      ...item,
      value: draftFilters[item.label]
    }));
    renderFilters(appData.filters, filterOptions);
    bindFilterSelectEvents();
    renderInteractiveTable();
  });

  document.getElementById("top-search").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      document.getElementById("query-btn").click();
    }
  });

  document.getElementById("page-buttons").addEventListener("click", (event) => {
    const target = event.target.closest(".page-btn");
    if (!target || target.disabled) return;
    const nextPage = Number(target.dataset.page);
    if (!Number.isNaN(nextPage) && nextPage > 0) {
      currentPage = nextPage;
      renderInteractiveTable();
    }
  });

  document.getElementById("table-body").addEventListener("click", (event) => {
    const target = event.target.closest(".action-link");
    if (target) {
      const action = target.dataset.action;
      const sceneId = target.dataset.id;
      if (action === "view") {
        window.location.href = `/scenes/${sceneId}`;
        return;
      }
      if (action === "edit") {
        window.location.href = `/scenes/${sceneId}/edit`;
        return;
      }
      window.location.href = `/scenes/${sceneId}?tab=more`;
      return;
    }

    const row = event.target.closest("tr.scene-row");
    if (row && row.dataset.sceneId) {
      window.location.href = `/scenes/${row.dataset.sceneId}`;
    }
  });
}

function bindFilterSelectEvents() {
  ["产品", "行业", "状态", "创建时间"].forEach((label) => {
    const select = document.getElementById(`filter-${label}`);
    if (!select) return;
    select.addEventListener("change", () => {
      draftFilters[label] = select.value;
    });
  });
}

async function bootstrap() {
  try {
    appData = await loadScenesContent();
    const filterOptions = buildFilterOptions(appData);
    defaultFilters = appData.filters.reduce(
      (acc, item) => ({
        ...acc,
        [item.label]: item.value
      }),
      { search: "" }
    );
    draftFilters = { ...defaultFilters };
    appliedFilters = { ...defaultFilters };

    renderNav("main-nav", appData.sidebar.mainNav);
    renderNav("manage-nav", appData.sidebar.manageNav);
    renderNav("system-nav", appData.sidebar.systemNav);
    renderPageMeta(appData);
    renderFilters(appData.filters, filterOptions);
    bindFilterSelectEvents();
    bindEvents(filterOptions);
    renderInteractiveTable();
  } catch (error) {
    document.body.innerHTML =
      "<main style='padding:24px'>列表页加载失败，请检查服务状态。</main>";
    console.error(error);
  }
}

bootstrap();
