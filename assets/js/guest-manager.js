/**
 * Guest Manager & Bulk URL Generator for Wedding Invitation
 */

const DEFAULT_GUESTS = [
  
];

class GuestManager {
  constructor() {
    this.guests = [...DEFAULT_GUESTS];
    this.baseUrl = window.location.origin + window.location.pathname.replace('guest-manager.html', 'index.html');
    this.messageTemplate = `¡Hola {nombre}! 💌 Nos llena de felicidad invitarte a nuestra boda.\n\nHemos preparado esta invitación digital especialmente para ti:\n{enlace}\n\n💍 Pases asignados: {pases}\n\n¡Esperamos contar con tu compañía para celebrar nuestro gran día!`;
    
    this.init();
  }

  init() {
    this.bindDomElements();
    this.setupEventListeners();
    this.render();
  }

  bindDomElements() {
    this.baseUrlInput = document.getElementById('baseUrlInput');
    this.msgTemplateInput = document.getElementById('msgTemplateInput');
    this.guestTableBody = document.getElementById('guestTableBody');
    this.totalInvitationsStat = document.getElementById('totalInvitationsStat');
    this.totalPassesStat = document.getElementById('totalPassesStat');
    this.totalTablesStat = document.getElementById('totalTablesStat');
    this.searchInput = document.getElementById('searchGuestInput');
    this.pasteTextarea = document.getElementById('pasteGuestsTextarea');
    this.csvFileInput = document.getElementById('csvFileInput');
    this.toast = document.getElementById('adminToast');

    if (this.baseUrlInput) {
      this.baseUrlInput.value = this.baseUrl;
    }
    if (this.msgTemplateInput) {
      this.msgTemplateInput.value = this.messageTemplate;
    }
  }

