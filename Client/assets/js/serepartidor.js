// serepartidor.js - Registro de Repartidores
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    // Validación de teléfono (solo números)
    document.getElementById('telefono').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
    });

    // ✅ MANEJAR REGISTRO DE REPARTIDOR
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const userData = {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('correo').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirm-password').value,
            telefono: document.getElementById('telefono').value.trim(),
            vehiculo: document.getElementById('vehiculo').value
        };

        // Validaciones básicas
        if (!userData.nombre || !userData.email || !userData.password || !userData.confirmPassword || !userData.telefono || !userData.vehiculo) {
            showAlert('Por favor completa todos los campos obligatorios', 'danger');
            return;
        }

        // Validar que las contraseñas coincidan
        if (userData.password !== userData.confirmPassword) {
            showAlert('Las contraseñas no coinciden', 'danger');
            return;
        }

        // Validar longitud de contraseña
        if (userData.password.length < 6) {
            showAlert('La contraseña debe tener al menos 6 caracteres', 'danger');
            return;
        }

        if (userData.telefono.length < 9) {
            showAlert('El teléfono debe tener al menos 9 dígitos', 'danger');
            return;
        }

        // Mostrar loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spinner"></i> Enviando solicitud...';
        submitBtn.disabled = true;

        try {
            console.log('📤 Registrando repartidor:', userData);
            
            // ✅ USAR RapiRushAPI para registro de repartidor
            const result = await RapiRushAPI.registerRepartidor(userData);
            
            console.log('✅ Repartidor registrado exitosamente:', result);
            
            showToast('✅ ¡Registrado! Confirma tu email para iniciar sesión', 'success');
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                window.location.href = '../auth/login.html';
            }, 2000);

        } catch (error) {
            console.error('❌ Error en registro de repartidor:', error);
            showAlert(error.message || 'Error en el registro. Intenta nuevamente.', 'danger');
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Función para mostrar alertas
    function showAlert(message, type) {
        // Remover alertas existentes
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

        form.prepend(alertDiv);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    // ✅ FUNCIÓN PARA MOSTRAR TOAST (notificación flotante)
    function showToast(message, type = 'info') {
        // Crear contenedor de toasts si no existe
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(toastContainer);
        }

        // Crear elemento toast
        const toastEl = document.createElement('div');
        const bgColor = type === 'success' ? 'success' : type === 'danger' ? 'danger' : 'info';
        
        toastEl.className = `alert alert-${bgColor} alert-dismissible fade show`;
        toastEl.style.cssText = `
            min-width: 300px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease-out;
        `;
        toastEl.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        toastContainer.appendChild(toastEl);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            toastEl.remove();
        }, 5000);
    }
});