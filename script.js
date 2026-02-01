// Detect if we're inside an iframe (child page)
const IS_IFRAME_CHILD = new URLSearchParams(window.location.search).has('iframe');

// Mobile-only iframe wrapper to isolate scrolling from browser URL bar
(function enableMobileIframe() {
  // Prevent infinite nesting - if already in iframe, don't create another
  if (IS_IFRAME_CHILD) return;
  
  const isMobile =
    window.innerWidth <= 768 &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (!isMobile) return; // desktop untouched

  const shell = document.getElementById('mobile-iframe-shell');
  const iframe = document.getElementById('mobile-iframe');
  if (!shell || !iframe) return;

  // Hide original page visually (but keep DOM intact)
  document.body.classList.add('iframe-mode');

  // Load SAME page inside iframe (query param prevents infinite nesting)
  const url = new URL(window.location.href);
  url.searchParams.set('iframe', '1');
  iframe.src = url.toString();

  shell.style.display = 'block';

  // Stop further execution of scroll logic in parent page
  window.__IFRAME_PARENT__ = true;
})();

// Global brand element reference
const brandEl = document.getElementById('svg-brand');

// === CANONICAL HEIGHT: Capture ONCE on load, ignore URL bar completely ===
const APP_HEIGHT = Math.round(window.innerHeight);
document.documentElement.style.setProperty('--app-height', APP_HEIGHT + 'px');

// === LOADER: Disable scroll until layout stabilizes ===
let loaderFinished = false;
document.body.classList.add('loading');

