function calculateTotal() {
    var table = document.getElementById("medicalBill");
    var rows = table.rows;
    var totalAmount = 0;
  
    for (var i = 1; i < rows.length; i++) {
      var quantity = parseFloat(rows[i].cells[1].querySelector('.quantity').value);
      var unitCost = parseFloat(rows[i].cells[2].querySelector('.unitCost').value);
      var total = quantity * unitCost;
      
      rows[i].cells[3].innerText = total.toFixed(2);
      totalAmount += total;
    }
  
    document.getElementById("totalAmount").innerText = totalAmount.toFixed(2);
  }
  
  function addRow() {
    var table = document.getElementById("medicalBill");
    var newRow = table.insertRow(table.rows.length - 1);
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    var cell4 = newRow.insertCell(3);
    var cell5 = newRow.insertCell(4);
  
    cell1.innerHTML = '<input type="text" class="service">';
    cell2.innerHTML = '<input type="number" class="quantity" min="1" value="1">';
    cell3.innerHTML = '<input type="number" class="unitCost" min="0" step="0.01" value="0.00">';
    cell4.innerHTML = '0.00';
    cell5.innerHTML = '<button onclick="removeRow(this)">Remove</button>';
  }
  
  function removeRow(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    calculateTotal();
  }  