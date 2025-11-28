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
        
        const formData = {
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            nombres: document.getElementById('fullName').value.trim(), // ✅ Cambiar a 'nombres'
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

        if (formData.telefono && formData.telefono.length !== 9) {
            showAlert('El teléfono debe tener 9 dígitos', 'danger');
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
            
            console.log('✅ Registro exitoso:', user);
            
            // ✅ CLIENTES DEBEN VERIFICAR EMAIL ANTES DE PODER INICIAR SESIÓN
            showAlert(`¡Cuenta creada! Por favor verifica tu email para poder iniciar sesión.`, 'success');
            
            // ✅ REDIRIGIR AL LOGIN (no al dashboard) - deben verificar email primero
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

        document.querySelector('#registerForm').prepend(alertDiv);

        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
});