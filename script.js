// ============================================================
// LINGOREAL PRO - script.js v6
// Firebase Realtime Database — Universal Live Leaderboard
// ============================================================

// ── FIREBASE CONFIG ──
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, get, update, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyA8epRiDpCIrLa8b3qSopQzHW3lZrcKNg8",
    authDomain: "englishlastproject-ce2f.firebaseapp.com",
    projectId: "englishlastproject-ce2f",
    storageBucket: "englishlastproject-ce2f.firebasestorage.app",
    messagingSenderId: "143404631421",
    appId: "1:143404631421:web:1d6f856ed09377a15b7814",
    measurementId: "G-RQNWLTC901",
    databaseURL: "https://englishlastproject-ce2f-default-rtdb.firebaseio.com"
};

const fbApp = initializeApp(firebaseConfig);
const db    = getDatabase(fbApp);

// ── CLASS LIST ──
const classList = ["Azwar","Alya","Andreas","Ayu","Beauty","Christian","Clara","Dominica","Drika","Gideon","Jenifer","Johannes","Julita","Khairul","Khayla","Lasko","Lorena","Nazwa","Nuansa","Queenna","Raid","Rony","Siti","Winda"];

const DIFFICULTY_CONFIG = {
    beginner:     { label:"BEGINNER",     count:5,  icon:"🌱" },
    intermediate: { label:"INTERMEDIATE", count:10, icon:"⚡" },
    advanced:     { label:"ADVANCED",     count:15, icon:"🔥" },
};

// ── I18N ──
const LANG_DATA = {
    id: {
        nav_profile:"User Profile", nav_quiz:"Quiz Mode", nav_achievement:"Achievement",
        nav_leaderboard:"Leaderboard", nav_settings:"Pengaturan", logout:"Keluar",
        profile_title:"PROFIL ENGINEER", label_username:"Nama Pengguna",
        label_played:"Total Dimainkan", label_errors:"Total Kesalahan",
        label_top_ach:"Pencapaian Terbaik", label_rank:"Peringkat Saat Ini",
        label_fav_mode:"Mode Favorit", label_accuracy:"Akurasi Jawaban",
        see_all:"Lihat Semua →",
        inspect_title:"PROFIL ENGINEER", inspect_sub:"Melihat statistik engineer lain",
        quiz_select_title:"PILIH MISIMU", quiz_select_sub:"Pilih difficulty & mode kuis, Mad!",
        quiz_step1:"① Pilih Tingkat Kesulitan", quiz_step2:"② Pilih Mode Kuis",
        quiz_diff_hint:"⚠️ Pilih difficulty dulu sebelum mulai!",
        diff_beginner:"PEMULA", diff_beginner_count:"5 Soal",
        diff_intermediate:"MENENGAH", diff_intermediate_count:"10 Soal",
        diff_advanced:"MAHIR", diff_advanced_count:"15 Soal",
        mode_arrange:"SUSUN KATA", mode_arrange_sub:"Terjemahkan & Susun",
        mode_tenses:"TENSES", mode_tenses_sub:"Kuasai Tata Bahasa",
        mode_tf:"BENAR/SALAH", mode_tf_sub:"Uji Pengetahuan Umum",
        abort:"Batal ✖", alert_label:"Peringatan Sistem", execute_btn:"JAWAB SEKARANG ⚡",
        ach_title:"PAPAN PRESTASI", ach_sub:"Kumpulin semua achievement & flex ke temen lo!",
        ach_unlocked:"Terbuka", ach_total:"Total", ach_progress:"Progres Keseluruhan",
        lb_title:"PERINGKAT GLOBAL CE-2F", lb_rank:"Peringkat", lb_name:"Nama",
        lb_played:"Dimainkan", lb_score:"Skor", lb_errors:"Kesalahan", lb_access:"Badge",
        settings_title:"KONFIGURASI SISTEM", settings_lang_label:"Pilih Bahasa Sistem",
        back_list:"Kembali", success_title:"GACOR COK!", success_btn:"LANJUT >",
        complete_btn:"🔄 Pilih Mode Lagi",
        online_label:"ONLINE", offline_label:"OFFLINE",
        fav_arrange:"Susun Kata", fav_tenses:"Tenses", fav_tf:"True/False", fav_none:"Belum ada",
        syncing:"Menyinkronkan...", sync_ok:"✓ Data tersinkron", sync_err:"⚠ Offline mode",
    },
    en: {
        nav_profile:"User Profile", nav_quiz:"Quiz Mode", nav_achievement:"Achievement",
        nav_leaderboard:"Leaderboard", nav_settings:"Settings", logout:"Logout",
        profile_title:"ENGINEER PROFILE", label_username:"Username",
        label_played:"Activity Log (Played)", label_errors:"System Errors",
        label_top_ach:"Top Achievements", label_rank:"Current Rank",
        label_fav_mode:"Fav Mode", label_accuracy:"Accuracy",
        see_all:"See All →",
        inspect_title:"ENGINEER PROFILE", inspect_sub:"Viewing another engineer's stats",
        quiz_select_title:"SELECT YOUR MISSION", quiz_select_sub:"Pick difficulty & quiz mode, bro!",
        quiz_step1:"① Choose Difficulty", quiz_step2:"② Choose Quiz Mode",
        quiz_diff_hint:"⚠️ Pick a difficulty before starting!",
        diff_beginner:"BEGINNER", diff_beginner_count:"5 Questions",
        diff_intermediate:"INTERMEDIATE", diff_intermediate_count:"10 Questions",
        diff_advanced:"ADVANCED", diff_advanced_count:"15 Questions",
        mode_arrange:"ARRANGE", mode_arrange_sub:"Build Indo-Eng Sentences",
        mode_tenses:"TENSES", mode_tenses_sub:"Master of Grammar",
        mode_tf:"TRUE/FALSE", mode_tf_sub:"General Knowledge",
        abort:"Abort ✖", alert_label:"System Alert", execute_btn:"EXECUTE ANSWER ⚡",
        ach_title:"ACHIEVEMENT BOARD", ach_sub:"Collect all achievements & flex on classmates!",
        ach_unlocked:"Unlocked", ach_total:"Total", ach_progress:"Overall Progress",
        lb_title:"CE-2F GLOBAL RANKING", lb_rank:"Rank", lb_name:"Name",
        lb_played:"Played", lb_score:"Score", lb_errors:"Errors", lb_access:"Badges",
        settings_title:"SYSTEM CONFIG", settings_lang_label:"Select System Language",
        back_list:"Back", success_title:"NAILED IT!", success_btn:"NEXT TASK >",
        complete_btn:"🔄 Choose Mode Again",
        online_label:"ONLINE", offline_label:"OFFLINE",
        fav_arrange:"Arrange", fav_tenses:"Tenses", fav_tf:"True/False", fav_none:"None yet",
        syncing:"Syncing...", sync_ok:"✓ Data synced", sync_err:"⚠ Offline mode",
    }
};
let currentLang = localStorage.getItem('CE2F_LANG') || 'id';
function t(key) { return LANG_DATA[currentLang][key] || key; }
function applyLang() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const k = el.getAttribute('data-i18n');
        if (LANG_DATA[currentLang][k]) el.innerText = LANG_DATA[currentLang][k];
    });
    const isId = currentLang === 'id';
    ['lang-id','lang-en'].forEach(id => {
        const el = document.getElementById(id); if (!el) return;
        const active = (id==='lang-id') === isId;
        el.className = `lang-btn p-4 rounded-2xl font-bold border-2 transition-all text-sm ${active?'bg-blue-600 text-white border-blue-500 font-black':'bg-[#0f172a] text-gray-400 border-gray-700 hover:border-blue-500'}`;
    });
}
window.setLang = lang => { currentLang=lang; localStorage.setItem('CE2F_LANG',lang); applyLang(); updateUserDashboard(); addLog(`Language: ${lang.toUpperCase()}`); };

