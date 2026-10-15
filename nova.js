/* 99 COMPUTERS: NOVA 2. Shared core (theme, storage, accounts, modals) + public site behaviour. */
(() => {
const CFG = Object.assign({ demo: true }, window.NOVA_CONFIG);
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ic = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.body.insertAdjacentHTML('afterbegin', '<div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div><svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="i-layout-dashboard" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1" /> <path d="M5 16h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1" /> <path d="M15 12h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1" /> <path d="M15 4h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1" /></g></symbol><symbol id="i-receipt-2" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2" /> <path d="M14 8h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5m2 0v1.5m0 -9v1.5" /></g></symbol><symbol id="i-users" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /> <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /> <path d="M16 3.13a4 4 0 0 1 0 7.75" /> <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></g></symbol><symbol id="i-chart-histogram" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18" /> <path d="M20 18v3" /> <path d="M16 16v5" /> <path d="M12 13v8" /> <path d="M8 16v5" /> <path d="M3 11c6 0 5 -5 9 -5s3 5 9 5" /></g></symbol><symbol id="i-mail" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" /> <path d="M3 7l9 6l9 -6" /></g></symbol><symbol id="i-package" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /> <path d="M12 12l8 -4.5" /> <path d="M12 12l0 9" /> <path d="M12 12l-8 -4.5" /> <path d="M16 5.25l-8 4.5" /></g></symbol><symbol id="i-settings" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" /> <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></g></symbol><symbol id="i-home" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l-2 0l9 -9l9 9l-2 0" /> <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /> <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></g></symbol><symbol id="i-bell" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" /> <path d="M9 17v1a3 3 0 0 0 6 0v-1" /></g></symbol><symbol id="i-search" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /> <path d="M21 21l-6 -6" /></g></symbol><symbol id="i-menu-2" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l16 0" /> <path d="M4 12l16 0" /> <path d="M4 18l16 0" /></g></symbol><symbol id="i-x" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6l-12 12" /> <path d="M6 6l12 12" /></g></symbol><symbol id="i-sun" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /> <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" /></g></symbol><symbol id="i-moon" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008" /></g></symbol><symbol id="i-device-cctv" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -2" /> <path d="M8 14a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /> <path d="M19 7v7a7 7 0 0 1 -14 0v-7" /> <path d="M12 14l.01 0" /></g></symbol><symbol id="i-device-laptop" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19l18 0" /> <path d="M5 7a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1l0 -8" /></g></symbol><symbol id="i-device-tv" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -9" /> <path d="M16 3l-4 4l-4 -4" /></g></symbol><symbol id="i-tool" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5" /></g></symbol><symbol id="i-bulb" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" /> <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" /> <path d="M9.7 17l4.6 0" /></g></symbol><symbol id="i-usb" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /> <path d="M12 17v-11.5" /> <path d="M7 10v3l5 3" /> <path d="M12 14.5l5 -2v-2.5" /> <path d="M16 10h2v-2h-2l0 2" /> <path d="M6 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /> <path d="M10 5.5h4l-2 -2.5l-2 2.5" /></g></symbol><symbol id="i-map-pin" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /> <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0" /></g></symbol><symbol id="i-phone" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /></g></symbol><symbol id="i-brand-whatsapp" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" /> <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" /></g></symbol><symbol id="i-arrow-up-right" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 7l-10 10" /> <path d="M8 7l9 0l0 9" /></g></symbol><symbol id="i-check" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10" /></g></symbol><symbol id="i-plus" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5l0 14" /> <path d="M5 12l14 0" /></g></symbol><symbol id="i-trash" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7l16 0" /> <path d="M10 11l0 6" /> <path d="M14 11l0 6" /> <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /> <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></g></symbol><symbol id="i-user-circle" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /> <path d="M9 10a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /> <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" /></g></symbol><symbol id="i-logout" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /> <path d="M9 12h12l-3 -3" /> <path d="M18 15l3 -3" /></g></symbol><symbol id="i-shield-check" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06" /> <path d="M15 19l2 2l4 -4" /></g></symbol><symbol id="i-coin" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /> <path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1" /> <path d="M12 7v10" /></g></symbol><symbol id="i-award" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" /> <path d="M12 15l3.4 5.89l1.598 -3.233l3.598 .232l-3.4 -5.889" /> <path d="M6.802 12l-3.4 5.89l3.598 -.233l1.598 3.232l3.4 -5.889" /></g></symbol><symbol id="i-heart-handshake" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /> <path d="M12 6l-3.293 3.293a1 1 0 0 0 0 1.414l.543 .543c.69 .69 1.81 .69 2.5 0l1 -1a3.182 3.182 0 0 1 4.5 0l2.25 2.25" /> <path d="M12.5 15.5l2 2" /> <path d="M15 13l2 2" /></g></symbol><symbol id="i-apps" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /> <path d="M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /> <path d="M14 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /> <path d="M14 7l6 0" /> <path d="M17 4l0 6" /></g></symbol><symbol id="i-eye" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /> <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></g></symbol><symbol id="i-eye-off" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /> <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /> <path d="M3 3l18 18" /></g></symbol><symbol id="i-clock" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /> <path d="M12 7v5l3 3" /></g></symbol><symbol id="i-send" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14l11 -11" /> <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" /></g></symbol><symbol id="i-download" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /> <path d="M7 11l5 5l5 -5" /> <path d="M12 4l0 12" /></g></symbol><symbol id="i-refresh" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /> <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></g></symbol><symbol id="i-minus" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l14 0" /></g></symbol><symbol id="i-chevron-down" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6l6 -6" /></g></symbol><symbol id="i-user-plus" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /> <path d="M16 19h6" /> <path d="M19 16v6" /> <path d="M6 21v-2a4 4 0 0 1 4 -4h4" /></g></symbol><symbol id="i-login" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /> <path d="M21 12h-13l3 -3" /> <path d="M11 15l-3 -3" /></g></symbol><symbol id="i-lock" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6" /> <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /> <path d="M8 11v-4a4 4 0 1 1 8 0v4" /></g></symbol><symbol id="i-device-speaker" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14" /> <path d="M9 14a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /> <path d="M12 7l0 .01" /></g></symbol><symbol id="i-ticket" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l0 2" /> <path d="M15 11l0 2" /> <path d="M15 17l0 2" /> <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2" /></g></symbol><symbol id="i-message-circle" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1" /></g></symbol><symbol id="i-device-desktop" viewBox="0 0 24 24"><g stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10" /> <path d="M7 20h10" /> <path d="M9 16v4" /> <path d="M15 16v4" /></g></symbol></svg>');

/* storage (swap for API calls when a server exists) */
const mem = {};
const DB = {
  get(k, d) { try { const v = localStorage.getItem('n99.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return k in mem ? mem[k] : d; } },
  set(k, v) { try { localStorage.setItem('n99.' + k, JSON.stringify(v)); } catch (e) { mem[k] = v; } }
};
const toast = m => { let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast glass'; t.setAttribute('role', 'status'); document.body.append(t); } t.textContent = m; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 2600); };

/* theme */
const root = document.documentElement, tt = $('#themeToggle');
if (tt) {
  const lab = () => tt.setAttribute('aria-label', root.dataset.theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  lab();
  tt.addEventListener('click', () => { const n = root.dataset.theme === 'light' ? 'dark' : 'light'; root.dataset.theme = n; try { localStorage.setItem('theme', n); } catch (e) {} const m = $('meta[name=theme-color]'); if (m) m.content = n === 'light' ? '#eaf1ff' : '#050b1a'; lab(); });
}

/* modal */
function modal(html, cls = '') {
  const el = document.createElement('div'); el.className = 'modal';
  el.innerHTML = `<div class="panel glass ${cls}" role="dialog" aria-modal="true">${html}</div>`; document.body.append(el);
  const prev = document.activeElement; let done = false, cb = null;
  const key = e => {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { const f = $$('button,input,select,textarea,a[href]', el).filter(x => !x.disabled && x.offsetParent); if (!f.length) return; const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  };
  function close() { if (done) return; done = true; el.classList.remove('on'); setTimeout(() => el.remove(), 400); document.removeEventListener('keydown', key); if (prev && prev.focus) prev.focus(); if (cb) cb(); }
  document.addEventListener('keydown', key);
  el.addEventListener('click', e => { if (e.target === el || e.target.closest('[data-close]')) close(); });
  requestAnimationFrame(() => { el.classList.add('on'); const f = $('input,select,textarea', el) || $('button', el); if (f) f.focus(); });
  return { el, close, on: fn => { cb = fn; } };
}

/* accounts: front-end demo. Passwords are salted + hashed (PBKDF2) before storing, but real accounts need a server. */
const b64 = b => btoa(String.fromCharCode(...new Uint8Array(b))), ub = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const Auth = {
  users: () => DB.get('users', []),
  current() { const id = DB.get('session', null); return this.users().find(u => u.id === id) || null; },
  async _h(pw, salt) {
    if (!(window.crypto && crypto.subtle)) throw Error('Accounts need a secure page. Open the site over https.');
    const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
    return b64(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: ub(salt), iterations: 150000 }, k, 256));
  },
  async signUp(d) {
    const us = this.users(), email = d.email.trim().toLowerCase();
    if (us.some(u => u.email === email)) { const e = Error('An account with this email already exists. Try signing in.'); e.field = 'email'; throw e; }
    const salt = b64(crypto.getRandomValues(new Uint8Array(16)));
    const u = { id: 'u' + Date.now().toString(36), name: d.name.trim(), email, phone: d.phone.replace(/\s/g, '').replace(/^0/, '+254').replace(/^254/, '+254'), salt, hash: await this._h(d.pw, salt), role: us.length ? 'customer' : 'owner', created: Date.now() };
    DB.set('users', [...us, u]); DB.set('session', u.id); this._e(); return u;
  },
  async signIn(email, pw) {
    const u = this.users().find(x => x.email === email.trim().toLowerCase());
    if (!u || await this._h(pw, u.salt) !== u.hash) { const e = Error('Email or password is incorrect.'); e.field = 'pw'; throw e; }
    DB.set('session', u.id); this._e(); return u;
  },
  signOut() { DB.set('session', null); this._e(); },
  update(id, patch) { DB.set('users', this.users().map(u => u.id === id ? { ...u, ...patch } : u)); this._e(); },
  _e() { document.dispatchEvent(new CustomEvent('auth')); }
};
const fld = (id, label, type, ac, ph = '') => `<div class="fld"><label for="f-${id}">${label}</label><input id="f-${id}" name="${id}" type="${type}" autocomplete="${ac}" placeholder="${ph}" required></div>`;
const strength = p => Math.min(4, (p.length >= 8) + (p.length >= 12) + (/[a-z]/.test(p) && /[A-Z]/.test(p)) + (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)));
const markBad = (f, id, msg) => { const el = f.elements[id], w = el.closest('.fld'); w.classList.add('err'); el.setAttribute('aria-invalid', 'true'); w.insertAdjacentHTML('beforeend', `<span class="ferr" role="alert">${msg}</span>`); };
const clearBad = f => { $$('.ferr', f).forEach(x => x.remove()); $$('.fld.err', f).forEach(x => x.classList.remove('err')); $$('[aria-invalid]', f).forEach(x => x.removeAttribute('aria-invalid')); };

function openAuth(mode = 'up', opt = {}) {
  return new Promise(res => {
    let user = null;
    const m = modal(`<button class="ib x-btn" data-close aria-label="Close">${ic('x')}</button><h2></h2><p class="sub2"></p><div class="seg" role="tablist"><i></i><button type="button" role="tab" data-t="up">Create account</button><button type="button" role="tab" data-t="in">Sign in</button></div><form novalidate></form>${CFG.demo ? '<p class="note">Demo mode: accounts are stored in this browser only until the site is connected to a server.</p>' : ''}`);
    m.on(() => res(user));
    const f = $('form', m.el), seg = $('.seg', m.el);
    const draw = t => {
      mode = t; seg.dataset.m = t; $$('[data-t]', seg).forEach(b => b.setAttribute('aria-selected', b.dataset.t === t));
      $('h2', m.el).textContent = t === 'up' ? 'Create your account' : 'Welcome back';
      $('.sub2', m.el).textContent = opt.reason || (t === 'up' ? 'Save your details and request services in a few taps.' : 'Sign in to continue.');
      f.innerHTML = (t === 'up' ? fld('name', 'Full name', 'text', 'name') + fld('email', 'Email', 'email', 'email') + fld('phone', 'Phone number', 'tel', 'tel', '0712 345 678') : fld('email', 'Email', 'email', 'email')) +
        `<div class="fld"><label for="f-pw">Password</label><input id="f-pw" name="pw" type="password" autocomplete="${t === 'up' ? 'new-password' : 'current-password'}" required><button class="eye" type="button" aria-label="Show password">${ic('eye')}</button>${t === 'up' ? '<div class="meter" data-s="0"><i></i><i></i><i></i><i></i></div><span class="hint">At least 8 characters. Longer, mixed passwords are stronger.</span>' : ''}</div>` +
        `<button class="btn p" style="width:100%;margin-top:6px" type="submit">${t === 'up' ? 'Create account' : 'Sign in'}</button>`;
      const i = $('input', f); if (i && !opt.noFocus) i.focus();
    };
    seg.addEventListener('click', e => { const b = e.target.closest('[data-t]'); if (b) draw(b.dataset.t); });
    f.addEventListener('input', e => { if (e.target.name === 'pw') { const mt = $('.meter', f); if (mt) mt.dataset.s = e.target.value ? Math.max(1, strength(e.target.value)) : 0; } });
    f.addEventListener('click', e => { const b = e.target.closest('.eye'); if (!b) return; const i = $('#f-pw', f), s = i.type === 'password'; i.type = s ? 'text' : 'password'; b.setAttribute('aria-label', s ? 'Hide password' : 'Show password'); b.innerHTML = ic(s ? 'eye-off' : 'eye'); });
    f.addEventListener('submit', async e => {
      e.preventDefault(); clearBad(f);
      const d = Object.fromEntries(new FormData(f)); let ok = true; const bad = (id, msg) => { ok = false; markBad(f, id, msg); };
      if (mode === 'up' && d.name.trim().length < 2) bad('name', 'Enter your full name');
      if (!/^\S+@\S+\.\S+$/.test(d.email.trim())) bad('email', 'Enter a valid email address');
      if (mode === 'up' && !/^(\+?254|0)[17]\d{8}$/.test(d.phone.replace(/\s/g, ''))) bad('phone', 'Enter a Kenyan mobile number, like 0712 345 678');
      if (d.pw.length < (mode === 'up' ? 8 : 1)) bad('pw', mode === 'up' ? 'Use at least 8 characters' : 'Enter your password');
      if (!ok) { $('.fld.err input', f).focus(); return; }
      const btn = $('button[type=submit]', f), lbl = btn.textContent; btn.disabled = true; btn.textContent = 'One moment';
      try { user = mode === 'up' ? await Auth.signUp(d) : await Auth.signIn(d.email, d.pw); m.close(); toast(`${mode === 'up' ? 'Welcome' : 'Welcome back'}, ${user.name.split(' ')[0]}`); }
      catch (err) { btn.disabled = false; btn.textContent = lbl; bad(err.field && f.elements[err.field] ? err.field : 'pw', err.message); }
    });
    draw(mode);
  });
}

/* account chip (nav) */
function mountAcct(host, where) {
  const draw = () => {
    const u = Auth.current();
    if (!u) { host.innerHTML = `<button class="acct out" id="acBtn" type="button">${ic('user-circle')}<span class="tx">Sign in</span></button>`; return; }
    const ini = u.name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
    host.innerHTML = `<button class="acct" id="acBtn" type="button" aria-haspopup="true" aria-expanded="false"><span class="tx">${esc(u.name.split(' ')[0])}</span><span class="av">${esc(ini)}</span></button>
    <div class="dd glass" id="dd"><div class="who"><b>${esc(u.name)}</b><small>${esc(u.email)}</small><span class="role">${esc(u.role)}</span></div>
    ${where === 'site' ? `<button type="button" data-act="request">${ic('send')}Request a service</button>${u.role !== 'customer' ? `<a href="console.html">${ic('layout-dashboard')}Staff console</a>` : ''}` : `<a href="index.html">${ic('home')}Back to site</a>`}
    <button type="button" data-act="signout">${ic('logout')}Sign out</button></div>`;
  };
  draw(); document.addEventListener('auth', draw);
  host.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'acBtn') { if (!Auth.current()) openAuth('in'); else { const dd = $('#dd'), on = dd.classList.toggle('on'); b.setAttribute('aria-expanded', on); } }
    else if (b.dataset.act === 'signout') { Auth.signOut(); toast('Signed out'); }
  });
  document.addEventListener('click', e => { const dd = $('#dd'); if (dd && !host.contains(e.target)) { dd.classList.remove('on'); $('#acBtn').setAttribute('aria-expanded', 'false'); } });
}

/* service request -> ticket (shared with the console) */
const SERVICES = ['IT Consultancy', 'Computer Sales', 'Electronics and Home Appliances', 'CCTV Installation', 'IT Support', 'Electronics Accessories'];
const BRANCHES = ["Murang'a", 'Nairobi CBD', 'Kerugoya'];
async function openRequest() {
  let u = Auth.current();
  if (!u) { u = await openAuth('up', { reason: 'Create an account to send a service request.' }); if (!u) return; }
  const m = modal(`<button class="ib x-btn" data-close aria-label="Close">${ic('x')}</button><h2>Request a service</h2><p class="sub2">Tell us what you need and which branch suits you.</p>
  <form novalidate><div class="row2"><div class="fld"><label for="r-s">Service</label><select id="r-s" name="service">${SERVICES.map(s => `<option>${s}</option>`).join('')}</select></div><div class="fld"><label for="r-b">Branch</label><select id="r-b" name="branch">${BRANCHES.map(s => `<option>${s}</option>`).join('')}</select></div></div>
  <div class="fld"><label for="r-m">Details</label><textarea id="r-m" name="msg" placeholder="For example: 4 cameras for a shop in Kerugoya, with installation."></textarea></div>
  <button class="btn p" style="width:100%" type="submit">Send request</button></form>${CFG.demo ? '<p class="note">Demo mode: requests are saved in this browser and appear in the staff console. Connect a server to receive them for real.</p>' : ''}`);
  const f = $('form', m.el);
  f.addEventListener('submit', e => {
    e.preventDefault(); clearBad(f);
    const d = Object.fromEntries(new FormData(f)); if (d.msg.trim().length < 10) { markBad(f, 'msg', 'Add a few details (at least 10 characters)'); f.elements.msg.focus(); return; }
    const ts = DB.get('tickets', []), id = 'T-' + (1000 + ts.length + 1);
    DB.set('tickets', [{ id, userId: u.id, name: u.name, email: u.email, phone: u.phone, service: d.service, branch: d.branch, status: 'Open', created: Date.now(), thread: [{ from: u.name, me: false, text: d.msg.trim(), at: Date.now() }] }, ...ts]);
    $('.panel', m.el).innerHTML = `<div style="text-align:center;padding:12px 0"><div class="ok-ic">${ic('check')}</div><h2>Request sent</h2><p class="sub2">Your reference is <b>${id}</b>. We will reach you on ${esc(u.phone)}.</p><button class="btn p" data-close type="button">Done</button></div>`;
  });
}
document.addEventListener('click', e => { const a = e.target.closest('[data-act]'); if (!a) return; if (a.dataset.act === 'signup') openAuth('up'); if (a.dataset.act === 'request') openRequest(); });
window.N = { esc, $, $$, ic, DB, Auth, modal, toast, openAuth, SERVICES, BRANCHES, reduce };
const ac = $('#acwrap'); if (ac) mountAcct(ac, document.body.dataset.page === 'site' ? 'site' : 'console');

/* ===================== SITE ===================== */
if (document.body.dataset.page === 'site') {
  /* words */
  $$('[data-words]').forEach(h => { h.setAttribute('aria-label', h.textContent); h.innerHTML = h.textContent.split(' ').map((w, i) => `<span class="w" aria-hidden="true" style="--i:${i}">${w}</span>`).join(' '); });
  $('#yr').textContent = new Date().getFullYear();

  /* nav: scroll state, progress, spy, sliding pill, sheet */
  const nav = $('.nav'), links = $('.links'), pill = $('.pill'), as = $$('a', links);
  const pillTo = a => { if (!a) { links.style.setProperty('--o', 0); return; } links.style.setProperty('--x', a.offsetLeft + 'px'); links.style.setProperty('--w', a.offsetWidth + 'px'); links.style.setProperty('--o', 1); };
  let tick = false;
  const onScroll = () => { tick = false; nav.classList.toggle('s', scrollY > 20); nav.style.setProperty('--p', Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))); };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true }); onScroll();
  as.forEach(a => { a.addEventListener('pointerenter', () => pillTo(a)); a.addEventListener('focus', () => pillTo(a)); });
  links.addEventListener('pointerleave', () => pillTo($('.on', links)));
  $$('main section[id]').forEach(sc => new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { as.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + sc.id)); pillTo($('.on', links)); } }), { rootMargin: '-45% 0px -50% 0px' }).observe(sc));
  const sheet = $('#sheet'), mb = $('#menuBtn');
  const setMenu = o => { sheet.classList.toggle('on', o); mb.setAttribute('aria-expanded', o); mb.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); mb.innerHTML = ic(o ? 'x' : 'menu-2'); };
  mb.addEventListener('click', e => { e.stopPropagation(); setMenu(!sheet.classList.contains('on')); });
  document.addEventListener('click', e => { if (!sheet.contains(e.target) && !mb.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));
  $$('[data-scroll]').forEach(a => a.addEventListener('click', e => { const t = $(a.getAttribute('href')); if (!t) return; e.preventDefault(); setMenu(false); scrollTo({ top: t.getBoundingClientRect().top + scrollY - 84, behavior: reduce ? 'auto' : 'smooth' }); }));

  /* branches */
  const CAMS = [
    { n: "Murang'a", sub: 'Main branch', url: 'https://maps.app.goo.gl/FHAN5yE1pPPzXfvG9?g_st=iwb' },
    { n: 'Nairobi CBD', sub: 'Superior Towers, Moi Avenue', url: 'https://www.google.com/maps/search/?api=1&query=Superior+Towers+Moi+Avenue+Nairobi' },
    { n: 'Kerugoya', sub: 'Kerugoya Town, Kirinyaga', url: 'https://www.google.com/maps/search/?api=1&query=Kerugoya+Town+Kirinyaga' }
  ];
  const isOpen = () => { const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()); const g = t => p.find(x => x.type === t).value; const h = +g('hour') + +g('minute') / 60; return g('weekday') !== 'Sun' && h >= 8 && h < 18; };
  const open = isOpen();
  $('#brows').innerHTML = CAMS.map(c => `<a class="brow" href="${c.url}" target="_blank" rel="noopener"><span class="dot ${open ? 'on' : ''}"></span><span><b>${c.n}</b><small>${c.sub}</small></span>${ic('arrow-up-right')}</a>`).join('');
  $$('[data-open]').forEach(e => e.textContent = open ? 'Open now' : 'Closed now');
  $$('.dot[data-st]').forEach(d => d.classList.toggle('on', open));

  /* hero parallax (fine pointers, wide screens only) */
  const cl = $('.cluster');
  if (matchMedia('(hover: hover) and (min-width: 1101px)').matches && !reduce) {
    const items = $$('.cl', cl);
    document.addEventListener('pointermove', e => { const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5; items.forEach(c => { const d = +c.dataset.d || 1; c.style.setProperty('--tx', x * 26 * d + 'px'); c.style.setProperty('--ty', y * 20 * d + 'px'); }); });
  }
  /* sheen follows pointer */
  document.addEventListener('pointermove', e => { const g = e.target.closest && e.target.closest('.glass'); if (!g) return; const r = g.getBoundingClientRect(); g.style.setProperty('--mx', e.clientX - r.left + 'px'); g.style.setProperty('--my', e.clientY - r.top + 'px'); }, { passive: true });

  /* data */
  const S = [
    ['IT Consultancy', 'Professional technology advice and solutions for individuals and businesses.', 'bulb', 'var(--blue)'],
    ['Computer Sales', 'Quality laptops, desktops, and computer accessories.', 'device-laptop', 'var(--teal)'],
    ['Electronics and Home Appliances', 'Televisions, smartphones, washing machines, radios, and other electronic products.', 'device-tv', 'var(--sig)'],
    ['CCTV Installation', 'Installation and setup of surveillance cameras for homes, offices, shops, and businesses.', 'device-cctv', 'var(--teal)'],
    ['IT Support', 'Assistance with computer setup, configuration, troubleshooting, maintenance, repair, and other technology needs.', 'tool', 'var(--sig)'],
    ['Electronics Accessories', 'A variety of accessories and supporting equipment for everyday technology use.', 'usb', 'var(--blue)']
  ];
  $('#svc').innerHTML = S.map((s, i) => `<article class="glass hv svc rv" style="--h:${s[3]};--d:${i * .07}s"><span class="ico">${ic(s[2])}</span><h3>${s[0]}</h3><p>${s[1]}</p></article>`).join('');
  const P = [
    ['Laptops', 'Laptops', 'Business, student, and everyday laptops from trusted brands.', 'images/3.jpeg', 'Laptop'],
    ['Desktops', 'Desktop Computers', 'Complete desktop systems, towers, and all-in-ones.', 'images/4.jpeg', 'Desktop computer'],
    ['Televisions', 'Televisions', 'Smart TVs, LED screens, and home entertainment displays.', 'images/5.jpeg', 'Television'],
    ['CCTV', 'CCTV & Security', 'Cameras, DVRs, and complete surveillance kits for any property.', 'images/6.jpeg', 'CCTV camera'],
    ['Sound', 'Sound Systems', 'Speakers, subwoofers, amplifiers, and home audio setups.', 'images/7.jpeg', 'Sound system'],
    ['Accessories', 'Accessories', 'Keyboards, mice, chargers, cables, and everyday essentials.', 'images/8.jpeg', 'Accessories']
  ];
  $('#prod').innerHTML = P.map((p, i) => `<figure class="glass hv prod rv" style="--d:${i * .07}s"><div class="slot sh"><span class="chip">${p[0]}</span><img src="${p[3]}" alt="${p[4]}" loading="lazy" decoding="async" width="480" height="320"></div><figcaption class="meta"><strong>${p[1]}</strong><small>${p[2]}</small></figcaption></figure>`).join('');
  $$('.sh img, .fig img, .mos img').forEach(im => {
    const w = im.closest('.sh, .fig, .ph'), ok = () => { w.classList.add('loaded'); w.classList.remove('sh'); }, bad = () => { w.classList.add('failed'); w.classList.remove('sh'); };
    if (im.complete && im.naturalWidth) ok(); else if (im.complete) bad(); else { im.addEventListener('load', ok, { once: true }); im.addEventListener('error', bad, { once: true }); }
  });

  /* counters + reveal */
  const count = el => { const n = +el.dataset.n; if (reduce) { el.textContent = n; return; } const t0 = performance.now(); const f = t => { const k = Math.min(1, (t - t0) / 1300); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 4))); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); $$('[data-n]', e.target).forEach(count); if (e.target.dataset.n) count(e.target); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
  $$('.rv').forEach(el => io.observe(el));
  setTimeout(() => $$('.rv').forEach(e => e.classList.add('in')), 3500);
}

