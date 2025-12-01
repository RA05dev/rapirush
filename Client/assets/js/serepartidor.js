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
            
            // Mostrar modal de confirmación
            showSuccessModal(
                '✅ Repartidor Registrado',
                'Tu cuenta de repartidor ha sido registrada exitosamente. Revisa tu correo de confirmación y da clic en el enlace para activar tu cuenta.',
                'auth/login.html'
            );

        } catch (error) {
            console.error('❌ Error en registro de repartidor:', error);
            showAlert(error.message || 'Error en el registro. Intenta nuevamente.', 'danger');
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

    // ✅ FUNCIÓN PARA MOSTRAR MODAL DE ÉXITO
    function showSuccessModal(title, message, redirectUrl) {
        const modalHtml = `
            <div class="modal fade" id="successModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>${message}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" onclick="confirmAndRedirect('${redirectUrl}')">Aceptar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Crear e inyectar el modal
        const div = document.createElement('div');
        div.innerHTML = modalHtml;
        document.body.appendChild(div.firstElementChild);
        
        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('successModal'));
        modal.show();
        
        // Auto-redirigir después de 4 segundos
        setTimeout(() => {
            confirmAndRedirect(redirectUrl);
        }, 4000);
    }

    function confirmAndRedirect(url) {
        window.location.href = url;
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