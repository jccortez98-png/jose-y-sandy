/**
 * Wedding Invitation Data Manager (Admin Panel)
 * Manages full configuration, texts, URLs, images, bank accounts, and itinerary.
 */

const STORAGE_KEY = 'wedding_invitation_data';

// Default Template Configuration
const DEFAULT_DATA = {
  wedding: {
    couple: {
      groom: {
        firstName: "José",
        fullName: "José Alberto Herrera",
        phone: "+50255551234",
        phoneDisplay: "+502 5555 1234"
      },
      bride: {
        firstName: "Sandy",
        fullName: "Sandy Peláez",
        phone: "+50255555678",
        phoneDisplay: "+502 5555 5678"
      },
      monogram: "J | S",
      initialsGroom: "J",
      initialsBride: "S"
    },
    date: {
      day: "28",
      month: "Noviembre",
      monthNumber: "11",
      year: "2026",
      dayOfWeek: "Sábado",
      timeCeremony: "15:30",
      timeReception: "20:00",
      isoDateTime: "2026-11-28T15:30:00-06:00",
      rsvpDeadline: "10 de octubre de 2026"
    },
    texts: {
      coverSubtitle: "EL COMIENZO DE NUESTRO PARA SIEMPRE",
      weAreGettingMarried: "NOS CASAMOS",
      openingQuote: "Porque juntos descubrimos que el amor hace la vida más hermosa, hemos decidido caminar de la mano para siempre.",
      blessingIntro: "CON LA BENDICIÓN DE DIOS Y EL AMOR INCONDICIONAL DE NUESTRAS MADRES",
      mothers: "Silvia Matias & Maria Eugenia López",
      invitationCallout: "Tenemos el honor de invitarte a acompañarnos en el día más importante de nuestras vidas y ser parte del inicio de esta nueva historia que, con ilusión y esperanza, comenzaremos a escribir para siempre.",
      closingThanks: "GRACIAS POR SER PARTE DE ESTE DÍA TAN ESPECIAL PARA NOSOTROS.",
      seeYouThere: "¡Nos vemos allí!",
      rsvpTitle: "CONFIRMAR ASISTENCIA",
      rsvpSubtitle: "Tu respuesta es importante para nosotros. Cada detalle ha sido preparado con mucho amor. Te agradeceremos confirmar tu asistencia antes del 10 de octubre de 2026.",
      rsvpWebhookUrl: "https://script.google.com/macros/s/AKfycbxfhtc4xysHdsvCyXQNOV9-BfPxo2U4Kn1HrkoILWHIn_c1Q3K5uvyMyuNgHaDORAsH/exec"
    },
    locations: {
      ceremony: {
        title: "CEREMONIA",
        time: "15:30 HRS.",
        venue: "Iglesia San Juan Bautista",
        city: "Antigua Guatemala",
        wazeUrl: "https://waze.com/ul?q=Iglesia+San+Juan+Bautista+Antigua+Guatemala&navigate=yes",
        googleMapsUrl: "https://maps.google.com/?q=Iglesia+San+Juan+Bautista+Antigua+Guatemala",
        appleMapsUrl: "https://maps.apple.com/?q=Iglesia+San+Juan+Bautista+Antigua+Guatemala"
      },
      reception: {
        title: "RECEPCIÓN",
        time: "20:00 HRS.",
        venue: "Hacienda Santo Tomás",
        address: "Santo Tomás, Milpas Altas, Sacatepéquez",
        city: "Antigua Guatemala",
        wazeUrl: "https://waze.com/ul?q=Hacienda+Santo+Tomas+Milpas+Altas+Sacatepequez&navigate=yes",
        googleMapsUrl: "https://maps.google.com/?q=Hacienda+Santo+Tomas+Milpas+Altas",
        appleMapsUrl: "https://maps.apple.com/?q=Hacienda+Santo+Tomas+Milpas+Altas"
      }
    },
    itinerary: [
      { time: "15:30", title: "CEREMONIA", icon: "rings", description: "Unión religiosa" },
      { time: "17:00", title: "CÓCTEL DE BIENVENIDA", icon: "cocktail", description: "Bebidas y música en vivo" },
      { time: "20:00", title: "CENA", icon: "dinner", description: "Banquete y brindis con los novios" },
      { time: "23:00", title: "CELEBRACIÓN", icon: "celebration", description: "Fiesta y baile hasta el amanecer" }
    ],
    details: {
      dressCode: {
        title: "CÓDIGO DE VESTIMENTA",
        type: "FORMAL",
        subtitle: "Traje formal",
        note: "Dejemos los tonos blancos y sus derivados exclusivos para la novia.",
        icon: "bowtie"
      },
      children: {
        title: "ADULTOS SOLAMENTE",
        subtitle: "Agradecemos su comprensión.",
        note: "Un evento para adultos está en camino. ¡Así que prepárense para una noche llena de diversión! Dejemos a los niños en casa esta vez.",
        icon: "adults"
      },
      gifts: {
        title: "MESA DE REGALOS",
        description: "Su presencia es el mejor regalo, pero si desean tener un detalle con nosotros, agradeceremos su contribución a nuestra mesa de regalos o transferencia bancaria:",
        icon: "gift"
      },
      bankAccounts: [
        {
          bank: "Banrural",
          accountHolder: "Sandy Peláez",
          accountType: "Cuenta de Ahorro",
          accountNumber: "4404152723"
        },
        {
          bank: "Banco Industrial",
          accountHolder: "José Alberto Herrera",
          accountType: "Cuenta Monetaria",
          accountNumber: "123-456789-0"
        }
      ],
      envelopeWishes: {
        title: "SOBRE DE DESEOS",
        description: "Habrá un sobre en recepción para sus bendiciones y deseos.",
        icon: "envelope"
      }
    },
    photos: {
      hero: "assets/images/couple-hero.jpg",
      closing: "assets/images/couple-closing.jpg"
    },
    gallery: [
      {
        url: "assets/images/gallery-1.jpg",
        alt: "Anillos de boda",
        caption: "Nuestra promesa de amor"
      },
      {
        url: "assets/images/gallery-2.jpg",
        alt: "Momentos felices",
        caption: "Caminando juntos siempre"
      }
    ],
    music: {
      enabled: true,
      autoplayAfterEnvelope: true,
      title: "Canción de Boda",
      src: "assets/audio/track.mp3"
    }
  }
};

