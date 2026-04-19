/* ============================================================
   MOHIT ALBUM — script.js
   All dynamic logic: albums, WhatsApp, Admin, UI helpers
   ============================================================ */

/* ---------- CONFIG ---------- */
const CONFIG = {
  businessName : 'Mohit Album',
  phone        : '+9191362 51041',    // ← Change to real number
  email        : 'mohitalbum@gmail.com',
  whatsappNum  : '9191362 51041',     // ← Without + sign
};

/* ============================================================
   ALBUM DATA STORE
   Saved in localStorage so it persists across pages.
   Structure is Firebase-ready (array of objects).
   ============================================================ */

const DEFAULT_ALBUMS = [
  {
    id       : 'a1',
    title    : 'Royal Wedding Collection',
    category : 'Wedding',
    imageUrl : 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
    description : 'Premium leatherette cover,40 pages,HD Fujifilm print,UV lamination,Waterproof pages,Scratch-resistant coating,Free name embossing,1 year warranty',
  },
  {
    id       : 'a2',
    title    : 'Pre-Wedding Story',
    category : 'Pre-Wedding',
    imageUrl : 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
    description : 'Matte art paper,30 pages,Cinematic colour grade,Custom layout design,Velvet gift box,Same-day delivery available',
  },
  {
    id       : 'a3',
    title    : 'Birthday Memories',
    category : 'Birthday',
    imageUrl : 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
    description : '24 pages,Glossy finish,Vibrant colour print,Spiral bound,Personalized cover text,Express 24-hour delivery',
  },
  {
    id       : 'a4',
    title    : 'Baby Milestones Album',
    category : 'Baby',
    imageUrl : 'https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=800&q=80',
    description : 'Soft-touch cover,36 pages,Acid-free paper,Safe non-toxic ink,Scrapbook design,Milestone stickers included',
  },
  {
    id       : 'a5',
    title    : 'Corporate Events Portfolio',
    category : 'Corporate',
    imageUrl : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    description : 'Hard cover,50 pages,Professional layout,Branding integration,Bulk order discount,Nationwide courier',
  },
  {
    id       : 'a6',
    title    : 'Traditional Shaadi Album',
    category : 'Wedding',
    imageUrl : 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80',
    description : 'Pure silk cover,60 pages,Real gold foil title,Handmade paper pages,Heirloom quality,Lifetime guarantee',
  },
];

/* ---------- Storage helpers ---------- */
function getAlbums() {
  try {
    const raw = localStorage.getItem('mohit_albums');
    return raw ? JSON.parse(raw) : DEFAULT_ALBUMS;
  } catch { return DEFAULT_ALBUMS; }
}

function saveAlbums(albums) {
  localStorage.setItem('mohit_albums', JSON.stringify(albums));
}

/* If first visit, seed localStorage */
if (!localStorage.getItem('mohit_albums')) {
  saveAlbums(DEFAULT_ALBUMS);
}

/* ============================================================
   UTILITY: Convert comma-separated text → HTML list items
   ============================================================ */
function descToFeatures(desc) {
  if (!desc) return [];
  return desc.split(',').map(s => s.trim()).filter(Boolean);
}

function featuresToHtml(desc) {
  const items = descToFeatures(desc);
  if (!items.length) return '';
  return `<ul class="album-features">${items.map(f => `<li>${f}</li>`).join('')}</ul>`;
}

/* ============================================================
   UTILITY: Build WhatsApp message URL
   ============================================================ */
function buildWhatsAppUrl(album) {
  const features = descToFeatures(album.description);
  let msg = `Hello ${CONFIG.businessName}, I am interested in *${album.title}*:\n\n`;
  features.forEach(f => { msg += `• ${f}\n`; });
  msg += `\nPlease share more details and pricing. Thank you!`;
  return `https://wa.me/${CONFIG.whatsappNum}?text=${encodeURIComponent(msg)}`;
}

/* ============================================================
   UTILITY: Build album card HTML
   ============================================================ */
