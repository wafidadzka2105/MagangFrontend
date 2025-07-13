const Crud = (() => {
    let employees = JSON.parse(localStorage.getItem('employees')) || [];

    const saveEmployees = () => localStorage.setItem('employees', JSON.stringify(employees));

    const generateDummyData = () => {
        employees = [
            { id: 1, name: 'Budi Santoso', position: 'Frontend Developer', email: 'budi.s@example.com' },
            { id: 2, name: 'Agus Purnomo', position: 'Backend Developer', email: 'agus.p@example.com' },
            { id: 3, name: 'Citra Lestari', position: 'UI/UX Designer', email: 'citra.l@example.com' },
            { id: 4, name: 'Dewi Anggraini', position: 'Project Manager', email: 'dewi.a@example.com' },
            { id: 5, name: 'Eko Wahyudi', position: 'DevOps Engineer', email: 'eko.w@example.com' },
            { id: 6, name: 'Fitri Handayani', position: 'QA Engineer', email: 'fitri.h@example.com' },
            { id: 7, name: 'Gilang Ramadhan', position: 'Frontend Developer', email: 'gilang.r@example.com' },
        ];
        saveEmployees();
    };

    const getQueryParam = (param) => new URLSearchParams(window.location.search).get(param);
    const updateURL = (queryString) => {
        const newUrl = `${window.location.pathname}?${queryString}`;
        history.pushState(null, null, newUrl);
    };

    const renderTable = () => {
        const tbody = document.getElementById('crud-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        const currentPage = parseInt(getQueryParam('page')) || 1;
        const searchTerm = (getQueryParam('search') || '').toLowerCase();
        const itemsPerPage = 5;

        const filteredEmployees = employees.filter(emp => 
            emp.name.toLowerCase().includes(searchTerm) || 
            emp.position.toLowerCase().includes(searchTerm)
        );
        
        const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
        const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

        if (paginatedEmployees.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center py-8">Tidak ada data ditemukan.</td></tr>`;
        } else {
            paginatedEmployees.forEach(emp => {
                const row = `
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium">${emp.name}</div>
                            <div class="text-sm text-gray-500 md:hidden">${emp.position}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap hidden md:table-cell">${emp.position}</td>
                        <td class="px-6 py-4 whitespace-nowrap hidden sm:table-cell">${emp.email}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button data-id="${emp.id}" class="edit-btn text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</button>
                            <button data-id="${emp.id}" class="delete-btn text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Hapus</button>
                        </td>
                    </tr>`;
                tbody.insertAdjacentHTML('beforeend', row);
            });
        }
        
        renderPagination(currentPage, totalPages);
    };

    const renderPagination = (currentPage, totalPages) => {
        const controls = document.getElementById('pagination-controls');
        if (!controls) return;
        controls.innerHTML = '';
        if (totalPages <= 1) return;

        let html = '<div class="flex items-center space-x-1">';
        html += `<button data-page="${currentPage - 1}" class="prev-page px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>`;
        for (let i = 1; i <= totalPages; i++) {
            html += i === currentPage ? `<span class="px-3 py-1 rounded-md bg-indigo-600 text-white">${i}</span>` : `<button data-page="${i}" class="page-number px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300">${i}</button>`;
        }
        html += `<button data-page="${currentPage + 1}" class="next-page px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;
        html += '</div>';
        controls.innerHTML = html;
    };

    const showModal = (employee = null) => {
        const modal = document.getElementById('crud-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('crud-form');
        form.reset();
        document.getElementById('edit-id').value = '';

        if (employee) {
            title.textContent = 'Edit Karyawan';
            document.getElementById('edit-id').value = employee.id;
            document.getElementById('modal-name').value = employee.name;
            document.getElementById('modal-position').value = employee.position;
            document.getElementById('modal-email').value = employee.email;
        } else {
            title.textContent = 'Tambah Karyawan';
        }
        modal.classList.remove('hidden');
    };
    
    const hideModal = () => document.getElementById('crud-modal').classList.add('hidden');

    const initEventListeners = () => {
        document.getElementById('add-data-button')?.addEventListener('click', () => showModal());
        document.getElementById('crud-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-id').value;
            const employeeData = {
                name: document.getElementById('modal-name').value,
                position: document.getElementById('modal-position').value,
                email: document.getElementById('modal-email').value,
            };
            if (id) {
                const index = employees.findIndex(emp => emp.id == id);
                employees[index] = { ...employees[index], ...employeeData };
            } else {
                employeeData.id = Date.now();
                employees.unshift(employeeData);
            }
            saveEmployees();
            hideModal();
            renderTable();
        });
        document.getElementById('cancel-modal-button')?.addEventListener('click', hideModal);
        document.getElementById('crud-table-body')?.addEventListener('click', (e) => {
            const target = e.target;
            const id = target.dataset.id;
            if (!id) return;
            if (target.classList.contains('edit-btn')) {
                const employee = employees.find(emp => emp.id == id);
                showModal(employee);
            } else if (target.classList.contains('delete-btn')) {
                if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                    employees = employees.filter(emp => emp.id != id);
                    saveEmployees();
                    renderTable();
                }
            }
        });
        
        let searchTimeout;
        document.getElementById('search-input')?.addEventListener('input', e => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const params = new URLSearchParams(window.location.search);
                params.set('search', e.target.value.trim());
                params.set('page', '1');
                updateURL(params.toString());
                renderTable();
            }, 300);
        });

        document.getElementById('pagination-controls')?.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (target && !target.disabled) {
                const page = target.dataset.page;
                if (page) {
                    const params = new URLSearchParams(window.location.search);
                    params.set('page', page);
                    updateURL(params.toString());
                    renderTable();
                }
            }
        });
    };

    const init = () => {
        if (employees.length === 0) {
            generateDummyData();
        }
        const params = new URLSearchParams(window.location.search);
        document.getElementById('search-input').value = params.get('search') || '';
        renderTable();
        initEventListeners();
    };

    return {
        init
    };
})();