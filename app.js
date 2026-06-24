// 1. Grab DOM Elements
const imageInput = document.getElementById('imageInput');
const controls = document.getElementById('controls');
const qualitySlider = document.getElementById('quality');
const qualityVal = document.getElementById('qualityVal');
const compressBtn = document.getElementById('compressBtn');
const resultZone = document.getElementById('resultZone');
const sizeSavings = document.getElementById('sizeSavings');
const downloadLink = document.getElementById('downloadLink');

let originalImageFile = null;

// 2. Listen for File Upload
imageInput.addEventListener('change', (e) => {
    originalImageFile = e.target.files[0];
    if (originalImageFile) {
        controls.classList.remove('hidden'); // Show options
        resultZone.classList.add('hidden');  // Hide previous results
    }
});

// Update the Quality text display dynamically
qualitySlider.addEventListener('input', (e) => {
    qualityVal.textContent = `${e.target.value}%`;
});

// 3. The Compression Algorithm
compressBtn.addEventListener('click', () => {
    if (!originalImageFile) return;

    const reader = new FileReader();
    reader.readAsDataURL(originalImageFile);

    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
            // Create a hidden canvas element
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Maintain original dimensions
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the uploaded image onto the canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Get selected quality percentage (convert to 0.0 - 1.0 scale)
            const quality = qualitySlider.value / 100;

            // Convert canvas content back to a data URL (JPEG/WebP support lossy compression)
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

            // Calculate file size differences
            displayResults(compressedDataUrl);
        };
    };
});

// 4. Calculate Size & Prepare Download
function displayResults(dataUrl) {
    // Estimate size of the Base64 Data URL string in bytes
    const head = 'data:image/jpeg;base64,';
    const compressedSizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
    
    const originalSizeKB = (originalImageFile.size / 1024).toFixed(1);
    const compressedSizeKB = (compressedSizeInBytes / 1024).toFixed(1);

    // Update UI text
    sizeSavings.innerHTML = `Original: <strong>${originalSizeKB} KB</strong> → Compressed: <strong>${compressedSizeKB} KB</strong>`;
    
    // Set up the download link button
    downloadLink.href = dataUrl;
    
    // Show download zone
    resultZone.classList.remove('hidden');
}
