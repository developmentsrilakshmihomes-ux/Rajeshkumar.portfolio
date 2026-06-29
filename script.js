/* ============================================================
   Sri Lakshmi Homes – MD Portfolio  |  script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ----------------------------------------------------------
       1. AOS INIT
    ---------------------------------------------------------- */
    AOS.init({
        duration: 750,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
    });


    /* ----------------------------------------------------------
       2. STICKY NAVBAR – change style on scroll
    ---------------------------------------------------------- */
    var navbar = document.getElementById('mainNavbar');

    function handleNavbarScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // run once on load


    /* ----------------------------------------------------------
       3. SMOOTH SCROLLING for navbar links
    ---------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            var navHeight = navbar ? navbar.offsetHeight : 70;
            var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: top, behavior: 'smooth' });

            // Close mobile menu if open
            var navCollapse = document.getElementById('navbarNav');
            if (navCollapse && navCollapse.classList.contains('show')) {
                var toggler = document.querySelector('.navbar-toggler');
                if (toggler) toggler.click();
            }
        });
    });


    /* ----------------------------------------------------------
       4. ACTIVE NAV LINK on scroll (IntersectionObserver)
    ---------------------------------------------------------- */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('#mainNavbar .nav-link');

    var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var id = entry.target.id;
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    var href = link.getAttribute('href');
                    if (href === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' });

    sections.forEach(function (s) { sectionObserver.observe(s); });


    /* ----------------------------------------------------------
       5. ANIMATED COUNTERS
    ---------------------------------------------------------- */
    var counters = document.querySelectorAll('.counter-num');
    var counterAnimated = false;

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var duration = 2000;
        var start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            // ease-out
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(step);
    }

    function startCounters() {
        if (counterAnimated) return;
        var section = document.getElementById('achievements');
        if (!section) return;
        var rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            counterAnimated = true;
            counters.forEach(function (counter) {
                animateCounter(counter);
            });
        }
    }

    window.addEventListener('scroll', startCounters, { passive: true });
    startCounters(); // check on load


    /* ----------------------------------------------------------
       6. SKILL BAR ANIMATION
    ---------------------------------------------------------- */
    var skillFills = document.querySelectorAll('.skill-fill');
    var skillsAnimated = false;

    function animateSkills() {
        if (skillsAnimated) return;
        var aboutSection = document.getElementById('about');
        if (!aboutSection) return;
        var rect = aboutSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            skillsAnimated = true;
            skillFills.forEach(function (fill) {
                var width = fill.getAttribute('data-width');
                setTimeout(function () {
                    fill.style.width = width + '%';
                }, 200);
            });
        }
    }

    window.addEventListener('scroll', animateSkills, { passive: true });
    animateSkills(); // check on load


    /* ----------------------------------------------------------
       7. SCROLL-TO-TOP BUTTON
    ---------------------------------------------------------- */
    var scrollBtn = document.getElementById('scrollTopBtn');

    function toggleScrollBtn() {
        if (window.scrollY > 400) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    }

    if (scrollBtn) {
        window.addEventListener('scroll', toggleScrollBtn, { passive: true });
        toggleScrollBtn();

        scrollBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    /* ----------------------------------------------------------
       8. MOBILE MENU AUTO-CLOSE on outside click
    ---------------------------------------------------------- */
    document.addEventListener('click', function (e) {
        var navCollapse = document.getElementById('navbarNav');
        if (!navCollapse) return;
        if (!navCollapse.classList.contains('show')) return;
        if (!navbar.contains(e.target)) {
            var toggler = document.querySelector('.navbar-toggler');
            if (toggler) toggler.click();
        }
    });


    /* ----------------------------------------------------------
       9. HERO FADE-IN on load
    ---------------------------------------------------------- */
    var heroText = document.querySelector('.hero-text');
    if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(24px)';
        requestAnimationFrame(function () {
            heroText.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        });
    }

}); // end DOMContentLoaded


/* ----------------------------------------------------------
   10. CONTACT FORM SUBMIT (global, called from HTML)
---------------------------------------------------------- */
function handleFormSubmit(e) {
    e.preventDefault();
    var btn = e.target;
    var originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending…';
    btn.disabled = true;
    setTimeout(function () {
        btn.innerHTML = '<i class="fa-solid fa-check me-1"></i> Message Sent!';
        btn.style.background = '#28a745';
        btn.style.borderColor = '#28a745';
        btn.style.color = '#fff';
        setTimeout(function () {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
            btn.disabled = false;
            // Clear inputs
            document.querySelectorAll('.contact-input').forEach(function (inp) {
                if (inp.tagName === 'SELECT') { inp.selectedIndex = 0; }
                else { inp.value = ''; }
            });
        }, 3000);
    }, 1500);
}


/* ----------------------------------------------------------
   11. NEWSLETTER SUBMIT (global, called from HTML)
---------------------------------------------------------- */
function handleNewsletter(e) {
    var btn = e.target;
    var input = btn.previousElementSibling;
    if (!input || !input.value.trim()) {
        input.style.borderColor = 'var(--gold)';
        input.focus();
        setTimeout(function () { input.style.borderColor = ''; }, 2000);
        return;
    }
    var originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.style.background = '#28a745';
    input.value = '';
    setTimeout(function () {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
    }, 3000);
}