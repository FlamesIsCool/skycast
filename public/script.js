// Simple client-side user management using localStorage
const usersKey = 'skycastUsers';
const currentUserKey = 'skycastCurrentUser';

function getUsers() {
    const data = localStorage.getItem(usersKey);
    return data ? JSON.parse(data) : {};
}

function saveUsers(users) {
    localStorage.setItem(usersKey, JSON.stringify(users));
}

function setCurrentUser(username) {
    localStorage.setItem(currentUserKey, username);
}

function getCurrentUser() {
    return localStorage.getItem(currentUserKey);
}

function clearCurrentUser() {
    localStorage.removeItem(currentUserKey);
}

// Registration
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const users = getUsers();
        if (users[username]) {
            alert('User already exists');
            return;
        }
        users[username] = { password };
        saveUsers(users);
        alert('Registration successful. Please login.');
        window.location.href = 'index.html';
    });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const users = getUsers();
        if (!users[username] || users[username].password !== password) {
            alert('Invalid credentials');
            return;
        }
        setCurrentUser(username);
        window.location.href = 'dashboard.html';
    });
}

// Dashboard functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        clearCurrentUser();
        window.location.href = 'index.html';
    });
}

const weatherForm = document.getElementById('weatherForm');
if (weatherForm) {
    // Ensure a user is logged in
    if (!getCurrentUser()) {
        window.location.href = 'index.html';
    }

    weatherForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = document.getElementById('cityInput').value;
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=6e95652c9e7df447f313d1ce6b0601a3&units=metric`)
            .then(resp => {
                if (!resp.ok) throw new Error('City not found');
                return resp.json();
            })
            .then(data => {
                const resultDiv = document.getElementById('weatherResult');
                resultDiv.innerHTML = `
                    <h3>Weather for ${data.name}</h3>
                    <p>Temperature: ${data.main.temp}&deg;C</p>
                    <p>Condition: ${data.weather[0].description}</p>
                `;
            })
            .catch(err => {
                alert('Error fetching weather: ' + err.message);
            });
    });
}