// ── QUESTIONS ──
const allQuestions = {
    mode1: [
        { target:"I would like a coffee", hint:"Saya ingin sebuah kopi", words:["like","a","I","would","coffee","tea","want"], hints:["Mulai dengan 'I'.","Gunakan 'would like'.","I + would + like + a + coffee."] },
        { target:"Where is the toilet", hint:"Di mana toiletnya", words:["Where","the","toilet","is","go","hotel"], hints:["Gunakan 'Where' di depan.","Jangan lupa 'is'.","Where + is + the + toilet."] },
        { target:"She is reading a book", hint:"Dia sedang membaca sebuah buku", words:["She","is","reading","a","book","write","was"], hints:["Mulai dengan 'She'.","Present continuous.","She + is + reading + a + book."] },
        { target:"They go to school every day", hint:"Mereka pergi ke sekolah setiap hari", words:["They","go","to","school","every","day","went"], hints:["Mulai dengan 'They'.","Pakai 'go' bukan 'went'.","They + go + to + school + every + day."] },
        { target:"I do not understand this lesson", hint:"Saya tidak mengerti pelajaran ini", words:["I","do","not","understand","this","lesson","doesn't"], hints:["Mulai dengan 'I'.","Gunakan 'do not'.","I + do + not + understand + this + lesson."] },
        { target:"Can you help me please", hint:"Bisakah kamu membantuku", words:["Can","you","help","me","please","will","I"], hints:["Mulai dengan 'Can'.","Permintaan sopan.","Can + you + help + me + please."] },
        { target:"The cat is on the table", hint:"Kucing itu ada di atas meja", words:["The","cat","is","on","the","table","under"], hints:["Mulai dengan 'The cat'.","Preposisi tepat.","The + cat + is + on + the + table."] },
        { target:"I am very happy today", hint:"Saya sangat bahagia hari ini", words:["I","am","very","happy","today","sad","was"], hints:["Mulai dengan 'I am'.","Kata sifat tepat.","I + am + very + happy + today."] },
        { target:"He works at a hospital", hint:"Dia bekerja di sebuah rumah sakit", words:["He","works","at","a","hospital","school","work"], hints:["Mulai dengan 'He'.","'works' untuk He.","He + works + at + a + hospital."] },
        { target:"We are going to the beach", hint:"Kami sedang pergi ke pantai", words:["We","are","going","to","the","beach","park"], hints:["Mulai dengan 'We'.","Present continuous.","We + are + going + to + the + beach."] },
        { target:"Please open the window", hint:"Tolong buka jendelanya", words:["Please","open","the","window","close","door"], hints:["Mulai dengan 'Please'.","Imperatif.","Please + open + the + window."] },
        { target:"I have two younger sisters", hint:"Saya punya dua adik perempuan", words:["I","have","two","younger","sisters","brothers","three"], hints:["Mulai dengan 'I have'.","Perhatikan jumlah.","I + have + two + younger + sisters."] },
        { target:"The food is very delicious", hint:"Makanannya sangat enak", words:["The","food","is","very","delicious","bad","drink"], hints:["Mulai dengan 'The food'.","Kata sifat tepat.","The + food + is + very + delicious."] },
        { target:"My phone battery is low", hint:"Baterai ponselku lemah", words:["My","phone","battery","is","low","high","laptop"], hints:["Mulai dengan 'My phone'.","Kata sifat tepat.","My + phone + battery + is + low."] },
        { target:"She does not like spicy food", hint:"Dia tidak suka makanan pedas", words:["She","does","not","like","spicy","food","sweet"], hints:["Mulai dengan 'She'.","'does not' untuk She.","She + does + not + like + spicy + food."] },
    ],
    mode2: [
        { question:"She ___ to the market yesterday.", answer:"went", options:["go","goes","went","gone"], hint:"Kejadian lampau (V2)" },
        { question:"I ___ English right now.", answer:"am studying", options:["study","am studying","studied","was studying"], hint:"Present Continuous" },
        { question:"He ___ breakfast every morning.", answer:"eats", options:["eat","eats","ate","is eating"], hint:"Simple Present (He/She/It)" },
        { question:"They ___ football when it started raining.", answer:"were playing", options:["played","play","were playing","had played"], hint:"Past Continuous" },
        { question:"By next year, I ___ this course.", answer:"will have finished", options:["finish","will finish","will have finished","have finished"], hint:"Future Perfect" },
        { question:"She ___ never visited Paris before.", answer:"has never visited", options:["has never visited","never visited","never visits","had never visited"], hint:"Present Perfect" },
        { question:"Water ___ at 100 degrees Celsius.", answer:"boils", options:["boil","boils","boiled","is boiling"], hint:"Fakta ilmiah = Simple Present" },
        { question:"I ___ my keys! I can't find them.", answer:"have lost", options:["lost","lose","have lost","had lost"], hint:"Present Perfect" },
        { question:"When I arrived, she ___ already left.", answer:"had already left", options:["already left","has already left","had already left","was already leaving"], hint:"Past Perfect" },
        { question:"I ___ in this city for 5 years.", answer:"have lived", options:["live","lived","have lived","am living"], hint:"Present Perfect" },
        { question:"The train ___ at 9 AM tomorrow.", answer:"departs", options:["depart","departs","will depart","is departing"], hint:"Jadwal tetap = Simple Present" },
        { question:"She ___ when the phone rang.", answer:"was sleeping", options:["slept","sleeps","was sleeping","is sleeping"], hint:"Past Continuous" },
        { question:"By the time we got there, the movie ___.", answer:"had started", options:["started","has started","had started","was starting"], hint:"Past Perfect" },
        { question:"I ___ this book three times already.", answer:"have read", options:["read","reads","have read","had read"], hint:"Present Perfect" },
        { question:"They ___ the project by next Friday.", answer:"will have completed", options:["complete","completed","will complete","will have completed"], hint:"Future Perfect" },
    ],
    mode3: [
        { question:"The sun rises from the West.", answer:"False", hint:"Check your compass!" },
        { question:"Python is a programming language.", answer:"True", hint:"Masa anak Tekkom gatau ini wkwk" },
        { question:"The capital city of Australia is Sydney.", answer:"False", hint:"Canberra bro!" },
        { question:"HTML stands for HyperText Markup Language.", answer:"True", hint:"Basic banget!" },
        { question:"A byte consists of 16 bits.", answer:"False", hint:"1 byte = 8 bits!" },
        { question:"The Great Wall of China is visible from space.", answer:"False", hint:"Mitos!" },
        { question:"JavaScript can run on a server using Node.js.", answer:"True", hint:"Node.js = runtime JS server." },
        { question:"SQL stands for Structured Query Language.", answer:"True", hint:"Bahasa database." },
        { question:"Binary code uses digits 0, 1, and 2.", answer:"False", hint:"Hanya 0 dan 1!" },
        { question:"An IP address identifies a device on a network.", answer:"True", hint:"Alamat unik perangkat." },
        { question:"RAM stands for Read Access Memory.", answer:"False", hint:"Random Access Memory!" },
        { question:"The first computer bug was an actual insect.", answer:"True", hint:"1947, ada ngengat nyangkut!" },
        { question:"CSS is a programming language.", answer:"False", hint:"Stylesheet language." },
        { question:"Google was founded in 1998.", answer:"True", hint:"Larry Page & Sergey Brin!" },
        { question:"An algorithm must always use loops.", answer:"False", hint:"Bisa kondisi atau rekursi." },
    ]
};

