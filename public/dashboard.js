function createNavItems(rootId, labels, activeLabel) {
  const root = document.getElementById(rootId);
  root.innerHTML = "";

  labels.forEach((label) => {
    const btn = document.createElement("button");
    btn.className = "nav-item";
    const icon = window.AppRoutes?.getNavIconSvg(label) || "•";
    btn.innerHTML = `<span class="nav-icon">${icon}</span><span class="nav-label">${label}</span>`;
    if (label === activeLabel) btn.classList.add("active");
    const route = window.AppRoutes?.getRouteForLabel(label);
    if (route) {
      btn.addEventListener("click", () => {
        window.location.href = route;
      });
    }
    root.appendChild(btn);
  });
}

function renderMetrics(data) {
  const root = document.getElementById("metrics");
  root.innerHTML = "";
  const iconMap = {
    产品场景总数: "◧",
    解决方案总数: "◈",
    客户案例总数: "◎",
    累计访问用户数: "◉"
  };
  data.metrics.forEach((item) => {
    const card = document.createElement("article");
    card.className = "metric-card";
    card.innerHTML = `
      <div class="metric-head">
        <p class="metric-label">${item.label}</p>
        <span class="metric-icon">${iconMap[item.label] || "•"}</span>
      </div>
      <p class="metric-value">${item.value}</p>
      <p class="metric-change">+${item.change}</p>
      <p class="metric-note">${item.note}</p>
    `;
    root.appendChild(card);
  });
}

