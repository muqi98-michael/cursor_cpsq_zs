function getSceneIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[1] || "";
}

async function loadScene(sceneId) {
  const response = await fetch(`/api/scenes/${encodeURIComponent(sceneId)}`);
  if (!response.ok) throw new Error("场景不存在");
  return response.json();
}

function fillForm(scene) {
  document.title = `${scene.name} - 编辑`;
  document.getElementById("scene-id").value = scene.sceneId;
  document.getElementById("scene-name").value = scene.name;
  document.getElementById("scene-industry").value = scene.industry;
  document.getElementById("scene-status").value = scene.status;
  document.getElementById("scene-pain").value = scene.painPoint;
  document.getElementById("scene-editor").value = scene.editor;
  document.getElementById("scene-updated").value = scene.updatedAt;
  document.getElementById("back-detail").href = `/scenes/${scene.sceneId}`;
}

function bindSaveEvent(sceneId) {
  document.getElementById("save-btn").addEventListener("click", () => {
    const draft = {
      sceneId: document.getElementById("scene-id").value,
      name: document.getElementById("scene-name").value,
      industry: document.getElementById("scene-industry").value,
      status: document.getElementById("scene-status").value,
      painPoint: document.getElementById("scene-pain").value,
      editor: document.getElementById("scene-editor").value,
      updatedAt: document.getElementById("scene-updated").value
    };
    window.localStorage.setItem(`scene-draft:${sceneId}`, JSON.stringify(draft));
    document.getElementById("save-hint").textContent =
      "已保存到本地草稿（localStorage），可继续接入真实保存 API。";
  });
}

async function bootstrap() {
  try {
    const sceneId = getSceneIdFromPath();
    const scene = await loadScene(sceneId);
    fillForm(scene);
    bindSaveEvent(sceneId);
  } catch (error) {
    document.body.innerHTML = "<main class='page'><section class='card'>场景不存在或加载失败。</section></main>";
    console.error(error);
  }
}

bootstrap();
