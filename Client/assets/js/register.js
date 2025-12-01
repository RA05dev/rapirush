// register.js - VERSIÓN CORREGIDA
document.addEventListener('DOMContentLoaded', function() {
    // ✅ VERIFICAR SI YA ESTÁ LOGUEADO
    if (window.authManager && window.authManager.isLoggedIn()) {
        console.log('✅ Usuario ya logueado, redirigiendo...');
        window.location.href = window.authManager.getDashboardUrl();
        return;
    }

    // Toggle password visibility (SOLO para contraseña principal)
    const togglePasswordBtn = document.getElementById('togglePassword');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const toggleIcon = this.querySelector('i');
            
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
    }

    // ✅ SOLO si existe el botón de confirmar contraseña
    const toggleConfirmBtn = document.getElementById('toggleConfirmPassword');
    if (toggleConfirmBtn) {
        toggleConfirmBtn.addEventListener('click', function() {
            const confirmInput = document.getElementById('confirmPassword');
            const toggleIcon = this.querySelector('i');
            
            if (confirmInput.type === 'password') {
                confirmInput.type = 'text';
                toggleIcon.classList.remove('bi-eye');
                toggleIcon.classList.add('bi-eye-slash');
            } else {
                confirmInput.type = 'password';
                toggleIcon.classList.remove('bi-eye-slash');
                toggleIcon.classList.add('bi-eye');
            }
        });
    }

    // ✅ MANEJAR REGISTRO
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        
        const formData = {
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            nombres: `${firstName} ${lastName}`, // ✅ Combinar nombre + apellido
            telefono: document.getElementById('phone').value.trim(),   // ✅ Cambiar a 'telefono'
            direccion: document.getElementById('address').value.trim(), // ✅ Cambiar a 'direccion'
            termsAccepted: document.getElementById('terms').checked,
            wantsPromotions: document.getElementById('promotions').checked
        };

        console.log('📝 Datos del formulario:', formData);

        // Validaciones
        if (!formData.termsAccepted) {
            showAlert('Debes aceptar los términos y condiciones', 'danger');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showAlert('Las contraseñas no coinciden', 'danger');
            return;
        }

        if (formData.password.length < 6) {
            showAlert('La contraseña debe tener al menos 6 caracteres', 'danger');
            return;
        }

        // ✅ MEJORA: Validación más flexible para teléfono
        if (formData.telefono && !/^\d{9}$/.test(formData.telefono)) {
            showAlert('El teléfono debe tener exactamente 9 dígitos numéricos', 'danger');
            return;
        }

        // Mostrar loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spinner"></i> Creando cuenta...';
        submitBtn.disabled = true;

        try {
            console.log('📤 Iniciando registro con authManager...');
            
            // ✅ USAR authManager para registro
            const user = await window.authManager.register({
                email: formData.email,
                password: formData.password,
                nombres: formData.nombres,
                telefono: formData.telefono,
                direccion: formData.direccion
            });
            
            console.log('✅ Registro exitoso:', user);
            
            // ✅ MOSTRAR TOAST INFORMATIVO
            showAlert(`¡Cuenta creada! Por favor confirma tu email para continuar.`, 'success');
            
            // ✅ REDIRIGIR AL LOGIN (no al dashboard) - deben verificar email primero
            // NO abrir ventana pop-up, el usuario confirma desde su email
            setTimeout(() => {
                window.location.href = '../auth/login.html';
            }, 2000);

        } catch (error) {
            console.error('❌ Error en registro:', error);
            const errorMessage = error.message || 'Error al crear la cuenta. Intenta nuevamente.';
            showAlert(errorMessage, 'danger');
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Función para mostrar alertas - USAR ALERTA GLOBAL
    function showAlert(message, type) {
        window.globalShowAlert(message, type, 5000);
    }
});