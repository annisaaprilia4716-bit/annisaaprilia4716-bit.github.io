// Checkout logic — reads from localStorage cart
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];
const rupiah = n => n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

function getCart(){
  try { return JSON.parse(localStorage.getItem('annisa_cart')) || []; } catch { return []; }
}

function setDownload(filename, dataObj){
  const blob = new Blob([JSON.stringify(dataObj, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = $('#downloadOrder');
  a.href = url;
  a.download = filename;
}

function renderSummary(){
  const cart = getCart();
  const wrap = $('#summaryItems');
  wrap.innerHTML = cart.length ? '' : '<p class="muted">Keranjang kosong.</p>';
  cart.forEach(i=>{
    const row = document.createElement('div');
    row.className = 'summary-item';
    row.innerHTML = `
      <figure><img src="${i.img}" alt="${i.name}"></figure>
      <div>
        <div style="font-weight:700">${i.name}</div>
        <div class="muted">Qty: ${i.qty}</div>
      </div>
      <div style="font-weight:800">${rupiah(i.price*i.qty)}</div>`;
    wrap.appendChild(row);
  });
  const subtotal = cart.reduce((s,i)=> s + i.price*i.qty, 0);
  const discount = 0; // could implement voucher
  const total = subtotal - discount;
  $('#summarySubtotal').textContent = rupiah(subtotal);
  $('#summaryDiscount').textContent = rupiah(discount);
  $('#summaryTotal').textContent = rupiah(total);
  return { cart, subtotal, discount, total };
}

window.addEventListener('DOMContentLoaded', ()=>{
  $('#year').textContent = new Date().getFullYear();
  const totals = renderSummary();

  $('#checkoutForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const order = {
      shop: 'Annisa Dress',
      createdAt: new Date().toISOString(),
      customer: data,
      items: totals.cart,
      subtotal: totals.subtotal,
      discount: totals.discount,
      total: totals.total,
      note: 'Simulasi checkout (front-end only).'
    };
    // Save order JSON for user to download
    setDownload('pesanan-annisa-dress.json', order);
    // Clear cart after 'order'
    localStorage.removeItem('annisa_cart');
    // Show result section
    $('#orderResult').hidden = false;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });
});
