// ============================================================
// LINGOREAL PRO - script.js v7
// Generated Questions, Timer, Confetti, Challenge, No Session
// ============================================================

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
    databaseURL: "https://englishlastproject-ce2f-default-rtdb.asia-southeast1.firebasedatabase.app"
};
const fbApp = initializeApp(firebaseConfig);
const db = getDatabase(fbApp);

// ── CLASS LIST (students only, no Winda) ──
const classList = ["Azwar","Alya","Andreas","Ayu","Beauty","Christian","Clara","Dominica","Drika","Gideon","Jenifer","Johannes","Julita","Khairul","Khayla","Lasko","Lorena","Nazwa","Nuansa","Queenna","Raid","Rony","Siti","Winda"];
const studentNames = classList.filter(n => n !== "Winda");

const DIFFICULTY_CONFIG = {
    beginner:     { label:"BEGINNER",     count:5,  icon:"🌱", time:30 },
    intermediate: { label:"INTERMEDIATE", count:10, icon:"⚡", time:20 },
    advanced:     { label:"ADVANCED",     count:15, icon:"🔥", time:15 },
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
        quiz_select_title:"PILIH MODE QUIZ", quiz_select_sub:"Pilih mode dulu, lalu tentukan tingkat kesulitannya!",
        quiz_step_mode:"Pilih Mode Quiz", quiz_step_diff:"Pilih Tingkat Kesulitan",
        quiz_diff_hint:"⚠️ Pilih difficulty dulu sebelum mulai!",
        diff_beginner:"PEMULA", diff_beginner_count:"5 Soal · 30 detik/soal",
        diff_intermediate:"MENENGAH", diff_intermediate_count:"10 Soal · 20 detik/soal",
        diff_advanced:"MAHIR", diff_advanced_count:"15 Soal · 15 detik/soal",
        mode_arrange:"SUSUN KATA", mode_arrange_sub:"Terjemahkan & Susun",
        mode_tenses:"TENSES", mode_tenses_sub:"Kuasai Tata Bahasa",
        mode_tf:"BENAR/SALAH", mode_tf_sub:"Uji Pengetahuan Umum",
        abort:"Batal ✖", alert_label:"Peringatan Sistem", execute_btn:"JAWAB SEKARANG ⚡",
        time_up:"⏰ Waktu Habis!",
        ach_title:"PAPAN PRESTASI", ach_sub:"Kumpulin semua achievement & flex ke temen lo!",
        ach_unlocked:"Terbuka", ach_total:"Total", ach_progress:"Progres Keseluruhan",
        lb_title:"PERINGKAT GLOBAL CE-2F", lb_rank:"Peringkat", lb_name:"Nama",
        lb_played:"Dimainkan", lb_score:"Skor", lb_errors:"Kesalahan", lb_access:"Badge",
        settings_title:"KONFIGURASI SISTEM", settings_lang_label:"Pilih Bahasa Sistem",
        back_list:"Kembali", success_title:"GACOR COK!", success_btn:"LANJUT >",
        complete_btn:"🔄 Pilih Mode Lagi",
        online_label:"ONLINE", offline_label:"OFFLINE",
        fav_arrange:"Susun Kata", fav_tenses:"Tenses", fav_tf:"True/False", fav_none:"Belum ada",
        syncing:"Menyinkronkan...", sync_ok:"✓ Tersinkron", sync_err:"⚠ Offline",
        challenge_btn:"⚔️ Tantang Teman", challenge_sent:"Tantangan dikirim ke", challenge_title:"TANTANGAN MASUK!",
        challenge_from:"menantang kamu!", challenge_accept:"Terima Tantangan", challenge_decline:"Tolak",
        level_up:"NAIK LEVEL!",
        pick_diff:"Pilih difficulty untuk memulai:",
        start_quiz:"MULAI QUIZ",
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
        quiz_select_title:"PICK QUIZ MODE", quiz_select_sub:"Choose a mode first, then pick your difficulty!",
        quiz_step_mode:"Choose Quiz Mode", quiz_step_diff:"Choose Difficulty",
        quiz_diff_hint:"⚠️ Pick a difficulty before starting!",
        diff_beginner:"BEGINNER", diff_beginner_count:"5 Questions · 30s each",
        diff_intermediate:"INTERMEDIATE", diff_intermediate_count:"10 Questions · 20s each",
        diff_advanced:"ADVANCED", diff_advanced_count:"15 Questions · 15s each",
        mode_arrange:"ARRANGE", mode_arrange_sub:"Build Indo-Eng Sentences",
        mode_tenses:"TENSES", mode_tenses_sub:"Master of Grammar",
        mode_tf:"TRUE/FALSE", mode_tf_sub:"General Knowledge",
        abort:"Abort ✖", alert_label:"System Alert", execute_btn:"EXECUTE ANSWER ⚡",
        time_up:"⏰ Time's Up!",
        ach_title:"ACHIEVEMENT BOARD", ach_sub:"Collect all achievements & flex on classmates!",
        ach_unlocked:"Unlocked", ach_total:"Total", ach_progress:"Overall Progress",
        lb_title:"CE-2F GLOBAL RANKING", lb_rank:"Rank", lb_name:"Name",
        lb_played:"Played", lb_score:"Score", lb_errors:"Errors", lb_access:"Badges",
        settings_title:"SYSTEM CONFIG", settings_lang_label:"Select System Language",
        back_list:"Back", success_title:"NAILED IT!", success_btn:"NEXT TASK >",
        complete_btn:"🔄 Choose Mode Again",
        online_label:"ONLINE", offline_label:"OFFLINE",
        fav_arrange:"Arrange", fav_tenses:"Tenses", fav_tf:"True/False", fav_none:"None yet",
        syncing:"Syncing...", sync_ok:"✓ Synced", sync_err:"⚠ Offline",
        challenge_btn:"⚔️ Challenge Friend", challenge_sent:"Challenge sent to", challenge_title:"CHALLENGE INCOMING!",
        challenge_from:"is challenging you!", challenge_accept:"Accept Challenge", challenge_decline:"Decline",
        level_up:"LEVEL UP!",
        pick_diff:"Pick difficulty to start:",
        start_quiz:"START QUIZ",
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
window.setLang = lang => {
    currentLang = lang;
    localStorage.setItem('CE2F_LANG', lang);
    applyLang();
    updateUserDashboard();
    addLog(`Language: ${lang.toUpperCase()}`);
};

// ══════════════════════════════════════════
// GENERATED QUESTION ENGINE
// ══════════════════════════════════════════
const WORD_BANK = {
    // Adverb categories
    manner:    ["quickly","slowly","carefully","loudly","softly","happily","angrily","politely","bravely","lazily","eagerly","fluently","gracefully","honestly","patiently"],
    time:      ["yesterday","today","tomorrow","now","soon","already","still","just","recently","lately","earlier","afterwards","immediately","eventually","finally"],
    place:     ["here","there","everywhere","nowhere","somewhere","outside","inside","upstairs","downstairs","nearby","abroad","overseas","locally","indoors","outdoors"],
    frequency: ["always","usually","often","sometimes","rarely","never","daily","weekly","monthly","occasionally","frequently","seldom","constantly","regularly","hardly"],
    degree:    ["very","quite","rather","extremely","fairly","almost","nearly","completely","totally","absolutely","slightly","barely","enough","too","so"],
    interrogative: ["where","when","why","how","how often","how long","how far","how much","how many"],
    conjunctive: ["however","therefore","moreover","furthermore","nevertheless","consequently","meanwhile","otherwise","additionally","similarly"],
    modality:  ["can","could","should","would","might","must","may","shall","will","ought to","need to","have to","used to","be able to"],

    // Subjects (students)
    subject: studentNames,
    subjectPronoun: ["He","She","They","We","I","You"],

    // Objects
    object: ["English","homework","the book","the quiz","a sentence","the lesson","grammar","vocabulary","pronunciation","the assignment","a story","the project","an essay","the exercise"],

    // Verbs
    verbBase:  ["study","read","write","practice","review","complete","finish","submit","understand","remember","learn","teach","explain","discuss","improve"],
    verbPast:  ["studied","read","wrote","practiced","reviewed","completed","finished","submitted","understood","remembered","learned","taught","explained","discussed","improved"],
    verbPPresent: ["is studying","is reading","is writing","is practicing","is reviewing","is completing","is finishing","is explaining","is discussing","is improving"],
    verbPPast: ["was studying","was reading","was writing","was practicing","was reviewing","was completing","was finishing","was explaining","was discussing","was improving"],
    verbPerfect: ["has studied","has read","has written","has practiced","has reviewed","has completed","has finished","has submitted","has understood","has learned"],

    // Time expressions
    timeExpr: ["every day","every morning","last night","this morning","last week","yesterday afternoon","every weekend","this semester","last year","for 2 hours","since Monday","three times a week","once a month","all day","right now"],

    // Places
    placeExpr: ["in the classroom","at school","at home","in the library","at the computer lab","online","in the group chat","during class","after school","before the exam"],

    // True/False facts (CS + English)
    tfFacts: [
        { q:"A compiler translates source code into machine code.", a:true },
        { q:"HTTP is a secure protocol by default.", a:false },
        { q:"RAM is a type of non-volatile memory.", a:false },
        { q:"An algorithm is a step-by-step solution to a problem.", a:true },
        { q:"Python uses curly braces {} to define code blocks.", a:false },
        { q:"A router connects different networks together.", a:true },
        { q:"CSS stands for Computer Style Sheets.", a:false },
        { q:"A loop executes a block of code repeatedly.", a:true },
        { q:"The Internet and the World Wide Web are the same thing.", a:false },
        { q:"A function can return a value in most programming languages.", a:true },
        { q:"Binary uses base-10 number system.", a:false },
        { q:"An API allows different software applications to communicate.", a:true },
        { q:"JavaScript is only used for front-end development.", a:false },
        { q:"A database stores and organizes data.", a:true },
        { q:"IPv6 addresses are shorter than IPv4 addresses.", a:false },
        { q:"An adverb can modify a verb, adjective, or another adverb.", a:true },
        { q:"'Quickly' is an adjective.", a:false },
        { q:"'Always' is an adverb of frequency.", a:true },
        { q:"'Very' is an adverb of manner.", a:false },
        { q:"Conjunctive adverbs connect two independent clauses.", a:true },
        { q:"'However' is used to show contrast.", a:true },
        { q:"Modal verbs can be used without a main verb.", a:false },
        { q:"'Could' is the past form of 'can'.", a:true },
        { q:"Adverbs of place tell us when something happens.", a:false },
        { q:"'Therefore' shows a result or conclusion.", a:true },
        { q:"Present continuous uses 'have + past participle'.", a:false },
        { q:"Past perfect uses 'had + past participle'.", a:true },
        { q:"'Seldom' means the same as 'often'.", a:false },
        { q:"'Nevertheless' means despite that.", a:true },
        { q:"Adverbs of degree modify nouns.", a:false },
    ]
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) { return shuffleArray([...arr]).slice(0, n); }

// ── Generate ARRANGE question ──
function genArrange() {
    const templates = [
        () => {
            // Subject + verb + object + adverb of manner + time
            const subj = pick(studentNames);
            const verb = pick(WORD_BANK.verbBase);
            const obj  = pick(WORD_BANK.object);
            const adv  = pick(WORD_BANK.manner);
            const time = pick(WORD_BANK.timeExpr);
            const sentence = `${subj} ${verb}s ${obj} ${adv} ${time}`;
            const hint = buildHintID(subj, verb+'s', obj, adv, time, 'manner+time');
            return makeArrangeQ(sentence, hint);
        },
        () => {
            // Subject + modal + verb + object + place
            const subj  = pick(studentNames);
            const modal = pick(WORD_BANK.modality);
            const verb  = pick(WORD_BANK.verbBase);
            const obj   = pick(WORD_BANK.object);
            const place = pick(WORD_BANK.placeExpr);
            const sentence = `${subj} ${modal} ${verb} ${obj} ${place}`;
            const hint = buildHintID(subj, modal, verb, obj, place, 'modality+place');
            return makeArrangeQ(sentence, hint);
        },
        () => {
            // Subject + verb past + object + time expression
            const subj = pick(studentNames);
            const verb = pick(WORD_BANK.verbPast);
            const obj  = pick(WORD_BANK.object);
            const time = pick(WORD_BANK.timeExpr);
            const sentence = `${subj} ${verb} ${obj} ${time}`;
            const hint = buildHintID(subj, verb, obj, time, '', 'past+time');
            return makeArrangeQ(sentence, hint);
        },
        () => {
            // Subject + is/was + verb-ing + object + adverb degree
            const subj  = pick(studentNames);
            const vpp   = pick(WORD_BANK.verbPPresent);
            const obj   = pick(WORD_BANK.object);
            const deg   = pick(WORD_BANK.degree);
            const sentence = `${subj} ${vpp} ${obj} ${deg} well`;
            const hint = buildHintID(subj, vpp, obj, deg+' well', '', 'present-cont+degree');
            return makeArrangeQ(sentence, hint);
        },
        () => {
            // Frequency adverb sentence
            const subj = pick(studentNames);
            const freq = pick(WORD_BANK.frequency);
            const verb = pick(WORD_BANK.verbBase);
            const obj  = pick(WORD_BANK.object);
            const sentence = `${subj} ${freq} ${verb}s ${obj}`;
            const hint = buildHintID(subj, freq, verb+'s', obj, '', 'frequency');
            return makeArrangeQ(sentence, hint);
        },
    ];
    return pick(templates)();
}

function buildHintID(subj, v1, v2, v3, v4, type) {
    // Simple Indonesian-style description
    const typeMap = {
        'manner+time': `${subj} belajar dengan cara tertentu pada waktu tertentu`,
        'modality+place': `${subj} bisa melakukan sesuatu di suatu tempat`,
        'past+time': `${subj} melakukan sesuatu di masa lalu`,
        'present-cont+degree': `${subj} sedang melakukan sesuatu`,
        'frequency': `${subj} melakukan sesuatu dengan frekuensi tertentu`,
    };
    return typeMap[type] || `Susun kata-kata ini menjadi kalimat yang benar`;
}

function makeArrangeQ(sentence, hint) {
    const words = sentence.split(' ');
    // Add 2 distractors
    const allWords = [...WORD_BANK.manner, ...WORD_BANK.time, ...WORD_BANK.frequency, ...WORD_BANK.degree, ...WORD_BANK.modality];
    const distractors = pickN(allWords.filter(w => !words.includes(w)), 2);
    return {
        target: sentence,
        hint: hint,
        words: shuffleArray([...words, ...distractors]),
        hints: [
            `Kata pertama: "${words[0]}"`,
            `Dua kata pertama: "${words[0]} ${words[1]}"`,
            `Jawaban: "${sentence}"`,
        ]
    };
}

// ── Generate TENSES question ──
function genTenses() {
    const templates = [
        () => {
            const subj = pick(studentNames);
            const obj  = pick(WORD_BANK.object);
            const time = pick(["yesterday","last night","last week","last month","two days ago"]);
            const correct = pick(WORD_BANK.verbPast);
            const wrong1  = pick(WORD_BANK.verbBase);
            const wrong2  = pick(WORD_BANK.verbPPresent);
            const wrong3  = pick(WORD_BANK.verbPerfect);
            return {
                question: `${subj} ___ ${obj} ${time}.`,
                answer: correct,
                options: shuffleArray([correct, wrong1, wrong2, wrong3]),
                hint: currentLang==='id' ? `Kejadian di masa lampau → gunakan V2` : `Past action → use V2 (simple past)`
            };
        },
        () => {
            const subj = pick(studentNames);
            const obj  = pick(WORD_BANK.object);
            const correct = pick(WORD_BANK.verbPPresent);
            const wrong1  = pick(WORD_BANK.verbBase);
            const wrong2  = pick(WORD_BANK.verbPast);
            const wrong3  = pick(WORD_BANK.verbPerfect);
            return {
                question: `${subj} ___ ${obj} right now.`,
                answer: correct,
                options: shuffleArray([correct, wrong1, wrong2, wrong3]),
                hint: currentLang==='id' ? `Sedang berlangsung sekarang → present continuous` : `Happening right now → present continuous`
            };
        },
        () => {
            const subj  = pick(studentNames);
            const obj   = pick(WORD_BANK.object);
            const freq  = pick(["every day","every week","every morning","always","usually"]);
            const verb  = pick(WORD_BANK.verbBase);
            const correct = verb + 's';
            const wrong1  = verb;
            const wrong2  = pick(WORD_BANK.verbPast);
            const wrong3  = 'is ' + verb + 'ing';
            return {
                question: `${subj} ___ ${obj} ${freq}.`,
                answer: correct,
                options: shuffleArray([correct, wrong1, wrong2, wrong3]),
                hint: currentLang==='id' ? `Kebiasaan/rutinitas He/She → tambah -s` : `Habit/routine He/She → add -s`
            };
        },
        () => {
            const subj  = pick(studentNames);
            const obj   = pick(WORD_BANK.object);
            const correct = pick(WORD_BANK.verbPerfect);
            const wrong1  = pick(WORD_BANK.verbBase);
            const wrong2  = pick(WORD_BANK.verbPast);
            const wrong3  = pick(WORD_BANK.verbPPresent);
            return {
                question: `${subj} ___ ${obj} before.`,
                answer: correct,
                options: shuffleArray([correct, wrong1, wrong2, wrong3]),
                hint: currentLang==='id' ? `Pengalaman sampai sekarang → present perfect` : `Experience up to now → present perfect`
            };
        },
        () => {
            const subj  = pick(studentNames);
            const obj   = pick(WORD_BANK.object);
            const modal = pick(["will","should","must","can","might"]);
            const verb  = pick(WORD_BANK.verbBase);
            const correct = `${modal} ${verb}`;
            const wrong1  = verb + 's';
            const wrong2  = pick(WORD_BANK.verbPast);
            const wrong3  = 'is ' + verb + 'ing';
            return {
                question: `${subj} ___ ${obj} tomorrow.`,
                answer: correct,
                options: shuffleArray([correct, wrong1, wrong2, wrong3]),
                hint: currentLang==='id' ? `Rencana/modal di masa depan → modal + base verb` : `Future plan/modal → modal + base verb`
            };
        },
    ];
    return pick(templates)();
}

// ── Generate TRUE/FALSE question ──
function genTrueFalse() {
    // Mix static facts + dynamic generated
    const useDynamic = Math.random() > 0.4;
    if (useDynamic) {
        // Dynamic: generate a statement about an adverb/grammar rule and test it
        const dynamicTemplates = [
            () => {
                const adv  = pick(WORD_BANK.manner);
                const real = "manner";
                const fake = pick(["frequency","place","degree","time"]);
                const isTrue = Math.random() > 0.5;
                const category = isTrue ? real : fake;
                return {
                    question: `"${adv.charAt(0).toUpperCase()+adv.slice(1)}" is an adverb of ${category}.`,
                    answer: isTrue ? "True" : "False",
                    hint: isTrue ? `Yes, "${adv}" describes how something is done.` : `"${adv}" describes manner, not ${fake}.`
                };
            },
            () => {
                const freq = pick(WORD_BANK.frequency);
                const isTrue = Math.random() > 0.5;
                const label = isTrue ? "frequency" : pick(["manner","place","degree"]);
                return {
                    question: `"${freq.charAt(0).toUpperCase()+freq.slice(1)}" is an adverb of ${label}.`,
                    answer: isTrue ? "True" : "False",
                    hint: isTrue ? `Correct! "${freq}" tells how often.` : `"${freq}" tells how often — that's frequency, not ${label}.`
                };
            },
            () => {
                const modal = pick(WORD_BANK.modality);
                const isTrue = Math.random() > 0.5;
                const statement = isTrue
                    ? `"${modal.charAt(0).toUpperCase()+modal.slice(1)}" is a modal verb.`
                    : `"${modal.charAt(0).toUpperCase()+modal.slice(1)}" is a regular verb.`;
                return {
                    question: statement,
                    answer: isTrue ? "True" : "False",
                    hint: isTrue ? `Yes, "${modal}" is a modal verb.` : `"${modal}" is a modal verb, not a regular verb.`
                };
            },
        ];
        return pick(dynamicTemplates)();
    } else {
        const fact = pick(WORD_BANK.tfFacts);
        return {
            question: fact.q,
            answer: fact.a ? "True" : "False",
            hint: fact.a ? "Pernyataan ini benar." : "Pernyataan ini salah."
        };
    }
}

// ── Generate batch of questions ──
function generateQuestions(mode, count) {
    const qs = [];
    // Ensure no duplicate questions by checking last generated
    const seen = new Set();
    let attempts = 0;
    while (qs.length < count && attempts < count * 10) {
        attempts++;
        let q;
        if (mode === 'mode1') q = genArrange();
        else if (mode === 'mode2') q = genTenses();
        else q = genTrueFalse();
        const key = q.target || q.question;
        if (!seen.has(key)) { seen.add(key); qs.push(q); }
    }
    return qs;
}

// ── SOUND ──
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function getACtx() { if (!audioCtx) audioCtx = new AudioCtx(); return audioCtx; }
function playSound(type) {
    try {
        const ctx=getACtx(), osc=ctx.createOscillator(), gain=ctx.createGain();
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
            [523,659,784,1047].forEach((freq,i) => {
                const o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g); g.connect(ctx.destination);
                o.type='sine'; o.frequency.value=freq;
                g.gain.setValueAtTime(0,ctx.currentTime+i*0.12); g.gain.linearRampToValueAtTime(0.3,ctx.currentTime+i*0.12+0.05); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.12+0.3);
                o.start(ctx.currentTime+i*0.12); o.stop(ctx.currentTime+i*0.12+0.35);
            });
        } else if (type==='click') {
            osc.type='sine'; osc.frequency.setValueAtTime(600,ctx.currentTime);
            gain.gain.setValueAtTime(0.1,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.08);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.08);
        } else if (type==='tick') {
            osc.type='square'; osc.frequency.setValueAtTime(800,ctx.currentTime);
            gain.gain.setValueAtTime(0.05,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.05);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.05);
        } else if (type==='levelup') {
            [523,659,784,880,1047,1318].forEach((freq,i) => {
                const o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g); g.connect(ctx.destination);
                o.type='sine'; o.frequency.value=freq;
                g.gain.setValueAtTime(0,ctx.currentTime+i*0.08); g.gain.linearRampToValueAtTime(0.25,ctx.currentTime+i*0.08+0.04); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.08+0.25);
                o.start(ctx.currentTime+i*0.08); o.stop(ctx.currentTime+i*0.08+0.3);
            });
        }
    } catch(e) { console.warn('Sound:',e); }
}

