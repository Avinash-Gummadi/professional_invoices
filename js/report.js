// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Get customer information
const customerName = urlParams.get('customer-name');
const customerAddress = urlParams.get('customer-address');
const customerEmail = urlParams.get('customer-email');
const customerMobile = urlParams.get('customer-mobile');
const termsAndConditions = urlParams.get('terms-and-conditions').split('\n');

// Get invoice information
const rawInvoiceDate = urlParams.get('invoice-date');
const rawDueDate = urlParams.get('due-date');

const options = { day: '2-digit', month: 'short', year: 'numeric' };
const formattedInvoiceDate = new Date(rawInvoiceDate).toLocaleDateString('en-GB', options);
const formattedDueDate = new Date(rawDueDate).toLocaleDateString('en-GB', options);

// Format invoice date as DD-MMM-YYYY (e.g. 02-Apr-2023)
const invoiceDate = formattedInvoiceDate.split(' ').map((item, index) => {
    if (index === 0) return item.padStart(2, '0');
    if (index === 1) return item.substr(0, 3);
    return item;
}).join('-');

// Format due date as DD-MMM-YYYY (e.g. 02-Apr-2023)
const dueDate = formattedDueDate.split(' ').map((item, index) => {
    if (index === 0) return item.padStart(2, '0');
    if (index === 1) return item.substr(0, 3);
    return item;
}).join('-');


// Initialize array to store item information
const items = [];

// Loop through all the URL parameters that start with "item-"
urlParams.forEach((value, key) => {
    if (key.startsWith('item-')) {
        // Extract the item number from the parameter key
        const itemNumber = key.slice(0, 6);
        // If the current item number is not in the items array yet, add it
        if (!items[itemNumber]) {
            items[itemNumber] = { name: '', quantity: 0, price: 0, total: 0 };
        }
        // Update the relevant property of the current item based on the parameter key
        if (key.endsWith('-name')) {
            items[itemNumber].name = value;
        } else if (key.endsWith('-quantity')) {
            items[itemNumber].quantity = parseFloat(value);
        } else if (key.endsWith('-price')) {
            items[itemNumber].price = parseFloat(value);
        } else if (key.endsWith('-total')) {
            items[itemNumber].total = parseFloat(value);
        }
    }
});

// Update HTML with extracted information
const customerNameElement = document.getElementById('customerName');
customerNameElement.textContent = customerName;

const customerMobileElement = document.getElementById('customerMobile');
customerMobileElement.textContent = customerMobile;

const customerEmailElement = document.getElementById('customerEmail');
customerEmailElement.textContent = customerEmail;

const customerAddressElement = document.getElementById('customerAddress');
customerAddressElement.textContent = customerAddress;

const invoiceDateElement = document.getElementById('invoiceDate');
invoiceDateElement.textContent = invoiceDate;

const dueDateElement = document.getElementById('dueDate');
dueDateElement.textContent = dueDate;

const itemsTableBody = document.getElementById('itemsTableBody');

// Loop through the items array and add a table row for each item
Object.values(items).forEach((item) => {
    const itemRow = document.createElement('tr');
    const itemName = document.createElement('td');
    itemName.textContent = item.name;
    itemRow.appendChild(itemName);

    const itemQuantity = document.createElement('td');
    itemQuantity.textContent = item.quantity;
    itemRow.appendChild(itemQuantity);

    const itemPrice = document.createElement('td');
    itemPrice.textContent = `${item.price.toFixed(2)}`;
    itemRow.appendChild(itemPrice);

    const itemTotal = document.createElement('td');
    itemTotal.textContent = `${item.total.toFixed(2)}`;
    itemRow.appendChild(itemTotal);

    itemsTableBody.appendChild(itemRow);
});

// Calculate the total of all items
const total = Object.values(items).reduce((acc, item) => acc + item.total, 0);
const totalElement = document.getElementById('total');
totalElement.textContent = `${total.toFixed(2)}`;

//termsAndConditions
const termsAndConditionsElement = document.getElementById('termsAndConditions');
// Display the terms-and-conditions as a list
for (const term of termsAndConditions) {
    const listTermsItem = document.createElement('li');
    listTermsItem.textContent = term;
    termsAndConditionsElement.appendChild(listTermsItem);
}

// PDF Download
document.addEventListener("DOMContentLoaded", function () {
    // Select the main container element in invoicereport.html
    const element = document.querySelector('.container');

    // When the "Download as PDF" button is clicked, create the PDF
    document.getElementById('downloadPDF').addEventListener('click', () => {
        // Options for html2pdf
        const timestamp = new Date().getTime(); // gets current timestamp
        const file_name = `invoice_report_${timestamp}.pdf`; // dynamic file name with timestamp
        const options = {
            margin: [10, 10, 10, 10],
            filename: file_name,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { dpi: 192, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        // Hide the download buttons
        const downloadButtons = document.querySelectorAll('.download');
        downloadButtons.forEach(button => button.style.display = 'none');

        html2pdf()
            .from(element)
            .set(options)
            .save()
            .then(() => {
                // Show the download buttons again after generating the PDF
                downloadButtons.forEach(button => button.style.display = 'block');
            });
    });
});

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