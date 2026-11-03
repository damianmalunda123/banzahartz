/**
 * BANZAH ARTZ — Fine Art Drawing Portfolio
 * Core Interactive Scripts (Menu, Lightbox, Filters, Commission Direct Link)
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Mobile Menu Toggle
    // -------------------------------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('navbar-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('nav-open');
            mobileToggle.setAttribute('aria-expanded', isOpen);
            mobileToggle.innerHTML = isOpen 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Close menu on link click
        navMenu.querySelectorAll('.nav-link, .nav-cta-btn').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('nav-open');
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // -------------------------------------------------------------------------
    // 2. Header Scroll Effect
    // -------------------------------------------------------------------------
    const header = document.querySelector('header.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // -------------------------------------------------------------------------
    // 3. Gallery Lightbox Modal
    // -------------------------------------------------------------------------
    const lightboxModal = document.getElementById('art-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxMedium = document.getElementById('lightbox-medium');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxCommissionBtn = document.getElementById('lightbox-commission-btn');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    const artworkCards = Array.from(document.querySelectorAll('.art-card'));
    let currentArtIndex = 0;

    const openLightbox = (index) => {
        if (!lightboxModal || artworkCards.length === 0) return;
        currentArtIndex = (index + artworkCards.length) % artworkCards.length;
        const card = artworkCards[currentArtIndex];

        const imgSrc = card.getAttribute('data-img') || card.querySelector('img')?.src;
        const title = card.querySelector('.art-card-title')?.textContent.trim() || 'Fine Art Drawing';
        const medium = card.querySelector('.art-card-meta-row .badge-tag')?.textContent.trim() || '';
        const desc = card.getAttribute('data-desc') || 'Original handcrafted artwork by Baraka Banzah.';

        if (lightboxImg) lightboxImg.src = imgSrc;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxMedium) lightboxMedium.textContent = medium;
        if (lightboxDesc) lightboxDesc.textContent = desc;

        if (lightboxCommissionBtn) {
            const encodedTitle = encodeURIComponent(title);
            lightboxCommissionBtn.href = `https://wa.me/255765427438?text=Hello%20Baraka!%20I%20saw%20your%20artwork%20"${encodedTitle}"%20in%20your%20gallery%20and%20I%20would%20like%20to%20commission%20a%20similar%20drawing.`;
        }

        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    artworkCards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            // If user clicked direct social or external link inside, let it pass
            if (e.target.closest('a:not(.art-view-trigger)')) return;
            openLightbox(index);
        });

        const trigger = card.querySelector('.art-view-trigger');
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        }
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => openLightbox(currentArtIndex - 1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => openLightbox(currentArtIndex + 1));

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') openLightbox(currentArtIndex - 1);
        if (e.key === 'ArrowRight') openLightbox(currentArtIndex + 1);
    });

    // -------------------------------------------------------------------------
    // 4. Gallery Category Filter
    // -------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    if (filterButtons.length > 0 && artworkCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                artworkCards.forEach(card => {
                    const category = card.getAttribute('data-category') || '';
                    if (filter === 'all' || category.includes(filter)) {
                        card.style.display = '';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                        }, 20);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(12px) scale(0.97)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 200);
                    }
                });
            });
        });
    }

    // -------------------------------------------------------------------------
    // 5. Commission Inquiry Form to WhatsApp generator
    // -------------------------------------------------------------------------
    const commissionForm = document.getElementById('commission-form');
    const emailBtn = document.getElementById('btn-submit-email');

    if (commissionForm) {
        commissionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('client-name')?.value.trim() || 'Client';
            const medium = document.getElementById('art-medium')?.value || 'Pencil Portrait';
            const size = document.getElementById('art-size')?.value || 'A3';
            const phone = document.getElementById('client-phone')?.value.trim() || 'Not specified';
            const details = document.getElementById('art-notes')?.value.trim() || 'No additional notes';

            const message = `Hello Baraka! My name is ${name}. I would like to commission a custom portrait:
- Medium: ${medium}
- Paper Size: ${size}
- Contact Info: ${phone}
- Reference Photo: Nitaiambatanisha hapa moja kwa moja (Attaching directly here)
- Project Details: ${details}`;

            const waUrl = `https://wa.me/255765427438?text=${encodeURIComponent(message)}`;
            window.open(waUrl, '_blank');
        });
    }

    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            const name = document.getElementById('client-name')?.value.trim() || 'Client';
            const medium = document.getElementById('art-medium')?.value || 'Pencil Portrait';
            const size = document.getElementById('art-size')?.value || 'A3';
            const phone = document.getElementById('client-phone')?.value.trim() || 'Not specified';
            const details = document.getElementById('art-notes')?.value.trim() || 'No additional notes';

            const emailSubject = `Commission Inquiry - ${name} - Banzah Artz`;
            const emailBody = `Hello Baraka,\n\nI would like to commission a custom hand-drawn portrait:\n- Name: ${name}\n- Preferred Medium: ${medium}\n- Size: ${size}\n- Contact Info: ${phone}\n- Reference Photo: Attaching directly to this email\n- Project Details: ${details}\n\nBest regards,\n${name}`;

            emailBtn.href = `mailto:barakabanzah@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        });
    }
});