// ── SOUND ──
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function getAudioCtx() { if (!audioCtx) audioCtx = new AudioCtx(); return audioCtx; }
function playSound(type) {
    try {
        const ctx=getAudioCtx(), osc=ctx.createOscillator(), gain=ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        if (type==='correct') {
            osc.type='sine'; osc.frequency.setValueAtTime(440,ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(880,ctx.currentTime+0.15);
            gain.gain.setValueAtTime(0.3,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.4);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.4);
        } else if (type==='wrong') {
            osc.type='sawtooth'; osc.frequency.setValueAtTime(300,ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(100,ctx.currentTime+0.3);
            gain.gain.setValueAtTime(0.2,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.3);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.3);
        } else if (type==='complete') {
            [523,659,784,1047].forEach((freq,i)=>{
                const o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g); g.connect(ctx.destination);
                o.type='sine'; o.frequency.value=freq;
                g.gain.setValueAtTime(0,ctx.currentTime+i*0.12); g.gain.linearRampToValueAtTime(0.3,ctx.currentTime+i*0.12+0.05); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.12+0.3);
                o.start(ctx.currentTime+i*0.12); o.stop(ctx.currentTime+i*0.12+0.35);
            });
        } else if (type==='click') {
            osc.type='sine'; osc.frequency.setValueAtTime(600,ctx.currentTime);
            gain.gain.setValueAtTime(0.1,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.08);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.08);
        }
    } catch(e) { console.warn('Sound:',e); }
}

// ── LOCAL FALLBACK DB (used when offline) ──
function emptyUser(name, i) {
    return { name, absen: i+1, played:0, correct:0, errors:0, achievements:{}, modeStats:{}, lastActive:0 };
}
let classDatabase = classList.map((name,i) => emptyUser(name,i));

// ── FIREBASE DB HELPERS ──
// Save single user to Firebase
async function fbSaveUser(user) {
    try {
        await set(ref(db, `users/${user.name}`), user);
        showSyncStatus('ok');
    } catch(e) {
        console.warn('FB write error:', e);
        showSyncStatus('err');
        // Fallback: save locally
        localStorage.setItem(`CE2F_user_${user.name}`, JSON.stringify(user));
    }
}

// Load all users from Firebase once
async function fbLoadAll() {
    try {
        const snap = await get(ref(db, 'users'));
        if (snap.exists()) {
            const data = snap.val();
            classDatabase = classList.map((name, i) => {
                const saved = data[name];
                if (saved) return { achievements:{}, modeStats:{}, lastActive:0, ...saved };
                return emptyUser(name, i);
            });
        } else {
            // First time: push all users to Firebase
            const batch = {};
            classDatabase.forEach(u => { batch[u.name] = u; });
            await set(ref(db, 'users'), batch);
        }
        showSyncStatus('ok');
    } catch(e) {
        console.warn('FB load error:', e);
        showSyncStatus('err');
        // Try local fallback
        classDatabase = classList.map((name,i) => {
            const saved = localStorage.getItem(`CE2F_user_${name}`);
            return saved ? JSON.parse(saved) : emptyUser(name,i);
        });
    }
}

// Live listener for leaderboard — updates in real time for all devices
function fbListenLeaderboard() {
    onValue(ref(db, 'users'), (snap) => {
        if (!snap.exists()) return;
        const data = snap.val();
        classDatabase = classList.map((name,i) => {
            const saved = data[name];
            return saved ? { achievements:{}, modeStats:{}, lastActive:0, ...saved } : emptyUser(name,i);
        });
        // If leaderboard is currently visible, re-render it live
        if (!document.getElementById('menu-leaderboard').classList.contains('hidden')) {
            renderLeaderboard();
        }
        // Update login stats if login screen visible
        if (document.getElementById('login-screen').style.display !== 'none') {
            updateLoginStats();
        }
    });
}

// Sync status indicator
function showSyncStatus(status) {
    const el = document.getElementById('sync-status');
    if (!el) return;
    if (status === 'ok') {
        el.innerText = t('sync_ok');
        el.className = 'text-[8px] text-green-400 font-bold';
    } else if (status === 'err') {
        el.innerText = t('sync_err');
        el.className = 'text-[8px] text-yellow-400 font-bold';
    } else {
        el.innerText = t('syncing');
        el.className = 'text-[8px] text-blue-400 font-bold animate-pulse';
    }
}

// ── SESSION ──
function saveSession(n) { localStorage.setItem('CE2F_SESSION',n); }
function clearSession() { localStorage.removeItem('CE2F_SESSION'); }
function getSavedSession() { return localStorage.getItem('CE2F_SESSION'); }

// ── ONLINE/OFFLINE ──
const ONLINE_THRESHOLD = 5 * 60 * 1000;
function isOnline(user) { return user.lastActive && (Date.now()-user.lastActive)<ONLINE_THRESHOLD; }
async function heartbeat() {
    if (!loggedInUser) return;
    const user = classDatabase.find(u=>u.name===loggedInUser);
    if (!user) return;
    user.lastActive = Date.now();
    try { await update(ref(db, `users/${loggedInUser}`), { lastActive: user.lastActive }); }
    catch(e) { localStorage.setItem(`CE2F_user_${loggedInUser}`, JSON.stringify(user)); }
}

