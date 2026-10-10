/* ============================================================
   کافه ویوالت — جاوااسکریپت ساده (بدون React)
   ============================================================ */

/* ---------- ۱) آیکون‌ها (SVG) ---------- */
const iconPaths = {
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  bag: '<path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
  calendar: '<rect width="16" height="15" x="4" y="5" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  minus: '<path d="M6 12h12"/>',
  plus: '<path d="M12 6v12M6 12h12"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
  users: '<path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M17 11a4 4 0 0 1 4 4v2"/>'
};

function icon(name, size = 20) {
  return `<svg aria-hidden="true" fill="none" width="${size}" height="${size}" viewBox="0 0 24 24"
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8">${iconPaths[name]}</svg>`;
}

// هر عنصری که data-icon دارد، آیکونش را می‌گیرد
function renderStaticIcons() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = icon(el.dataset.icon, Number(el.dataset.size) || 20);
  });
}

/* ---------- ۲) داده‌های منو ----------
   📷 اینجا عکس‌های شماره ۲ تا ۵ هستند.
   فقط مسیر فایل‌ها را در خط image عوض کن (یا فایل‌ها را با همین اسم‌ها در پوشه images بگذار) */
const menuItems = [
  {
    id: 1,
    name: "لاته ویوالت",
    detail: "اسپرسو دبل، شیر بافت‌دار، کرم پسته",
    price: 148,
    category: "قهوه",
    image: "./pic/latee.jpg" // 📷 عکس شماره ۲
  },
  {
    id: 2,
    name: "کروسان پسته",
    detail: "کروسان کره‌ای، کرم پسته تازه، پرک بادام",
    price: 175,
    category: "شیرینی",
    image: "./pic/crosan.jpg" // 📷 عکس شماره ۳
  },
  {
    id: 3,
    name: "صبحانه ویوالت",
    detail: "تخم‌مرغ، پنیر مزه‌دار، آووکادو و نان تازه",
    price: 295,
    category: "صبحانه",
    image: "./pic/break.jpg" // 📷 عکس شماره ۴
  },
  {
    id: 4,
    name: "کیک روز",
    detail: "کیک تازه روز با سس دست‌ساز و قهوه",
    price: 185,
    category: "شیرینی",
    image: "./pic/cake.jpg" // 📷 عکس شماره ۵
  }
];

const categories = ["همه", "قهوه", "صبحانه", "شیرینی"];

/* ---------- ۳) وضعیت برنامه (state) ---------- */
let activeCategory = "همه";
let cart = {}; // مثلاً { 1: 2, 3: 1 } یعنی از آیتم ۱ دو تا و از آیتم ۳ یکی

/* ---------- ۴) ابزارهای کمکی ---------- */
const faNumber = (n) => n.toLocaleString("fa-IR");
const $ = (id) => document.getElementById(id);

function getCartCount() {
  return Object.values(cart).reduce((sum, count) => sum + count, 0);
}

function getCartTotal() {
  return menuItems.reduce((sum, item) => sum + item.price * (cart[item.id] || 0), 0);
}

/* ---------- ۵) دسته‌بندی و کارت‌های منو ---------- */
function renderCategories() {
  $("category-row").innerHTML = categories
    .map(
      (cat) => `
      <button type="button" role="tab" data-category="${cat}"
        class="${cat === activeCategory ? "active" : ""}"
        aria-selected="${cat === activeCategory}">${cat}</button>`
    )
    .join("");
}

function renderMenu() {
  const visible =
    activeCategory === "همه"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  $("menu-grid").innerHTML = visible
    .map(
      (item) => `
      <article class="menu-card">
        <div class="menu-image">
          <img src="${item.image}" alt="${item.name}" />
          <span>${item.category}</span>
        </div>
        <div class="menu-card-body">
          <h3>${item.name}</h3>
          <p>${item.detail}</p>
          <div class="menu-card-footer">
            <strong>${faNumber(item.price)} <small>تومان</small></strong>
            <button type="button" data-add="${item.id}" aria-label="افزودن ${item.name} به سفارش">
              ${icon("plus")}
            </button>
          </div>
        </div>
      </article>`
    )
    .join("");
}