document.addEventListener('DOMContentLoaded', function() {
    // Spacer height is now set in CSS to prevent layout shifts
    // Height: 3600px = (maxZ 200 * factor 15) + 20% buffer
    // This ensures hero fades out before reaching the next section
    
    // Hero elements for SVG sizing (ruler width calculation)
    const hero = document.querySelector('.hero');
    const firstName = document.querySelector('.first-name');
    const lastName = document.querySelector('.last-name');
    const divider = document.querySelector('.hero-divider');
    const heroTitle = document.querySelector('.hero-title');
    
    // Function to calculate ruler width based on text width (simplified - no scroll updates)
    function calculateRulerWidth() {
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth <= 768 && !IS_IFRAME_CHILD;
        
        if (!firstName || !lastName || !divider || !heroTitle) return;
        
        // Wait for fonts to load
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function() {
                setRulerWidth(isMobile);
            });
        } else {
            // Fallback if fonts API not available
            setTimeout(function() {
                setRulerWidth(isMobile);
            }, 100);
        }
    }
    
    function setRulerWidth(isMobile) {
        const divider = document.querySelector('.hero-divider');
        
        if (!brandEl || !divider) return;
        
        const brandRect = brandEl.getBoundingClientRect();
        const wrapperRect = brandEl.parentElement.getBoundingClientRect();
        
        // Width = 85% of full name width
        const rulerWidth = brandRect.width * 0.85;
        
        // Center ruler exactly under name
        const rulerLeft =
            (brandRect.left - wrapperRect.left) +
            (brandRect.width / 2) -
            (rulerWidth / 2);
        
        divider.style.width = `${rulerWidth}px`;
        divider.style.marginLeft = `${rulerLeft}px`;
    }
    
    // Calculate ruler width on load and resize
    calculateRulerWidth();
    
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            calculateRulerWidth();
        }, 100);
    });
    
    // Cool scroll animations for sections from About onwards
    const animationObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            } else {
                entry.target.classList.remove('animate-in');
            }
        });
    }, animationObserverOptions);

    // Animate section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        if (title) {
            title.classList.add('fade-up');
            animationObserver.observe(title);
        }
    });

    // About section: no fade animation (paragraphs stay visible)

    // Animate contact info
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        contactInfo.classList.add('fade-up');
        animationObserver.observe(contactInfo);
    }

    // Animate contact items
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item) => {
        if (item) {
            animationObserver.observe(item);
        }
    });

    // Animate contact description
    const contactDescription = document.querySelector('.contact-description');
    if (contactDescription) {
        contactDescription.classList.add('fade-up');
        animationObserver.observe(contactDescription);
    }

    console.log('Portfolio website loaded successfully!');
    
    // Build SVG name and sync sizes
    function buildSvgName() {
        const base = document.querySelector('.base');
        const base2 = document.querySelector('.base2');
        
        if (!base || !base2) return;
        
        // Clear existing content
        base.innerHTML = '';
        base2.innerHTML = '';
        
        // Create first name letters - each in its own DIV wrapper
        const letters1 = ['I', 'S', 'H', 'A', 'N'];
        const depthValues1 = [0.1, 0.8, 0.3, 0.9, 0.2]; // ISHAN - staggered highs and lows
        // Randomized speeds for different pattern
        const speedValues1 = [0.4, 0.8, 0.6, 0.4, 0.9]; // ISHAN - randomized z-axis speeds
        letters1.forEach((letter, index) => {
            // Create DIV wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'letter-wrapper';
            wrapper.setAttribute('data-speed', speedValues1[index].toString());
            
            // Create SVG
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'my_svg');
            svg.setAttribute('viewBox', '0 0 25 25');
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            
            // Create text element
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', '50%');
            text.setAttribute('y', '50%');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-family', 'Bruno Ace');
            
            // Create tspan with letter
            const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspan.textContent = letter;
            tspan.setAttribute('class', `letter_${index + 1} normal_letter`);
            tspan.setAttribute('stroke-width', '2.0');
            tspan.setAttribute('data-depth', depthValues1[index].toString());
            
            text.appendChild(tspan);
            svg.appendChild(text);
            wrapper.appendChild(svg);
            base.appendChild(wrapper);
        });
        
        // Create last name letters - each in its own DIV wrapper
        const letters2 = ['M', 'E', 'H', 'T', 'A'];
        const depthValues2 = [0.7, 0.2, 0.85, 0.3, 0.95]; // MEHTA - staggered highs and lows
        // Randomized speeds for different pattern
        const speedValues2 = [0.6, 0.4, 0.9, 0.4, 0.8]; // MEHTA - randomized z-axis speeds
        letters2.forEach((letter, index) => {
            // Create DIV wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'letter-wrapper';
            wrapper.setAttribute('data-speed', speedValues2[index].toString());
            
            // Create SVG
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'my_svg');
            svg.setAttribute('viewBox', '0 0 25 25');
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            
            // Create text element
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', '50%');
            text.setAttribute('y', '50%');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-family', 'Bruno Ace');
            
            // Create tspan with letter
            const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspan.textContent = letter;
            tspan.setAttribute('class', `letter_${index + 6} normal_letter`);
            tspan.setAttribute('stroke-width', '2.0');
            tspan.setAttribute('data-depth', depthValues2[index].toString());
            
            text.appendChild(tspan);
            svg.appendChild(text);
            wrapper.appendChild(svg);
            base2.appendChild(wrapper);
        });
    }
    
    function syncSvgSizes() {
        const firstName = document.querySelector('.first-name');
        const lastName = document.querySelector('.last-name');
        const base = document.querySelector('.base');
        const base2 = document.querySelector('.base2');
        const heroTitle = document.querySelector('.hero-title');
        
        if (!firstName || !lastName || !base || !base2 || !heroTitle || !brandEl) return;
        
        // Reset transforms for measurement
        const originalTransform1 = firstName.style.transform;
        const originalTransform2 = lastName.style.transform;
        firstName.style.transform = 'translateX(0)';
        lastName.style.transform = 'translateX(0)';
        
        // Force reflow
        void brandEl.offsetHeight;
        
        // Get font properties for accurate measurement
        const firstNameStyle = window.getComputedStyle(firstName);
        const lastNameStyle = window.getComputedStyle(lastName);
        const fontFamily = 'Bruno Ace';
        
        // Helper function to measure letter positions from actual text
        function measureLetterPositions(textElement, letters) {
            // Get all computed styles that affect text rendering
            const computed = window.getComputedStyle(textElement);
            
            // Create a hidden container that matches the text element exactly
            const hiddenContainer = document.createElement('span');
            hiddenContainer.style.visibility = 'hidden';
            hiddenContainer.style.position = 'absolute';
            hiddenContainer.style.left = '-9999px';
            hiddenContainer.style.top = '-9999px';
            hiddenContainer.style.fontFamily = computed.fontFamily;
            hiddenContainer.style.fontSize = computed.fontSize;
            hiddenContainer.style.fontWeight = computed.fontWeight;
            hiddenContainer.style.fontStyle = computed.fontStyle;
            hiddenContainer.style.letterSpacing = computed.letterSpacing;
            hiddenContainer.style.textTransform = computed.textTransform;
            hiddenContainer.style.whiteSpace = 'nowrap';
            hiddenContainer.style.display = 'inline-block';
            hiddenContainer.style.lineHeight = computed.lineHeight;
            
            // Create individual letter spans
            const letterSpans = letters.map((letter) => {
                const span = document.createElement('span');
                span.textContent = letter;
                span.style.display = 'inline-block';
                hiddenContainer.appendChild(span);
                return span;
            });
            
            document.body.appendChild(hiddenContainer);
            void hiddenContainer.offsetWidth; // Force reflow
            
            // Measure positions and sizes
            const containerRect = hiddenContainer.getBoundingClientRect();
            const positions = letterSpans.map((span) => {
                const rect = span.getBoundingClientRect();
                return {
                    left: rect.left - containerRect.left,
                    width: rect.width,
                    height: rect.height
                };
            });
            
            hiddenContainer.remove();
            return positions;
        }
        
        // Size each letter wrapper in a container using measured positions
        function sizeContainer(container, isFirstName, screenWidth) {
            const wrappers = Array.from(container.querySelectorAll('.letter-wrapper'));
            const textElement = isFirstName ? firstName : lastName;
            const baseHeight = isFirstName ? firstName.offsetHeight : lastName.offsetHeight;
            
            // Get letters from wrappers
            const letters = wrappers.map(wrapper => {
                const tspan = wrapper.querySelector('tspan');
                return tspan ? tspan.textContent.trim() : '';
            });
            
            // Measure exact positions from hidden text
            const positions = measureLetterPositions(textElement, letters);
            
            // Find the maximum height and width across all letters for consistent sizing
            const maxHeight = Math.max(...positions.map(p => p.height), baseHeight);
            const maxWidth = Math.max(...positions.map(p => p.width));
            
            // Use a consistent viewBox size for all letters based on max dimensions
            // This ensures uniform scaling across all letters
            const viewBoxHeight = 100;
            const viewBoxWidth = 100; // Use square viewBox for simplicity
            
            // Calculate font-size that will make text fill maxHeight consistently
            // When SVG height = maxHeight px and viewBox height = viewBoxHeight,
            // we want font-size in viewBox units such that text height = maxHeight
            // Font-size in viewBox units should be approximately viewBoxHeight * 0.85
            // to account for font metrics (ascenders/descenders)
            const baseFontSize = viewBoxHeight * 0.85;
            
            // Apply positions and sizes
            wrappers.forEach((wrapper, index) => {
                const svg = wrapper.querySelector('svg');
                const textEl = svg ? svg.querySelector('text') : null;
                const pos = positions[index];
                
                if (!pos || !svg) return;
                
                // Use measured width for wrapper to maintain correct spacing
                // Use maxHeight for consistent vertical sizing
                wrapper.style.width = `${pos.width}px`;
                wrapper.style.height = `${maxHeight}px`;
                
                // Add spacing between letters
                if (index > 0) {
                    const prevPos = positions[index - 1];
                    const gap = pos.left - (prevPos.left + prevPos.width);
                    // Add positive margin to create space between letters
                    // Use a small spacing value (e.g., 3-5px) to add breathing room
                    let letterSpacing = 4; // pixels of space between letters
                    
                    // Add extra spacing for "MEHTA" on wide screens
                    // E-H (index 1->2) and H-T (index 2->3) need more space
                    if (!isFirstName && screenWidth > 768) {
                        // For "MEHTA": M(0), E(1), H(2), T(3), A(4)
                        // Add extra space after E (before H, index 2) and after H (before T, index 3)
                        if (index === 2 || index === 3) {
                            letterSpacing += 3; // Add 3px extra spacing
                        }
                    }
                    
                    wrapper.style.marginLeft = `${letterSpacing}px`;
                } else {
                    wrapper.style.marginLeft = '0';
                }
                wrapper.style.marginRight = '0';
                
                // Set SVG to fill wrapper exactly
                svg.style.width = `${pos.width}px`;
                svg.style.height = `${maxHeight}px`;
                
                // Use viewBox that matches wrapper dimensions
                // Width: scale viewBox width to match wrapper width ratio
                // Height: use consistent viewBox height for all letters
                // This ensures the SVG fills the wrapper and font-size scales consistently
                const viewBoxW = (pos.width / maxHeight) * viewBoxHeight;
                svg.setAttribute('viewBox', `0 0 ${viewBoxW} ${viewBoxHeight}`);
                // Use 'none' to allow the SVG to fill the wrapper exactly
                // This ensures consistent font-size appearance across all letters
                svg.setAttribute('preserveAspectRatio', 'none');
                
                // Use consistent font-size for all letters (in viewBox units)
                // Use the same font-size for all letters to ensure consistent appearance
                // This makes narrow letters like "I" appear the same size as wider letters
                if (textEl) {
                    // Use baseFontSize for all letters to ensure consistency
                    // The SVG will scale to fit the wrapper width, but font-size stays consistent
                    textEl.setAttribute('font-size', baseFontSize);
                    textEl.setAttribute('x', '50%');
                    textEl.setAttribute('y', '50%');
                    textEl.setAttribute('text-anchor', 'middle');
                    textEl.setAttribute('dominant-baseline', 'middle');
                    if (!textEl.getAttribute('font-family')) {
                        textEl.setAttribute('font-family', 'Bruno Ace');
                    }
                }
            });
        }
        
        // Get screen width for responsive layout
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth <= 768 && !IS_IFRAME_CHILD;
        
        // Size each letter individually
        sizeContainer(base, true, screenWidth);  // firstName
        sizeContainer(base2, false, screenWidth); // lastName
        
        // Always stack name vertically (column) on all screen sizes
        brandEl.style.flexDirection = 'column';
        
        // Restore original transforms
        firstName.style.transform = originalTransform1;
        lastName.style.transform = originalTransform2;
        
        // Center ruler exactly under name (AFTER SVG sizes are synced)
        const divider = document.querySelector('.hero-divider');
        
        if (brandEl && divider) {
            const brandRect = brandEl.getBoundingClientRect();
            const wrapperRect = brandEl.parentElement.getBoundingClientRect();
            
            // Width = 85% of full name width
            const rulerWidth = brandRect.width * 0.85;
            
            // Center ruler exactly under name
            const rulerLeft =
                (brandRect.left - wrapperRect.left) +
                (brandRect.width / 2) -
                (rulerWidth / 2);
            
            divider.style.width = `${rulerWidth}px`;
            divider.style.marginLeft = `${rulerLeft}px`;
        }
    }
    
    // Wait for fonts to load, then build and sync
    function initSvgName() {
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function() {
                buildSvgName();
                // Small delay to ensure SVG is rendered
                setTimeout(() => {
                    syncSvgSizes();
                    // Start animations immediately after SVG is ready
                    startLetterAnimations();
                    // Initialize 3D effect AFTER letter wrappers are created
                    const isMobile = window.innerWidth <= 768 && !IS_IFRAME_CHILD;
                    if (!isMobile) {
                        init3D();
                        // Update 3D effect immediately after init (desktop only) - sets initial opacity to 1
                        update3D();
                        // Attach scroll listener ONLY after letters exist (DESKTOP ONLY)
                        if (!window._scrollListenerAttached) {
                            window.addEventListener('scroll', handle3DScroll, { passive: true });
                            window._scrollListenerAttached = true;
                            console.log('Scroll listener attached after letters created');
                        }
                    } else {
                        // MOBILE: Enable 3D scroll animation (same as desktop)
                        init3D();
                        // Update 3D effect immediately after init
                        update3D();
                        // Attach scroll listener for 3D animation
                        if (!window._scrollListenerAttached) {
                            window.addEventListener('scroll', handle3DScroll, { passive: true });
                            window._scrollListenerAttached = true;
                            console.log('Scroll listener attached after letters created (mobile)');
                        }
                    }
                }, 50);
            });
        } else {
            setTimeout(function() {
                buildSvgName();
                setTimeout(() => {
                    syncSvgSizes();
                    // Start animations immediately after SVG is ready
                    startLetterAnimations();
                    // Initialize 3D effect AFTER letter wrappers are created
                    const isMobile = window.innerWidth <= 768 && !IS_IFRAME_CHILD;
                    if (!isMobile) {
                        init3D();
                        // Update 3D effect immediately after init (desktop only) - sets initial opacity to 1
                        update3D();
                        // Attach scroll listener ONLY after letters exist (DESKTOP ONLY)
                        if (!window._scrollListenerAttached) {
                            window.addEventListener('scroll', handle3DScroll, { passive: true });
                            window._scrollListenerAttached = true;
                            console.log('Scroll listener attached after letters created');
                        }
                    } else {
                        // MOBILE: Enable 3D scroll animation (same as desktop)
                        init3D();
                        // Update 3D effect immediately after init
                        update3D();
                        // Attach scroll listener for 3D animation
                        if (!window._scrollListenerAttached) {
                            window.addEventListener('scroll', handle3DScroll, { passive: true });
                            window._scrollListenerAttached = true;
                            console.log('Scroll listener attached after letters created (mobile)');
                        }
                    }
                }, 50);
            }, 100);
        }
    }
    
    // Initialize SVG name
    initSvgName();
    
    // Recalculate on resize
    let svgResizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(svgResizeTimeout);
        svgResizeTimeout = setTimeout(function() {
            syncSvgSizes();
        }, 100);
    });
});