// ── ACHIEVEMENTS ──
const ACH_LEVEL_THRESHOLDS = [0,1,3,7,12,20];
const ACH_DEFS = [
    { id:"played_total",  icon:"🎮", names:["–","First Boot","Regular User","Dedicated Coder","Quiz Addict","LingoReal Legend"], descs:["Belum main","Main 1x","Main 3x","Main 7x","Main 12x","Main 20x"], trackFn:u=>u.played },
    { id:"correct_total", icon:"✅", names:["–","First Strike","Sharpshooter","Answer Machine","Precision Engineer","Perfect Compiler"], descs:["Belum benar","1 benar","3 benar","7 benar","12 benar","20 benar"], trackFn:u=>u.correct },
    { id:"errors_total",  icon:"💥", names:["–","Bug Starter","Bug Hunter","Error Veteran","Crash Master","Chaos Engineer"], descs:["Belum error","Error 1x","Error 3x","Error 7x","Error 12x","Error 20x"], trackFn:u=>u.errors },
    { id:"diff_beginner", icon:"🌱", names:["–","Sapling","Sprout","Seedling Pro","Growth Hacker","Bloom Master"], descs:["–","Beginner 1x","3x","7x","12x","20x"], trackFn:u=>(u.achievements.diff_beginner||0) },
    { id:"diff_intermediate", icon:"⚡", names:["–","Volt Spark","Thunder Coder","Storm Solver","Circuit Breaker","Voltage Overlord"], descs:["–","Intermediate 1x","3x","7x","12x","20x"], trackFn:u=>(u.achievements.diff_intermediate||0) },
    { id:"diff_advanced", icon:"🔥", names:["–","Ember","Blaze Coder","Inferno Dev","Wildfire Engineer","Phoenix Ascendant"], descs:["–","Advanced 1x","3x","7x","12x","20x"], trackFn:u=>(u.achievements.diff_advanced||0) },
    { id:"arrange_beginner", icon:"🔤", names:["–","Newbie Arranger","Word Weaver","Syntax Scout","Sentence Smith","Lexicon Architect"], descs:["–","Arrange Beginner 1x","3x","7x","12x","20x"], trackFn:u=>(u.achievements.arrange_beginner||0) },
    { id:"arrange_intermediate", icon:"🔡", names:["–","Phrase Builder","Clause Crafter","Grammar Guerrilla","Syntax Commander","Sentence Sovereign"], descs:["–","Arrange Intermediate 1x","3x","7x","12x","20x"], trackFn:u=>(u.achievements.arrange_intermediate||0) },
    { id:"arrange_advanced", icon:"🔠", names:["–","Elite Arranger","Wordsmith Pro","Syntax Virtuoso","Linguistic Warlord","Grand Sentence Architect"], descs:["–","Arrange Advanced 1x","3x","7x","12x","20x"], trackFn:u=>(u.achievements.arrange_advanced||0) },
    { id:"tenses_beginner", icon:"⏱️", names:["–","Tense Rookie","Past Dabbler","Present Planner","Future Gazer","Time Initiate"], descs:["–","Tenses Beginner 1x","3x","7x","12x","20x"], trackFn:u=>(u.achievements.tenses_beginner||0) },
    { id:"tenses_intermediate", icon:"⏳", names:["–","Tense Tactician","Verb Veteran","Grammar Gladiator","Tense Titan","Chronological Commander"], descs:["–","Tenses Intermediate 1x","3x","7x","12x","20x"], trackFn:u=>(u.achievements.tenses_intermediate||0) },
    { id:"tenses_advanced", icon:"🕰️", names:["–","Perfect Master","Temporal Assassin","Grammar Overlord","Tense Warlord","Omniscient Grammarian"], descs:["–","Tenses Advanced 1x","3x","7x","12x","20x"], trackFn:u=>(u.achievements.tenses_advanced||0) },
    { id:"tf_beginner", icon:"⚖️", names:["–","Fact Freshman","Truth Seeker","Reality Checker","Myth Buster Jr.","Logic Apprentice"], descs:["–","T/F Beginner 1x","3x","7x","12x","20x"], trackFn:u=>(u.achievements.tf_beginner||0) },
    { id:"tf_intermediate", icon:"🔍", names:["–","Fact Detective","Truth Analyst","Reality Engineer","Myth Destroyer","Logic Strategist"], descs:["–","T/F Intermediate 1x","3x","7x","12x","20x"], trackFn:u=>(u.achievements.tf_intermediate||0) },
    { id:"tf_advanced", icon:"🧠", names:["–","Knowledge Assassin","Truth Overlord","Fact Annihilator","Reality Dominator","Omniscient Oracle"], descs:["–","T/F Advanced 1x","3x","7x","12x","20x"], trackFn:u=>(u.achievements.tf_advanced||0) },
];
function getAchLevel(def,user) { const v=def.trackFn(user); let lv=0; for(let i=1;i<=5;i++){if(v>=ACH_LEVEL_THRESHOLDS[i])lv=i;} return lv; }
function achBadgeHTML(def,lv) { if(!lv) return ''; return `<span class="badge-ach badge-ach-${lv}">${def.icon} ${def.names[lv]}</span>`; }

// ── BADGES ──
function badgeHTML(type) {
    switch(type){
        case 'ce2f':     return `<span class="badge-ce2f">🎓 CE-2F</span>`;
        case 'webdev':   return `<span class="badge-webdev">⚡ WEB DEV</span>`;
        case 'lecturer': return `<span class="badge-lecturer">🎖️ LECTURER</span>`;
        case 'gold':     return `<span class="badge-gold">👑 ENG GOLD</span>`;
        case 'silver':   return `<span class="badge-silver">🥈 SILVER</span>`;
        case 'bronze':   return `<span class="badge-bronze">🥉 BRONZE</span>`;
        default: return '';
    }
}
function getBadges(student, rank) {
    let b = [badgeHTML('ce2f')];
    if (student.name==="Azwar") b.push(badgeHTML('webdev'));
    if (student.name==="Winda") b.push(badgeHTML('lecturer'));
    if (student.correct>0 && student.name!=="Winda") {
        if (rank===1) b.push(badgeHTML('gold'));
        else if (rank===2) b.push(badgeHTML('silver'));
        else if (rank===3) b.push(badgeHTML('bronze'));
    }
    const achB = ACH_DEFS.map(d=>({d,lv:getAchLevel(d,student)})).filter(x=>x.lv>0).sort((a,b2)=>b2.lv-a.lv).slice(0,3).map(x=>achBadgeHTML(x.d,x.lv));
    b.push(...achB);
    return b.join(' ');
}

