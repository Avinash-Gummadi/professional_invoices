// Check if the page is localbills.html
if (document.title === "Local Bills") {
  const billForm = document.getElementById("bill-form");

  billForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const employeeName = document.getElementById("employee-name").value;
    const amount = document.getElementById("amount").value;
    const reason = document.getElementById("reason").value;
    let stamp = localStorage.getItem("stamp");
    let signature = localStorage.getItem("signature");

    const uploadedStamp = document.getElementById("stamp").value;
    const uploadedSignature = document.getElementById("signature").value;

    // Check if user uploaded sign and stamp
    if (uploadedStamp && uploadedSignature) {
      // Update the stamp and signature in localStorage
      localStorage.setItem("stamp", uploadedStamp);
      localStorage.setItem("signature", uploadedSignature);
      stamp = uploadedStamp;
      signature = uploadedSignature;
    } else {
      // If stamp and signature are not available, get them from localStorage
      if (!stamp || !signature) {
        console.error("No signature or stamp available!");
        return;
      }
    }

    // Construct the query string with the form data
    const params = new URLSearchParams({
      employeeName: employeeName,
      amount: amount,
      reason: reason,
      stamp: stamp,
      signature: signature,
    });

    // Redirect to the report page with the query string
    window.location.href = `localbillsreport.html?${params.toString()}`;
  });
}

// Check if the page is localbillsreport.html
if (document.title === "Local Bills Report") {
  // Get the query string from the URL
  const queryString = window.location.search;

  // Parse the query string to get the form data
  const urlParams = new URLSearchParams(queryString);
  const employeeName = urlParams.get('employeeName');
  const reason = urlParams.get('reason');
  const stamp = urlParams.get('stamp');
  const signature = urlParams.get('signature');
  const amount = urlParams.get('amount');

  // Set the form data in the report page
  const employeeNameElement = document.getElementById('employeeName');
  const reasonElement = document.getElementById('reason');
  const stampImageElement = document.getElementById('stampImage');
  const signatureImageElement = document.getElementById('signatureImage');
  const amountElement = document.getElementById('amount');

  if (employeeNameElement) {
    employeeNameElement.textContent = employeeName;
  }

  if (reasonElement) {
    reasonElement.textContent = reason;
  }

  if (stampImageElement && stamp) {
    stampImageElement.src = stamp;
  }

  if (signatureImageElement && signature) {
    signatureImageElement.src = signature;
  }

  if (amountElement) {
    amountElement.textContent = amount;
  }

  // Download as CSV
  const downloadCSVElement = document.getElementById('downloadCSV');
  if (downloadCSVElement) {
    downloadCSVElement.addEventListener('click', function (event) {
      event.preventDefault();
      const csvData = [
        ['Employee Name', 'Reason', 'Stamp', 'Signature', 'Amount'],
        [employeeName, reason, stamp, signature, amount],
      ];
      const csvContent = 'data:text/csv;charset=utf-8,' + csvData.map(row => row.join(',')).join('\n');
      downloadCSVElement.setAttribute('href', encodeURI(csvContent));
      downloadCSVElement.setAttribute('download', 'local-bills.csv');
    });
  }

  // Download as PDF
  const downloadPDFElement = document.getElementById('downloadPDF');
  if (downloadPDFElement) {
    downloadPDFElement.addEventListener('click', function (event) {
      event.preventDefault();
      const containerElement = document.querySelector('.container');
      html2pdf()
        .from(containerElement)
        .save('local-bills.pdf');
    });
  }
}
