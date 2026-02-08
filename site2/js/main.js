/**
 * Bella Napoli - Main JavaScript
 * Pizzeria Website
 */

(function() {
    'use strict';

    // ===== DOM Elements =====
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.main-nav__list');
    const galleryItems = document.querySelectorAll('.gallery__item');
    const lightbox = document.querySelector('.lightbox');
    const fadeElements = document.querySelectorAll('.fade-in');

    // ===== Header Scroll Effect =====
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on load

    // ===== Mobile Menu Toggle =====
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close menu when clicking a link
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navList.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // ===== Fade In Animations =====
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // ===== Lightbox Gallery =====
    let currentIndex = 0;
    const images = [];

    if (galleryItems.length > 0 && lightbox) {
        // Collect all images
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            if (img) {
                images.push({
                    src: img.src,
                    alt: img.alt
                });

                item.addEventListener('click', () => openLightbox(index));
            }
        });

        // Lightbox controls
        const closeBtn = lightbox.querySelector('.lightbox__close');
        const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
        const nextBtn = lightbox.querySelector('.lightbox__nav--next');
        const lightboxImg = lightbox.querySelector('.lightbox__content img');

        function openLightbox(index) {
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function updateLightboxImage() {
            if (images[currentIndex]) {
                lightboxImg.src = images[currentIndex].src;
                lightboxImg.alt = images[currentIndex].alt;
            }
        }

        function navigate(direction) {
            currentIndex += direction;
            if (currentIndex < 0) currentIndex = images.length - 1;
            if (currentIndex >= images.length) currentIndex = 0;
            updateLightboxImage();
        }

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });
    }

    // ===== Menu Category Navigation =====
    const menuNavBtns = document.querySelectorAll('.menu-nav__btn');
    const menuCategories = document.querySelectorAll('.menu-category');

    menuNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            menuNavBtns.forEach(b => b.classList.remove('menu-nav__btn--active'));
            this.classList.add('menu-nav__btn--active');

            // Scroll to category
            const category = this.dataset.category;
            const target = document.getElementById(category);
            if (target) {
                const headerHeight = header.offsetHeight + 70; // menu nav height
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Initialize Map =====
    function initMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement || typeof L === 'undefined') return;

        // Coordinates for Rue de la Paix, Paris
        const lat = 48.8693;
        const lng = 2.3311;

        const map = L.map('map').setView([lat, lng], 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Custom marker
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`
            <strong>Bella Napoli</strong><br>
            25 Rue de la Paix<br>
            75002 Paris<br>
            <a href="tel:+33145678901">01 45 67 89 01</a>
        `).openPopup();
    }

    // ===== Reservation Form =====
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const date = formData.get('date');
            const time = formData.get('time');
            const guests = formData.get('guests');
            const message = formData.get('message');

            const subject = encodeURIComponent(`Réservation - ${name} - ${date} à ${time}`);
            const body = encodeURIComponent(
                `Nouvelle réservation:\n\n` +
                `Nom: ${name}\n` +
                `Email: ${email}\n` +
                `Téléphone: ${phone}\n` +
                `Date: ${date}\n` +
                `Heure: ${time}\n` +
                `Nombre de personnes: ${guests}\n` +
                `Demande spéciale: ${message || 'Aucune'}`
            );

            window.location.href = `mailto:ciao@bellanapoli.fr?subject=${subject}&body=${body}`;
        });

        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Parallax Effect on Hero =====
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            const heroBackground = hero.querySelector('.hero__background img');
            if (heroBackground && scrolled < window.innerHeight) {
                heroBackground.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
        });
    }

    // ===== Initialize on DOM Ready =====
    document.addEventListener('DOMContentLoaded', function() {
        initMap();
    });

    // Also try to init map if DOM is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initMap, 100);
    }

})();
