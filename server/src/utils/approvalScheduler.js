// server/src/utils/approvalScheduler.js
// Sistema de aprobación automática después de 3 minutos

import { supabase } from '../config/supabaseClient.js';

const APPROVAL_TIME_MS = 3 * 60 * 1000; // 3 minutos

export const autoApproveUsers = async () => {
  return;
};

// Iniciar el scheduler cuando se inicia el servidor
export const startApprovalScheduler = () => {
  // ✅ Scheduler deshabilitado - no hacer nada
  return;
};
