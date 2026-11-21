/* ===== Данные товаров =====
   ФОТО: вставьте ссылку на картинку в поле img нужного товара, внутри кавычек:
       img:"https://site.com/photo.jpg"
   Можно и путь к файлу из проекта (прямой слэш /):
       img:"img/products/tshirt.jpg"
   Если img пустой ("") — на карточке будет серая заглушка.
   Строка товара должна заканчиваться на }, (запятая нужна у всех, кроме последнего). */
const products = [
  {id:1,  name:"Футболка оверсайз хлопок",   cat:"Футболки",   price:790,  old:1490, rating:4.8, reviews:1243, img:"img/tshirt.jpg"},
  {id:2,  name:"Худи с капюшоном",           cat:"Худи",       price:2490, old:3990, rating:4.7, reviews:864, img:"img/hudi.jpg"},
  {id:3,  name:"Джинсы прямого кроя",        cat:"Джинсы",     price:2990, old:4500, rating:4.6, reviews:532, img:"img/jins.jpg"},
  {id:4,  name:"Платье летнее миди",         cat:"Платья",     price:3290, old:5200, rating:4.9, reviews:421, img:"img/midi.jpg"},
  {id:5,  name:"Куртка демисезонная",        cat:"Куртки",     price:5990, old:8900, rating:4.7, reviews:318, img:"img/kurtka.jpg"},
  {id:6,  name:"Кроссовки городские",        cat:"Обувь",      price:4490, old:6300, rating:4.8, reviews:967, img:"img/kross.jpg"},
  {id:7,  name:"Кепка спортивная",           cat:"Аксессуары", price:590,  old:990,  rating:4.5, reviews:210, img:"img/kepkaspots.jpg"},
  {id:8,  name:"Юбка плиссе",                cat:"Юбки",       price:1890, old:2900, rating:4.6, reviews:289, img:"img/ubka.jpg"},
  {id:9,  name:"Свитшот базовый",            cat:"Худи",       price:1790, old:2600, rating:4.7, reviews:455, img:"img/tol.jpg"},
  {id:10, name:"Рубашка классическая",       cat:"Футболки",   price:1590, old:2400, rating:4.5, reviews:176, img:"img/rubashka.jpg"},
  {id:11, name:"Пальто шерстяное",           cat:"Куртки",     price:8990, old:12900,rating:4.9, reviews:97, img:"img/palto.jpg"},
  {id:12, name:"Сумка через плечо",          cat:"Аксессуары", price:1290, old:2100, rating:4.6, reviews:342, img:"img/sumkaa.jpg"}
];
const BRAND = "Moda Lab";


/* ===== localStorage ===== */
const load = (k) => JSON.parse(localStorage.getItem(k) || "[]");
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const money = (n) => n.toLocaleString("ru-RU") + " сом";
const discount = (p) => Math.round((1 - p.price / p.old) * 100);

/* ===== Счётчики в меню ===== */
function updateBadges(){
  const c = document.getElementById("cartBadge"), f = document.getElementById("favBadge");
  if (c) c.textContent = load("cart").reduce((s, i) => s + i.qty, 0);
  if (f) f.textContent = load("fav").length;
}

/* ===== Фото не загрузилось: показываем заглушку ===== */
function imgFail(img, id){
  const box = img.parentElement;
  box.classList.add("noimg");
  box.insertAdjacentHTML("beforeend", `Фото не загрузилось.<br>Проверьте ссылку в img у товара №${id}`);
  img.remove();
}

/* ===== Избранное и корзина ===== */
function toggleFav(id){
  let fav = load("fav");
  fav = fav.includes(id) ? fav.filter(x => x !== id) : [...fav, id];
  save("fav", fav); updateBadges(); rerender();
}
function addToCart(id){
  const cart = load("cart");
  const item = cart.find(i => i.id === id);
  item ? item.qty++ : cart.push({id, qty:1});
  save("cart", cart); updateBadges();
  alert("Товар добавлен в корзину");
}

