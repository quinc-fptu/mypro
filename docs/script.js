// ===== CYBER LOADING SCREEN - Simplified and reliable =====
(function() {
  'use strict';
  
  // DEBUG MODE: Set to true to pause loading screen for inspection
  const DEBUG_MODE = false; // Set to false to re-enable auto-hide
  // PAUSE_AT_TRANSITION: Set to true to pause at transition effect (lock mechanism) for inspection
  const PAUSE_AT_TRANSITION = false; // Set to false to allow full transition
  
  const loadingSteps = [
    { text: { en: "Connecting to server...", vi: "Đang kết nối server..." }, progress: 15 },
    { text: { en: "Loading assets...", vi: "Đang tải tài nguyên..." }, progress: 35 },
    { text: { en: "Initializing components...", vi: "Đang khởi tạo component..." }, progress: 55 },
    { text: { en: "Building interface...", vi: "Đang xây dựng giao diện..." }, progress: 75 },
    { text: { en: "Optimizing performance...", vi: "Đang tối ưu hiệu suất..." }, progress: 90 },
    { text: { en: "System ready!", vi: "Hệ thống sẵn sàng!" }, progress: 100 }
  ];
  
  let currentStep = 0;
  let currentProgress = 0;
  let loadingHidden = false;
  const MIN_DISPLAY_TIME_MS = 3500; // Minimum 3.5 seconds
  const MIN_PROGRESS_SPEED = 0.2; // Minimum progress increment
  const MAX_PROGRESS_SPEED = 0.8; // Maximum progress increment
  const startTime = window.__LOADING_START_TIME__ || Date.now();
  
  // Random progress speed function
  function getRandomProgressSpeed() {
    return MIN_PROGRESS_SPEED + Math.random() * (MAX_PROGRESS_SPEED - MIN_PROGRESS_SPEED);
  }
  
  function getCurrentLang() {
    try {
      return document.body ? document.body.getAttribute("lang") || "en" : "en";
    } catch(e) {
      return "en";
    }
  }
  
  function updateLoadingStep() {
    if (loadingHidden) return;
    
    const loadingProgressBar = document.getElementById("loading-progress-bar");
    const loadingProgressPercent = document.getElementById("loading-percent");
    const loadingStatus = document.getElementById("loading-status");
    
    // Check if we have all required elements
    if (!loadingProgressBar || !loadingProgressPercent || !loadingStatus) {
      console.warn("Loading screen elements not found");
      return;
    }
    
    // Continuous animation from current progress to 100%
    const animateProgress = () => {
      if (loadingHidden) return;
      
      // Check if we've passed any step thresholds and update status text
      for (let i = loadingSteps.length - 1; i >= 0; i--) {
        if (currentProgress >= loadingSteps[i].progress && currentStep <= i) {
          currentStep = i;
          const lang = getCurrentLang();
          loadingStatus.textContent = loadingSteps[i].text[lang] || loadingSteps[i].text.en;
          console.log("Status updated at", loadingSteps[i].progress + "%:", loadingStatus.textContent);
          break;
        }
      }
      
      // Continue animating if not at 100%
      if (currentProgress < 100) {
        // Random progress increment for natural variation
        const randomSpeed = getRandomProgressSpeed();
        // Occasionally add small bursts (10% chance)
        const speedMultiplier = Math.random() < 0.1 ? 1.5 + Math.random() * 0.5 : 1.0;
        const progressIncrement = randomSpeed * speedMultiplier;
        
        currentProgress += progressIncrement;
        
        // Ensure we don't exceed 100%
        if (currentProgress > 100) {
          currentProgress = 100;
        }
        
        loadingProgressBar.style.width = currentProgress + "%";
        loadingProgressPercent.textContent = Math.round(currentProgress) + "%";
        
        // Random delay between frames for more natural animation (10-25ms)
        const frameDelay = 10 + Math.random() * 15;
        setTimeout(() => {
          if (!loadingHidden) {
            requestAnimationFrame(animateProgress);
          }
        }, frameDelay);
      } else {
        // Reached 100%
        currentProgress = 100;
        loadingProgressBar.style.width = "100%";
        loadingProgressPercent.textContent = "100%";
        
        // Ensure final status is shown
        const finalStep = loadingSteps[loadingSteps.length - 1];
        const finalLang = getCurrentLang();
        if (loadingStatus) {
          loadingStatus.textContent = finalStep.text[finalLang] || finalStep.text.en;
        }
        
        console.log("Progress reached 100%, final status:", loadingStatus.textContent);
        
        // Wait to show final status, then hide
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_DISPLAY_TIME_MS - elapsed);
        const finalDelay = Math.max(1000, Math.min(2000, remainingTime + 500));
        
        console.log("Step 6 completed! Elapsed:", elapsed, "ms, Remaining:", remainingTime, "ms, Will hide in:", finalDelay, "ms");
        
        // Use a named function to ensure it executes
        const hideAfterDelay = function() {
          console.log("hideAfterDelay called, loadingHidden:", loadingHidden);
          if (DEBUG_MODE) {
            console.log("DEBUG_MODE is ON - Loading screen will NOT auto-hide. Press F12 and type: window.skipLoadingScreen() to manually hide it.");
            return; // Don't hide in debug mode
          }
          if (!loadingHidden) {
            console.log("Calling hideLoadingScreen() now");
            hideLoadingScreen();
          } else {
            console.log("Loading screen already hidden, not calling hideLoadingScreen");
          }
        };
        
        if (!DEBUG_MODE) {
          setTimeout(hideAfterDelay, finalDelay);
          
          // Also set a backup timeout just in case
          setTimeout(function() {
            console.log("Backup timeout fired");
            if (DEBUG_MODE) {
              console.log("DEBUG_MODE is ON - Skipping backup hide");
              return;
            }
            if (!loadingHidden) {
              console.log("Backup: Force calling hideLoadingScreen()");
              hideLoadingScreen();
            }
          }, finalDelay + 1000);
        } else {
          console.log("DEBUG_MODE: Loading screen will stay visible. Use window.skipLoadingScreen() in console to hide it manually.");
        }
      }
    };
    
    // Start continuous animation
    animateProgress();
  }
  
  function hideLoadingScreen() {
    console.log("hideLoadingScreen: Function called, loadingHidden:", loadingHidden);
    
    if (loadingHidden) {
      console.log("hideLoadingScreen: Already hidden, returning");
      return;
    }
    
    // Don't set loadingHidden = true if pausing at transition (allows skip button to still work)
    if (!PAUSE_AT_TRANSITION) {
      console.log("hideLoadingScreen: Setting loadingHidden = true");
      loadingHidden = true;
    } else {
      console.log("hideLoadingScreen: PAUSE_AT_TRANSITION is ON - keeping loadingHidden = false to allow skip");
    }
    
    const loadingScreen = document.getElementById("loading-screen");
    const loadingProgressBar = document.getElementById("loading-progress-bar");
    const loadingProgressPercent = document.getElementById("loading-percent");
    const loadingStatus = document.getElementById("loading-status");
    
    console.log("hideLoadingScreen: Elements found - screen:", !!loadingScreen, "bar:", !!loadingProgressBar, "percent:", !!loadingProgressPercent, "status:", !!loadingStatus);
    
    // Ensure final status is shown
    if (loadingStatus) {
      const finalStep = loadingSteps[loadingSteps.length - 1];
      const lang = getCurrentLang();
      loadingStatus.textContent = finalStep.text[lang] || finalStep.text.en;
    }
    
    // Ensure progress is 100%
    if (loadingProgressBar) {
      loadingProgressBar.style.width = "100%";
    }
    if (loadingProgressPercent) {
      loadingProgressPercent.textContent = "100%";
    }
    
    if (!loadingScreen) {
      // If no loading screen, just unlock body
      console.log("hideLoadingScreen: No loading screen element found, unlocking body only");
      try {
        document.body.style.overflow = '';
        document.body.classList.add('loaded');
        console.log("hideLoadingScreen: Body unlocked");
      } catch(e) {
        console.error("hideLoadingScreen: Error unlocking body", e);
      }
      return;
    }
    
    console.log("hideLoadingScreen: Starting hide process for loading screen");
    
    // Unlock body first (allow scrolling)
    try {
      document.body.style.overflow = '';
      console.log("hideLoadingScreen: Body unlocked");
    } catch(e) {
      console.error("hideLoadingScreen: Error unlocking body", e);
    }
    
    // Start fade out animation
    try {
      // Step 1: Add fade-out class to trigger CSS transition
      loadingScreen.classList.add("fade-out");
      console.log("hideLoadingScreen: Added 'fade-out' class, starting animation");
      
      // PAUSE_AT_TRANSITION: Stop here to inspect transition effect
      if (PAUSE_AT_TRANSITION) {
        console.log("========================================");
        console.log("PAUSE_AT_TRANSITION is ON");
        console.log("Transition effect is now active. Simple fade out effect should be visible.");
        console.log("Animation will pause in the middle for inspection.");
        console.log("========================================");
        
        // Pause animation in the middle (at 50% of 1.5s = 750ms)
        setTimeout(() => {
          loadingScreen.classList.add("pause-animation");
          console.log("========================================");
          console.log("ANIMATION PAUSED at 50% (750ms)");
          console.log("You can now inspect the transition effect in DevTools.");
          console.log("Simple fade out effect should be visible and paused.");
          console.log("========================================");
          console.log("To resume animation: window.resumeAnimation()");
          console.log("To continue hiding: window.completeHideLoadingScreen()");
          console.log("Or click the SKIP button to restart and hide normally");
        }, 750); // Pause at 750ms (middle of 1.5s animation)
        
        // Don't continue with hiding - pause at transition
        return;
      }
      
      // Step 2: Show main content after lock mechanism starts (sync with animation)
      setTimeout(() => {
        try {
          document.body.classList.add('loaded');
          console.log("hideLoadingScreen: Added 'loaded' class to body");
        } catch(e) {
          console.error("hideLoadingScreen: Error adding loaded class", e);
        }
      }, 400);
      
      // Step 3: Force hide immediately, then remove from DOM after animation
      setTimeout(() => {
        try {
    if (loadingScreen) {
            // Force hide immediately
            loadingScreen.style.display = 'none';
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
            loadingScreen.style.zIndex = '-9999';
      loadingScreen.classList.add("hidden");
            console.log("hideLoadingScreen: Force hidden loading screen");
            
            // Remove from DOM after a brief moment
      setTimeout(() => {
              try {
                if (loadingScreen && loadingScreen.parentNode) {
                  loadingScreen.parentNode.removeChild(loadingScreen);
                  console.log("hideLoadingScreen: Loading screen removed from DOM");
                }
              } catch(e) {
                console.error("hideLoadingScreen: Error removing from DOM", e);
        }
            }, 200);
    }
        } catch(e) {
          console.error("hideLoadingScreen: Error in cleanup", e);
        }
      }, 1500); // Wait for animation (1500ms - simple fade out)
      
      console.log("hideLoadingScreen: Fade out animation started");
    } catch(e) {
      console.error("hideLoadingScreen: Error during fade out", e);
      // Fallback: remove immediately if animation fails
      try {
        document.body.classList.add('loaded');
        if (loadingScreen && loadingScreen.parentNode) {
          loadingScreen.parentNode.removeChild(loadingScreen);
          console.log("hideLoadingScreen: Fallback - removed from DOM");
        }
      } catch(e2) {
        console.error("hideLoadingScreen: Fallback failed", e2);
      }
    }
  }
  
  function startLoadingAnimation() {
    const loadingProgressBar = document.getElementById("loading-progress-bar");
    const loadingProgressPercent = document.getElementById("loading-percent");
    
    if (loadingProgressBar && loadingProgressPercent && !loadingHidden) {
      updateLoadingStep();
    }
  }
  
  function setupLoadingScreen() {
    // Lock body scroll
    try {
      if (document.body) {
        document.body.style.overflow = 'hidden';
      }
    } catch(e) {}
    
    // Start animation when DOM is ready
    function initAnimation() {
      if (!loadingHidden) {
        console.log("Starting loading animation");
        startLoadingAnimation();
      }
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAnimation);
  } else {
      initAnimation();
    }
    
    // Fallback: Hide after absolute maximum time (10 seconds)
    // This ensures loading screen never gets stuck
    if (!DEBUG_MODE) {
      setTimeout(function() {
        if (!loadingHidden) {
          console.log("Fallback: Hiding loading screen after max time");
          hideLoadingScreen();
        }
      }, 10000);
    } else {
      console.log("DEBUG_MODE: Fallback timeout disabled - loading screen will stay visible");
    }
  }
  
  // Resume animation - Global function
  window.resumeAnimation = function() {
    console.log("resumeAnimation: Resuming animation");
    const loadingScreen = document.getElementById("loading-screen");
    if (!loadingScreen) {
      console.log("resumeAnimation: Loading screen not found");
      return;
    }
    loadingScreen.classList.remove("pause-animation");
    console.log("resumeAnimation: Animation resumed");
  };
  
  // Complete hide loading screen after transition pause - Global function
  window.completeHideLoadingScreen = function() {
    console.log("completeHideLoadingScreen: Completing hide process after transition pause");
    loadingHidden = true; // Mark as hidden to prevent duplicate calls
    const loadingScreen = document.getElementById("loading-screen");
    if (!loadingScreen) {
      console.log("completeHideLoadingScreen: Loading screen not found");
      return;
    }
    
    // Check if animation is paused
    const isPaused = loadingScreen.classList.contains("pause-animation");
    const remainingAnimationTime = isPaused ? 750 : 0; // If paused at 750ms, 750ms remaining (1.5s - 750ms)
    
    // Remove pause class to resume animation
    if (isPaused) {
      loadingScreen.classList.remove("pause-animation");
      console.log("completeHideLoadingScreen: Animation resumed, remaining time:", remainingAnimationTime + "ms");
    }
    
    // Show main content immediately (or after a short delay if animation just resumed)
    setTimeout(() => {
      try {
        document.body.classList.add('loaded');
        console.log("completeHideLoadingScreen: Added 'loaded' class to body");
      } catch(e) {
        console.error("completeHideLoadingScreen: Error adding loaded class", e);
      }
    }, Math.min(400, remainingAnimationTime / 2));
    
    // Wait for animation to complete, then force hide and remove from DOM
    setTimeout(() => {
      try {
        if (loadingScreen) {
          // Force hide immediately
          loadingScreen.style.display = 'none';
          loadingScreen.style.opacity = '0';
          loadingScreen.style.visibility = 'hidden';
          loadingScreen.style.zIndex = '-9999';
          loadingScreen.classList.add("hidden");
          console.log("completeHideLoadingScreen: Force hidden loading screen");
          
          // Remove from DOM after a brief moment
          setTimeout(() => {
            try {
              if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
                console.log("completeHideLoadingScreen: Loading screen removed from DOM");
              }
            } catch(e) {
              console.error("completeHideLoadingScreen: Error removing from DOM", e);
            }
          }, 200);
        }
      } catch(e) {
        console.error("completeHideLoadingScreen: Error in cleanup", e);
      }
    }, Math.max(remainingAnimationTime, 1500) + 100); // Wait for remaining animation time (min 1.5s) + buffer
  };
  
  // Skip loading screen function - Global
  window.skipLoadingScreen = function() {
    console.log("skipLoadingScreen: Skip button clicked");
    if (!loadingHidden) {
      // Force progress to 100%
      currentProgress = 100;
      const loadingProgressBar = document.getElementById("loading-progress-bar");
      const loadingProgressPercent = document.getElementById("loading-percent");
      if (loadingProgressBar) {
        loadingProgressBar.style.width = "100%";
      }
      if (loadingProgressPercent) {
        loadingProgressPercent.textContent = "100%";
      }
      
      // Update final status
      const loadingStatus = document.getElementById("loading-status");
      if (loadingStatus) {
        const finalStep = loadingSteps[loadingSteps.length - 1];
        const lang = getCurrentLang();
        loadingStatus.textContent = finalStep.text[lang] || finalStep.text.en;
      }
      
      // Hide immediately
      setTimeout(function() {
        hideLoadingScreen();
      }, 300);
    }
  };
  
  // Initialize immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLoadingScreen);
  } else {
    setupLoadingScreen();
  }
  
  // Extra safety: hide after absolute max time
  if (!DEBUG_MODE) {
    setTimeout(function() {
      if (!loadingHidden) {
        console.log("Extra safety: Hiding loading screen");
        hideLoadingScreen();
      }
    }, 10000);
  } else {
    console.log("DEBUG_MODE: Extra safety timeout disabled");
  }
})();