function renderDistributions(data) {
  const root = document.getElementById("distributions");
  root.innerHTML = "";
  data.distributions.forEach((item) => {
    const parsed = item.legend
      .map((legend) => {
        const match = legend.match(/\((\d+)\)/);
        return {
          label: legend,
          value: match ? Number(match[1]) : 0
        };
      })
      .filter((legend) => legend.value > 0);
    const palette = ["#2563eb", "#60a5fa", "#93c5fd", "#bfdbfe"];
    const total = parsed.reduce((sum, legend) => sum + legend.value, 0);
    let cursor = 0;
    const gradient = parsed
      .map((legend, idx) => {
        const percent = total ? (legend.value / total) * 100 : 0;
        const start = cursor;
        const end = cursor + percent;
        cursor = end;
        return `${palette[idx % palette.length]} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
      })
      .join(", ");

    const card = document.createElement("article");
    card.className = "distribution-card";
    card.innerHTML = `
      <div class="distribution-top">
        <h3 class="distribution-title">${item.title}</h3>
        <button class="distribution-detail" type="button">详情</button>
      </div>
      <div class="distribution-body">
        <div class="donut" style="background: conic-gradient(${gradient || "#dbeafe 0 100%"});"></div>
        <div>
          <p class="distribution-total">${item.total}</p>
          <ul class="legend">
            ${item.legend.map((legend) => `<li>${legend}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;
    root.appendChild(card);
  });
}

function renderTabs(rootId, tabs, active, onClick) {
  const root = document.getElementById(rootId);
  root.innerHTML = "";
  tabs.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = "tab";
    btn.textContent = tab;
    if (tab === active) btn.classList.add("active");
    btn.addEventListener("click", () => onClick(tab));
    root.appendChild(btn);
  });
}

function renderTrend(data, activeTab) {
  const trend = data.trend;
  const values = trend.series[activeTab];
  const max = 20;
  const min = 0;
  const svg = document.getElementById("trend-svg");
  const width = 780;
  const height = 260;
  const padX = 36;
  const padY = 24;
  const chartBottom = height - padY;
  const chartTop = padY;
  const unitX = (width - padX * 2) / (values.length - 1);

  // 画折线时做简单归一化，保证在固定区域内渲染。
  const points = values.map((v, i) => {
    const ratio = (v - min) / (max - min);
    const x = padX + unitX * i;
    const y = chartBottom - ratio * (chartBottom - chartTop);
    return [x, y];
  });

  const polyline = points.map((point) => point.join(",")).join(" ");
  const yTicks = [0, 5, 10, 15, 20];
  const yLines = yTicks
    .map((tick) => {
      const ratio = (tick - min) / (max - min);
      const y = chartBottom - ratio * (chartBottom - chartTop);
      return `<line x1="${padX}" y1="${y}" x2="${width - padX}" y2="${y}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="3 3"></line>
      <text x="${padX - 6}" y="${y + 4}" text-anchor="end" font-size="11" fill="#9ca3af">${tick}</text>`;
    })
    .join("");

  const areaPoints = `${padX},${chartBottom} ${polyline} ${width - padX},${chartBottom}`;

  svg.innerHTML = `
    <defs>
      <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#3b82f6"/>
        <stop offset="100%" stop-color="#0ea5e9"/>
      </linearGradient>
      <linearGradient id="lineAreaColor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.24"/>
        <stop offset="100%" stop-color="#60a5fa" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    ${yLines}
    <line x1="${padX}" y1="${chartBottom}" x2="${width - padX}" y2="${chartBottom}" stroke="#dbe2ea" stroke-width="1"></line>
    <polygon points="${areaPoints}" fill="url(#lineAreaColor)"></polygon>
    <polyline points="${polyline}" fill="none" stroke="url(#lineColor)" stroke-width="3"/>
    ${points
      .map(
        ([x, y], idx) =>
          `<circle cx="${x}" cy="${y}" r="3.5" fill="#fff" stroke="#2563eb" stroke-width="2"></circle><text x="${x}" y="${
            y - 12
          }" text-anchor="middle" font-size="11" fill="#4b5563">${values[idx]}</text>`
      )
      .join("")}
  `;

  const months = document.getElementById("trend-months");
  months.innerHTML = trend.months.map((month) => `<span>${month}</span>`).join("");
}

function renderUpdates(data) {
  const root = document.getElementById("updates-list");
  root.innerHTML = "";
  data.updates.items.forEach((item) => {
    const row = document.createElement("article");
    row.className = "update-item";
    row.innerHTML = `
      <span class="update-avatar">${item.initials}</span>
      <p class="update-text"><strong>${item.user}</strong>${item.action}<br />${item.target}</p>
      <span class="update-time">${item.time}</span>
    `;
    root.appendChild(row);
  });
}

function renderRanking(data, activeTab) {
  const root = document.getElementById("ranking-list");
  root.innerHTML = "";
  const currentItems = data.ranking.items;
  currentItems.forEach((item, index) => {
    const row = document.createElement("article");
    row.className = "rank-item";
    const noClass = index < 3 ? "rank-no top" : "rank-no";
    row.innerHTML = `
      <span class="${noClass}">${item.rank}</span>
      <div>
        <p class="rank-name">${item.name}</p>
        <p class="rank-desc">${item.desc}</p>
      </div>
      <span class="rank-trend">${item.trend}</span>
    `;
    root.appendChild(row);
  });

  renderTabs("ranking-tabs", data.ranking.tabs, activeTab, (tab) => {
    renderRanking(data, tab);
  });
}

async function loadDashboard() {
  const response = await fetch("/api/dashboard-content");
  if (!response.ok) throw new Error("无法加载仪表盘数据");
  return response.json();
}

async function bootstrap() {
  try {
    const data = await loadDashboard();

    document.getElementById("sidebar-title").textContent = data.sidebar.title;
    document.getElementById("user-name").textContent = data.sidebar.user.name;
    document.getElementById("user-role").textContent = data.sidebar.user.role;
    document.getElementById("user-initials").textContent = data.sidebar.user.initials;

    createNavItems("main-nav", data.sidebar.mainNav, "首页");
    createNavItems("manage-nav", data.sidebar.manageNav, "概览");
    createNavItems("system-nav", data.sidebar.systemNav, "");

    document.getElementById("breadcrumb").textContent = data.topbar.breadcrumb.join(" / ");
    document.getElementById("date-range").textContent = data.topbar.dateRange;
    document.getElementById("search-input").placeholder = data.topbar.searchPlaceholder;
    document.getElementById("page-title").textContent = data.header.title;
    document.getElementById("page-subtitle").textContent = data.header.subtitle;

    renderMetrics(data);
    renderDistributions(data);

    document.getElementById("trend-title").textContent = data.trend.title;
    let activeTrendTab = data.trend.tabs[0];
    const onTrendTabClick = (tab) => {
      activeTrendTab = tab;
      renderTabs("trend-tabs", data.trend.tabs, activeTrendTab, onTrendTabClick);
      renderTrend(data, activeTrendTab);
    };
    renderTabs("trend-tabs", data.trend.tabs, activeTrendTab, onTrendTabClick);
    renderTrend(data, activeTrendTab);

    document.getElementById("updates-title").textContent = data.updates.title;
    document.getElementById("updates-view-all").textContent = data.updates.viewAll;
    renderUpdates(data);

    document.getElementById("ranking-title").textContent = data.ranking.title;
    renderRanking(data, data.ranking.tabs[0]);
  } catch (error) {
    document.body.innerHTML =
      "<main style='padding:24px;font-family:sans-serif'>仪表盘加载失败，请检查服务是否正常启动。</main>";
    console.error(error);
  }
}

bootstrap();
