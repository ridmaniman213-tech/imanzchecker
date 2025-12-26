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
        
        let card = `
            <div class="card">
                <div style="color: #888; font-weight: bold; width: 30px;">${serial}</div>
                <div style="flex-grow: 1; text-align: center;">
                    <strong>${item.nama}</strong><br>
                    <small>${item.info}</small>
                </div>
                <button style="background: rgba(255,255,255,0.1); border: none; color: white; border-radius: 5px; padding: 2px 8px;">+</button>
            </div>`;
        
        if (item.kategori === 'admin') adminH += card;
        else if (item.kategori === 'midman') midH += card;
        else if (item.kategori === 'scammer') scamH += card;
        count++;
    }

    document.getElementById('list-admin').innerHTML = adminH || "Tiada Admin";
    document.getElementById('list-midman').innerHTML = midH || "Tiada Midman";
    document.getElementById('list-scammer').innerHTML = scamH || "Tiada Scammer";
    
    // Update Dashboard Stats
    updateStats(data);
});

// FUNGSI UNTUK BUTANG SUBMIT DALAM HTML
async function validateAndSend() {
    const no = document.getElementById('r_no').value;
    const reason = document.getElementById('r_reason').value;
    const webAppUrl = "https://script.google.com/macros/s/AKfycbzMIXir0jkNpuvGMQEwSS6PxnefHmsRmt36W8IgI07o2kc8wwS9IOJaEWfW2fQJJdXl/exec";

    if(!no || !reason) return alert("Sila isi maklumat laporan!");

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerText = "Sending...";

    const payload = {
        action: "report_scam",
        no_tel: no,
        sebab: reason
    };

    try {
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
        alert("Gagal hantar laporan.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Submit Report";
    }
}
