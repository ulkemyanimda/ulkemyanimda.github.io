// Global state used for analysis
let allTeachers = [];
let chartInstance = null;
let pieChartInstance = null;
let rawData = []; // Store raw CSV data for re-processing

// Default settings
let settings = {
    refDate: new Date(),
    thresholdRisky: 7,
    thresholdCritical: 30
};

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    // Set default date in input
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('ref-date').value = today;

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('Tarayıcınız dosya okuma özelliğini desteklemiyor. Lütfen modern bir tarayıcı kullanın.');
    }
});

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    toast.classList.add('toast-enter');
    setTimeout(() => {
        toast.classList.remove('toast-enter');
    }, 3000);
}

// File Drag & Drop Handlers
function handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('border-primary'); // Remove highlight
    if (e.dataTransfer.files.length) {
        document.getElementById('fileInput').files = e.dataTransfer.files;
        handleFileUpload({ files: e.dataTransfer.files });
    }
}

// Main File Upload Handler
function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
        showToast('Lütfen sadece .csv uzantılı dosya yükleyin.');
        return;
    }

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            console.log("CSV Parsed:", results);
            if (results.data && results.data.length > 0) {
                rawData = results.data; // Store for re-calc
                recalculateAll(); // Initial calculation

                // UI Switch
                document.getElementById('upload-zone').classList.add('hidden');
                document.getElementById('dashboard').classList.remove('hidden');

                showToast(`${results.data.length} kayıt başarıyla analiz edildi.`);
            } else {
                showToast('Hata: Dosya boş veya hatalı format.');
            }
        },
        error: function (error) {
            console.error("CSV Error:", error);
            showToast('Dosya okunurken bir hata oluştu.');
        }
    });
}

// Read settings from UI
function updateSettings() {
    const dateInput = document.getElementById('ref-date').value;
    settings.refDate = dateInput ? new Date(dateInput) : new Date();

    // Set time to end of day to be inclusive/fair? Or stick to simple logic.
    // Let's keep it simple: parsed date vs input date.

    settings.thresholdRisky = parseInt(document.getElementById('threshold-risky').value) || 7;
    settings.thresholdCritical = parseInt(document.getElementById('threshold-critical').value) || 30;

    // Update UI Labels
    document.getElementById('label-active').textContent = `Son ${settings.thresholdRisky} Gün`;
    document.getElementById('label-risky').textContent = `${settings.thresholdRisky}-${settings.thresholdCritical} Gün`;
    document.getElementById('label-critical').textContent = `>${settings.thresholdCritical} Gün`;
}

// Re-run everything (called by "Ayarları Uygula" button)
function recalculateAll() {
    if (!rawData || rawData.length === 0) return;
    updateSettings();
    processData(rawData);
    showToast('Ayarlar uygulandı ve veriler güncellendi.');
}


// Core Data Processing Logic
function processData(data) {
    const now = settings.refDate;
    const riskyThresh = settings.thresholdRisky;
    const criticalThresh = settings.thresholdCritical;

    // Process each teacher row
    allTeachers = data.map(row => {
        const lastActivityStr = row['teacher_last_activity'];
        let daysInactive = -1;
        let lastActivityDate = null;

        if (lastActivityStr) {
            // Check formatted like "2026-01-17 12:03:41"
            const isoStr = lastActivityStr.replace(' ', 'T');
            lastActivityDate = new Date(isoStr);

            if (!isNaN(lastActivityDate)) {
                const diffTime = now - lastActivityDate; // Can be negative if ref date is before activity
                // If diffTime < 0, it means activity is in the future relative to ref date. Treat as 0 or ignore?
                // Let's use absolute diff?? No, "Inactive" implies past.
                // If I set ref date to 2025, and activity is 2026, days inactive should be.. negative?
                // Let's use Math.floor(diff / day).

                daysInactive = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            }
        }

        // Determine Category
        let category = 'unknown';
        if (daysInactive === -1 || lastActivityDate === null) {
            category = 'unknown';
        } else if (daysInactive <= riskyThresh) {
            category = 'active';
        } else if (daysInactive <= criticalThresh) {
            category = 'risky';
        } else {
            category = 'inactive';
        }

        return {
            id: row['id'] || '-',
            name: `${row['firstname'] || ''} ${row['lastname'] || ''}`.trim(),
            course: row['course_name'] || 'Belirtilmemiş',
            lastActivity: lastActivityStr || 'Veri Yok',
            parsedDate: lastActivityDate,
            daysInactive: daysInactive,
            category: category
        };
    });

    updateDashboard();
}

