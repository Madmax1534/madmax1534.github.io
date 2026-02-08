// ===== DOM Elements =====
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Navigation Toggle =====
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== Scroll Animations =====
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(el => fadeObserver.observe(el));

// ===== Initialize Map (if on page with map) =====
function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Coordonnées de Paris (place fictive)
    const lat = 48.8698;
    const lng = 2.3078;

    const map = L.map('map').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup('<strong>Hair Studio</strong><br>47 Avenue des Champs-Élysées<br>75008 Paris').openPopup();
}

// ===== Gallery Lightbox =====
let currentImageIndex = 0;
let galleryImages = [];

function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;

    galleryImages = Array.from(galleryItems);

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    // Create lightbox element
    createLightbox();
}

function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Fermer">&times;</button>
        <button class="lightbox-nav lightbox-prev" aria-label="Précédent">&#8249;</button>
        <div class="lightbox-content">
            <img src="" alt="Image galerie">
        </div>
        <button class="lightbox-nav lightbox-next" aria-label="Suivant">&#8250;</button>
    `;
    document.body.appendChild(lightbox);

    // Event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.querySelector('.lightbox');
    const img = lightbox.querySelector('.lightbox-content img');

    // Get image source from gallery item
    const galleryItem = galleryImages[index];
    const imgElement = galleryItem.querySelector('img');

    if (imgElement) {
        img.src = imgElement.src;
        img.alt = imgElement.alt;
    } else {
        // Placeholder pour la démo
        img.src = `https://picsum.photos/800/600?random=${index}`;
        img.alt = `Réalisation ${index + 1}`;
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentImageIndex += direction;

    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }

    openLightbox(currentImageIndex);
}

// ===== Gallery Filters =====
function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== Contact Form (mailto) =====
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const phone = form.querySelector('#phone').value;
        const message = form.querySelector('#message').value;

        const subject = encodeURIComponent(`Demande de contact - ${name}`);
        const body = encodeURIComponent(
            `Nom: ${name}\n` +
            `Email: ${email}\n` +
            `Téléphone: ${phone}\n\n` +
            `Message:\n${message}`
        );

        window.location.href = `mailto:contact@hairstudio.fr?subject=${subject}&body=${body}`;
    });
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initGallery();
    initGalleryFilters();
    initContactForm();
});
