document.addEventListener('DOMContentLoaded', function() {
    // Simuler un système d'authentification basique
    const isLoggedIn = localStorage.getItem('lyk-admin-logged-in');
    const loginPage = document.getElementById('login-page');
    const dashboard = document.getElementById('dashboard');
    
    // Afficher la page de connexion ou le tableau de bord en fonction de l'état de connexion
    if (isLoggedIn) {
        loginPage.style.display = 'none';
        dashboard.style.display = 'flex';
        loadSubscribers();
    } else {
        loginPage.style.display = 'block';
        dashboard.style.display = 'none';
    }
    
    // Gestion de la connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Pour la démo, utiliser des identifiants simples
            if (username === 'admin' && password === 'admin') {
                localStorage.setItem('lyk-admin-logged-in', 'true');
                loginPage.style.display = 'none';
                dashboard.style.display = 'flex';
                loadSubscribers();
            } else {
                alert('Identifiants incorrects. Essayez admin/admin');
            }
        });
    }
    
    // Gestion de la déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('lyk-admin-logged-in');
            loginPage.style.display = 'block';
            dashboard.style.display = 'none';
        });
    }
    
    // Navigation du menu
    const subscribersMenu = document.getElementById('subscribers-menu');
    const newsletterMenu = document.getElementById('newsletter-menu');
    const dashboardContent = document.getElementById('dashboard-content');
    const subscribersContent = document.getElementById('subscribers-content');
    const newsletterContent = document.getElementById('newsletter-content');
    
    // Activer le menu utilisateurs
    if (subscribersMenu) {
        subscribersMenu.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Changer l'élément actif dans le menu
            document.querySelector('.menu-item.active').classList.remove('active');
            this.classList.add('active');
            
            // Afficher le contenu correspondant
            dashboardContent.style.display = 'none';
            newsletterContent.style.display = 'none';
            subscribersContent.style.display = 'block';
            
            // Charger les données complètes
            loadFullSubscribersList();
        });
    }
    
    // Activer le menu newsletter
    if (newsletterMenu) {
        newsletterMenu.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Changer l'élément actif dans le menu
            document.querySelector('.menu-item.active').classList.remove('active');
            this.classList.add('active');
            
            // Afficher le contenu correspondant
            dashboardContent.style.display = 'none';
            subscribersContent.style.display = 'none';
            newsletterContent.style.display = 'block';
        });
    }
    
    // Fonction pour charger les inscrits
    function loadSubscribers() {
        // Récupérer les données du localStorage
        const subscribers = JSON.parse(localStorage.getItem('lyk-subscribers') || '[]');
        
        // Mettre à jour les compteurs
        document.getElementById('total-subscribers').textContent = subscribers.length;
        
        // Calculer les nouveaux inscrits des 7 derniers jours
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const newSubscribers = subscribers.filter(sub => {
            const subDate = new Date(sub.date);
            return subDate >= oneWeekAgo;
        });
        
        document.getElementById('new-subscribers').textContent = newSubscribers.length;
        
        // Afficher les 5 derniers inscrits dans le tableau
        const tableBody = document.getElementById('subscribers-table-body');
        if (tableBody) {
            tableBody.innerHTML = '';
            
            // Trier par date décroissante
            const sortedSubscribers = [...subscribers].sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            
            // Prendre les 5 premiers
            const recentSubscribers = sortedSubscribers.slice(0, 5);
            
            recentSubscribers.forEach(sub => {
                const row = document.createElement('tr');
                
                const dateObj = new Date(sub.date);
                const formattedDate = dateObj.toLocaleDateString('fr-FR') + ' ' + 
                                      dateObj.toLocaleTimeString('fr-FR');
                
                row.innerHTML = `
                    <td>${sub.name}</td>
                    <td>${sub.email}</td>
                    <td>${formattedDate}</td>
                    <td><span class="status active">Actif</span></td>
                    <td class="actions">
                        <button class="action-btn view-subscriber" data-email="${sub.email}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn delete-subscriber" data-email="${sub.email}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
            
            // Attacher les événements aux boutons
            attachSubscriberEvents();
        }
    }
    
    // Fonction pour charger la liste complète des inscrits
    function loadFullSubscribersList() {
        const subscribers = JSON.parse(localStorage.getItem('lyk-subscribers') || '[]');
        const tableBody = document.getElementById('full-subscribers-table');
        
        if (tableBody) {
            tableBody.innerHTML = '';
            
            // Trier par date décroissante
            const sortedSubscribers = [...subscribers].sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            
            sortedSubscribers.forEach(sub => {
                const row = document.createElement('tr');
                
                const dateObj = new Date(sub.date);
                const formattedDate = dateObj.toLocaleDateString('fr-FR') + ' ' + 
                                      dateObj.toLocaleTimeString('fr-FR');
                
                row.innerHTML = `
                    <td><input type="checkbox" class="subscriber-checkbox" data-email="${sub.email}"></td>
                    <td>${sub.name}</td>
                    <td>${sub.email}</td>
                    <td>${formattedDate}</td>
                    <td><span class="status active">Actif</span></td>
                    <td class="actions">
                        <button class="action-btn view-subscriber" data-email="${sub.email}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn delete-subscriber" data-email="${sub.email}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
            
            // Attacher les événements aux boutons
            attachSubscriberEvents();
            
            // Gestion de "Sélectionner tout"
            const selectAllCheckbox = document.getElementById('select-all');
            if (selectAllCheckbox) {
                selectAllCheckbox.addEventListener('change', function() {
                    const checkboxes = document.querySelectorAll('.subscriber-checkbox');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = this.checked;
                    });
                });
            }
            
            // Gestion de l'export CSV
            const exportCsvBtn = document.getElementById('export-csv-btn');
            if (exportCsvBtn) {
                exportCsvBtn.addEventListener('click', function() {
                    exportSubscribersCSV(subscribers);
                });
            }
        }
    }
    
    // Fonction pour attacher les événements aux boutons des inscrits
    function attachSubscriberEvents() {
        // Boutons de visualisation
        document.querySelectorAll('.view-subscriber').forEach(btn => {
            btn.addEventListener('click', function() {
                const email = this.getAttribute('data-email');
                viewSubscriber(email);
            });
        });
        
        // Boutons de suppression
        document.querySelectorAll('.delete-subscriber').forEach(btn => {
            btn.addEventListener('click', function() {
                const email = this.getAttribute('data-email');
                showDeleteConfirmation(email);
            });
        });
    }
    
    // Fonction pour afficher les détails d'un inscrit
    function viewSubscriber(email) {
        const subscribers = JSON.parse(localStorage.getItem('lyk-subscribers') || '[]');
        const subscriber = subscribers.find(sub => sub.email === email);
        
        if (subscriber) {
            const modal = document.getElementById('view-subscriber-modal');
            const details = document.getElementById('subscriber-details');
            
            const dateObj = new Date(subscriber.date);
            const formattedDate = dateObj.toLocaleDateString('fr-FR') + ' ' + 
                                  dateObj.toLocaleTimeString('fr-FR');
            
            details.innerHTML = `
                <p><strong>Nom:</strong> ${subscriber.name}</p>
                <p><strong>Email:</strong> ${subscriber.email}</p>
                <p><strong>Date d'inscription:</strong> ${formattedDate}</p>
                <p><strong>Statut:</strong> <span class="status active">Actif</span></p>
            `;
            
            modal.style.display = 'flex';
            
            // Fermer le modal
            document.querySelectorAll('.close-modal').forEach(btn => {
                btn.addEventListener('click', function() {
                    modal.style.display = 'none';
                });
            });
            
            // Fermer en cliquant en dehors
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }
    
    // Fonction pour afficher la confirmation de suppression
    function showDeleteConfirmation(email) {
        const modal = document.getElementById('confirm-delete-modal');
        const confirmBtn = document.getElementById('confirm-delete-btn');
        
        modal.style.display = 'flex';
        
        // Action de confirmation
        confirmBtn.onclick = function() {
            deleteSubscriber(email);
            modal.style.display = 'none';
        };
        
        // Fermer le modal
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        });
        
        // Fermer en cliquant en dehors
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Fonction pour supprimer un inscrit
    function deleteSubscriber(email) {
        let subscribers = JSON.parse(localStorage.getItem('lyk-subscribers') || '[]');
        subscribers = subscribers.filter(sub => sub.email !== email);
        localStorage.setItem('lyk-subscribers', JSON.stringify(subscribers));
        
        // Recharger les données
        loadSubscribers();
        loadFullSubscribersList();
    }
    
    // Fonction pour exporter les inscrits en CSV
    function exportSubscribersCSV(subscribers) {
        // Créer les en-têtes
        let csv = 'Nom,Email,Date d\'inscription\n';
        
        // Ajouter les données
        subscribers.forEach(sub => {
            const dateObj = new Date(sub.date);
            const formattedDate = dateObj.toLocaleDateString('fr-FR') + ' ' + 
                                  dateObj.toLocaleTimeString('fr-FR');
            csv += `${sub.name},${sub.email},"${formattedDate}"\n`;
        });
        
        // Créer un élément d'ancrage pour le téléchargement
        const link = document.createElement('a');
        link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        link.download = 'lyk-subscribers.csv';
        
        // Ajouter au document, cliquer, puis supprimer
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});