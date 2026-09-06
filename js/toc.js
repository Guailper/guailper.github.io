(() => {
  const card = document.querySelector('#card-toc')
  const article = document.querySelector('#article-container')
  if (!card || !article) return

  const content = card.querySelector('.toc-content')
  const percentage = card.querySelector('.toc-percentage')
  const mobileButton = document.querySelector('#mobile-toc-button')
  const links = Array.from(content.querySelectorAll('.toc-link'))
  const headings = links
    .map(link => decodeURIComponent((link.getAttribute('href') || '').replace(/^#/, '')))
    .map(id => document.getElementById(id))
    .filter(Boolean)
  let activeHeading = null
  let framePending = false

  const setMobileOpen = open => {
    card.classList.toggle('open', open)
    mobileButton?.setAttribute('aria-expanded', String(open))
    mobileButton?.setAttribute('aria-label', open ? '关闭文章目录' : '打开文章目录')
  }

  const scrollToHeading = heading => {
    const top = heading.getBoundingClientRect().top + window.scrollY - 76
    window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  links.forEach(link => {
    link.addEventListener('click', event => {
      const id = decodeURIComponent((link.getAttribute('href') || '').replace(/^#/, ''))
      const target = document.getElementById(id)
      if (!target) return
      event.preventDefault()
      history.replaceState(null, '', `#${encodeURIComponent(id)}`)
      scrollToHeading(target)
      if (window.innerWidth <= 900) setMobileOpen(false)
    })
  })

  const updateActiveBranch = heading => {
    if (heading === activeHeading) return
    activeHeading = heading
    content.querySelectorAll('.active').forEach(item => item.classList.remove('active'))
    if (!heading) return

    const link = links[headings.indexOf(heading)]
    if (!link) return
    link.classList.add('active')
    let parent = link.parentElement
    while (parent && parent !== content) {
      if (parent.classList.contains('toc-item')) parent.classList.add('active')
      parent = parent.parentElement
    }

    const targetTop = link.offsetTop - (content.clientHeight - link.offsetHeight) / 2
    content.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
  }

  const update = () => {
    const articleTop = article.getBoundingClientRect().top + window.scrollY
    const scrollableHeight = Math.max(article.offsetHeight - window.innerHeight * 0.35, 1)
    const progress = Math.max(0, Math.min(100, Math.round(((window.scrollY - articleTop + window.innerHeight * 0.35) / scrollableHeight) * 100)))
    if (percentage) percentage.textContent = `${progress}%`

    let current = null
    headings.forEach(heading => {
      if (heading.getBoundingClientRect().top <= 96) current = heading
    })
    updateActiveBranch(current)
  }

  window.addEventListener('scroll', () => {
    if (framePending) return
    framePending = true
    requestAnimationFrame(() => {
      update()
      framePending = false
    })
  }, { passive: true })

  window.addEventListener('resize', update, { passive: true })
  mobileButton?.addEventListener('click', () => setMobileOpen(!card.classList.contains('open')))
  document.addEventListener('click', event => {
    if (window.innerWidth > 900 || !card.classList.contains('open')) return
    if (!card.contains(event.target) && !mobileButton?.contains(event.target)) setMobileOpen(false)
  })
  update()
})()
