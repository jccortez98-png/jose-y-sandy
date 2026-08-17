/**
 * Main Application Logic - Wedding Invitation José & Sandy
 * Universal script: works seamlessly in file:/// and http:// protocols.
 */

const STORAGE_KEY = 'wedding_invitation_data';

// Force scroll restoration to top on page load/reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Global Opening Function for Wax Seal and Envelope
window.openWeddingEnvelope = function(e) {
  if (e && e.stopPropagation) {
    e.stopPropagation();
  }
  const overlay = document.getElementById('envelopeOverlay');
  const env = document.getElementById('envelope');
  if (!overlay || overlay.classList.contains('opened')) return;

  // Always reset scroll to the top of the invitation
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  if (env) env.classList.add('opening');
  
  if (window.weddingAppInstance) {
    try {
      window.weddingAppInstance.playAmbientRomanticMusic();
    } catch (err) {
      console.log('Audio init on envelope open');
    }
  }

  setTimeout(() => {
    overlay.classList.add('opened');
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, 650);
};

// Helper: Create Google Calendar Link
function createGoogleCalendarUrl(data) {
  const startIso = '20261128T213000Z';
  const endIso = '20261129T090000Z';
  const groomName = data?.couple?.groom?.firstName || 'José';
  const brideName = data?.couple?.bride?.firstName || 'Sandy';
  
  const title = encodeURIComponent(`Boda ${groomName} & ${brideName} 💍`);
  const details = encodeURIComponent(
    '¡Nos casamos! Nos dará una inmensa alegría compartir este día tan especial contigo.\n\n' +
    '• Ceremonia: 15:30 hrs - Iglesia San Juan Bautista, Antigua Guatemala\n' +
    '• Recepción: 20:00 hrs - Hacienda Santo Tomás, Milpas Altas\n\n' +
    'Dress Code: Formal\n' +
    'Adultos Solamente'
  );
  const location = encodeURIComponent('Iglesia San Juan Bautista & Hacienda Santo Tomás, Antigua Guatemala');
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}

// Helper: Download iCal file
function downloadIcsFile(data) {
  const groomName = data?.couple?.groom?.firstName || 'José';
  const brideName = data?.couple?.bride?.firstName || 'Sandy';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:boda-${groomName.toLowerCase()}-${brideName.toLowerCase()}-20261128@invitacion.wedding`,
    'DTSTAMP:20260101T000000Z',
    'DTSTART:20261128T213000Z',
    'DTEND:20261129T090000Z',
    `SUMMARY:Boda ${groomName} & ${brideName} 💍`,
    'DESCRIPTION:¡Nos casamos! Nos dará una inmensa alegría compartir este día tan especial contigo.\\n\\n• Ceremonia: 15:30 hrs - Iglesia San Juan Bautista\\n• Recepción: 20:00 hrs - Hacienda Santo Tomás',
    'LOCATION:Iglesia San Juan Bautista & Hacienda Santo Tomás, Antigua Guatemala',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `Boda-${groomName}-y-${brideName}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Default Fallback Wedding Configuration
const DEFAULT_WEDDING_DATA = {
  couple: {
    groom: { firstName: "José", fullName: "José Alberto Herrera", phone: "+50255551234", phoneDisplay: "+502 5555 1234" },
    bride: { firstName: "Sandy", fullName: "Sandy Peláez", phone: "+50255555678", phoneDisplay: "+502 5555 5678" },
    monogram: "J | S"
  },
  date: {
    isoDateTime: "2026-11-28T15:30:00-06:00",
    day: "28",
    month: "Noviembre",
    year: "2026",
    timeCeremony: "15:30",
    timeReception: "20:00",
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
      { bank: "Banrural", accountHolder: "Sandy Peláez", accountType: "Cuenta de Ahorro", accountNumber: "4404152723" }
    ]
  },
    photos: {
      hero: "assets/images/couple-hero.jpg",
      closing: "assets/images/couple-closing.jpg"
    },
    gallery: [
      { url: "assets/images/gallery-1.jpg", alt: "Anillos de boda", caption: "Nuestra promesa de amor" },
      { url: "assets/images/gallery-2.jpg", alt: "Momentos felices", caption: "Caminando juntos siempre" }
    ],
    music: {
      enabled: true,
      autoplayAfterEnvelope: true,
      title: "Canción de Boda",
      src: "assets/audio/track.mp3"
    }
};

class WeddingApp {
  constructor() {
    this.data = DEFAULT_WEDDING_DATA;
    this.passesCount = this.extractPassesParam();
    this.audio = null;
    this.isPlayingMusic = false;
  }

  async init() {
    // 1. Try loading customized data from localStorage (saved by admin.html)
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed && parsed.wedding) {
          this.data = this.deepMerge(this.data, parsed.wedding);
        } else if (parsed) {
          this.data = this.deepMerge(this.data, parsed);
        }
        // If localStorage had the old placeholder filename, sanitize to track.mp3
        if (this.data.music && (this.data.music.src === 'assets/audio/wedding-ambient.mp3' || !this.data.music.src)) {
          this.data.music.src = 'assets/audio/track.mp3';
        }
      }
    } catch (e) {
      console.warn('LocalStorage not available or empty', e);
    }

    // 2. If no localStorage, try fetching JSON file if on HTTP server
    if (!localStorage.getItem(STORAGE_KEY) && window.location.protocol.startsWith('http')) {
      try {
        const response = await fetch('data/invitation-data.json');
        if (response.ok) {
          const json = await response.json();
          if (json && json.wedding) {
            this.data = this.deepMerge(this.data, json.wedding);
          }
        }
      } catch (e) {
        console.log('Using default wedding configuration');
      }
    }

    // 3. Render all content into the DOM
    this.renderDynamicContent();

    // 4. Setup interactive features
    this.setupEnvelope();
    this.renderPassesBadge();
    this.renderRsvpForm();
    this.setupRsvpFormSubmission();
    this.initCountdown();
    this.setupCalendarButtons();
    this.setupLocationModal();
    this.setupBankCopyButtons();
    this.setupGalleryLightbox();
    this.setupAmbientAudio();
  }

  deepMerge(target, source) {
    const output = { ...target };
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (Array.isArray(source[key])) {
          output[key] = [...source[key]];
        } else if (this.isObject(source[key])) {
          if (!(key in target)) Object.assign(output, { [key]: source[key] });
          else output[key] = this.deepMerge(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  /* -------------------------------------------------------------
     RENDER ALL DYNAMIC CONTENT FROM DATA
  ------------------------------------------------------------- */
  renderDynamicContent() {
    const d = this.data;

    // Title and Meta
    if (d.couple?.groom && d.couple?.bride) {
      document.title = `Boda ${d.couple.groom.firstName} & ${d.couple.bride.firstName} | ${d.date?.day || '28'} de ${d.date?.month || 'Noviembre'} ${d.date?.year || '2026'}`;
    }

    // Monogram
    this.setText('monogramDisplay', d.couple?.monogram || 'J | S');
    this.setText('closingMonogramDisplay', d.couple?.monogram || 'J | S');
    this.setText('footerMonogram', d.couple?.monogram || 'J | S');

    // Subtitle & Names
    this.setText('coverSubtitleDisplay', (d.texts?.coverSubtitle || 'EL COMIENZO DE NUESTRO PARA SIEMPRE').replace(/\n/g, '<br>'), true);
    this.setText('groomNameDisplay', d.couple?.groom?.firstName || 'José');
    this.setText('brideNameDisplay', d.couple?.bride?.firstName || 'Sandy');
    this.setText('weAreMarryingDisplay', d.texts?.weAreGettingMarried || 'NOS CASAMOS');

    // Date
    this.setText('dateDayDisplay', d.date?.day || '28');
    this.setText('dateMonthDisplay', d.date?.month || 'NOVIEMBRE');
    this.setText('dateYearDisplay', (d.date?.year || '2026').split('').join(' '));
    this.setText('footerCredits', `${d.date?.day || '28'} . ${d.date?.monthNumber || '11'} . ${d.date?.year || '2026'} • ${d.locations?.ceremony?.city || 'ANTIGUA GUATEMALA'}`);

    // Quotes & Blessings
    this.setText('openingQuoteDisplay', `"${d.texts?.openingQuote || ''}"`);
    this.setText('blessingIntroDisplay', d.texts?.blessingIntro || '');
    
    // Mothers: Silvia Matias <br>&<br> Maria Eugenia López
    const mothersRaw = d.texts?.mothers || 'Silvia Matias & Maria Eugenia López';
    const mothersFormatted = mothersRaw.replace(/\s*&\s*/g, '<br>&<br>').replace(/\n+/g, '<br>');
    this.setText('mothersDisplay', mothersFormatted, true);
    
    this.setText('invitationCalloutDisplay', d.texts?.invitationCallout || '');

    // Ceremony & Reception
    if (d.locations?.ceremony) {
      this.setText('ceremonyTimeDisplay', d.locations.ceremony.time || '15:30 HRS.');
      this.setText('ceremonyVenueDisplay', d.locations.ceremony.venue || 'IGLESIA SAN JUAN BAUTISTA');
      this.setText('ceremonyCityDisplay', d.locations.ceremony.city || 'Antigua Guatemala');
    }

    if (d.locations?.reception) {
      this.setText('receptionTimeDisplay', d.locations.reception.time || '20:00 HRS.');
      this.setText('receptionVenueDisplay', d.locations.reception.venue || 'HACIENDA SANTO TOMÁS');
      this.setText('receptionCityDisplay', `${d.locations.reception.address ? d.locations.reception.address + ', ' : ''}${d.locations.reception.city || 'Antigua Guatemala'}`);
      this.setText('modalLocationSubtitle', `${d.locations.reception.venue || 'Hacienda Santo Tomás'}, ${d.locations.reception.city || ''}`);
    }

    // Itinerary Render
    this.renderItineraryTimeline();

    // Details: Dress Code, Adults, Gifts
    if (d.details) {
      if (d.details.dressCode) {
        this.setText('dressCodeTypeDisplay', d.details.dressCode.type || 'FORMAL');
        this.setText('dressCodeSubtitleDisplay', d.details.dressCode.subtitle || 'Traje formal');
        this.setText('dressCodeNoteDisplay', d.details.dressCode.note || '');
      }

      if (d.details.children) {
        this.setText('adultsTitleDisplay', d.details.children.title || 'ADULTOS SOLAMENTE');
        this.setText('adultsSubtitleDisplay', d.details.children.subtitle || 'Agradecemos su comprensión.');
        this.setText('adultsNoteDisplay', d.details.children.note || '');
      }

      if (d.details.gifts) {
        this.setText('giftsTitleDisplay', d.details.gifts.title || 'BUZÓN DE LOS DESEOS');
        this.setText('giftsDescDisplay', (d.details.gifts.description || '').replace(/\n/g, '<br><br>'), true);
      }

      // Bank Accounts Render
      this.renderBankAccounts();
    }

    // Photos
    const heroImgEl = document.getElementById('heroPhoto');
    const closingImgEl = document.getElementById('closingPhoto');
    const heroPhotoSrc = d.photos?.hero || d.heroPhoto || (d.wedding?.photos?.hero) || (d.gallery && d.gallery[0]?.url && d.gallery[0].url.includes('couple-hero') ? d.gallery[0].url : 'assets/images/couple-hero.jpg');
    const closingPhotoSrc = d.photos?.closing || d.closingPhoto || (d.wedding?.photos?.closing) || (d.gallery && d.gallery[3]?.url && d.gallery[3].url.includes('couple-closing') ? d.gallery[3].url : 'assets/images/couple-closing.jpg');
    if (heroImgEl && heroPhotoSrc) heroImgEl.src = heroPhotoSrc;
    if (closingImgEl && closingPhotoSrc) closingImgEl.src = closingPhotoSrc;

    // Gallery Render
    this.renderGalleryGrid();

    // Closing Texts
    this.setText('closingThanksDisplay', d.texts?.closingThanks || 'GRACIAS POR SER PARTE DE ESTE DÍA TAN ESPECIAL PARA NOSOTROS.');
    this.setText('seeYouThereDisplay', d.texts?.seeYouThere || '¡Nos vemos allí!');
    this.setText('rsvpSubtitleDisplay', d.texts?.rsvpSubtitle || `Te agradeceremos confirmar tu asistencia antes del ${d.date?.rsvpDeadline || '10 de octubre de 2026'}.`);

    // WhatsApp Buttons
    this.setText('waGroomName', (d.couple?.groom?.fullName || 'JOSÉ HERRERA').toUpperCase());
    this.setText('waGroomPhone', d.couple?.groom?.phoneDisplay || d.couple?.groom?.phone || '+502 5555 1234');
    this.setText('waBrideName', (d.couple?.bride?.fullName || 'SANDY LÓPEZ').toUpperCase());
    this.setText('waBridePhone', d.couple?.bride?.phoneDisplay || d.couple?.bride?.phone || '+502 5555 5678');
  }

  setText(id, val, isHtml = false) {
    const el = document.getElementById(id);
    if (!el) return;
    if (isHtml) el.innerHTML = val;
    else el.textContent = val;
  }

  renderItineraryTimeline() {
    const container = document.getElementById('timelineContainer');
    const itinerary = this.data.itinerary || this.data.wedding?.itinerary;
    if (!container || !itinerary || !Array.isArray(itinerary) || itinerary.length === 0) return;

    const iconMap = {
      rings: 'assets/icons/rings.svg',
      cocktail: 'assets/icons/cocktail.svg',
      dinner: 'assets/icons/dinner.svg',
      celebration: 'assets/icons/celebration.svg',
      church: 'assets/icons/church.svg',
      hacienda: 'assets/icons/hacienda.svg'
    };

    let itemsHtml = '<div class="timeline-line"></div>';
    itinerary.forEach(item => {
      const iconSrc = iconMap[item.icon] || 'assets/icons/celebration.svg';
      itemsHtml += `
        <div class="timeline-item">
          <div class="timeline-icon-box">
            <img src="${iconSrc}" alt="${this.escapeHtml(item.title)}">
          </div>
          <div class="timeline-content">
            <span class="timeline-time">${this.escapeHtml(item.time)}</span>
            <span class="timeline-title">${this.escapeHtml(item.title)}</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = itemsHtml;
  }

  renderBankAccounts() {
    const container = document.getElementById('bankCardsGrid');
    const accounts = this.data.details?.bankAccounts || this.data.bankAccounts || this.data.wedding?.details?.bankAccounts;
    if (!container || !accounts || !Array.isArray(accounts) || accounts.length === 0) return;

    let cardsHtml = '';
    accounts.forEach(acc => {
      const cleanNum = (acc.accountNumber || '').replace(/[^0-9]/g, '');
      cardsHtml += `
        <div class="bank-card">
          <div class="bank-name">${this.escapeHtml((acc.bank || '').toUpperCase())}</div>
          <div class="bank-account-num">${this.escapeHtml(acc.accountNumber || '')}</div>
          <div class="bank-holder">${this.escapeHtml(acc.accountHolder || '')} • ${this.escapeHtml(acc.accountType || '')}</div>
          <button class="btn-copy-account" data-account="${cleanNum}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copiar Cuenta
          </button>
        </div>
      `;
    });

    container.innerHTML = cardsHtml;
  }

  renderGalleryGrid() {
    const container = document.getElementById('galleryGrid');
    const gallery = this.data.gallery || this.data.wedding?.gallery;
    if (!container || !gallery || !Array.isArray(gallery) || gallery.length === 0) return;

    let galleryHtml = '';
    gallery.forEach(item => {
      galleryHtml += `
        <div class="gallery-item">
          <img src="${this.escapeHtml(item.url)}" alt="${this.escapeHtml(item.alt || '')}" data-caption="${this.escapeHtml(item.caption || '')}">
        </div>
      `;
    });

    container.innerHTML = galleryHtml;
  }

  /* -------------------------------------------------------------
     PASSES PARAM EXTRACTION (?pases=X o ?p=X)
  ------------------------------------------------------------- */
  extractPassesParam() {
    const params = new URLSearchParams(window.location.search);
    const passes = params.get('pases') || params.get('passes') || params.get('p') || params.get('cupos') || params.get('personas') || '';
    return passes ? parseInt(passes, 10) : null;
  }

  renderPassesBadge() {
    const badgeBox = document.getElementById('passesBadgeBox');
    const passesDisplay = document.getElementById('passesDisplay');
    
    if (this.passesCount && this.passesCount > 0) {
      if (badgeBox && passesDisplay) {
        const count = this.passesCount;
        const text = count === 1 ? 'INVITACIÓN PARA 1 PERSONA' : `INVITACIÓN PARA ${count} PERSONAS`;
        passesDisplay.textContent = text;
        badgeBox.style.display = 'block';
      }
    } else {
      if (badgeBox) badgeBox.style.display = 'none';
    }
  }

  /* -------------------------------------------------------------
     ENVELOPE INTERACTION & WAX SEAL OPENING
  ------------------------------------------------------------- */
  setupEnvelope() {
    const waxSealBtn = document.getElementById('waxSealBtn');
    const envelopeOverlay = document.getElementById('envelopeOverlay');
    const envelope = document.getElementById('envelope');
    const hint = document.querySelector('.envelope-hint');

    const triggerOpen = (e) => {
      window.openWeddingEnvelope(e);
    };

    if (waxSealBtn) {
      waxSealBtn.addEventListener('click', triggerOpen);
      waxSealBtn.addEventListener('touchend', triggerOpen);
    }
    if (envelope) {
      envelope.addEventListener('click', triggerOpen);
    }
    if (hint) {
      hint.addEventListener('click', triggerOpen);
    }
    if (envelopeOverlay) {
      envelopeOverlay.addEventListener('click', (e) => {
        if (e.target === envelopeOverlay || e.target.classList.contains('envelope-wrapper')) {
          triggerOpen(e);
        }
      });
    }
  }

  /* -------------------------------------------------------------
     COUNTDOWN TIMER
  ------------------------------------------------------------- */
  initCountdown() {
    const targetDate = new Date(this.data.date?.isoDateTime || "2026-11-28T15:30:00-06:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        this.setText('daysNum', '00');
        this.setText('hoursNum', '00');
        this.setText('minsNum', '00');
        this.setText('secsNum', '00');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      this.setText('daysNum', String(days).padStart(2, '0'));
      this.setText('hoursNum', String(hours).padStart(2, '0'));
      this.setText('minsNum', String(minutes).padStart(2, '0'));
      this.setText('secsNum', String(seconds).padStart(2, '0'));
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /* -------------------------------------------------------------
     CALENDAR SAVE THE DATE
  ------------------------------------------------------------- */
  setupCalendarButtons() {
    const googleCalendarBtn = document.getElementById('btnGoogleCalendar');
    if (googleCalendarBtn) {
      googleCalendarBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = createGoogleCalendarUrl(this.data);
        window.open(url, '_blank');
      });
    }

    const icalBtn = document.getElementById('btnIcalCalendar');
    if (icalBtn) {
      icalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        downloadIcsFile(this.data);
      });
    }
  }

  /* -------------------------------------------------------------
     LOCATION MODAL (WAZE / GOOGLE MAPS / APPLE MAPS)
  ------------------------------------------------------------- */
  setupLocationModal() {
    const btnVerUbicacion = document.getElementById('btnVerUbicacion');
    const modalOverlay = document.getElementById('locationModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    const optionWaze = document.getElementById('modalWazeBtn');
    const optionGoogle = document.getElementById('modalGoogleBtn');
    const optionApple = document.getElementById('modalAppleBtn');

    if (!btnVerUbicacion || !modalOverlay) return;

    btnVerUbicacion.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('active');
    });

    const closeModal = () => modalOverlay.classList.remove('active');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    const reception = this.data.locations?.reception;
    if (reception) {
      if (optionWaze) optionWaze.href = reception.wazeUrl || '#';
      if (optionGoogle) optionGoogle.href = reception.googleMapsUrl || '#';
      if (optionApple) optionApple.href = reception.appleMapsUrl || '#';
    }
  }

  /* -------------------------------------------------------------
     BANK ACCOUNTS COPY TO CLIPBOARD
  ------------------------------------------------------------- */
  setupBankCopyButtons() {
    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('.btn-copy-account');
      if (!btn) return;

      const accountNumber = btn.getAttribute('data-account');
      if (!accountNumber) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(accountNumber);
        } else {
          const tempInput = document.createElement('input');
          tempInput.value = accountNumber;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        const originalHtml = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><polyline points="20 6 9 17 4 12"></polyline></svg> ¡Copiado!`;

        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = originalHtml;
        }, 2400);
      } catch (err) {
        console.error('Error al copiar:', err);
      }
    });
  }

  /* -------------------------------------------------------------
     RSVP DYNAMIC ATTENDEES FORM & GOOGLE SHEETS SUBMISSION
  ------------------------------------------------------------- */
  getGuestStorageKey() {
    const params = new URLSearchParams(window.location.search);
    const guestParam = params.get('invitado') || params.get('guest') || params.get('nombre') || params.get('id') || 'general';
    return encodeURIComponent(guestParam.trim().toLowerCase());
  }

  getSavedRsvpSubmission() {
    const key = 'wedding_rsvp_confirmed_' + this.getGuestStorageKey();
    const saved = localStorage.getItem(key) || localStorage.getItem('wedding_last_rsvp_submission');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  }

  renderRsvpForm() {
    const container = document.getElementById('rsvpAttendeesContainer');
    const form = document.getElementById('rsvpForm');
    if (!container || !form) return;

    const count = (this.passesCount && this.passesCount > 0) ? this.passesCount : 1;
    const existingSubmission = this.getSavedRsvpSubmission();

    // Check if there's already a confirmed state box
    const oldBox = document.getElementById('rsvpConfirmedBox');
    if (oldBox) oldBox.remove();

    if (existingSubmission && existingSubmission.confirmed) {
      // Create confirmed card
      const box = document.createElement('div');
      box.className = 'rsvp-already-confirmed-box';
      box.id = 'rsvpConfirmedBox';

      const dateStr = existingSubmission.formattedDate || new Date(existingSubmission.submittedAt || Date.now()).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

      let itemsHtml = '';
      if (existingSubmission.attendees && Array.isArray(existingSubmission.attendees)) {
        itemsHtml = existingSubmission.attendees.map((a, idx) => `
          <div class="rsvp-confirmed-item">
            <span class="rsvp-confirmed-name">- ${this.escapeHtml(a.name || `Invitado ${idx + 1}`)}</span>
            <span class="rsvp-confirmed-choice">${this.escapeHtml(a.attendance || 'Confirmado')}</span>
          </div>
        `).join('');
      }

      box.innerHTML = `
        <div class="rsvp-confirmed-badge">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>ASISTENCIA CONFIRMADA</span>
        </div>
        <h3 class="rsvp-confirmed-title">¡Hemos recibido tu confirmación!</h3>
        <p class="rsvp-confirmed-date">Confirmada el ${dateStr}</p>
        
        <div class="rsvp-confirmed-summary">
          ${itemsHtml}
        </div>

        <p class="rsvp-confirmed-note">Ya tenemos tu lugar reservado. ¡Nos dará una inmensa alegría compartir este día contigo!</p>
      `;

      form.parentNode.insertBefore(box, form);
      form.style.display = 'none';

    } else {
      form.style.display = 'block';
    }

    let html = '';
    for (let i = 0; i < count; i++) {
      const prevAttendee = existingSubmission?.attendees && existingSubmission.attendees[i];
      const prevName = prevAttendee?.name || '';
      const prevAttendance = prevAttendee?.attendance || 'Ambas (Ceremonia y Recepción)';

      html += `
        <div class="rsvp-attendee-card" data-index="${i}">
          <div class="rsvp-card-header">
            <span class="rsvp-guest-title">Invitado ${i + 1}</span>
            <span class="rsvp-guest-num">Pase ${i + 1} de ${count}</span>
          </div>

          <div class="rsvp-input-group">
            <label for="attendeeName_${i}" class="rsvp-input-label">Nombre y Apellido *</label>
            <input type="text" id="attendeeName_${i}" class="rsvp-input attendee-name-input" placeholder="Nombre completo del asistente" value="${this.escapeHtml(prevName)}" required>
          </div>

          <div class="rsvp-input-group" style="margin-bottom: 0;">
            <label class="rsvp-input-label">¿A cuál momento asistirás? *</label>
            <div class="rsvp-options-grid">
              <label class="rsvp-radio-label">
                <input type="radio" name="attendance_${i}" value="Ambas (Ceremonia y Recepción)" ${prevAttendance === 'Ambas (Ceremonia y Recepción)' ? 'checked' : ''}>
                <div class="rsvp-radio-content">
                  <img src="assets/icons/toast.svg" alt="" class="rsvp-radio-icon">
                  <span>Ambas (Ceremonia y Recepción)</span>
                </div>
              </label>
              <label class="rsvp-radio-label">
                <input type="radio" name="attendance_${i}" value="Solo Ceremonia" ${prevAttendance === 'Solo Ceremonia' ? 'checked' : ''}>
                <div class="rsvp-radio-content">
                  <img src="assets/icons/rings.svg" alt="" class="rsvp-radio-icon">
                  <span>Solo Ceremonia</span>
                </div>
              </label>
              <label class="rsvp-radio-label">
                <input type="radio" name="attendance_${i}" value="Solo Recepción" ${prevAttendance === 'Solo Recepción' ? 'checked' : ''}>
                <div class="rsvp-radio-content">
                  <img src="assets/icons/hacienda.svg" alt="" class="rsvp-radio-icon">
                  <span>Solo Recepción</span>
                </div>
              </label>
              <label class="rsvp-radio-label">
                <input type="radio" name="attendance_${i}" value="No podré asistir" ${prevAttendance === 'No podré asistir' ? 'checked' : ''}>
                <div class="rsvp-radio-content">
                  <img src="assets/icons/decline.svg" alt="" class="rsvp-radio-icon">
                  <span>No podré asistir</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
    if (existingSubmission && existingSubmission.message) {
      const msgInput = document.getElementById('rsvpMessageInput');
      if (msgInput) msgInput.value = existingSubmission.message;
    }
  }

  setupRsvpFormSubmission() {
    const form = document.getElementById('rsvpForm');
    const submitBtn = document.getElementById('btnSubmitRsvp');
    const statusAlert = document.getElementById('rsvpStatusAlert');
    if (!form || !submitBtn) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const count = (this.passesCount && this.passesCount > 0) ? this.passesCount : 1;
      const attendees = [];

      // Validate all attendee names
      for (let i = 0; i < count; i++) {
        const nameInput = document.getElementById(`attendeeName_${i}`);
        const nameVal = nameInput ? nameInput.value.trim() : '';

        if (!nameVal) {
          if (nameInput) {
            nameInput.focus();
            nameInput.style.borderColor = '#B71C1C';
          }
          if (statusAlert) {
            statusAlert.className = 'rsvp-status-alert error';
            statusAlert.textContent = `Por favor ingresa el nombre del Invitado ${i + 1}.`;
            statusAlert.style.display = 'block';
          }
          return;
        } else if (nameInput) {
          nameInput.style.borderColor = '';
        }

        const attendanceRadio = form.querySelector(`input[name="attendance_${i}"]:checked`);
        const attendanceVal = attendanceRadio ? attendanceRadio.value : 'Ambas (Ceremonia y Recepción)';

        attendees.push({
          passNumber: i + 1,
          name: nameVal,
          attendance: attendanceVal
        });
      }

      const messageVal = document.getElementById('rsvpMessageInput')?.value.trim() || '';
      const dateNow = new Date();

      const payload = {
        confirmed: true,
        totalPasses: count,
        message: messageVal,
        submittedAt: dateNow.toISOString(),
        formattedDate: dateNow.toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        attendees: attendees
      };

      // Loading state
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');
      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline-flex';
      submitBtn.disabled = true;

      // Save locally in localStorage with guest key
      const guestKey = this.getGuestStorageKey();
      try {
        localStorage.setItem('wedding_rsvp_confirmed_' + guestKey, JSON.stringify(payload));
        localStorage.setItem('wedding_last_rsvp_submission', JSON.stringify(payload));
      } catch (err) {}

      const webhookUrl = this.data.texts?.rsvpWebhookUrl || '';

      if (webhookUrl && webhookUrl.startsWith('http')) {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
          });

          if (statusAlert) {
            statusAlert.className = 'rsvp-status-alert success';
            statusAlert.innerHTML = `<strong>¡Confirmación Recibida! 💍</strong><br>Muchas gracias, hemos registrado la asistencia para ${count} ${count === 1 ? 'persona' : 'personas'}. ¡Nos dará una inmensa alegría compartir contigo!`;
            statusAlert.style.display = 'block';
          }
          
          setTimeout(() => {
            if (statusAlert) statusAlert.style.display = 'none';
            this.renderRsvpForm();
          }, 2000);

        } catch (err) {
          if (statusAlert) {
            statusAlert.className = 'rsvp-status-alert success';
            statusAlert.innerHTML = `<strong>¡Confirmación Guardada! 💍</strong><br>Hemos registrado tus datos correctamente.`;
            statusAlert.style.display = 'block';
          }
          setTimeout(() => {
            if (statusAlert) statusAlert.style.display = 'none';
            this.renderRsvpForm();
          }, 2000);
        }
      } else {
        setTimeout(() => {
          if (statusAlert) {
            statusAlert.className = 'rsvp-status-alert success';
            statusAlert.innerHTML = `<strong>¡Confirmación Registrada Exitosamente! 💍</strong><br>Se ha guardado la confirmación de ${count} ${count === 1 ? 'persona' : 'personas'}.`;
            statusAlert.style.display = 'block';
          }
          setTimeout(() => {
            if (statusAlert) statusAlert.style.display = 'none';
            this.renderRsvpForm();
          }, 2000);
        }, 400);
      }

      if (btnText) btnText.style.display = 'inline';
      if (btnSpinner) btnSpinner.style.display = 'none';
      submitBtn.disabled = false;
    });
  }

  /* -------------------------------------------------------------
     PHOTO GALLERY LIGHTBOX
  ------------------------------------------------------------- */
  setupGalleryLightbox() {
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    if (!lightbox || !lightboxImg) return;

    document.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;

      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.getAttribute('data-caption') || img.alt || '';
        lightbox.classList.add('active');
      }
    });

    const closeLightbox = () => lightbox.classList.remove('active');
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightboxClose) closeLightbox();
    });
  }

  /* -------------------------------------------------------------
     AMBIENT ROMANTIC AUDIO PLAYER (assets/audio/track.mp3)
  ------------------------------------------------------------- */
  setupAmbientAudio() {
    const musicBtn = document.getElementById('floatingMusicBtn');
    if (!musicBtn) return;

    musicBtn.addEventListener('click', () => {
      if (this.isPlayingMusic) {
        this.pauseAmbientMusic();
      } else {
        this.playAmbientRomanticMusic();
      }
    });
  }

  getAudioElement() {
    if (!this.audio) {
      let src = this.data.music?.src || 'assets/audio/track.mp3';
      if (!src || src.includes('wedding-ambient.mp3')) {
        src = 'assets/audio/track.mp3';
      }
      this.audio = new Audio();
      this.audio.src = src;
      this.audio.loop = true;
      this.audio.volume = 0.75;
      this.audio.preload = 'auto';

      this.audio.addEventListener('error', (err) => {
        console.warn('Audio source error, switching to assets/audio/track.mp3 fallback', err);
        if (this.audio.src && !this.audio.src.endsWith('track.mp3')) {
          this.audio.src = 'assets/audio/track.mp3';
          this.audio.load();
          this.audio.play().catch(() => {});
        }
      });

      this.audio.addEventListener('play', () => {
        this.isPlayingMusic = true;
        this.updateMusicButtonState(true);
      });

      this.audio.addEventListener('pause', () => {
        this.isPlayingMusic = false;
        this.updateMusicButtonState(false);
      });

      this.audio.addEventListener('ended', () => {
        this.isPlayingMusic = false;
        this.updateMusicButtonState(false);
      });
    }
    return this.audio;
  }

  playAmbientRomanticMusic() {
    try {
      const audio = this.getAudioElement();
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPlayingMusic = true;
          this.updateMusicButtonState(true);
        }).catch(err => {
          console.log('Audio autoplay prevented or waiting for interaction', err);
        });
      }
    } catch (e) {
      console.log('Audio playback error', e);
    }
  }

  pauseAmbientMusic() {
    if (this.audio) {
      this.audio.pause();
      this.isPlayingMusic = false;
      this.updateMusicButtonState(false);
    }
  }

  updateMusicButtonState(isPlaying) {
    const btn = document.getElementById('floatingMusicBtn');
    if (!btn) return;
    if (isPlaying) {
      btn.classList.add('playing');
      btn.setAttribute('title', 'Pausar música');
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`;
    } else {
      btn.classList.remove('playing');
      btn.setAttribute('title', 'Reproducir música');
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v9"></path><path d="M19 12V3l-7 2v4"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`;
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }
}

// Self-executing initialization
function startApp() {
  const app = new WeddingApp();
  window.weddingAppInstance = app;
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
