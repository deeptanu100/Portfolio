document.addEventListener('DOMContentLoaded', () => {
  try {
    // DOM Element selectors
    const homeLink = document.getElementById('homeLink');
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const translateButton = document.getElementById('translate-button');
    const translateDropdown = document.getElementById('translate-dropdown');
    const rewriteButton = document.getElementById('rewrite-button');
    const aiModalOverlay = document.getElementById('ai-modal-overlay');
    const aiModal = document.getElementById('ai-modal');
    const aiModalClose = document.getElementById('ai-modal-close');
    
    let currentPage = 'landing';

    // --- TRANSLATION LOGIC ---
    function setLanguage(lang) {
        const langData = translations[lang] || translations.en;
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.dataset.translate;
            el.textContent = langData[key] || translations.en[key] || '';
        });
        localStorage.setItem('language', lang);
        translateDropdown.classList.remove('dropdown-visible');
    }

    function populateDropdown() {
        if (!translateDropdown) return;
        translateDropdown.innerHTML = '';
        for (const [code, name] of Object.entries(languages)) {
            const button = document.createElement('button');
            button.textContent = name;
            button.onclick = () => setLanguage(code);
            translateDropdown.appendChild(button);
        }
    }
    
    if (translateButton) {
        translateButton.addEventListener('click', (e) => {
            e.stopPropagation();
            translateDropdown.classList.toggle('dropdown-visible');
        });
    }
    
    document.addEventListener('click', (e) => {
        if (translateDropdown && !translateDropdown.contains(e.target) && !translateButton.contains(e.target)) {
            translateDropdown.classList.remove('dropdown-visible');
        }
    });

    // --- THEME LOGIC ---
    const applyTheme = (isDarkMode) => {
        document.body.classList.toggle('dark-mode', isDarkMode);
        if (sunIcon && moonIcon) {
            sunIcon.style.display = isDarkMode ? 'block' : 'none';
            moonIcon.style.display = isDarkMode ? 'none' : 'block';
        }
    };

    function update3DTheme(isDarkMode, isInstant = false) {
        if (!window.gsap || !crystal) return;

        const duration = isInstant ? 0 : 1.5;

        gsap.to(crystal.material, {
            opacity: isDarkMode ? 0.75 : 1.0,
            duration: duration,
            ease: "power3.inOut"
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDarkMode = !document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            applyTheme(isDarkMode);
            update3DTheme(isDarkMode, false);
        });
    }

    // --- PAGE NAVIGATION ---
    window.navigateTo = (pageId) => {
        document.getElementById(currentPage)?.classList.remove('active');
        
        triggerSpinAnimation();

        const newPageElement = document.getElementById(pageId);
        if (newPageElement) newPageElement.classList.add('active');
        
        currentPage = pageId;
        if(homeLink) homeLink.style.display = (pageId === 'landing' || pageId === 'overview') ? 'none' : 'block';
        
        const newTimelineEntries = newPageElement.querySelectorAll('.timeline-entry');
        if (newTimelineEntries.length > 0) {
            newTimelineEntries.forEach((entry, index) => {
                setTimeout(() => entry.classList.add('is-visible'), index * 150); 
            });
        }
        
        if (pageId === 'skills' || pageId === 'education') animateSkills();
        
        if (window.moveCameraTo) moveCameraTo(pageId);
        window.scrollTo(0, 0);
    };
    
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('overview');
        });
    }

    // --- ANIMATION LOGIC ---
    const triggerSpinAnimation = () => {
        if (window.gsap && crystal) {
            gsap.to(crystal.rotation, {
                y: crystal.rotation.y + (Math.PI * 2),
                duration: 1.2,
                ease: "power2.out",
            });
        }
    };

    const animateSkills = () => {
        document.querySelectorAll('.skill-item').forEach(item => {
            const circle = item.querySelector('.progress-circle');
            if (!circle) return;
            const percentage = item.dataset.percent || 0;
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;
            
            requestAnimationFrame(() => {
                setTimeout(() => {
                    const offset = circumference - (percentage / 100) * circumference;
                    circle.style.strokeDashoffset = offset;
                }, 200);
            });
        });
    };
    
    // --- AI REWRITE MODAL & API CALL ---
    if (aiModal) {
        const aiModalContent = aiModal.querySelector('.grid');
        const aiModalTitle = aiModal.querySelector('#ai-modal-title');
        const aiModalCloseContainer = aiModal.querySelector('.text-center');

        if(rewriteButton) rewriteButton.addEventListener('click', () => aiModalOverlay.style.display = 'flex');
        const closeModal = () => aiModalOverlay.style.display = 'none';
        if(aiModalClose) aiModalClose.addEventListener('click', closeModal);
        if(aiModalOverlay) aiModalOverlay.addEventListener('click', (e) => {
            if (e.target === aiModalOverlay) closeModal();
        });

        window.rewriteWithGemini = async (tone) => {
    const aboutTextElement = document.getElementById('about-text-content');
    const aiModal = document.getElementById('ai-modal');
    const aiModalContent = aiModal.querySelector('.grid');
    const aiModalTitle = aiModal.querySelector('#ai-modal-title');
    const aiModalCloseContainer = aiModal.querySelector('.text-center');
    const closeModal = () => document.getElementById('ai-modal-overlay').style.display = 'none';

    const currentLang = localStorage.getItem('language') || 'en';
    const langName = languages[currentLang] || 'English';
    const originalText = translations[currentLang]?.about_text || translations.en.about_text;

    // Show loading state
    aiModalContent.style.display = 'none';
    aiModalCloseContainer.style.display = 'none';
    aiModalTitle.textContent = 'Rewriting...';
    const spinner = document.createElement('div');
    spinner.className = 'flex justify-center items-center h-24';
    spinner.innerHTML = '<div class="spinner"></div>';
    aiModal.appendChild(spinner);

    try {
        // This now calls YOUR secure function, not Google's API directly
        const response = await fetch('/.netlify/functions/rewrite', {
            method: 'POST',
            body: JSON.stringify({ originalText, tone, langName })
        });

        if (!response.ok) {
            throw new Error(`Serverless function failed: ${response.statusText}`);
        }

        const result = await response.json();
        const newText = result.newText;

        if (newText) {
            aboutTextElement.textContent = newText;
            if (translations[currentLang]) {
                translations[currentLang].about_text = newText;
            }
        } else {
            throw new Error("Invalid or empty response from serverless function.");
        }

    } catch (error) {
        console.error('Error rewriting text:', error);
        aiModalTitle.textContent = 'Error! Please try again.';
    } finally {
        // Reset modal UI
        setTimeout(() => {
            aiModal.removeChild(spinner);
            aiModalContent.style.display = 'grid';
            aiModalCloseContainer.style.display = 'block';
            aiModalTitle.textContent = 'Choose a Tone';
            closeModal();
        }, 1000);
    }
};
    }

    // --- 3D BACKGROUND LOGIC ---
    let scene, camera, renderer, crystal;
    let targetPosition = new THREE.Vector3();
    let targetLookAt = new THREE.Vector3();
    const cameraPositions = {
        landing:    { pos: new THREE.Vector3(0, 0, 5), look: new THREE.Vector3(0, 0, 0) },
        overview:   { pos: new THREE.Vector3(0, 0, 5), look: new THREE.Vector3(0, 0, 0) },
        about:      { pos: new THREE.Vector3(0, 0, 5), look: new THREE.Vector3(0, 0, 0) },
        vision:     { pos: new THREE.Vector3(0, 0, 5), look: new THREE.Vector3(0, 0, 0) },
        education:  { pos: new THREE.Vector3(0, 0, 5), look: new THREE.Vector3(0, 0, 0) },
        experience: { pos: new THREE.Vector3(0, 0, 5), look: new THREE.Vector3(0, 0, 0) },
        awards:     { pos: new THREE.Vector3(0, 0, 5), look: new THREE.Vector3(0, 0, 0) },
        skills:     { pos: new THREE.Vector3(0, 0, 5), look: new THREE.Vector3(0, 0, 0) },
        process:    { pos: new THREE.Vector3(0, 0, 5), look: new THREE.Vector3(0, 0, 0) },
        projects:   { pos: new THREE.Vector3(0, 0, 5), look: new THREE.Vector3(0, 0, 0) },
        contact:    { pos: new THREE.Vector3(0, 0, 5), look: new THREE.Vector3(0, 0, 0) }
    };

    const init3D = () => {
        const bgCanvas = document.getElementById('bg-canvas');
        if (!bgCanvas || !window.THREE) return;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ canvas: bgCanvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const crystalGeometry = new THREE.IcosahedronGeometry(2.5, 0);
        const crystalMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
        crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
        crystal.material.transparent = true; // Enable opacity changes
        scene.add(crystal);
        
        const isInitiallyDark = document.body.classList.contains('dark-mode');
        update3DTheme(isInitiallyDark, true);

        const initialPos = cameraPositions.landing;
        camera.position.copy(initialPos.pos);
        targetPosition.copy(initialPos.pos);
        targetLookAt.copy(initialPos.look);
        
        window.addEventListener('resize', onWindowResize, false);
        animate3D();
    };

    const animate3D = () => {
        requestAnimationFrame(animate3D);
        if (!renderer || !crystal) return;
        crystal.rotation.y += 0.002;
        crystal.rotation.x += 0.001;
        camera.position.lerp(targetPosition, 0.05);
        camera.lookAt(targetLookAt.lerp(camera.position, -0.05));
        renderer.render(scene, camera);
    };

    const onWindowResize = () => {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.moveCameraTo = (pageId) => {
        const bgCanvas = document.getElementById('bg-canvas');
        if(bgCanvas) bgCanvas.style.opacity = (pageId === 'landing') ? 1 : 0.25;
        const newTarget = cameraPositions[pageId] || cameraPositions.landing;
        targetPosition.copy(newTarget.pos);
        targetLookAt.copy(newTarget.look);
    };

    // --- SOCIAL FEED LOGIC ---
    function buildSocialFeed() {
        const feedScroll = document.getElementById('social-feed-scroll');
        if (!feedScroll || typeof socialFeedData === 'undefined') return;
        socialFeedData.forEach(item => {
            const aspectRatioClass = 'aspect-' + item.aspectRatio.replace(':', '-');
            const itemHTML = `
                <div class="social-feed-item" data-post-date="${item.postDate}">
                    <span class="new-tag">New</span>
                    <a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer" class="feed-item-thumbnail ${aspectRatioClass}">
                        <img src="${item.thumbnailUrl}" alt="${item.description}" loading="lazy">
                    </a>
                    <div class="feed-item-info" 
                         data-platform="${item.platform}"
                         data-source-url="${item.sourceUrl}"
                         data-embed-url="${item.embedUrl}" 
                         data-aspect-ratio="${item.aspectRatio}">
                        <p>${item.description}</p>
                        <div class="platform-logo">
                            ${platformLogos[item.platform] || ''}
                        </div>
                    </div>
                </div>
            `;
            feedScroll.innerHTML += itemHTML;
        });
    }

    function handleNewTags() {
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        document.querySelectorAll('.social-feed-item[data-post-date]').forEach(item => {
            const postDate = new Date(item.dataset.postDate);
            if (postDate >= fiveDaysAgo) {
                const newTag = item.querySelector('.new-tag');
                if (newTag) newTag.style.display = 'block';
            }
        });
    }

    function handleLightbox() {
        const overlay = document.getElementById('lightbox-overlay');
        const content = document.getElementById('lightbox-content');
        const closeBtn = document.getElementById('lightbox-close');
        const feedScroll = document.getElementById('social-feed-scroll');
        if (!overlay || !content || !closeBtn || !feedScroll) return;
        feedScroll.addEventListener('click', (e) => {
            const infoBox = e.target.closest('.feed-item-info');
            if (infoBox) {
                const platform = infoBox.dataset.platform;
                if (platform === 'insta') {
                    const sourceUrl = infoBox.dataset.sourceUrl;
                    window.open(sourceUrl, '_blank', 'noopener,noreferrer');
                } else {
                    const embedUrl = infoBox.dataset.embedUrl;
                    const aspectRatio = infoBox.dataset.aspectRatio;
                    content.style.aspectRatio = aspectRatio.replace(':', ' / ');
                    content.innerHTML = `<iframe src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                    overlay.classList.add('visible');
                }
            }
        });
        const closeLightbox = () => {
            overlay.classList.remove('visible');
            content.innerHTML = '';
        };
        closeBtn.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
    }
    
    let autoplayInterval = null;
    const stopAutoplay = () => clearInterval(autoplayInterval);

    function handleFeedAutoplay() {
        const feedScroll = document.getElementById('social-feed-scroll');
        if (!feedScroll) return;
        const startAutoplay = () => {
            stopAutoplay();
            autoplayInterval = setInterval(() => {
                const item = feedScroll.querySelector('.social-feed-item');
                if (!item) return;
                const scrollAmount = item.offsetWidth + parseFloat(getComputedStyle(feedScroll).gap);
                if (feedScroll.scrollLeft >= (feedScroll.scrollWidth - feedScroll.clientWidth - 1)) {
                    feedScroll.style.scrollBehavior = 'auto';
                    feedScroll.scrollLeft = 0;
                    feedScroll.style.scrollBehavior = 'smooth';
                } else {
                    feedScroll.scrollLeft += scrollAmount;
                }
            }, 3000);
        };
        setTimeout(() => {
            feedScroll.style.scrollBehavior = 'smooth';
            startAutoplay();
        }, 500);
        feedScroll.addEventListener('mouseenter', stopAutoplay);
        feedScroll.addEventListener('mouseleave', startAutoplay);
    }

    function handleManualScroll() {
        const feedScroll = document.getElementById('social-feed-scroll');
        const prevBtn = document.getElementById('feed-prev-btn');
        const nextBtn = document.getElementById('feed-next-btn');
        if (!feedScroll || !prevBtn || !nextBtn) return;
        const scrollByItem = () => {
            const item = feedScroll.querySelector('.social-feed-item');
            if (!item) return 0;
            return item.offsetWidth + parseFloat(getComputedStyle(feedScroll).gap);
        };
        nextBtn.addEventListener('click', () => {
            stopAutoplay();
            feedScroll.scrollLeft += scrollByItem();
        });
        prevBtn.addEventListener('click', () => {
            stopAutoplay();
            feedScroll.scrollLeft -= scrollByItem();
        });
    }

    // --- INITIALIZATION ---
    function init() {
        populateDropdown();
        const savedLang = localStorage.getItem('language') || 'en';
        setLanguage(savedLang);
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';

        applyTheme(savedDarkMode);
        init3D(); 

        document.querySelectorAll('.nav-button, .ai-button, .top-corner-button').forEach(button => {
            const addActiveClass = () => button.classList.add('button-active');
            const removeActiveClass = () => button.classList.remove('button-active');
            button.addEventListener('mousedown', addActiveClass);
            button.addEventListener('mouseup', removeActiveClass);
            button.addEventListener('mouseleave', removeActiveClass);
            button.addEventListener('touchstart', addActiveClass, { passive: true });
            button.addEventListener('touchend', removeActiveClass);
        });

        buildSocialFeed();
        handleNewTags();
        handleLightbox();
        handleFeedAutoplay();
        handleManualScroll();
    }

    init();

  } catch (error) {
    console.error("An error occurred during portfolio initialization:", error);
    document.body.innerHTML = '<div style="text-align: center; padding: 50px; font-family: sans-serif;"><h1>Oops!</h1><p>Something went wrong. Please try refreshing the page.</p></div>';
  }
});