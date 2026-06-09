document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const searchClearBtn = document.getElementById('search-clear');
    const filtersContainer = document.getElementById('filters-container');
    const categoriesContainer = document.getElementById('categories-container');
    const emptyState = document.getElementById('empty-state');

    // Global state
    let activeCategory = 'Tümü';
    let searchQuery = '';

    // Initialize application
    init();

    function init() {
        renderFilters();
        renderGallery();
        setupEventListeners();
    }

    // Generate dynamic category fallback titles for items that don't have text titles
    function getFallbackTitle(categoryName, index) {
        const titleMap = {
            "Akademik Destek Çalışma Sayfaları": "Akademik Destek Çalışma Sayfası",
            "Uyarlanmış Etkinlikler": "Uyarlanmış Etkinlik Sayfası",
            "Farklılaştırılmış Öğretim Etkinlikleri": "Farklılaştırılmış Öğretim Materyali",
            "Otizm Spektrum Bozukluğu Olan Öğrenciler için Etkinlik Kitabı": "Otizm Etkinlik Kitabı",
            "Yaşam Becerileri Etkinlikleri": "Yaşam Becerileri Sayfası",
            "Özel Eğitim Çocuk Dergisi Arşivi": "Özel Eğitim Çocuk Dergisi",
            "Özel Eğitim Çocuk Dergisi": "Çocuk Dergisi",
            "Sosyal Duygusal Becerileri Desteklemeye Yönelik Hikaye Kitapları": "Sosyal Duygusal Hikaye Kitabı",
            "Diğer Kaynaklar": "Özel Eğitim Kaynağı"
        };
        const base = titleMap[categoryName] || "Destek Materyali";
        return `${base} #${index + 1}`;
    }

    // Render category buttons (filters) dynamically at the top
    function renderFilters() {
        filtersContainer.innerHTML = '';

        // Add 'Tümü' filter
        const allBtn = document.createElement('button');
        allBtn.className = `filter-btn ${activeCategory === 'Tümü' ? 'active' : ''}`;
        allBtn.textContent = 'Tümü';
        allBtn.dataset.category = 'Tümü';
        filtersContainer.appendChild(allBtn);

        // Add buttons for each category in data
        OzelEgitimData.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `filter-btn ${activeCategory === cat.category ? 'active' : ''}`;
            btn.textContent = cat.category;
            btn.dataset.category = cat.category;
            filtersContainer.appendChild(btn);
        });
    }

    // Render the grid of categories and items based on search and category filters
    function renderGallery() {
        categoriesContainer.innerHTML = '';
        let totalRenderedItems = 0;

        // Filter the category data
        OzelEgitimData.forEach(cat => {
            // If filtering by specific category, skip others
            if (activeCategory !== 'Tümü' && cat.category !== activeCategory) {
                return;
            }

            // Filter items in this category by search query
            const filteredItems = cat.items.filter(item => {
                if (!searchQuery) return true;
                
                const q = searchQuery.toLowerCase();
                const titleMatch = item.title && item.title.toLowerCase().includes(q);
                const altMatch = item.alt && item.alt.toLowerCase().includes(q);
                const categoryMatch = cat.category.toLowerCase().includes(q);
                
                return titleMatch || altMatch || categoryMatch;
            });

            if (filteredItems.length === 0) {
                return; // Skip category if it has no matching items
            }

            totalRenderedItems += filteredItems.length;

            // Create category section container
            const section = document.createElement('section');
            section.className = 'category-section';

            // Create category header with count
            const header = document.createElement('div');
            header.className = 'category-header';
            header.innerHTML = `
                <h2 class="category-title">${cat.category}</h2>
                <span class="item-count-badge">${filteredItems.length} İçerik</span>
            `;
            section.appendChild(header);

            // Create cards grid container
            const grid = document.createElement('div');
            grid.className = 'cards-grid';

            // Render cards inside grid
            filteredItems.forEach((item, idx) => {
                const card = document.createElement('div');
                card.className = 'book-card';

                // Resolve title
                const titleText = item.title || getFallbackTitle(cat.category, idx);

                card.innerHTML = `
                    <div class="cover-container">
                        <img class="cover-image" src="${item.image}" alt="${item.alt || 'Kitap Kapağı'}" loading="lazy" onerror="this.src='icons/kitap.png'">
                        <div class="card-overlay">
                            <a href="${item.href}" target="_blank" class="action-btn">
                                <svg viewBox="0 0 24 24">
                                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                                </svg>
                                <span>Aç / Oku</span>
                            </a>
                        </div>
                    </div>
                    <div class="card-body">
                        <span class="card-badge" title="${cat.category}">${cat.category}</span>
                        <h3 class="card-title" title="${titleText}">${titleText}</h3>
                    </div>
                `;
                grid.appendChild(card);
            });

            section.appendChild(grid);
            categoriesContainer.appendChild(section);
        });

        // Show/hide empty state
        if (totalRenderedItems === 0) {
            emptyState.style.display = 'flex';
        } else {
            emptyState.style.display = 'none';
        }
    }

    // Set up search and filter event listeners
    function setupEventListeners() {
        // Filter button click handler
        filtersContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            // Remove active class from old filter, add to new
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            activeCategory = btn.dataset.category;
            renderGallery();
        });

        // Search inputs
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            
            // Show/hide clear search button
            if (searchQuery.length > 0) {
                searchClearBtn.style.display = 'flex';
            } else {
                searchClearBtn.style.display = 'none';
            }

            renderGallery();
        });

        // Clear search input
        searchClearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            searchClearBtn.style.display = 'none';
            searchInput.focus();
            renderGallery();
        });
    }
});
