/* ===== FLEUR & MOI — Main JavaScript ===== */

document.addEventListener('DOMContentLoaded', function () {

    /* ==========================================================
       1. NAVBAR SCROLL EFFECT
       ========================================================== */
    var navbar = document.querySelector('.navbar');

    function handleNavbarScroll() {
        if (!navbar) return;
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    if (navbar) {
        window.addEventListener('scroll', handleNavbarScroll, { passive: true });
        // Run once on load in case page is already scrolled
        handleNavbarScroll();
    }

    /* ==========================================================
       2. MOBILE MENU
       ========================================================== */
    var navToggle = document.querySelector('.navbar__toggle');
    var navMobile = document.querySelector('.navbar__mobile');
    var navOverlay = document.querySelector('.navbar__overlay');
    var mobileNavLinks = document.querySelectorAll('.navbar__mobile .nav-link');

    function openMobileMenu() {
        if (!navToggle || !navMobile) return;
        navToggle.classList.add('open');
        navMobile.classList.add('open');
        if (navOverlay) navOverlay.classList.add('open');
        document.body.classList.add('no-scroll');
    }

    function closeMobileMenu() {
        if (!navToggle || !navMobile) return;
        navToggle.classList.remove('open');
        navMobile.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('open');
        document.body.classList.remove('no-scroll');
    }

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            if (navMobile && navMobile.classList.contains('open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    // Close menu when a nav link inside the mobile panel is clicked
    mobileNavLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking on the overlay (outside the panel)
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMobileMenu);
    }

    /* ==========================================================
       3. SCROLL ANIMATIONS (IntersectionObserver)
       ========================================================== */
    var fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

    if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
        var fadeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    // The CSS handles the actual transition-delay via
                    // .fade-in[data-delay="N"], so adding .visible is enough.
                    el.classList.add('visible');
                    fadeObserver.unobserve(el);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeElements.forEach(function (el) {
            fadeObserver.observe(el);
        });
    }

    /* ==========================================================
       4. BOUQUET FILTER TABS (bouquets.html)
       ========================================================== */
    var bouquetTabs = document.querySelectorAll('.bouquet-tabs__btn');
    var bouquetCards = document.querySelectorAll('.bouquet-card');

    if (bouquetTabs.length > 0 && bouquetCards.length > 0) {
        bouquetTabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                var filter = this.getAttribute('data-filter');

                // Update active tab
                bouquetTabs.forEach(function (t) {
                    t.classList.remove('active');
                });
                this.classList.add('active');

                // Filter cards
                bouquetCards.forEach(function (card) {
                    var category = card.getAttribute('data-category');
                    var shouldShow = (filter === 'all' || category === filter);

                    if (shouldShow) {
                        // Show card
                        card.style.display = '';
                        // Small delay so display change registers before animating
                        requestAnimationFrame(function () {
                            requestAnimationFrame(function () {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            });
                        });
                    } else {
                        // Hide card with transition
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        // Wait for transition to finish, then set display none
                        setTimeout(function () {
                            // Re-check — user may have clicked another tab quickly
                            var activeTab = document.querySelector('.bouquet-tabs__btn.active');
                            var currentFilter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
                            if (currentFilter !== 'all' && category !== currentFilter) {
                                card.style.display = 'none';
                            }
                        }, 400);
                    }
                });
            });
        });
    }

    /* ==========================================================
       5. GALLERY LIGHTBOX (galerie.html)
       ========================================================== */
    var gallerySlides = document.querySelectorAll('.galerie__slide');

    if (gallerySlides.length > 0) {
        // Collect all gallery image sources
        var galleryImages = [];
        gallerySlides.forEach(function (slide) {
            var img = slide.querySelector('img');
            if (img) {
                galleryImages.push({
                    src: img.src,
                    alt: img.alt || ''
                });
            }
        });

        var currentIndex = 0;

        // Build lightbox DOM using safe DOM methods
        var lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-label', 'Visionneuse d\'images');

        var lightboxClose = document.createElement('button');
        lightboxClose.className = 'lightbox__close';
        lightboxClose.setAttribute('aria-label', 'Fermer');
        lightboxClose.textContent = '\u00D7'; // multiplication sign (x)

        var lightboxPrev = document.createElement('button');
        lightboxPrev.className = 'lightbox__nav lightbox__prev';
        lightboxPrev.setAttribute('aria-label', 'Image precedente');
        lightboxPrev.textContent = '\u2039'; // single left angle quote

        var lightboxImg = document.createElement('img');
        lightboxImg.src = '';
        lightboxImg.alt = '';

        var lightboxNext = document.createElement('button');
        lightboxNext.className = 'lightbox__nav lightbox__next';
        lightboxNext.setAttribute('aria-label', 'Image suivante');
        lightboxNext.textContent = '\u203A'; // single right angle quote

        var lightboxCounter = document.createElement('div');
        lightboxCounter.className = 'lightbox__counter';

        lightbox.appendChild(lightboxClose);
        lightbox.appendChild(lightboxPrev);
        lightbox.appendChild(lightboxImg);
        lightbox.appendChild(lightboxNext);
        lightbox.appendChild(lightboxCounter);

        document.body.appendChild(lightbox);

        function updateLightbox() {
            if (!galleryImages[currentIndex]) return;
            lightboxImg.src = galleryImages[currentIndex].src;
            lightboxImg.alt = galleryImages[currentIndex].alt;
            lightboxCounter.textContent = (currentIndex + 1) + ' / ' + galleryImages.length;
        }

        function openLightbox(index) {
            currentIndex = index;
            updateLightbox();
            lightbox.classList.add('open');
            document.body.classList.add('no-scroll');
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.classList.remove('no-scroll');
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateLightbox();
        }

        function prevImage() {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightbox();
        }

        // Open lightbox on slide click
        gallerySlides.forEach(function (slide, index) {
            slide.addEventListener('click', function () {
                openLightbox(index);
            });
        });

        // Close button
        lightboxClose.addEventListener('click', closeLightbox);

        // Navigation arrows
        lightboxPrev.addEventListener('click', function (e) {
            e.stopPropagation();
            prevImage();
        });

        lightboxNext.addEventListener('click', function (e) {
            e.stopPropagation();
            nextImage();
        });

        // Click on backdrop (outside the image) closes lightbox
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard support
        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('open')) return;

            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        });
    }

    /* ==========================================================
       6. CONTACT FORM (contact.html)
       ========================================================== */
    var contactForm = document.querySelector('.contact__form-wrapper form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Collect form field values
            var nameField = contactForm.querySelector('[name="name"]');
            var emailField = contactForm.querySelector('[name="email"]');
            var phoneField = contactForm.querySelector('[name="phone"]');
            var subjectField = contactForm.querySelector('[name="subject"]');
            var messageField = contactForm.querySelector('[name="message"]');

            var name = nameField ? nameField.value.trim() : '';
            var email = emailField ? emailField.value.trim() : '';
            var phone = phoneField ? phoneField.value.trim() : '';
            var message = messageField ? messageField.value.trim() : '';

            // Get subject value — handle both input and select elements
            var subject = '';
            if (subjectField) {
                if (subjectField.tagName === 'SELECT' && subjectField.selectedIndex >= 0) {
                    subject = subjectField.options[subjectField.selectedIndex].text;
                } else {
                    subject = subjectField.value.trim();
                }
            }

            // Build mailto body
            var bodyParts = [];
            if (name) bodyParts.push('Nom : ' + name);
            if (email) bodyParts.push('Email : ' + email);
            if (phone) bodyParts.push('Telephone : ' + phone);
            if (message) bodyParts.push('\nMessage :\n' + message);

            var mailtoSubject = subject ? subject : 'Demande depuis le site Fleur & Moi';
            var mailtoBody = bodyParts.join('\n');

            var mailtoLink = 'mailto:contact@fleuretmoi.fr'
                + '?subject=' + encodeURIComponent(mailtoSubject)
                + '&body=' + encodeURIComponent(mailtoBody);

            window.location.href = mailtoLink;

            // Show success message if the dedicated element exists
            var successMsg = document.querySelector('.contact__success');
            if (successMsg) {
                contactForm.style.display = 'none';
                successMsg.classList.add('show');
            } else {
                // Create an inline success notification using safe DOM methods
                var notification = document.createElement('div');
                notification.style.textAlign = 'center';
                notification.style.padding = '1.5rem';
                notification.style.marginTop = '1.5rem';
                notification.style.backgroundColor = '#e8ede5';
                notification.style.borderRadius = '12px';
                notification.style.color = '#3a6347';
                notification.style.fontWeight = '600';
                notification.style.fontSize = '1rem';
                notification.textContent = 'Votre client de messagerie va s\'ouvrir. Merci !';
                contactForm.parentNode.insertBefore(notification, contactForm.nextSibling);

                // Remove notification after 5 seconds
                setTimeout(function () {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 5000);
            }
        });
    }

    /* ==========================================================
       7. SMOOTH SCROLL (Anchor links)
       ========================================================== */
    var anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');

            // Ignore empty hashes or bare "#"
            if (!href || href === '#') return;

            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var navbarHeight = navbar ? navbar.offsetHeight : 0;
                var targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================================
       8. SCROLL TO TOP BUTTON
       ========================================================== */
    var scrollTopBtn = document.querySelector('.scroll-top');

    if (scrollTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