// ── CONFETTI ──
function launchConfetti() {
    const colors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899','#06b6d4'];
    const container = document.body;
    for (let i = 0; i < 80; i++) {
        const el = document.createElement('div');
        el.style.cssText = `
            position:fixed; z-index:9999; pointer-events:none;
            width:${6+Math.random()*8}px; height:${6+Math.random()*8}px;
            background:${colors[Math.floor(Math.random()*colors.length)]};
            border-radius:${Math.random()>0.5?'50%':'2px'};
            left:${Math.random()*100}vw; top:-20px;
            animation: confettiFall ${1.5+Math.random()*2}s ease-in forwards;
            animation-delay:${Math.random()*0.5}s;
            transform: rotate(${Math.random()*360}deg);
        `;
        container.appendChild(el);
        setTimeout(() => el.remove(), 3500);
    }
    // Inject keyframes once
    if (!document.getElementById('confetti-style')) {
        const s = document.createElement('style');
        s.id = 'confetti-style';
        s.innerText = `@keyframes confettiFall { to { transform: translateY(105vh) rotate(720deg); opacity:0; } }`;
        document.head.appendChild(s);
    }
}

// ── FIREBASE DB ──
function emptyUser(name, i) {
    return { name, absen:i+1, played:0, correct:0, errors:0, achievements:{}, modeStats:{}, lastActive:0 };
}
let classDatabase = classList.map((name,i) => emptyUser(name,i));