function buildAlbumCard(album) {
  const wa  = buildWhatsAppUrl(album);
  const tel = `tel:${CONFIG.phone}`;
  const featsHtml = featuresToHtml(album.description);

  return `
    <div class="album-card fade-up" data-id="${album.id}">
      <div class="album-img-wrap" onclick="openLightbox('${album.imageUrl.replace(/'/g,"\\'")}')">
        <img src="${album.imageUrl}" alt="${album.title}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/800x600/1c1c1c/c9a84c?text=No+Image'">
        <div class="album-img-overlay">
          <div class="zoom-icon">🔍</div>
        </div>
      </div>
      <div class="album-body">
        <p class="album-category">${album.category || 'Album'}</p>
        <h3 class="album-title">${album.title}</h3>
        ${featsHtml}
        <div class="album-actions">
          <a href="${wa}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm">
            💬 WhatsApp
          </a>
          <a href="${tel}" class="btn btn-phone btn-sm">
            📞 Call Now
          </a>
        </div>
      </div>
    </div>`;
}

/* ============================================================
   RENDER ALBUMS — gallery.html / index.html (featured)
   ============================================================ */
function renderAlbums(containerId, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const albums = getAlbums();
  const list   = limit ? albums.slice(0, limit) : albums;

  if (!list.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">📷</div>
        <h3>No Albums Yet</h3>
        <p>Albums added via the Admin panel will appear here.</p>
      </div>`;
    return;
  }

  container.innerHTML = list.map(buildAlbumCard).join('');
  initScrollObserver();
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function openLightbox(src) {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (!lb || !img) return;
  img.src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

/* ============================================================
   NAVBAR — scroll + mobile toggle + active link
   ============================================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });
  }

  /* Active link */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ============================================================
   SCROLL OBSERVER — fade-up animation
   ============================================================ */
function initScrollObserver() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

/* ============================================================
   HERO PARTICLES
   ============================================================ */
function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  const count = 24;
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.style.cssText = `
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      animation-delay:${Math.random()*8}s;
      animation-duration:${6 + Math.random()*6}s;
    `;
    container.appendChild(span);
  }
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
function showToast(msg, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '✅'}</span> ${msg}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ============================================================
   ADMIN PANEL
   ============================================================ */
function initAdmin() {
  const form           = document.getElementById('admin-form');
  const imgUrlInput    = document.getElementById('img-url');
  const previewBox     = document.getElementById('img-preview');
  const featPreview    = document.getElementById('feat-preview');
  const descInput      = document.getElementById('album-desc');
  const editIdInput    = document.getElementById('edit-id');

  if (!form) return;

  /* Live image preview */
  if (imgUrlInput && previewBox) {
    imgUrlInput.addEventListener('input', () => {
      const url = imgUrlInput.value.trim();
      if (url) {
        previewBox.innerHTML = `<img src="${url}" alt="preview"
          onerror="this.parentElement.innerHTML='<span>Invalid URL or image failed to load</span>'">`;
      } else {
        previewBox.innerHTML = '<span>Image preview will appear here</span>';
      }
    });
  }

  /* Live features preview */
  if (descInput && featPreview) {
    descInput.addEventListener('input', () => {
      const items = descToFeatures(descInput.value);
      if (items.length) {
        featPreview.innerHTML = `<ul class="album-features">${items.map(f => `<li>${f}</li>`).join('')}</ul>`;
        featPreview.style.display = 'block';
      } else {
        featPreview.style.display = 'none';
      }
    });
  }

  /* Form submit */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title    = document.getElementById('album-title').value.trim();
    const category = document.getElementById('album-category').value.trim();
    const imageUrl = document.getElementById('img-url').value.trim();
    const desc     = document.getElementById('album-desc').value.trim();
    const editId   = editIdInput ? editIdInput.value : '';

    if (!title || !imageUrl || !desc) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const albums = getAlbums();

    if (editId) {
      /* Update existing */
      const idx = albums.findIndex(a => a.id === editId);
      if (idx !== -1) {
        albums[idx] = { ...albums[idx], title, category, imageUrl, description: desc };
      }
      editIdInput.value = '';
      showToast('Album updated successfully!');
    } else {
      /* Add new */
      const newAlbum = {
        id         : 'a' + Date.now(),
        title,
        category,
        imageUrl,
        description: desc,
      };
      albums.push(newAlbum);
      showToast('Album added successfully! 🎉');
    }

    saveAlbums(albums);
    form.reset();
    if (previewBox) previewBox.innerHTML = '<span>Image preview will appear here</span>';
    if (featPreview) { featPreview.innerHTML = ''; featPreview.style.display = 'none'; }
    renderAdminGrid();
  });

  renderAdminGrid();
}

function renderAdminGrid() {
  const grid = document.getElementById('admin-grid');
  const countEl = document.getElementById('album-count');
  if (!grid) return;

  const albums = getAlbums();
  if (countEl) countEl.textContent = `(${albums.length})`;

  if (!albums.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="icon">📁</div>
        <h3>No Albums Added</h3>
        <p>Use the form on the left to add your first album.</p>
      </div>`;
    return;
  }

  grid.innerHTML = albums.map(album => `
    <div class="admin-card" id="card-${album.id}">
      <img src="${album.imageUrl}" alt="${album.title}"
           onerror="this.src='https://via.placeholder.com/400x225/1c1c1c/c9a84c?text=No+Image'">
      <div class="admin-card-body">
        <p class="album-category">${album.category || 'Uncategorized'}</p>
        <p class="admin-card-title">${album.title}</p>
        <div class="admin-card-actions">
          <button class="btn-edit-admin" onclick="editAlbum('${album.id}')">✏️ Edit</button>
          <button class="btn-delete" onclick="deleteAlbum('${album.id}')">🗑️ Delete</button>
        </div>
      </div>
    </div>`).join('');
}

