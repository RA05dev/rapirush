// agregarestaurante.js - VERSIÓN CORREGIDA CON PASSWORD
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 agregarestaurante.js cargado');
    
    const form = document.getElementById('rest-reg-form');
    
    if (!form) {
        console.error('❌ No se encontró el formulario con id "rest-reg-form"');
        return;
    }
    
    console.log('✅ Formulario encontrado');

    // Validación de teléfono
    const phoneInput = document.getElementById('rest-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
        });
    }

    form.addEventListener('submit', function(e) {
        console.log('📤 Formulario enviado');
        e.preventDefault();
        handleRestaurantRegistration();
    });

    async function handleRestaurantRegistration() {
        console.log('🔄 Iniciando registro de restaurante...');
        
        // Obtener valores del formulario
        const userData = {
            nombre: document.getElementById('rest-name').value.trim(),
            email: document.getElementById('rest-email').value.trim(),
            telefono: document.getElementById('rest-phone').value.trim(),
            direccion: document.getElementById('rest-address').value.trim(),
            tipoComida: document.getElementById('tipoComida').value,
            password: document.getElementById('rest-password').value,
            confirmPassword: document.getElementById('rest-confirm-password').value,
            image_url: document.getElementById('rest-image-url').value.trim() || null
        };

        console.log('📝 Datos del formulario:', { ...userData, password: '***' });

        // Validaciones
        if (!userData.nombre || !userData.email || !userData.telefono || 
            !userData.direccion || !userData.tipoComida || !userData.password) {
            showAlert('Por favor completa todos los campos obligatorios', 'danger');
            return;
        }

        if (userData.password.length < 6) {
            showAlert('La contraseña debe tener al menos 6 caracteres', 'danger');
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            showAlert('Las contraseñas no coinciden', 'danger');
            return;
        }

        if (userData.telefono.length !== 9) {
            showAlert('El teléfono debe tener 9 dígitos', 'danger');
            return;
        }

        // Mostrar loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spinner"></i> Enviando solicitud...';
        submitBtn.disabled = true;

        try {
            console.log('📤 Enviando registro a la API...');
            
            // ✅ USAR authManager PARA REGISTRO COMPLETO
            const result = await window.authManager.registerRestaurante(userData);
            
            console.log('✅ Restaurante registrado exitosamente:', result);
            
            // Mostrar modal de confirmación
            showSuccessModal(
                '✅ Restaurante Registrado',
                'Tu restaurante ha sido registrado exitosamente. Revisa tu correo de confirmación y da clic en el enlace para activar tu cuenta.',
                'auth/login.html'
            );

        } catch (error) {
            console.error('❌ Error en registro de restaurante:', error);
            showAlert(error.message || 'Error en el registro. Intenta nuevamente.', 'danger');
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    function showAlert(message, type) {
        console.log(`📢 Mostrando alerta: ${message}`);
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

    console.log('✅ agregarestaurante.js inicializado correctamente');
});