  setupEventListeners() {
    if (this.baseUrlInput) {
      this.baseUrlInput.addEventListener('input', (e) => {
        this.baseUrl = e.target.value.trim() || window.location.href.replace('guest-manager.html', 'index.html');
        this.render();
      });
    }

    if (this.msgTemplateInput) {
      this.msgTemplateInput.addEventListener('input', (e) => {
        this.messageTemplate = e.target.value;
        this.render();
      });
    }

    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.render());
    }

    const btnProcessPaste = document.getElementById('btnProcessPaste');
    if (btnProcessPaste) {
      btnProcessPaste.addEventListener('click', () => this.handlePasteProcessing());
    }

    const btnLoadExample = document.getElementById('btnLoadExample');
    if (btnLoadExample) {
      btnLoadExample.addEventListener('click', () => {
        this.guests = [...DEFAULT_GUESTS];
        this.render();
        this.showToast('✅ Lista de ejemplo cargada.');
      });
    }

    const btnAddSingleGuest = document.getElementById('btnAddSingleGuest');
    if (btnAddSingleGuest) {
      btnAddSingleGuest.addEventListener('click', () => this.handleAddSingleGuest());
    }

    const btnCopyAllLinks = document.getElementById('btnCopyAllLinks');
    if (btnCopyAllLinks) {
      btnCopyAllLinks.addEventListener('click', () => this.copyAllLinks());
    }

    const btnExportCsv = document.getElementById('btnExportCsv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => this.exportCsv());
    }

    if (this.csvFileInput) {
      this.csvFileInput.addEventListener('change', (e) => this.handleFileUpload(e));
    }
  }

  generateGuestUrl(guest) {
    const params = new URLSearchParams();
    params.set('pases', guest.passes || '2');

    const separator = this.baseUrl.includes('?') ? '&' : '?';
    return `${this.baseUrl}${separator}${params.toString()}`;
  }

  generateWhatsAppMessage(guest) {
    const link = this.generateGuestUrl(guest);
    return this.messageTemplate
      .replace(/{nombre}/g, guest.name)
      .replace(/{pases}/g, guest.passes || '2')
      .replace(/{enlace}/g, link)
      .replace(/{mesa}/g, guest.table || '');
  }

  generateWhatsAppLink(guest) {
    const msg = this.generateWhatsAppMessage(guest);
    const phone = (guest.phone || '').replace(/[^0-9]/g, '');
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  render() {
    const query = (this.searchInput?.value || '').toLowerCase();
    const filteredGuests = this.guests.filter(g => g.name.toLowerCase().includes(query) || (g.table && g.table.includes(query)));

    // Update Stats
    const totalInvitations = this.guests.length;
    const totalPasses = this.guests.reduce((acc, g) => acc + (parseInt(g.passes, 10) || 0), 0);
    const uniqueTables = new Set(this.guests.map(g => g.table).filter(Boolean)).size;

    if (this.totalInvitationsStat) this.totalInvitationsStat.textContent = totalInvitations;
    if (this.totalPassesStat) this.totalPassesStat.textContent = totalPasses;
    if (this.totalTablesStat) this.totalTablesStat.textContent = uniqueTables;

    // Render Table Rows
    if (!this.guestTableBody) return;
    this.guestTableBody.innerHTML = '';

    if (filteredGuests.length === 0) {
      this.guestTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 28px; color: #94A3B8;">No se encontraron invitados. Carga una lista o agrega nuevos invitados.</td></tr>`;
      return;
    }

    filteredGuests.forEach((guest, index) => {
      const url = this.generateGuestUrl(guest);
      const waUrl = this.generateWhatsAppLink(guest);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 500; color: #64748B;">${index + 1}</td>
        <td class="guest-name-cell">${this.escapeHtml(guest.name)}</td>
        <td><span class="passes-badge">${guest.passes || 2} ${guest.passes == 1 ? 'pase' : 'pases'}</span></td>
        <td>${guest.table ? 'Mesa ' + this.escapeHtml(guest.table) : '<span style="color:#94A3B8;">-</span>'}</td>
        <td>${guest.phone ? this.escapeHtml(guest.phone) : '<span style="color:#94A3B8;">-</span>'}</td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn-action-copy" data-url="${url}" title="Copiar enlace"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;display:inline-block;vertical-align:middle;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copiar Link</button>
          ${guest.phone ? `<a href="${waUrl}" target="_blank" class="btn-action-wa" title="Enviar por WhatsApp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;display:inline-block;vertical-align:middle;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> WhatsApp</a>` : ''}
          <a href="${url}" target="_blank" class="btn-action-preview" title="Probar invitación">Ver ↗</a>
        </td>
      `;

      const copyBtn = tr.querySelector('.btn-action-copy');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          this.copyToClipboard(url, `Enlace de ${guest.name} copiado al portapapeles`);
        });
      }

      this.guestTableBody.appendChild(tr);
    });
  }

  handlePasteProcessing() {
    const rawText = this.pasteTextarea?.value || '';
    if (!rawText.trim()) {
      this.showToast('⚠️ Pega primero los datos de tu lista de Excel o texto.');
      return;
    }

    const lines = rawText.trim().split('\n');
    const newGuests = [];

    lines.forEach(line => {
      if (!line.trim()) return;
      // Split by tab (Excel copy) or comma or semicolon
      const parts = line.includes('\t') ? line.split('\t') : (line.includes(';') ? line.split(';') : line.split(','));
      
      const name = parts[0]?.trim();
      if (!name || name.toLowerCase() === 'nombre' || name.toLowerCase() === 'invitado') return;

      const passes = parts[1]?.trim() ? parseInt(parts[1].trim(), 10) || 2 : 2;
      const phone = parts[2]?.trim() || '';
      const table = parts[3]?.trim() || '';

      newGuests.push({ name, passes, phone, table });
    });

    if (newGuests.length > 0) {
      this.guests = newGuests;
      this.render();
      this.showToast(`🎉 ¡${newGuests.length} invitados procesados con éxito!`);
      if (this.pasteTextarea) this.pasteTextarea.value = '';
    } else {
      this.showToast('⚠️ No se pudieron reconocer filas válidas.');
    }
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (this.pasteTextarea) this.pasteTextarea.value = text;
      this.handlePasteProcessing();
    };
    reader.readAsText(file, 'UTF-8');
  }

  handleAddSingleGuest() {
    const name = prompt('Nombre del Invitado o Familia:');
    if (!name || !name.trim()) return;

    const passesStr = prompt('Número de pases asignados:', '2');
    const passes = parseInt(passesStr, 10) || 2;
    const phone = prompt('Teléfono WhatsApp (ej. +50255551234):', '');
    const table = prompt('Mesa asignada (opcional):', '');

    this.guests.push({
      name: name.trim(),
      passes,
      phone: phone ? phone.trim() : '',
      table: table ? table.trim() : ''
    });

    this.render();
    this.showToast(`✅ Invitado '${name}' agregado.`);
  }

  copyAllLinks() {
    if (this.guests.length === 0) {
      this.showToast('⚠️ No hay invitados en la lista.');
      return;
    }

    const textList = this.guests.map(g => {
      const url = this.generateGuestUrl(g);
      return `${g.name} (${g.passes} pases): ${url}`;
    }).join('\n');

    this.copyToClipboard(textList, `📋 ${this.guests.length} enlaces copiados al portapapeles`);
  }

  exportCsv() {
    if (this.guests.length === 0) {
      this.showToast('⚠️ No hay invitados para exportar.');
      return;
    }

    const headers = ['Nombre', 'Pases', 'Telefono', 'Mesa', 'Enlace_Personalizado', 'Enlace_WhatsApp', 'Mensaje_WhatsApp'];
    const rows = this.guests.map(g => {
      const url = this.generateGuestUrl(g);
      const waUrl = this.generateWhatsAppLink(g);
      const msg = this.generateWhatsAppMessage(g).replace(/\n/g, ' ');

      return [
        `"${g.name.replace(/"/g, '""')}"`,
        g.passes || 2,
        `"${(g.phone || '').replace(/"/g, '""')}"`,
        `"${(g.table || '').replace(/"/g, '""')}"`,
        `"${url}"`,
        `"${waUrl}"`,
        `"${msg.replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Invitaciones_Boda_Jose_y_Sandy_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast('📥 Archivo CSV descargado con éxito.');
  }

  async copyToClipboard(text, successMsg) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      this.showToast(successMsg);
    } catch (e) {
      this.showToast('❌ Error al copiar al portapapeles');
    }
  }

  showToast(msg) {
    if (!this.toast) return;
    this.toast.textContent = msg;
    this.toast.classList.add('show');
    setTimeout(() => this.toast.classList.remove('show'), 2600);
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new GuestManager();
});
