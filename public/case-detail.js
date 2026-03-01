function getCaseIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[1] || "";
}

async function loadCase(caseId) {
  const response = await fetch(`/api/cases/${encodeURIComponent(caseId)}`);
  if (!response.ok) throw new Error("案例不存在");
  return response.json();
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
      window.location.href = "/cases.html";
    });
  } catch (error) {
    document.body.innerHTML = "<main style='padding:24px'>案例不存在或加载失败。</main>";
    console.error(error);
  }
}

bootstrap();
