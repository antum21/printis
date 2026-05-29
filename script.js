  // ── Formatter ──
  function fmt(n) {
    if (!n && n !== 0) return '';
    return 'Rp ' + Math.round(n).toLocaleString('id-ID');
  }
  function parseNum(s) {
    if (!s) return 0;
    return parseFloat(s.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
  }

  // ── Hitung ulang semua baris + grand total ──
  function hitungSemua() {
    let grand = 0;
    const rows = document.querySelectorAll('#itemsBody tr');
    rows.forEach(row => {
      const harga = parseNum(row.querySelector('.inp-harga').value);
      const qty   = parseFloat(row.querySelector('.inp-qty').value) || 0;
      const sub   = harga * qty;
      row.querySelector('.cell-total').textContent = sub > 0 ? fmt(sub) : '';
      grand += sub;
    });
    document.getElementById('grandTotal').textContent = fmt(grand);
    document.getElementById('minDP').textContent = fmt(grand * 0.7);
  }

  // ── Buat satu baris ──
  function buatBaris() {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input class="inp-desk" type="text" placeholder="Nama item / deskripsi"></td>
      <td><input class="inp-harga" type="text" placeholder="0" inputmode="numeric"></td>
      <td><input class="inp-qty" type="number" placeholder="1" min="0" step="1"></td>
      <td><span class="total-cell cell-total"></span></td>
      <td class="del-cell"><button class="btn-del" title="Hapus baris" onclick="hapusBaris(this)">✕</button></td>
    `;

    // Event listeners
    tr.querySelector('.inp-harga').addEventListener('input', function() {
      // Format sebagai angka saja
      hitungSemua();
    });
    tr.querySelector('.inp-qty').addEventListener('input', hitungSemua);

    return tr;
  }

  // ── Tambah baris ──
  function tambahBaris() {
    const tbody = document.getElementById('itemsBody');
    const row = buatBaris();
    // Animasi masuk
    row.style.opacity = '0';
    row.style.transform = 'translateY(-6px)';
    tbody.appendChild(row);
    requestAnimationFrame(() => {
      row.style.transition = 'opacity 0.2s, transform 0.2s';
      row.style.opacity = '1';
      row.style.transform = 'translateY(0)';
    });
    row.querySelector('.inp-desk').focus();
  }

  // ── Hapus baris ──
  function hapusBaris(btn) {
    const tbody = document.getElementById('itemsBody');
    if (tbody.rows.length <= 1) return; // minimal 1 baris
    const row = btn.closest('tr');
    row.style.transition = 'opacity 0.15s, transform 0.15s';
    row.style.opacity = '0';
    row.style.transform = 'translateX(10px)';
    setTimeout(() => { row.remove(); hitungSemua(); }, 150);
  }

  // ── Upload preview ──
  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      const img = document.getElementById('uploadPreview');
      const label = document.getElementById('uploadLabel');
      img.src = ev.target.result;
      img.style.display = 'block';
      label.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  // ── Init: 1 baris default ──
  tambahBaris();

  // ── Set default date ──
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('invDate').value = today;