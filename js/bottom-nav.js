// ===========================================
// Модуль нижней навигации (Bottom Navigation Bar)
// Простая версия без блокировки прокрутки
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
  createBottomNavigation();
  updateNavCounts();
  setInterval(updateNavCounts, 1000);
});

function createBottomNavigation() {
  if (document.getElementById('bottomNavBar')) return;
  
  const navBar = document.createElement('nav');
  navBar.id = 'bottomNavBar';
  navBar.innerHTML = `
    <button onclick="navGoHome()" class="nav-item active" data-nav="home">
      <span class="nav-icon">🏠</span>
      <span class="nav-text">Главная</span>
    </button>
    <button onclick="navGoCategories()" class="nav-item" data-nav="categories">
      <span class="nav-icon">📂</span>
      <span class="nav-text">Категории</span>
    </button>
    <button onclick="navGoCart()" class="nav-item nav-cart" data-nav="cart">
      <div class="nav-cart-btn">
        <span class="nav-icon">🛒</span>
        <span id="navCartBadge" class="nav-badge">0</span>
      </div>
      <span class="nav-text">Корзина</span>
    </button>
    <button onclick="navGoChat()" class="nav-item" data-nav="chat">
      <span class="nav-icon">💬</span>
      <span class="nav-text">Чат</span>
    </button>
    <button onclick="navGoProfile()" class="nav-item" data-nav="profile">
      <span class="nav-icon" id="navProfileIcon">👤</span>
      <span class="nav-text" id="navProfileText">Профиль</span>
    </button>
  `;
  
  addBottomNavStyles();
  document.body.appendChild(navBar);
  document.body.style.paddingBottom = '75px';
  hideOldFloatingButtons();
}

function addBottomNavStyles() {
  if (document.getElementById('bottomNavStyles')) return;
  
  const styles = document.createElement('style');
  styles.id = 'bottomNavStyles';
  styles.textContent = `
    #bottomNavBar {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 9600;
      background: white;
      box-shadow: 0 -2px 20px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      padding: 6px 0 10px 0;
      border-top: 1px solid #e0e0e0;
    }
    .nav-item {
      flex: 1;
      background: none;
      border: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      padding: 6px 4px;
      cursor: pointer;
      position: relative;
      color: #666;
    }
    .nav-item.active { color: #667eea; }
    .nav-item .nav-icon { font-size: 22px; }
    .nav-item .nav-text { font-size: 10px; font-weight: 500; }
    .nav-badge {
      position: absolute;
      top: 0;
      right: 50%;
      transform: translateX(12px);
      background: #e53935;
      color: white;
      font-size: 10px;
      font-weight: bold;
      min-width: 16px;
      height: 16px;
      border-radius: 8px;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
    }
    .nav-cart .nav-cart-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -20px;
      box-shadow: 0 4px 15px rgba(102,126,234,0.4);
      position: relative;
    }
    .nav-cart .nav-icon { color: white !important; }
    .nav-cart .nav-badge { top: -5px; right: -5px; transform: none; }
    @media (min-width: 769px) {
      #bottomNavBar { display: none; }
      body { padding-bottom: 0 !important; }
    }
  `;
  document.head.appendChild(styles);
}