// Start letter animations - accessible globally
function startLetterAnimations() {
    // Original delays for each letter (in seconds)
    const originalDelays = {
        1: 5.0,
        2: 4.5,
        3: 4.0,
        4: 3.5,
        5: 3.0,  // N - earliest
        6: 3.0,  // M - earliest
        7: 3.5,
        8: 4.0,
        9: 4.5,
        10: 5.0
    };
    
    // Find the minimum delay (earliest letter)
    const minDelay = Math.min(...Object.values(originalDelays)); // 3.0s
    
    // Try multiple times in case SVG isn't ready yet
    let attempts = 0;
    const maxAttempts = 10;
    
    function tryStart() {
        let found = 0;
        for (let i = 1; i <= 10; i++) {
            const letter = document.querySelector('.letter_' + i);
            if (letter) {
                // Check if letter has colored_letter class (letters 4 and 10)
                const isColored = letter.classList.contains('colored_letter');
                const fillAnimation = isColored ? 'fill_animation_colored' : 'fill_animation_normal';
                
                // Calculate new delay: subtract minimum delay to start earliest letter at 0s
                // This maintains relative timing between letters
                const newDelay = (originalDelays[i] - minDelay).toFixed(1) + 's';
                
                // Rebuild animation with adjusted delay
                letter.style.animation = `stroke_animation 10s ease-in-out ${newDelay} infinite, ${fillAnimation} 10s ease-in-out ${newDelay} infinite`;
                letter.style.animationPlayState = 'running';
                found++;
            }
        }
        
        // If not all letters found and we haven't exceeded max attempts, try again
        if (found < 10 && attempts < maxAttempts) {
            attempts++;
            requestAnimationFrame(() => {
                setTimeout(tryStart, 50);
            });
        }
    }
    
    tryStart();
}

