// ZIP yükleme ve işleme
document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const progress = document.getElementById('progress');
    const progressText = document.getElementById('progressText');
    
    // Dosya seçme işlemi
    dropZone.addEventListener('click', () => fileInput.click());
    
    // Sürükle bırak desteği
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#e9e9e9';
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.style.backgroundColor = '';
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '';
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
    
    // Dosya input değişikliği
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFile(fileInput.files[0]);
        }
    });
    
    async function handleFile(file) {
        if (!file.name.endsWith('.zip')) {
            alert('Lütfen geçerli bir ZIP dosyası seçin');
            return;
        }
        
        progress.style.display = 'block';
        const reader = new FileReader();
        
        reader.onprogress = (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                progress.querySelector('progress').value = percent;
                progressText.textContent = `${percent}%`;
            }
        };
        
        reader.onload = async function(e) {
            try {
                const zip = await JSZip.loadAsync(e.target.result);
                const manifestFile = zip.file(/imsmanifest.xml/i)[0];
                
                if (!manifestFile) {
                    throw new Error('SCORM manifest dosyası (imsmanifest.xml) bulunamadı');
                }
                
                const manifestContent = await manifestFile.async('text');
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(manifestContent, "text/xml");
                const resources = xmlDoc.getElementsByTagName('resource');
                
                let launchFile = '';
                for (let resource of resources) {
                    if (resource.getAttribute('scormType') === 'sco') {
                        launchFile = resource.getAttribute('href');
                        break;
                    }
                }
                
                if (!launchFile) {
                    launchFile = resources[0].getAttribute('href');
                }
                
                // Tüm dosyaları sanal dosya sistemine çıkar
                await extractZip(zip);
                
                // Önizleme sayfasına yönlendir
                window.location.href = `viewer.html?launch=${encodeURIComponent(launchFile)}`;
                
            } catch (error) {
                console.error('Hata:', error);
                alert(`SCORM yükleme hatası: ${error.message}`);
                progress.style.display = 'none';
            }
        };
        
        reader.readAsArrayBuffer(file);
    }
    
    async function extractZip(zip) {
        // BrowserFS ile sanal dosya sistemi oluştur
        BrowserFS.configure({
            fs: "LocalStorage",
            options: {}
        }, function(e) {
            if (e) throw e;
        });
        
        const fs = BrowserFS.BFSRequire('fs');
        
        // ZIP içindeki tüm dosyaları çıkar
        const files = Object.keys(zip.files);
        for (const filePath of files) {
            const file = zip.files[filePath];
            if (!file.dir) {
                const content = await file.async('uint8array');
                fs.writeFileSync(filePath, content);
            }
        }
    }
});