function hideOldFloatingButtons() {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      #cartFloatBtn, #customerAccountBtn { display: none !important; }
    }
  `;
  document.head.appendChild(style);
}

// Закрыть все модальные окна
function closeAllModals() {
  // Профиль
  const profileModal = document.getElementById('profileFullscreenModal');
  const ordersModal = document.getElementById('ordersFullscreenModal');
  if (profileModal) profileModal.remove();
  if (ordersModal) ordersModal.remove();
  
  // Корзина
  const cartPage = document.getElementById('cartPage');
  if (cartPage) cartPage.style.display = 'none';
  
  // Избранное
  const favoritesPage = document.getElementById('favoritesPage');
  if (favoritesPage) favoritesPage.style.display = 'none';
  
  // Чат
  const chatWindow = document.getElementById('chatWindow');
  if (chatWindow) chatWindow.style.display = 'none';
  
  // Жалоба, Предложить товар, Стать продавцом
  const complaintWindow = document.getElementById('complaintWindow');
  if (complaintWindow) complaintWindow.style.display = 'none';
  
  const suggestionWindow = document.getElementById('suggestionWindow');
  if (suggestionWindow) suggestionWindow.style.display = 'none';
  
  const becomeSellerWindow = document.getElementById('becomeSellerWindow');
  if (becomeSellerWindow) becomeSellerWindow.style.display = 'none';
}

// Навигация
function navGoHome() {
  setActiveNavItem('home');
  closeCategoriesPanel();
  closeAllModals();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navGoCategories() {
  setActiveNavItem('categories');
  closeAllModals();
  openCategoriesPanel();
}

function navGoCart() {
  setActiveNavItem('cart');
  closeCategoriesPanel();
  closeAllModals();
  if (typeof openCartPage === 'function') openCartPage();
  else if (typeof showCart === 'function') showCart();
}

function navGoChat() {
  setActiveNavItem('chat');
  closeCategoriesPanel();
  closeAllModals();
  if (typeof toggleChat === 'function') toggleChat();
}

function navGoProfile() {
  setActiveNavItem('profile');
  closeCategoriesPanel();
  closeAllModals();
  if (typeof openCustomerAccount === 'function') openCustomerAccount();
}

function setActiveNavItem(navName) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.nav === navName);
  });
}

// Счётчики
function updateNavCounts() {
  const cartBadge = document.getElementById('navCartBadge');
  if (cartBadge && typeof cart !== 'undefined') {
    const count = Array.isArray(cart) ? cart.length : 0;
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Панель категорий
let _savedScrollPos = 0;

function openCategoriesPanel() {
  _savedScrollPos = window.pageYOffset || 0;
  
  // Удаляем старую панель чтобы обновить категории
  const oldPanel = document.getElementById('categoriesPanel');
  if (oldPanel) oldPanel.remove();
  
  const panel = document.createElement('div');
  panel.id = 'categoriesPanel';
  
  // Получаем категории динамически со страницы
  const categories = getCategoriesFromPage();
  
  panel.innerHTML = `
    <div class="cat-overlay"></div>
    <div class="categories-panel-content">
      <div class="cat-header">
        <h3>📂 Категории</h3>
        <button class="cat-close">&times;</button>
      </div>
      <div class="cat-body">
        ${categories.map(c => `
          <button class="cat-btn" data-cat="${c.value}">
            <span class="cat-icon">${c.icon}</span>
            <span class="cat-name">${c.name}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
  
  addCategoriesPanelStyles();
  document.body.appendChild(panel);
  
  panel.querySelector('.cat-overlay').onclick = closeCategoriesPanel;
  panel.querySelector('.cat-close').onclick = closeCategoriesPanel;
  panel.querySelectorAll('.cat-btn').forEach(btn => {
    btn.onclick = () => selectCategory(btn.dataset.cat);
  });
  
  requestAnimationFrame(() => {
    panel.style.opacity = '1';
    panel.querySelector('.categories-panel-content').style.transform = 'translateY(0)';
  });
}

// Получить категории со страницы
function getCategoriesFromPage() {
  const categories = [];
  const defaultIcons = {
    'все': '🏪',
    'ножницы': '✂️',
    'скотч': '📦',
    'нож': '🔪',
    'корейские': '🇰🇷',
    'часы': '⌚',
    'электроника': '🔌',
    'бытовые': '🏠'
  };
  
  // Получаем категории из кнопок на странице
  const buttons = document.querySelectorAll('.category-btn[data-category]');
  
  buttons.forEach(btn => {
    const value = btn.dataset.category;
    if (!value) return;
    
    // Проверяем, не добавлена ли уже
    if (categories.find(c => c.value === value)) return;
    
    let name = btn.textContent.trim();
    // Убираем эмодзи из начала названия если есть
    name = name.replace(/^[^\w\sа-яёА-ЯЁ]+\s*/, '').trim() || value;
    
    const icon = defaultIcons[value.toLowerCase()] || '📁';
    
    categories.push({ value, name, icon });
  });
  
  // Если кнопок нет - используем стандартные
  if (categories.length === 0) {
    return [
      { value: 'все', name: 'Все товары', icon: '🏪' },
      { value: 'ножницы', name: 'Ножницы', icon: '✂️' },
      { value: 'скотч', name: 'Скотч', icon: '📦' },
      { value: 'нож', name: 'Ножи', icon: '🔪' },
      { value: 'корейские', name: 'Корейские товары', icon: '🇰🇷' },
      { value: 'часы', name: 'Часы', icon: '⌚' },
      { value: 'электроника', name: 'Электроника', icon: '🔌' },
      { value: 'бытовые', name: 'Бытовые техники', icon: '🏠' }
    ];
  }
  
  return categories;
}

function closeCategoriesPanel() {
  const panel = document.getElementById('categoriesPanel');
  if (!panel) return;
  panel.style.opacity = '0';
  const content = panel.querySelector('.categories-panel-content');
  if (content) content.style.transform = 'translateY(100%)';
  setTimeout(() => { panel.style.display = 'none'; }, 300);
  setActiveNavItem('home');
}

function selectCategory(value) {
  const pos = _savedScrollPos;
  const panel = document.getElementById('categoriesPanel');
  if (panel) panel.remove();
  setActiveNavItem('home');
  
  if (typeof filterByCategory === 'function') {
    filterByCategory(value);
  }
  
  setTimeout(() => window.scrollTo(0, pos), 100);
}

function addCategoriesPanelStyles() {
  if (document.getElementById('catPanelStyles')) return;
  const s = document.createElement('style');
  s.id = 'catPanelStyles';
  s.textContent = `
    #categoriesPanel {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 9700;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .cat-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
    }
    .categories-panel-content {
      position: absolute;
      bottom: 75px; left: 0; right: 0;
      background: white;
      border-radius: 20px 20px 0 0;
      max-height: 70vh;
      transform: translateY(100%);
      transition: transform 0.3s;
    }
    .cat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-radius: 20px 20px 0 0;
    }
    .cat-header h3 { margin: 0; font-size: 18px; }
    .cat-close {
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      width: 32px; height: 32px;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
    }
    .cat-body {
      padding: 15px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      max-height: calc(70vh - 60px);
      overflow-y: auto;
    }
    .cat-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 12px 8px;
      border: none;
      background: #f5f5f5;
      border-radius: 10px;
      cursor: pointer;
      color: #333;
    }
    .cat-btn:active { background: #667eea; color: white; }
    .cat-icon { font-size: 24px; }
    .cat-name { font-size: 11px; text-align: center; color: #333; }
  `;
  document.head.appendChild(s);
}
