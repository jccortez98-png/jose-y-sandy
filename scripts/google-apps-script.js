/**
 * =========================================================================
 * GOOGLE APPS SCRIPT: RECEPTOR DE CONFIRMACIONES (RSVP) A GOOGLE SHEETS
 * Boda José & Sandy
 * =========================================================================
 * 
 * INSTRUCCIONES DE INSTALACIÓN (Toma menos de 2 minutos):
 * 
 * 1. Ve a https://sheets.google.com y crea una hoja de cálculo nueva (ej. "Confirmaciones Boda José & Sandy").
 * 2. En la primera fila (Fila 1), coloca los siguientes encabezados:
 *    A1: Fecha / Hora
 *    B1: Nombre del Asistente
 *    C1: Asistencia (Ceremonia / Recepción / Ambas / No Asiste)
 *    D1: Pases Totales
 *    E1: Número de Pase
 *    F1: Mensaje o Restricción Alimentaria
 * 
 * 3. En el menú superior de Google Sheets, ve a:
 *    Extensiones -> Apps Script
 * 
 * 4. Borra todo el código que aparece y PEGA TODO ESTE ARCHIVO.
 * 
 * 5. Haz clic en "Implementar" (botón azul arriba a la derecha) -> "Nueva implementación".
 * 6. En el engranaje ⚙️ de la izquierda, selecciona tipo: "Aplicación web".
 * 7. Configura lo siguiente:
 *    - Descripción: Receptor RSVP Boda
 *    - Ejecutar como: "Yo" (tu cuenta de correo)
 *    - Quién tiene acceso: "Cualquier persona" (Anyone) -> ¡IMPORTANTE para recibir envíos!
 * 8. Haz clic en "Implementar" y autoriza los permisos si te los solicita.
 * 9. COPIA LA URL DE LA APLICACIÓN WEB que termina en "/exec"
 *    (Ejemplo: https://script.google.com/macros/s/AKfycbx.../exec)
 * 10. Pega esa URL en el Panel de Administración (admin.html) en el campo "Webhook de Google Sheets".
 * 
 * ¡Listo! Cada confirmación llenará tu hoja en tiempo real.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var timestamp = new Date();
    var totalPasses = data.totalPasses || (data.attendees ? data.attendees.length : 1);
    var message = data.message || '';

    // Si viene un arreglo de asistentes (formulario multi-pase)
    if (data.attendees && Array.isArray(data.attendees)) {
      data.attendees.forEach(function(attendee, index) {
        sheet.appendRow([
          timestamp,
          attendee.name || 'Sin nombre',
          attendee.attendance || 'No especificado',
          totalPasses,
          'Invitado ' + (index + 1) + ' de ' + totalPasses,
          message
        ]);
      });
    } else {
      // Envío individual estándar
      sheet.appendRow([
        timestamp,
        data.name || 'Sin nombre',
        data.attendance || 'No especificado',
        totalPasses,
        '1 de 1',
        message
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Confirmación registrada exitosamente' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'active', message: 'El Webhook de RSVP para Google Sheets está funcionando correctamente.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