async function fbSaveUser(user) {
    try { await set(ref(db, `users/${user.name}`), user); showSyncStatus('ok'); }
    catch(e) { console.warn('FB write:', e); showSyncStatus('err'); }
}
async function fbLoadAll() {
    try {
        const snap = await get(ref(db, 'users'));
        if (snap.exists()) {
            const data = snap.val();
            classDatabase = classList.map((name,i) => {
                const s = data[name];
                return s ? { achievements:{}, modeStats:{}, lastActive:0, ...s } : emptyUser(name,i);
            });
        } else {
            const batch = {};
            classDatabase.forEach(u => { batch[u.name]=u; });
            await set(ref(db,'users'), batch);
        }
        showSyncStatus('ok');
    } catch(e) { console.warn('FB load:', e); showSyncStatus('err'); }
}
function fbListenLeaderboard() {
    onValue(ref(db,'users'), snap => {
        if (!snap.exists()) return;
        const data = snap.val();
        classDatabase = classList.map((name,i) => {
            const s = data[name];
            return s ? { achievements:{}, modeStats:{}, lastActive:0, ...s } : emptyUser(name,i);
        });
        if (!document.getElementById('menu-leaderboard').classList.contains('hidden')) renderLeaderboard();
        // Check incoming challenges
        if (loggedInUser) checkIncomingChallenge(data);
    });
}
function showSyncStatus(status) {
    const el = document.getElementById('sync-status'); if (!el) return;
    const map = { ok:[t('sync_ok'),'text-green-400'], err:[t('sync_err'),'text-yellow-400'], syncing:[t('syncing'),'text-blue-400 animate-pulse'] };
    const [txt, cls] = map[status] || map.syncing;
    el.innerText = txt; el.className = `text-[8px] font-bold ${cls}`;
}

