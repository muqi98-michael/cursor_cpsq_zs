const fs = require("fs");
const path = require("path");

function loadDesignInput() {
  const filePath = path.join(__dirname, "..", "data", "design-layer.input.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function generateHomepageContent(designInput) {
  return {
    source: designInput.meta,
    navigation: {
      brand: designInput.navigation.logoTitle,
      user: {
        name: designInput.navigation.userName,
        initials: designInput.navigation.userInitials
      }
    },
    hero: {
      title: designInput.hero.title,
      subtitle: designInput.hero.subtitle,
      search: {
        placeholder: designInput.hero.searchPlaceholder,
        buttonText: designInput.hero.searchButtonText
      }
    },
    quickEntries: designInput.quickEntries.map((entry, index) => ({
      id: `quick-${index + 1}`,
      title: entry.title,
      iconBg: entry.iconBg,
      iconColor: entry.iconColor
    })),
    recentUpdates: designInput.recentUpdates.map((item, index) => ({
      id: `update-${index + 1}`,
      title: item.title,
      summary: `${item.category} | ${item.updatedAt} 更新`,
      actionText: "查看"
    }))
  };
}

function getHomepageContent() {
  const input = loadDesignInput();
  return generateHomepageContent(input);
}

module.exports = {
  getHomepageContent
};
