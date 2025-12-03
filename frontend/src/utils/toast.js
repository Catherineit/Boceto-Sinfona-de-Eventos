export function showToast(message, { type = 'primary', duration = 4000 } = {}) {
  // Ensure container
  let container = document.getElementById('app-toasts')
  if (!container) {
    container = document.createElement('div')
    container.id = 'app-toasts'
    container.setAttribute('aria-live', 'polite')
    container.setAttribute('aria-atomic', 'true')
    container.style.position = 'fixed'
    container.style.top = '1rem'
    container.style.right = '1rem'
    container.style.zIndex = 1080
    document.body.appendChild(container)
  }

  const toast = document.createElement('div')
  toast.className = `toast align-items-center text-bg-${type} border-0 show`
  toast.role = 'alert'
  toast.ariaLive = 'assertive'
  toast.ariaAtomic = 'true'
  toast.style.minWidth = '200px'

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${escapeHtml(message)}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button>
    </div>
  `

  container.appendChild(toast)

  const btn = toast.querySelector('.btn-close')
  const remove = () => {
    try { container.removeChild(toast) } catch(e){}
  }
  btn.addEventListener('click', remove)

  setTimeout(remove, duration)
}

function escapeHtml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