function editAlbum(id) {
  const albums = getAlbums();
  const album  = albums.find(a => a.id === id);
  if (!album) return;

  document.getElementById('album-title').value    = album.title;
  document.getElementById('album-category').value = album.category || '';
  document.getElementById('img-url').value        = album.imageUrl;
  document.getElementById('album-desc').value     = album.description;
  document.getElementById('edit-id').value        = album.id;

  /* Trigger previews */
  document.getElementById('img-url').dispatchEvent(new Event('input'));
  document.getElementById('album-desc').dispatchEvent(new Event('input'));

  const submitBtn = document.querySelector('#admin-form button[type="submit"]');
  if (submitBtn) submitBtn.textContent = '💾 Update Album';

  document.getElementById('admin-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteAlbum(id) {
  if (!confirm('Are you sure you want to delete this album?')) return;
  const albums = getAlbums().filter(a => a.id !== id);
  saveAlbums(albums);
  renderAdminGrid();
  showToast('Album deleted.', 'info');
}

/* ============================================================
   CONTACT FORM — WhatsApp redirect
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('c-name').value.trim();
    const service = document.getElementById('c-service').value;
    const message = document.getElementById('c-message').value.trim();

    const text = `Hello ${CONFIG.businessName},\n\nMy name is *${name}*.\nService interested in: *${service}*\n\n${message}\n\nPlease get back to me. Thank you!`;
    window.open(`https://wa.me/${CONFIG.whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  });
}

/* ============================================================
   FILTER ALBUMS (gallery page)
   ============================================================ */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-gold'));
      filterBtns.forEach(b => b.classList.add('btn-outline'));
      btn.classList.add('active', 'btn-gold');
      btn.classList.remove('btn-outline');

      const cat = btn.dataset.filter;
      const albums = getAlbums();
      const filtered = cat === 'all' ? albums : albums.filter(a =>
        a.category.toLowerCase() === cat.toLowerCase()
      );

      const grid = document.getElementById('gallery-grid');
      if (!grid) return;

      if (!filtered.length) {
        grid.innerHTML = `
          <div class="empty-state">
            <div class="icon">📂</div>
            <h3>No Albums in this Category</h3>
            <p>Try selecting a different filter.</p>
          </div>`;
        return;
      }

      grid.innerHTML = filtered.map(buildAlbumCard).join('');
      initScrollObserver();
    });
  });
}

/* ============================================================
   INIT ON PAGE LOAD
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initScrollObserver();
  initAdmin();
  initContactForm();
  initGalleryFilter();

  /* Render albums on appropriate page */
  renderAlbums('gallery-grid');
  renderAlbums('featured-albums', 3);

  /* Lightbox close */
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* Update global contact links */
  document.querySelectorAll('[data-wa-general]').forEach(el => {
    el.href = `https://wa.me/${CONFIG.whatsappNum}?text=${encodeURIComponent('Hello ' + CONFIG.businessName + ', I would like to enquire about your services.')}`;
  });

  document.querySelectorAll('[data-phone]').forEach(el => {
    el.href = `tel:${CONFIG.phone}`;
    if (!el.textContent.trim()) el.textContent = CONFIG.phone;
  });

  document.querySelectorAll('[data-email]').forEach(el => {
    el.href = `mailto:${CONFIG.email}`;
    if (!el.textContent.trim()) el.textContent = CONFIG.email;
  });
});  const featsHtml = featuresToHtml(album.description);

  return `
    <div class="album-card fade-up" data-id="${album.id}">
      <div class="album-img-wrap" onclick="openLightbox('${album.imageUrl.replace(/'/g,"\\'")}')">
        <img src="${album.imageUrl}" alt="${album.title}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/800x600/1c1c1c/c9a84c?text=No+Image'">
        <div class="album-img-overlay">
          <div class="zoom-icon">🔍</div>
        </div>
      </div>
      <div class="album-body">
        <p class="album-category">${album.category || 'Album'}</p>
        <h3 class="album-title">${album.title}</h3>
        ${featsHtml}
        <div class="album-actions">
          <a href="${wa}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm">
            💬 WhatsApp
          </a>
          <a href="${tel}" class="btn btn-phone btn-sm">
            📞 Call Now
          </a>
        </div>
      </div>
    </div>`;
}

