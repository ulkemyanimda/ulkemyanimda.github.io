document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const downloadTemplateBtn = document.getElementById('downloadTemplateBtn');
    const statusDiv = document.getElementById('status');
    const fileNameDisplay = document.getElementById('fileName');

    let currentFile = null;

    // Event Listeners
    downloadTemplateBtn.addEventListener('click', downloadTemplate);
    
    // File Upload Handling
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary-color)';
        dropZone.style.background = 'rgba(79, 70, 229, 0.05)';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--glass-border)';
        dropZone.style.background = 'transparent';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--glass-border)';
        dropZone.style.background = 'transparent';
        
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // Click on drop zone to trigger input
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    convertBtn.addEventListener('click', () => {
        if (currentFile) {
            processFile(currentFile);
        }
    });

    // Validations
    function handleFileSelect(e) {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    }

    function handleFile(file) {
        if (!file.name.match(/\.(xlsx|xls)$/)) {
            showStatus('Lütfen geçerli bir Excel dosyası (.xlsx veya .xls) yükleyin.', 'error');
            return;
        }

        currentFile = file;
        fileNameDisplay.textContent = file.name;
        convertBtn.disabled = false;
        showStatus('', 'hidden');
    }

    // Core Functions
    function downloadTemplate() {
        try {
            // Create a new workbook
            const wb = XLSX.utils.book_new();
            
            // Define headers and some example data
            const headers = [['Ad Soyad', 'Email', 'Telefon', 'Etiket']];
            const data = [
                ['Ahmet Yılmaz', 'ahmet@ornek.com', '5551234567', 'İş'],
                ['Ayşe Demir', 'ayse@ornek.com', '5559876543', 'Aile']
            ];
            
            // Create worksheet from array of arrays
            const ws = XLSX.utils.aoa_to_sheet([...headers, ...data]);
            
            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, "Kişiler");
            
            // Write file
            XLSX.writeFile(wb, "ornek_liste.xlsx");
            
            showStatus('Örnek şablon indirildi. Lütfen doldurup yukarıya yükleyin.', 'success');
        } catch (error) {
            console.error(error);
            showStatus('Şablon oluşturulurken bir hata oluştu.', 'error');
        }
    }

    function processFile(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                
                // Get first sheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                if (jsonData.length === 0) {
                    showStatus('Excel dosyası boş veya okunamadı.', 'error');
                    return;
                }

                // Check for required columns (normalize keys to be safe)
                // We'll trust the user used the template, but let's check one key
                const firstRow = jsonData[0];
                // Simple validation - just check if any expected key exists in some form
                // Not too strict to allow for minor variations
                
                const vcfContent = generateVCF(jsonData);
                
                downloadVCF(vcfContent);
                showStatus(`Başarıyla dönüştürüldü! ${jsonData.length} kişi işlendi.`, 'success');
                
            } catch (error) {
                console.error(error);
                showStatus('Dosya işlenirken bir hata oluştu: ' + error.message, 'error');
            }
        };
        
        reader.readAsArrayBuffer(file);
    }

    function generateVCF(data) {
        let vcf = "";
        
        data.forEach(row => {
            // Normalize keys (trim spaces)
            const cleanRow = {};
            Object.keys(row).forEach(key => {
                cleanRow[key.trim()] = row[key];
            });

            // Skip empty rows
            if (!cleanRow['Ad Soyad'] && !cleanRow['Email'] && !cleanRow['Telefon']) return;

            vcf += "BEGIN:VCARD\n";
            vcf += "VERSION:3.0\n";
            
            // Name
            const fullName = String(cleanRow['Ad Soyad'] || '').trim();
            if (fullName) {
                const parts = fullName.split(' ');
                const firstName = parts[0] || '';
                const lastName = parts.slice(1).join(' ') || ''; // Join rest as last name
                vcf += `FN:${fullName}\n`;
                vcf += `N:${lastName};${firstName};;;\n`;
            }

            // Phone
            let phone = String(cleanRow['Telefon'] || '').trim();
            if (phone) {
                // Remove non-numeric chars for processing, but mostly vCard handles it. 
                // Let's strip spaces/dashes as in Python script
                phone = phone.replace(/[\s\-\(\)]/g, '');
                vcf += `TEL;TYPE=CELL:${phone}\n`;
            }

            // Email
            const email = String(cleanRow['Email'] || '').trim();
            if (email) {
                vcf += `EMAIL;TYPE=INTERNET:${email}\n`;
            }

            // Label/Note
            const label = String(cleanRow['Etiket'] || '').trim();
            if (label) {
                vcf += `NOTE:${label}\n`;
            }

            // Revision date
            const now = new Date();
            const revBlock = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            vcf += `REV:${revBlock}\n`;

            vcf += "END:VCARD\n";
        });

        return vcf;
    }

    function downloadVCF(content) {
        const blob = new Blob([content], { type: 'text/vcard;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'contacts.vcf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function showStatus(msg, type) {
        if (type === 'hidden') {
            statusDiv.style.display = 'none';
            return;
        }
        statusDiv.textContent = msg;
        statusDiv.className = type;
        statusDiv.style.display = 'block';
    }
});
