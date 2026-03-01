async function loadHomepage() {
  const response = await fetch("/api/homepage-content");
  if (!response.ok) {
    throw new Error("无法加载首页内容");
  }
  return response.json();
}

function renderNavigation(data) {
  document.getElementById("brand-text").textContent = data.navigation.brand;
  document.getElementById("user-name").textContent = data.navigation.user.name;
  document.getElementById("user-initials").textContent =
    data.navigation.user.initials;
}

function renderHero(data) {
  document.getElementById("hero-title").textContent = data.hero.title;
  document.getElementById("hero-subtitle").textContent = data.hero.subtitle;
  document.getElementById("search-input").placeholder = data.hero.search.placeholder;
  document.getElementById("search-btn").textContent = data.hero.search.buttonText;
}

function renderQuickEntries(data) {
  const container = document.getElementById("quick-entry-grid");
  container.innerHTML = "";

  data.quickEntries.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "quick-card";
    const route = window.AppRoutes?.getRouteForLabel(entry.title);
    if (route) {
      card.classList.add("clickable");
      card.addEventListener("click", () => {
        window.location.href = route;
      });
    }
    card.innerHTML = `
      <div class="quick-icon" style="background:${entry.iconBg}; color:${entry.iconColor};">
        ${getQuickEntryIconSvg(entry.title)}
      </div>
      <h3>${entry.title}</h3>
    `;
    container.appendChild(card);
  });
}

function renderRecentUpdates(data) {
  const list = document.getElementById("updates-list");
  list.innerHTML = "";

  data.recentUpdates.forEach((item) => {
    const row = document.createElement("article");
    row.className = "update-item";
    row.innerHTML = `
      <div class="update-main">
        <div class="update-leading-icon">${getUpdateIconSvg()}</div>
        <div>
        <p class="update-title">${item.title}</p>
        <p class="update-summary">${item.summary}</p>
        </div>
      </div>
      <button class="update-action" type="button">${item.actionText}</button>
    `;
    list.appendChild(row);
  });
}

function getQuickEntryIconSvg(title) {
  if (title.includes("解决方案")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 2a7 7 0 0 1 4.9 12l-1.2 1.2a2 2 0 0 0-.6 1.4V18h-6v-1.4a2 2 0 0 0-.6-1.4L7.3 14A7 7 0 0 1 12 2Zm-2 18h4a2 2 0 0 1-4 0Z"/>
      </svg>
    `;
  }

  if (title.includes("客户案例")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M4 20h16v2H4v-2Zm2-2V8h12v10H6Zm2-8v6h2v-6H8Zm4 2v4h2v-4h-2Zm4-5h2v9h-2V7ZM6 4h10v2H6V4Z"/>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M4 5a2 2 0 0 1 2-2h6v6H4V5Zm0 8h8v8H6a2 2 0 0 1-2-2v-6Zm10 8v-8h8v6a2 2 0 0 1-2 2h-6Zm8-18v8h-8V3h6a2 2 0 0 1 2 2Z"/>
    </svg>
  `;
}

function getUpdateIconSvg() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M6 3h9l3 3v15H6V3Zm8 1.5V7h2.5L14 4.5ZM8 10h8v1.5H8V10Zm0 3h8v1.5H8V13Zm0 3h5v1.5H8V16Z"/>
    </svg>
  `;
}

async function bootstrap() {
  try {
    const data = await loadHomepage();
    renderNavigation(data);
    renderHero(data);
    renderQuickEntries(data);
    renderRecentUpdates(data);
  } catch (error) {
    document.body.innerHTML =
      "<main style='padding:24px;font-family:sans-serif'>首页加载失败，请检查服务是否正常启动。</main>";
    console.error(error);
  }
}

bootstrap();
