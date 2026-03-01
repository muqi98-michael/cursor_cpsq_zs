function getCaseIdFromPath() {
  const queryId = new URLSearchParams(window.location.search).get("id");
  if (queryId) return queryId;
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[1] || "";
}

async function loadCase(caseId) {
  const sources = ["./cases-details.json", `/api/cases/${encodeURIComponent(caseId)}`];
  for (const url of sources) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      if (url.endsWith(".json")) {
        const map = await response.json();
        if (map[caseId]) return map[caseId];
        continue;
      }
      return response.json();
    } catch (error) {
      // try next source
    }
  }
  throw new Error("案例不存在");
}

function withBase(path) {
  const listRoute = window.AppRoutes?.getRouteForLabel("客户案例") || "";
  const base = listRoute.replace(/\/cases\.html.*$/, "");
  return `${base}${path}`;
}

async function bootstrap() {
  try {
    const navButtons = document.querySelectorAll(".sidebar .nav-item");
    navButtons.forEach((button) => {
      const label = button.querySelector("span:last-child")?.textContent || button.textContent;
      window.AppRoutes?.bindByLabel(button, label);
    });

    const caseId = getCaseIdFromPath();
    const item = await loadCase(caseId);
    document.title = `${item.name} - 案例详情`;
    document.getElementById("breadcrumb").textContent = `首页 / 客户案例 / ${item.name}`;
    document.getElementById("case-name").textContent = item.name;
    document.getElementById("case-meta").textContent = `${item.industry} | ${item.solution} | ${item.updatedAt}`;
    document.getElementById("case-summary").textContent = item.summary;
    document.getElementById("go-back").addEventListener("click", () => {
      window.location.href = withBase("/cases.html");
    });
  } catch (error) {
    document.body.innerHTML = "<main style='padding:24px'>案例不存在或加载失败。</main>";
    console.error(error);
  }
}

bootstrap();
