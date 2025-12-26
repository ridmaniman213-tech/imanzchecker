// CONFIG FIREBASE
const firebaseConfig = {
    databaseURL: "https://antiscam-dd1da-default-rtdb.firebaseio.com/"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// AMBIL DATA REAL-TIME
db.ref('senarai').on('value', (snapshot) => {
    const data = snapshot.val();
    let adminH = "", midH = "", scamH = "";
    let count = 1;

    for (let id in data) {
        let item = data[id];
        let serial = count < 10 ? "0" + count : count;
        
        // Design Card ikut rupa bot (Ada nombor siri & button +)
        let card = `
            <div class="card" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border-bottom: 1px solid #eee; background: white; margin-bottom:5px;">
                <div style="color: #ccc; font-weight: bold; width: 30px;">${serial}</div>
                <div style="flex-grow: 1; text-align: center;">
                    <strong style="text-transform: uppercase;">${item.nama}</strong><br>
                    <small style="color: gray;">${item.info}</small>
                </div>
                <button style="background: #f4f4f4; border: 1px solid #ddd; border-radius: 5px; padding: 2px 8px;">+</button>
            </div>`;
        
        if (item.kategori === 'admin') adminH += card;
        else if (item.kategori === 'midman') midH += card;
        else if (item.kategori === 'scammer') scamH += card;
        count++;
    }

    document.getElementById('list-admin').innerHTML = adminH || "Tiada Admin";
    document.getElementById('list-midman').innerHTML = midH || "Tiada Midman";
    document.getElementById('list-scammer').innerHTML = scamH || "Tiada Scammer";
});

// FUNGSI NAV & MODAL
function tukarTab(id, btn) {
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.t-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.remove('hidden');
    btn.classList.add('active');
}
function openModal() { document.getElementById('modal').style.display = 'flex'; }
function closeModal() { document.getElementById('modal').style.display = 'none'; }

// HANTAR REPORT KE BOT (LALUI GAS)
async function hantarLaporan() {
    const no = document.getElementById('r_no').value;
    const reason = document.getElementById('r_reason').value;
    
    // PASTE URL Web App Google Script kau kat sini
    const webAppUrl = "https://script.google.com/macros/s/AKfycbzMIXir0jkNpuvGMQEwSS6PxnefHmsRmt36W8IgI07o2kc8wwS9IOJaEWfW2fQJJdXl/exec";

    if(!no || !reason) return alert("Sila isi no tel dan sebab!");

    // Data yang akan dihantar ke Google Script
    const payload = {
        action: "report_scam",
        no_tel: no,
        sebab: reason
    };

    try {
        // Hantar ke GAS
        await fetch(webAppUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(payload)
        });
        
        alert("🚨 Laporan telah dihantar ke Bot Telegram Admin!");
        closeModal();
        document.getElementById('r_no').value = "";
        document.getElementById('r_reason').value = "";
    } catch (e) {
        alert("Gagal hantar laporan. Sila cuba lagi.");
    }
}