// GSAP Skills horizontal scroll implementation
gsap.registerPlugin(ScrollTrigger);

// 3D "Fly-Past" Hero Effect - Following test.html exactly
// ONE perspective camera on <body> only
// Single "wall" (.hero-content) moves forward in Z
// Each letter adds its own translateZ at different speed
// Final depth = wall Z + letter Z

let ticking = false;

function handle3DScroll() {
    if (window.__IFRAME_PARENT__) return;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            update3D();
            ticking = false;
        });
        ticking = true;
    }
}

function update3D() {
    const heroContent = document.querySelector(".hero-content");
    const hero = document.querySelector(".hero");
    if (!heroContent || !hero) return;

    const scrollY = window.scrollY;
    // Increased scroll sensitivity: lower factor = more responsive
    const factor = 12; // Lower = more sensitive to scroll, 3D movement responds sooner
    const x = scrollY / factor; // Divide scroll by factor to slow movement

    // Move scene content forward (toward viewer) as you scroll (perspective on .hero in CSS)
    heroContent.style.transform = `translateZ(${x}px)`;

    // Letters move at different speeds based on data-speed
    // Higher speed = moves faster = appears closer
    const depthMultiplier = 5.0; // Increased to make depth differences more visible
    const letterWrappers = document.querySelectorAll('.letter-wrapper');
    letterWrappers.forEach(wrapper => {
        const speed = parseFloat(wrapper.dataset.speed) || 1;
        // Each letter moves at its own speed: speed multiplier affects Z movement
        // Multiply by depthMultiplier to increase the difference between letters
        const letterZ = x * speed * depthMultiplier;
        console.log("letterZ: ", letterZ);
        wrapper.style.transform = `translateZ(${letterZ}px)`;
    });

    // Apply 3D transforms to individual words in greeting
    const greetingWords = document.querySelectorAll('.greeting-word');
    greetingWords.forEach(word => {
        const speed = parseFloat(word.getAttribute('data-speed')) || 1;
        const wordZ = x * speed * depthMultiplier;
        word.style.transform = `translateZ(${wordZ}px)`;
    });
    
    // Apply 3D transforms to divider
    const divider = document.querySelector('.hero-divider');
    if (divider) {
        const speed = parseFloat(divider.getAttribute('data-speed')) || 1;
        const dividerZ = x * speed * depthMultiplier;
        divider.style.transform = `translateZ(${dividerZ}px)`;
    }
    
    // Apply 3D transforms to individual words in subtitle (exactly like greeting)
    const subtitleWords = document.querySelectorAll('.subtitle-word');
    subtitleWords.forEach(word => {
        const speed = parseFloat(word.getAttribute('data-speed')) || 1;
        const wordZ = x * speed * depthMultiplier;
        word.style.transform = `translateZ(${wordZ}px)`;
    });

    // Fade only near the end: stays 1.0 until x reaches 110, then fades out between 110 and 160
    const maxZ = 160;
    const startFadeAt = 110;
    let opacity = 1;
    if (x > startFadeAt) {
        opacity = 1 - ((x - startFadeAt) / (maxZ - startFadeAt));
    }
    opacity = Math.max(0, Math.min(1, opacity));
    hero.style.opacity = opacity;

    // Stable visibility/pointer-events toggle to prevent high-frequency layout changes
    if (opacity <= 0) {
        if (hero.style.visibility !== 'hidden') {
            hero.style.visibility = 'hidden';
            hero.style.pointerEvents = 'none';
        }
    } else {
        if (hero.style.visibility !== 'visible') {
            hero.style.visibility = 'visible';
            hero.style.pointerEvents = 'auto';
        }
    }
}

