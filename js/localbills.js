if (document.title === "WebLaunch | Local Bills") {
  // Set default terms and conditions
  // Get the textarea element
  const termsAndConditions = document.getElementById('terms-and-conditions');
  termsAndConditions.value = "1. The payment is for the specific purpose outlined in the bill and cannot be used for any other purpose.\n2. The employee is responsible for any taxes or other fees associated with the payment.\n3. Any disputes or discrepancies in the bill must be reported within 7 days of receipt.\n4. The employee agrees to provide any necessary documentation to support the payment if employer asks at any time, such as receipts or invoices.\n5. The employer reserves the right to withhold payment if the employee is found to be in violation of company policies or procedures.\n6. Payment will be made in the form specified in the bill, and any costs associated with processing the payment, such as wire transfer fees, will be borne by the employee.";

  // Set the minimum height of the textarea
  termsAndConditions.style.minHeight = '210px';

  // Add an event listener for input changes
  termsAndConditions.addEventListener('input', () => {
    // Set the height of the textarea based on its content
    termsAndConditions.style.height = 'auto';
    termsAndConditions.style.height = `${termsAndConditions.scrollHeight}px`;
  });
  const billForm = document.getElementById("bill-form");
  const employeeNameField = document.getElementById("employee-name");
  let employeeName = '';
  employeeNameField.addEventListener('change', function (){
    if (employeeNameField.value == 'Other') {
      otherEmp = document.getElementById('otherEmp');
      otherEmp.style.display = 'block';
      document.getElementById('otherEmpField').addEventListener('change', function(){
        employeeName = document.getElementById('otherEmpField').value;
      })
    } else {
      document.getElementById('otherEmp').style.display = 'none';
      employeeName = employeeNameField.value;
    }
    
  })
  billForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const amount = document.getElementById("amount").value;
    const reason = document.getElementById("reason").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const tAndC = termsAndConditions.value;
    // Construct the query string with the form data and compressed file data
    const params = new URLSearchParams({
      employeeName: employeeName,
      amount: amount,
      reason: reason,
      category: category,
      date: date,
      termsconditions: tAndC,
    });

    // Redirect to the report page with the query string
    window.location.href = `localbillsreport.html?${params.toString()}`;
  });
}

// Check if the page is localbillsreport.html
if (document.title === "WebLaunch | Local Bills Report") {
  // Get the query string from the URL
  const queryString = window.location.search;

  // Parse the query string to get the form data and compressed file data
  const urlParams = new URLSearchParams(queryString);
  const employeeName = urlParams.get('employeeName');
  const reason = urlParams.get('reason');
  const amount = urlParams.get('amount');
  const rawDate = urlParams.get('date');
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const formattedRawDate = new Date(rawDate).toLocaleDateString('en-GB', options);
  const termsAndConditions = urlParams.get('termsconditions').split('\n');


  // Format invoice date as DD-MMM-YYYY (e.g. 02-Apr-2023)
  const payDate = formattedRawDate.split(' ').map((item, index) => {
    if (index === 0) return item.padStart(2, '0');
    if (index === 1) return item.substr(0, 3);
    return item;
  }).join('-');
  const category = urlParams.get('category'); // Replace with the selected category from the form

  // Set the form data in the report page
  const employeeNameElement = document.getElementById('employeeName');
  const reasonElement = document.getElementById('reason');
  const amountElement = document.getElementById('amount');
  const dateElement = document.getElementById('date');
  const categoryElement = document.getElementById('category');
  const termsAndConditionsElement = document.getElementById('termsAndConditions');

  if (employeeNameElement) {
    employeeNameElement.textContent = employeeName;
  }

  if (reasonElement) {
    reasonElement.textContent = reason;
  }

  if (amountElement) {
    amountElement.textContent = amount;
  }

  if (dateElement) {
    dateElement.textContent = payDate;
  }

  if (categoryElement) {
    categoryElement.textContent = category;
  }

  if (termsAndConditionsElement) {
    // Display the terms-and-conditions as a list
    for (const term of termsAndConditions) {
      const listTermsItem = document.createElement('li');
      listTermsItem.textContent = term;
      termsAndConditionsElement.appendChild(listTermsItem);
    }
  }

  // Download as PDF
  const downloadPDFElement = document.getElementById('downloadPDF');
  if (downloadPDFElement) {
    // Options for html2pdf
    const timestamp = new Date().getTime(); // gets current timestamp
    const file_name = `payment_slip_${timestamp}.pdf`; // dynamic file name with timestamp
    const output_path = `/path/to/save/pdf/payment_slip.pdf` // specify the output path here
    
    const options = {
      margin: [10, 10, 10, 10],
      filename: file_name,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { dpi: 192, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      output: `D:/weblaunch_details/financial_reports/${file_name}` // specify the output path here
    };

    downloadPDFElement.addEventListener('click', function (event) {
      // Hide the download buttons
      const downloadButtons = document.querySelectorAll('.download');
      downloadButtons.forEach(button => button.style.display = 'none');
      event.preventDefault();
      const containerElement = document.querySelector('.container');
      html2pdf()
        .from(containerElement)
        .set(options)
        .save().then(() => {
          // Show the download buttons again after generating the PDF
          downloadButtons.forEach(button => button.style.display = 'block');
        });
    });
  }
  const stampImage = document.getElementById('stampImage');
  const signatureImage = document.getElementById('signatureImage');
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

  // Create a new paragraph element with the text "Invoice generated on [current date]"
  const invoiceGenDate = document.getElementById('invoiceGenDate');
  if (invoiceGenDate) {
    // Get the current date
    const currentDate = new Date().toLocaleDateString();
    invoiceGenDate.textContent = `Invoice generated on ${currentDate}`;
  }

  // 
  const fileInput = document.getElementById("uploadImage");
  const filePreview = document.getElementById("filePreview");

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
}