const Theme = (() => {
    // 1. Inisialisasi State
    // Mengambil tema dari Local Storage. Jika tidak ada, default-nya adalah 'system'.
    let currentTheme = localStorage.getItem('theme') || 'system';

    /**
     * Menerapkan tema ke seluruh dokumen berdasarkan state `currentTheme`.
     * Fungsi ini adalah inti dari logika tampilan.
     */
    const applyTheme = () => {
        // Tentukan apakah mode gelap harus aktif.
        // Kondisinya: (pilihan adalah 'dark') ATAU (pilihan adalah 'system' DAN OS dalam mode gelap)
        const isDarkMode = currentTheme === 'dark' ||
                           (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        // Terapkan atau hapus class 'dark' pada tag <html> untuk mengaktifkan style dark mode Tailwind.
        document.documentElement.classList.toggle('dark', isDarkMode);
        
        // Perbarui juga style tombol tema yang sedang aktif di navbar.
        document.querySelectorAll('.theme-switcher').forEach(btn => {
            if (btn) {
                btn.classList.toggle('bg-indigo-600', btn.dataset.theme === currentTheme);
                btn.classList.toggle('text-white', btn.dataset.theme === currentTheme);
            }
        });
    };

    /**
     * Mengubah tema saat pengguna menekan tombol pilihan tema.
     * @param {string} theme - Pilihan tema baru ('light', 'dark', atau 'system').
     */
    const changeTheme = (theme) => {
        currentTheme = theme;
        localStorage.setItem('theme', theme); // Simpan pilihan baru ke Local Storage agar persisten.
        applyTheme(); // Langsung terapkan tema yang baru dipilih.
    };

    /**
     * Fungsi inisialisasi yang dijalankan sekali saat skrip dimuat.
     */
    const init = () => {
        // Langsung terapkan tema yang benar saat halaman pertama kali dibuka.
        applyTheme();

        // 2. Listener untuk Perubahan OS
        // Tambahkan "pendengar" untuk mendeteksi jika pengguna mengubah tema di level OS.
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            // Penting: Hanya bereaksi dan menerapkan tema baru jika pilihan di web adalah 'system'.
            if (currentTheme === 'system') {
                applyTheme();
            }
        });
    };
    
    // Jalankan fungsi inisialisasi.
    init();

    // 3. Ekpos Fungsi
    // Hanya fungsi yang perlu diakses dari luar yang diekspos.
    return {
        changeTheme,
        applyTheme
    };
})();