document.addEventListener("DOMContentLoaded", () => {

  // ===== CONSTANTS =====
  const KONAMI_CODE = ["q", "i", "s", "n", "g", "x"];
  const RAINBOW_COMMAND = "qisngx";
  const STORAGE_KEYS = {
    lang: "lang",
    hasVoted: "hasVotedPortfolio",
    viewCount: "portfolioViewCount",
    theme: "theme",
  };

  const TITLES = {
    en: [
      "Intern Web Developer",
      "C# & .NET Learner",
      "Vovinam Athlete",
    ],
    vi: [
      "Thực tập sinh Web",
      "Người học C# & .NET",
      "Võ sinh Vovinam",
    ],
  };

  // ===== DOM ELEMENTS =====
  const body = document.body;
  const mainElement = document.querySelector("main");
  const langToggles = [
    document.getElementById("lang-toggle-desktop"),
    document.getElementById("lang-toggle-mobile"),
  ].filter(Boolean);
  const typingElement = document.getElementById("typing-effect");
  
  let currentTitles = TITLES.en;

  // ===== LANGUAGE MANAGEMENT =====
  function initLanguage() {
    const savedLang = localStorage.getItem(STORAGE_KEYS.lang) || "en";
    body.setAttribute("lang", savedLang);
    const isVietnamese = savedLang === "vi";
    
    langToggles.forEach((toggle) => {
      toggle.checked = isVietnamese;
    });
    
    currentTitles = isVietnamese ? TITLES.vi : TITLES.en;
  }

  function switchLanguage(newLang) {
    body.setAttribute("lang", newLang);
    localStorage.setItem(STORAGE_KEYS.lang, newLang);
    currentTitles = newLang === "vi" ? TITLES.vi : TITLES.en;

    langToggles.forEach((toggle) => {
      toggle.checked = newLang === "vi";
    });

    if (typeof resetTypingEffect === "function") resetTypingEffect();
    if (typeof resetTerminalWelcome === "function") resetTerminalWelcome();
  }

  initLanguage();

  langToggles.forEach((toggle) => {
    toggle.addEventListener("change", () => {
      const newLang = toggle.checked ? "vi" : "en";
      switchLanguage(newLang);
    });
  });

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeTimeout;

  function type() {
    clearTimeout(typeTimeout);
    if (!typingElement) return;
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

  // ===== CUSTOM CURSOR (Disabled for better performance) =====
  // Custom cursor disabled to improve performance - use native cursor instead
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-dot-outline");
  
  // Hide custom cursor elements
  if (cursorDot) cursorDot.style.display = "none";
  if (cursorOutline) cursorOutline.style.display = "none";

  // ===== HERO SECTION MOUSE TRACKING (Removed for performance) =====
  // Mouse tracking removed to reduce lag

  // ===== SCROLL HANDLERS =====
  const progressBar = document.getElementById("progress-bar");
  const mainNav = document.getElementById("main-nav");
  const scrollToTopBtn = document.getElementById("scroll-to-top");

  let ticking = false;
  function updateOnScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollPercent = Math.min(100, (scrollTop / (docHeight - winHeight)) * 100);

    if (progressBar) {
      progressBar.style.width = scrollPercent + "%";
    }

    if (mainNav) {
      mainNav.classList.toggle("scrolled", scrollTop > 50);
    }

    // Show/hide scroll to top button
    if (scrollToTopBtn) {
      if (scrollTop > 300) {
        scrollToTopBtn.classList.add("visible");
      } else {
        scrollToTopBtn.classList.remove("visible");
      }
    }

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }, { passive: true });

  // Scroll to top functionality
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // Optimized reveal observer with reduced threshold for better performance
  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Unobserve after visible to reduce work
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.1,
      rootMargin: "50px",
    }
  );
  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  const skillsSection = document.getElementById("skills");
  const skillTags = document.querySelectorAll(".skill-tag");

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          skillTags.forEach((tag, index) => {
            setTimeout(() => {
              tag.classList.add("is-visible");
            }, index * 100);
          });
          skillObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.2,
    }
  );

  if (skillsSection) {
    skillObserver.observe(skillsSection);
  }

  // ===== PROJECT CARDS TILT (Removed for performance) =====
  // 3D tilt effect removed to improve performance and reduce lag

  // ===== RAINBOW MODE & CONFETTI =====
  function toggleRainbowMode() {
    body.classList.toggle("rainbow-mode");
    // Confetti removed for performance
  }

  function runConfetti() {
    if (!window.confetti) return;

    try {
      // Main confetti burst
      confetti({
        particleCount: 300,
        spread: 180,
        startVelocity: 60,
        decay: 0.9,
        ticks: 500,
        origin: { y: 0.4 },
        colors: [
          "#00aaff", "#00ffaa", "#aaff00", "#ffaa00",
          "#ff00aa", "#aa00ff", "#ffffff", "#ff0000",
          "#00ff00", "#0000ff",
        ],
      });

      // Secondary burst
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 120,
          startVelocity: 45,
          scalar: 0.7,
          origin: { y: 0.7 },
        });
      }, 150);
    } catch (error) {
      console.error("Error running confetti:", error);
    }
  }

  const terminalWindow = document.getElementById("terminal-window");
  const terminalOutput = document.getElementById("terminal-output");
  const terminalInput = document.getElementById("terminal-input");

  if (terminalWindow && terminalOutput && terminalInput) {
    const linkCommands = {
      linkedin: "https://www.linkedin.com/in/nguyen-cao-qui/",
      github: "https://github.com/quinc-fptu",
      gitlab: "https://gitlab.com/quinc.ce190986",
      // facebook: "https://facebook.com//",
    };

    const virtualFiles = {
      "about.txt": {
        en: () =>
          Array.from(
            document.querySelectorAll('#about .summary p[data-lang="en"]')
          )
            .map((p) => p.textContent)
            .join("\n\n"),
        vi: () =>
          Array.from(
            document.querySelectorAll('#about .summary p[data-lang="vi"]')
          )
            .map((p) => p.textContent)
            .join("\n\n"),
      },
      "projects.md": {
        en: () =>
          "My Projects:\n" +
          Array.from(document.querySelectorAll("#projects .project-card"))
            .map(
              (card, i) =>
                `# ${i + 1}. ${
                  card.querySelector('h3[data-lang="en"]').textContent
                }`
            )
            .join("\n"),
        vi: () =>
          "Dự án của tôi:\n" +
          Array.from(document.querySelectorAll("#projects .project-card"))
            .map(
              (card, i) =>
                `# ${i + 1}. ${
                  card.querySelector('h3[data-lang="vi"]').textContent
                }`
            )
            .join("\n"),
      },
      "skills.json": {
        en: () => {
          const skills = {};
          document.querySelectorAll("#skills .col-lg-4").forEach((col) => {
            const colTitle = col
              .querySelector('h3[data-lang="en"]')
              .textContent.trim();
            const categories = {};
            col.querySelectorAll(".skill-category-card").forEach((cat) => {
              const titleEl = cat.querySelector('strong[data-lang="en"]');
              if (titleEl) {
                const title = titleEl.textContent.replace(":", "");
                const tags = Array.from(cat.querySelectorAll(".skill-tag")).map(
                  (tag) =>
                    tag
                      .querySelector('span[data-lang="en"]')
                      ?.textContent.trim() || tag.textContent.trim()
                );
                categories[title] = tags.filter(Boolean);
              }
            });
            skills[colTitle] = categories;
          });
          return JSON.stringify(skills, null, 2);
        },
        vi: () => {
          const skills = {};
          document.querySelectorAll("#skills .col-lg-4").forEach((col) => {
            const colTitle = col
              .querySelector('h3[data-lang="vi"]')
              .textContent.trim();
            const categories = {};
            col.querySelectorAll(".skill-category-card").forEach((cat) => {
              const titleEl = cat.querySelector('strong[data-lang="vi"]');
              if (titleEl) {
                const title = titleEl.textContent.replace(":", "");
                const tags = Array.from(cat.querySelectorAll(".skill-tag")).map(
                  (tag) =>
                    tag
                      .querySelector('span[data-lang="vi"]')
                      ?.textContent.trim() || tag.textContent.trim()
                );
                categories[title] = tags.filter(Boolean);
              }
            });
            skills[colTitle] = categories;
          });
          return JSON.stringify(skills, null, 2);
        },
      },
    };

    const helpCommand = {
      en:
        "--- File System ---\n" +
        '  <span class="terminal-help-cmd">ls</span>          - List files\n' +
        '  <span class="terminal-help-cmd">cat [file]</span>    - Read file content (e.g., cat about.txt)\n' +
        '  <span class="terminal-help-cmd">pwd</span>          - Print working directory\n' +
        "--- Quick Links ---\n" +
        '  <span class="terminal-help-cmd">linkedin</span>      - Open my LinkedIn profile\n' +
        '  <span class="terminal-help-cmd">github</span>        - Open my GitHub profile\n' +
        '  <span class="terminal-help-cmd">gitlab</span>        - Open my GitLab profile\n' +
        "--- Utilities ---\n" +
        '  <span class="terminal-help-cmd">whoami</span>        - Display current user\n' +
        '  <span class="terminal-help-cmd">date</span>          - Show current date and time\n' +
        '  <span class="terminal-help-cmd">echo [text]</span>  - Print text to terminal\n' +
        '  <span class="terminal-help-cmd">history</span>       - Show command history\n' +
        '  <span class="terminal-help-cmd">clear</span>         - Clear the terminal',
      vi:
        "--- Hệ thống Tệp ---\n" +
        '  <span class="terminal-help-cmd">ls</span>          - Liệt kê tệp\n' +
        '  <span class="terminal-help-cmd">cat [tên tệp]</span> - Đọc nội dung tệp (ví dụ: cat about.txt)\n' +
        '  <span class="terminal-help-cmd">pwd</span>          - Hiển thị thư mục hiện tại\n' +
        "--- Liên kết nhanh ---\n" +
        '  <span class="terminal-help-cmd">linkedin</span>      - Mở trang LinkedIn\n' +
        '  <span class="terminal-help-cmd">github</span>        - Mở trang GitHub\n' +
        '  <span class="terminal-help-cmd">gitlab</span>        - Mở trang GitLab\n' +
        "--- Tiện ích ---\n" +
        '  <span class="terminal-help-cmd">whoami</span>        - Hiển thị người dùng hiện tại\n' +
        '  <span class="terminal-help-cmd">date</span>          - Hiển thị ngày và giờ\n' +
        '  <span class="terminal-help-cmd">echo [văn bản]</span> - In văn bản ra terminal\n' +
        '  <span class="terminal-help-cmd">history</span>       - Hiển thị lịch sử lệnh\n' +
        '  <span class="terminal-help-cmd">clear</span>         - Xóa màn hình',
    };

    let commandHistory = [];
    let historyIndex = -1;

    function appendOutput(htmlContent) {
      terminalOutput.innerHTML += `<div class="terminal-line">${htmlContent}</div>`;
      terminalWindow.scrollTop = terminalWindow.scrollHeight;
    }

    function executeCommand(command) {
      if (!command.trim()) return;
      
      const lang = document.body.getAttribute("lang") || "en";
      const parts = command.trim().split(" ").filter(Boolean);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      // Add to history
      if (command.trim() && commandHistory[commandHistory.length - 1] !== command.trim()) {
        commandHistory.push(command.trim());
        if (commandHistory.length > 50) commandHistory.shift();
      }
      historyIndex = commandHistory.length;

      appendOutput(
        `<span class="terminal-prompt">~$</span> <span class="terminal-command">${command}</span>`
      );

      if (cmd === "clear") {
        terminalOutput.innerHTML = "";
      } else if (cmd === "help") {
        appendOutput(helpCommand[lang]);
      } else if (cmd === RAINBOW_COMMAND) {
        toggleRainbowMode();
      } else if (cmd === "whoami") {
        appendOutput(lang === "vi" ? "QuiNC (Nguyễn Cao Quí)" : "QuiNC (Nguyen Cao Qui)");
      } else if (cmd === "date") {
        const now = new Date();
        const dateStr = now.toLocaleString(lang === "vi" ? "vi-VN" : "en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        appendOutput(dateStr);
      } else if (cmd === "echo") {
        const text = args.join(" ");
        appendOutput(text || "");
      } else if (cmd === "pwd") {
        appendOutput("~/portfolio");
      } else if (cmd === "history") {
        if (commandHistory.length === 0) {
          appendOutput(lang === "vi" ? "Lịch sử lệnh trống." : "Command history is empty.");
        } else {
          const historyList = commandHistory
            .map((cmd, idx) => `${idx + 1}. ${cmd}`)
            .join("\n");
          appendOutput(historyList);
        }
      } else if (linkCommands[cmd]) {
        const url = linkCommands[cmd];
        appendOutput(lang === "vi" ? `Đang mở ${cmd}...` : `Opening ${cmd}...`);
        window.open(url, "_blank");
      } else if (cmd === "ls") {
        const files = Object.keys(virtualFiles).join("   ");
        appendOutput(files);
      } else if (cmd === "cat") {
        const filename = args[0];
        if (!filename) {
          appendOutput(
            `<span class="terminal-error">Error: Missing filename. Usage: cat [filename]</span>`
          );
        } else if (virtualFiles[filename]) {
          const content = virtualFiles[filename][lang]();
          appendOutput(content.replace(/\n/g, "<br>"));
        } else {
          appendOutput(
            `<span class="terminal-error">Error: File not found: ${filename}</span>`
          );
        }
      } else if (cmd) {
        appendOutput(
          `<span class="terminal-error">Error: Command not found: ${cmd}. Type 'help' for commands.</span>`
        );
      }
    }

    function initTerminal() {
      const lang = document.body.getAttribute("lang") || "en";
      const welcome = lang === "vi"
        ? "=== Chào mừng đến Portfolio Terminal! ===\n\nGõ 'help' để xem các lệnh. Thử gõ 'ls'!"
        : "=== Welcome to Portfolio Terminal! ===\n\nType 'help' for commands. Try typing 'ls'!";
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
        historyIndex = commandHistory.length;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0) {
          historyIndex = Math.max(0, historyIndex - 1);
          terminalInput.value = commandHistory[historyIndex] || "";
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
          terminalInput.value = commandHistory[historyIndex] || "";
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = "";
        }
      }
    });

    terminalWindow.addEventListener("click", () => {
      terminalInput.focus();
    });

    const redBtn = document.querySelector(".btn-red");
    const yellowBtn = document.querySelector(".btn-yellow");
    const greenBtn = document.querySelector(".btn-green");
    const terminalTitle = document.querySelector(".terminal-title");

    let clickedButtons = new Set();
    let hintRevealed = false;

    const allButtons = [redBtn, yellowBtn, greenBtn];

    allButtons.forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", (e) => {
          if (hintRevealed) return;

          const color = e.target.className.match(/btn-(red|yellow|green)/)[1];
          clickedButtons.add(color);

          e.target.style.transform = "scale(0.8)";
          setTimeout(() => {
            e.target.style.transform = "scale(1)";
          }, 150);

          if (clickedButtons.size === 3) {
            setTimeout(() => {
              if (terminalTitle) {
                terminalTitle.textContent = "QisNgx@KonamiCode";
              }
              hintRevealed = true;
            }, 500);
          }
        });
      }
    });
    initTerminal();
  }

  let focusAndScrollSpyObserver = null;
  function initFocusAndScrollSpy() {
    if (focusAndScrollSpyObserver) {
      focusAndScrollSpyObserver.disconnect();
    }
    const sections = document.querySelectorAll("main > section[id]");
    const navLinks = document.querySelectorAll("#navbarNav .nav-link");

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.1, 0.5, 1],
    };

    let currentActiveSection = null;

    focusAndScrollSpyObserver = new IntersectionObserver((entries) => {
      const lang = document.body.getAttribute("lang") || "en";
      
      // Find the section with the highest intersection ratio
      let maxRatio = 0;
      let focusedEntry = null;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          focusedEntry = entry;
        }
      });

      // Fallback: if no section is intersecting, find the closest one
      if (!focusedEntry) {
        const scrollY = window.scrollY + 100;
        let closestSection = null;
        let minDistance = Infinity;

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + window.scrollY;
          const distance = Math.abs(sectionTop - scrollY);
          
          if (distance < minDistance && sectionTop <= scrollY + 200) {
            minDistance = distance;
            closestSection = section;
          }
        });

        if (closestSection) {
          focusedEntry = { target: closestSection, isIntersecting: true };
        }
      }

      if (focusedEntry && focusedEntry.target !== currentActiveSection) {
        currentActiveSection = focusedEntry.target;
        mainElement.classList.add("has-focus");

        const id = focusedEntry.target.getAttribute("id");

        sections.forEach((section) => {
          section.classList.toggle(
            "is-focused",
            section === focusedEntry.target
          );
        });

        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (
            link.getAttribute("href") === `#${id}` &&
            link.getAttribute("data-lang") === lang
          ) {
            link.classList.add("active");
          }
        });
      } else if (!focusedEntry) {
        mainElement.classList.remove("has-focus");
        sections.forEach((section) => {
          section.classList.remove("is-focused");
        });
      }
    }, observerOptions);

    sections.forEach((sec) => {
      if (sec.getAttribute("id")) {
        focusAndScrollSpyObserver.observe(sec);
      }
    });

    // Scroll-based navigation update (throttled for performance)
    let scrollTimeout;
    let lastScrollNavUpdate = 0;
    const navUpdateThrottle = 100; // Update nav every 100ms max
    
    window.addEventListener("scroll", () => {
      const now = Date.now();
      if (now - lastScrollNavUpdate < navUpdateThrottle) return;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollY = window.scrollY + 150;
        let activeId = "hero";

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + window.scrollY;
          
          if (sectionTop <= scrollY && sectionTop + rect.height > scrollY - 100) {
            activeId = section.getAttribute("id") || "hero";
          }
        });

        const lang = document.body.getAttribute("lang") || "en";
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (
            link.getAttribute("href") === `#${activeId}` &&
            link.getAttribute("data-lang") === lang
          ) {
            link.classList.add("active");
          }
        });
        lastScrollNavUpdate = Date.now();
      }, 50);
    }, { passive: true });
  }
  // SỬA LỖI: Trì hoãn việc khởi tạo Scroll Spy để tránh tự cuộn khi tải trang.
  setTimeout(initFocusAndScrollSpy, 1000);

  setTimeout(() => {
    if (window.firebase) {
      const { db, doc, getDoc, updateDoc, increment } = window.firebase;

      // THAY ĐỔI: Khai báo cả hai nút/span (Desktop và Mobile)
      const upvoteButtonDesktop = document.getElementById("upvote-button");
      const voteCountSpanDesktop = document.getElementById("vote-count");
      const upvoteButtonMobile = document.getElementById(
        "upvote-button-mobile"
      );
      const voteCountSpanMobile = document.getElementById("vote-count-mobile");

      const voteDocRef = doc(db, "votes", "portfolio");

      async function getVoteCount() {
        try {
          const docSnap = await getDoc(voteDocRef);
          if (docSnap.exists()) {
            const count = docSnap.data().count;
            // Cập nhật cả hai span
            if (voteCountSpanDesktop) voteCountSpanDesktop.textContent = count;
            if (voteCountSpanMobile) voteCountSpanMobile.textContent = count;
          } else {
            console.log("Không tìm thấy document vote!");
          }
        } catch (e) {
          console.error("Lỗi khi lấy vote: ", e);
        }
      }

      // THAY ĐỔI: Hàm incrementVote được chỉnh sửa để kích hoạt confetti từ nút được nhấn
      async function incrementVote(event) {
        const clickedButton = event.currentTarget;
        const buttons = [upvoteButtonDesktop, upvoteButtonMobile].filter(Boolean);
        
        // Disable all buttons
        buttons.forEach(btn => btn.disabled = true);

        try {
          await updateDoc(voteDocRef, {
            count: increment(1),
          });

          localStorage.setItem(STORAGE_KEYS.hasVoted, "true");
          await getVoteCount();

          // Confetti effect
          if (window.confetti && clickedButton) {
            try {
              const rect = clickedButton.getBoundingClientRect();
              const origin = {
                x: (rect.left + rect.width / 2) / window.innerWidth,
                y: (rect.top + rect.height / 2) / window.innerHeight,
              };
              confetti({
                particleCount: 150,
                spread: 90,
                origin: origin,
                colors: ["#00aaff", "#ffffff", "#0088cc"],
              });
            } catch (confettiError) {
              console.warn("Confetti error:", confettiError);
            }
          }
        } catch (error) {
          console.error("Error updating vote:", error);
          // Re-enable buttons on error
          buttons.forEach(btn => btn.disabled = false);
          localStorage.removeItem(STORAGE_KEYS.hasVoted);
        }
      }

      function checkVoteStatus() {
        const hasVoted = localStorage.getItem(STORAGE_KEYS.hasVoted) === "true";
        const buttons = [upvoteButtonDesktop, upvoteButtonMobile].filter(Boolean);
        
        if (hasVoted) {
          buttons.forEach(btn => btn.disabled = true);
        } else {
          buttons.forEach(btn => {
            btn.disabled = false;
            btn.addEventListener("click", incrementVote);
          });
        }
      }

      getVoteCount();
      checkVoteStatus();
    } else {
      console.error(
        "Firebase chưa được khởi tạo. Hãy kiểm tra lại `firebaseConfig` trong index.html."
      );
    }
  }, 500);

  // ===== MAGNETIC BUTTONS (Removed for performance) =====
  // Magnetic button effects removed to improve performance

  // ===== CURSOR HOVER EFFECTS (Removed for performance) =====
  // Cursor hover effects removed since custom cursor is disabled
  // ===== IMAGE PROTECTION =====
  const portraitImage = document.querySelector(".about-image-container img");
  if (portraitImage) {
    portraitImage.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }
  // ===== ENHANCED KONAMI CODE =====
  function initKonamiCode() {
    let konamiPosition = 0;
    let konamiTimeout = null;
    let konamiIndicator = null;

    // Create visual indicator
    function createIndicator() {
      if (konamiIndicator) return konamiIndicator;
      
      konamiIndicator = document.createElement("div");
      konamiIndicator.id = "konami-indicator";
      konamiIndicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid var(--accent-primary);
        border-radius: 10px;
        padding: 1rem 1.5rem;
        z-index: 10001;
        font-family: 'Roboto Mono', monospace;
        font-size: 0.9rem;
        color: var(--accent-primary);
        box-shadow: 0 0 20px rgba(0, 245, 255, 0.5);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        pointer-events: none;
      `;
      document.body.appendChild(konamiIndicator);
      return konamiIndicator;
    }

    function showIndicator(progress) {
      const indicator = createIndicator();
      const progressBar = progress.map((_, i) => 
        i < konamiPosition ? '█' : '░'
      ).join('');
      indicator.textContent = `Konami: ${progressBar} (${konamiPosition}/${KONAMI_CODE.length})`;
      indicator.style.opacity = '1';
      indicator.style.transform = 'translateY(0)';
      
      // Pulse effect
      indicator.style.animation = 'pulse 0.5s ease';
      
      clearTimeout(konamiTimeout);
      konamiTimeout = setTimeout(() => {
        if (indicator) {
          indicator.style.opacity = '0';
          indicator.style.transform = 'translateY(20px)';
        }
      }, 2000);
    }

    function hideIndicator() {
      if (konamiIndicator) {
        konamiIndicator.style.opacity = '0';
        konamiIndicator.style.transform = 'translateY(20px)';
      }
    }

    function activateRainbowMode() {
      // Check if rainbow mode is currently active BEFORE toggling
      const isCurrentlyActive = body.classList.contains("rainbow-mode");
      
      toggleRainbowMode();
      
      // Confetti removed for performance

      // Show success notification
      const notification = document.createElement("div");
      notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, rgba(0, 245, 255, 0.95), rgba(0, 212, 230, 0.95));
        color: #000;
        padding: 1.5rem 2.5rem;
        border-radius: 15px;
        font-weight: 700;
        font-size: 1.2rem;
        z-index: 10002;
        box-shadow: 0 0 40px rgba(0, 245, 255, 0.8);
        animation: slideDown 0.5s ease;
      `;
      
      // Show different message based on current state
      if (isCurrentlyActive) {
        notification.textContent = "🌈 RAINBOW MODE DEACTIVATED! 🌈";
      } else {
      notification.textContent = "🌈 RAINBOW MODE ACTIVATED! 🌈";
      }
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideUp 0.5s ease';
        setTimeout(() => notification.remove(), 500);
      }, 3000);
    }

    document.addEventListener("keydown", (e) => {
      // Prevent conflict with terminal input
      if (document.activeElement?.id === "terminal-input") {
        return;
      }

      const key = e.key?.toLowerCase();
      if (key === KONAMI_CODE[konamiPosition]) {
        konamiPosition++;
        showIndicator(KONAMI_CODE);
        
        if (konamiPosition === KONAMI_CODE.length) {
          activateRainbowMode();
          konamiPosition = 0;
          hideIndicator();
        }
      } else if (key.length === 1) {
        // Reset on any other key
        konamiPosition = 0;
        hideIndicator();
      }
    });
  }
  
  initKonamiCode();

  // ===== SMOOTH SCROLL ENHANCEMENT =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "") return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 88; // Account for navbar height
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth"
        });
      }
    });
  });

  // ===== ENHANCED PROJECT CARDS ANIMATION =====
  const allProjectCards = document.querySelectorAll(".project-card");
  allProjectCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  // ===== PARALLAX EFFECT (Removed for performance) =====
  // Parallax effect removed to reduce scroll-related lag

  // ===== COPY EMAIL =====
  const copyEmailBtn = document.getElementById("copy-email");
  const emailLink = document.getElementById("email-link");
  const copyFeedback = document.getElementById("copy-email-feedback");
  
  if (copyEmailBtn && emailLink && copyFeedback) {
    copyEmailBtn.addEventListener("click", async () => {
      const email = emailLink.textContent;
      try {
        await navigator.clipboard.writeText(email);
        copyFeedback.style.display = "inline";
        copyEmailBtn.style.opacity = "0.5";
        setTimeout(() => {
          copyFeedback.style.display = "none";
          copyEmailBtn.style.opacity = "1";
        }, 2000);
      } catch (err) {
        const textArea = document.createElement("textarea");
        textArea.value = email;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          copyFeedback.style.display = "inline";
          copyEmailBtn.style.opacity = "0.5";
          setTimeout(() => {
            copyFeedback.style.display = "none";
            copyEmailBtn.style.opacity = "1";
          }, 2000);
        } catch (err) {
          console.error("Failed to copy email:", err);
        }
        document.body.removeChild(textArea);
      }
    });
  }

  // ===== KEYBOARD SHORTCUTS (Removed) =====
  // Keyboard navigation removed as requested

  // ===== ANIMATE SKILL PROGRESS BARS =====
  function animateSkillBars() {
    const progressBars = document.querySelectorAll(".skill-progress-fill");
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const progressBar = entry.target;
            const progress = parseInt(progressBar.getAttribute("data-progress") || "0");
            progressBar.style.width = `${progress}%`;
            skillObserver.unobserve(progressBar);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    progressBars.forEach((bar) => {
      skillObserver.observe(bar);
    });
  }

  animateSkillBars();

  // ===== SKILL NAVIGATION =====
  // Function is now defined globally before DOMContentLoaded
  // No need to redefine it here

  // ===== INTERACTIVE SKILL RADAR CHART =====
  const toggleSkillView = document.getElementById("toggle-skill-view");
  const skillRadarContainer = document.getElementById("skill-radar-container");
  const skillCardsView = document.getElementById("skill-cards-view");
  const radarChart = document.getElementById("skill-radar-chart");

  let isRadarView = false;

  const skillData = {
    labels: ["OOP", "DSA", "SQL", "Java", "JSP", "HTML", "CSS", "JS"],
    current: [70, 65, 60, 65, 55, 70, 65, 60],
    target: [95, 90, 85, 90, 85, 90, 85, 85]
  };

  function drawRadarChart() {
    if (!radarChart) return;
    
    const ctx = radarChart.getContext("2d");
    const centerX = radarChart.width / 2;
    const centerY = radarChart.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    const numPoints = skillData.labels.length;
    const angleStep = (Math.PI * 2) / numPoints;

    ctx.clearRect(0, 0, radarChart.width, radarChart.height);

    // Draw grid circles (reduced from 5 to 3 for performance)
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 245, 255, ${0.15 + i * 0.1})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw grid lines
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = `rgba(0, 245, 255, 0.2)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw labels
      const labelX = centerX + Math.cos(angle) * (radius + 20);
      const labelY = centerY + Math.sin(angle) * (radius + 20);
      ctx.fillStyle = "var(--bs-body-color)";
      ctx.font = "12px 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(skillData.labels[i], labelX, labelY);
    }

    // Draw target area
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const value = skillData.target[i];
      const r = (radius * value) / 100;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(0, 153, 179, 0.2)";
    ctx.fill();
    ctx.strokeStyle = "var(--accent-tertiary)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw current area
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const value = skillData.current[i];
      const r = (radius * value) / 100;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(0, 245, 255, 0.3)";
    ctx.fill();
    ctx.strokeStyle = "var(--accent-primary)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw points (simplified for performance)
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const value = skillData.current[i];
      const r = (radius * value) / 100;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "var(--accent-primary)";
      ctx.fill();
    }
  }

  function resizeRadarChart() {
    if (!radarChart) return;
    const container = skillRadarContainer;
    if (container) {
      radarChart.width = container.offsetWidth;
      radarChart.height = 500;
      drawRadarChart();
    }
  }

  if (toggleSkillView && skillRadarContainer && skillCardsView) {
    toggleSkillView.addEventListener("click", () => {
      isRadarView = !isRadarView;
      
      if (isRadarView) {
        skillRadarContainer.style.display = "block";
        skillCardsView.style.display = "none";
        toggleSkillView.innerHTML = '<span data-lang="en">📋 Cards View</span><span data-lang="vi">📋 Xem thẻ</span>';
        setTimeout(() => {
          resizeRadarChart();
          drawRadarChart();
        }, 100);
      } else {
        skillRadarContainer.style.display = "none";
        skillCardsView.style.display = "flex";
        toggleSkillView.innerHTML = '<span data-lang="en">📊 Radar Chart</span><span data-lang="vi">📊 Biểu đồ</span>';
      }
    });

    // Throttle resize handler for performance
    let resizeTimeout;
    window.addEventListener("resize", () => {
      if (isRadarView) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
        resizeRadarChart();
        drawRadarChart();
        }, 150);
      }
    }, { passive: true });
  }

  // ===== INTERACTIVE PROJECT SEARCH =====
  const projectSearch = document.getElementById("project-search");
  const projectsContainer = document.getElementById("projects-container");
  
  if (projectSearch && projectsContainer) {
    const projectCards = Array.from(projectsContainer.querySelectorAll(".project-card"));
    
    function updatePlaceholder() {
      const lang = body.getAttribute("lang");
      const placeholder = projectSearch.getAttribute(
        lang === "vi" ? "data-lang-placeholder-vi" : "data-lang-placeholder-en"
      );
      projectSearch.placeholder = placeholder || "Search projects...";
    }
    
    updatePlaceholder();
    
    projectSearch.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      
      projectCards.forEach((card) => {
        const cardText = card.textContent.toLowerCase();
        const cardElement = card.closest(".col-lg-6") || card.parentElement;
        
        if (searchTerm === "" || cardText.includes(searchTerm)) {
          cardElement.style.display = "";
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
        } else {
          cardElement.style.display = "none";
        }
      });

      // Show "no results" message if needed
      const visibleCards = projectCards.filter((card) => {
        const cardElement = card.closest(".col-lg-6") || card.parentElement;
        return cardElement.style.display !== "none";
      });

      let noResultsMsg = projectsContainer.querySelector(".no-results");
      if (visibleCards.length === 0 && searchTerm !== "") {
        if (!noResultsMsg) {
          noResultsMsg = document.createElement("div");
          noResultsMsg.className = "no-results text-center col-12 mt-5";
          noResultsMsg.innerHTML = `
            <p class="text-muted" data-lang="en">No projects found matching "${searchTerm}"</p>
            <p class="text-muted" data-lang="vi">Không tìm thấy dự án nào khớp với "${searchTerm}"</p>
          `;
          projectsContainer.appendChild(noResultsMsg);
        }
      } else if (noResultsMsg) {
        noResultsMsg.remove();
      }
    });

    // Update placeholder on language change
    const langObserver = new MutationObserver(() => {
      updatePlaceholder();
    });
    langObserver.observe(body, { attributes: true, attributeFilter: ["lang"] });
  }

  // ===== INTERACTIVE CARD CLICK EFFECTS (Removed for performance) =====
  // Ripple effects removed to improve performance

  // ===== INTERACTIVE SKILL TAG CLICK (Removed for performance) =====
  // Skill tag click effects removed to improve performance
});

