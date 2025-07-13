const Utils = (() => {
    const renderNavbar = (activePage) => {
        const user = Auth.getUser();
        if (!user.isAuthenticated) return;

        const placeholder = document.getElementById('navbar-placeholder');
        if (!placeholder) return;
        
        const dashboardActive = activePage === 'dashboard' ? 'bg-gray-900 text-white dark:bg-gray-700' : '';
        const crudActive = activePage === 'crud' ? 'bg-gray-900 text-white dark:bg-gray-700' : '';

        const navbarHTML = `
            <nav class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16">
                        <div class="flex items-center">
                            <a href="Dashboard.html" class="font-bold text-xl text-indigo-600 dark:text-indigo-400">Aksamedia</a>
                            <div class="hidden md:block">
                                <div class="ml-10 flex items-baseline space-x-4">
                                    <a href="Dashboard.html" class="nav-link px-3 py-2 rounded-md text-sm font-medium ${dashboardActive}">Dashboard</a>
                                    <a href="CRUD.html" class="nav-link px-3 py-2 rounded-md text-sm font-medium ${crudActive}">CRUD Karyawan</a>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="relative">
                                <button id="user-menu-button" class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
                                    <span id="navbar-user-name" class="font-medium text-sm">${user.fullName}</span>
                                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                                </button>
                                <div id="dropdown-menu" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 hidden z-40">
                                    <div class="px-4 py-2 text-xs text-gray-400">Kelola Akun</div>
                                    <a href="EditProfile.html" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Edit Profil</a>
                                    <button id="logout-button" class="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                                    <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                    <div class="px-4 py-2 text-xs text-gray-400">Theme</div>
                                    <div class="flex justify-around p-1">
                                        <button data-theme="light" class="theme-switcher p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">☀️</button>
                                        <button data-theme="dark" class="theme-switcher p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">🌙</button>
                                        <button data-theme="system" class="theme-switcher p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">💻</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>`;
        placeholder.innerHTML = navbarHTML;
        attachNavbarListeners();
    };

    const attachNavbarListeners = () => {
        document.getElementById('logout-button')?.addEventListener('click', Auth.logout);
        
        const userMenuButton = document.getElementById('user-menu-button');
        const dropdownMenu = document.getElementById('dropdown-menu');

        userMenuButton?.addEventListener('click', () => {
            dropdownMenu.classList.toggle('hidden');
        });
        
        document.addEventListener('click', (e) => {
             if (userMenuButton && dropdownMenu && !userMenuButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
             }
        });

        document.querySelectorAll('.theme-switcher').forEach(button => {
            button.addEventListener('click', (e) => Theme.changeTheme(e.currentTarget.dataset.theme));
        });
        // Panggil applyTheme setelah render untuk memastikan style tombol benar
        Theme.applyTheme(); 
    };
    
    const initProfileForm = () => {
        const form = document.getElementById('profile-form');
        if(!form) return;

        const user = Auth.getUser();
        document.getElementById('profile-fullname').value = user.fullName;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = document.getElementById('profile-fullname').value.trim();
            const successEl = document.getElementById('profile-success');

            if (newName) {
                Auth.updateUser(newName);
                document.getElementById('navbar-user-name').textContent = newName;
                successEl.textContent = "Nama berhasil diperbarui!";
                successEl.classList.remove('hidden');
                setTimeout(() => successEl.classList.add('hidden'), 3000);
            }
        });
    };

    return {
        renderNavbar,
        initProfileForm
    };
})();