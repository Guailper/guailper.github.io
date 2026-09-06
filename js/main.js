(() => {
  const toggle = document.querySelector('.nav-toggle')
  const nav = document.querySelector('#site-navigation')

  if (!toggle || !nav) return

  const setOpen = open => {
    nav.classList.toggle('is-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? '关闭导航' : '打开导航')
  }

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')))

  document.addEventListener('click', event => {
    if (window.innerWidth > 700 || !nav.classList.contains('is-open')) return
    if (!nav.contains(event.target) && !toggle.contains(event.target)) setOpen(false)
  })

  window.addEventListener('resize', () => {
    if (window.innerWidth > 700) setOpen(false)
  }, { passive: true })
})()