/* ============================================================
   RENDER ALBUMS — gallery.html / index.html (featured)
   ============================================================ */
function renderAlbums(containerId, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const albums = getAlbums();
  const list   = limit ? albums.slice(0, limit) : albums;

  if (!list.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">📷</div>
        <h3>No Albums Yet</h3>
        <p>Albums added via the Admin panel will appear here.</p>
      </div>`;
    return;
  }

  container.innerHTML = list.map(buildAlbumCard).join('');
  initScrollObserver();
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function openLightbox(src) {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (!lb || !img) return;
  img.src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

/* ============================================================
   NAVBAR — scroll + mobile toggle + active link
   ============================================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });
  }

  /* Active link */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ============================================================
   SCROLL OBSERVER — fade-up animation
   ============================================================ */
function initScrollObserver() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

/* ============================================================
   HERO PARTICLES
   ============================================================ */
function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  const count = 24;
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.style.cssText = `
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      animation-delay:${Math.random()*8}s;
      animation-duration:${6 + Math.random()*6}s;
    `;
    container.appendChild(span);
  }
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
function showToast(msg, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '✅'}</span> ${msg}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ============================================================
   ADMIN PANEL
   ============================================================ */
function initAdmin() {
  const form           = document.getElementById('admin-form');
  const imgUrlInput    = document.getElementById('img-url');
  const previewBox     = document.getElementById('img-preview');
  const featPreview    = document.getElementById('feat-preview');
  const descInput      = document.getElementById('album-desc');
  const editIdInput    = document.getElementById('edit-id');

  if (!form) return;

  /* Live image preview */
  if (imgUrlInput && previewBox) {
    imgUrlInput.addEventListener('input', () => {
      const url = imgUrlInput.value.trim();
      if (url) {
        previewBox.innerHTML = `<img src="${url}" alt="preview"
          onerror="this.parentElement.innerHTML='<span>Invalid URL or image failed to load</span>'">`;
      } else {
        previewBox.innerHTML = '<span>Image preview will appear here</span>';
      }
    });
  }

  /* Live features preview */
  if (descInput && featPreview) {
    descInput.addEventListener('input', () => {
      const items = descToFeatures(descInput.value);
      if (items.length) {
        featPreview.innerHTML = `<ul class="album-features">${items.map(f => `<li>${f}</li>`).join('')}</ul>`;
        featPreview.style.display = 'block';
      } else {
        featPreview.style.display = 'none';
      }
    });
  }

  /* Form submit */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title    = document.getElementById('album-title').value.trim();
    const category = document.getElementById('album-category').value.trim();
    const imageUrl = document.getElementById('img-url').value.trim();
    const desc     = document.getElementById('album-desc').value.trim();
    const editId   = editIdInput ? editIdInput.value : '';

    if (!title || !imageUrl || !desc) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const albums = getAlbums();

    if (editId) {
      /* Update existing */
      const idx = albums.findIndex(a => a.id === editId);
      if (idx !== -1) {
        albums[idx] = { ...albums[idx], title, category, imageUrl, description: desc };
      }
      editIdInput.value = '';
      showToast('Album updated successfully!');
    } else {
      /* Add new */
      const newAlbum = {
        id         : 'a' + Date.now(),
        title,
        category,
        imageUrl,
        description: desc,
      };
      albums.push(newAlbum);
      showToast('Album added successfully! 🎉');
    }

    saveAlbums(albums);
    form.reset();
    if (previewBox) previewBox.innerHTML = '<span>Image preview will appear here</span>';
    if (featPreview) { featPreview.innerHTML = ''; featPreview.style.display = 'none'; }
    renderAdminGrid();
  });

  renderAdminGrid();
}

function renderAdminGrid() {
  const grid = document.getElementById('admin-grid');
  const countEl = document.getElementById('album-count');
  if (!grid) return;

  const albums = getAlbums();
  if (countEl) countEl.textContent = `(${albums.length})`;

  if (!albums.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="icon">📁</div>
        <h3>No Albums Added</h3>
        <p>Use the form on the left to add your first album.</p>
      </div>`;
    return;
  }

  grid.innerHTML = albums.map(album => `
    <div class="admin-card" id="card-${album.id}">
      <img src="${album.imageUrl}" alt="${album.title}"
           onerror="this.src='https://via.placeholder.com/400x225/1c1c1c/c9a84c?text=No+Image'">
      <div class="admin-card-body">
        <p class="album-category">${album.category || 'Uncategorized'}</p>
        <p class="admin-card-title">${album.title}</p>
        <div class="admin-card-actions">
          <button class="btn-edit-admin" onclick="editAlbum('${album.id}')">✏️ Edit</button>
          <button class="btn-delete" onclick="deleteAlbum('${album.id}')">🗑️ Delete</button>
        </div>
      </div>
    </div>`).join('');
}

