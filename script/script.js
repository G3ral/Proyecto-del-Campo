/**
 * DEL CAMPO - Lógica Frontend
 * Control de Modal, Navegación y Formularios
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. OBTENCIÓN DE ELEMENTOS DEL DOM
  const authModal = document.getElementById("auth-modal");
  const btnCloseModal = document.getElementById("close-modal");

  // Botones de Navegación (Header)
  const navLoginBtn = document.getElementById("nav-login-btn");
  const navRegisterBtn = document.getElementById("nav-register-btn");

  // Botones de Acción (Hero Section)
  const buyBtn = document.getElementById("buy-btn");
  const sellBtn = document.getElementById("sell-btn");

  // Pestañas (Tabs) del Modal
  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");

  // Vistas de Contenido dentro del Modal
  const viewLogin = document.getElementById("view-login");
  const viewRegister = document.getElementById("view-register");

  // Formularios
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  // Botones Selector de Rol
  const roleButtons = document.querySelectorAll(".role-btn");

  // 2. FUNCIONES PRINCIPALES
  
  /**
   * Abre el modal y muestra la vista deseada
   * @param {'login'|'register'} targetView - Vista a desplegar
   * @param {'buyer'|'farmer'} [targetRole] - Rol opcional preseleccionado
   */
  function openModal(targetView, targetRole = null) {
    if (!authModal) return;
    authModal.classList.remove("hidden");
    switchView(targetView);

    if (targetRole) {
      selectRole(targetRole);
    }
  }

  /**
   * Cierra el modal de autenticación
   */
  function closeModal() {
    if (!authModal) return;
    authModal.classList.add("hidden");
  }

  /**
   * Alterna entre las pestañas Iniciar Sesión / Registrarse
   * @param {'login'|'register'} view 
   */
  function switchView(view) {
    if (view === "login") {
      viewLogin.classList.remove("hidden");
      viewRegister.classList.add("hidden");
      tabLogin.classList.add("active");
      tabRegister.classList.remove("active");
    } else {
      viewRegister.classList.remove("hidden");
      viewLogin.classList.add("hidden");
      tabRegister.classList.add("active");
      tabLogin.classList.remove("active");
    }
  }

  /**
   * Selecciona visualmente el rol del usuario (Comprador vs Agricultor)
   * @param {'buyer'|'farmer'} role 
   */
  function selectRole(role) {
    roleButtons.forEach((btn) => {
      if (btn.getAttribute("data-role") === role) {
        btn.classList.add("active-role");
      } else {
        btn.classList.remove("active-role");
      }
    });
  }

  // 3. ASIGNACIÓN DE EVENTOS

  // Abrir Modal desde la Barra de Navegación
  if (navLoginBtn) {
    navLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("login");
    });
  }

  if (navRegisterBtn) {
    navRegisterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("register");
    });
  }

  // Abrir Modal desde los Botones del Hero (Conexión inteligente de UX)
  if (buyBtn) {
    buyBtn.addEventListener("click", () => openModal("register", "buyer"));
  }

  if (sellBtn) {
    sellBtn.addEventListener("click", () => openModal("register", "farmer"));
  }

  // Cerrar Modal con clic en la X
  if (btnCloseModal) {
    btnCloseModal.addEventListener("click", closeModal);
  }

  // Cerrar Modal con clic fuera de la caja contenedora
  if (authModal) {
    authModal.addEventListener("click", (e) => {
      if (e.target === authModal) {
        closeModal();
      }
    });
  }

  // Cerrar Modal presionado la tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && authModal && !authModal.classList.contains("hidden")) {
      closeModal();
    }
  });

  // Cambiar pestañas dentro del modal
  if (tabLogin) tabLogin.addEventListener("click", () => switchView("login"));
  if (tabRegister) tabRegister.addEventListener("click", () => switchView("register"));

  // Lógica para Mostrar/Ocultar Contraseña
  const togglePassButtons = document.querySelectorAll(".btn-toggle-pass");
  togglePassButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);
      const icon = this.querySelector("span");

      if (input) {
        if (input.type === "password") {
          input.type = "text";
          icon.textContent = "visibility_off";
        } else {
          input.type = "password";
          icon.textContent = "visibility";
        }
      }
    });
  });

  // Selección de Rol manual al hacer clic
  roleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const role = this.getAttribute("data-role");
      selectRole(role);
    });
  });

  // Manejo de Envíos de Formulario (Evita recarga de página)
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("¡Inicio de sesión exitoso!");
      closeModal();
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("¡Registro completado exitosamente!");
      closeModal();
    });
  }
});