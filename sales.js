// ── Format Rupiah ──────────────────────────────
const rupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID");

// ── Auto Hitung Total ──────────────────────────
const jumlahEl    = document.getElementById("jumlah");
const hargaEl     = document.getElementById("harga");
const totalEl     = document.getElementById("total");
const totalDisplay = document.getElementById("total-display");

function hitungTotal() {
  const t = (parseFloat(jumlahEl.value) || 0) * (parseFloat(hargaEl.value) || 0);
  totalEl.value = t;
  totalDisplay.textContent = rupiah(t);
}

jumlahEl.addEventListener("input", hitungTotal);
hargaEl.addEventListener("input", hitungTotal);

// ── Toast Notification ─────────────────────────
function showToast(msg, type = "success") {
  const el = document.createElement("div");
  el.className = `toast flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
    type === "success" ? "bg-green-600 text-white" : "bg-red-500 text-white"
  }`;
  el.innerHTML = `<span>${msg}</span>`;
  document.getElementById("toast-container").appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

// ── Submit Form ────────────────────────────────
document.getElementById("form-penjualan").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama    = document.getElementById("nama").value.trim();
  const makanan = document.getElementById("makanan").value.trim();
  const jumlah  = jumlahEl.value.trim();
  const harga   = hargaEl.value.trim();
  const total   = totalEl.value;

  if (!nama)                          return showToast("Nama pembeli wajib diisi.", "error");
  if (!makanan)                       return showToast("Pilih jenis makanan.", "error");
  if (!jumlah || Number(jumlah) < 1)  return showToast("Jumlah harus lebih dari 0.", "error");
  if (!harga  || Number(harga)  < 1)  return showToast("Harga satuan harus lebih dari 0.", "error");

  const btn     = document.getElementById("submit-btn");
  const loading = document.getElementById("loading");
  btn.disabled  = true;
  loading.classList.replace("hidden", "flex");

  try {
    const res    = await fetch(API_URL, {
      method:  "POST",
      headers: { "Content-Type": "text/plain" },
      body:    JSON.stringify({ nama, makanan, jumlah, harga, total }),
    });
    const result = await res.json();

    if (result.status === "success") {
      showToast("✅ Data penjualan berhasil disimpan!");
      e.target.reset();
      totalEl.value = 0;
      totalDisplay.textContent = "Rp 0";
      await loadData();
    } else {
      showToast("Gagal menyimpan data.", "error");
    }
  } catch {
    showToast("Koneksi gagal. Periksa URL API di config.js.", "error");
  } finally {
    btn.disabled = false;
    loading.classList.replace("flex", "hidden");
  }
});

// ── Load Data dari Spreadsheet ─────────────────
async function loadData() {
  const tbody    = document.getElementById("tabel-body");
  const loadingEl = document.getElementById("loading-tabel");
  const emptyEl  = document.getElementById("empty-tabel");
  const summaryEl = document.getElementById("summary");

  tbody.innerHTML = "";
  emptyEl.classList.add("hidden");
  summaryEl.classList.add("hidden");
  loadingEl.classList.remove("hidden");

  try {
    const res  = await fetch(API_URL, { redirect: "follow" });
    const data = await res.json();

    loadingEl.classList.add("hidden");

    if (!data.length) {
      emptyEl.classList.remove("hidden");
      return;
    }

    tbody.innerHTML = data.map((row, i) => `
      <tr class="border-t border-gray-100 hover:bg-blue-50/40 transition">
        <td class="py-3 px-3 text-center text-gray-400 text-xs">${i + 1}</td>
        <td class="py-3 px-3 font-medium">${esc(row.nama)}</td>
        <td class="py-3 px-3">
          <span class="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">${esc(row.makanan)}</span>
        </td>
        <td class="py-3 px-3 text-center">${esc(row.jumlah)}</td>
        <td class="py-3 px-3 text-right text-gray-600">${rupiah(row.harga)}</td>
        <td class="py-3 px-3 text-right font-semibold text-blue-700">${rupiah(row.total)}</td>
        <td class="py-3 px-3 text-gray-400 text-xs whitespace-nowrap">${esc(row.timestamp)}</td>
      </tr>`).join("");

    const totalPendapatan = data.reduce((s, r) => s + Number(r.total), 0);
    const totalTransaksi  = data.length;
    summaryEl.innerHTML = `
      <div class="bg-blue-50 rounded-xl p-3 text-center">
        <p class="text-xs text-gray-500">Total Transaksi</p>
        <p class="text-xl font-bold text-blue-700">${totalTransaksi}</p>
      </div>
      <div class="bg-green-50 rounded-xl p-3 text-center">
        <p class="text-xs text-gray-500">Total Pendapatan</p>
        <p class="text-lg font-bold text-green-700">${rupiah(totalPendapatan)}</p>
      </div>
      <div class="bg-purple-50 rounded-xl p-3 text-center sm:col-span-1 col-span-2">
        <p class="text-xs text-gray-500">Rata-rata Transaksi</p>
        <p class="text-lg font-bold text-purple-700">${rupiah(Math.round(totalPendapatan / totalTransaksi))}</p>
      </div>`;
    summaryEl.classList.replace("hidden", "grid");

  } catch {
    loadingEl.classList.add("hidden");
    emptyEl.textContent = "❌ Gagal memuat data. Periksa URL API di config.js.";
    emptyEl.classList.remove("hidden");
  }
}

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

loadData();
