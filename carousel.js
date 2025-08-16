function initCarousel() {
    gsap.registerPlugin(ScrollToPlugin);

    const feedScroll = document.getElementById('social-feed-scroll');
    if (!feedScroll) return;

    let items = Array.from(feedScroll.children);
    if (items.length <= 3) return;

    const CLONE_COUNT = 3;
    let autoplayTween = null;
    let currentIndex;

    // --- 1. Setup for Infinite Loop ---
    const setupInfiniteScroll = () => {
        for (let i = 0; i < CLONE_COUNT; i++) {
            const index = items.length - 1 - i;
            const clone = items[index].cloneNode(true);
            clone.classList.add('clone');
            feedScroll.insertBefore(clone, items[0]);
        }
        for (let i = 0; i < CLONE_COUNT; i++) {
            const clone = items[i].cloneNode(true);
            clone.classList.add('clone');
            feedScroll.appendChild(clone);
        }
        items = Array.from(feedScroll.children);
    };

    // --- 2. Dynamic 3D Update Function ---
    const updateCarouselVisuals = () => {
        const scrollCenter = feedScroll.scrollLeft + feedScroll.offsetWidth / 2;
        items.forEach(item => {
            const itemCenter = item.offsetLeft + item.offsetWidth / 2;
            const distance = scrollCenter - itemCenter;
            
            const scale = Math.max(0.7, 1 - Math.abs(distance) / feedScroll.offsetWidth);
            const rotation = -distance / 30;
            const translateZ = -Math.abs(distance) / 3;

            item.style.transform = `translateZ(${translateZ}px) rotateY(${rotation}deg) scale(${scale})`;
        });
    };

    // --- 3. High-Performance Scroll Listener ---
    let ticking = false;
    feedScroll.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateCarouselVisuals();
                ticking = false;
            });
            ticking = true;
        }
    });

    // --- 4. Core Scrolling and Looping Logic ---
    const scrollToItem = (index, duration = 0.8) => {
        currentIndex = index;
        const targetItem = items[currentIndex];
        if (!targetItem) return;

        // The key fix: Calculate the exact position to CENTER the item
        const targetScrollLeft = targetItem.offsetLeft - (feedScroll.offsetWidth / 2) + (targetItem.offsetWidth / 2);

        gsap.to(feedScroll, {
            duration: duration,
            scrollTo: { x: targetScrollLeft, autoKill: false },
            ease: 'power3.inOut',
            onComplete: () => {
                const realItemsCount = items.length - CLONE_COUNT * 2;
                let needsJump = false;
                if (currentIndex >= items.length - CLONE_COUNT) {
                    currentIndex -= realItemsCount;
                    needsJump = true;
                }
                if (currentIndex < CLONE_COUNT) {
                    currentIndex += realItemsCount;
                    needsJump = true;
                }

                if (needsJump) {
                    const newTargetItem = items[currentIndex];
                    const newScrollLeft = newTargetItem.offsetLeft - (feedScroll.offsetWidth / 2) + (newTargetItem.offsetWidth / 2);
                    gsap.set(feedScroll, { scrollTo: { x: newScrollLeft } });
                }
            }
        });
    };

    // --- 5. Autoplay & Manual Navigation ---
    const stopAutoplay = () => {
        if (autoplayTween) autoplayTween.kill();
    };

    const startAutoplay = () => {
        stopAutoplay();
        autoplayTween = gsap.delayedCall(3, () => {
            scrollToItem(currentIndex + 1);
            startAutoplay(); // Loop
        });
    };

    const handleManualScroll = () => {
        const prevBtn = document.getElementById('feed-prev-btn');
        const nextBtn = document.getElementById('feed-next-btn');
        if (!prevBtn || !nextBtn) return;
        
        nextBtn.addEventListener('click', () => {
            stopAutoplay();
            scrollToItem(currentIndex + 1);
        });
        prevBtn.addEventListener('click', () => {
            stopAutoplay();
            scrollToItem(currentIndex - 1);
        });
    };

    // --- Initialization ---
    setupInfiniteScroll();
    updateCarouselVisuals(); 
    handleManualScroll(); 

    window.addEventListener('load', () => {
        // Instantly center the first "real" item on load
        scrollToItem(CLONE_COUNT, 0); 
        
        // A short delay before starting autoplay to ensure visuals are updated
        setTimeout(() => {
            startAutoplay();
        }, 500); 
    });

    feedScroll.addEventListener('mouseenter', stopAutoplay);
    feedScroll.addEventListener('mouseleave', startAutoplay);
}