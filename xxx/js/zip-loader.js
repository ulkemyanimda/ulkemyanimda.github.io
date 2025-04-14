document.getElementById('scormUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        JSZip.loadAsync(e.target.result).then(function(zip) {
            // ZIP içindeki imsmanifest.xml'i bul
            const manifestFile = zip.file(/imsmanifest.xml/i)[0];
            
            manifestFile.async('text').then(function(manifestContent) {
                // Manifesti parse et ve başlangıç dosyasını bul
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(manifestContent, "text/xml");
                const resource = xmlDoc.querySelector('resource[href]');
                const launchFile = resource.getAttribute('href');
                
                // Tüm dosyaları sanal bir dizine çıkar
                extractZipToVirtualFS(zip).then(function() {
                    document.getElementById('previewContainer').style.display = 'block';
                    document.getElementById('scormFrame').src = launchFile;
                });
            });
        });
    };
    reader.readAsArrayBuffer(file);
});

async function extractZipToVirtualFS(zip) {
    // Bu kısımda ZIP içeriğini sanal dosya sistemine çıkaracaksınız
    // Gerçek implementasyon için IndexedDB veya Service Worker kullanabilirsiniz
}