// ── CHALLENGE SYSTEM ──
async function sendChallenge(toName) {
    if (!loggedInUser || toName === loggedInUser) return;
    try {
        await set(ref(db, `challenges/${toName}`), {
            from: loggedInUser,
            mode: currentMode || 'mode1',
            diff: currentDifficulty || 'beginner',
            ts: Date.now()
        });
        showToast(`${t('challenge_sent')} ${toName}! ⚔️`, 'blue');
        addLog(`Challenge sent → ${toName}`);
    } catch(e) { console.warn('Challenge error:', e); }
}

function checkIncomingChallenge(data) {
    const ch = data[loggedInUser]?.challenge || (data.challenges && data.challenges[loggedInUser]);
    if (!ch || !ch.from) return;
    if (Date.now() - ch.ts > 60000) return; // expire after 1 min
    if (document.getElementById('challenge-modal')?.classList.contains('hidden') === false) return;

    const modal = document.getElementById('challenge-modal');
    const fromName = document.getElementById('challenge-from-name');
    if (modal && fromName) {
        fromName.innerText = ch.from;
        modal.classList.remove('hidden');
        modal.dataset.challengeFrom = ch.from;
        modal.dataset.challengeMode = ch.mode;
        modal.dataset.challengeDiff = ch.diff;
    }
}

