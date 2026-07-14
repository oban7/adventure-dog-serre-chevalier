/* =========================================================
   Adventure Dog – Serre-Chevalier
   Google Apps Script à coller dans Extensions > Apps Script
   depuis le Google Sheet de réception des réservations.
   ========================================================= */

const SHEET_NAME = 'Réservations';
const OWNER_EMAIL = 'contact@adventure-dog-serrechevalier.fr';

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const sheet = getOrCreateSheet_();
    appendReservation_(sheet, payload);
    sendOwnerNotification_(payload);
    sendClientConfirmation_(payload);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Aucune donnée reçue.');
  }
  return JSON.parse(e.postData.contents);
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Date envoi',
      'Nom',
      'Email',
      'Téléphone',
      'Chien',
      'Profil',
      'Prestation',
      'Date souhaitée',
      'Deuxième chien',
      'Message',
      'Source'
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function appendReservation_(sheet, data) {
  sheet.appendRow([
    data.dateEnvoi || new Date().toISOString(),
    data.nom || '',
    data.email || '',
    data.telephone || '',
    data.chien || '',
    data.profil || '',
    data.prestation || '',
    data.date || '',
    data.deuxiemeChien || '',
    data.message || '',
    data.source || 'Site web'
  ]);
}

function sendOwnerNotification_(data) {
  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: 'Nouvelle demande de réservation Adventure Dog',
    htmlBody: buildOwnerHtml_(data),
    replyTo: data.email || OWNER_EMAIL
  });
}

function sendClientConfirmation_(data) {
  if (!data.email) return;
  MailApp.sendEmail({
    to: data.email,
    subject: 'Votre demande Adventure Dog – Serre-Chevalier a bien été reçue',
    htmlBody: buildClientHtml_(data)
  });
}

function buildOwnerHtml_(data) {
  return `
    <h2>Nouvelle demande Adventure Dog</h2>
    <p><strong>Nom :</strong> ${escapeHtml_(data.nom)}</p>
    <p><strong>Email :</strong> ${escapeHtml_(data.email)}</p>
    <p><strong>Téléphone :</strong> ${escapeHtml_(data.telephone)}</p>
    <p><strong>Chien :</strong> ${escapeHtml_(data.chien)}</p>
    <p><strong>Profil :</strong> ${escapeHtml_(data.profil)}</p>
    <p><strong>Prestation :</strong> ${escapeHtml_(data.prestation)}</p>
    <p><strong>Date souhaitée :</strong> ${escapeHtml_(data.date)}</p>
    <p><strong>Deuxième chien :</strong> ${escapeHtml_(data.deuxiemeChien)}</p>
    <p><strong>Message :</strong><br>${escapeHtml_(data.message).replace(/\n/g, '<br>')}</p>
  `;
}

function buildClientHtml_(data) {
  return `
    <h2>Demande bien reçue</h2>
    <p>Bonjour ${escapeHtml_(data.nom)},</p>
    <p>Votre demande de réservation pour <strong>${escapeHtml_(data.chien)}</strong> a bien été reçue.</p>
    <p>Prestation demandée : <strong>${escapeHtml_(data.prestation)}</strong><br>
    Date souhaitée : <strong>${escapeHtml_(data.date)}</strong></p>
    <p>Vous recevrez une réponse rapidement pour confirmer les disponibilités, les modalités et l'adaptation de la sortie au profil de votre chien.</p>
    <p>Adventure Dog – Serre-Chevalier</p>
  `;
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