// ── FAV MODE/DIFF ──
function getFavMode(user) {
    const ms=user.modeStats||{};
    const modes={
        mode1:(ms.arrange_beginner||0)+(ms.arrange_intermediate||0)+(ms.arrange_advanced||0),
        mode2:(ms.tenses_beginner||0)+(ms.tenses_intermediate||0)+(ms.tenses_advanced||0),
        mode3:(ms.tf_beginner||0)+(ms.tf_intermediate||0)+(ms.tf_advanced||0),
    };
    const best=Object.entries(modes).sort((a,b)=>b[1]-a[1])[0];
    return (!best||best[1]===0) ? null : best[0];
}
function getFavDiff(user) {
    const a=user.achievements||{};
    const d={beginner:a.diff_beginner||0,intermediate:a.diff_intermediate||0,advanced:a.diff_advanced||0};
    const best=Object.entries(d).sort((a,b)=>b[1]-a[1])[0];
    return (!best||best[1]===0) ? null : best[0];
}
function modeName(k) { return ({mode1:t('fav_arrange'),mode2:t('fav_tenses'),mode3:t('fav_tf')})[k]||t('fav_none'); }
function diffLabel(k) {
    if (!k) return t('fav_none');
    return ({beginner:DIFFICULTY_CONFIG.beginner.icon+' '+t('diff_beginner'),intermediate:DIFFICULTY_CONFIG.intermediate.icon+' '+t('diff_intermediate'),advanced:DIFFICULTY_CONFIG.advanced.icon+' '+t('diff_advanced')})[k]||t('fav_none');
}

// ── UI STATE ──
let currentIdx=0, currentErrorCount=0, selectedWords=[];
let loggedInUser="", currentMode="mode1", currentDifficulty="";
let activeQuestions=[];
let prevMenuBeforeInspect='leaderboard';

function addLog(msg) {
    const el=document.getElementById('terminal'); if(!el) return;
    const p=document.createElement('p'); p.innerText=`> ${msg}`; el.appendChild(p); el.scrollTop=el.scrollHeight;
}

let terminalVisible=false; // hidden by default on mobile
window.toggleTerminal=()=>{
    terminalVisible=!terminalVisible;
    const el=document.getElementById('terminal');
    el.classList.toggle('hidden-term',!terminalVisible);
    document.getElementById('terminal-toggle').querySelector('div').innerText=terminalVisible?'▼ LOG':'▲ LOG';
};

// ── LOGIN ──
async function enterDashboard(name, showWelcome=true) {
    loggedInUser = name;
    saveSession(name);

    showSyncStatus('syncing');
    await fbLoadAll(); // load fresh data from Firebase
    fbListenLeaderboard(); // subscribe to live updates

    const go = () => {
        document.getElementById('login-screen').style.display='none';
        document.getElementById('main-dashboard').classList.remove('hidden');
        updateUserDashboard();
        applyLang();
        heartbeat();
        setInterval(heartbeat, 60000);
        addLog(`Authorized: ${loggedInUser}.`);
        addLog(`Firebase: connected.`);
        const mbl=document.getElementById('mobile-username-label');
        if (mbl) mbl.innerText=loggedInUser;
    };

    if (!showWelcome) { go(); return; }
    const w=document.createElement('div');
    w.className="fixed inset-0 bg-[#0a0f1e] z-[300] flex flex-col items-center justify-center text-center p-6 animate__animated animate__fadeIn";
    w.innerHTML=`<div class="animate__animated animate__zoomIn"><div class="text-6xl mb-4">⚡</div><h1 class="text-4xl font-black text-white italic mb-2">YO WELKAM BEK CUY!</h1><p class="text-blue-400 font-bold text-xl">Target: <span class="text-white">${name}</span></p><p class="text-gray-500 text-xs mt-10 animate-pulse">INITIATING CE-2F PROTOCOL...</p></div>`;
    document.body.appendChild(w);
    setTimeout(()=>{ w.classList.add('animate__fadeOut'); setTimeout(()=>{ w.remove(); go(); },500); },2000);
}

window.addEventListener('DOMContentLoaded', async () => {
    spawnCodeRain();
    applyLang();
    // Load data for login page stats (no login needed)
    await fbLoadAll();
    fbListenLeaderboard();
    updateLoginStats();

    const saved=getSavedSession();
    if (saved && classList.includes(saved)) enterDashboard(saved, false);

    // Terminal hidden by default
    document.getElementById('terminal').classList.add('hidden-term');
});

document.getElementById('login-btn').onclick = () => {
    playSound('click');
    let input=document.getElementById('username-input').value.trim();
    if (!input) return;
    let fmt=input.charAt(0).toUpperCase()+input.slice(1).toLowerCase();
    if (input.toLowerCase().includes("dosen")) fmt="Winda";
    if (classList.includes(fmt)) enterDashboard(fmt,true);
    else document.getElementById('login-error').classList.remove('hidden');
};
document.getElementById('username-input').addEventListener('keydown',e=>{ if(e.key==='Enter') document.getElementById('login-btn').click(); });
window.doLogout=()=>{ clearSession(); location.reload(); };

// ── LOGIN STATS ──
function updateLoginStats() {
    const total=classDatabase.reduce((a,u)=>a+u.played,0);
    const online=classDatabase.filter(u=>isOnline(u)).length;
    document.getElementById('login-stat-members').innerText=classList.length;
    document.getElementById('login-stat-online').innerText=online;
    document.getElementById('login-stat-quizzes').innerText=total;
    const top=[...classDatabase].filter(u=>u.name!=="Winda").sort((a,b)=>b.correct-a.correct)[0];
    if (top&&top.correct>0) {
        document.getElementById('login-top-player').classList.remove('hidden');
        document.getElementById('login-top-name').innerText=top.name;
        document.getElementById('login-top-score').innerText=top.correct;
    }
    const ticker=document.getElementById('login-ticker');
    const msgs=["🚀 LingoReal Pro — CE-2F English Practice","💡 Belajar bahasa Inggris sambil bersaing!","🏆 Cek leaderboard & buktikan skill lo!",`📊 Total Quiz: ${total}`,`👥 ${classList.length} Engineers terdaftar`,"⚡ Arrange · Tenses · True/False","🌱 Beginner → ⚡ Intermediate → 🔥 Advanced"];
    ticker.innerHTML=[...msgs,...msgs].map(m=>`<span class="px-8">${m}</span>`).join('');
}