// Update UI Elements
function updateDashboard() {
    // 1. Calculate Stats
    const total = allTeachers.length;
    const active = allTeachers.filter(t => t.category === 'active').length;
    const risky = allTeachers.filter(t => t.category === 'risky').length;
    const inactive = allTeachers.filter(t => t.category === 'inactive').length;

    // 2. Update Card Numbers
    animateValue("total-teachers", parseInt(document.getElementById("total-teachers").innerText), total, 500);
    animateValue("active-teachers", parseInt(document.getElementById("active-teachers").innerText), active, 500);
    animateValue("risky-teachers", parseInt(document.getElementById("risky-teachers").innerText), risky, 500);
    animateValue("inactive-teachers", parseInt(document.getElementById("inactive-teachers").innerText), inactive, 500);

    // 3. Update Charts
    renderCharts(active, risky, inactive, total);

    // 4. Populate Table (Initially show all, or keep current filter?)
    // Reset to showing all to avoid confusion after settings change
    document.getElementById('current-filter').textContent = 'Tümü - ' + document.getElementById('label-active').textContent + ' kriteri baz alındı';
    renderTable(allTeachers);
}

// Number Animation Utility
function animateValue(id, start, end, duration) {
    if (start === end) return;
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    const obj = document.getElementById(id);

    // Clear existing interval if any (not implemented here but good practice)

    const timer = setInterval(function () {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime > 0 ? stepTime : 10);
}

// Render Charts with Chart.js
function renderCharts(active, risky, inactive, total) {
    const ctxBar = document.getElementById('activityChart').getContext('2d');
    const ctxPie = document.getElementById('pieChart').getContext('2d');

    // Destroy existing if re-uploading
    if (chartInstance) chartInstance.destroy();
    if (pieChartInstance) pieChartInstance.destroy();

    const labels = [
        `Aktif (<= ${settings.thresholdRisky} Gün)`,
        `Riskli (${settings.thresholdRisky}-${settings.thresholdCritical} Gün)`,
        `Kritik (> ${settings.thresholdCritical} Gün)`
    ];

    // Bar Chart
    chartInstance = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Öğretmen Sayısı',
                data: [active, risky, inactive],
                backgroundColor: [
                    'rgba(74, 222, 128, 0.7)', // Green
                    'rgba(250, 204, 21, 0.7)', // Yellow
                    'rgba(248, 113, 113, 0.7)'  // Red
                ],
                borderColor: [
                    'rgba(74, 222, 128, 1)',
                    'rgba(250, 204, 21, 1)',
                    'rgba(248, 113, 113, 1)'
                ],
                borderWidth: 1,
                borderRadius: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#e2e8f0',
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const categories = ['active', 'risky', 'inactive'];
                    filterTableByCategory(categories[index]);
                }
            }
        }
    });

    // Pie Chart
    pieChartInstance = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['Aktif', 'Riskli', 'Kritik', 'Bilinmeyen'],
            datasets: [{
                data: [active, risky, inactive, total - (active + risky + inactive)],
                backgroundColor: [
                    '#4ade80',
                    '#facc15',
                    '#f87171',
                    '#94a3b8'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#cbd5e1', padding: 20, usePointStyle: true }
                }
            },
            cutout: '70%',
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const categories = ['active', 'risky', 'inactive', 'unknown'];
                    filterTableByCategory(categories[index]);
                }
            }
        }
    });
}

