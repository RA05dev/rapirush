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
            telefono: document.getElementById('telefono').value.trim(),
            vehiculo: document.getElementById('vehiculo').value
        };

        // Validaciones básicas
        if (!userData.nombre || !userData.email || !userData.telefono || !userData.vehiculo) {
            showAlert('Por favor completa todos los campos obligatorios', 'danger');
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
            
            showAlert('¡Solicitud enviada exitosamente! Te contactaremos pronto para activar tu cuenta de repartidor.', 'success');
            
            // Guardar datos en sessionStorage
            sessionStorage.setItem('user_role', 'repartidor');
            sessionStorage.setItem('user_id', result.user.id);
            sessionStorage.setItem('user_name', result.user.nombre);
            sessionStorage.setItem('user_email', result.user.email);
            
            // Redirigir después de 3 segundos
            setTimeout(() => {
                window.location.href = '../dashboard/repartidor.html';
            }, 3000);

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
});