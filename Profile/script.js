document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const langToggles = [
    document.getElementById("lang-toggle-desktop"),
    document.getElementById("lang-toggle-mobile"),
  ];
  const typingElement = document.getElementById("typing-effect");

  const enTitles = [
    "Intern Web Developer",
    "C# & .NET Learner",
    "Vovinam Athlete",
  ];
  const viTitles = [
    "Thực tập sinh Web",
    "Người học C# & .NET",
    "Võ sinh Vovinam",
  ];
  let currentTitles = enTitles;

  const savedLang = localStorage.getItem("lang") || "en";
  body.setAttribute("lang", savedLang);
  const isVietnamese = savedLang === "vi";
  langToggles.forEach((toggle) => {
    if (toggle) toggle.checked = isVietnamese;
  });
  currentTitles = isVietnamese ? viTitles : enTitles;

  langToggles.forEach((toggle) => {
    if (toggle) {
      toggle.addEventListener("change", () => {
        const newLang = toggle.checked ? "vi" : "en";
        body.setAttribute("lang", newLang);
        localStorage.setItem("lang", newLang);
        currentTitles = toggle.checked ? viTitles : enTitles;

        langToggles.forEach((otherToggle) => {
          if (otherToggle && otherToggle !== toggle) {
            otherToggle.checked = toggle.checked;
          }
        });

        resetTypingEffect();
        resetTerminalWelcome();
        initScrollSpy();
      });
    }
  });

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeTimeout;

  function type() {
    clearTimeout(typeTimeout);
    const currentTitle = currentTitles[titleIndex];

    if (isDeleting) {
      typingElement.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % currentTitles.length;
      }
    } else {
      typingElement.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentTitle.length) {
        typeTimeout = setTimeout(() => {
          isDeleting = true;
        }, 2000);
      }
    }
    const typeSpeed = isDeleting ? 50 : 150;
    typeTimeout = setTimeout(type, typeSpeed);
  }

  function resetTypingEffect() {
    clearTimeout(typeTimeout);
    titleIndex = 0;
    charIndex = 0;
    isDeleting = false;
    if (typingElement) {
      typingElement.textContent = "";
    }
    type();
  }
  if (typingElement) {
    resetTypingEffect();
  }

  const glow = document.getElementById("mouse-glow");
  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  const smoothing = 0.1;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateGlow() {
    glowX += (mouseX - glowX) * smoothing;
    glowY += (mouseY - glowY) * smoothing;
    if (glow) {
      glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(updateGlow);
  }
  if (glow) {
    updateGlow();
  }

  const progressBar = document.getElementById("progress-bar");
  const mainNav = document.getElementById("main-nav");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
    if (progressBar) {
      progressBar.style.width = scrollPercent + "%";
    }

    if (mainNav) {
      if (scrollTop > 50) {
        mainNav.classList.add("scrolled");
      } else {
        mainNav.classList.remove("scrolled");
      }
    }
  });

  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.15 }
  );
  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  const projectCards = document.querySelectorAll(".project-card");
  const tiltStrength = 15;
  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;
      const rotateY = (mouseX / (rect.width / 2)) * tiltStrength;
      const rotateX = -(mouseY / (rect.height / 2)) * tiltStrength;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    });
  });

  const terminalWindow = document.getElementById("terminal-window");
  const terminalOutput = document.getElementById("terminal-output");
  const terminalInput = document.getElementById("terminal-input");

  if (terminalWindow && terminalOutput && terminalInput) {
    const linkCommands = {
      linkedin: "https://www.linkedin.com/in/nguyen-cao-qui/",
      github: "https://github.com/quincce190986",
      gitlab: "https://gitlab.com/quinc.ce190986",
      facebook: "https://facebook.com/imcqsngx/",
    };

    const helpCommand = {
      en:
        "Enter a command to open links:\n" +
        '  <span class="terminal-help-cmd">linkedin</span>  - Open my LinkedIn profile\n' +
        '  <span class="terminal-help-cmd">github</span>    - Open my GitHub profile\n' +
        '  <span class="terminal-help-cmd">gitlab</span>    - Open my GitLab profile\n' +
        '  <span class="terminal-help-cmd">facebook</span>  - Open my Facebook profile\n' +
        '  <span class="terminal-help-cmd">clear</span>     - Clear the terminal',
      vi:
        "Nhập lệnh để mở liên kết:\n" +
        '  <span class="terminal-help-cmd">linkedin</span>  - Mở trang LinkedIn\n' +
        '  <span class="terminal-help-cmd">github</span>    - Mở trang GitHub\n' +
        '  <span class="terminal-help-cmd">gitlab</span>    - Mở trang GitLab\n' +
        '  <span class="terminal-help-cmd">facebook</span>  - Mở trang Facebook\n' +
        '  <span class="terminal-help-cmd">clear</span>     - Xóa màn hình',
    };

    function appendOutput(htmlContent) {
      terminalOutput.innerHTML += `<div class="terminal-line">${htmlContent}</div>`;
      terminalWindow.scrollTop = terminalWindow.scrollHeight;
    }

    function executeCommand(command) {
      const lang = document.body.getAttribute("lang") || "en";
      const cmd = command.toLowerCase().trim();

      appendOutput(
        `<span class="terminal-prompt">~$</span> <span class="terminal-command">${command}</span>`
      );

      if (cmd === "clear") {
        terminalOutput.innerHTML = "";
      } else if (cmd === "help") {
        appendOutput(helpCommand[lang]);
      } else if (linkCommands[cmd]) {
        const url = linkCommands[cmd];
        appendOutput(`Opening ${cmd}...`);
        window.open(url, "_blank");
      } else if (cmd) {
        appendOutput(
          `<span class="terminal-error">Error: Command not found: ${cmd}. Type 'help' for commands.</span>`
        );
      }
    }

    function initTerminal() {
      const lang = document.body.getAttribute("lang") || "en";
      const welcome =
        lang === "vi"
          ? "Gõ 'help' để xem các lệnh."
          : "Type 'help' for commands.";
      appendOutput(welcome);
    }

    window.resetTerminalWelcome = function () {
      terminalOutput.innerHTML = "";
      initTerminal();
    };

    terminalInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        executeCommand(terminalInput.value);
        terminalInput.value = "";
      }
    });

    terminalWindow.addEventListener("click", () => {
      terminalInput.focus();
    });

    initTerminal();
  }

  let scrollSpyObserver = null;
  function initScrollSpy() {
    if (scrollSpyObserver) {
      scrollSpyObserver.disconnect();
    }
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("#navbarNav .nav-link");

    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    scrollSpyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          const lang = document.body.getAttribute("lang") || "en";
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (
              link.getAttribute("href") === `#${id}` &&
              link.getAttribute("data-lang") === lang
            ) {
              link.classList.add("active");
            }
          });
        }
      });
    }, observerOptions);
    sections.forEach((sec) => scrollSpyObserver.observe(sec));
  }
  initScrollSpy();
});