// MOBILE: Play hero 3D animation once (timed) - no scroll binding
function playHero3DAnimationOnce() {
    const heroContent = document.querySelector(".hero-content");
    const hero = document.querySelector(".hero");
    if (!heroContent || !hero) return;

    // MOBILE: Keep hero fully visible - no 3D animation that pushes content forward
    // Ensure hero stays at full opacity and is visible
    hero.style.opacity = '1';
    hero.style.visibility = 'visible';
    
    // Reset any transforms that might hide content
    heroContent.style.transform = '';
    heroContent.style.opacity = '1';
    heroContent.style.visibility = 'visible';
    
    // Reset all letter wrappers - ensure they're visible
    const letterWrappers = document.querySelectorAll('.letter-wrapper');
    letterWrappers.forEach(wrapper => {
        wrapper.style.transform = '';
        wrapper.style.opacity = '1';
        wrapper.style.visibility = 'visible';
    });

    // Reset greeting words
    const greetingWords = document.querySelectorAll('.greeting-word');
    greetingWords.forEach(word => {
        word.style.transform = '';
        word.style.opacity = '1';
        word.style.visibility = 'visible';
    });

    // Reset divider
    const divider = document.querySelector('.hero-divider');
    if (divider) {
        divider.style.transform = '';
        divider.style.opacity = '1';
        divider.style.visibility = 'visible';
    }

    // Reset subtitle words
    const subtitleWords = document.querySelectorAll('.subtitle-word');
    subtitleWords.forEach(word => {
        word.style.transform = '';
        word.style.opacity = '1';
        word.style.visibility = 'visible';
    });
    
    // Ensure hero-content children are visible
    const heroNameWrapper = document.querySelector('.hero-name-wrapper');
    if (heroNameWrapper) {
        heroNameWrapper.style.opacity = '1';
        heroNameWrapper.style.visibility = 'visible';
    }
}

// Initialize 3D effect
function init3D() {
    if (window.__IFRAME_PARENT__) return;
    // Spacer height is now set in CSS (3600px) to prevent layout shifts
    // Initial paint - works on both desktop and mobile
    update3D();
}

// Skills horizontal scroll handler (vanilla JS, no GSAP)
// Store variables outside function to prevent recalculation during scroll
let skillsScrollData = {
    viewportH: 0,           // Viewport height (locked on init for mobile)
    viewportW: 0,           // Viewport width
    maxTranslateX: 0,       // Maximum horizontal translation needed
    wrapperHeight: 0,       // Total wrapper height
    wrapperOffsetTop: 0,    // Wrapper's initial position in document
    onScrollHandler: null,
    isMobile: false,        // Track if mobile device
    isActive: false         // Explicit active state to handle momentum scroll
};

// Guard flag to prevent re-initialization
let skillsInitialized = false;

// Project scroll focus data - lock viewport values to prevent mobile URL bar issues
let projectScrollData = {
    viewportH: 0,        // Locked viewport height (calculated once)
    viewportCenter: 0,   // Locked viewport center (calculated once)
    maxDistance: 0,      // Locked max distance (calculated once)
    isMobile: false,     // Mobile detection
    scrollTrigger: null, // ScrollTrigger instance for cleanup (desktop only)
    observer: null,      // IntersectionObserver instance for cleanup (mobile only)
    scrollHandler: null, // Scroll handler for mobile
    scrollHandlerAttached: false // Track if scroll handler is attached
};

