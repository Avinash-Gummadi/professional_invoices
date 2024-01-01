function addContextMenuListener(element, message) {
    if (element) {
        element.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            alert(`Tampering on ${message} is Illegal.`);
            window.location.href = 'illegal.html'; // You may replace this URL as needed.
        });
    }
}

function handleFileInputChange(fileInput, previewElement, isSignature) {
    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];

        const reader = new FileReader();

        reader.addEventListener("load", function () {
            const proofMessage = isSignature ? "Signature Proof: " : "Image Proof: ";
            if (isSignature) {
                previewElement.src = reader.result;
                previewElement.style.display = 'block';
            }
            else {
                const headproof = document.createElement('h2');
                headproof.textContent = proofMessage;
                previewElement.innerHTML = '';
                previewElement.appendChild(headproof);

                const preview = document.createElement("img");
                preview.src = reader.result;
                previewElement.appendChild(preview);
            }
        });

        reader.readAsDataURL(file);
    });
}

// Add context menu listeners for stamp and signature images
addContextMenuListener(document.getElementById('stampImage'), 'stamp');
addContextMenuListener(document.getElementById('signatureImage'), 'signature');

// Handle file input changes for regular image and signature
document.getElementById("uploadImage") && handleFileInputChange(document.getElementById("uploadImage"), document.getElementById("filePreview"), false);
document.getElementById("uploadSign") && handleFileInputChange(document.getElementById("uploadSign"), document.getElementById("signatureImage"), true);
document.getElementById("uploadStamp") && handleFileInputChange(document.getElementById("uploadStamp"), document.getElementById("stampImage"), true);