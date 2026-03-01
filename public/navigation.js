(function initNavigationMap() {
  function getBasePath() {
    if (!window.location.hostname.endsWith("github.io")) return "";
    const firstSegment = window.location.pathname.split("/").filter(Boolean)[0];
    return firstSegment ? `/${firstSegment}` : "";
  }

  const basePath = getBasePath();

  const exactRouteMap = {
    首页: "/",
    产品场景库: "/scenes.html",
    产品解决方案: "/solutions.html",
    解决方案: "/solutions.html",
    客户案例: "/cases.html",
    概览: "/dashboard.html",
    基础数据管理: "/prototype.html?node=758694ba-8efa-4aeb-9c22-64c66c35f5e1",
    产品管理: "/prototype.html?node=758694ba-8efa-4aeb-9c22-64c66c35f5e1",
    用户管理: "/users.html",
    权限管理: "/permissions.html",
    权限配置: "/permissions.html",
    角色管理: "/prototype.html?node=2ba3ce23-c775-4d50-bf02-2f394c6e3c60",
    开放管理: "/open-management.html",
    系统设置: "/settings.html",
    操作日志: "/prototype.html?node=fddb1787-4aa1-4198-8571-088c78ef040a",
    新增解决方案: "/solutions.html",
    返回列表: "/scenes.html"
  };

  const fuzzyRouteRules = [
    { includes: "解决方案", route: "/solutions.html" },
    { includes: "客户案例", route: "/cases.html" },
    { includes: "场景库", route: "/scenes.html" },
    { includes: "用户管理", route: "/users.html" },
    { includes: "权限管理", route: "/permissions.html" },
    { includes: "权限配置", route: "/permissions.html" },
    { includes: "角色管理", route: "/prototype.html?node=2ba3ce23-c775-4d50-bf02-2f394c6e3c60" },
    { includes: "开放管理", route: "/open-management.html" },
    { includes: "系统设置", route: "/settings.html" }
  ];

  function normalizeLabel(label) {
    return String(label || "")
      .replace(/\s+/g, "")
      .replace(/[：:？?]/g, "")
      .trim();
  }

  function getRouteForLabel(label) {
    const normalized = normalizeLabel(label);
    if (!normalized) return null;
    if (exactRouteMap[normalized]) return `${basePath}${exactRouteMap[normalized]}`;

    const rule = fuzzyRouteRules.find((item) => normalized.includes(item.includes));
    return rule ? `${basePath}${rule.route}` : null;
  }

  function bindByLabel(element, label) {
    const route = getRouteForLabel(label);
    if (!route || element.dataset.routeBound === "1") return;
    element.dataset.routeBound = "1";
    element.style.cursor = "pointer";
    element.addEventListener("click", () => {
      window.location.href = route;
    });
  }

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
      产品管理:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h16v4H4V4Zm0 6h10v10H4V10Zm12 0h4v10h-4V10Z"/></svg>',
      用户管理:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"/></svg>',
      权限管理:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2 4 6v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V6l-8-4Zm0 2.2L18 7v5c0 3.8-2.4 7.9-6 9.2C8.4 19.9 6 15.8 6 12V7l6-2.8Z"/></svg>',
      权限配置:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2 4 6v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V6l-8-4Zm0 2.2L18 7v5c0 3.8-2.4 7.9-6 9.2C8.4 19.9 6 15.8 6 12V7l6-2.8Z"/></svg>',
      开放管理:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 3h7v7h-2V6.4l-7.3 7.3-1.4-1.4L17.6 5H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z"/></svg>',
      操作日志:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13 3a9 9 0 1 0 8.9 10h-2A7 7 0 1 1 13 5V3Zm-1 4h2v6h-5v-2h3V7Zm5-4v2h3.6L16 9.6l1.4 1.4L22 6.4V10h2V3h-7Z"/></svg>',
      系统设置:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.4 13a7.8 7.8 0 0 0 .1-2l2-1.5-2-3.4-2.4 1a8.6 8.6 0 0 0-1.8-1l-.4-2.6h-4l-.4 2.6a8.6 8.6 0 0 0-1.8 1l-2.4-1-2 3.4L4.5 11a7.8 7.8 0 0 0 .1 2l-2 1.5 2 3.4 2.4-1a8.6 8.6 0 0 0 1.8 1l.4 2.6h4l.4-2.6a8.6 8.6 0 0 0 1.8-1l2.4 1 2-3.4-2-1.5ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/></svg>'
    };
    return icons[normalizeLabel(label)] || icons["首页"];
  }

  window.AppRoutes = {
    normalizeLabel,
    getRouteForLabel,
    bindByLabel,
    getNavIconSvg
  };
})();
