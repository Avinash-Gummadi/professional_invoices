// Select elements
const form = document.querySelector('form');
const inputs = form.querySelectorAll('input, textarea');
const itemsTable = document.getElementById('itemsTable');
const totalInput = document.getElementById('total');

// Function to update the total of an individual item
function updateItemTotal(itemRow) {
  const quantityInput = itemRow.querySelector('.item-quantity');
  const priceInput = itemRow.querySelector('.item-price');
  const itemTotalInput = itemRow.querySelector('.item-total');

  const quantity = parseFloat(quantityInput.value);
  const price = parseFloat(priceInput.value);
  const itemTotal = (quantity * price).toFixed(2);

  if (!isNaN(itemTotal)) {
    itemTotalInput.value = itemTotal;
  }
}

// Function to update the total
function updateTotal() {
  let sum = 0;

  itemsTable.querySelectorAll('tbody tr').forEach((itemRow) => {
    const itemTotalInput = itemRow.querySelector('.item-total');
    const itemTotal = parseFloat(itemTotalInput.value);

    if (!isNaN(itemTotal)) {
      sum += itemTotal;
    }
  });

  totalInput.value = sum.toFixed(2);
}

// Function to add a new item to the table
function addItem() {
  const itemRow = document.createElement('tr');
  itemRow.innerHTML = `
    <td><button type="button" class="remove-item-btn">Remove</button></td>
    <td><input type="text" class="item-name"></td>
    <td><input type="number" class="item-quantity"></td>
    <td><input type="number" class="item-price"></td>
    <td><input type="number" class="item-total" readonly></td>
  `;

  itemsTable.querySelector('tbody').appendChild(itemRow);

  // Add event listeners to new inputs
  const inputs = itemRow.querySelectorAll('input');
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      updateItemTotal(itemRow);
      updateTotal();
    });
  });

  // Add event listener to remove button
  const removeBtn = itemRow.querySelector('.remove-item-btn');
  removeBtn.addEventListener('click', () => {
    itemRow.remove();
    updateTotal();
  });
}

// Add event listeners to inputs
inputs.forEach((input) => {
  if (input.type !== 'file') {
    input.addEventListener('input', updateTotal);
  }
});

// Get form data on submit
document.getElementById('invoice-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission
  const formData = new FormData(event.target); // Get form data

  // Add other input field values to the formData object
  const itemNameInputs = document.querySelectorAll('.item-name');
  const itemQuantityInputs = document.querySelectorAll('.item-quantity');
  const itemPriceInputs = document.querySelectorAll('.item-price');
  const itemTotalInputs = document.querySelectorAll('.item-total');
  
  itemNameInputs.forEach((input, index) => {
    formData.append(`item-${index + 1}-name`, input.value);
  });
  
  itemQuantityInputs.forEach((input, index) => {
    formData.append(`item-${index + 1}-quantity`, input.value);
  });
  
  itemPriceInputs.forEach((input, index) => {
    formData.append(`item-${index + 1}-price`, input.value);
  });
  
  itemTotalInputs.forEach((input, index) => {
    formData.append(`item-${index + 1}-total`, input.value);
  });
  
  const urlParams = new URLSearchParams(); // Create URL parameters object
  
  // Add form data and other input field data to URL parameters
  formData.forEach((value, key) => {
    urlParams.append(key, value);
  });
  
  // Redirect to invoicereport.html with URL parameters
  window.location.href = `invoicereport.html?${urlParams.toString()}`;
});