class WeddingAdminManager {
  constructor() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadData();
    this.populateForm();
    this.renderItineraryList();
    this.renderBankAccountsList();
    this.renderGalleryList();
    this.setupTabNavigation();
  }

  async loadData() {
    // Check localStorage first
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.wedding) {
          this.data = parsed;
          this.showToast('ℹ️ Datos cargados desde el almacenamiento local.');
          return;
        }
      } catch (e) {
        console.warn('Error reading localStorage', e);
      }
    }

    // Fallback to fetching invitation-data.json
    try {
      const response = await fetch('data/invitation-data.json');
      if (response.ok) {
        const json = await response.json();
        if (json && json.wedding) {
          this.data = json;
        }
      }
    } catch (e) {
      console.log('Using default wedding configuration');
    }
  }

  setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePanel = document.getElementById(`tab-${targetTab}`);
        if (activePanel) activePanel.classList.add('active');
      });
    });
  }

  populateForm() {
    const w = this.data.wedding;

    // Novios & Contactos
    this.setVal('groomFirstName', w.couple.groom.firstName);
    this.setVal('groomFullName', w.couple.groom.fullName);
    this.setVal('groomPhone', w.couple.groom.phone);
    this.setVal('groomPhoneDisplay', w.couple.groom.phoneDisplay);

    this.setVal('brideFirstName', w.couple.bride.firstName);
    this.setVal('brideFullName', w.couple.bride.fullName);
    this.setVal('bridePhone', w.couple.bride.phone);
    this.setVal('bridePhoneDisplay', w.couple.bride.phoneDisplay);

    this.setVal('monogram', w.couple.monogram);

    // Fecha & Horarios
    this.setVal('dateDay', w.date.day);
    this.setVal('dateMonth', w.date.month);
    this.setVal('dateYear', w.date.year);
    this.setVal('dateIso', w.date.isoDateTime);
    this.setVal('timeCeremony', w.date.timeCeremony);
    this.setVal('timeReception', w.date.timeReception);
    this.setVal('rsvpDeadline', w.date.rsvpDeadline);

    // Textos & Frases
    this.setVal('coverSubtitle', w.texts.coverSubtitle);
    this.setVal('weAreGettingMarried', w.texts.weAreGettingMarried);
    this.setVal('openingQuote', w.texts.openingQuote);
    this.setVal('blessingIntro', w.texts.blessingIntro);
    this.setVal('mothers', w.texts.mothers);
    this.setVal('invitationCallout', w.texts.invitationCallout);
    this.setVal('closingThanks', w.texts.closingThanks);
    this.setVal('seeYouThere', w.texts.seeYouThere);
    this.setVal('rsvpSubtitle', w.texts.rsvpSubtitle);
    this.setVal('rsvpWebhookUrl', w.texts.rsvpWebhookUrl || '');

    // Ubicaciones
    this.setVal('ceremonyTime', w.locations.ceremony.time);
    this.setVal('ceremonyVenue', w.locations.ceremony.venue);
    this.setVal('ceremonyCity', w.locations.ceremony.city);
    this.setVal('ceremonyWaze', w.locations.ceremony.wazeUrl);
    this.setVal('ceremonyGoogle', w.locations.ceremony.googleMapsUrl);
    this.setVal('ceremonyApple', w.locations.ceremony.appleMapsUrl);

    this.setVal('receptionTime', w.locations.reception.time);
    this.setVal('receptionVenue', w.locations.reception.venue);
    this.setVal('receptionAddress', w.locations.reception.address);
    this.setVal('receptionCity', w.locations.reception.city);
    this.setVal('receptionWaze', w.locations.reception.wazeUrl);
    this.setVal('receptionGoogle', w.locations.reception.googleMapsUrl);
    this.setVal('receptionApple', w.locations.reception.appleMapsUrl);

    // Detalles
    this.setVal('dressCodeType', w.details.dressCode.type);
    this.setVal('dressCodeSubtitle', w.details.dressCode.subtitle);
    this.setVal('dressCodeNote', w.details.dressCode.note);

    this.setVal('childrenTitle', w.details.children.title);
    this.setVal('childrenSubtitle', w.details.children.subtitle);
    this.setVal('childrenNote', w.details.children.note);

    this.setVal('giftsTitle', w.details.gifts.title);
    this.setVal('giftsDesc', w.details.gifts.description);

    this.setVal('wishesTitle', w.details.envelopeWishes?.title || '');
    this.setVal('wishesDesc', w.details.envelopeWishes?.description || '');

    // Fotos principales
    const heroImgUrl = w.photos?.hero || w.heroPhoto || (w.gallery && w.gallery[0]?.url && w.gallery[0].url.includes('couple-hero') ? w.gallery[0].url : 'assets/images/couple-hero.jpg');
    const closingImgUrl = w.photos?.closing || w.closingPhoto || (w.gallery && w.gallery[3]?.url && w.gallery[3].url.includes('couple-closing') ? w.gallery[3].url : 'assets/images/couple-closing.jpg');

    this.setVal('heroPhotoUrl', heroImgUrl);
    this.setVal('closingPhotoUrl', closingImgUrl);
    this.updateImagePreview('heroPhotoPreview', heroImgUrl);
    this.updateImagePreview('closingPhotoPreview', closingImgUrl);
  }

  collectFormData() {
    const w = this.data.wedding;

    // Novios
    w.couple.groom.firstName = this.getVal('groomFirstName');
    w.couple.groom.fullName = this.getVal('groomFullName');
    w.couple.groom.phone = this.getVal('groomPhone');
    w.couple.groom.phoneDisplay = this.getVal('groomPhoneDisplay');

    w.couple.bride.firstName = this.getVal('brideFirstName');
    w.couple.bride.fullName = this.getVal('brideFullName');
    w.couple.bride.phone = this.getVal('bridePhone');
    w.couple.bride.phoneDisplay = this.getVal('bridePhoneDisplay');

    w.couple.monogram = this.getVal('monogram');

    // Fecha
    w.date.day = this.getVal('dateDay');
    w.date.month = this.getVal('dateMonth');
    w.date.year = this.getVal('dateYear');
    w.date.isoDateTime = this.getVal('dateIso');
    w.date.timeCeremony = this.getVal('timeCeremony');
    w.date.timeReception = this.getVal('timeReception');
    w.date.rsvpDeadline = this.getVal('rsvpDeadline');

    // Textos
    w.texts.coverSubtitle = this.getVal('coverSubtitle');
    w.texts.weAreGettingMarried = this.getVal('weAreGettingMarried');
    w.texts.openingQuote = this.getVal('openingQuote');
    w.texts.blessingIntro = this.getVal('blessingIntro');
    w.texts.mothers = this.getVal('mothers');
    w.texts.invitationCallout = this.getVal('invitationCallout');
    w.texts.closingThanks = this.getVal('closingThanks');
    w.texts.seeYouThere = this.getVal('seeYouThere');
    w.texts.rsvpSubtitle = this.getVal('rsvpSubtitle');
    w.texts.rsvpWebhookUrl = this.getVal('rsvpWebhookUrl');

    // Ubicaciones
    w.locations.ceremony.time = this.getVal('ceremonyTime');
    w.locations.ceremony.venue = this.getVal('ceremonyVenue');
    w.locations.ceremony.city = this.getVal('ceremonyCity');
    w.locations.ceremony.wazeUrl = this.getVal('ceremonyWaze');
    w.locations.ceremony.googleMapsUrl = this.getVal('ceremonyGoogle');
    w.locations.ceremony.appleMapsUrl = this.getVal('ceremonyApple');

    w.locations.reception.time = this.getVal('receptionTime');
    w.locations.reception.venue = this.getVal('receptionVenue');
    w.locations.reception.address = this.getVal('receptionAddress');
    w.locations.reception.city = this.getVal('receptionCity');
    w.locations.reception.wazeUrl = this.getVal('receptionWaze');
    w.locations.reception.googleMapsUrl = this.getVal('receptionGoogle');
    w.locations.reception.appleMapsUrl = this.getVal('receptionApple');

    // Detalles
    w.details.dressCode.type = this.getVal('dressCodeType');
    w.details.dressCode.subtitle = this.getVal('dressCodeSubtitle');
    w.details.dressCode.note = this.getVal('dressCodeNote');

    w.details.children.title = this.getVal('childrenTitle');
    w.details.children.subtitle = this.getVal('childrenSubtitle');
    w.details.children.note = this.getVal('childrenNote');

    w.details.gifts.title = this.getVal('giftsTitle');
    w.details.gifts.description = this.getVal('giftsDesc');

    if (this.getVal('wishesTitle') || this.getVal('wishesDesc')) {
      w.details.envelopeWishes = w.details.envelopeWishes || {};
      w.details.envelopeWishes.title = this.getVal('wishesTitle');
      w.details.envelopeWishes.description = this.getVal('wishesDesc');
    } else {
      delete w.details.envelopeWishes;
    }

    // Guardar fotos principales
    w.photos = w.photos || {};
    w.photos.hero = this.getVal('heroPhotoUrl');
    w.photos.closing = this.getVal('closingPhotoUrl');

    return this.data;
  }

  /* -------------------------------------------------------------
     DYNAMIC ITINERARY LIST
  ------------------------------------------------------------- */
  renderItineraryList() {
    const container = document.getElementById('itineraryListContainer');
    if (!container) return;
    container.innerHTML = '';

    this.data.wedding.itinerary.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'dynamic-item-card';
      card.innerHTML = `
        <div class="dynamic-item-header">
          <span class="dynamic-item-title">#${index + 1} — ${this.escapeHtml(item.title || '')}</span>
          <button type="button" class="btn-remove-item" data-index="${index}">🗑️ Eliminar</button>
        </div>
        <div class="form-grid-3">
          <div class="form-group">
            <label>Horario:</label>
            <input type="text" class="form-input itin-time" value="${this.escapeHtml(item.time)}" placeholder="15:30">
          </div>
          <div class="form-group">
            <label>Título:</label>
            <input type="text" class="form-input itin-title" value="${this.escapeHtml(item.title)}" placeholder="CEREMONIA">
          </div>
          <div class="form-group">
            <label>Icono:</label>
            <select class="form-select itin-icon">
              <option value="rings" ${item.icon === 'rings' ? 'selected' : ''}>💍 Anillos</option>
              <option value="cocktail" ${item.icon === 'cocktail' ? 'selected' : ''}>🥂 Cóctel / Copas</option>
              <option value="dinner" ${item.icon === 'dinner' ? 'selected' : ''}>🍽️ Cena / Banquete</option>
              <option value="celebration" ${item.icon === 'celebration' ? 'selected' : ''}>🪩 Fiesta / Celebración</option>
              <option value="church" ${item.icon === 'church' ? 'selected' : ''}>⛪ Iglesia</option>
              <option value="hacienda" ${item.icon === 'hacienda' ? 'selected' : ''}>🏛️ Hacienda</option>
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label>Descripción / Detalle:</label>
          <input type="text" class="form-input itin-desc" value="${this.escapeHtml(item.description || '')}" placeholder="Breve descripción">
        </div>
      `;

      card.querySelector('.btn-remove-item').addEventListener('click', () => {
        this.data.wedding.itinerary.splice(index, 1);
        this.renderItineraryList();
      });

      card.querySelector('.itin-time').addEventListener('input', (e) => item.time = e.target.value);
      card.querySelector('.itin-title').addEventListener('input', (e) => item.title = e.target.value);
      card.querySelector('.itin-icon').addEventListener('change', (e) => item.icon = e.target.value);
      card.querySelector('.itin-desc').addEventListener('input', (e) => item.description = e.target.value);

      container.appendChild(card);
    });
  }

  addItineraryItem() {
    this.data.wedding.itinerary.push({
      time: "00:00",
      title: "NUEVO MOMENTO",
      icon: "celebration",
      description: "Descripción del evento"
    });
    this.renderItineraryList();
  }

  /* -------------------------------------------------------------
     DYNAMIC BANK ACCOUNTS LIST
  ------------------------------------------------------------- */
  renderBankAccountsList() {
    const container = document.getElementById('bankAccountsListContainer');
    if (!container) return;
    container.innerHTML = '';

    this.data.wedding.details.bankAccounts.forEach((account, index) => {
      const card = document.createElement('div');
      card.className = 'dynamic-item-card';
      card.innerHTML = `
        <div class="dynamic-item-header">
          <span class="dynamic-item-title">🏦 Cuenta #${index + 1} — ${this.escapeHtml(account.bank || 'Banco')}</span>
          <button type="button" class="btn-remove-item" data-index="${index}">🗑️ Eliminar</button>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>Nombre del Banco:</label>
            <input type="text" class="form-input bank-name" value="${this.escapeHtml(account.bank)}" placeholder="Banrural / Banco Industrial">
          </div>
          <div class="form-group">
            <label>Número de Cuenta:</label>
            <input type="text" class="form-input bank-num" value="${this.escapeHtml(account.accountNumber)}" placeholder="4404152723">
          </div>
          <div class="form-group">
            <label>Titular de la Cuenta:</label>
            <input type="text" class="form-input bank-holder" value="${this.escapeHtml(account.accountHolder)}" placeholder="Nombre del titular">
          </div>
          <div class="form-group">
            <label>Tipo de Cuenta:</label>
            <input type="text" class="form-input bank-type" value="${this.escapeHtml(account.accountType)}" placeholder="Cuenta de Ahorro / Monetaria">
          </div>
        </div>
      `;

      card.querySelector('.btn-remove-item').addEventListener('click', () => {
        this.data.wedding.details.bankAccounts.splice(index, 1);
        this.renderBankAccountsList();
      });

      card.querySelector('.bank-name').addEventListener('input', (e) => account.bank = e.target.value);
      card.querySelector('.bank-num').addEventListener('input', (e) => account.accountNumber = e.target.value);
      card.querySelector('.bank-holder').addEventListener('input', (e) => account.accountHolder = e.target.value);
      card.querySelector('.bank-type').addEventListener('input', (e) => account.accountType = e.target.value);

      container.appendChild(card);
    });
  }

  addBankAccount() {
    this.data.wedding.details.bankAccounts.push({
      bank: "Nuevo Banco",
      accountHolder: "Titular",
      accountType: "Cuenta de Ahorro",
      accountNumber: "000-000000-0"
    });
    this.renderBankAccountsList();
  }

  /* -------------------------------------------------------------
     DYNAMIC GALLERY LIST
  ------------------------------------------------------------- */
  renderGalleryList() {
    const container = document.getElementById('galleryListContainer');
    if (!container) return;
    container.innerHTML = '';

    if (!this.data.wedding.gallery || this.data.wedding.gallery.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 24px; color:#64748B; background:#F8FAFC; border:1px dashed #CBD5E1; border-radius:8px;">
          No hay fotos en la galería todavía. Haz clic en <strong>"+ Agregar Espacio para Foto"</strong> o <strong>"📁 Subir Fotos desde Computadora"</strong> para añadir momentos especiales.
        </div>
      `;
      return;
    }

    this.data.wedding.gallery.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'admin-gallery-card';
      const fileInputId = `galFileInput_${index}_${Math.random().toString(36).substring(2, 7)}`;

      card.innerHTML = `
        <div class="admin-gallery-img-wrapper">
          <img src="${this.escapeHtml(item.url)}" alt="${this.escapeHtml(item.caption || '')}" class="admin-gallery-img" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'150\\' fill=\\'%23ccc\\'><text x=\\'50%\\' y=\\'50%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\'>Sin imagen</text></svg>'">
        </div>
        <div class="admin-gallery-body">
          <div class="form-group" style="margin-bottom:6px;">
            <label style="font-size:0.75rem; font-weight:600; color:var(--adm-navy);">📁 Subir archivo:</label>
            <input type="file" id="${fileInputId}" class="form-input gal-file-input" accept="image/*" style="font-size:0.75rem; padding:4px 6px;">
          </div>
          <div class="form-group" style="margin-bottom:6px;">
            <label style="font-size:0.75rem;">URL / Ruta de Imagen:</label>
            <input type="text" class="form-input gal-url" style="font-size:0.8rem; padding:6px 10px;" value="${this.escapeHtml(item.url)}">
          </div>
          <div class="form-group" style="margin-bottom:6px;">
            <label style="font-size:0.75rem;">Pie de Foto / Título:</label>
            <input type="text" class="form-input gal-caption" style="font-size:0.8rem; padding:6px 10px;" value="${this.escapeHtml(item.caption || '')}" placeholder="Descripción del momento...">
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
            <span style="font-size:0.72rem; color:#64748B; font-weight:600;">Foto #${index + 1}</span>
            <button type="button" class="btn-remove-item btn-gal-remove">🗑️ Eliminar</button>
          </div>
        </div>
      `;

      // File upload handler per card
      const fileInput = card.querySelector(`#${fileInputId}`);
      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64Url = event.target.result;
            item.url = base64Url;
            if (!item.caption || item.caption === '' || item.caption === '') {
              item.caption = file.name.replace(/\.[^/.]+$/, "");
              card.querySelector('.gal-caption').value = item.caption;
            }
            card.querySelector('.gal-url').value = base64Url;
            card.querySelector('.admin-gallery-img').src = base64Url;
            this.showToast(`📸 Foto #${index + 1} cargada con éxito.`);
          };
          reader.readAsDataURL(file);
        });
      }

      card.querySelector('.btn-gal-remove').addEventListener('click', () => {
        this.data.wedding.gallery.splice(index, 1);
        this.renderGalleryList();
      });

      card.querySelector('.gal-url').addEventListener('input', (e) => {
        item.url = e.target.value;
        card.querySelector('.admin-gallery-img').src = e.target.value;
      });

      card.querySelector('.gal-caption').addEventListener('input', (e) => {
        item.caption = e.target.value;
      });

      container.appendChild(card);
    });
  }

  addGalleryItem() {
    this.data.wedding.gallery = this.data.wedding.gallery || [];
    this.data.wedding.gallery.push({
      url: "assets/images/gallery-1.jpg",
      alt: "Foto Galería",
      caption: "Nuevo momento especial"
    });
    this.renderGalleryList();
  }

  /* -------------------------------------------------------------
     EVENT BINDINGS & ACTIONS
  ------------------------------------------------------------- */
  bindEvents() {
    // Save button
    const saveButtons = [document.getElementById('btnTopSave'), document.getElementById('btnBottomSave')];
    saveButtons.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => this.saveData());
      }
    });

    // Download JSON button
    const downloadBtn = document.getElementById('btnDownloadJson');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadJson());
    }

    // Import JSON file
    const importInput = document.getElementById('importJsonInput');
    if (importInput) {
      importInput.addEventListener('change', (e) => this.handleJsonImport(e));
    }

    // Reset button
    const resetBtn = document.getElementById('btnResetDefaults');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetDefaults());
    }

    // Add Itinerary button
    const btnAddItin = document.getElementById('btnAddItinerary');
    if (btnAddItin) {
      btnAddItin.addEventListener('click', () => this.addItineraryItem());
    }

    // Add Bank button
    const btnAddBank = document.getElementById('btnAddBank');
    if (btnAddBank) {
      btnAddBank.addEventListener('click', () => this.addBankAccount());
    }

    // Add Gallery photo
    const btnAddPhoto = document.getElementById('btnAddGalleryPhoto');
    if (btnAddPhoto) {
      btnAddPhoto.addEventListener('click', () => this.addGalleryItem());
    }

    // Bulk Gallery Upload
    const bulkUploadInput = document.getElementById('bulkGalleryUpload');
    if (bulkUploadInput) {
      bulkUploadInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (!files || files.length === 0) return;

        this.data.wedding.gallery = this.data.wedding.gallery || [];
        let loadedCount = 0;
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.data.wedding.gallery.push({
              url: event.target.result,
              alt: file.name.replace(/\.[^/.]+$/, ""),
              caption: file.name.replace(/\.[^/.]+$/, "")
            });
            loadedCount++;
            if (loadedCount === files.length) {
              this.renderGalleryList();
              this.showToast(`📸 Se subieron ${files.length} foto(s) a la galería.`);
            }
          };
          reader.readAsDataURL(file);
        });
        e.target.value = '';
      });
    }

    // Live preview for hero & closing photos
    const heroInput = document.getElementById('heroPhotoUrl');
    if (heroInput) {
      heroInput.addEventListener('input', (e) => this.updateImagePreview('heroPhotoPreview', e.target.value));
    }
    const closingInput = document.getElementById('closingPhotoUrl');
    if (closingInput) {
      closingInput.addEventListener('input', (e) => this.updateImagePreview('closingPhotoPreview', e.target.value));
    }

    // File inputs for hero & closing photos
    this.setupFileInput('heroPhotoFileInput', 'heroPhotoUrl', 'heroPhotoPreview');
    this.setupFileInput('closingPhotoFileInput', 'closingPhotoUrl', 'closingPhotoPreview');
  }

  setupFileInput(fileInputId, urlInputId, previewImgId) {
    const fileInput = document.getElementById(fileInputId);
    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target.result;
        this.setVal(urlInputId, base64Url);
        this.updateImagePreview(previewImgId, base64Url);
        this.showToast('📸 Foto cargada en la vista previa.');
      };
      reader.readAsDataURL(file);
    });
  }

  saveData() {
    this.collectFormData();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      this.showToast('✅ ¡Cambios guardados con éxito! La invitación se ha actualizado.');
    } catch (e) {
      this.showToast('⚠️ No se pudo guardar en localStorage (almacenamiento lleno). Descarga el JSON.');
    }
  }

  downloadJson() {
    this.collectFormData();
    const jsonStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'invitation-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast('📥 Archivo invitation-data.json descargado.');
  }

  handleJsonImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported && imported.wedding) {
          this.data = imported;
          this.populateForm();
          this.renderItineraryList();
          this.renderBankAccountsList();
          this.renderGalleryList();
          this.saveData();
          this.showToast('🎉 ¡Archivo JSON importado y aplicado correctamente!');
        } else {
          this.showToast('❌ El archivo JSON no tiene la estructura de boda requerida.');
        }
      } catch (err) {
        this.showToast('❌ Error al procesar el archivo JSON.');
      }
    };
    reader.readAsText(file, 'UTF-8');
  }

  resetDefaults() {
    if (confirm('¿Estás seguro de restablecer todos los datos a la configuración inicial de José & Sandy?')) {
      localStorage.removeItem(STORAGE_KEY);
      this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      this.populateForm();
      this.renderItineraryList();
      this.renderBankAccountsList();
      this.renderGalleryList();
      this.saveData();
      this.showToast('🔄 Configuración restablecida a valores iniciales.');
    }
  }

  updateImagePreview(imgElementId, url) {
    const el = document.getElementById(imgElementId);
    if (el) {
      el.src = url || 'assets/images/couple-hero.jpg';
    }
  }

  getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  showToast(msg) {
    const toast = document.getElementById('adminToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new WeddingAdminManager();
});
