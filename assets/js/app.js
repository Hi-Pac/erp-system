// app.js

// تشغيل المنطق العام بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  // تفعيل وضع الظلام (Dark Mode)
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const body = document.body;

  darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
  });

  // الحفاظ على حالة الوضع الداكن عند إعادة التحميل
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
  }

  // مبدل اللغة
  const langSwitch = document.getElementById("lang-switch");
  langSwitch.addEventListener("click", () => {
    const currentLang = langSwitch.textContent.trim();
    const newLang = currentLang === "English" ? "Arabic" : "English";
    langSwitch.textContent = newLang;
    applyTranslations(newLang);
  });

  // وظيفة لتطبيق الترجمة
  function applyTranslations(lang) {
    // مثال على تغيير النصوص للغات مختلفة
    const translations = {
      Dashboard: { English: "Dashboard", Arabic: "لوحة التحكم" },
    };

    document.querySelectorAll("[data-translate]").forEach((el) => {
      const key = el.dataset.translate;
      if (translations[key]) el.textContent = translations[key][lang];
    });
  }

  // التوجيه (Routing) البسيط
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.target.getAttribute("href");
      window.location.href = target;
    });
  });
});