if (document.body.dataset.page === 'site') {
(function injectSEO() {
  const siteUrl = "https://www.99computers.co.ke";
  const PHONE = "+254794707522";
  const WHATSAPP = "+254794707522";
  const EMAIL = "info@99computers.co.ke";

  const branches = [
    {
      city: "Murang'a",
      region: "Murang'a County",
      name: "99 COMPUTERS — Murang'a (Main Branch)",
      mapUrl: "https://maps.app.goo.gl/FHAN5yE1pPPzXfvG9"
    },
    {
      city: "Nairobi",
      region: "Nairobi County",
      name: "99 COMPUTERS — Nairobi CBD",
      street: "Superior Towers, Moi Avenue",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Superior+Towers+Moi+Avenue+Nairobi"
    },
    {
      city: "Kerugoya",
      region: "Kirinyaga County",
      name: "99 COMPUTERS — Kerugoya",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Kerugoya+Town+Kirinyaga"
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": siteUrl + "/#organization",
        "name": "99 COMPUTERS",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": siteUrl + "/images/1.jpeg"
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": PHONE,
            "contactType": "customer service",
            "areaServed": "KE",
            "availableLanguage": ["English", "Swahili"]
          },
          {
            "@type": "ContactPoint",
            "telephone": WHATSAPP,
            "contactType": "WhatsApp customer support",
            "areaServed": "KE"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": siteUrl + "/#website",
        "url": siteUrl,
        "name": "99 COMPUTERS",
        "publisher": { "@id": siteUrl + "/#organization" },
        "inLanguage": "en-KE"
      },
      ...branches.map((b, i) => ({
        "@type": "LocalBusiness",
        "@id": siteUrl + "/#branch-" + i,
        "name": b.name,
        "parentOrganization": { "@id": siteUrl + "/#organization" },
        "description": "IT consultancy, computer and laptop sales, electronics, repair and support, and professional CCTV installation.",
        "url": siteUrl,
        "image": siteUrl + "/images/1.jpeg",
        "telephone": PHONE,
        "email": EMAIL,
        "priceRange": "KSh",
        "currenciesAccepted": "KES",
        "paymentAccepted": "Cash, M-Pesa, Card",
        "areaServed": { "@type": "Country", "name": "Kenya" },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "KE",
          "addressLocality": b.city,
          "addressRegion": b.region,
          ...(b.street ? { "streetAddress": b.street } : {})
        },
        "hasMap": b.mapUrl,
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            "opens": "08:00",
            "closes": "18:00"
          }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Products & Services",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "IT Consultancy" } },
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Laptops & Desktop Computers" } },
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Televisions & Electronics" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "CCTV Installation" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "IT Support & Repair" } },
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Electronics Accessories" } }
          ]
        }
      }))
    ]
  };

  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(schema);
  document.head.appendChild(s);
})();
}
})();