/* ===== Карточка товара ===== */
function cardHTML(p){
  const on = load("fav").includes(p.id);
  return `
  <article class="card">
    <div class="thumb ${p.img ? "" : "noimg"}">
      <span class="sale">−${discount(p)}%</span>
      <button class="fav ${on ? "on" : ""}" onclick="toggleFav(${p.id})" title="В избранное">♥</button>
      ${p.img
        ? `<img src="${p.img}" alt="${p.name}" loading="lazy" onerror="imgFail(this, ${p.id})">`
        : `Вставьте ссылку на фото<br>в img у товара №${p.id}`}
    </div>
    <div class="card-body">
      <div class="price-row"><span class="price">${money(p.price)}</span><span class="old">${money(p.old)}</span></div>
      <div class="title"><b>${BRAND}</b> / ${p.name}</div>
      <div class="rating"><i>★</i> ${p.rating} · ${p.reviews} отзывов</div>
      <button class="btn" onclick="addToCart(${p.id})">В корзину</button>
    </div>
  </article>`;
}

/* ===== Каталог ===== */
let activeCat = "all";
function renderCatalog(){
  const box = document.getElementById("catalog");
  if (!box) return;
  const q = document.getElementById("search").value.toLowerCase().trim();
  const sort = document.getElementById("sort").value;
  let list = products.filter(p =>
    p.name.toLowerCase().includes(q) && (activeCat === "all" || p.cat === activeCat));
  if (sort === "asc")  list.sort((a, b) => a.price - b.price);
  if (sort === "desc") list.sort((a, b) => b.price - a.price);
  if (sort === "rate") list.sort((a, b) => b.rating - a.rating);
  if (sort === "sale") list.sort((a, b) => discount(b) - discount(a));
  document.getElementById("count").textContent = list.length + " товаров";
  box.innerHTML = list.length ? list.map(cardHTML).join("") : '<p class="empty">Ничего не найдено</p>';
}
function initCatalog(){
  const chips = document.getElementById("chips");
  if (!chips) return;
  const cats = ["all", ...new Set(products.map(p => p.cat))];
  chips.innerHTML = cats.map(c =>
    `<button class="chip ${c === "all" ? "on" : ""}" data-cat="${c}">${c === "all" ? "Все" : c}</button>`).join("");
  chips.addEventListener("click", e => {
    if (!e.target.dataset.cat) return;
    activeCat = e.target.dataset.cat;
    chips.querySelectorAll(".chip").forEach(b => b.classList.toggle("on", b === e.target));
    renderCatalog();
  });
  document.getElementById("sort").addEventListener("input", renderCatalog);
  document.getElementById("search").addEventListener("input", renderCatalog);
  /* поисковый запрос из шапки: catalog.html?q=... */
  const q = new URLSearchParams(location.search).get("q");
  if (q) document.getElementById("search").value = q;
}

/* ===== Поиск в шапке: переход в каталог ===== */
function initHeaderSearch(){
  const form = document.getElementById("headSearch");
  if (!form) return;
  const input = form.querySelector("input");
  if (document.getElementById("catalog")){            // мы на странице каталога — ищем на месте
    input.addEventListener("input", () => { document.getElementById("search").value = input.value; renderCatalog(); });
    const q = new URLSearchParams(location.search).get("q");
    if (q) input.value = q;
    form.addEventListener("submit", e => e.preventDefault());
  } else {
    form.addEventListener("submit", e => {
      e.preventDefault();
      location.href = "catalog.html?q=" + encodeURIComponent(input.value.trim());
    });
  }
}

