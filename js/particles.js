(function(){
  'use strict'
  const canvas = document.getElementById('bg-particles')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let width = 0, height = 0, dpr = 1
  const particles = []

  function resize(){
    dpr = Math.max(window.devicePixelRatio || 1, 1)
    width = window.innerWidth
    height = window.innerHeight
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function rand(min, max){ return Math.random() * (max - min) + min }

  function spawn(x, y, count=18){
    for (let i=0;i<count;i++){
      const angle = Math.random() * Math.PI * 2
      const speed = rand(0.6, 4)
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: rand(1, 4),
        life: rand(600, 1200),
        age: 0,
        hue: Math.floor(rand(180, 280)),
        alpha: 1
      })
    }
  }

  function spawnAmbient(){
    // small slow-moving background particles
    const x = rand(0, width)
    const y = rand(0, height)
    particles.push({
      x, y,
      vx: rand(-0.2, 0.2),
      vy: rand(-0.2, 0.2),
      size: rand(0.5, 2.5),
      life: rand(4000, 12000),
      age:0,
      hue: Math.floor(rand(200, 260)),
      alpha: 0.08
    })
  }

  let last = performance.now()
  function loop(now){
    const dt = now - last
    last = now
    ctx.clearRect(0,0,width,height)

    // occasionally spawn ambient particles
    if (Math.random() < 0.08) spawnAmbient()

    for (let i = particles.length - 1; i >= 0; i--){
      const p = particles[i]
      p.age += dt
      if (p.age >= p.life){ particles.splice(i,1); continue }
      // simple physics
      p.vy += 0.002 * dt // gravity subtle
      p.x += p.vx
      p.y += p.vy
      // fade
      const t = p.age / p.life
      const alpha = (1 - t) * (p.alpha || 1)
      const size = p.size * (1 - 0.2 * t)
      ctx.beginPath()
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${alpha})`
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    requestAnimationFrame(loop)
  }

  function init(){
    resize()
    last = performance.now()
    requestAnimationFrame(loop)

    window.addEventListener('resize', resize)

    // spawn on clicks
    document.addEventListener('click', function(e){
      const x = e.clientX
      const y = e.clientY
      spawn(x, y, 22)
    })

    // optional: small trail on mousemove
    let lastMove = 0
    document.addEventListener('mousemove', function(e){
      const now = performance.now()
      if (now - lastMove > 60){
        spawn(e.clientX, e.clientY, 1)
        lastMove = now
      }
    })
  }

  // delay init until DOM ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') init()
  else document.addEventListener('DOMContentLoaded', init)
})()
