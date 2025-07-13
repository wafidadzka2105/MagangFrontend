// assets/Theme.js

const Theme = {
    // Pindahkan state ke dalam objek
    currentTheme: localStorage.getItem('theme') || 'system',

    /**
     * Menerapkan tema ke seluruh dokumen.
     */
    applyTheme: function() {
        const isDarkMode = this.currentTheme === 'dark' ||
                           (this.currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        document.documentElement.classList.toggle('dark', isDarkMode);
        
        document.querySelectorAll('.theme-switcher').forEach(btn => {
            if (btn) {
                btn.classList.toggle('bg-indigo-600', btn.dataset.theme === this.currentTheme);
                btn.classList.toggle('text-white', btn.dataset.theme === this.currentTheme);
            }
        });
        console.log(`🎨 Tema diterapkan: ${this.currentTheme} (Mode gelap: ${isDarkMode})`);
    },

    /**
     * Mengubah tema saat pengguna menekan tombol.
     */
    changeTheme: function(theme) {
        console.log(`🖱️ Tombol tema diklik: ${theme}`);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme();
    },

    /**
     * Fungsi inisialisasi untuk dijalankan dari halaman HTML.
     */
    init: function() {
        console.log("🚀 Theme.js diinisialisasi.");
        this.applyTheme();

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            console.log("💻 Deteksi perubahan tema OS...");
            if (this.currentTheme === 'system') {
                console.log("... Mode 'system' aktif, menerapkan perubahan.");
                this.applyTheme();
            } else {
                console.log("... Mode bukan 'system', diabaikan.");
            }
        });
    }
};