window.acceptChallenge = async () => {
    const modal = document.getElementById('challenge-modal');
    const mode = modal.dataset.challengeMode;
    const diff = modal.dataset.challengeDiff;
    modal.classList.add('hidden');
    // Clear challenge from DB
    try { await update(ref(db, `users/${loggedInUser}`), { challenge: null }); } catch(e){}
    // Start quiz with that mode+diff
    currentMode = mode;
    currentDifficulty = diff;
    switchMenu('quiz');
    beginQuiz();
};
window.declineChallenge = async () => {
    document.getElementById('challenge-modal').classList.add('hidden');
    try { await update(ref(db, `users/${loggedInUser}`), { challenge: null }); } catch(e){}
};

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

// Check & notify level ups
function checkLevelUps(userBefore, userAfter) {
    const newLevels = [];
    ACH_DEFS.forEach(def => {
        const before = getAchLevel(def, userBefore);
        const after  = getAchLevel(def, userAfter);
        if (after > before) newLevels.push({ def, newLv: after });
    });
    if (newLevels.length > 0) {
        playSound('levelup');
        launchConfetti();
        const first = newLevels[0];
        showToast(`${t('level_up')} ${first.def.icon} ${first.def.names[first.newLv]} (LV${first.newLv})`, 'purple', 4000);
    }
}

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
    const modes={mode1:(ms.arrange_beginner||0)+(ms.arrange_intermediate||0)+(ms.arrange_advanced||0),mode2:(ms.tenses_beginner||0)+(ms.tenses_intermediate||0)+(ms.tenses_advanced||0),mode3:(ms.tf_beginner||0)+(ms.tf_intermediate||0)+(ms.tf_advanced||0)};
    const best=Object.entries(modes).sort((a,b)=>b[1]-a[1])[0];
    return (!best||best[1]===0)?null:best[0];
}
function getFavDiff(user) {
    const a=user.achievements||{};
    const d={beginner:a.diff_beginner||0,intermediate:a.diff_intermediate||0,advanced:a.diff_advanced||0};
    const best=Object.entries(d).sort((a,b)=>b[1]-a[1])[0];
    return (!best||best[1]===0)?null:best[0];
}
function modeName(k) { return ({mode1:t('fav_arrange'),mode2:t('fav_tenses'),mode3:t('fav_tf')})[k]||t('fav_none'); }
function diffLabel(k) {
    if(!k) return t('fav_none');
    return ({beginner:DIFFICULTY_CONFIG.beginner.icon+' '+t('diff_beginner'),intermediate:DIFFICULTY_CONFIG.intermediate.icon+' '+t('diff_intermediate'),advanced:DIFFICULTY_CONFIG.advanced.icon+' '+t('diff_advanced')})[k]||t('fav_none');
}

// ── TOAST ──
function showToast(msg, color='blue', duration=2500) {
    const colors = {blue:'bg-blue-600',green:'bg-green-600',red:'bg-red-600',purple:'bg-purple-600',yellow:'bg-yellow-500 text-black'};
    const el = document.createElement('div');
    el.className = `fixed top-20 left-1/2 -translate-x-1/2 z-[999] ${colors[color]||colors.blue} text-white px-5 py-3 rounded-2xl font-black text-sm shadow-2xl animate__animated animate__fadeInDown text-center max-w-xs`;
    el.innerText = msg;
    document.body.appendChild(el);
    setTimeout(() => { el.classList.add('animate__fadeOut'); setTimeout(()=>el.remove(), 500); }, duration);
}

// ── UI STATE ──
let currentIdx=0, currentErrorCount=0, selectedWords=[];
let loggedInUser="", currentMode="", currentDifficulty="";
let activeQuestions=[], prevMenuBeforeInspect='leaderboard';
let quizTimer=null, timeLeft=0;
let snapshotBeforeQuiz = null; // for level up detection

function addLog(msg) {
    const el=document.getElementById('terminal'); if(!el) return;
    const p=document.createElement('p'); p.innerText=`> ${msg}`; el.appendChild(p); el.scrollTop=el.scrollHeight;
}
let terminalVisible=false;
window.toggleTerminal=()=>{
    terminalVisible=!terminalVisible;
    document.getElementById('terminal').classList.toggle('hidden-term',!terminalVisible);
    document.getElementById('terminal-toggle').querySelector('div').innerText=terminalVisible?'▼ LOG':'▲ LOG';
};