$("category-row").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-category]");
  if (!btn) return;
  activeCategory = btn.dataset.category;
  renderCategories();
  renderMenu();
});

$("menu-grid").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  updateCart(Number(btn.dataset.add), 1);
});

/* ---------- ۶) سبد خرید ---------- */
function updateCart(id, change) {
  const next = Math.max(0, (cart[id] || 0) + change);
  if (next === 0) delete cart[id];
  else cart[id] = next;
  renderCartBadge();
  if (!$("drawer-layer").hidden) renderDrawer();
}

function renderCartBadge() {
  const count = getCartCount();
  const badge = $("cart-count");
  badge.hidden = count === 0;
  badge.textContent = faNumber(count);
}

function renderDrawer() {
  const body = $("drawer-body");

  if (getCartCount() === 0) {
    body.innerHTML = `
      <div class="empty-cart">
        <span>${icon("bag", 30)}</span>
        <h3>سبد شما خالی است</h3>
        <p>از منوی ویوالت یک انتخاب خوش‌طعم داشته باش.</p>
        <button type="button" id="see-menu">مشاهده منو</button>
      </div>`;
    return;
  }

  const rows = menuItems
    .filter((item) => cart[item.id])
    .map(
      (item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="" />
        <div>
          <strong>${item.name}</strong>
          <small>${faNumber(item.price)} تومان</small>
        </div>
        <div class="quantity">
          <button type="button" data-minus="${item.id}">${icon("minus", 16)}</button>
          <span>${faNumber(cart[item.id])}</span>
          <button type="button" data-plus="${item.id}">${icon("plus", 16)}</button>
        </div>
      </div>`
    )
    .join("");

  const total = faNumber(getCartTotal());

  body.innerHTML = `
    <div class="cart-items">${rows}</div>
    <div class="cart-summary">
      <div><span>جمع سفارش</span><strong>${total} تومان</strong></div>
      <div><span>هزینه ارسال</span><strong>رایگان</strong></div>
      <hr />
      <div class="final-total"><span>مبلغ نهایی</span><strong>${total} تومان</strong></div>
      <button type="button" id="checkout">تکمیل سفارش ${icon("arrow")}</button>
    </div>`;
}

function openCart() {
  renderDrawer();
  $("drawer-layer").hidden = false;
}

function closeCart() {
  $("drawer-layer").hidden = true;
}

$("open-cart").addEventListener("click", openCart);
$("close-cart").addEventListener("click", closeCart);

// کلیک روی پس‌زمینه تیره، کشو را می‌بندد
$("drawer-layer").addEventListener("mousedown", (e) => {
  if (e.target === $("drawer-layer")) closeCart();
});

// دکمه‌هایی که داخل کشو ساخته می‌شوند (event delegation)
$("drawer-body").addEventListener("click", (e) => {
  const plus = e.target.closest("[data-plus]");
  const minus = e.target.closest("[data-minus]");

  if (plus) return updateCart(Number(plus.dataset.plus), 1);
  if (minus) return updateCart(Number(minus.dataset.minus), -1);

  if (e.target.closest("#see-menu")) {
    closeCart();
    $("menu").scrollIntoView();
  }
  if (e.target.closest("#checkout")) {
    cart = {};
    renderCartBadge();
    closeCart();
  }
});

// بستن کشو با کلید Esc
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});

/* ---------- ۷) فرم رزرو ---------- */
$("reservation-form").addEventListener("submit", (e) => {
  e.preventDefault();
  $("reservation-form").hidden = true;
  $("reservation-success").hidden = false;
});

$("new-reservation").addEventListener("click", () => {
  $("reservation-form").reset();
  $("reservation-success").hidden = true;
  $("reservation-form").hidden = false;
});

/* ---------- ۸) شروع ---------- */
renderStaticIcons();
renderCategories();
renderMenu();
renderCartBadge();