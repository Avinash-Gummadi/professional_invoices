const stampImage = document.getElementById('stampImage');
const signatureImage = document.getElementById('signatureImage');
const signFile = document.getElementById("uploadSign");
const fileInput = document.getElementById("uploadImage");
const filePreview = document.getElementById("filePreview");

if (stampImage) {
  stampImage.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    alert('Tampering on stamp is Illegal.');
    window.location.href = 'illegal.html';
  });
}

if (signatureImage) {
  signatureImage.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    alert('Tampering on signature is Illegal.');
    window.location.href = 'illegal.html';
  });
}

fileInput.addEventListener("change", function () {
  const file = fileInput.files[0];

  const reader = new FileReader();

  reader.addEventListener("load", function () {
    const headproof = document.createElement('h2');
    headproof.textContent = "Proof: "
    filePreview.appendChild(headproof);
    const preview = document.createElement("img");
    preview.src = reader.result;
    filePreview.appendChild(preview);
  });

  reader.readAsDataURL(file);
});

signFile.addEventListener("change", function () {
  const file = signFile.files[0];

  const reader = new FileReader();

  reader.addEventListener("load", function () {
    signatureImage.src = reader.result;
  });

  reader.readAsDataURL(file);
});