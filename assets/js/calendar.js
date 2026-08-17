/**
 * Calendar Helper - Google Calendar & iCal Generator
 */

export function createGoogleCalendarUrl(event) {
  // Format: YYYYMMDDTHHMMSSZ (UTC) or local format
  // Wedding Date: Nov 28, 2026 15:30 Guatemala (UTC-6) -> 21:30 UTC
  // Ceremony + Reception: Nov 28 15:30 to Nov 29 03:00
  const startIso = '20261128T213000Z';
  const endIso = '20261129T090000Z';
  
  const title = encodeURIComponent('Boda José & Sandy 💍');
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

export function downloadIcsFile() {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Jose & Sandy//Wedding Invitation//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:boda-jose-sandy-20261128@invitacion.wedding',
    'DTSTAMP:20260101T000000Z',
    'DTSTART:20261128T213000Z',
    'DTEND:20261129T090000Z',
    'SUMMARY:Boda José & Sandy 💍',
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
  link.setAttribute('download', 'Boda-Jose-y-Sandy.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