// ---------- Helper functions for Skills remeasurement ----------
function remeasureSkillsOnce() {
  // MOBILE: Skip remeasurement - use native scrolling
  if (window.innerWidth <= 768 && !IS_IFRAME_CHILD) {
    return;
  }
  
  const wrapper = document.querySelector('.skills-wrapper');
  const skills = document.querySelector('.skills');
  const grid = document.querySelector('.skills-grid');
  const cards = document.querySelectorAll('.skill-card');
  if (!wrapper || !skills || !grid || cards.length === 0) return;

  // recompute side padding (centers first/last card)
  const firstCard = cards[0];
  const viewportCenter = window.innerWidth / 2;
  const cardWidth = firstCard.offsetWidth;
  const sidePadding = Math.max(0, viewportCenter - cardWidth / 2);
  grid.style.paddingLeft = sidePadding + 'px';
  grid.style.paddingRight = sidePadding + 'px';

  // measure last-card center inside grid
  const lastCard = cards[cards.length - 1];
  const lastCardCenterInGrid = lastCard.offsetLeft + lastCard.offsetWidth / 2;
  skillsScrollData.maxTranslateX = Math.max(0, lastCardCenterInGrid - (window.innerWidth / 2));

  // freeze viewport measures - use APP_HEIGHT (canonical height)
  const isMobile = window.innerWidth <= 768 && !IS_IFRAME_CHILD;
  skillsScrollData.isMobile = isMobile;
  skillsScrollData.viewportH = APP_HEIGHT; // Use canonical height
  skillsScrollData.viewportW = window.innerWidth;

  // freeze skills container height - use APP_HEIGHT
  skills.style.height = APP_HEIGHT + 'px';
  skills.style.minHeight = APP_HEIGHT + 'px';
  skills.style.maxHeight = APP_HEIGHT + 'px';

  // compute wrapperHeight - use APP_HEIGHT
  if (isMobile) {
    skillsScrollData.wrapperHeight = APP_HEIGHT * 1.5;
  } else {
    skillsScrollData.wrapperHeight = APP_HEIGHT + skillsScrollData.maxTranslateX;
  }
  wrapper.style.height = skillsScrollData.wrapperHeight + 'px';
  wrapper.style.minHeight = skillsScrollData.wrapperHeight + 'px';
  wrapper.style.maxHeight = skillsScrollData.wrapperHeight + 'px';

  // IMPORTANT: compute wrapperOffsetTop using bounding rect + scrollY (robust)
  skillsScrollData.wrapperOffsetTop = Math.round(wrapper.getBoundingClientRect().top + window.scrollY);
}

// Attach a one-time listener that re-measures when the user first interacts.
// This lets the mobile URL bar settle before we lock geometry.
function attachFirstInteractionRemeasure() {
  if (window.__IFRAME_PARENT__) return;
  if (window.innerWidth <= 768 && !IS_IFRAME_CHILD) return;
  if (window._skillsRemeasured) return;
  const onFirst = () => {
    // schedule to next frame to let browser settle a tiny bit
    requestAnimationFrame(() => {
      remeasureSkillsOnce();
      window._skillsRemeasured = true;
      window.removeEventListener('scroll', onFirst, { passive: true });
      window.removeEventListener('touchstart', onFirst, { passive: true });
      window.removeEventListener('touchmove', onFirst, { passive: true });
      console.log('Skills: remeasured after first interaction');
    });
  };
  window.addEventListener('scroll', onFirst, { passive: true });
  window.addEventListener('touchstart', onFirst, { passive: true });
  window.addEventListener('touchmove', onFirst, { passive: true });
}
// ---------- END Helper functions ----------