// ── LOGIN — NO PERSISTENT SESSION ──
async function enterDashboard(name) {
    loggedInUser = name;
    // NO saveSession — intentionally removed
    showSyncStatus('syncing');
    await fbLoadAll();
    fbListenLeaderboard();
    document.getElementById('login-screen').style.display='none';
    document.getElementById('main-dashboard').classList.remove('hidden');
    updateUserDashboard();
    applyLang();
    heartbeat();
    setInterval(heartbeat, 60000);
    addLog(`Authorized: ${loggedInUser}.`);
    addLog(`Firebase: connected.`);
    const mbl=document.getElementById('mobile-username-label');
    if(mbl) mbl.innerText=loggedInUser;
}

window.addEventListener('DOMContentLoaded', async () => {
    spawnCodeRain();
    applyLang();
    await fbLoadAll();
    fbListenLeaderboard();
    updateLoginStats();
    // NO session restore — always show login
});

document.getElementById('login-btn').onclick = () => {
    playSound('click');
    let input=document.getElementById('username-input').value.trim();
    if(!input) return;
    let fmt=input.charAt(0).toUpperCase()+input.slice(1).toLowerCase();
    if(input.toLowerCase().includes("dosen")) fmt="Winda";
    if(classList.includes(fmt)) {
        // Welcome overlay
        const w=document.createElement('div');
        w.className="fixed inset-0 bg-[#0a0f1e] z-[300] flex flex-col items-center justify-center text-center p-6 animate__animated animate__fadeIn";
        w.innerHTML=`<div class="animate__animated animate__zoomIn"><div class="text-6xl mb-4">⚡</div><h1 class="text-4xl font-black text-white italic mb-2">YO WELKAM BEK CUY!</h1><p class="text-blue-400 font-bold text-xl">Target: <span class="text-white">${fmt}</span></p><p class="text-gray-500 text-xs mt-10 animate-pulse">INITIATING CE-2F PROTOCOL...</p></div>`;
        document.body.appendChild(w);
        setTimeout(()=>{ w.classList.add('animate__fadeOut'); setTimeout(()=>{ w.remove(); enterDashboard(fmt); },500); },2000);
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }
};
document.getElementById('username-input').addEventListener('keydown',e=>{ if(e.key==='Enter') document.getElementById('login-btn').click(); });
window.doLogout=()=>{ location.reload(); }; // Just reload, no session to clear

async function heartbeat() {
    if(!loggedInUser) return;
    const user=classDatabase.find(u=>u.name===loggedInUser); if(!user) return;
    user.lastActive=Date.now();
    try { await update(ref(db,`users/${loggedInUser}`),{lastActive:user.lastActive}); } catch(e){}
}
const ONLINE_THRESHOLD=5*60*1000;
function isOnline(user) { return user.lastActive&&(Date.now()-user.lastActive)<ONLINE_THRESHOLD; }

function updateLoginStats() {
    const total=classDatabase.reduce((a,u)=>a+u.played,0);
    const online=classDatabase.filter(u=>isOnline(u)).length;
    document.getElementById('login-stat-members').innerText=classList.length;
    document.getElementById('login-stat-online').innerText=online;
    document.getElementById('login-stat-quizzes').innerText=total;
    const top=[...classDatabase].filter(u=>u.name!=="Winda").sort((a,b)=>b.correct-a.correct)[0];
    if(top&&top.correct>0){ document.getElementById('login-top-player').classList.remove('hidden'); document.getElementById('login-top-name').innerText=top.name; document.getElementById('login-top-score').innerText=top.correct; }
    const msgs=["🚀 LingoReal Pro — CE-2F English Practice","💡 Belajar bahasa Inggris sambil bersaing!","🏆 Cek leaderboard & buktikan skill lo!",`📊 Total Quiz: ${total}`,`👥 ${classList.length} Engineers terdaftar`,"⚡ Arrange · Tenses · True/False","🌱→⚡→🔥 Soal digenerate otomatis!"];
    document.getElementById('login-ticker').innerHTML=[...msgs,...msgs].map(m=>`<span class="px-8">${m}</span>`).join('');
}

function updateUserDashboard() {
    const user=classDatabase.find(u=>u.name===loggedInUser); if(!user) return;
    const sorted=[...classDatabase].sort((a,b)=>b.correct-a.correct);
    const rank=sorted.findIndex(u=>u.name===loggedInUser)+1;
    document.getElementById('stat-name').innerText=user.name;
    document.getElementById('stat-played').innerText=user.played;
    document.getElementById('stat-errors').innerText=user.errors;
    document.getElementById('user-badge-main').innerHTML=getBadges(user,rank);
    if(user.name==="Winda"){
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
    document.getElementById('my-status-dot').className='dot-online';
    document.getElementById('my-status-text').innerText=t('online_label');
    document.getElementById('my-status-text').className='text-xs text-green-400 font-bold';
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
    // Reset quiz flow when entering quiz menu
    if(menuName==='quiz') resetQuizFlow();
};

// ── QUIZ FLOW: Mode first, then difficulty slides in ──
function resetQuizFlow() {
    currentMode=""; currentDifficulty="";
    document.getElementById('quiz-mode-select').classList.remove('hidden');
    document.getElementById('quiz-diff-select').classList.add('hidden');
    document.getElementById('quiz-ready').classList.remove('hidden');
    document.getElementById('game-engine').classList.add('hidden');
    document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('ring-4','ring-blue-500','scale-105'));
    document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('ring-4','ring-white/40','scale-105'));
}

window.selectQuizMode=(mode)=>{
    playSound('click');
    currentMode=mode;
    // Highlight selected mode
    document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('ring-4','ring-blue-500','scale-105'));
    document.querySelector(`[data-mode="${mode}"]`)?.classList.add('ring-4','ring-blue-500','scale-105');
    // Animate difficulty section in
    const diffSection=document.getElementById('quiz-diff-select');
    diffSection.classList.remove('hidden');
    diffSection.classList.add('animate__animated','animate__fadeInUp');
    setTimeout(()=>diffSection.classList.remove('animate__animated','animate__fadeInUp'),600);
    addLog(`Mode: ${mode}`);
};