function editAlbum(id) {
  const albums = getAlbums();
  const album  = albums.find(a => a.id === id);
  if (!album) return;

  document.getElementById('album-title').value    = album.title;
  document.getElementById('album-category').value = album.category || '';
  document.getElementById('img-url').value        = album.imageUrl;
  document.getElementById('album-desc').value     = album.description;
  document.getElementById('edit-id').value        = album.id;

  /* Trigger previews */
  document.getElementById('img-url').dispatchEvent(new Event('input'));
  document.getElementById('album-desc').dispatchEvent(new Event('input'));

  const submitBtn = document.querySelector('#admin-form button[type="submit"]');
  if (submitBtn) submitBtn.textContent = '💾 Update Album';

  document.getElementById('admin-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteAlbum(id) {
  if (!confirm('Are you sure you want to delete this album?')) return;
  const albums = getAlbums().filter(a => a.id !== id);
  saveAlbums(albums);
  renderAdminGrid();
  showToast('Album deleted.', 'info');
}

/* ============================================================
   CONTACT FORM — WhatsApp redirect
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('c-name').value.trim();
    const service = document.getElementById('c-service').value;
    const message = document.getElementById('c-message').value.trim();

    const text = `Hello ${CONFIG.businessName},\n\nMy name is *${name}*.\nService interested in: *${service}*\n\n${message}\n\nPlease get back to me. Thank you!`;
    window.open(`https://wa.me/${CONFIG.whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  });
}

/* ============================================================
   FILTER ALBUMS (gallery page)
   ============================================================ */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-gold'));
      filterBtns.forEach(b => b.classList.add('btn-outline'));
      btn.classList.add('active', 'btn-gold');
      btn.classList.remove('btn-outline');

      const cat = btn.dataset.filter;
      const albums = getAlbums();
      const filtered = cat === 'all' ? albums : albums.filter(a =>
        a.category.toLowerCase() === cat.toLowerCase()
      );

      const grid = document.getElementById('gallery-grid');
      if (!grid) return;

      if (!filtered.length) {
        grid.innerHTML = `
          <div class="empty-state">
            <div class="icon">📂</div>
            <h3>No Albums in this Category</h3>
            <p>Try selecting a different filter.</p>
          </div>`;
        return;
      }

      grid.innerHTML = filtered.map(buildAlbumCard).join('');
      initScrollObserver();
    });
  });
}

/* ============================================================
   INIT ON PAGE LOAD
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initScrollObserver();
  initAdmin();
  initContactForm();
  initGalleryFilter();

  /* Render albums on appropriate page */
  renderAlbums('gallery-grid');
  renderAlbums('featured-albums', 3);

  /* Lightbox close */
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* Update global contact links */
  document.querySelectorAll('[data-wa-general]').forEach(el => {
    el.href = `https://wa.me/${CONFIG.whatsappNum}?text=${encodeURIComponent('Hello ' + CONFIG.businessName + ', I would like to enquire about your services.')}`;
  });

  document.querySelectorAll('[data-phone]').forEach(el => {
    el.href = `tel:${CONFIG.phone}`;
    if (!el.textContent.trim()) el.textContent = CONFIG.phone;
  });

  document.querySelectorAll('[data-email]').forEach(el => {
    el.href = `mailto:${CONFIG.email}`;
    if (!el.textContent.trim()) el.textContent = CONFIG.email;
  });
});