function handleSkillsScroll() {
    const wrapper = document.querySelector('.skills-wrapper');
    const skills = document.querySelector('.skills');
    const grid = document.querySelector('.skills-grid');
    const cards = document.querySelectorAll('.skill-card');

    if (!wrapper || !skills || !grid || cards.length === 0) return;

    // Remove previous scroll listener if it exists
    if (skillsScrollData.onScrollHandler) {
        window.removeEventListener('scroll', skillsScrollData.onScrollHandler);
        skillsScrollData.onScrollHandler = null;
    }

    const firstCard = cards[0];
    const isMobile = window.innerWidth <= 768;
    skillsScrollData.isMobile = isMobile;
    
    // Padding so FIRST card can be centered (both mobile and desktop)
    const cardWidth = firstCard.offsetWidth;
    const sidePadding = Math.max(0, (window.innerWidth / 2) - (cardWidth / 2));
    grid.style.paddingLeft = sidePadding + 'px';
    grid.style.paddingRight = sidePadding + 'px';

    // Wait for layout to settle, then calculate ONCE and lock it
    requestAnimationFrame(() => {
        requestAnimationFrame(() => { // Double RAF ensures layout is fully settled
            // === STEP 1: USE CANONICAL HEIGHT ===
            skillsScrollData.viewportH = APP_HEIGHT; // Use canonical height
            skillsScrollData.viewportW = window.innerWidth;

            // FREEZE STICKY CONTAINER HEIGHT - Set ONCE, never modify again
            skills.style.height = APP_HEIGHT + 'px';
            skills.style.minHeight = APP_HEIGHT + 'px';
            skills.style.maxHeight = APP_HEIGHT + 'px';

            // === SCROLL-DRIVEN TRANSLATION (MOBILE & DESKTOP) ===
            // === STEP 3: COMPUTE HORIZONTAL DISTANCE EXACTLY (ON INIT) ===
            // Calculate distance needed so LAST CARD CENTER reaches VIEWPORT CENTER
            const lastCard = cards[cards.length - 1];
            const lastCardCenterInGrid = lastCard.offsetLeft + (lastCard.offsetWidth / 2);
            const viewportCenter = skillsScrollData.viewportW / 2;
            
            // How much grid must move left so that last card center reaches viewport center
            skillsScrollData.maxTranslateX = lastCardCenterInGrid - viewportCenter;

            // === STEP 4: DEFINE SCROLL RANGE ===
            // Wrapper height = APP_HEIGHT + horizontal distance (same for mobile and desktop)
            skillsScrollData.wrapperHeight = APP_HEIGHT + skillsScrollData.maxTranslateX;
            
            // FREEZE WRAPPER HEIGHT - Set ONCE, never modify again
            wrapper.style.height = skillsScrollData.wrapperHeight + 'px';
            wrapper.style.minHeight = skillsScrollData.wrapperHeight + 'px';
            wrapper.style.maxHeight = skillsScrollData.wrapperHeight + 'px';

            // === STEP 5: STORE WRAPPER POSITION ===
            // Store wrapper's initial position in document (use getBoundingClientRect + scrollY for robustness)
            skillsScrollData.wrapperOffsetTop = Math.round(wrapper.getBoundingClientRect().top + window.scrollY);

            // === STEP 6: MAP SCROLL → HORIZONTAL MOVEMENT ===
            skillsScrollData.onScrollHandler = function onScroll() {
                const currentScrollY = window.scrollY;
                
                // === DEFINE HARD BOUNDARIES EACH FRAME ===
                const start = skillsScrollData.wrapperOffsetTop;
                const end = start + skillsScrollData.wrapperHeight;
                
                    // === HANDLE EXIT SAFELY ===
                    if (currentScrollY < start || currentScrollY > end) {
                        // Outside boundaries - reset horizontal position and deactivate
                        grid.style.transform = 'translateX(0px)';
                        skillsScrollData.isActive = false;
                        return; // Exit immediately to prevent corruption
                    }
                    
                    // === HANDLE ENTRY SAFELY ===
                    // When scrollY is inside [start, end]
                    skillsScrollData.isActive = true;
                    const localScroll = currentScrollY - start;
                    
                    // Compute progress
                    const progress = localScroll / skillsScrollData.maxTranslateX;
                    
                    // Clamp progress between 0 and 1 EVERY FRAME
                    const clampedProgress = Math.max(0, Math.min(1, progress));
                    
                    // Apply horizontal translation based on clamped progress (mobile & desktop)
                    grid.style.transform = `translateX(${-clampedProgress * skillsScrollData.maxTranslateX}px)`;
            };
            
            window.addEventListener('scroll', skillsScrollData.onScrollHandler);
            skillsScrollData.onScrollHandler(); // Initial call
        });
    });
}

