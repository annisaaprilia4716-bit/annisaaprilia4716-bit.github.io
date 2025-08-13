// Annisa Dress — Interaktif
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const state = {
  products: [
    {
      id: 'A01',
      name: 'Dress Aulia Pastel Pink',
      color: 'Pink Pastel',
      price: 279000,
      img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'A02',
      name: 'Dress Naya Sage',
      color: 'Hijau Pastel',
      price: 299000,
      img: 'https://images.unsplash.com/photo-1542060748-10c28b62716a?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'A03',
      name: 'Dress Safa Blush',
      color: 'Pink Pastel',
      price: 259000,
      img: 'https://images.unsplash.com/photo-1520975922284-7b68346aefab?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'A04',
      name: 'Dress Hana Mint',
      color: 'Hijau Pastel',
      price: 309000,
      img: 'https://images.unsplash.com/photo-1542060748-10c28b62716a?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'A05',
      name: 'Dress Zahra Lilac-Pink',
      color: 'Pink Pastel',
      price: 289000,
      img: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'A06',
      name: 'Dress Khayla Pistachio',
      color: 'Hijau Pastel',
      price: 279000,
      img: 'https://images.unsplash.com/photo-1520975979643-6a76a1a08cb0?q=80&w=1200&auto=format&fit=crop'
    }
  ],
  cart: []
};

// Utils
const rupiah = n => n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const saveCart = () => localStorage.setItem('annisa_cart', JSON.stringify(state.cart));
const loadCart = () => {
  try { state.cart = JSON.parse(localStorage.getItem('annisa_cart')) || []; } catch { state.cart = []; }
};

function renderProducts(list){
  const grid = $('#productGrid');
  grid.innerHTML = '';
  list.forEach((p,i)=>{
    const el = document.createElement('article');
    el.className = 'card';
    el.style.animationDelay = (i*60)+'ms';
    el.innerHTML = `
      <figure><img src="${p.img}" alt="${p.name}" loading="lazy"></figure>
      <div class="info">
        <div class="title">${p.name}</div>
        <p class="meta">${p.color}</p>
        <div class="price">${rupiah(p.price)}</div>
        <button class="btn-primary add-btn" data-id="${p.id}">+ Keranjang</button>
      </div>`;
    grid.appendChild(el);
  });

  // reveal on scroll
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, {threshold:.15});
  $$('.card').forEach(c=>io.observe(c));

  // bind add
  $$('.add-btn').forEach(btn=>btn.addEventListener('click',()=>{
    addToCart(btn.dataset.id);
    pulse($('#btnCart'));
  }));
}

function addToCart(id){
  const found = state.cart.find(i=>i.id===id);
  if(found){ found.qty += 1; }
  else{
    const p = state.products.find(p=>p.id===id);
    state.cart.push({ id:p.id, name:p.name, price:p.price, img:p.img, qty:1 });
  }
  saveCart();
  renderCart();
}

function changeQty(id, delta){
  const item = state.cart.find(i=>i.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0){
    state.cart = state.cart.filter(i=>i.id!==id);
  }
  saveCart();
  renderCart();
}

function clearCart(){
  state.cart = [];
  saveCart();
  renderCart();
}

function cartSubtotal(){
  return state.cart.reduce((s,i)=> s + i.price*i.qty, 0);
}

function renderCart(){
  $('#cartCount').textContent = state.cart.reduce((s,i)=>s+i.qty,0);
  $('#cartItems').innerHTML = state.cart.length ? '' : '<p class="muted" style="padding:12px">Keranjang masih kosong.</p>';
  state.cart.forEach(i=>{
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <figure><img src="${i.img}" alt="${i.name}"></figure>
      <div>
        <div style="font-weight:700">${i.name}</div>
        <div class="muted">${rupiah(i.price)}</div>
        <div class="qty">
          <button aria-label="Kurangi" data-id="${i.id}" data-act="-">−</button>
          <strong>${i.qty}</strong>
          <button aria-label="Tambah" data-id="${i.id}" data-act="+">+</button>
          <button aria-label="Hapus" data-id="${i.id}" data-act="x" style="margin-left:8px">🗑️</button>
        </div>
      </div>
      <div style="font-weight:800">${rupiah(i.price*i.qty)}</div>`;
    $('#cartItems').appendChild(row);
  });
  $('#cartSubtotal').textContent = rupiah(cartSubtotal());
}

function pulse(el){
  el.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:350});
}

// Filters & sorting
function applyFilters(){
  const q = $('#searchInput').value.toLowerCase();
  const sort = $('#sortSelect').value;
  let list = state.products.filter(p => (p.name.toLowerCase().includes(q) || p.color.toLowerCase().includes(q)));
  switch(sort){
    case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
    case 'name-asc': list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    case 'name-desc': list.sort((a,b)=>b.name.localeCompare(a.name)); break;
    default: /* recommended */ break;
  }
  renderProducts(list);
}

// Slider
let current = 0, autoTimer=null;
function goTo(index){
  const slides = $$('#slides .slide');
  current = (index + slides.length) % slides.length;
  $('#slides').style.transform = `translateX(-${current*100}%)`;
  $$('#dots button').forEach((d,i)=>d.classList.toggle('active', i===current));
}
function next(){ goTo(current+1); }
function prev(){ goTo(current-1); }
function startAuto(){
  stopAuto();
  autoTimer = setInterval(next, 4500);
}
function stopAuto(){
  if(autoTimer){ clearInterval(autoTimer); autoTimer=null; }
}
function buildDots(){
  const slides = $$('#slides .slide');
  const dots = $('#dots');
  dots.innerHTML = '';
  slides.forEach((_,i)=>{
    const b = document.createElement('button');
    b.addEventListener('click',()=>{ goTo(i); startAuto(); });
    if(i===0) b.classList.add('active');
    dots.appendChild(b);
  });
}

// Drawer & overlay
function openCart(){ $('#cartDrawer').classList.add('open'); $('#overlay').hidden=false; }
function closeCart(){ $('#cartDrawer').classList.remove('open'); $('#overlay').hidden=true; }

// Init
window.addEventListener('DOMContentLoaded',()=>{
  $('#year').textContent = new Date().getFullYear();
  buildDots();
  startAuto();

  $('#nextSlide').addEventListener('click', ()=>{ next(); startAuto(); });
  $('#prevSlide').addEventListener('click', ()=>{ prev(); startAuto(); });

  // Pause on hover
  $('.slider').addEventListener('mouseenter', stopAuto);
  $('.slider').addEventListener('mouseleave', startAuto);

  // Products
  renderProducts(state.products);
  $('#searchInput').addEventListener('input', applyFilters);
  $('#sortSelect').addEventListener('change', applyFilters);

  // Cart
  loadCart();
  renderCart();
  $('#btnCart').addEventListener('click', openCart);
  $('#closeCart').addEventListener('click', closeCart);
  $('#overlay').addEventListener('click', closeCart);
  $('#clearCart').addEventListener('click', clearCart);
  $('#cartItems').addEventListener('click', (e)=>{
    const btn = e.target.closest('button'); if(!btn) return;
    const id = btn.dataset.id, act = btn.dataset.act;
    if(act==='+') changeQty(id, +1);
    else if(act==='-') changeQty(id, -1);
    else if(act==='x') changeQty(id, -999);
  });

  // Apply voucher preview
  const applyVoucher = ()=>{
    // only visual note on product page; actual total handled in checkout.js
  };
});
