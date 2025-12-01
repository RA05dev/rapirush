// 🎨 GESTOR GLOBAL DE NOTIFICACIONES - notificationManager.js
console.log('📢 notificationManager.js cargado');

// FUNCIÓN GLOBAL DE ALERTA - MOSTRAR EN PANTALLA FIJA
window.globalShowAlert = function(message, type = 'info', duration = 5000) {
    // Crear contenedor si no existe
    let alertContainer = document.getElementById('globalAlertContainer');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'globalAlertContainer';
        alertContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            gap: 10px;
            display: flex;
            flex-direction: column;
            pointer-events: none;
        `;
        document.body.appendChild(alertContainer);
    }

    // Crear alerta individual
    const alertEl = document.createElement('div');
    const typeClass = {
        'success': 'alert-success',
        'danger': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    }[type] || 'alert-info';

    const icon = {
        'success': '✅',
        'danger': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    }[type] || 'ℹ️';

    alertEl.className = `alert ${typeClass} alert-dismissible fade show`;
    alertEl.style.cssText = `
        pointer-events: auto;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-in-out;
    `;
    alertEl.innerHTML = `
        <div class="d-flex align-items-center">
            <span style="font-size: 1.3em; margin-right: 10px;">${icon}</span>
            <div style="flex: 1;">${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    // Agregar estilos de animación si no existen
    if (!document.getElementById('globalAlertStyles')) {
        const style = document.createElement('style');
        style.id = 'globalAlertStyles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    alertContainer.appendChild(alertEl);

    // Auto-dismiss
    if (duration > 0) {
        setTimeout(() => {
            alertEl.style.animation = 'slideOut 0.3s ease-in-out';
            setTimeout(() => alertEl.remove(), 300);
        }, duration);
    }

    return alertEl;
};