window.selectDifficulty=diff=>{
    playSound('click'); currentDifficulty=diff;
    document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('ring-4','ring-white/40','scale-105'));
    document.getElementById(`diff-${diff}`)?.classList.add('ring-4','ring-white/40','scale-105');
};

window.startActualQuiz=()=>{
    if(!currentMode){ showToast('Pilih mode quiz dulu!','red'); return; }
    if(!currentDifficulty){ const h=document.getElementById('diff-hint'); h.classList.remove('hidden'); setTimeout(()=>h.classList.add('hidden'),2500); return; }
    beginQuiz();
};

function beginQuiz() {
    playSound('click');
    document.getElementById('quiz-ready').classList.add('hidden');
    document.getElementById('game-engine').classList.remove('hidden');
    const user=classDatabase.find(u=>u.name===loggedInUser);
    // Snapshot before for level up detection
    snapshotBeforeQuiz = JSON.parse(JSON.stringify(user));
    user.played++; fbSaveUser(user); updateUserDashboard();
    activeQuestions=generateQuestions(currentMode, DIFFICULTY_CONFIG[currentDifficulty].count);
    currentIdx=0;
    addLog(`Quiz: ${currentMode} | ${currentDifficulty} | generated`);
    init();
}

// ── TIMER ──
function startTimer() {
    const cfg=DIFFICULTY_CONFIG[currentDifficulty];
    timeLeft=cfg.time;
    updateTimerUI();
    if(quizTimer) clearInterval(quizTimer);
    quizTimer=setInterval(()=>{
        timeLeft--;
        updateTimerUI();
        if(timeLeft<=5) playSound('tick');
        if(timeLeft<=0){
            clearInterval(quizTimer); quizTimer=null;
            onTimeUp();
        }
    },1000);
}
function stopTimer() { if(quizTimer){ clearInterval(quizTimer); quizTimer=null; } }
function updateTimerUI() {
    const el=document.getElementById('quiz-timer'); if(!el) return;
    el.innerText=`⏱ ${timeLeft}s`;
    el.className=timeLeft<=5?'text-red-400 font-black text-sm animate-pulse':'text-blue-400 font-black text-sm';
}
function onTimeUp() {
    playSound('wrong');
    const user=classDatabase.find(u=>u.name===loggedInUser);
    user.errors++; fbSaveUser(user); updateUserDashboard();
    document.getElementById('ai-feedback').classList.remove('hidden');
    document.getElementById('ai-text').innerText=t('time_up');
    currentErrorCount++;
    // Auto advance after 2s
    setTimeout(()=>{
        document.getElementById('ai-feedback').classList.add('hidden');
        if(currentIdx===activeQuestions.length-1) showFinalStats();
        else { currentIdx++; init(); }
    },2000);
}

