document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    const mainElement = document.querySelector('main');
    
    const langToggles = [
        document.getElementById('lang-toggle-desktop'),
        document.getElementById('lang-toggle-mobile')
    ];
    const typingElement = document.getElementById('typing-effect');
    
    const enTitles = ["Intern Web Developer", "C# & .NET Learner", "Vovinam Athlete"];
    const viTitles = ["Thực tập sinh Web", "Người học C# & .NET", "Võ sinh Vovinam"];
    let currentTitles = enTitles; 

    const savedLang = localStorage.getItem('lang') || 'en';
    body.setAttribute('lang', savedLang);
    const isVietnamese = (savedLang === 'vi');
    langToggles.forEach(toggle => {
        if(toggle) toggle.checked = isVietnamese;
    });
    currentTitles = isVietnamese ? viTitles : enTitles;

    langToggles.forEach(toggle => {
        if(toggle) {
            toggle.addEventListener('change', () => {
                const newLang = toggle.checked ? 'vi' : 'en';
                body.setAttribute('lang', newLang);
                localStorage.setItem('lang', newLang);
                currentTitles = toggle.checked ? viTitles : enTitles;
                
                langToggles.forEach(otherToggle => {
                    if (otherToggle && otherToggle !== toggle) {
                        otherToggle.checked = toggle.checked;
                    }
                });

                resetTypingEffect(); 
                resetTerminalWelcome(); 
                initFocusAndScrollSpy(); 
            });
        }
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
                typeTimeout = setTimeout(() => { isDeleting = true; }, 2000);
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
        if(typingElement) { 
             typingElement.textContent = '';
        }
        type(); 
    }
    if (typingElement) { 
        resetTypingEffect(); 
    }

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-dot-outline');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        if (cursorDot) {
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        }
        if (cursorOutline) {
            cursorOutline.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        }
        requestAnimationFrame(updateCursor);
    }
    if (cursorDot && cursorOutline) {
        updateCursor();
    }
    
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            heroSection.style.setProperty('--mouse-x', `${x}px`);
            heroSection.style.setProperty('--mouse-y', `${y}px`);
        });
    }

    const progressBar = document.getElementById('progress-bar');
    const mainNav = document.getElementById('main-nav');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        
        if (progressBar) { 
            progressBar.style.width = scrollPercent + '%';
        }

        if (mainNav) {
            if (scrollTop > 50) {
                mainNav.classList.add('scrolled');
            } else {
                mainNav.classList.remove('scrolled');
            }
        }
    });

    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                 entry.target.classList.remove('visible');
            }
        });
    }, { 
        root: null, 
        threshold: 0.15 
    });
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    const skillsSection = document.getElementById('skills');
    const skillTags = document.querySelectorAll('.skill-tag');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillTags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.classList.add('is-visible');
                    }, index * 100); 
                });
                 skillObserver.unobserve(entry.target);
            }
        });
    }, { 
        root: null, 
        threshold: 0.2
    });

    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }

    const projectCards = document.querySelectorAll('.project-card');
    const tiltStrength = 15; 
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - rect.width / 2;
            const mouseY = e.clientY - rect.top - rect.height / 2;
            const rotateY = (mouseX / (rect.width / 2)) * tiltStrength;
            const rotateX = -(mouseY / (rect.height / 2)) * tiltStrength;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    const terminalWindow = document.getElementById('terminal-window');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');

    if (terminalWindow && terminalOutput && terminalInput) {
        
        const linkCommands = {
            'linkedin': 'https://www.linkedin.com/in/nguyen-cao-qui/',
            'github': 'https://github.com/quinc-fptu',
            'gitlab': 'https://gitlab.com/quinc.ce190986',
            'facebook': 'https://facebook.com/imcqsngx/' 
        };
        
        const virtualFiles = {
            'about.txt': {
                en: () => Array.from(document.querySelectorAll('#about .summary p[data-lang="en"]')).map(p => p.textContent).join('\n\n'),
                vi: () => Array.from(document.querySelectorAll('#about .summary p[data-lang="vi"]')).map(p => p.textContent).join('\n\n')
            },
            'projects.md': {
                en: () => "My Projects:\n" + Array.from(document.querySelectorAll('#projects .project-card')).map((card, i) => `# ${i+1}. ${card.querySelector('h3[data-lang="en"]').textContent}`).join('\n'),
                vi: () => "Dự án của tôi:\n" + Array.from(document.querySelectorAll('#projects .project-card')).map((card, i) => `# ${i+1}. ${card.querySelector('h3[data-lang="vi"]').textContent}`).join('\n')
            },
            'skills.json': {
                en: () => {
                    const skills = {};
                    document.querySelectorAll('#skills .col-lg-4').forEach(col => {
                        const colTitle = col.querySelector('h3[data-lang="en"]').textContent.trim();
                        const categories = {};
                        col.querySelectorAll('.skill-category-card').forEach(cat => {
                            const titleEl = cat.querySelector('strong[data-lang="en"]');
                            if (titleEl) {
                                const title = titleEl.textContent.replace(':', '');
                                const tags = Array.from(cat.querySelectorAll('.skill-tag')).map(tag => tag.querySelector('span[data-lang="en"]')?.textContent.trim() || tag.textContent.trim());
                                categories[title] = tags.filter(Boolean);
                            }
                        });
                        skills[colTitle] = categories;
                    });
                    return JSON.stringify(skills, null, 2);
                },
                vi: () => {
                    const skills = {};
                    document.querySelectorAll('#skills .col-lg-4').forEach(col => {
                        const colTitle = col.querySelector('h3[data-lang="vi"]').textContent.trim();
                        const categories = {};
                        col.querySelectorAll('.skill-category-card').forEach(cat => {
                            const titleEl = cat.querySelector('strong[data-lang="vi"]');
                            if(titleEl) {
                                const title = titleEl.textContent.replace(':', '');
                                const tags = Array.from(cat.querySelectorAll('.skill-tag')).map(tag => tag.querySelector('span[data-lang="vi"]')?.textContent.trim() || tag.textContent.trim());
                                categories[title] = tags.filter(Boolean);
                            }
                        });
                        skills[colTitle] = categories;
                    });
                    return JSON.stringify(skills, null, 2);
                }
            }
        };

        const helpCommand = {
            'en': '--- File System ---\n' +
                '  <span class="terminal-help-cmd">ls</span>          - List files\n' +
                '  <span class="terminal-help-cmd">cat [file]</span>    - Read file content (e.g., cat about.txt)\n' +
                '--- Quick Links ---\n' +
                '  <span class="terminal-help-cmd">linkedin</span>      - Open my LinkedIn profile\n' +
                '  <span class="terminal-help-cmd">github</span>        - Open my GitHub profile\n' +
                '  <span class="terminal-help-cmd">gitlab</span>        - Open my GitLab profile\n' +
                '  <span class="terminal-help-cmd">facebook</span>      - Open my Facebook profile\n' +
                '--- Utilities ---\n' +
                '  <span class="terminal-help-cmd">clear</span>         - Clear the terminal',
            'vi': '--- Hệ thống Tệp ---\n' +
                '  <span class="terminal-help-cmd">ls</span>          - Liệt kê tệp\n' +
                '  <span class="terminal-help-cmd">cat [tên tệp]</span> - Đọc nội dung tệp (ví dụ: cat about.txt)\n' +
                '--- Liên kết nhanh ---\n' +
                '  <span class="terminal-help-cmd">linkedin</span>      - Mở trang LinkedIn\n' +
                '  <span class="terminal-help-cmd">github</span>        - Mở trang GitHub\n' +
                '  <span class="terminal-help-cmd">gitlab</span>        - Mở trang GitLab\n' +
                '  <span class="terminal-help-cmd">facebook</span>      - Mở trang Facebook\n' +
                '--- Tiện ích ---\n' +
                '  <span class="terminal-help-cmd">clear</span>         - Xóa màn hình'
        };

        function appendOutput(htmlContent) {
            terminalOutput.innerHTML += `<div class="terminal-line">${htmlContent}</div>`;
            terminalWindow.scrollTop = terminalWindow.scrollHeight;
        }

        function executeCommand(command) {
            const lang = document.body.getAttribute('lang') || 'en';
            const parts = command.toLowerCase().trim().split(' ').filter(Boolean);
            const cmd = parts[0];
            const args = parts.slice(1);

            appendOutput(`<span class="terminal-prompt">~$</span> <span class="terminal-command">${command}</span>`);

            if (cmd === 'clear') {
                terminalOutput.innerHTML = '';
            } else if (cmd === 'help') {
                appendOutput(helpCommand[lang]);
            } else if (cmd === 'qisngx') {
                document.body.classList.toggle('rainbow-mode');
            } else if (linkCommands[cmd]) {
                const url = linkCommands[cmd];
                appendOutput(`Opening ${cmd}...`);
                window.open(url, '_blank');
            } else if (cmd === 'ls') {
                const files = Object.keys(virtualFiles).join('   ');
                appendOutput(files);
            } else if (cmd === 'cat') {
                const filename = args[0];
                if (!filename) {
                    appendOutput(`<span class="terminal-error">Error: Missing filename. Usage: cat [filename]</span>`);
                } else if (virtualFiles[filename]) {
                    const content = virtualFiles[filename][lang]();
                    appendOutput(content.replace(/\n/g, '<br>'));
                } else {
                    appendOutput(`<span class="terminal-error">Error: File not found: ${filename}</span>`);
                }
            } else if (cmd) {
                appendOutput(`<span class="terminal-error">Error: Command not found: ${cmd}. Type 'help' for commands.</span>`);
            }
        }

        function initTerminal() {
            const lang = document.body.getAttribute('lang') || 'en';
            const welcome = (lang === 'vi') 
                ? "Gõ 'help' để xem các lệnh. Thử gõ 'ls'!"
                : "Type 'help' for commands. Try typing 'ls'!";
            appendOutput(welcome);
        }

        window.resetTerminalWelcome = function() {
            terminalOutput.innerHTML = '';
            initTerminal();
        }

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                executeCommand(terminalInput.value);
                terminalInput.value = '';
            }
        });

        terminalWindow.addEventListener('click', () => {
            terminalInput.focus();
        });

        const redBtn = document.querySelector('.btn-red');
        const yellowBtn = document.querySelector('.btn-yellow');
        const greenBtn = document.querySelector('.btn-green');
        const terminalTitle = document.querySelector('.terminal-title');

        let clickedButtons = new Set();
        let hintRevealed = false;

        const allButtons = [redBtn, yellowBtn, greenBtn];

        allButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    if (hintRevealed) return;

                    const color = e.target.className.match(/btn-(red|yellow|green)/)[1];
                    clickedButtons.add(color);
                    
                    e.target.style.transform = 'scale(0.8)';
                    setTimeout(() => { e.target.style.transform = 'scale(1)'; }, 150);

                    if (clickedButtons.size === 3) {
                        setTimeout(() => {
                            if (terminalTitle) {
                                terminalTitle.textContent = 'QisNgx@secretcode';
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
        const sections = document.querySelectorAll('main > section[id]');
        const navLinks = document.querySelectorAll('#navbarNav .nav-link');
        
        const observerOptions = {
            root: null,
            rootMargin: '-35% 0px -35% 0px',
            threshold: 0 
        };

        focusAndScrollSpyObserver = new IntersectionObserver((entries) => {
            const focusedEntry = entries.find(entry => entry.isIntersecting);

            if (focusedEntry) {
                mainElement.classList.add('has-focus');
                
                const id = focusedEntry.target.getAttribute('id');
                const lang = document.body.getAttribute('lang') || 'en';

                sections.forEach(section => {
                    section.classList.toggle('is-focused', section === focusedEntry.target);
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}` && link.getAttribute('data-lang') === lang) {
                        link.classList.add('active');
                    }
                });
            } else {
                mainElement.classList.remove('has-focus');
                sections.forEach(section => {
                    section.classList.remove('is-focused');
                });
            }
        }, observerOptions);
        
        sections.forEach(sec => {
            if (sec.getAttribute('id')) {
                 focusAndScrollSpyObserver.observe(sec);
            }
        });
    }
    initFocusAndScrollSpy();

    setTimeout(() => {
        if (window.firebase) {
            const { db, doc, getDoc, updateDoc, increment } = window.firebase;
            
            const upvoteButton = document.getElementById('upvote-button');
            const voteCountSpan = document.getElementById('vote-count');
            
            const voteDocRef = doc(db, "votes", "portfolio");

            async function getVoteCount() {
                try {
                    const docSnap = await getDoc(voteDocRef);
                    if (docSnap.exists()) {
                        const count = docSnap.data().count;
                        voteCountSpan.textContent = count;
                    } else {
                        console.log("Không tìm thấy document vote!");
                    }
                } catch (e) {
                    console.error("Lỗi khi lấy vote: ", e);
                }
            }

            async function incrementVote() {
                upvoteButton.disabled = true;

                try {
                    await updateDoc(voteDocRef, {
                        count: increment(1)
                    });
                    
                    localStorage.setItem('hasVotedPortfolio', 'true');
                    
                    await getVoteCount(); 
                    
                    if (window.confetti) {
                        const rect = upvoteButton.getBoundingClientRect();
                        const origin = {
                            x: (rect.left + rect.width / 2) / window.innerWidth,
                            y: (rect.top + rect.height / 2) / window.innerHeight
                        };
                        confetti({
                            particleCount: 150,
                            spread: 90,
                            origin: origin,
                            colors: ['#00aaff', '#ffffff', '#0088cc']
                        });
                    }
                    
                } catch (e) {
                    console.error("Lỗi khi update vote: ", e);
                    upvoteButton.disabled = false; 
                    localStorage.removeItem('hasVotedPortfolio');
                }
            }

            function checkVoteStatus() {
                if (localStorage.getItem('hasVotedPortfolio') === 'true') {
                    upvoteButton.disabled = true;
                } else {
                    upvoteButton.addEventListener('click', incrementVote);
                }
            }

            getVoteCount();
            checkVoteStatus();
            
        } else {
            console.error("Firebase chưa được khởi tạo. Hãy kiểm tra lại `firebaseConfig` trong index.html.");
        }
    }, 500); 

    const magneticButtons = document.querySelectorAll('.magnetic-btn');
    const magneticStrength = 0.4; 

    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * magneticStrength}px, ${y * magneticStrength}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
    
    const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-tag');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorOutline) cursorOutline.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            if (cursorOutline) cursorOutline.classList.remove('cursor-hover');
        });
    });

    function initKonamiCode() {
        const konamiCode = ['q', 'i', 's', 'n', 'g', 'x'];
        let konamiPosition = 0;
        
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === konamiCode[konamiPosition]) {
                konamiPosition++;
                if (konamiPosition === konamiCode.length) {
                    document.body.classList.toggle('rainbow-mode');
                    konamiPosition = 0;
                }
            } else {
                konamiPosition = 0;
            }
        });
    }
    initKonamiCode();

});