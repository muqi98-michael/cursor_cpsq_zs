function setHint(message, isError = false) {
  const hint = document.getElementById("login-hint");
  hint.textContent = message;
  hint.classList.toggle("error", isError);
}

function isValidPhone(value) {
  return /^1\d{10}$/.test(value);
}

function isValidCode(value) {
  return /^\d{4,6}$/.test(value);
}

function startCodeCountdown(seconds) {
  const link = document.getElementById("code-link");
  let left = seconds;
  link.dataset.disabled = "1";
  link.textContent = `${left}s 后重试`;
  const timer = setInterval(() => {
    left -= 1;
    if (left <= 0) {
      clearInterval(timer);
      link.dataset.disabled = "0";
      link.textContent = "获取验证码";
      return;
    }
    link.textContent = `${left}s 后重试`;
  }, 1000);
}

function goHomepage() {
  window.sessionStorage.setItem("login_status", "ok");
  window.location.href = window.AppRoutes?.getRouteForLabel("首页") || "/";
}

function bindEvents() {
  const phoneInput = document.getElementById("phone-input");
  const codeInput = document.getElementById("code-input");
  const loginBtn = document.getElementById("login-btn");
  const codeLink = document.getElementById("code-link");

  loginBtn.addEventListener("click", () => {
    // 调试模式：无需输入即可一键登录进入首页。
    setHint("调试模式登录成功，正在进入首页...");
    goHomepage();
  });

  [phoneInput, codeInput].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        loginBtn.click();
      }
    });
  });

  codeLink.addEventListener("click", (event) => {
    event.preventDefault();
    if (codeLink.dataset.disabled === "1") return;
    const phone = phoneInput.value.trim();
    if (!isValidPhone(phone)) {
      setHint("请先输入正确手机号，再获取验证码", true);
      return;
    }
    setHint("验证码已发送（演示模式）");
    startCodeCountdown(60);
  });
}

bindEvents();
