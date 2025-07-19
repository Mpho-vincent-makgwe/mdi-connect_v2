// lib/utils.js
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}