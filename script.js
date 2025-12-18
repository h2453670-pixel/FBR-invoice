let items = [];
let invoiceNumber = 1;

function addItem() {
  let name = document.getElementById("itemName").value.trim();
  let qty = Number(document.getElementById("qty").value);
  let price = Number(document.getElementById("price").value);

  if (!name || qty <= 0 || price <= 0) {
    alert("Please enter valid item details!");
    return;
  }

  items.push({ name, qty, price });
  showItems();

  document.getElementById("itemName").value = "";
  document.getElementById("qty").value = "";
  document.getElementById("price").value = "";
}

function showItems() {
  let html = "<ul>";
  items.forEach((item, index) => {
    html += `<li>${item.name} | Qty: ${item.qty} | Rs ${item.price} 
             <button onclick="removeItem(${index})">Remove</button></li>`;
  });
  html += "</ul>";
  document.getElementById("itemsList").innerHTML = html;
}

function removeItem(index) {
  items.splice(index, 1);
  showItems();
}

function numberToWords(num) {
  const a = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const b = ['','', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

  function inWords(n) {
    if(n < 20) return a[n];
    if(n < 100) return b[Math.floor(n/10)] + (n%10 ? " "+a[n%10] : "");
    if(n < 1000) return a[Math.floor(n/100)] + " Hundred" + (n%100 ? " " + inWords(n%100) : "");
    if(n < 1000000) return inWords(Math.floor(n/1000)) + " Thousand" + (n%1000 ? " " + inWords(n%1000) : "");
    return "";
  }
  return inWords(num);
}

function generateInvoice() {
  if (items.length === 0) {
    alert("Add at least one item.");
    return;
  }

  let sellerName = document.getElementById("sellerName").value || "N/A";
  let sellerNTN = document.getElementById("sellerNTN").value || "N/A";
  let sellerSTRN = document.getElementById("sellerSTRN").value || "N/A";
  let buyerName = document.getElementById("buyerName").value || "N/A";
  let buyerNTN = document.getElementById("buyerNTN").value || "N/A";

  let rows = "";
  let total = 0;

  items.forEach(item => {
    let line = item.qty * item.price;
    total += line;
    rows += `<tr>
               <td>${item.name}</td>
               <td>${item.qty}</td>
               <td>${item.price.toFixed(2)}</td>
               <td>${line.toFixed(2)}</td>
             </tr>`;
  });

  let gst = total * 0.18;
  let grandTotal = total + gst;
  let totalWords = numberToWords(Math.round(grandTotal));

  document.getElementById("invoice").innerHTML = `
    <h2 style="text-align:center;">TAX INVOICE</h2>
    <p><b>Invoice #:</b> ${invoiceNumber}</p>
    <p><b>Date:</b> ${new Date().toLocaleDateString()}</p>

    <p><b>Seller:</b> ${sellerName} | NTN: ${sellerNTN} | STRN: ${sellerSTRN}</p>
    <p><b>Buyer:</b> ${buyerName} | NTN: ${buyerNTN}</p>

    <table>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
      ${rows}
      <tr class="total-row">
        <td colspan="3"><b>Total</b></td>
        <td>${total.toFixed(2)}</td>
      </tr>
      <tr class="total-row">
        <td colspan="3"><b>GST (18%)</b></td>
        <td>${gst.toFixed(2)}</td>
      </tr>
      <tr class="grand-total-row">
        <td colspan="3"><b>Grand Total</b></td>
        <td>${grandTotal.toFixed(2)}</td>
      </tr>
    </table>

    <p class="total-in-words"><b>Total in Words:</b> ${totalWords} Rupees Only</p>

    <div class="footer">
      <div class="signature">Seller Signature</div>
      <div class="signature">Buyer Signature</div>
    </div>
  `;

  invoiceNumber++;
  items = [];
  document.getElementById("itemsList").innerHTML = "";
}

function printInvoice() {
  let invoiceContent = document.getElementById("invoice").innerHTML;
  if (!invoiceContent.trim()) {
    alert("Generate an invoice first.");
    return;
  }

  let w = window.open("", "", "width=900,height=650");
  w.document.write(`
    <html>
    <head>
      <link rel="stylesheet" href="print.css">
    </head>
    <body>${invoiceContent}</body>
    </html>
  `);
  w.document.close();
  w.print();
}