function filterTableByCategory(category) {
    const filtered = allTeachers.filter(t => t.category === category);

    // Update Title Tag UI
    const labels = {
        'active': `Aktif (<= ${settings.thresholdRisky} Gün)`,
        'risky': `Riskli (${settings.thresholdRisky}-${settings.thresholdCritical} Gün)`,
        'inactive': `Kritik (> ${settings.thresholdCritical} Gün)`,
        'unknown': 'Veri Yok'
    };

    document.getElementById('current-filter').textContent = labels[category] || 'Tümü';

    renderTable(filtered);
    showToast(`${filtered.length} kayıt listelendi.`);
}

function renderTable(data) {
    const tbody = document.getElementById('teachers-table-body');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-slate-500">Kayıt bulunamadı.</td></tr>';
        document.getElementById('showing-count').textContent = 0;
        return;
    }

    const fragment = document.createDocumentFragment();

    data.forEach(teacher => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors';

        // Status Badge Logic
        let statusBadge = '';
        if (teacher.category === 'active') {
            statusBadge = `<span class="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/20">Aktif (${teacher.daysInactive} gün)</span>`;
        } else if (teacher.category === 'risky') {
            statusBadge = `<span class="px-2 py-1 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/20">Riskli (${teacher.daysInactive} gün)</span>`;
        } else if (teacher.category === 'inactive') {
            statusBadge = `<span class="px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/20">Kritik (${teacher.daysInactive} gün)</span>`;
        } else {
            statusBadge = `<span class="px-2 py-1 rounded text-xs font-bold bg-slate-500/20 text-slate-400">Veri Yok</span>`;
        }

        tr.innerHTML = `
            <td class="p-4 text-sm font-mono text-slate-400">${teacher.id}</td>
            <td class="p-4 text-sm font-medium text-white">${teacher.name}</td>
            <td class="p-4 text-sm text-slate-300 max-w-[200px] truncate" title="${teacher.course}">${teacher.course}</td>
            <td class="p-4 text-sm text-slate-300">${teacher.lastActivity}</td>
            <td class="p-4">${statusBadge}</td>
        `;
        fragment.appendChild(tr);
    });

    tbody.appendChild(fragment);
    document.getElementById('showing-count').textContent = data.length;
}

// Text Search Filter
function filterTable() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allTeachers.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.course.toLowerCase().includes(query) ||
        t.id.toString().includes(query)
    );
    renderTable(filtered);
}

// Export Functionality
function exportTableToCSV() {
    // Current approach: export based on the current logical filter if possible, 
    // but users might want exactly what they see (including search).
    // Let's grab the IDs of the visible rows? Or just re-apply filters.
    // Re-applying filters is cleaner.

    const filterText = document.getElementById('current-filter').textContent;
    let dataToExport = allTeachers;

    if (filterText.includes("Aktif")) dataToExport = allTeachers.filter(t => t.category === 'active');
    else if (filterText.includes("Riskli")) dataToExport = allTeachers.filter(t => t.category === 'risky');
    else if (filterText.includes("Kritik")) dataToExport = allTeachers.filter(t => t.category === 'inactive');

    const query = document.getElementById('searchInput').value.toLowerCase();
    if (query) {
        dataToExport = dataToExport.filter(t =>
            t.name.toLowerCase().includes(query) ||
            t.course.toLowerCase().includes(query)
        );
    }

    if (dataToExport.length === 0) {
        showToast('İndirilecek veri yok.');
        return;
    }

    const csvContent = Papa.unparse(dataToExport.map(t => ({
        ID: t.id,
        Isim: t.name,
        Ders: t.course,
        SonAktivite: t.lastActivity,
        GunSayisi: t.daysInactive,
        Durum: t.category
    })));

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ogretmen_raporu_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