function initProjectScrollFocus() {
    if (window.__IFRAME_PARENT__) return;
    const cards = gsap.utils.toArray(".project-card");

    if (!cards.length) return;

    // === DETECT MOBILE ===
    const isMobile = window.innerWidth <= 768 && !IS_IFRAME_CHILD;
    projectScrollData.isMobile = isMobile;

    if (isMobile) {
        // === MOBILE: Use scroll-based calculation (same as desktop) for smooth continuous animation ===
        // Clean up previous observer and scroll handler if exists
        if (projectScrollData.observer) {
            projectScrollData.observer.disconnect();
            projectScrollData.observer = null;
        }
        if (projectScrollData.scrollHandler) {
            window.removeEventListener('scroll', projectScrollData.scrollHandler);
            projectScrollData.scrollHandler = null;
        }

        // === CALCULATE AND LOCK VIEWPORT VALUES ONCE (same as desktop) ===
        projectScrollData.viewportH = APP_HEIGHT;
        projectScrollData.viewportCenter = APP_HEIGHT / 2;
        projectScrollData.maxDistance = APP_HEIGHT * 0.65;

        // Set initial state for all cards: blurred, scaled down, low opacity (same as desktop unfocused state)
        cards.forEach(card => {
            gsap.set(card, {
                scale: 0.88,
                opacity: 0.45,
                filter: 'blur(2px)'
            });
        });

        let isScrolling = false;

        // Create scroll handler that updates all cards continuously (same as desktop)
        projectScrollData.scrollHandler = () => {
            if (isScrolling) return;
            isScrolling = true;
            
            requestAnimationFrame(() => {
                const center = projectScrollData.viewportCenter;
                const max = projectScrollData.maxDistance;

                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const cardCenter = rect.top + rect.height / 2;
                    const distance = Math.abs(center - cardCenter);
                    
                    // Normalize distance (0 at center, 1 far away)
                    const distanceRatio = Math.min(distance / max, 1);
                    
                    // Invert and apply non-linear easing curve (same as desktop)
                    const focusedStrength = 1 - Math.pow(distanceRatio, 2.0);
                    
                    // Interpolate scale: 0.88 (unfocused) to 1.04 (focused)
                    const scale = 0.88 + focusedStrength * 0.16;
                    
                    // Interpolate opacity: 0.45 (unfocused) to 1 (focused)
                    const opacity = 0.45 + focusedStrength * 0.55;

                    const blur = distanceRatio * 2;
                    gsap.to(card, {
                        scale: scale,
                        opacity: opacity,
                        filter: `blur(${blur}px)`,
                        duration: 0.2,
                        overwrite: true,
                        ease: "power3.out"
                    });
                });
                
                isScrolling = false;
            });
        };

        // Use IntersectionObserver to detect when projects section is in view, then attach scroll handler
        const projectsSection = document.querySelector('#projects');
        if (projectsSection) {
            projectScrollData.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Projects section entered viewport - attach scroll handler
                        if (!projectScrollData.scrollHandlerAttached) {
                            window.addEventListener('scroll', projectScrollData.scrollHandler, { passive: true });
                            projectScrollData.scrollHandlerAttached = true;
                            // Initial update
                            projectScrollData.scrollHandler();
                        }
                    } else {
                        // Projects section left viewport - detach scroll handler and reset cards
                        if (projectScrollData.scrollHandlerAttached) {
                            window.removeEventListener('scroll', projectScrollData.scrollHandler);
                            projectScrollData.scrollHandlerAttached = false;
                            // Reset all cards to unfocused state
                            cards.forEach(card => {
                                gsap.to(card, {
                                    scale: 0.88,
                                    opacity: 0.45,
                                    filter: 'blur(2px)',
                                    duration: 0.3,
                                    ease: "power3.out"
                                });
                            });
                        }
                    }
                });
            }, {
                threshold: 0.01,
                rootMargin: '0px'
            });

            projectScrollData.observer.observe(projectsSection);
        } else {
            // Fallback: if projects section not found, attach scroll handler immediately
            window.addEventListener('scroll', projectScrollData.scrollHandler, { passive: true });
            projectScrollData.scrollHandlerAttached = true;
            projectScrollData.scrollHandler();
        }
    } else {
        // === DESKTOP: Use ScrollTrigger (unchanged) ===
        // Clean up previous ScrollTrigger if exists
        if (projectScrollData.scrollTrigger) {
            projectScrollData.scrollTrigger.kill();
            projectScrollData.scrollTrigger = null;
        }

        // === CALCULATE AND LOCK VIEWPORT VALUES ONCE ===
        // Use APP_HEIGHT (canonical height) - ignore URL bar completely
        // All values calculated from APP_HEIGHT - no hardcoded values
        projectScrollData.viewportH = APP_HEIGHT;
        projectScrollData.viewportCenter = APP_HEIGHT / 2;
        projectScrollData.maxDistance = APP_HEIGHT * 0.65;

        // Create ScrollTrigger with locked values
        projectScrollData.scrollTrigger = ScrollTrigger.create({
            trigger: "#projects",
            start: "top bottom",
            end: "bottom top",
            onUpdate: () => {
                // Use locked viewport values (NOT window.innerHeight during scroll)
                // This prevents mobile URL bar changes from breaking the animation
                const center = projectScrollData.viewportCenter;
                const max = projectScrollData.maxDistance;

                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const cardCenter = rect.top + rect.height / 2;
                    const distance = Math.abs(center - cardCenter);
                    
                    // Normalize distance (0 at center, 1 far away)
                    const distanceRatio = Math.min(distance / max, 1);
                    
                    // Invert and apply non-linear easing curve
                    // Reduced exponent makes focus last longer near center
                    const focusedStrength = 1 - Math.pow(distanceRatio, 2.0);
                    
                    // Interpolate scale: 0.88 (unfocused) to 1.04 (focused)
                    const scale = 0.88 + focusedStrength * 0.16;
                    
                    // Interpolate opacity: 0.45 (unfocused) to 1 (focused)
                    const opacity = 0.45 + focusedStrength * 0.55;

                    const blur = distanceRatio * 2;
                    gsap.to(card, {
                        scale: scale,
                        opacity: opacity,
                        filter: `blur(${blur}px)`,
                        duration: 0.2,
                        overwrite: true,
                        ease: "power3.out"
                    });
                });
            }
        });
    }
}

// Reinitialize project scroll on resize/orientation change to recalculate locked values
function reinitProjectScrollFocus() {
    initProjectScrollFocus();
}

// === DELAYED INITIALIZATION: Wait for layout to stabilize ===
// ensure body.loading set on start (already set earlier)
// document.body.classList.add('loading'); // Already set at line 9

function hideLoader() {
    const loader = document.getElementById('loader');
    // Immediately disable pointer blocking
    document.body.classList.remove('loading');
    document.body.style.pointerEvents = 'auto';

    if (loader) {
        // Hide loader instantly so no flash when hero appears
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        loader.style.pointerEvents = 'none';
        loader.classList.add('hidden');
        setTimeout(() => {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, 500);
    }
}

// Wait 3.5s after load so everything can measure correctly on mobile
window.addEventListener('load', () => { 
    setTimeout(() => {
        // Initialize scroll logic BEFORE loader fade-out so it's ready when user can interact
        loaderFinished = true;
        init3D();
        handleSkillsScroll();
        attachFirstInteractionRemeasure();
        initProjectScrollFocus();
        ScrollTrigger?.refresh?.(true);
        // force initial update
        update3D();
        
        // Then hide loader
        hideLoader();
    }, 3500); 
});

window.addEventListener("resize", () => {
    init3D();
    // REMOVED: All dynamic height updates - use canonical APP_HEIGHT only
    // Skills and project scroll use APP_HEIGHT (locked on load)
    // No recomputation during scroll/resize
});

// Scroll listener will be attached AFTER letters are created (see initSvgName)
// Do NOT attach here - wait for letters to exist

// Also update on resize to keep math correct
window.addEventListener("resize", () => {
    init3D();
    update3D();
});

window.addEventListener("orientationchange", () => {
    init3D();
    // REMOVED: All dynamic height updates - use canonical APP_HEIGHT only
    // Skills and project scroll use APP_HEIGHT (locked on load)
    // No recomputation during orientation change
    ScrollTrigger.refresh();
});
