function formatCurrency(amount) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount); }
function formatDate(dateStr) { if (!dateStr) return 'N/A'; const d = new Date(dateStr); if (isNaN(d)) return dateStr; return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
function formatDateTime(tsStr) { if (!tsStr) return 'N/A'; const d = new Date(tsStr.replace(' ', 'T').split('.')[0]); if (isNaN(d)) return tsStr; return d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
function maskCardNum(cardNum) { if (!cardNum || cardNum.length < 4) return cardNum; return '****-****-****-' + cardNum.slice(-4); }
function validateRequired(value, fieldName) { if (!value || String(value).trim() === '') return fieldName + ' is required.'; return null; }
function validateNumeric(value, fieldName) { if (isNaN(value) || value === '') return fieldName + ' must be a number.'; return null; }
function validateDate(value, fieldName) { if (!value) return fieldName + ' is required.'; if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return fieldName + ' must be in YYYY-MM-DD format.'; return null; }
function getParam(name) { return new URLSearchParams(window.location.search).get(name); }

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) { container = document.createElement('div'); container.id = 'toast-container'; container.className = 'toast-container'; document.body.appendChild(container); }
  const toast = document.createElement('div');
  toast.className = 'toast toast--' + type;
  toast.innerHTML = '<span class="toast__message">' + message + '</span><button class="toast__close" onclick="this.parentElement.remove()">×</button>';
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

function showModal(modalId) { const modal = document.getElementById(modalId); if (modal) { modal.classList.add('is-visible'); modal.setAttribute('aria-hidden', 'false'); } }
function hideModal(modalId) { const modal = document.getElementById(modalId); if (modal) { modal.classList.remove('is-visible'); modal.setAttribute('aria-hidden', 'true'); } }

function getStatusBadge(status) {
  const map = { 'Y': '<span class="badge badge--success">Active</span>', 'N': '<span class="badge badge--error">Inactive</span>', 'A': '<span class="badge badge--primary">Admin</span>', 'U': '<span class="badge badge--secondary">User</span>', 'Completed': '<span class="badge badge--success">Completed</span>', 'Running': '<span class="badge badge--warning">Running</span>', 'Failed': '<span class="badge badge--error">Failed</span>', 'Pending': '<span class="badge badge--warning">Pending</span>', 'Posted': '<span class="badge badge--success">Posted</span>', 'Active': '<span class="badge badge--success">Active</span>', 'Inactive': '<span class="badge badge--error">Inactive</span>' };
  return map[status] || '<span class="badge badge--secondary">' + status + '</span>';
}

function renderPagination(containerId, totalPages, currentPage, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container || totalPages <= 1) { if(container) container.innerHTML = ''; return; }
  let html = '<div class="pagination" role="navigation" aria-label="Pagination">';
  html += '<button class="btn btn--secondary btn--sm pagination__btn" ' + (currentPage === 1 ? 'disabled' : '') + ' onclick="' + onPageChange + '(' + (currentPage-1) + ')">← Prev</button>';
  for (let i = 1; i <= totalPages; i++) { html += '<button class="btn btn--sm pagination__btn ' + (i === currentPage ? 'is-active' : 'btn--ghost') + '" onclick="' + onPageChange + '(' + i + ')">' + i + '</button>'; }
  html += '<button class="btn btn--secondary btn--sm pagination__btn" ' + (currentPage === totalPages ? 'disabled' : '') + ' onclick="' + onPageChange + '(' + (currentPage+1) + ')">Next →</button>';
  html += '</div>';
  container.innerHTML = html;
}

function debounce(fn, delay) { let timer; return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay); }; }
function formatAmount(amount) { const n = parseFloat(amount); if (isNaN(n)) return 'N/A'; const cls = n >= 0 ? 'color:var(--color-success)' : 'color:var(--color-error)'; return '<span style="' + cls + ';font-weight:600">' + formatCurrency(n) + '</span>'; }
function escapeHtml(str) { return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function getTypeDescription(code) { var types = { '01':'Purchase','02':'Payment','03':'Credit','04':'Authorization','05':'Refund','06':'Reversal','07':'Adjustment' }; return types[code] || code; }
document.addEventListener('DOMContentLoaded', markActiveNav);

function markActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('is-active');
  });
}

document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('modal__overlay')) { const modal = e.target.closest('.modal'); if (modal) { modal.classList.remove('is-visible'); modal.setAttribute('aria-hidden','true'); } }
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { const modal = document.querySelector('.modal.is-visible'); if (modal) { modal.classList.remove('is-visible'); modal.setAttribute('aria-hidden','true'); } }
});