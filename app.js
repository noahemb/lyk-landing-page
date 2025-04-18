'use strict';

document.addEventListener('DOMContentLoaded', function() {
    // Gestion du menu hamburger
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Défilement doux pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header réduit au défilement
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Animations au défilement
    const animateElements = document.querySelectorAll('.fade-in');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;
        
        animateElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;
            
            // Vérifier si l'élément est dans la fenêtre visible
            if (
                (elementBottomPosition >= windowTopPosition) &&
                (elementTopPosition <= windowBottomPosition)
            ) {
                element.classList.add('is-visible');
            }
        });
    }
    
    // Exécuter au chargement initial et au défilement
    window.addEventListener('scroll', checkIfInView);
    window.addEventListener('resize', checkIfInView);
    checkIfInView();
    
    // Animation de défilement sur le scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        setTimeout(() => {
            scrollIndicator.classList.add('animate');
        }, 2000);
    }
    
    // Gestion du carousel
    initCarousel();
    
    // Gestion du formulaire
    const form = document.getElementById('newsletter-form');
    const formMessage = document.getElementById('form-message');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const preferences = document.getElementById('preferences') ? document.getElementById('preferences').checked : false;
            
            // Validation côté client
            if (!validateEmail(email)) {
                showFormMessage('Veuillez entrer une adresse email valide.', 'error');
                return;
            }
            
            // Simulation d'envoi à l'API
            // Dans un environnement réel, vous utiliseriez fetch() pour envoyer
            // les données à votre backend
            
            // Ajouter un indicateur de chargement
            const submitBtn = form.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            setTimeout(function() {
                // Simuler une réponse réussie
                showFormMessage("Merci de votre inscription ! Vous recevrez bientôt votre invitation privée.", 'success');
                
                // Réinitialiser le formulaire
                form.reset();
                
                // Réinitialiser le bouton
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Stocker temporairement dans localStorage (pour démo)
                const subscribers = JSON.parse(localStorage.getItem('lyk-subscribers') || '[]');
                subscribers.push({ 
                    name, 
                    email, 
                    preferences,
                    date: new Date().toISOString() 
                });
                localStorage.setItem('lyk-subscribers', JSON.stringify(subscribers));
                
            }, 2000); // Simuler un délai réseau
        });
    }
    
    // Fonction pour initialiser le carousel
    function initCarousel() {
        const carouselTabs = document.querySelectorAll('.carousel-tab');
        const carousels = document.querySelectorAll('.carousel');
        const prevButtons = document.querySelectorAll('.carousel-prev');
        const nextButtons = document.querySelectorAll('.carousel-next');
        
        // Gestion des onglets
        carouselTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const target = this.getAttribute('data-target');
                
                // Désactiver tous les onglets et carousels
                carouselTabs.forEach(t => t.classList.remove('active'));
                carousels.forEach(c => c.classList.remove('active'));
                
                // Activer l'onglet et le carousel sélectionnés
                this.classList.add('active');
                document.getElementById(`${target}-carousel`).classList.add('active');
            });
        });
        
        // Gestion des boutons précédent/suivant
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const carousel = this.closest('.carousel');
                const track = carousel.querySelector('.carousel-track');
                const items = carousel.querySelectorAll('.carousel-item');
                
                // Logique pour passer à l'élément précédent
                const currentIndex = parseInt(track.getAttribute('data-position') || 0);
                const newIndex = (currentIndex - 1 + items.length) % items.length;
                
                track.style.transform = `translateX(-${newIndex * 100}%)`;
                track.setAttribute('data-position', newIndex);
            });
        });
        
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const carousel = this.closest('.carousel');
                const track = carousel.querySelector('.carousel-track');
                const items = carousel.querySelectorAll('.carousel-item');
                
                // Logique pour passer à l'élément suivant
                const currentIndex = parseInt(track.getAttribute('data-position') || 0);
                const newIndex = (currentIndex + 1) % items.length;
                
                track.style.transform = `translateX(-${newIndex * 100}%)`;
                track.setAttribute('data-position', newIndex);
            });
        });
        
        // Initialiser la position des tracks
        document.querySelectorAll('.carousel-track').forEach(track => {
            track.setAttribute('data-position', 0);
        });
    }
    
    // Fonction helper pour valider l'email
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Fonction pour afficher les messages de formulaire
    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';
            
            // Faire défiler jusqu'au message si nécessaire
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Masquer le message après un certain temps si c'est une réussite
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.style.opacity = '0';
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                        formMessage.style.opacity = '1';
                    }, 500);
                }, 5000);
            }
        }
    }
});'use strict';