/* ===== Главная: карусель и подборки ===== */
function initSlider(){
  const slides = document.querySelectorAll(".slide");
  const dotsBox = document.getElementById("dots");
  if (!slides.length) return;
  let cur = 0, timer;
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.addEventListener("click", () => { show(i); restart(); });
    dotsBox.appendChild(b);
  });
  function show(i){
    cur = i;
    slides.forEach((s, k) => s.classList.toggle("active", k === i));
    dotsBox.querySelectorAll("button").forEach((b, k) => b.classList.toggle("active", k === i));
  }
  function restart(){ clearInterval(timer); timer = setInterval(() => show((cur + 1) % slides.length), 5000); }
  show(0); restart();
}
function renderHome(){
  const hit = document.getElementById("hits");
  if (hit) hit.innerHTML = products.slice(0, 8).map(cardHTML).join("");
}

/* ===== Избранное ===== */
function renderFav(){
  const box = document.getElementById("favList");
  if (!box) return;
  const list = products.filter(p => load("fav").includes(p.id));
  box.innerHTML = list.length ? list.map(cardHTML).join("")
    : '<p class="empty">В избранном пока пусто. Нажимайте ♥ на товарах в каталоге</p>';
}

/* ===== Корзина ===== */
function changeQty(id, d){
  let cart = load("cart");
  const item = cart.find(i => i.id === id);
  item.qty += d;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  save("cart", cart); updateBadges(); renderCart();
}
function removeItem(id){
  save("cart", load("cart").filter(i => i.id !== id));
  updateBadges(); renderCart();
}
function renderCart(){
  const box = document.getElementById("cartBox");
  if (!box) return;
  const cart = load("cart");
  if (!cart.length){
    box.innerHTML = '<p class="empty" style="padding:30px 0">Корзина пуста. <a href="catalog.html" style="color:var(--accent-dark);font-weight:600">Перейти в каталог</a></p>';
    return;
  }
  let total = 0;
  const rows = cart.map(i => {
    const p = products.find(x => x.id === i.id);
    const sum = p.price * i.qty; total += sum;
    return `<tr>
      <td>${p.img ? `<img class="cart-img" src="${p.img}" alt="" onerror="this.style.visibility='hidden'">` : ""}</td>
      <td><b>${BRAND}</b> / ${p.name}</td>
      <td>${money(p.price)}</td>
      <td class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${i.qty}</span><button onclick="changeQty(${p.id},1)">+</button></td>
      <td><b>${money(sum)}</b></td>
      <td><button class="remove" onclick="removeItem(${p.id})" title="Удалить">✕</button></td></tr>`;
  }).join("");
  box.innerHTML = `
    <div class="table-wrap"><table>
      <tr><th></th><th>Товар</th><th>Цена</th><th>Кол-во</th><th>Сумма</th><th></th></tr>${rows}
    </table></div>
    <p class="total">Итого: ${money(total)}</p>
    <div style="text-align:right"><button class="btn" onclick="checkout()">Оформить заказ</button></div>`;
}
function checkout(){
  alert("Спасибо за заказ! Это учебный макет, оплата не производится.");
  save("cart", []); updateBadges(); renderCart();
}

/* ===== Форма обратной связи ===== */
function initForm(){
  const form = document.getElementById("feedback");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const msg = document.getElementById("formMsg");
    const name = form.name.value.trim(), email = form.email.value.trim(), text = form.text.value.trim();
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || text.length < 5){
      msg.className = "msg err";
      msg.textContent = "Проверьте поля: имя, корректный e-mail и сообщение.";
      return;
    }
    msg.className = "msg ok";
    msg.textContent = "Спасибо, " + name + "! Ваше сообщение отправлено.";
    form.reset();
  });
}

/* ===== Мобильное меню ===== */
function initMenu(){
  const b = document.getElementById("burger"), n = document.getElementById("menu");
  if (b) b.addEventListener("click", () => n.classList.toggle("open"));
}

function rerender(){ renderCatalog(); renderHome(); renderFav(); }

document.addEventListener("DOMContentLoaded", () => {
  initMenu(); initCatalog(); initHeaderSearch(); initSlider(); initForm();
  rerender(); renderCart(); updateBadges();
});