// ── USER DASHBOARD ──
function updateUserDashboard() {
    const user=classDatabase.find(u=>u.name===loggedInUser); if(!user) return;
    const sorted=[...classDatabase].sort((a,b)=>b.correct-a.correct);
    const rank=sorted.findIndex(u=>u.name===loggedInUser)+1;

    document.getElementById('stat-name').innerText=user.name;
    document.getElementById('stat-played').innerText=user.played;
    document.getElementById('stat-errors').innerText=user.errors;
    document.getElementById('user-badge-main').innerHTML=getBadges(user,rank);

    if (user.name==="Winda") {
        document.getElementById('label-absensi').innerText="Jabatan";
        document.getElementById('stat-absensi').innerText="Dosen";
        const sub=document.getElementById('stat-absensi-sub'); sub.innerText="English Practice"; sub.classList.remove('hidden');
    } else {
        document.getElementById('label-absensi').innerText=currentLang==='id'?"Absensi Ke-":"Attendance No.";
        document.getElementById('stat-absensi').innerText=user.absen;
        document.getElementById('stat-absensi-sub').classList.add('hidden');
    }

    const rankLabels=['','ELITE GOLD','ELITE SILVER','ELITE BRONZE'];
    document.getElementById('stat-rank').innerText=`#${rank}`;
    document.getElementById('stat-rank-label').innerText=rank<=3?rankLabels[rank]:'STUDENT ENGINEER';

    const favM=getFavMode(user), favD=getFavDiff(user);
    document.getElementById('stat-fav-mode').innerText=favM?modeName(favM):t('fav_none');
    document.getElementById('stat-fav-diff').innerText=favD?diffLabel(favD):'---';

    const total=user.correct+user.errors, pct=total>0?Math.round((user.correct/total)*100):0;
    document.getElementById('stat-acc-bar').style.width=`${pct}%`;
    document.getElementById('stat-acc-pct').innerText=`${pct}%`;
    document.getElementById('stat-acc-correct').innerText=`${user.correct} ✓`;
    document.getElementById('stat-acc-errors').innerText=`${user.errors} ✗`;

    const dot=document.getElementById('my-status-dot'), txt=document.getElementById('my-status-text');
    if(dot&&txt){ dot.className='dot-online'; txt.innerText=t('online_label'); txt.className='text-xs text-green-400 font-bold'; }

    const topAch=ACH_DEFS.map(d=>({d,lv:getAchLevel(d,user)})).filter(x=>x.lv>0).sort((a,b)=>b.lv-a.lv).slice(0,6);
    const prev=document.getElementById('profile-ach-preview');
    if(prev) prev.innerHTML=topAch.length?topAch.map(x=>achBadgeHTML(x.d,x.lv)).join(''):`<span class="text-gray-600 text-xs">Belum ada achievement. Mulai quiz!</span>`;
}

window.switchMenu=(menuName)=>{
    playSound('click');
    document.querySelectorAll('.menu-content').forEach(el=>el.classList.add('hidden'));
    document.querySelectorAll('.menu-btn').forEach(el=>{ el.classList.remove('bg-blue-600','text-white'); el.classList.add('text-gray-400','hover:bg-white/5'); });
    document.getElementById(`menu-${menuName}`).classList.remove('hidden');
    const btn=document.querySelector(`[data-menu="${menuName}"]`);
    if(btn){ btn.classList.add('bg-blue-600','text-white'); btn.classList.remove('text-gray-400','hover:bg-white/5'); }
    if(menuName==='leaderboard') renderLeaderboard();
    if(menuName==='achievement') renderAchievements();
    if(menuName==='user') updateUserDashboard();
};

// ── INSPECT USER ──
window.inspectUser=(name)=>{
    prevMenuBeforeInspect='leaderboard';
    const user=classDatabase.find(u=>u.name===name); if(!user) return;
    const sorted=[...classDatabase].sort((a,b)=>b.correct-a.correct);
    const rank=sorted.findIndex(u=>u.name===name)+1;
    const total=user.correct+user.errors, pct=total>0?Math.round((user.correct/total)*100):0;
    const favM=getFavMode(user), favD=getFavDiff(user);
    const topAch=ACH_DEFS.map(d=>({d,lv:getAchLevel(d,user)})).filter(x=>x.lv>0).sort((a,b)=>b.lv-a.lv).slice(0,6);
    const onlineDot=isOnline(user)?`<span class="dot-online"></span><span class="text-xs text-green-400 font-bold ml-1">${t('online_label')}</span>`:`<span class="dot-offline"></span><span class="text-xs text-gray-500 font-bold ml-1">${t('offline_label')}</span>`;
    const rankLabels=['','ELITE GOLD','ELITE SILVER','ELITE BRONZE'];
    const isWinda=name==="Winda";
    document.getElementById('inspect-content').innerHTML=`
        <div class="space-y-4">
            <div class="bg-[#1e293b] rounded-2xl p-5 border border-white/5">
                <div class="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 class="text-2xl font-black text-white">${user.name}</h2>
                    <div class="flex items-center gap-1.5">${onlineDot}</div>
                </div>
                <div class="flex flex-wrap gap-1.5 mb-2">${getBadges(user,rank)}</div>
                <p class="text-yellow-400 font-black text-sm">#${rank} — ${rank<=3?rankLabels[rank]:'STUDENT ENGINEER'}</p>
                ${isWinda?'<p class="text-gray-400 text-xs mt-1">Jabatan: <span class="text-blue-400 font-bold">Dosen</span> · English Practice</p>':`<p class="text-gray-400 text-xs mt-1">Absensi ke-<span class="text-blue-400 font-bold">${user.absen}</span></p>`}
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-1">Played</p><p class="text-xl font-black text-green-400">${user.played}</p></div>
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-1">Correct</p><p class="text-xl font-black text-blue-400">${user.correct}</p></div>
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-1">Errors</p><p class="text-xl font-black text-red-400">${user.errors}</p></div>
                <div class="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 p-4 rounded-2xl"><p class="text-gray-500 text-[9px] uppercase font-black mb-1">Rank</p><p class="text-xl font-black text-yellow-400">#${rank}</p></div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5">
                    <p class="text-gray-500 text-[9px] uppercase font-black mb-2">Accuracy</p>
                    <div class="flex gap-2 items-center mb-1"><div class="flex-1 bg-gray-800 h-2.5 rounded-full overflow-hidden"><div class="bg-green-500 h-full rounded-full" style="width:${pct}%"></div></div><span class="text-sm font-black text-green-400">${pct}%</span></div>
                    <div class="flex justify-between text-[8px]"><span class="text-green-400 font-bold">${user.correct} ✓</span><span class="text-red-400 font-bold">${user.errors} ✗</span></div>
                </div>
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5">
                    <p class="text-gray-500 text-[9px] uppercase font-black mb-2">Fav Mode</p>
                    <p class="text-base font-black text-purple-400">${favM?modeName(favM):t('fav_none')}</p>
                    <p class="text-[8px] text-gray-500 mt-0.5">${favD?diffLabel(favD):'---'}</p>
                </div>
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5">
                    <p class="text-gray-500 text-[9px] uppercase font-black mb-2">Quiz Breakdown</p>
                    ${['beginner','intermediate','advanced'].map(d=>`<div class="flex justify-between text-[9px] mb-1"><span class="text-gray-400">${DIFFICULTY_CONFIG[d].icon} ${d.charAt(0).toUpperCase()+d.slice(1)}</span><span class="font-bold text-white">${user.achievements[`diff_${d}`]||0}x</span></div>`).join('')}
                </div>
            </div>
            <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5">
                <p class="text-gray-500 text-[9px] uppercase font-black mb-3">Top Achievements</p>
                <div class="flex flex-wrap gap-2">${topAch.length?topAch.map(x=>achBadgeHTML(x.d,x.lv)).join(''):`<span class="text-gray-600 text-xs">Belum ada achievement</span>`}</div>
            </div>
        </div>`;
    document.querySelectorAll('.menu-content').forEach(el=>el.classList.add('hidden'));
    document.getElementById('menu-inspect').classList.remove('hidden');
};
window.backFromInspect=()=>{ switchMenuDirect(prevMenuBeforeInspect); };
function switchMenuDirect(menuName) {
    document.querySelectorAll('.menu-content').forEach(el=>el.classList.add('hidden'));
    document.querySelectorAll('.menu-btn').forEach(el=>{ el.classList.remove('bg-blue-600','text-white'); el.classList.add('text-gray-400'); });
    document.getElementById(`menu-${menuName}`).classList.remove('hidden');
    const btn=document.querySelector(`[data-menu="${menuName}"]`);
    if(btn){ btn.classList.add('bg-blue-600','text-white'); btn.classList.remove('text-gray-400'); }
    if(menuName==='leaderboard') renderLeaderboard();
}

