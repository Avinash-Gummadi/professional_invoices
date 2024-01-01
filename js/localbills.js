console.log(document.title);
console.log(window.location.pathname);
let pathName = window.location.pathname
if ((pathName == "/localbills.html") || (pathName == "/rental.html")) {
  const termsAndConditions = document.getElementById('terms-and-conditions');
  if (termsAndConditions) {
    termsAndConditions.addEventListener('input', () => {
      termsAndConditions.style.height = 'auto';
      termsAndConditions.style.height = `${termsAndConditions.scrollHeight}px`;
    });
  }
  const billForm = document.getElementById("bill-form");
  const employeeNameField = document.getElementById("employee-name");
  console.log(employeeNameField.tagName);
  let employeeName = null;
  if (employeeNameField.tagName == 'SELECT') {
    employeeNameField.addEventListener('change', function () {
      if (employeeNameField.value == 'Other') {
        otherEmp = document.getElementById('otherEmp');
        otherEmp.style.display = 'block';
        document.getElementById('otherEmpField').addEventListener('change', function () {
          employeeName = document.getElementById('otherEmpField').value;
        })
      } else {
        document.getElementById('otherEmp').style.display = 'none';
        employeeName = employeeNameField.value;
      }
    })
  }
  billForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const amount = document.getElementById("amount").value;
    const reason = document.getElementById("reason").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const tAndC = termsAndConditions ? termsAndConditions.value : null
    const amtWords = document.getElementById('amtinwords') ? document.getElementById('amtinwords').value : null
    const addressVal = document.getElementById('address') ? document.getElementById('address').value : null
    const rentPeriodVal = document.getElementById('rentPeriod') ? document.getElementById('rentPeriod').value : null

    const params = new URLSearchParams({
      employeeName: employeeName ? employeeName : employeeNameField.value,
      amount: amount,
      reason: reason,
      category: category,
      date: date,
    });

    if (tAndC !== null) {
      params.append('termsconditions', tAndC);
    }
    if (amtWords !== null) {
      params.append('amtWords', amtWords);
    }
    if (addressVal !== null) {
      params.append('addressVal', addressVal);
    }
    if (rentPeriodVal !== null) {
      params.append('rentPeriodVal', rentPeriodVal);
    }

    // Redirect to the report page with the query string
    window.location.href = window.location.pathname == '/localbills.html' ? `localbillsreport.html?${params.toString()}` : `rentalreceipt.html?${params.toString()}`;
  });
}

// Check if the page is localbillsreport.html
if ((pathName == "/localbillsreport.html") || (pathName == "/rentalreceipt.html")) {
  // Get the query string from the URL
  const queryString = window.location.search;

  // Parse the query string to get the form data and compressed file data
  const urlParams = new URLSearchParams(queryString);
  console.log(urlParams);
  const employeeName = urlParams.get('employeeName');
  const reason = urlParams.get('reason');
  const amount = urlParams.get('amount');
  const rawDate = urlParams.get('date');
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const formattedRawDate = new Date(rawDate).toLocaleDateString('en-GB', options);
  const termsAndConditions = urlParams.get('termsconditions') ? urlParams.get('termsconditions').split('\n') : null;
  const amtWords = urlParams.get('amtWords');
  const addressVal = urlParams.get('addressVal');
  const rentPeriodVal = urlParams.get('rentPeriodVal');

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
  const amtWordsElement = document.getElementById('amountInWords');
  const addressElement = document.getElementById('tenantAddress');
  const rentPeriodElement = document.getElementById('rentPeriod');

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

  if (amtWordsElement) {
    amtWordsElement.textContent = amtWords;
  }

  if (addressElement) {
    addressElement.textContent = addressVal;
  }

  if (rentPeriodElement) {
    rentPeriodElement.textContent = rentPeriodVal;
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
      const downloadButtons = document.querySelectorAll('.download');
      downloadButtons.forEach(button => button.style.display = 'none');
      event.preventDefault();
      const containerElement = document.querySelector('.container');

      const allTextElements = containerElement.querySelectorAll('*');
      allTextElements.forEach(element => {
        const currentFontSize = window.getComputedStyle(element).fontSize;
        if (currentFontSize) {
          const newFontSize = '12px';
          element.style.fontSize = newFontSize;
        }
      });

      html2pdf()
        .from(containerElement)
        .set(options)
        .save().then(() => {
          downloadButtons.forEach(button => button.style.display = 'block');
        });
    });
  }

  const invoiceGenDate = document.getElementById('invoiceGenDate');
  if (invoiceGenDate) {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    invoiceGenDate.textContent = `Invoice generated on ${formattedDate}`;
  }
}