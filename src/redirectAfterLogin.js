// src/utils/redirectAfterLogin.js
export const saveRedirectUrl = (additionalState = {}) => {
  const currentUrl = window.location.pathname + window.location.search;
  const state = {
    url: currentUrl,
    timestamp: Date.now(),
    ...additionalState
  };
  localStorage.setItem('redirectAfterLogin', JSON.stringify(state));
  return currentUrl;
};

export const getRedirectUrl = () => {
  const saved = localStorage.getItem('redirectAfterLogin');
  if (!saved) return '/coursedetails';
  
  try {
    const state = JSON.parse(saved);
    // Check if redirect is not too old (e.g., within 10 minutes)
    if (Date.now() - state.timestamp > 10 * 60 * 1000) {
      localStorage.removeItem('redirectAfterLogin');
      return '/coursedetails';
    }
    return state.url;
  } catch {
    // Fallback for old string format
    return saved;
  }
};

export const clearRedirectUrl = () => {
  localStorage.removeItem('redirectAfterLogin');
};