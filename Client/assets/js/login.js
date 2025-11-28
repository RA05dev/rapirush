// login.js - VERSIÓN CORREGIDA
document.addEventListener('DOMContentLoaded', function() {
    // ✅ VERIFICAR SI YA ESTÁ LOGUEADO (usando authManager)
    if (window.authManager && authManager.isLoggedIn()) {
        console.log('✅ Usuario ya logueado, redirigiendo...');
        const user = authManager.getCurrentUser();
        redirectByRole(user);
        return;
    }

    // Toggle password visibility
    document.getElementById('togglePassword').addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.getElementById('toggleIcon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('bi-eye');
            toggleIcon.classList.add('bi-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('bi-eye-slash');
            toggleIcon.classList.add('bi-eye');
        }
    });

    // ✅ MANEJAR LOGIN CON authManager (CORREGIDO)
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!email || !password) {
            showAlert('Por favor completa todos los campos', 'danger');
            return;
        }

        // Mostrar loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spinner"></i> Iniciando sesión...';
        submitBtn.disabled = true;

        try {
            console.log('📤 Iniciando login con authManager:', email);
            
            // ✅ USAR authManager para login
            const user = await authManager.login(email, password, rememberMe);
            
            console.log('✅ Login exitoso con authManager:', user);
            
            showAlert(`¡Bienvenido ${user.name || user.email}!`, 'success');
            
            // ✅ REDIRIGIR DESPUÉS DE LOGIN EXITOSO
            setTimeout(() => {
                redirectAfterLogin(user);
            }, 1000);

        } catch (error) {
            console.error('❌ Error en login:', error);
            showAlert(error.message || 'Credenciales incorrectas. Intenta nuevamente.', 'danger');
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // ✅ FUNCIÓN MEJORADA: Redirección después de login
    function redirectAfterLogin(user) {
        console.log('🔄 Iniciando redirección después de login...');
        
        // ✅ PEQUEÑO DELAY PARA ASEGURAR QUE TODO ESTÉ CARGADO
        setTimeout(() => {
            // ✅ VERIFICAR URL DE REDIRECCIÓN PENDIENTE (más robusto)
            const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
            console.log('📍 URL de redirección pendiente:', redirectUrl);
            
            if (redirectUrl && redirectUrl !== window.location.href) {
                console.log('🎯 Redirigiendo a URL pendiente específica:', redirectUrl);
                sessionStorage.removeItem('redirectAfterLogin');
                
                // ✅ USAR replace() para evitar problemas de historial
                window.location.replace(redirectUrl);
                return;
            }
            
            // ✅ SI NO HAY REDIRECCIÓN ESPECÍFICA, USAR LA LÓGICA POR ROL
            console.log('🏠 Redirigiendo al dashboard por rol...');
            redirectByRole(user);
            
        }, 500); // Pequeño delay para estabilizar
    }

    // ✅ FUNCIÓN MEJORADA: Redirección por rol
    function redirectByRole(user) {
        const role = user.role || user.rol || 'cliente';
        console.log('🎯 Redirigiendo por rol después de login:', role);
        
        // ✅ PRIMERO VERIFICAR SI HAY UNA REDIRECCIÓN PENDIENTE
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        console.log('📍 URL de redirección pendiente:', redirectUrl);
        
        if (redirectUrl) {
            console.log('🎯 Redirigiendo a URL pendiente:', redirectUrl);
            sessionStorage.removeItem('redirectAfterLogin');
            
            // ✅ USAR replace para evitar problemas de navegación
            window.location.replace(redirectUrl);
            return;
        }
        
        // ✅ SI NO HAY REDIRECCIÓN PENDIENTE, IR AL DASHBOARD CORRESPONDIENTE
        let targetPage = '';
        switch(role) {
            case 'cliente':
                targetPage = '../dashboard/cliente.html';
                break;
            case 'restaurante':
                targetPage = '../dashboard/restaurante.html';
                break;
            case 'repartidor':
                targetPage = '../dashboard/repartidor.html';
                break;
            case 'admin':
                targetPage = '../dashboard/admin.html';
                break;
            default:
                targetPage = '../dashboard/cliente.html';
        }
        
        console.log('📍 Redirigiendo al dashboard:', targetPage);
        window.location.replace(targetPage);
    }

    // Función para mostrar alertas
    function showAlert(message, type) {
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.querySelector('#loginForm').prepend(alertDiv);

        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    // Cargar email recordado si existe
    const rememberedEmail = localStorage.getItem('user_email');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }
});