document.addEventListener('DOMContentLoaded', function() {
    // Gestion du menu hamburger
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Défilement doux pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header réduit au défilement
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Animations au défilement
    const animateElements = document.querySelectorAll('.fade-in');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;
        
        animateElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;
            
            // Vérifier si l'élément est dans la fenêtre visible
            if (
                (elementBottomPosition >= windowTopPosition) &&
                (elementTopPosition <= windowBottomPosition)
            ) {
                element.classList.add('is-visible');
            }
        });
    }
    
    // Exécuter au chargement initial et au défilement
    window.addEventListener('scroll', checkIfInView);
    window.addEventListener('resize', checkIfInView);
    checkIfInView();
    
    // Animation de défilement sur le scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        setTimeout(() => {
            scrollIndicator.classList.add('animate');
        }, 2000);
    }
    
    // Gestion du formulaire
    const form = document.getElementById('newsletter-form');
    const formMessage = document.getElementById('form-message');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const preferences = document.getElementById('preferences') ? document.getElementById('preferences').checked : false;
            
            // Validation côté client
            if (!validateEmail(email)) {
                showFormMessage('Veuillez entrer une adresse email valide.', 'error');
                return;
            }
            
            // Simulation d'envoi à l'API
            // Dans un environnement réel, vous utiliseriez fetch() pour envoyer
            // les données à votre backend
            
            // Ajouter un indicateur de chargement
            const submitBtn = form.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            setTimeout(function() {
                // Simuler une réponse réussie
                showFormMessage("Merci de votre inscription ! Vous recevrez bientôt votre invitation privée.", 'success');
                
                // Réinitialiser le formulaire
                form.reset();
                
                // Réinitialiser le bouton
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Stocker temporairement dans localStorage (pour démo)
                const subscribers = JSON.parse(localStorage.getItem('lyk-subscribers') || '[]');
                subscribers.push({ 
                    name, 
                    email, 
                    preferences,
                    date: new Date().toISOString() 
                });
                localStorage.setItem('lyk-subscribers', JSON.stringify(subscribers));
                
            }, 2000); // Simuler un délai réseau
        });
    }
    
    // Fonction helper pour valider l'email
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Fonction pour afficher les messages de formulaire
    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';
            
            // Faire défiler jusqu'au message si nécessaire
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Masquer le message après un certain temps si c'est une réussite
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.style.opacity = '0';
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                        formMessage.style.opacity = '1';
                    }, 500);
                }, 5000);
            }
        }
    }
});'use strict';

document.addEventListener('DOMContentLoaded', function() {
    // Gestion du menu hamburger
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Défilement doux pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header réduit au défilement
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Animations au défilement
    const animateElements = document.querySelectorAll('.fade-in');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;
        
        animateElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;
            
            // Vérifier si l'élément est dans la fenêtre visible
            if (
                (elementBottomPosition >= windowTopPosition) &&
                (elementTopPosition <= windowBottomPosition)
            ) {
                element.classList.add('is-visible');
            }
        });
    }
    
    // Exécuter au chargement initial et au défilement
    window.addEventListener('scroll', checkIfInView);
    window.addEventListener('resize', checkIfInView);
    checkIfInView();
    
    // Gestion du formulaire
    const form = document.getElementById('newsletter-form');
    const formMessage = document.getElementById('form-message');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const preferences = document.getElementById('preferences').checked;
            
            // Validation côté client
            if (!validateEmail(email)) {
                showFormMessage('Veuillez entrer une adresse email valide.', 'error');
                return;
            }
            
            // Simulation d'envoi à l'API
            // Dans un environnement réel, vous utiliseriez fetch() pour envoyer
            // les données à votre backend
            
            // Ajouter un indicateur de chargement
            const submitBtn = form.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            setTimeout(function() {
                // Simuler une réponse réussie
                showFormMessage("Merci de votre inscription ! Vous recevrez bientôt votre invitation privée.", 'success');
                
                // Réinitialiser le formulaire
                form.reset();
                
                // Réinitialiser le bouton
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Stocker temporairement dans localStorage (pour démo)
                const subscribers = JSON.parse(localStorage.getItem('lyk-subscribers') || '[]');
                subscribers.push({ 
                    name, 
                    email, 
                    preferences,
                    date: new Date().toISOString() 
                });
                localStorage.setItem('lyk-subscribers', JSON.stringify(subscribers));
                
            }, 2000); // Simuler un délai réseau
        });
    }
    
    // Fonction helper pour valider l'email
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Fonction pour afficher les messages de formulaire
    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';
            
            // Faire défiler jusqu'au message si nécessaire
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Masquer le message après un certain temps si c'est une réussite
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.style.opacity = '0';
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                        formMessage.style.opacity = '1';
                    }, 500);
                }, 5000);
            }
        }
    }
});