// ── DIFFICULTY ──
window.selectDifficulty=diff=>{
    playSound('click'); currentDifficulty=diff;
    document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('ring-4','ring-white/40','scale-105'));
    document.getElementById(`diff-${diff}`)?.classList.add('ring-4','ring-white/40','scale-105');
};
function shuffleArray(arr) { for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

window.startActualQuiz=mode=>{
    if(!currentDifficulty){ const h=document.getElementById('diff-hint'); h.classList.remove('hidden'); setTimeout(()=>h.classList.add('hidden'),2500); return; }
    playSound('click');
    currentMode=mode; currentIdx=0;
    activeQuestions=shuffleArray([...allQuestions[currentMode]]).slice(0,DIFFICULTY_CONFIG[currentDifficulty].count);
    document.getElementById('quiz-ready').classList.add('hidden');
    document.getElementById('game-engine').classList.remove('hidden');
    const user=classDatabase.find(u=>u.name===loggedInUser);
    user.played++; fbSaveUser(user); updateUserDashboard();
    addLog(`Quiz: ${mode} | ${currentDifficulty}`);
    init();
};

// ── QUIZ ENGINE ──
function init() {
    const q=activeQuestions[currentIdx];
    const optZone=document.getElementById('options-zone'), ansZone=document.getElementById('answer-zone');
    optZone.innerHTML=""; ansZone.innerHTML="";
    selectedWords=[]; currentErrorCount=0;
    document.getElementById('ai-feedback').classList.add('hidden');
    document.getElementById('q-number').innerText=`Task ${currentIdx+1}/${activeQuestions.length}`;
    document.getElementById('progress-bar').style.width=`${(currentIdx/activeQuestions.length)*100}%`;
    document.getElementById('check-btn').innerText=t('execute_btn');

    if(currentMode==='mode1'){
        document.getElementById('soal-teks').innerText=`"${q.hint}"`;
        ansZone.classList.remove('hidden');
        [...q.words].sort(()=>Math.random()-0.5).forEach(word=>{
            const btn=createNode('button',word,"bg-white text-gray-700 px-4 py-2 rounded-2xl font-bold border-b-4 border-gray-100 shadow-sm text-sm");
            btn.onclick=()=>{ playSound('click'); selectedWords.push(word); btn.style.visibility='hidden';
                const chip=createNode('button',word,"bg-blue-600 text-white px-4 py-2 rounded-2xl font-bold animate__animated animate__bounceIn text-sm");
                chip.onclick=()=>{ playSound('click'); selectedWords=selectedWords.filter(w=>w!==word); chip.remove(); btn.style.visibility='visible'; };
                ansZone.appendChild(chip); };
            optZone.appendChild(btn);
        });
    } else {
        document.getElementById('soal-teks').innerText=q.question;
        ansZone.classList.add('hidden');
        const choices=currentMode==='mode2'?q.options:[currentLang==='id'?'Benar':'True',currentLang==='id'?'Salah':'False'];
        choices.forEach(opt=>{
            const btn=createNode('button',opt,"bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold border border-white/10 hover:bg-blue-600 transition-all text-sm");
            btn.onclick=()=>{ playSound('click');
                selectedWords=currentMode==='mode3'?[opt==='Benar'?'True':opt==='Salah'?'False':opt]:[opt];
                document.querySelectorAll('#options-zone button').forEach(b=>b.classList.remove('ring-4','ring-blue-500','bg-blue-600'));
                btn.classList.add('ring-4','ring-blue-500','bg-blue-600'); };
            optZone.appendChild(btn);
        });
    }
}
function createNode(t2,text,cls){ const el=document.createElement(t2); el.innerText=text; el.className=cls; return el; }

// ── CHECK ANSWER ──
const successOverlay=document.createElement('div');
successOverlay.className="hidden fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] p-6";
document.body.appendChild(successOverlay);

document.getElementById('check-btn').onclick=()=>{
    const q=activeQuestions[currentIdx];
    const userAnswer=currentMode==='mode1'?selectedWords.join(" "):selectedWords[0];
    const correct=q.target||q.answer;
    if(userAnswer===correct){
        playSound('correct');
        const user=classDatabase.find(u=>u.name===loggedInUser);
        user.correct++; fbSaveUser(user);
        currentIdx===activeQuestions.length-1?showFinalStats():showSuccess();
    } else {
        playSound('wrong');
        const user=classDatabase.find(u=>u.name===loggedInUser);
        user.errors++; fbSaveUser(user); updateUserDashboard();
        document.getElementById('ai-feedback').classList.remove('hidden');
        document.getElementById('ai-text').innerText=q.hints?q.hints[currentErrorCount%3]:`${t('alert_label')}: ${q.hint}`;
        currentErrorCount++;
    }
};
function showSuccess(){
    successOverlay.innerHTML=`<div class="bg-[#1e293b] border-2 border-blue-500 p-8 rounded-3xl max-w-sm w-full text-center animate__animated animate__zoomIn shadow-2xl"><div class="text-6xl mb-4">🚀</div><h2 class="text-2xl font-black text-blue-400 mb-2 italic uppercase">${t('success_title')}</h2><button onclick="nextQ()" class="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-[0_4px_0_0_#1d4ed8]">${t('success_btn')}</button></div>`;
    successOverlay.classList.remove('hidden');
}
window.nextQ=()=>{ successOverlay.classList.add('hidden'); currentIdx++; init(); };

function showFinalStats(){
    playSound('complete');
    const user=classDatabase.find(u=>u.name===loggedInUser);
    if(!user.achievements) user.achievements={};
    user.achievements[`diff_${currentDifficulty}`]=(user.achievements[`diff_${currentDifficulty}`]||0)+1;
    const modeKey={mode1:'arrange',mode2:'tenses',mode3:'tf'}[currentMode];
    const comboKey=`${modeKey}_${currentDifficulty}`;
    user.achievements[comboKey]=(user.achievements[comboKey]||0)+1;
    if(!user.modeStats) user.modeStats={};
    user.modeStats[comboKey]=(user.modeStats[comboKey]||0)+1;
    fbSaveUser(user); updateUserDashboard();
    const cfg=DIFFICULTY_CONFIG[currentDifficulty];
    document.getElementById('game-engine').innerHTML=`
        <div class="bg-[#1e293b] border-2 border-blue-500/50 rounded-3xl p-8 text-center animate__animated animate__fadeInUp">
            <div class="text-6xl mb-4">🎯</div>
            <h1 class="text-2xl font-black mb-1 text-blue-400 italic">MISSION COMPLETE</h1>
            <p class="text-gray-400 text-sm mb-5">${cfg.icon} ${cfg.label} — ${cfg.count} Soal</p>
            <button onclick="goBackToModeSelect()" class="w-full bg-blue-600 py-4 rounded-2xl font-black text-white">${t('complete_btn')}</button>
        </div>`;
    addLog(`Completed: ${modeKey} ${currentDifficulty}`);
}
window.goBackToModeSelect=()=>{
    currentDifficulty="";
    document.getElementById('game-engine').classList.add('hidden');
    document.getElementById('quiz-ready').classList.remove('hidden');
    document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('ring-4','ring-white/40','scale-105'));
};

