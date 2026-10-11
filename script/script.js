/**
 * Lógica de Interacción Principal - Del Campo Guatemala
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. ESTADO GLOBAL DE LA APLICACIÓN
  // ==========================================
  const state = {
    cartTotal: 0,
    toastTimeout: null,
    currentAuthMode: "login", // 'login' | 'register'
    currentLoginRole: "buyer", // 'buyer' | 'farmer'
    currentRegisterRole: "buyer", // 'buyer' | 'farmer'
  };

  // Estado unificado para el sistema de filtros en el Marketplace
  const filterState = {
    dept: localStorage.getItem("selectedLocation") || "todos",
    category: "todas",
    searchQuery: "",
  };

  // ==========================================
  // 2. SELECCIÓN DE ELEMENTOS DEL DOM
  // ==========================================
  // Modal de Autenticación
  const authModal = document.getElementById("auth-modal");
  const modalDynamicHeading = document.getElementById("modal-dynamic-heading");
  const btnCloseAuth =
    document.getElementById("btn-close-auth") ||
    authModal?.querySelector(".btn-close-modal");

  // Tabs Modal
  const tabBtnLogin = document.getElementById("tab-btn-login");
  const tabBtnRegister = document.getElementById("tab-btn-register");
  const tabContentLogin = document.getElementById("tab-content-login");
  const tabContentRegister = document.getElementById("tab-content-register");

  // Selector de Roles (Login y Registro)
  const loginRoleBuyer = document.getElementById("login-role-buyer");
  const loginRoleFarmer = document.getElementById("login-role-farmer");
  const regRoleBuyer = document.getElementById("reg-role-buyer");
  const regRoleFarmer = document.getElementById("reg-role-farmer");

  // Formularios
  const formLogin = document.getElementById("form-login");
  const formRegister = document.getElementById("form-register");

  // Enlaces de conmutación
  const linkToRegister = document.getElementById("link-to-register");
  const linkToLogin = document.getElementById("link-to-login");

  // Panel Agricultor / Modal Carga
  const modalUpload = document.getElementById("modal-upload");
  const btnOpenUploadModal = document.getElementById("btn-open-upload-modal");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const btnCancelModal = document.getElementById("btn-cancel-modal");
  const formUploadProduct = document.getElementById("form-upload-product");
  const ordersList = document.querySelector(".orders-list");

  // Marketplace & Carrito
  const cartCountElement = document.getElementById("cart-count");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.querySelector(".search-input");
  const noProductsMsg = document.getElementById("no-products-msg");

  // Menú de usuario y ubicación
  const userMenuBtn = document.getElementById("user-menu-btn");
  const userDropdownMenu = document.getElementById("user-dropdown-menu");
  const btnLogout = document.getElementById("btn-logout");

  const locationBtn = document.getElementById("location-btn");
  const locationModal = document.getElementById("location-modal");
  const btnCloseLocationModal = document.getElementById(
    "btn-close-location-modal",
  );
  const selectedLocationText = document.getElementById(
    "selected-location-text",
  );
  const deptButtons = document.querySelectorAll(".dept-btn");
  const categoryItems = document.querySelectorAll(
    ".category-item[data-category]",
  );
  const productCards = document.querySelectorAll(
    ".product-card[data-location]",
  );

  const deptNames = {
    todos: "Todos los departamentos",
    guatemala: "Guatemala",
    chimaltenango: "Chimaltenango",
    sacatepequez: "Sacatepéquez",
    quetzaltenango: "Quetzaltenango",
    solola: "Sololá",
    "alta-verapaz": "Alta Verapaz",
    "san-marcos": "San Marcos",
  };

  // ==========================================
  // 3. MÓDULO DE AUTENTICACIÓN
  // ==========================================
  function openAuthModal(tab = "login", role = null) {
    if (!authModal) return;
    if (role) {
      if (tab === "login") selectLoginRole(role);
      if (tab === "register") selectRegisterRole(role);
    }
    switchAuthTab(tab);
    authModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  function handleBackdropClick(event) {
    if (event.target === authModal || event.target.id === "auth-modal") {
      closeAuthModal();
    }
  }

  function switchAuthTab(tab) {
    state.currentAuthMode = tab;
    const isLogin = tab === "login";

    if (tabBtnLogin) tabBtnLogin.classList.toggle("active", isLogin);
    if (tabBtnRegister) tabBtnRegister.classList.toggle("active", !isLogin);
    if (tabContentLogin) tabContentLogin.classList.toggle("hidden", !isLogin);
    if (tabContentRegister)
      tabContentRegister.classList.toggle("hidden", isLogin);

    if (modalDynamicHeading) {
      modalDynamicHeading.textContent = isLogin
        ? "Bienvenido a Del Campo"
        : "Únete a Del Campo";
    }
  }

  function selectLoginRole(role) {
    state.currentLoginRole = role;
    if (loginRoleBuyer && loginRoleFarmer) {
      loginRoleBuyer.classList.toggle("active", role === "buyer");
      loginRoleFarmer.classList.toggle("active", role === "farmer");
    }
  }

  function selectRegisterRole(role) {
    state.currentRegisterRole = role;
    if (regRoleBuyer && regRoleFarmer) {
      regRoleBuyer.classList.toggle("active", role === "buyer");
      regRoleFarmer.classList.toggle("active", role === "farmer");
    }
  }

  // ==========================================
  // 4. MÓDULO DE UBICACIÓN (MODAL Y NAVEGACIÓN)
  // ==========================================
  function openLocationModal() {
    if (locationModal) {
      locationModal.classList.add("active");
      document.body.style.overflow = "hidden"; // Evita el scroll del fondo
    }
  }

  function closeLocationModal() {
    if (locationModal) {
      locationModal.classList.remove("active");
      document.body.style.overflow = ""; // Restaura el scroll
    }
  }

  // ==========================================
  // 5. MÓDULO DE NOTIFICACIONES Y CARRITO
  // ==========================================
  function showNotification(message) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(state.toastTimeout);
    state.toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }

  function addToCart(productName) {
    state.cartTotal += 1;

    if (cartCountElement) {
      cartCountElement.textContent = state.cartTotal;
      cartCountElement.classList.add("bounce");
      setTimeout(() => cartCountElement.classList.remove("bounce"), 200);
    }

    showNotification(`¡${productName} agregado al carrito!`);
  }

  // Exposición al ámbito global
  window.addToCart = addToCart;
  window.openAuthModal = openAuthModal;
  window.closeAuthModal = closeAuthModal;
  window.handleBackdropClick = handleBackdropClick;
  window.switchAuthTab = switchAuthTab;
  window.selectLoginRole = selectLoginRole;
  window.selectRegisterRole = selectRegisterRole;

  // ==========================================
  // 6. SISTEMA UNIFICADO DE FILTRADO
  // ==========================================
  function applyAllFilters() {
    let visibleCount = 0;
    const query = filterState.searchQuery.toLowerCase().trim();

    productCards.forEach((card) => {
      const cardLocation = card.getAttribute("data-location") || "todos";
      const cardCategory = card.getAttribute("data-category") || "todas";

      const cardTitle =
        card.querySelector(".product-title")?.textContent.toLowerCase() || "";
      const cardVendor =
        card.querySelector(".product-vendor")?.textContent.toLowerCase() || "";

      const matchesDept =
        filterState.dept === "todos" || cardLocation === filterState.dept;
      const matchesCategory =
        filterState.category === "todas" ||
        cardCategory === filterState.category;
      const matchesSearch =
        !query || cardTitle.includes(query) || cardVendor.includes(query);

      if (matchesDept && matchesCategory && matchesSearch) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (selectedLocationText) {
      selectedLocationText.textContent =
        deptNames[filterState.dept] || "Guatemala";
    }

    deptButtons.forEach((btn) => {
      btn.classList.toggle(
        "active",
        btn.getAttribute("data-dept") === filterState.dept,
      );
    });

    if (noProductsMsg) {
      noProductsMsg.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  // ==========================================
  // 7. ASIGNACIÓN DE EVENTOS (EVENT LISTENERS)
  // ==========================================

  // --- Modal de Autenticación ---
  if (btnCloseAuth) btnCloseAuth.addEventListener("click", closeAuthModal);
  if (authModal) authModal.addEventListener("click", handleBackdropClick);

  if (tabBtnLogin)
    tabBtnLogin.addEventListener("click", () => switchAuthTab("login"));
  if (tabBtnRegister)
    tabBtnRegister.addEventListener("click", () => switchAuthTab("register"));

  if (loginRoleBuyer)
    loginRoleBuyer.addEventListener("click", () => selectLoginRole("buyer"));
  if (loginRoleFarmer)
    loginRoleFarmer.addEventListener("click", () => selectLoginRole("farmer"));

  if (regRoleBuyer)
    regRoleBuyer.addEventListener("click", () => selectRegisterRole("buyer"));
  if (regRoleFarmer)
    regRoleFarmer.addEventListener("click", () => selectRegisterRole("farmer"));

  if (linkToRegister) {
    linkToRegister.addEventListener("click", (e) => {
      e.preventDefault();
      switchAuthTab("register");
    });
  }

  if (linkToLogin) {
    linkToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      switchAuthTab("login");
    });
  }

  // --- Envío del Formulario de Login ---
  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      const defaultAvatar =
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
      const roleSelected = state.currentLoginRole;

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isNewUser", "false");
      localStorage.setItem("userName", "Stephanie Valladares");
      localStorage.setItem("userAvatar", defaultAvatar);
      localStorage.setItem("userRole", roleSelected);

      closeAuthModal();

      if (roleSelected === "farmer") {
        window.location.href = "perfilUsuario.html";
      } else {
        window.location.href = "marketPlace.html";
      }
    });
  }

  // --- Envío del Formulario de Registro ---
  if (formRegister) {
    formRegister.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputName = document.getElementById("register-name");
      const userName =
        inputName && inputName.value.trim()
          ? inputName.value.trim()
          : "Nuevo Usuario";
      const defaultAvatar =
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
      const roleSelected = state.currentRegisterRole;

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userName", userName);
      localStorage.setItem("userAvatar", defaultAvatar);
      localStorage.setItem("userRole", roleSelected);
      localStorage.setItem("isNewUser", "true");

      closeAuthModal();

      if (roleSelected === "farmer") {
        window.location.href = "perfilUsuario.html";
      } else {
        window.location.href = "marketPlace.html";
      }
    });
  }

  // --- Modal Subir Cosecha (Panel Agricultor) ---
  if (btnOpenUploadModal && modalUpload) {
    btnOpenUploadModal.addEventListener("click", () => {
      modalUpload.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  const closeUploadModal = () => {
    if (modalUpload) {
      modalUpload.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  if (btnCloseModal) btnCloseModal.addEventListener("click", closeUploadModal);
  if (btnCancelModal)
    btnCancelModal.addEventListener("click", closeUploadModal);

  if (modalUpload) {
    modalUpload.addEventListener("click", (e) => {
      if (e.target === modalUpload) closeUploadModal();
    });
  }

  if (formUploadProduct) {
    formUploadProduct.addEventListener("submit", (e) => {
      e.preventDefault();
      showNotification("¡Cosecha publicada exitosamente!");
      formUploadProduct.reset();
      closeUploadModal();
    });
  }

  // --- Eventos del Modal de Ubicación ---
  if (locationBtn) {
    locationBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openLocationModal();
    });
  }

  if (btnCloseLocationModal) {
    btnCloseLocationModal.addEventListener("click", closeLocationModal);
  }

  if (locationModal) {
    locationModal.addEventListener("click", (e) => {
      if (e.target === locationModal) {
        closeLocationModal();
      }
    });
  }

  deptButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedDept = btn.getAttribute("data-dept");
      filterState.dept = selectedDept;
      localStorage.setItem("selectedLocation", selectedDept);
      applyAllFilters();
      closeLocationModal();
    });
  });

  // --- Eventos de Categoría y Búsqueda ---
  categoryItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      categoryItems.forEach((cat) => cat.classList.remove("active"));
      item.classList.add("active");

      filterState.category = item.getAttribute("data-category");
      applyAllFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filterState.searchQuery = e.target.value;
      applyAllFilters();
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (searchInput) {
        filterState.searchQuery = searchInput.value;
        applyAllFilters();
      }
    });
  }

  // --- Carga Inicial de Datos de Usuario ---
  const storedName = localStorage.getItem("userName");
  const storedAvatar = localStorage.getItem("userAvatar");
  const isProfilePage = window.location.pathname.includes("perfilUsuario");

  if (isProfilePage) {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      window.location.href = "index.html";
    }

    const greetingElement = document.querySelector(".greeting-title h1");
    const profileNameElement = document.querySelector(".profile-name");

    if (storedName) {
      if (greetingElement) greetingElement.innerHTML = `¡Hola, ${storedName}!`;
      if (profileNameElement) profileNameElement.textContent = storedName;
    }

    const isNewUser = localStorage.getItem("isNewUser");
    if (isNewUser === "true") {
      setTimeout(() => {
        alert(
          `¡Bienvenido a Del Campo, ${storedName || ""}! Tu cuenta fue creada exitosamente.`,
        );
        localStorage.setItem("isNewUser", "false");
      }, 300);
    }
  }

  // Menú Flotante de Usuario
  if (userMenuBtn && userDropdownMenu) {
    userMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      userDropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (
        !userDropdownMenu.contains(e.target) &&
        !userMenuBtn.contains(e.target)
      ) {
        userDropdownMenu.classList.remove("show");
      }
    });
  }

  const displayNameElem = document.getElementById("user-display-name");
  const avatarElem = document.getElementById("user-avatar");
  const dropdownNameElem = document.getElementById("dropdown-user-name");

  if (storedName) {
    if (displayNameElem) displayNameElem.textContent = storedName;
    if (dropdownNameElem) dropdownNameElem.textContent = storedName;
  }

  if (storedAvatar && avatarElem) {
    avatarElem.src = storedAvatar;
  }

  // Cerrar Sesión
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "index.html";
    });
  }

  // Filtro inicial al cargar
  applyAllFilters();

  // Tecla ESC para cerrar modales
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (authModal && authModal.classList.contains("active")) closeAuthModal();
      if (modalUpload && modalUpload.classList.contains("active"))
        closeUploadModal();
      if (locationModal && locationModal.classList.contains("active"))
        closeLocationModal();
    }
  });
});
