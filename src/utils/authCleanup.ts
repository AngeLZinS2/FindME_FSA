
export const cleanupAuthState = () => {
  console.log('🧹 [AuthCleanup] Limpando estado de autenticação...');
  
  // Remove tokens padrão do Supabase
  localStorage.removeItem('supabase.auth.token');
  
  // Remove todas as chaves relacionadas ao Supabase auth
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
      console.log('🗑️ [AuthCleanup] Removido:', key);
    }
  });
  
  // Remove do sessionStorage se estiver em uso
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
      console.log('🗑️ [AuthCleanup] Removido do sessionStorage:', key);
    }
  });
  
  console.log('✅ [AuthCleanup] Limpeza concluída');
};