// ── ACHIEVEMENTS ──
function renderAchievements(){
    const user=classDatabase.find(u=>u.name===loggedInUser);
    const grid=document.getElementById('ach-grid'); grid.innerHTML="";
    let unlocked=0; const total=ACH_DEFS.length*5;
    const lvColors=['bg-gray-700','bg-emerald-500','bg-blue-500','bg-purple-500','bg-amber-500','bg-pink-500'];
    const bdrColors=['border-gray-700/50','border-emerald-500/50','border-blue-500/50','border-purple-500/50','border-amber-500/50','border-purple-400'];
    ACH_DEFS.forEach(def=>{
        const lv=getAchLevel(def,user); if(lv>0) unlocked+=lv;
        const nextLv=lv<5?lv+1:null, nextThr=nextLv?ACH_LEVEL_THRESHOLDS[nextLv]:null;
        const curVal=def.trackFn(user), prog=nextThr?Math.min((curVal/nextThr)*100,100):100;
        const card=document.createElement('div');
        card.className=`ach-card bg-[#1e293b] rounded-2xl p-5 border ${bdrColors[lv]} ${lv===0?'ach-locked':''}`;
        card.innerHTML=`
            <div class="flex items-start gap-3 mb-3"><div class="text-3xl">${def.icon}</div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap mb-1">
                    <p class="font-black text-white text-sm">${def.names[lv]||def.names[0]}</p>
                    ${lv>0?achBadgeHTML(def,lv):'<span class="badge-ach" style="background:#1f2937;border:1px solid #374151;color:#6b7280">LOCKED</span>'}
                </div>
                <p class="text-gray-500 text-[9px]">${def.descs[lv]||def.descs[0]}</p>
            </div></div>
            <div class="flex gap-1.5 mb-2">${[1,2,3,4,5].map(l=>`<div class="flex-1 h-1.5 rounded-full ${l<=lv?lvColors[lv]:'bg-gray-700'} transition-all"></div>`).join('')}</div>
            <div class="flex justify-between items-center">
                <span class="text-[8px] text-gray-500 font-black uppercase">LV ${lv}/5</span>
                ${nextThr?`<span class="text-[8px] text-gray-500">${curVal}/${nextThr} → LV${nextLv}</span>`:`<span class="text-[8px] text-yellow-400 font-black">✨ MAX</span>`}
            </div>
            ${nextThr?`<div class="w-full bg-gray-800 h-1 rounded-full mt-1.5 overflow-hidden"><div class="${lvColors[lv]} h-full rounded-full transition-all" style="width:${prog}%"></div></div>`:''}`;
        grid.appendChild(card);
    });
    document.getElementById('ach-unlocked-count').innerText=unlocked;
    document.getElementById('ach-total-count').innerText=total;
    document.getElementById('ach-global-bar').style.width=`${Math.round((unlocked/total)*100)}%`;
    const topLv=ACH_DEFS.map(d=>getAchLevel(d,user)).reduce((a,b)=>Math.max(a,b),0);
    const ob=document.getElementById('ach-overall-badge');
    if(ob) ob.innerHTML=topLv>0?`<span class="badge-ach badge-ach-${topLv} text-sm px-3 py-1">⭐ LV${topLv}</span>`:'';
}

// ── LEADERBOARD ──
function renderLeaderboard(){
    const tbody=document.getElementById('leaderboard-body'); tbody.innerHTML="";
    const sorted=[...classDatabase].sort((a,b)=>b.correct-a.correct||a.errors-b.errors);
    sorted.forEach((student,i)=>{
        const isMe=student.name===loggedInUser;
        const topAB=ACH_DEFS.map(d=>({d,lv:getAchLevel(d,student)})).filter(x=>x.lv>0).sort((a,b)=>b.lv-a.lv)[0];
        const achB=topAB?achBadgeHTML(topAB.d,topAB.lv):'';
        const statusDot=isOnline(student)?'<span class="dot-online"></span>':'<span class="dot-offline"></span>';
        tbody.innerHTML+=`
            <tr class="${isMe?'bg-blue-500/10':''} border-b border-white/5 hover:bg-white/10 cursor-pointer" onclick="inspectUser('${student.name}')">
                <td class="p-4 font-black text-sm">${i+1}</td>
                <td class="p-4 font-bold text-sm ${isMe?'text-blue-400':'text-blue-100'}">${student.name}${isMe?' <span class="text-[8px] text-gray-500">(you)</span>':''}</td>
                <td class="p-4 text-center">${statusDot}</td>
                <td class="p-4 text-center text-gray-400 text-sm">${student.played}</td>
                <td class="p-4 text-center text-green-400 text-sm">${student.correct}</td>
                <td class="p-4 text-center text-red-400 text-sm">${student.errors}</td>
                <td class="p-4 text-right">${getBadges(student,i+1)} ${achB}</td>
            </tr>`;
    });
}

window.openUserModal=name=>inspectUser(name);
window.closeModal=()=>document.getElementById('user-modal').classList.add('hidden');

// ── ANIMATED LOGIN BG ──
function spawnCodeRain(){
    const c=document.getElementById('code-rain'); if(!c) return;
    const syms=['</>','{}','[]','()','//','&&','||','!=','==','++','--','=>','if','for','let','const','fn','def','int','bool','null','true','false','01','10','0xff','var','new','try','git','npm','API','🖥️','💻','⌨️','🔧','🐍','⚛️','🌐','🔒'];
    for(let i=0;i<30;i++){
        const s=document.createElement('span'); s.className='float-symbol';
        s.innerText=syms[Math.floor(Math.random()*syms.length)];
        s.style.left=`${Math.random()*100}%`;
        s.style.animationDuration=`${6+Math.random()*10}s`;
        s.style.animationDelay=`${Math.random()*8}s`;
        s.style.fontSize=`${0.65+Math.random()*.7}rem`;
        s.style.opacity=`${0.1+Math.random()*.25}`;
        c.appendChild(s);
    }
}