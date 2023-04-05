// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Get customer information
const customerName = urlParams.get('customer-name');
const customerAddress = urlParams.get('customer-address');

// Get invoice information
const rawInvoiceDate = urlParams.get('invoice-date');
const rawDueDate = urlParams.get('due-date');

const options = { day: '2-digit', month: 'short', year: 'numeric' };
const formattedInvoiceDate= new Date(rawInvoiceDate).toLocaleDateString('en-GB', options);
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

// CSV Download
const downloadButton = document.getElementById("downloadCSV");
// Get the table body and total amount elements
const tableBody = document.getElementById("itemsTableBody");
const totalAmount = document.getElementById("total");
// Get the customer information
const customerNameCsv = document.getElementById("customerName").textContent;
const customerAddressCsv = document.getElementById("customerAddress").textContent;
const invoiceDateCsv = document.getElementById("invoiceDate").textContent;
const dueDateCsv = document.getElementById("dueDate").textContent;

// Generate the CSV content
let csvContent = `Customer Name,${customerNameCsv}\nCustomer Address,${customerAddressCsv}\nInvoice Date,${invoiceDateCsv}\nDue Date,${dueDateCsv}\n\nItem Name,Quantity,Price,Total\n`;
tableBody.querySelectorAll("tr").forEach(row => {
    const itemName = row.querySelector("td:nth-child(1)").textContent;
    const quantity = row.querySelector("td:nth-child(2)").textContent;
    const price = row.querySelector("td:nth-child(3)").textContent;
    const total = row.querySelector("td:nth-child(4)").textContent;
    csvContent += `${itemName},${quantity},${price},${total}\n`;
});
csvContent += `\nTotal Amount,,,Rs.${totalAmount.textContent}\n`;

// Set the CSV data as a download link
downloadButton.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent));
downloadButton.setAttribute("download", "invoice_report.csv");

// PDF Download
document.addEventListener("DOMContentLoaded", function () {
    // Select the main container element in invoicereport.html
    const element = document.querySelector('.container');

    // Options for html2pdf
    const options = {
        margin: [10, 10, 10, 10],
        filename: 'invoice_report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { dpi: 192, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    // When the "Download as PDF" button is clicked, create the PDF
    document.getElementById('downloadPDF').addEventListener('click', () => {
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


