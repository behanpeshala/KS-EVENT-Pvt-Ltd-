// Simple Demo Authentication for Admin
function login() {
    const pass = document.getElementById('admin-pass').value;
    if (pass === 'ksadmin123') {
        sessionStorage.setItem('ks_admin_auth', 'true');
        showDashboard();
    } else {
        alert('Invalid Password. Please try again.');
    }
}

// Listen for enter key on password input
const passInput = document.getElementById('admin-pass');
if (passInput) {
    passInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            login();
        }
    });
}

function logout() {
    sessionStorage.removeItem('ks_admin_auth');
    location.reload();
}

function checkAuth() {
    const isAuth = sessionStorage.getItem('ks_admin_auth');
    if (isAuth === 'true') {
        showDashboard();
    }
}

function showDashboard() {
    const loginSec = document.getElementById('login-section');
    const dashSec = document.getElementById('dashboard-content');
    
    if (loginSec && dashSec) {
        loginSec.style.display = 'none';
        dashSec.style.display = 'block';
        renderManageList();
    }
}

// Manage Portfolio
const addWorkForm = document.getElementById('add-work-form');
if (addWorkForm) {
    addWorkForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('work-title').value;
        const image = document.getElementById('work-image').value;
        const fbLink = document.getElementById('work-fb').value;

        const newItem = {
            id: Date.now().toString(),
            title,
            image,
            fbLink
        };

        const items = JSON.parse(localStorage.getItem('ks_events_portfolio')) || [];
        items.push(newItem);
        localStorage.setItem('ks_events_portfolio', JSON.stringify(items));

        this.reset();
        renderManageList();
        alert('Event added successfully! It will now appear on the main website.');
    });
}

function renderManageList() {
    const list = document.getElementById('manage-list');
    if (!list) return;

    const items = JSON.parse(localStorage.getItem('ks_events_portfolio')) || [];

    list.innerHTML = '';
    
    if (items.length === 0) {
        list.innerHTML = '<li style="justify-content:center; color:#888;">No events added yet. Use the form above to add your first event.</li>';
        return;
    }

    // Reverse to show newest at top in admin list too
    [...items].reverse().forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span style="display: flex; align-items: center; gap: 15px;">
                <i class="fas fa-image" style="color: #FFD700;"></i>
                <strong>${item.title}</strong>
            </span>
            <div>
                <a href="${item.fbLink}" target="_blank" style="color: #1877F2; margin-right: 15px; text-decoration: none;"><i class="fab fa-facebook"></i> View Link</a>
                <button onclick="deleteItem('${item.id}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

function deleteItem(id) {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
        let items = JSON.parse(localStorage.getItem('ks_events_portfolio')) || [];
        items = items.filter(item => item.id !== id);
        localStorage.setItem('ks_events_portfolio', JSON.stringify(items));
        renderManageList();
    }
}

// Initial Check on DOM Load
document.addEventListener('DOMContentLoaded', checkAuth);
