const Auth = (() => {
    const CREDENTIALS = { username: 'aksamedia', password: 'password123' };
    let currentUser = JSON.parse(localStorage.getItem('user')) || { isAuthenticated: false, fullName: '' };

    const login = (username, password) => {
        if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
            currentUser = { isAuthenticated: true, fullName: 'Aksamedia User' };
            localStorage.setItem('user', JSON.stringify(currentUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('user');
        currentUser = { isAuthenticated: false, fullName: '' };
        window.location.href = 'Login.html';
    };

    const checkAuth = () => {
        if (!currentUser.isAuthenticated) {
            window.location.href = 'Login.html';
        }
    };

    const initLoginForm = () => {
        const form = document.getElementById('login-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorEl = document.getElementById('login-error');

            if (login(username, password)) {
                window.location.href = 'Dashboard.html';
            } else {
                errorEl.textContent = 'Username atau password salah.';
                errorEl.classList.remove('hidden');
            }
        });
    };
    
    const updateUser = (newName) => {
        if(currentUser.isAuthenticated) {
            currentUser.fullName = newName;
            localStorage.setItem('user', JSON.stringify(currentUser));
        }
    };

    return {
        logout,
        checkAuth,
        initLoginForm,
        updateUser,
        getUser: () => currentUser,
        isLoggedIn: () => currentUser.isAuthenticated,
    };
})();