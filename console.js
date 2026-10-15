/* 99 COMPUTERS: staff console. Demo data lives in this browser (localStorage). Replace get/set with API calls when a server exists. */
(() => {
const { $, $$, ic, DB, Auth, modal, toast, openAuth, esc, BRANCHES, SERVICES } = window.N;
const get = k => DB.get(k, []), set = (k, v) => DB.set(k, v);
const kes = n => 'KSh ' + Number(n).toLocaleString('en-KE'), D = 864e5, now = Date.now();
const ago = t => { const m = (Date.now() - t) / 6e4; return m < 60 ? Math.max(1, m | 0) + ' min ago' : m < 1440 ? (m / 60 | 0) + ' h ago' : (m / 1440 | 0) + ' d ago'; };
const ramp = t => { const S = [[59, 116, 255], [34, 211, 197], [255, 122, 61]], k = Math.min(.999, Math.max(0, t)) * 2, i = k | 0, f = k - i, a = S[i], b = S[i + 1]; return `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * f)).join(',')})`; };
const HUE = ['var(--blue)', 'var(--teal)', 'var(--sig)'];

/* seed (sample data, clearly marked in the UI) */
const SEED = () => {
  const o = (id, customer, item, branch, amount, pay, status, d) => ({ id, customer, item, branch, amount, pay, status, date: now - d * D });
  set('orders', [o('85743', 'Wanjiru M.', '4-channel CCTV install', 'Kerugoya', 34999, 'Due', 'Pending', .4), o('97245', 'Brian O.', 'Laptop screen replacement', 'Nairobi CBD', 8500, 'Refunded', 'Declined', 1), o('36452', 'Kamau & Sons', 'Office network setup', 'Nairobi CBD', 42000, 'Paid', 'Active', 1.2), o('41208', 'Grace N.', 'Desktop upgrade (SSD + RAM)', "Murang'a", 12999, 'Paid', 'Completed', 2), o('52981', 'Peter K.', '55" TV wall mount and setup', "Murang'a", 4500, 'Due', 'Pending', 2.3), o('61877', 'Mercy W.', 'Printer and toner supply', 'Kerugoya', 18900, 'Paid', 'Completed', 3), o('72310', 'Daniel M.', '8-channel CCTV kit', 'Nairobi CBD', 69000, 'Paid', 'Active', 4), o('80655', 'Esther A.', 'Business laptop 15.6"', "Murang'a", 54999, 'Paid', 'Completed', 5)]);
  const s = (sku, name, cat, qty, min, price) => ({ sku, name, cat, qty, min, price });
  set('stock', [s('CCTV-4', '4-channel CCTV kit', 'CCTV', 12, 5, 34999), s('CCTV-8', '8-channel CCTV kit', 'CCTV', 4, 5, 69000), s('LAP-15', 'Business laptop 15.6"', 'Laptops', 9, 4, 54999), s('AIO-24', 'All-in-one desktop 24"', 'Desktops', 5, 3, 68500), s('TV-55', '55" Smart TV', 'Televisions', 7, 3, 64999), s('CAB-HD', 'HDMI cable 2 m', 'Accessories', 48, 20, 599), s('MOU-W', 'Wireless mouse', 'Accessories', 3, 15, 1200), s('CHG-65', 'USB-C charger 65 W', 'Accessories', 22, 10, 2499), s('SND-BR', 'Sound bar', 'Sound', 6, 3, 17999), s('RTR-AX', 'Wi-Fi 6 router', 'Accessories', 11, 5, 7499)]);
  set('customers', [{ id: 'c1', name: 'Wanjiru M.', contact: '+254 711 000 111', joined: now - 40 * D }, { id: 'c2', name: 'Kamau & Sons', contact: '+254 722 000 222', joined: now - 25 * D }, { id: 'c3', name: 'Grace N.', contact: '+254 733 000 333', joined: now - 12 * D }, { id: 'c4', name: 'Daniel M.', contact: '+254 744 000 444', joined: now - 6 * D }]);
  const t = (id, name, service, branch, status, text, d) => ({ id, userId: null, name, email: '', phone: '', service, branch, status, created: now - d * D, thread: [{ from: name, me: false, text, at: now - d * D }] });
  set('tickets', [...get('tickets'), t('T-1001', 'Wanjiru M.', 'CCTV Installation', 'Kerugoya', 'Open', 'We need two extra cameras added to the shop system.', .5), t('T-1002', 'Kamau & Sons', 'IT Support', 'Nairobi CBD', 'Open', 'Office printer is not visible on the network since Monday.', 1.5), t('T-1003', 'Grace N.', 'Computer Sales', "Murang'a", 'Closed', 'Asked about the price of a 24 inch all-in-one.', 6)]);
  DB.set('seeded', 1);
};
if (!DB.get('seeded', 0)) SEED();

const S = { oq: '', of: 'All', sq: '', range: '7D', tf: 'All', tid: null };
const OS = { Pending: 'p', Active: 'b', Completed: 'a', Declined: 'd' }, PS = { Paid: 'a', Due: 'p', Refunded: 'd' };
const kpi = (i, h, l, v) => `<article class="glass card kpi s3"><span class="ico" style="--h:${h}">${ic(i)}</span><h3>${l}</h3><b>${v}</b></article>`;

/* charts */
const bars = (labels, vals, unit) => { const W = 440, H = 190, bw = Math.min(40, 300 / vals.length), mx = Math.max(...vals, 1) * 1.12, gap = (W - vals.length * bw) / (vals.length + 1);
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Bar chart: ${labels.map((l, i) => l + ' ' + vals[i]).join(', ')}">` + [0, 1, 2, 3].map(k => `<line class="gl" x1="0" x2="${W}" y1="${8 + k * 50}" y2="${8 + k * 50}"/>`).join('') +
  vals.map((v, i) => { const h = Math.max(2, (H - 30) * v / mx), x = gap + i * (bw + gap); return `<rect class="b" x="${x}" y="${H - 22 - h}" width="${bw}" height="${h}" rx="7" fill="${ramp(v / mx)}" style="animation-delay:${i * .04}s"><title>${labels[i]}: ${unit}${v.toLocaleString()}</title></rect><text x="${x + bw / 2}" y="${H - 4}" text-anchor="middle">${labels[i]}</text>`; }).join('') + '</svg></div>'; };
const line = (a, b, labels) => { const W = 440, H = 190, P = (arr) => arr.map((v, i) => [20 + i * (W - 40) / (arr.length - 1), H - 28 - (H - 50) * v / 100]), sm = p => p.map((q, i) => i ? `C${(p[i - 1][0] + q[0]) / 2},${p[i - 1][1]} ${(p[i - 1][0] + q[0]) / 2},${q[1]} ${q[0]},${q[1]}` : `M${q[0]},${q[1]}`).join('');
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Sales against target by month"><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22d3c5" stop-opacity=".45"/><stop offset="1" stop-color="#22d3c5" stop-opacity="0"/></linearGradient></defs>` + [0, 1, 2, 3].map(k => `<line class="gl" x1="0" x2="${W}" y1="${8 + k * 45}" y2="${8 + k * 45}"/>`).join('') +
  `<path d="${sm(P(a))} L${W - 20},${H - 28} L20,${H - 28}Z" fill="url(#ag)" stroke="none"/><path d="${sm(P(b))}" stroke="var(--mute)" stroke-width="2" stroke-dasharray="5 5"/><path d="${sm(P(a))}" stroke="var(--teal)" stroke-width="3" stroke-linecap="round"/>` + labels.map((m, i) => i % 2 === 0 ? `<text x="${20 + i * (W - 40) / (labels.length - 1)}" y="${H - 5}" text-anchor="middle">${m}</text>` : '').join('') + '</svg></div>'; };
const donut = (parts, total, centre) => { const C = 2 * Math.PI * 60; let off = 0; return `<div class="donut"><svg viewBox="0 0 160 160" role="img" aria-label="Orders by branch"><circle cx="80" cy="80" r="60" stroke="var(--line)" stroke-width="18"/>` + parts.map((p, i) => { const l = total ? C * p[1] / total : 0, s = `<circle cx="80" cy="80" r="60" stroke="${HUE[i % 3]}" stroke-width="18" stroke-dasharray="${l} ${C - l}" stroke-dashoffset="${-off}" transform="rotate(-90 80 80)"><title>${p[0]}: ${kes(p[1])}</title></circle>`; off += l; return s; }).join('') + `<text x="80" y="86" text-anchor="middle" style="font:700 22px Sora,sans-serif;fill:var(--ink)">${centre}</text></svg><ul class="list" style="flex:1;min-width:160px">${parts.map((p, i) => `<li><i style="width:10px;height:10px;border-radius:3px;background:${HUE[i % 3]}"></i><span>${esc(p[0])}</span><b class="end">${kes(p[1])}</b></li>`).join('')}</ul></div>`; };
const meter = (v, max) => `<div style="height:8px;border-radius:8px;background:var(--fill);overflow:hidden"><i style="display:block;height:100%;width:${Math.round(100 * v / Math.max(1, max))}%;border-radius:8px;background:linear-gradient(90deg,var(--teal),var(--sig))"></i></div>`;

/* views */
const V = {
  overview() {
    const o = get('orders'), st = get('stock'), tk = get('tickets'), us = Auth.users(), low = st.filter(s => s.qty <= s.min);
    const rev = o.filter(x => x.pay === 'Paid').reduce((a, x) => a + x.amount, 0), openO = o.filter(x => ['Pending', 'Active'].includes(x.status)).length, openT = tk.filter(t => t.status === 'Open').length;
    const lab = [], val = []; for (let i = 6; i >= 0; i--) { const d0 = new Date(now - i * D); d0.setHours(0, 0, 0, 0); const a = d0.getTime(); lab.push(d0.toLocaleDateString('en-GB', { weekday: 'short' })); val.push(Math.round(o.filter(x => x.date >= a && x.date < a + D).reduce((s, x) => s + x.amount, 0) / 1000)); }
    const br = BRANCHES.map(b => [b, o.filter(x => x.branch === b).reduce((s, x) => s + x.amount, 0)]);
    return `<div class="dash">${kpi('coin', HUE[0], 'Revenue (paid)', kes(rev))}${kpi('receipt-2', HUE[1], 'Open orders', openO)}${kpi('mail', HUE[2], 'Open tickets', openT)}${kpi('package', HUE[2], 'Low stock items', low.length)}
    <article class="glass card s7"><div class="hd"><h2>Sales, last 7 days</h2><small>KSh thousands</small></div>${bars(lab, val, 'KSh ')}</article>
    <article class="glass card s5"><div class="hd"><h2>Orders by branch</h2></div>${donut(br, br.reduce((a, b) => a + b[1], 0), o.length + ' orders')}</article>
    <article class="glass card s8"><div class="hd"><h2>Recent orders</h2><a class="btn sm" href="#orders">View all</a></div><div class="tw"><table><thead><tr><th>Ref</th><th>Customer</th><th>Item</th><th>Amount</th><th>Status</th></tr></thead><tbody>${[...o].sort((a, b) => b.date - a.date).slice(0, 5).map(x => `<tr><td>#${x.id}</td><td>${esc(x.customer)}</td><td>${esc(x.item)}</td><td>${kes(x.amount)}</td><td><span class="st ${OS[x.status]}">${x.status}</span></td></tr>`).join('')}</tbody></table></div></article>
    <article class="glass card s4"><div class="hd"><h2>Low stock</h2><a class="btn sm" href="#stock">Stock</a></div><ul class="list">${low.map(s => `<li><div><b>${esc(s.name)}</b><small>${s.qty} left, minimum ${s.min}</small></div><span class="st p end">Low</span></li>`).join('') || '<li>All stock levels are healthy.</li>'}</ul></article>
    <article class="glass card s7"><div class="hd"><h2>Latest tickets</h2><a class="btn sm" href="#tickets">Open tickets</a></div><ul class="list">${[...tk].sort((a, b) => b.created - a.created).slice(0, 3).map(t => `<li><div><b>${esc(t.service)}</b><small>${esc(t.name)}, ${esc(t.branch)} · ${ago(t.created)}</small></div><span class="st ${t.status === 'Open' ? 'p' : 'a'} end">${t.status}</span></li>`).join('') || '<li>No tickets yet.</li>'}</ul></article>
    <article class="glass card s5"><div class="hd"><h2>Newest accounts</h2><a class="btn sm" href="#customers">Customers</a></div><ul class="list">${[...us].reverse().slice(0, 4).map(u => `<li><span class="av">${esc(u.name[0]).toUpperCase()}</span><div><b>${esc(u.name)}</b><small>${esc(u.role)} · ${ago(u.created)}</small></div></li>`).join('') || '<li>No accounts yet.</li>'}</ul></article></div>`;
  },
  orders() {
    return `<div class="glass card"><div class="tools"><label class="srch">${ic('search')}<input id="oq" type="search" placeholder="Search orders" aria-label="Search orders" value="${esc(S.oq)}"></label><select class="sel" id="of" aria-label="Filter by status">${['All', 'Pending', 'Active', 'Completed', 'Declined'].map(s => `<option${s === S.of ? ' selected' : ''}>${s}</option>`).join('')}</select><button class="btn p sm" data-a="onew" type="button" style="margin-left:auto">${ic('plus')}New order</button></div><div class="tw"><table><thead><tr><th>Ref</th><th>Customer</th><th>Item</th><th>Branch</th><th>Amount</th><th>Payment</th><th>Status</th><th><span class="sr" style="position:absolute;left:-9999px">Actions</span></th></tr></thead><tbody id="tb">${V.orows()}</tbody></table></div></div>`;
  },
  orows() {
    const q = S.oq.toLowerCase();
    return get('orders').filter(x => (S.of === 'All' || x.status === S.of) && (x.customer + x.item + x.id + x.branch).toLowerCase().includes(q)).sort((a, b) => b.date - a.date).map(x => `<tr><td>#${x.id}</td><td>${esc(x.customer)}</td><td>${esc(x.item)}</td><td>${esc(x.branch)}</td><td>${kes(x.amount)}</td><td><span class="st ${PS[x.pay]}">${x.pay}</span>${x.pay === 'Due' ? ` <button class="ab" data-a="paid" data-id="${x.id}" aria-label="Mark order ${x.id} as paid" title="Mark paid">${ic('check')}</button>` : ''}</td><td><select class="sel" data-a="ost" data-id="${x.id}" aria-label="Status for order ${x.id}">${Object.keys(OS).map(s => `<option${s === x.status ? ' selected' : ''}>${s}</option>`).join('')}</select></td><td><button class="ab" data-a="odel" data-id="${x.id}" aria-label="Delete order ${x.id}">${ic('trash')}</button></td></tr>`).join('') || '<tr><td colspan="8" class="empty">No orders match.</td></tr>';
  },
  customers() {
    const me = Auth.current(), us = Auth.users(), rows = [...us.map(u => ({ n: u.name, c: u.email + ' · ' + u.phone, src: 'Account', role: u.role, id: u.id, at: u.created })), ...get('customers').map(c => ({ n: c.name, c: c.contact, src: 'Walk-in', role: '', id: c.id, at: c.joined }))].sort((a, b) => b.at - a.at);
    return `<div class="glass card"><div class="hd"><h2>Customers and accounts</h2><small>${us.length} account${us.length === 1 ? '' : 's'}</small></div><div class="tw"><table><thead><tr><th>Name</th><th>Contact</th><th>Source</th><th>Role</th><th>Joined</th></tr></thead><tbody>${rows.map(r => `<tr><td><b>${esc(r.n)}</b></td><td>${esc(r.c)}</td><td><span class="st ${r.src === 'Account' ? 'b' : 'a'}">${r.src}</span></td><td>${!r.role ? '<small>None</small>' : me.role === 'owner' && r.role !== 'owner' ? `<select class="sel" data-a="role" data-id="${r.id}" aria-label="Role for ${esc(r.n)}">${['customer', 'staff'].map(x => `<option${x === r.role ? ' selected' : ''}>${x}</option>`).join('')}</select>` : `<span class="role" style="margin:0">${esc(r.role)}</span>`}</td><td>${ago(r.at)}</td></tr>`).join('')}</tbody></table></div></div>`;
  },
  analytics() {
    const SER = { '7D': [['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], [48, 62, 55, 71, 90, 84, 39]], '30D': [['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'], [310, 402, 365, 448]], '12M': [['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], [1210, 1380, 1290, 1560, 1410, 1620, 1700, 1580, 1840, 1760, 0, 0]] };
    const [l, v] = SER[S.range], o = get('orders'), tk = get('tickets'), br = BRANCHES.map(b => [b, o.filter(x => x.branch === b).reduce((s, x) => s + x.amount, 0)]);
    const sv = SERVICES.map(s => [s, tk.filter(t => t.service === s).length]).filter(x => x[1]).sort((a, b) => b[1] - a[1]);
    return `<div class="dash"><article class="glass card s7"><div class="hd"><h2>Sales</h2><div class="tabs" role="group" aria-label="Range">${['7D', '30D', '12M'].map(r => `<button type="button" data-a="range" data-r="${r}" aria-pressed="${r === S.range}">${r}</button>`).join('')}</div></div>${bars(l, v.map(x => x), 'KSh thousand ')}<p class="hint" style="margin-top:10px">Sample figures in KSh thousands. Orders recorded here feed the other charts.</p></article>
    <article class="glass card s5"><div class="hd"><h2>Sales against target</h2><span class="legend"><span><i style="background:var(--teal)"></i>Sales</span><span><i style="background:var(--mute)"></i>Target</span></span></div>${line([42, 58, 51, 76, 49, 63, 70, 66], [50, 55, 60, 65, 70, 75, 80, 82], ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'])}</article>
    <article class="glass card s6"><div class="hd"><h2>Revenue by branch</h2><small>From recorded orders</small></div>${donut(br, br.reduce((a, b) => a + b[1], 0), kes(br.reduce((a, b) => a + b[1], 0)).replace('KSh ', ''))}</article>
    <article class="glass card s6"><div class="hd"><h2>Tickets by service</h2><small>From recorded tickets</small></div><ul class="list">${sv.map(s => `<li style="flex-direction:column;align-items:stretch;gap:8px"><span style="display:flex;justify-content:space-between"><b>${esc(s[0])}</b><span>${s[1]}</span></span>${meter(s[1], sv[0][1])}</li>`).join('') || '<li>No tickets yet.</li>'}</ul></article></div>`;
  },
  tickets() {
    const tk = get('tickets').filter(t => S.tf === 'All' || t.status === S.tf).sort((a, b) => b.created - a.created), t = get('tickets').find(x => x.id === S.tid) || tk[0];
    if (t) S.tid = t.id;
    return `<div class="tk"><div class="glass card"><div class="hd"><h2>Tickets</h2><div class="tabs" role="group" aria-label="Filter">${['All', 'Open', 'Closed'].map(f => `<button type="button" data-a="tf" data-f="${f}" aria-pressed="${f === S.tf}">${f}</button>`).join('')}</div></div><ul class="list">${tk.map(x => `<li role="button" tabindex="0" data-a="tsel" data-id="${x.id}" aria-selected="${x.id === S.tid}"><div><b>${esc(x.service)}</b><small>${esc(x.name)} · ${ago(x.created)}</small></div><span class="st ${x.status === 'Open' ? 'p' : 'a'} end">${x.status}</span></li>`).join('') || '<li>No tickets.</li>'}</ul></div>
    <div class="glass card">${t ? `<div class="hd"><div><h2>${esc(t.service)}</h2><small>${t.id} · ${esc(t.branch)} · ${esc(t.name)} ${t.phone ? '· ' + esc(t.phone) : ''}</small></div><button class="btn sm" type="button" data-a="tclose" data-id="${t.id}">${t.status === 'Open' ? 'Close ticket' : 'Reopen'}</button></div><div class="thread">${t.thread.map(m => `<div class="msg ${m.me ? 'me' : ''}"><small>${esc(m.from)} · ${ago(m.at)}</small>${esc(m.text)}</div>`).join('')}</div><form id="rf" novalidate><div class="fld"><label for="rt">Reply</label><textarea id="rt" name="text" placeholder="Write a reply"></textarea></div><button class="btn p sm" type="submit">${ic('send')}Send reply</button></form>` : '<div class="empty">Select a ticket to see the conversation.</div>'}</div></div>`;
  },
  stock() {
    return `<div class="glass card"><div class="tools"><label class="srch">${ic('search')}<input id="sq" type="search" placeholder="Search stock" aria-label="Search stock" value="${esc(S.sq)}"></label><button class="btn p sm" data-a="snew" type="button" style="margin-left:auto">${ic('plus')}Add item</button></div><div class="tw"><table><thead><tr><th>SKU</th><th>Item</th><th>Category</th><th>Quantity</th><th>Minimum</th><th>Price</th><th>Level</th><th></th></tr></thead><tbody id="tb">${V.srows()}</tbody></table></div></div>`;
  },
  srows() {
    const q = S.sq.toLowerCase();
    return get('stock').filter(s => (s.sku + s.name + s.cat).toLowerCase().includes(q)).map(s => `<tr class="${s.qty <= s.min ? 'low' : ''}"><td>${esc(s.sku)}</td><td><b>${esc(s.name)}</b></td><td>${esc(s.cat)}</td><td><span class="qty"><button class="ab" data-a="q-" data-id="${esc(s.sku)}" aria-label="Decrease ${esc(s.name)}">${ic('minus')}</button><b>${s.qty}</b><button class="ab" data-a="q+" data-id="${esc(s.sku)}" aria-label="Increase ${esc(s.name)}">${ic('plus')}</button></span></td><td>${s.min}</td><td>${kes(s.price)}</td><td><span class="st ${s.qty <= s.min ? 'p' : 'a'}">${s.qty <= s.min ? 'Low' : 'OK'}</span></td><td><button class="ab" data-a="sdel" data-id="${esc(s.sku)}" aria-label="Delete ${esc(s.name)}">${ic('trash')}</button></td></tr>`).join('') || '<tr><td colspan="8" class="empty">No items match.</td></tr>';
  },
  settings() {
    const u = Auth.current();
    return `<div class="dash"><article class="glass card s6"><div class="hd"><h2>Your profile</h2><span class="role" style="margin:0">${esc(u.role)}</span></div><form id="pf" novalidate><div class="fld"><label for="p-n">Full name</label><input id="p-n" name="name" value="${esc(u.name)}"></div><div class="fld"><label for="p-e">Email</label><input id="p-e" value="${esc(u.email)}" disabled></div><div class="fld"><label for="p-p">Phone</label><input id="p-p" name="phone" value="${esc(u.phone)}"></div><button class="btn p sm" type="submit">Save changes</button></form></article>
    <article class="glass card s6"><div class="hd"><h2>Business</h2></div><ul class="list"><li>${ic('clock')}<div><b>Opening hours</b><small>Monday to Saturday, 08:00 to 18:00</small></div></li><li>${ic('phone')}<div><b>Phone and WhatsApp</b><small>+254 794 707 522</small></div></li><li>${ic('map-pin')}<div><b>Branches</b><small>${BRANCHES.join(', ')}</small></div></li></ul></article>
    <article class="glass card s12"><div class="hd"><h2>Data and session</h2></div><div class="btns"><button class="btn" type="button" data-a="export">${ic('download')}Export data</button>${u.role === 'owner' ? `<button class="btn" type="button" data-a="reset">${ic('refresh')}Reset demo data</button>` : ''}<button class="btn" type="button" data-a="signout">${ic('logout')}Sign out</button></div><p class="hint" style="margin-top:14px">Exports orders, stock, customers and tickets. Account passwords are never exported.</p></article></div>`;
  }
};
const TITLES = { overview: 'Overview', orders: 'Orders', customers: 'Customers', analytics: 'Analytics', tickets: 'Tickets', stock: 'Stock', settings: 'Settings' };

/* shell + gate */
const view = $('#view'), shell = $('#shell'), gate = $('#gate');
function badge() { const n = get('tickets').filter(t => t.status === 'Open').length, b = $('#tb-n'); b.textContent = n; b.hidden = !n; }
function render() {
  const v = V[location.hash.slice(1)] && !['orows', 'srows'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'overview';
  $('#title').textContent = TITLES[v]; $$('.rail [data-v]').forEach(a => a.dataset.v === v ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  view.classList.remove('view'); void view.offsetWidth; view.classList.add('view'); view.innerHTML = V[v](); badge();
}
function access() {
  const u = Auth.current();
  if (u && u.role !== 'customer') { gate.hidden = true; shell.hidden = false; render(); return; }
  shell.hidden = true; gate.hidden = false;
  gate.innerHTML = `<div class="glass card" style="max-width:460px;text-align:center;padding:40px"><span class="ico" style="--h:var(--teal);margin:0 auto 18px">${ic(u ? 'shield-check' : 'lock')}</span><h1 style="font-size:28px;margin-bottom:10px">${u ? 'Staff only' : 'Staff console'}</h1><p class="sub2" style="color:var(--mute);margin-bottom:22px">${u ? 'Your account does not have staff access. Ask the owner to change your role.' : 'Sign in to continue. The first account created on this device becomes the owner.'}</p><div class="btns" style="justify-content:center">${u ? '<button class="btn" data-a="signout" type="button">Sign out</button>' : '<button class="btn p" data-a="gin" type="button">Sign in</button><button class="btn" data-a="gup" type="button">Create account</button>'}<a class="btn" href="index.html">Back to site</a></div></div>`;
}
document.addEventListener('auth', access); addEventListener('hashchange', () => !shell.hidden && render());

/* forms in modals */
const field = (id, l, t = 'text', extra = '') => `<div class="fld"><label for="m-${id}">${l}</label><input id="m-${id}" name="${id}" type="${t}" ${extra}></div>`;
const sel = (id, l, opts) => `<div class="fld"><label for="m-${id}">${l}</label><select id="m-${id}" name="${id}">${opts.map(o => `<option>${o}</option>`).join('')}</select></div>`;
const bad = (f, id, msg) => { const w = f.elements[id].closest('.fld'); w.classList.add('err'); w.insertAdjacentHTML('beforeend', `<span class="ferr" role="alert">${msg}</span>`); f.elements[id].focus(); };
const clear = f => { $$('.ferr', f).forEach(x => x.remove()); $$('.err', f).forEach(x => x.classList.remove('err')); };
function form(title, body, cta, onOk) {
  const m = modal(`<button class="ib x-btn" data-close aria-label="Close">${ic('x')}</button><h2>${title}</h2><form novalidate style="margin-top:16px">${body}<button class="btn p" style="width:100%" type="submit">${cta}</button></form>`);
  const f = $('form', m.el); f.addEventListener('submit', e => { e.preventDefault(); clear(f); if (onOk(Object.fromEntries(new FormData(f)), f) !== false) m.close(); });
}

/* actions */
const A = {
  gin: () => openAuth('in', { noFocus: false }), gup: () => openAuth('up'), signout() { Auth.signOut(); toast('Signed out'); },
  paid(el) { set('orders', get('orders').map(x => x.id === el.dataset.id ? { ...x, pay: 'Paid' } : x)); $('#tb').innerHTML = V.orows(); toast('Marked as paid'); },
  odel(el) { if (confirm('Delete order #' + el.dataset.id + '?')) { set('orders', get('orders').filter(x => x.id !== el.dataset.id)); $('#tb').innerHTML = V.orows(); toast('Order deleted'); } },
  onew() {
    form('New order', field('customer', 'Customer') + field('item', 'Item or service') + `<div class="row2">${sel('branch', 'Branch', BRANCHES)}${field('amount', 'Amount (KSh)', 'number', 'min="1" inputmode="numeric"')}</div>` + sel('pay', 'Payment', ['Due', 'Paid']), 'Add order', (d, f) => {
      if (d.customer.trim().length < 2) return bad(f, 'customer', 'Enter the customer name'), false; if (d.item.trim().length < 2) return bad(f, 'item', 'Describe the item or service'), false; if (!(+d.amount > 0)) return bad(f, 'amount', 'Enter an amount above zero'), false;
      let id; do { id = String(10000 + Math.random() * 89999 | 0); } while (get('orders').some(x => x.id === id));
      set('orders', [{ id, customer: d.customer.trim(), item: d.item.trim(), branch: d.branch, amount: +d.amount, pay: d.pay, status: 'Pending', date: Date.now() }, ...get('orders')]); render(); toast('Order #' + id + ' added');
    });
  },
  range(el) { S.range = el.dataset.r; render(); }, tf(el) { S.tf = el.dataset.f; render(); }, tsel(el) { S.tid = el.dataset.id; render(); },
  tclose(el) { set('tickets', get('tickets').map(t => t.id === el.dataset.id ? { ...t, status: t.status === 'Open' ? 'Closed' : 'Open' } : t)); render(); },
  'q+'(el) { stockQ(el, 1); }, 'q-'(el) { stockQ(el, -1); },
  sdel(el) { if (confirm('Delete this stock item?')) { set('stock', get('stock').filter(s => s.sku !== el.dataset.id)); $('#tb').innerHTML = V.srows(); } },
  snew() {
    form('Add stock item', field('sku', 'SKU') + field('name', 'Item name') + `<div class="row2">${field('cat', 'Category')}${field('price', 'Price (KSh)', 'number', 'min="0"')}</div><div class="row2">${field('qty', 'Quantity', 'number', 'min="0"')}${field('min', 'Minimum level', 'number', 'min="0"')}</div>`, 'Add item', (d, f) => {
      if (!d.sku.trim()) return bad(f, 'sku', 'Enter a SKU'), false; if (get('stock').some(s => s.sku.toLowerCase() === d.sku.trim().toLowerCase())) return bad(f, 'sku', 'That SKU already exists'), false; if (!d.name.trim()) return bad(f, 'name', 'Enter the item name'), false; if (!(+d.price >= 0) || d.price === '') return bad(f, 'price', 'Enter a price'), false;
      set('stock', [...get('stock'), { sku: d.sku.trim(), name: d.name.trim(), cat: d.cat.trim() || 'General', qty: +d.qty || 0, min: +d.min || 0, price: +d.price }]); $('#tb').innerHTML = V.srows(); toast('Item added');
    });
  },
  export() { const b = new Blob([JSON.stringify({ orders: get('orders'), stock: get('stock'), customers: get('customers'), tickets: get('tickets') }, null, 2)], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = '99computers-data.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); },
  reset() { if (confirm('Reset orders, stock, customers and tickets to the demo data?')) { set('tickets', []); SEED(); render(); toast('Demo data restored'); } }
};
function stockQ(el, d) { set('stock', get('stock').map(s => s.sku === el.dataset.id ? { ...s, qty: Math.max(0, s.qty + d) } : s)); $('#tb').innerHTML = V.srows(); }
document.addEventListener('click', e => { const el = e.target.closest('[data-a]'); if (el && el.tagName !== 'SELECT' && A[el.dataset.a]) A[el.dataset.a](el); });
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('li[data-a]')) { e.preventDefault(); A[e.target.dataset.a](e.target); } });
document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'of') { S.of = t.value; $('#tb').innerHTML = V.orows(); }
  else if (t.dataset.a === 'ost') { set('orders', get('orders').map(x => x.id === t.dataset.id ? { ...x, status: t.value } : x)); toast('Status updated'); }
  else if (t.dataset.a === 'role') { Auth.update(t.dataset.id, { role: t.value }); toast('Role updated'); }
});
document.addEventListener('input', e => { if (e.target.id === 'oq') { S.oq = e.target.value; $('#tb').innerHTML = V.orows(); } if (e.target.id === 'sq') { S.sq = e.target.value; $('#tb').innerHTML = V.srows(); } });
document.addEventListener('submit', e => {
  const f = e.target;
  if (f.id === 'rf') { e.preventDefault(); const txt = f.elements.text.value.trim(); if (!txt) { clear(f); bad(f, 'text', 'Write a reply first'); return; } const u = Auth.current(); set('tickets', get('tickets').map(t => t.id === S.tid ? { ...t, thread: [...t.thread, { from: u.name + ' (staff)', me: true, text: txt, at: Date.now() }] } : t)); render(); toast('Reply saved'); }
  if (f.id === 'pf') { e.preventDefault(); clear(f); const n = f.elements.name.value.trim(), p = f.elements.phone.value.replace(/\s/g, ''); if (n.length < 2) return bad(f, 'name', 'Enter your name'); if (!/^(\+?254|0)[17]\d{8}$/.test(p)) return bad(f, 'phone', 'Enter a Kenyan mobile number'); Auth.update(Auth.current().id, { name: n, phone: p.replace(/^0/, '+254').replace(/^254/, '+254') }); toast('Profile saved'); }
});
access();
})();