// ── QUIZ ENGINE ──
function init() {
    stopTimer();
    const q=activeQuestions[currentIdx];
    const optZone=document.getElementById('options-zone'), ansZone=document.getElementById('answer-zone');
    optZone.innerHTML=""; ansZone.innerHTML="";
    selectedWords=[]; currentErrorCount=0;
    document.getElementById('ai-feedback').classList.add('hidden');
    document.getElementById('q-number').innerText=`Task ${currentIdx+1}/${activeQuestions.length}`;
    document.getElementById('progress-bar').style.width=`${(currentIdx/activeQuestions.length)*100}%`;
    document.getElementById('check-btn').innerText=t('execute_btn');
    startTimer();

    if(currentMode==='mode1'){
        document.getElementById('soal-teks').innerText=`"${q.hint}"`;
        ansZone.classList.remove('hidden');
        [...q.words].sort(()=>Math.random()-0.5).forEach(word=>{
            const btn=createNode('button',word,"bg-white text-gray-700 px-4 py-2 rounded-2xl font-bold border-b-4 border-gray-100 shadow-sm text-sm active:scale-95");
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
            const btn=createNode('button',opt,"bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold border border-white/10 hover:bg-blue-600 transition-all text-sm active:scale-95");
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
    stopTimer();
    const q=activeQuestions[currentIdx];
    const userAnswer=currentMode==='mode1'?selectedWords.join(" "):selectedWords[0];
    const correct=q.target||q.answer;
    if(userAnswer===correct){
        playSound('correct');
        classDatabase.find(u=>u.name===loggedInUser).correct++;
        fbSaveUser(classDatabase.find(u=>u.name===loggedInUser));
        currentIdx===activeQuestions.length-1?showFinalStats():showSuccess();
    } else {
        playSound('wrong');
        const user=classDatabase.find(u=>u.name===loggedInUser);
        user.errors++; fbSaveUser(user); updateUserDashboard();
        document.getElementById('ai-feedback').classList.remove('hidden');
        document.getElementById('ai-text').innerText=q.hints?q.hints[Math.min(currentErrorCount,q.hints.length-1)]:`Hint: ${q.hint}`;
        currentErrorCount++;
        startTimer(); // restart timer after wrong answer
    }
};

function showSuccess(){
    successOverlay.innerHTML=`<div class="bg-[#1e293b] border-2 border-blue-500 p-8 rounded-3xl max-w-sm w-full text-center animate__animated animate__zoomIn shadow-2xl"><div class="text-6xl mb-4">🚀</div><h2 class="text-2xl font-black text-blue-400 mb-2 italic uppercase">${t('success_title')}</h2><button onclick="nextQ()" class="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-[0_4px_0_0_#1d4ed8]">${t('success_btn')}</button></div>`;
    successOverlay.classList.remove('hidden');
}
window.nextQ=()=>{ successOverlay.classList.add('hidden'); currentIdx++; init(); };

function showFinalStats(){
    stopTimer();
    playSound('complete');
    const user=classDatabase.find(u=>u.name===loggedInUser);
    if(!user.achievements) user.achievements={};
    user.achievements[`diff_${currentDifficulty}`]=(user.achievements[`diff_${currentDifficulty}`]||0)+1;
    const modeKey={mode1:'arrange',mode2:'tenses',mode3:'tf'}[currentMode];
    const comboKey=`${modeKey}_${currentDifficulty}`;
    user.achievements[comboKey]=(user.achievements[comboKey]||0)+1;
    if(!user.modeStats) user.modeStats={};
    user.modeStats[comboKey]=(user.modeStats[comboKey]||0)+1;
    fbSaveUser(user);

    // Check level ups
    if(snapshotBeforeQuiz) checkLevelUps(snapshotBeforeQuiz, user);
    updateUserDashboard();

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
    document.getElementById('game-engine').classList.add('hidden');
    document.getElementById('quiz-ready').classList.remove('hidden');
    resetQuizFlow();
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
            <div class="flex-1 min-w-0"><div class="flex items-center gap-2 flex-wrap mb-1">
                <p class="font-black text-white text-sm">${def.names[lv]||def.names[0]}</p>
                ${lv>0?achBadgeHTML(def,lv):'<span class="badge-ach" style="background:#1f2937;border:1px solid #374151;color:#6b7280">LOCKED</span>'}
            </div><p class="text-gray-500 text-[9px]">${def.descs[lv]||def.descs[0]}</p></div></div>
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
        const challengeBtn=!isMe&&student.name!=="Winda"?`<button onclick="sendChallenge('${student.name}')" class="ml-1 text-[7px] bg-orange-500/20 border border-orange-500/40 text-orange-400 px-2 py-0.5 rounded-lg font-black hover:bg-orange-500 hover:text-white transition-all">⚔️</button>`:'';
        tbody.innerHTML+=`
            <tr class="${isMe?'bg-blue-500/10':''} border-b border-white/5 hover:bg-white/10 cursor-pointer" onclick="inspectUser('${student.name}')">
                <td class="p-4 font-black text-sm">${i+1}</td>
                <td class="p-4 text-sm ${isMe?'text-blue-400':'text-blue-100'}"><span class="font-bold">${student.name}</span>${isMe?' <span class="text-[8px] text-gray-500">(you)</span>':''}${challengeBtn}</td>
                <td class="p-4 text-center">${statusDot}</td>
                <td class="p-4 text-center text-gray-400 text-sm">${student.played}</td>
                <td class="p-4 text-center text-green-400 text-sm">${student.correct}</td>
                <td class="p-4 text-center text-red-400 text-sm">${student.errors}</td>
                <td class="p-4 text-right">${getBadges(student,i+1)} ${achB}</td>
            </tr>`;
    });
}

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
    const challengeBtn=name!==loggedInUser&&!isWinda?`<button onclick="sendChallenge('${name}')" class="mt-3 px-4 py-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-xl font-black text-sm hover:bg-orange-500 hover:text-white transition-all">⚔️ ${t('challenge_btn')}</button>`:'';
    document.getElementById('inspect-content').innerHTML=`
        <div class="space-y-4">
            <div class="bg-[#1e293b] rounded-2xl p-5 border border-white/5">
                <div class="flex items-center gap-3 mb-2 flex-wrap"><h2 class="text-2xl font-black text-white">${user.name}</h2><div class="flex items-center gap-1.5">${onlineDot}</div></div>
                <div class="flex flex-wrap gap-1.5 mb-2">${getBadges(user,rank)}</div>
                <p class="text-yellow-400 font-black text-sm">#${rank} — ${rank<=3?rankLabels[rank]:'STUDENT ENGINEER'}</p>
                ${isWinda?'<p class="text-gray-400 text-xs mt-1">Jabatan: <span class="text-blue-400 font-bold">Dosen</span> · English Practice</p>':`<p class="text-gray-400 text-xs mt-1">Absensi ke-<span class="text-blue-400 font-bold">${user.absen}</span></p>`}
                ${challengeBtn}
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-1">Played</p><p class="text-xl font-black text-green-400">${user.played}</p></div>
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-1">Correct</p><p class="text-xl font-black text-blue-400">${user.correct}</p></div>
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-1">Errors</p><p class="text-xl font-black text-red-400">${user.errors}</p></div>
                <div class="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 p-4 rounded-2xl"><p class="text-gray-500 text-[9px] uppercase font-black mb-1">Rank</p><p class="text-xl font-black text-yellow-400">#${rank}</p></div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-2">Accuracy</p><div class="flex gap-2 items-center mb-1"><div class="flex-1 bg-gray-800 h-2.5 rounded-full overflow-hidden"><div class="bg-green-500 h-full rounded-full" style="width:${pct}%"></div></div><span class="text-sm font-black text-green-400">${pct}%</span></div><div class="flex justify-between text-[8px]"><span class="text-green-400 font-bold">${user.correct} ✓</span><span class="text-red-400 font-bold">${user.errors} ✗</span></div></div>
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-2">Fav Mode</p><p class="text-base font-black text-purple-400">${favM?modeName(favM):t('fav_none')}</p><p class="text-[8px] text-gray-500 mt-0.5">${favD?diffLabel(favD):'---'}</p></div>
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-2">Quiz Breakdown</p>${['beginner','intermediate','advanced'].map(d=>`<div class="flex justify-between text-[9px] mb-1"><span class="text-gray-400">${DIFFICULTY_CONFIG[d].icon} ${d.charAt(0).toUpperCase()+d.slice(1)}</span><span class="font-bold text-white">${user.achievements[`diff_${d}`]||0}x</span></div>`).join('')}</div>
            </div>
            <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-3">Top Achievements</p><div class="flex flex-wrap gap-2">${topAch.length?topAch.map(x=>achBadgeHTML(x.d,x.lv)).join(''):`<span class="text-gray-600 text-xs">Belum ada achievement</span>`}</div></div>
        </div>`;
    document.querySelectorAll('.menu-content').forEach(el=>el.classList.add('hidden'));
    document.getElementById('menu-inspect').classList.remove('hidden');
};
window.backFromInspect=()=>{
    document.querySelectorAll('.menu-content').forEach(el=>el.classList.add('hidden'));
    document.querySelectorAll('.menu-btn').forEach(el=>{ el.classList.remove('bg-blue-600','text-white'); el.classList.add('text-gray-400'); });
    document.getElementById(`menu-${prevMenuBeforeInspect}`).classList.remove('hidden');
    const btn=document.querySelector(`[data-menu="${prevMenuBeforeInspect}"]`);
    if(btn){ btn.classList.add('bg-blue-600','text-white'); btn.classList.remove('text-gray-400'); }
    if(prevMenuBeforeInspect==='leaderboard') renderLeaderboard();
};
window.openUserModal=name=>inspectUser(name);
window.closeModal=()=>document.getElementById('user-modal').classList.add('hidden');

function shuffleArray(arr){ for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr; }

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
