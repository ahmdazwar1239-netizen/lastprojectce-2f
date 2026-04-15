// ============================================================
// LINGOREAL PRO - script.js v8
// Fixed arrange, unlimited quiz, full i18n, conversation mode
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

const classList = ["Azwar","Alya","Andreas","Ayu","Beauty","Christian","Clara","Dominica","Drika","Gideon","Jenifer","Johannes","Julita","Khairul","Khayla","Lasko","Lorena","Nazwa","Nuansa","Queenna","Raid","Rony","Siti","Winda"];
const studentNames = classList.filter(n => n !== "Winda");

const DIFFICULTY_CONFIG = {
    beginner:     { label:"BEGINNER",     count:5,  icon:"🌱", time:30 },
    intermediate: { label:"INTERMEDIATE", count:10, icon:"⚡", time:20 },
    advanced:     { label:"ADVANCED",     count:15, icon:"🔥", time:15 },
};

// ══════════════════════════════════════════════════════
// FULL I18N — semua teks ada di sini
// ══════════════════════════════════════════════════════
const LANG_DATA = {
    id: {
        // NAV
        nav_profile:"Profil Saya", nav_quiz:"Mode Quiz", nav_achievement:"Pencapaian",
        nav_leaderboard:"Papan Peringkat", nav_settings:"Pengaturan", logout:"Keluar",
        // PROFILE
        profile_title:"PROFIL ENGINEER", label_username:"Nama Pengguna",
        label_played:"Total Dimainkan", label_errors:"Total Kesalahan",
        label_top_ach:"Pencapaian Terbaik", label_rank:"Peringkat Saat Ini",
        label_fav_mode:"Mode Favorit", label_accuracy:"Akurasi Jawaban",
        see_all:"Lihat Semua →",
        // INSPECT
        inspect_title:"PROFIL ENGINEER", inspect_sub:"Lagi lihat statistik teman lo",
        // QUIZ FLOW
        quiz_select_title:"PILIH MODE QUIZ", quiz_select_sub:"Pilih mode dulu, baru tentukan tingkat kesulitannya!",
        quiz_step_mode:"① Pilih Mode Quiz", quiz_step_diff:"② Pilih Tingkat Kesulitan",
        start_quiz:"MULAI QUIZ ⚡",
        // MODE NAMES
        mode_arrange:"SUSUN KATA", mode_arrange_sub:"Terjemahkan & Susun",
        mode_tenses:"TENSES", mode_tenses_sub:"Kuasai Tata Bahasa",
        mode_tf:"BENAR/SALAH", mode_tf_sub:"Uji Pengetahuan Umum",
        mode_conv:"CONVERSATION", mode_conv_sub:"Dialog Interaktif",
        // DIFFICULTY
        diff_beginner:"PEMULA", diff_beginner_count:"5 Soal · 30 detik",
        diff_intermediate:"MENENGAH", diff_intermediate_count:"10 Soal · 20 detik",
        diff_advanced:"MAHIR", diff_advanced_count:"15 Soal · 15 detik",
        // QUIZ IN-GAME
        abort:"Batal ✖", alert_label:"Peringatan", execute_btn:"JAWAB SEKARANG ⚡",
        time_up:"⏰ Waktu Habis! Lanjut soal berikutnya...",
        task_label:"Soal", of_label:"dari",
        success_title:"GACOR COK!", success_btn:"LANJUT >",
        complete_title:"SELESAI!", complete_btn:"🔄 Pilih Mode Lagi",
        unlimited_note:"Klik lagi untuk dapat soal baru!",
        play_again:"Main Lagi 🔄", back_to_menu:"Kembali ke Menu",
        // ARRANGE HINTS
        arrange_hint_1:"Kata pertama:", arrange_hint_2:"Dua kata pertama:",
        arrange_hint_answer:"Jawaban:",
        // CONVERSATION
        conv_scenario_label:"Situasi:",
        conv_correct:"Tepat! Bagus banget 👍",
        conv_wrong:"Hmm, kurang tepat. Coba lagi!",
        conv_next:"Percakapan Berikutnya",
        conv_done:"Selesai! Mau coba lagi?",
        // ACHIEVEMENT
        ach_title:"PAPAN PRESTASI", ach_sub:"Kumpulin semua achievement & flex ke temen!",
        ach_unlocked:"Terbuka", ach_total:"Total", ach_progress:"Progres Keseluruhan",
        ach_locked_badge:"TERKUNCI",
        // LEADERBOARD
        lb_title:"PERINGKAT GLOBAL CE-2F", lb_rank:"Peringkat", lb_name:"Nama",
        lb_played:"Dimainkan", lb_score:"Skor", lb_errors:"Kesalahan", lb_access:"Badge",
        lb_you:"(kamu)",
        // SETTINGS
        settings_title:"KONFIGURASI SISTEM", settings_lang_label:"Pilih Bahasa Sistem",
        // STATUS
        online_label:"ONLINE", offline_label:"OFFLINE",
        // FAV
        fav_arrange:"Susun Kata", fav_tenses:"Tenses", fav_tf:"Benar/Salah",
        fav_conv:"Conversation", fav_none:"Belum ada",
        // SYNC
        syncing:"Menyinkronkan...", sync_ok:"✓ Tersinkron", sync_err:"⚠ Offline",
        // CHALLENGE
        challenge_title:"TANTANGAN MASUK!", challenge_from:"menantang kamu!",
        challenge_accept:"Terima Tantangan", challenge_decline:"Tolak",
        challenge_sent:"Tantangan dikirim ke",
        // LEVEL UP
        level_up:"NAIK LEVEL!",
        // RANK LABELS
        rank_gold:"ELITE GOLD", rank_silver:"ELITE SILVER", rank_bronze:"ELITE BRONZE",
        rank_student:"STUDENT ENGINEER",
        // TRUE/FALSE buttons
        btn_true:"BENAR", btn_false:"SALAH",
        // LANDING
        nav_features:"Fitur", nav_modes:"Mode Quiz", nav_lb:"Leaderboard", nav_about:"Tentang",
        sign_in:"Masuk",
        hero_badge:"Platform belajar Bahasa Inggris kelas CE-2F",
        hero_title_1:"Belajar Bahasa Inggris",
        hero_title_2:"sambil Bersaing 🔥",
        hero_sub:"Bukan buku teks. Bukan hafalan membosankan. Ini quiz interaktif bareng temen sekelas yang bikin lo ngerti English dengan cara yang asik.",
        cta_start:"Mulai Sekarang ⚡", cta_explore:"Lihat Mode Quiz →",
        stat_students:"Mahasiswa", stat_played:"Quiz Dimainkan", stat_online:"Online",
        section_why:"Kenapa LingoReal?", features_title:"Belajar yang ga bikin ngantuk",
        section_modes:"Mode Latihan", modes_title:"4 Cara Latihan Bahasa Inggris",
        section_lb:"Peringkat", lb_preview_title:"Siapa yang Paling Rajin?",
        lb_preview_sub:"Login untuk lihat leaderboard lengkap & detail profil teman",
        about_title:"Tentang LingoReal",
        about_desc:"LingoReal dibuat khusus buat kelas Computer Engineering CE-2F sebagai platform latihan Bahasa Inggris yang interaktif. Dibuat oleh Azwar (Web Dev CE-2F) dengan ❤️",
        login_sub:"Masukkan nama kamu",
        feat1_title:"Soal Digenerate Otomatis",
        feat1_desc:"Ribuan kombinasi soal dari word bank yang kaya. Ga bakal ketemu soal yang sama dua kali!",
        feat2_title:"Live Leaderboard",
        feat2_desc:"Skor semua orang update real-time. Siapa yang lagi belajar paling rajin? Cek sekarang.",
        feat3_title:"Achievement System",
        feat3_desc:"Kumpulin badge dari level 1 sampai 5. Makin rajin, makin keren badge-nya.",
        feat4_title:"Challenge Teman",
        feat4_desc:"Tantang temen sekelas langsung dari leaderboard. Siapa yang lebih jago?",
        feat5_title:"Conversation Practice",
        feat5_desc:"Mode dialog interaktif — latih percakapan sehari-hari dalam situasi nyata.",
        feat6_title:"Main di Mana Aja",
        feat6_desc:"HP, tablet, laptop — semua bisa. Data tersinkron via Firebase.",
        mode1_name:"Arrange Words", mode1_tag:"Susun Kalimat",
        mode1_desc:'Susun kata-kata acak jadi kalimat yang bener.',
        mode2_name:"Tenses Challenge", mode2_tag:"Tata Bahasa",
        mode2_desc:'Pilih tenses yang tepat untuk melengkapi kalimat.',
        mode3_name:"True or False", mode3_tag:"Pengetahuan Umum",
        mode3_desc:'Uji pengetahuan umum dan grammar.',
        mode4_name:"Conversation", mode4_tag:"Dialog Interaktif",
        mode4_desc:'Latih percakapan dalam situasi nyata.',
    },
    en: {
        nav_profile:"User Profile", nav_quiz:"Quiz Mode", nav_achievement:"Achievement",
        nav_leaderboard:"Leaderboard", nav_settings:"Settings", logout:"Logout",
        profile_title:"ENGINEER PROFILE", label_username:"Username",
        label_played:"Total Played", label_errors:"Total Errors",
        label_top_ach:"Top Achievements", label_rank:"Current Rank",
        label_fav_mode:"Fav Mode", label_accuracy:"Accuracy",
        see_all:"See All →",
        inspect_title:"ENGINEER PROFILE", inspect_sub:"Viewing a classmate's stats",
        quiz_select_title:"PICK QUIZ MODE", quiz_select_sub:"Choose a mode first, then pick your difficulty!",
        quiz_step_mode:"① Choose Quiz Mode", quiz_step_diff:"② Choose Difficulty",
        start_quiz:"START QUIZ ⚡",
        mode_arrange:"ARRANGE", mode_arrange_sub:"Build Sentences",
        mode_tenses:"TENSES", mode_tenses_sub:"Master Grammar",
        mode_tf:"TRUE/FALSE", mode_tf_sub:"General Knowledge",
        mode_conv:"CONVERSATION", mode_conv_sub:"Interactive Dialog",
        diff_beginner:"BEGINNER", diff_beginner_count:"5 Questions · 30s",
        diff_intermediate:"INTERMEDIATE", diff_intermediate_count:"10 Questions · 20s",
        diff_advanced:"ADVANCED", diff_advanced_count:"15 Questions · 15s",
        abort:"Abort ✖", alert_label:"Hint", execute_btn:"SUBMIT ANSWER ⚡",
        time_up:"⏰ Time's Up! Moving on...",
        task_label:"Task", of_label:"of",
        success_title:"NAILED IT!", success_btn:"NEXT >",
        complete_title:"COMPLETE!", complete_btn:"🔄 Choose Mode Again",
        unlimited_note:"Click again for new questions!",
        play_again:"Play Again 🔄", back_to_menu:"Back to Menu",
        arrange_hint_1:"First word:", arrange_hint_2:"First two words:",
        arrange_hint_answer:"Answer:",
        conv_scenario_label:"Scenario:",
        conv_correct:"Correct! Well done 👍",
        conv_wrong:"Hmm, not quite. Try again!",
        conv_next:"Next Conversation",
        conv_done:"Done! Want to try again?",
        ach_title:"ACHIEVEMENT BOARD", ach_sub:"Collect all achievements & flex on classmates!",
        ach_unlocked:"Unlocked", ach_total:"Total", ach_progress:"Overall Progress",
        ach_locked_badge:"LOCKED",
        lb_title:"CE-2F GLOBAL RANKING", lb_rank:"Rank", lb_name:"Name",
        lb_played:"Played", lb_score:"Score", lb_errors:"Errors", lb_access:"Badges",
        lb_you:"(you)",
        settings_title:"SYSTEM CONFIG", settings_lang_label:"Select System Language",
        online_label:"ONLINE", offline_label:"OFFLINE",
        fav_arrange:"Arrange", fav_tenses:"Tenses", fav_tf:"True/False",
        fav_conv:"Conversation", fav_none:"None yet",
        syncing:"Syncing...", sync_ok:"✓ Synced", sync_err:"⚠ Offline",
        challenge_title:"CHALLENGE INCOMING!", challenge_from:"is challenging you!",
        challenge_accept:"Accept", challenge_decline:"Decline",
        challenge_sent:"Challenge sent to",
        level_up:"LEVEL UP!",
        rank_gold:"ELITE GOLD", rank_silver:"ELITE SILVER", rank_bronze:"ELITE BRONZE",
        rank_student:"STUDENT ENGINEER",
        btn_true:"TRUE", btn_false:"FALSE",
        nav_features:"Features", nav_modes:"Quiz Modes", nav_lb:"Leaderboard", nav_about:"About",
        sign_in:"Sign In",
        hero_badge:"CE-2F English Practice Platform",
        hero_title_1:"Learn English",
        hero_title_2:"while Competing 🔥",
        hero_sub:"Not a textbook. Not boring memorization. Interactive quizzes with classmates that make you actually understand English.",
        cta_start:"Get Started ⚡", cta_explore:"Explore Quiz Modes →",
        stat_students:"Students", stat_played:"Quizzes Played", stat_online:"Online",
        section_why:"Why LingoReal?", features_title:"Learning that doesn't put you to sleep",
        section_modes:"Practice Modes", modes_title:"4 Ways to Practice English",
        section_lb:"Rankings", lb_preview_title:"Who's Studying the Most?",
        lb_preview_sub:"Login to see the full leaderboard & classmate profiles",
        about_title:"About LingoReal",
        about_desc:"LingoReal was built specifically for CE-2F Computer Engineering as an interactive English practice platform. Built by Azwar (Web Dev CE-2F) with ❤️",
        login_sub:"Enter your name",
        feat1_title:"Auto-Generated Questions",
        feat1_desc:"Thousands of question combinations from a rich word bank. You'll never see the same question twice!",
        feat2_title:"Live Leaderboard",
        feat2_desc:"Everyone's scores update in real-time. Who's studying the hardest? Check now.",
        feat3_title:"Achievement System",
        feat3_desc:"Collect badges from level 1 to 5. The more you study, the cooler your badges.",
        feat4_title:"Challenge Friends",
        feat4_desc:"Challenge classmates directly from the leaderboard. Who's better?",
        feat5_title:"Conversation Practice",
        feat5_desc:"Interactive dialog mode — practice everyday conversations in real situations.",
        feat6_title:"Play Anywhere",
        feat6_desc:"Phone, tablet, laptop — all work. Data synced via Firebase.",
        mode1_name:"Arrange Words", mode1_tag:"Build Sentences",
        mode1_desc:'Arrange scrambled words into a correct sentence.',
        mode2_name:"Tenses Challenge", mode2_tag:"Grammar",
        mode2_desc:'Choose the correct tense to complete the sentence.',
        mode3_name:"True or False", mode3_tag:"General Knowledge",
        mode3_desc:'Test your general knowledge and grammar.',
        mode4_name:"Conversation", mode4_tag:"Interactive Dialog",
        mode4_desc:'Practice conversations in real-life situations.',
    }
};

let currentLang = localStorage.getItem('CE2F_LANG') || 'id';
function t(key) { return LANG_DATA[currentLang][key] || LANG_DATA['id'][key] || key; }

function applyLang() {
    // Dashboard i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const k = el.getAttribute('data-i18n');
        if (LANG_DATA[currentLang][k] !== undefined) el.innerText = LANG_DATA[currentLang][k];
    });
    // Landing i18n
    document.querySelectorAll('[data-i18n-land]').forEach(el => {
        const k = el.getAttribute('data-i18n-land');
        if (LANG_DATA[currentLang][k] !== undefined) el.innerText = LANG_DATA[currentLang][k];
    });
    // Lang buttons in settings
    const isId = currentLang === 'id';
    ['lang-id','lang-en'].forEach(id => {
        const el = document.getElementById(id); if (!el) return;
        const active = (id==='lang-id') === isId;
        el.className = `lang-btn p-4 rounded-2xl font-bold border-2 transition-all text-sm ${active?'bg-blue-600 text-white border-blue-500 font-black':'bg-[#0f172a] text-gray-400 border-gray-700 hover:border-blue-500'}`;
    });
    // Landing lang button
    const lbtn = document.getElementById('land-lang-btn');
    if (lbtn) lbtn.innerText = isId ? '🇮🇩 ID' : '🇺🇸 EN';
}

window.setLang = lang => {
    currentLang = lang;
    localStorage.setItem('CE2F_LANG', lang);
    applyLang();
    if (loggedInUser) updateUserDashboard();
    addLog(`Language: ${lang.toUpperCase()}`);
};

window.toggleLandingLang = () => {
    setLang(currentLang === 'id' ? 'en' : 'id');
};

// ══════════════════════════════════════════════════════
// WORD BANK — untuk generated questions
// ══════════════════════════════════════════════════════
const BANK = {
    names: studentNames,
    manner:    ["quickly","slowly","carefully","loudly","softly","happily","angrily","politely","bravely","lazily","eagerly","fluently","gracefully","honestly","patiently"],
    time:      ["yesterday","today","now","already","still","just","recently","soon","immediately","eventually","finally","lately","earlier","afterwards","soon"],
    timeExpr:  ["every day","every morning","last night","this morning","last week","every weekend","this semester","three times a week","once a month","all day","for two hours","since Monday","every afternoon"],
    place:     ["here","there","everywhere","outside","inside","nearby","abroad","upstairs","downstairs","indoors","outdoors","overseas"],
    placeExpr: ["in the classroom","at school","at home","in the library","at the computer lab","online","in the group chat","during class","after school"],
    frequency: ["always","usually","often","sometimes","rarely","never","daily","weekly","occasionally","frequently","seldom","constantly","regularly"],
    degree:    ["very","quite","rather","extremely","fairly","almost","nearly","completely","totally","absolutely","slightly","barely"],
    modal:     ["can","could","should","would","might","must","may","will","shall","have to","need to"],
    object:    ["English","homework","the assignment","a story","the lesson","grammar","vocabulary","the project","an essay","the exercise","the notes","the quiz"],
    verbBase:  ["study","read","write","practice","review","complete","finish","submit","understand","remember","learn","explain","discuss","improve","prepare"],
    verbS:     ["studies","reads","writes","practices","reviews","completes","finishes","submits","understands","remembers","learns","explains","discusses","improves","prepares"],
    verbPast:  ["studied","read","wrote","practiced","reviewed","completed","finished","submitted","understood","remembered","learned","explained","discussed","improved","prepared"],
    verbPP:    ["has studied","has read","has written","has practiced","has reviewed","has completed","has finished","has submitted","has understood","has learned"],
    verbContPres: ["is studying","is reading","is writing","is practicing","is reviewing","is completing","is explaining","is discussing"],
    verbContPast: ["was studying","was reading","was writing","was practicing","was reviewing","was completing","was explaining","was discussing"],
    tfFacts: [
        {q:"A compiler translates source code into machine code.",a:true},
        {q:"HTTP is a secure protocol by default.",a:false},
        {q:"RAM is a type of non-volatile memory.",a:false},
        {q:"An algorithm is a step-by-step solution to a problem.",a:true},
        {q:"Python uses curly braces {} to define code blocks.",a:false},
        {q:"A router connects different networks together.",a:true},
        {q:"CSS stands for Computer Style Sheets.",a:false},
        {q:"A loop executes a block of code repeatedly.",a:true},
        {q:"The Internet and the World Wide Web are the same thing.",a:false},
        {q:"A function can return a value in most programming languages.",a:true},
        {q:"Binary uses base-10 number system.",a:false},
        {q:"An API allows different software applications to communicate.",a:true},
        {q:"JavaScript is only used for front-end development.",a:false},
        {q:"A database stores and organizes data.",a:true},
        {q:"IPv6 addresses are shorter than IPv4 addresses.",a:false},
        {q:"An adverb can modify a verb, adjective, or another adverb.",a:true},
        {q:"'Quickly' is an adjective.",a:false},
        {q:"'Always' is an adverb of frequency.",a:true},
        {q:"'Very' is an adverb of manner.",a:false},
        {q:"Conjunctive adverbs connect two independent clauses.",a:true},
        {q:"'However' is used to show contrast.",a:true},
        {q:"Modal verbs can be used without a main verb.",a:false},
        {q:"'Could' is the past form of 'can'.",a:true},
        {q:"Adverbs of place tell us when something happens.",a:false},
        {q:"'Therefore' shows a result or conclusion.",a:true},
        {q:"Past perfect uses 'had + past participle'.",a:true},
        {q:"'Seldom' means the same as 'often'.",a:false},
        {q:"'Nevertheless' means despite that.",a:true},
        {q:"Adverbs of degree modify nouns.",a:false},
        {q:"Present continuous uses 'be + verb-ing'.",a:true},
    ]
};

// ── Conversation Scenarios ──
const CONV_SCENARIOS = {
    id: [
        {
            title:"Memesan Makanan di Restoran 🍽️",
            turns:[
                {speaker:"Waiter",text:"Good evening! Welcome. Are you ready to order?",type:"info"},
                {speaker:"You",text:"",options:["Yes, I'd like a grilled chicken, please.","Me want chicken!","Give me food now.","I no hungry."],correct:0,feedback:["Bagus! Sopan dan benar secara grammar.","Salah — 'Me want' tidak benar. Pakai 'I would like'.","Terlalu kasar dan informal untuk situasi ini.","Ga nyambung sama situasinya!"]},
                {speaker:"Waiter",text:"Great choice! And what would you like to drink?",type:"info"},
                {speaker:"You",text:"",options:["I'll have orange juice, thank you.","Orange juice! Now!","I want drink orange.","No drink."],correct:0,feedback:["Sempurna! 'I'll have' adalah cara yang natural dan sopan.","Terlalu singkat dan tidak sopan.","'I want drink' salah — harusnya 'I want to drink' atau 'I'd like'.","Jawaban ini tidak sesuai konteks."]},
                {speaker:"Waiter",text:"Anything else?",type:"info"},
                {speaker:"You",text:"",options:["No, that's all. Thank you!","Nothing.","No more food.","I'm finish."],correct:0,feedback:["Perfect! Kalimat lengkap dan sopan.","Terlalu singkat, meski secara grammar bisa diterima.","Agak aneh tapi bisa dipahami.","'I'm finish' salah — harusnya 'I'm done' atau 'That's all'."]},
            ]
        },
        {
            title:"Nanya Arah ke Perpustakaan 🗺️",
            turns:[
                {speaker:"You",text:"",options:["Excuse me, could you tell me where the library is?","Hey! Where library?","Library where?","I find library."],correct:0,feedback:["Sempurna! Sangat sopan dan natural.","Terlalu singkat dan tidak sopan.","Tidak ada verb — kalimat tidak lengkap.","'I find library' salah grammatically."]},
                {speaker:"Stranger",text:"Sure! Go straight, then turn left at the traffic light.",type:"info"},
                {speaker:"You",text:"",options:["I see. So I go straight and turn left. Got it, thank you!","OK.","I understand go left.","Yes yes yes."],correct:0,feedback:["Bagus! Lo mengkonfirmasi arah sekaligus berterima kasih.","Terlalu singkat.","'I understand go left' tidak tepat secara grammar.","Tidak natural sama sekali."]},
            ]
        },
        {
            title:"Perkenalan di Kelas Baru 👋",
            turns:[
                {speaker:"Classmate",text:"Hi! I don't think we've met. I'm Rony.",type:"info"},
                {speaker:"You",text:"",options:["Hi Rony! I'm Azwar. Nice to meet you!","Hello. Azwar my name.","I Azwar.","My name is Azwar, nice meet you."],correct:0,feedback:["Perfect! Perkenalan yang natural dan ramah.","Urutan kata salah — harusnya 'My name is Azwar'.","Terlalu singkat, kurang sopan.","Hampir benar tapi 'nice meet you' seharusnya 'nice to meet you'."]},
                {speaker:"Rony",text:"Nice to meet you too! What's your major?",type:"info"},
                {speaker:"You",text:"",options:["I'm studying Computer Engineering. How about you?","Computer Engineering.","I study in Computer Engineering major.","My major Computer Engineering."],correct:0,feedback:["Bagus banget! Natural dan balik nanya juga.","Bisa dipahami tapi terlalu singkat.","Agak wordy tapi grammar-nya benar.","Tidak ada verb — tidak complete."]},
            ]
        },
        {
            title:"Meminjam Catatan di Kelas 📝",
            turns:[
                {speaker:"You",text:"",options:["Excuse me, could I borrow your notes from last class?","Give me your notes.","Can I see note?","Note borrow please."],correct:0,feedback:["Sopan dan benar! 'Could I borrow' adalah cara yang tepat.","Terlalu langsung dan tidak sopan.","'Note' seharusnya 'notes' (plural), dan kurang lengkap.","Tidak natural dan grammar salah."]},
                {speaker:"Classmate",text:"Sure! Here you go.",type:"info"},
                {speaker:"You",text:"",options:["Thank you so much! I'll return them after I copy.","Thanks.","I will give back later.","OK thank."],correct:0,feedback:["Sempurna! Lengkap dan sopan.","Bisa diterima tapi sangat singkat.","Grammar benar tapi agak informal.","'Thank' seharusnya 'thanks' atau 'thank you'."]},
            ]
        },
        {
            title:"Presentasi di Depan Kelas 🎤",
            turns:[
                {speaker:"Teacher",text:"Alright, please start your presentation.",type:"info"},
                {speaker:"You",text:"",options:["Good morning everyone. Today I will present about network security.","Hello. My topic is network.","I will talk network security today.","Good morning, my presentation about network security."],correct:0,feedback:["Excellent! Pembuka yang profesional dan lengkap.","Terlalu singkat dan informal.","Kurang artikel 'about' dan agak kaku.","'my presentation about' tidak complete — butuh 'is about'."]},
                {speaker:"Teacher",text:"Good start! Please continue.",type:"info"},
                {speaker:"You",text:"",options:["First, I'd like to explain what network security means.","First, I explain network security.","Network security is my first point.","Okay so, network security..."],correct:0,feedback:["Profesional dan natural! 'I'd like to explain' sangat baik.","Grammar kurang tepat — harusnya 'I will explain' atau 'I'd like to explain'.","Agak aneh untuk pembuka presentasi.","Terlalu informal untuk presentasi."]},
            ]
        },
    ],
    en: [
        {
            title:"Ordering Food at a Restaurant 🍽️",
            turns:[
                {speaker:"Waiter",text:"Good evening! Welcome. Are you ready to order?",type:"info"},
                {speaker:"You",text:"",options:["Yes, I'd like a grilled chicken, please.","Me want chicken!","Give me food now.","I no hungry."],correct:0,feedback:["Great! Polite and grammatically correct.","Wrong — 'Me want' is incorrect. Use 'I would like'.","Too rude and informal for this situation.","Doesn't match the context!"]},
                {speaker:"Waiter",text:"Great choice! And what would you like to drink?",type:"info"},
                {speaker:"You",text:"",options:["I'll have orange juice, thank you.","Orange juice! Now!","I want drink orange.","No drink."],correct:0,feedback:["Perfect! 'I'll have' is natural and polite.","Too blunt and impolite.","'I want drink' is wrong — should be 'I want to drink' or 'I'd like'.","Doesn't fit the context."]},
                {speaker:"Waiter",text:"Anything else?",type:"info"},
                {speaker:"You",text:"",options:["No, that's all. Thank you!","Nothing.","No more food.","I'm finish."],correct:0,feedback:["Perfect! Complete and polite.","Very brief, but grammatically acceptable.","Understandable but a bit odd.","'I'm finish' is wrong — should be 'I'm done' or 'That's all'."]},
            ]
        },
        {
            title:"Asking for Directions 🗺️",
            turns:[
                {speaker:"You",text:"",options:["Excuse me, could you tell me where the library is?","Hey! Where library?","Library where?","I find library."],correct:0,feedback:["Perfect! Very polite and natural.","Too brief and impolite.","No verb — incomplete sentence.","'I find library' is grammatically incorrect."]},
                {speaker:"Stranger",text:"Sure! Go straight, then turn left at the traffic light.",type:"info"},
                {speaker:"You",text:"",options:["I see. So I go straight and turn left. Got it, thank you!","OK.","I understand go left.","Yes yes yes."],correct:0,feedback:["Great! You confirmed the directions and thanked them.","Too brief.","'I understand go left' is grammatically incorrect.","Not natural at all."]},
            ]
        },
        {
            title:"Introducing Yourself in a New Class 👋",
            turns:[
                {speaker:"Classmate",text:"Hi! I don't think we've met. I'm Rony.",type:"info"},
                {speaker:"You",text:"",options:["Hi Rony! I'm Azwar. Nice to meet you!","Hello. Azwar my name.","I Azwar.","My name is Azwar, nice meet you."],correct:0,feedback:["Perfect! Natural and friendly introduction.","Wrong word order — should be 'My name is Azwar'.","Too brief and impolite.","Almost right but 'nice meet you' should be 'nice to meet you'."]},
                {speaker:"Rony",text:"Nice to meet you too! What's your major?",type:"info"},
                {speaker:"You",text:"",options:["I'm studying Computer Engineering. How about you?","Computer Engineering.","I study in Computer Engineering major.","My major Computer Engineering."],correct:0,feedback:["Great! Natural and you asked back too.","Understandable but too brief.","Slightly wordy but grammatically correct.","No verb — incomplete sentence."]},
            ]
        },
    ]
};

// ══════════════════════════════════════════════════════
// QUESTION GENERATORS — Fixed & Unlimited
// ══════════════════════════════════════════════════════
function pick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function pickN(arr, n) { return shuffleArray([...arr]).slice(0,n); }

// ARRANGE — fixed logic: build sentence first, then make words from it
function genArrange() {
    const templates = [
        () => {
            const name = pick(BANK.names);
            const verb = pick(BANK.verbS); // 3rd person s
            const obj  = pick(BANK.object);
            const adv  = pick(BANK.manner);
            const time = pick(BANK.timeExpr);
            const sentence = `${name} ${verb} ${obj} ${adv} ${time}`;
            const words = sentence.split(' ');
            const hint = currentLang==='id'
                ? `${name} melakukan sesuatu dengan cara tertentu pada waktu tertentu`
                : `${name} does something in a certain way at a certain time`;
            return buildArrangeQ(sentence, words, hint);
        },
        () => {
            const name = pick(BANK.names);
            const modal = pick(BANK.modal);
            const verb = pick(BANK.verbBase);
            const obj  = pick(BANK.object);
            const place = pick(BANK.placeExpr);
            const sentence = `${name} ${modal} ${verb} ${obj} ${place}`;
            const words = sentence.split(' ');
            const hint = currentLang==='id'
                ? `${name} bisa melakukan sesuatu di suatu tempat`
                : `${name} can do something somewhere`;
            return buildArrangeQ(sentence, words, hint);
        },
        () => {
            const name = pick(BANK.names);
            const verb = pick(BANK.verbPast);
            const obj  = pick(BANK.object);
            const time = pick(BANK.timeExpr);
            const sentence = `${name} ${verb} ${obj} ${time}`;
            const words = sentence.split(' ');
            const hint = currentLang==='id'
                ? `${name} melakukan sesuatu di masa lalu`
                : `${name} did something in the past`;
            return buildArrangeQ(sentence, words, hint);
        },
        () => {
            const name = pick(BANK.names);
            const freq = pick(BANK.frequency);
            const verb = pick(BANK.verbS);
            const obj  = pick(BANK.object);
            const sentence = `${name} ${freq} ${verb} ${obj}`;
            const words = sentence.split(' ');
            const hint = currentLang==='id'
                ? `${name} melakukan sesuatu dengan frekuensi tertentu`
                : `${name} does something with a certain frequency`;
            return buildArrangeQ(sentence, words, hint);
        },
        () => {
            const name = pick(BANK.names);
            const verb = pick(BANK.verbContPres);
            const obj  = pick(BANK.object);
            const deg  = pick(BANK.degree);
            const sentence = `${name} ${verb} ${obj} ${deg} well`;
            const words = sentence.split(' ');
            const hint = currentLang==='id'
                ? `${name} sedang melakukan sesuatu dengan baik`
                : `${name} is currently doing something well`;
            return buildArrangeQ(sentence, words, hint);
        },
    ];
    return pick(templates)();
}

function buildArrangeQ(sentence, words, hint) {
    // Distractors: words NOT in the sentence
    const allExtra = [...BANK.manner, ...BANK.frequency, ...BANK.degree, ...BANK.modal];
    const distractors = pickN(allExtra.filter(w => !words.includes(w)), 2);
    const allWords = shuffleArray([...words, ...distractors]);
    return {
        target: sentence,
        hint: hint,
        words: allWords,
        hints: [
            `${t('arrange_hint_1')} "${words[0]}"`,
            `${t('arrange_hint_2')} "${words[0]} ${words[1]}"`,
            `${t('arrange_hint_answer')} "${sentence}"`,
        ]
    };
}

// TENSES
function genTenses() {
    const templates = [
        () => {
            const name = pick(BANK.names);
            const obj  = pick(BANK.object);
            const past = pick(["yesterday","last night","last week","last month","two days ago"]);
            const correct = pick(BANK.verbPast);
            const wrong = [pick(BANK.verbBase), pick(BANK.verbS), pick(BANK.verbContPres)];
            return {
                question: `${name} ___ ${obj} ${past}.`,
                answer: correct,
                options: shuffleArray([correct, ...wrong]),
                hint: currentLang==='id'?`Kejadian di masa lampau → gunakan V2 (Simple Past)`:`Past action → use Simple Past (V2)`
            };
        },
        () => {
            const name = pick(BANK.names);
            const obj  = pick(BANK.object);
            const correct = pick(BANK.verbContPres);
            const wrong = [pick(BANK.verbBase), pick(BANK.verbPast), pick(BANK.verbPP)];
            return {
                question: `${name} ___ ${obj} right now.`,
                answer: correct,
                options: shuffleArray([correct, ...wrong]),
                hint: currentLang==='id'?`Sedang terjadi sekarang → Present Continuous (is/am/are + V-ing)`:`Happening right now → Present Continuous`
            };
        },
        () => {
            const name = pick(BANK.names);
            const obj  = pick(BANK.object);
            const freq = pick(["every day","every week","every morning","always","usually"]);
            const vb = pick(BANK.verbBase);
            const correct = name==="They"||name==="We" ? vb : vb+'s';
            const wrong = [vb, pick(BANK.verbPast), `is ${vb}ing`].filter(x=>x!==correct);
            return {
                question: `${name} ___ ${obj} ${freq}.`,
                answer: correct,
                options: shuffleArray([correct, ...wrong.slice(0,3)]),
                hint: currentLang==='id'?`Kebiasaan/rutinitas → Simple Present (tambah -s untuk He/She)`:`Habit/routine → Simple Present`
            };
        },
        () => {
            const name = pick(BANK.names);
            const obj  = pick(BANK.object);
            const correct = pick(BANK.verbPP);
            const wrong = [pick(BANK.verbBase), pick(BANK.verbPast), pick(BANK.verbContPres)];
            return {
                question: `${name} ___ ${obj} before.`,
                answer: correct,
                options: shuffleArray([correct, ...wrong]),
                hint: currentLang==='id'?`Pengalaman sampai sekarang → Present Perfect (has/have + V3)`:`Experience up to now → Present Perfect`
            };
        },
        () => {
            const name = pick(BANK.names);
            const obj  = pick(BANK.object);
            const modal = pick(["will","should","must","might"]);
            const vb = pick(BANK.verbBase);
            const correct = `${modal} ${vb}`;
            const wrong = [pick(BANK.verbS), pick(BANK.verbPast), pick(BANK.verbContPres)];
            return {
                question: `${name} ___ ${obj} tomorrow.`,
                answer: correct,
                options: shuffleArray([correct, ...wrong]),
                hint: currentLang==='id'?`Masa depan/modal → modal + base verb`:`Future/modal → modal + base verb`
            };
        },
    ];
    return pick(templates)();
}

// TRUE/FALSE
function genTrueFalse() {
    if (Math.random() > 0.4) {
        // Dynamic grammar/vocab
        const dynamic = [
            () => {
                const adv = pick(BANK.manner);
                const isTrue = Math.random() > 0.5;
                const cat = isTrue ? "manner" : pick(["frequency","place","degree","time"]);
                return {
                    question: `"${adv.charAt(0).toUpperCase()+adv.slice(1)}" is an adverb of ${cat}.`,
                    answer: isTrue?"True":"False",
                    hint: isTrue?`Yes, "${adv}" describes HOW something is done.`:`"${adv}" describes manner, not ${cat}.`
                };
            },
            () => {
                const freq = pick(BANK.frequency);
                const isTrue = Math.random() > 0.5;
                const cat = isTrue ? "frequency" : pick(["manner","place","degree"]);
                return {
                    question: `"${freq.charAt(0).toUpperCase()+freq.slice(1)}" is an adverb of ${cat}.`,
                    answer: isTrue?"True":"False",
                    hint: isTrue?`Correct! "${freq}" tells HOW OFTEN.`:`"${freq}" tells HOW OFTEN — that's frequency, not ${cat}.`
                };
            },
            () => {
                const modal = pick(BANK.modal);
                const isTrue = Math.random() > 0.5;
                const stmt = isTrue
                    ? `"${modal.charAt(0).toUpperCase()+modal.slice(1)}" is a modal verb.`
                    : `"${modal.charAt(0).toUpperCase()+modal.slice(1)}" is a regular verb.`;
                return {
                    question: stmt,
                    answer: isTrue?"True":"False",
                    hint: isTrue?`Yes, "${modal}" is a modal verb.`:`"${modal}" is a modal verb, not a regular verb.`
                };
            },
        ];
        return pick(dynamic)();
    } else {
        const fact = pick(BANK.tfFacts);
        return { question: fact.q, answer: fact.a?"True":"False", hint: fact.a?"This statement is correct.":"This statement is incorrect." };
    }
}

// Generate questions — unlimited by just calling generators each time
function generateQuestions(mode, count) {
    const qs = [];
    const seen = new Set();
    let attempts = 0;
    while (qs.length < count && attempts < count * 20) {
        attempts++;
        let q;
        if (mode==='mode1') q = genArrange();
        else if (mode==='mode2') q = genTenses();
        else q = genTrueFalse();
        const key = (q.target||q.question||'').slice(0,40);
        if (!seen.has(key)) { seen.add(key); qs.push(q); }
    }
    return qs;
}

// ── SOUND ──
const AudioCtx = window.AudioContext||window.webkitAudioContext;
let audioCtx=null;
function getACtx(){ if(!audioCtx) audioCtx=new AudioCtx(); return audioCtx; }
function playSound(type){
    try{
        const ctx=getACtx(),osc=ctx.createOscillator(),gain=ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        if(type==='correct'){osc.type='sine';osc.frequency.setValueAtTime(440,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(880,ctx.currentTime+0.15);gain.gain.setValueAtTime(0.3,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.4);osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.4);}
        else if(type==='wrong'){osc.type='sawtooth';osc.frequency.setValueAtTime(300,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(100,ctx.currentTime+0.3);gain.gain.setValueAtTime(0.2,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.3);osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.3);}
        else if(type==='complete'){[523,659,784,1047].forEach((freq,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(0,ctx.currentTime+i*0.12);g.gain.linearRampToValueAtTime(0.3,ctx.currentTime+i*0.12+0.05);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.12+0.3);o.start(ctx.currentTime+i*0.12);o.stop(ctx.currentTime+i*0.12+0.35);});}
        else if(type==='click'){osc.type='sine';osc.frequency.setValueAtTime(600,ctx.currentTime);gain.gain.setValueAtTime(0.1,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.08);osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.08);}
        else if(type==='tick'){osc.type='square';osc.frequency.setValueAtTime(800,ctx.currentTime);gain.gain.setValueAtTime(0.05,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.05);osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.05);}
        else if(type==='levelup'){[523,659,784,880,1047,1318].forEach((freq,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(0,ctx.currentTime+i*0.08);g.gain.linearRampToValueAtTime(0.25,ctx.currentTime+i*0.08+0.04);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.08+0.25);o.start(ctx.currentTime+i*0.08);o.stop(ctx.currentTime+i*0.08+0.3);});}
    }catch(e){console.warn('Sound:',e);}
}

// CONFETTI
function launchConfetti(){
    const colors=['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899','#06b6d4'];
    for(let i=0;i<80;i++){
        const el=document.createElement('div');
        el.style.cssText=`position:fixed;z-index:9999;pointer-events:none;width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>.5?'50%':'2px'};left:${Math.random()*100}vw;top:-20px;animation:confettiFall ${1.5+Math.random()*2}s ease-in forwards;animation-delay:${Math.random()*0.5}s;`;
        document.body.appendChild(el);
        setTimeout(()=>el.remove(),3500);
    }
    if(!document.getElementById('confetti-style')){const s=document.createElement('style');s.id='confetti-style';s.innerText='@keyframes confettiFall{to{transform:translateY(105vh) rotate(720deg);opacity:0}}';document.head.appendChild(s);}
}

// TOAST
function showToast(msg,color='blue',duration=2500){
    const colors={blue:'bg-blue-600',green:'bg-green-600',red:'bg-red-600',purple:'bg-purple-600',orange:'bg-orange-500'};
    const el=document.createElement('div');
    el.className=`fixed top-20 left-1/2 -translate-x-1/2 z-[999] ${colors[color]||colors.blue} text-white px-5 py-3 rounded-2xl font-black text-sm shadow-2xl animate__animated animate__fadeInDown text-center max-w-xs`;
    el.innerText=msg; document.body.appendChild(el);
    setTimeout(()=>{el.classList.add('animate__fadeOut');setTimeout(()=>el.remove(),500);},duration);
}

// ── FIREBASE ──
function emptyUser(name,i){return{name,absen:i+1,played:0,correct:0,errors:0,achievements:{},modeStats:{},lastActive:0};}
let classDatabase=classList.map((name,i)=>emptyUser(name,i));

async function fbSaveUser(user){try{await set(ref(db,`users/${user.name}`),user);showSyncStatus('ok');}catch(e){console.warn('FB:',e);showSyncStatus('err');}}
async function fbLoadAll(){
    try{
        const snap=await get(ref(db,'users'));
        if(snap.exists()){const d=snap.val();classDatabase=classList.map((name,i)=>{const s=d[name];return s?{achievements:{},modeStats:{},lastActive:0,...s}:emptyUser(name,i);});}
        else{const b={};classDatabase.forEach(u=>{b[u.name]=u;});await set(ref(db,'users'),b);}
        showSyncStatus('ok');
    }catch(e){console.warn('FB load:',e);showSyncStatus('err');}
}
function fbListenLeaderboard(){
    onValue(ref(db,'users'),snap=>{
        if(!snap.exists())return;
        const d=snap.val();
        classDatabase=classList.map((name,i)=>{const s=d[name];return s?{achievements:{},modeStats:{},lastActive:0,...s}:emptyUser(name,i);});
        if(!document.getElementById('menu-leaderboard')?.classList.contains('hidden'))renderLeaderboard();
        // Update landing lb preview
        updateLandingLB();
        updateLandingStats();
        if(loggedInUser)checkIncomingChallenge(d);
    });
}
function showSyncStatus(st){
    const el=document.getElementById('sync-status');if(!el)return;
    const map={ok:[t('sync_ok'),'text-green-400'],err:[t('sync_err'),'text-yellow-400'],syncing:[t('syncing'),'text-blue-400 animate-pulse']};
    const[txt,cls]=map[st]||map.syncing;el.innerText=txt;el.className=`text-[8px] font-bold ${cls}`;
}

// ── CHALLENGE ──
async function sendChallenge(toName){
    if(!loggedInUser||toName===loggedInUser)return;
    try{await set(ref(db,`challenges/${toName}`),{from:loggedInUser,mode:currentMode||'mode1',diff:currentDifficulty||'beginner',ts:Date.now()});showToast(`${t('challenge_sent')} ${toName}! ⚔️`,'orange');}
    catch(e){console.warn('Challenge:',e);}
}
function checkIncomingChallenge(data){
    const ch=data.challenges?.[loggedInUser];
    if(!ch||!ch.from||Date.now()-ch.ts>60000)return;
    if(!document.getElementById('challenge-modal')?.classList.contains('hidden'))return;
    const modal=document.getElementById('challenge-modal');
    document.getElementById('challenge-from-name').innerText=ch.from;
    modal.classList.remove('hidden');
    modal.dataset.from=ch.from; modal.dataset.mode=ch.mode; modal.dataset.diff=ch.diff;
}
window.acceptChallenge=async()=>{
    const m=document.getElementById('challenge-modal');
    currentMode=m.dataset.mode; currentDifficulty=m.dataset.diff;
    m.classList.add('hidden');
    try{await update(ref(db,`challenges/${loggedInUser}`),{from:null});}catch(e){}
    switchMenu('quiz'); beginQuiz();
};
window.declineChallenge=async()=>{
    document.getElementById('challenge-modal').classList.add('hidden');
    try{await update(ref(db,`challenges/${loggedInUser}`),{from:null});}catch(e){}
};

// ── ACHIEVEMENTS ──
const ACH_LEVEL_THRESHOLDS=[0,1,3,7,12,20];
const ACH_DEFS=[
    {id:"played_total",icon:"🎮",names:["–","First Boot","Regular User","Dedicated Coder","Quiz Addict","LingoReal Legend"],descs:["Belum main","Main 1x","Main 3x","Main 7x","Main 12x","Main 20x"],trackFn:u=>u.played},
    {id:"correct_total",icon:"✅",names:["–","First Strike","Sharpshooter","Answer Machine","Precision Engineer","Perfect Compiler"],descs:["Belum benar","1 benar","3 benar","7 benar","12 benar","20 benar"],trackFn:u=>u.correct},
    {id:"errors_total",icon:"💥",names:["–","Bug Starter","Bug Hunter","Error Veteran","Crash Master","Chaos Engineer"],descs:["Belum error","Error 1x","Error 3x","Error 7x","Error 12x","Error 20x"],trackFn:u=>u.errors},
    {id:"diff_beginner",icon:"🌱",names:["–","Sapling","Sprout","Seedling Pro","Growth Hacker","Bloom Master"],descs:["–","Beginner 1x","3x","7x","12x","20x"],trackFn:u=>(u.achievements.diff_beginner||0)},
    {id:"diff_intermediate",icon:"⚡",names:["–","Volt Spark","Thunder Coder","Storm Solver","Circuit Breaker","Voltage Overlord"],descs:["–","Intermediate 1x","3x","7x","12x","20x"],trackFn:u=>(u.achievements.diff_intermediate||0)},
    {id:"diff_advanced",icon:"🔥",names:["–","Ember","Blaze Coder","Inferno Dev","Wildfire Engineer","Phoenix Ascendant"],descs:["–","Advanced 1x","3x","7x","12x","20x"],trackFn:u=>(u.achievements.diff_advanced||0)},
    {id:"arrange_beginner",icon:"🔤",names:["–","Newbie Arranger","Word Weaver","Syntax Scout","Sentence Smith","Lexicon Architect"],descs:["–","Arrange Beginner 1x","3x","7x","12x","20x"],trackFn:u=>(u.achievements.arrange_beginner||0)},
    {id:"arrange_intermediate",icon:"🔡",names:["–","Phrase Builder","Clause Crafter","Grammar Guerrilla","Syntax Commander","Sentence Sovereign"],descs:["–","Arrange Intermediate 1x","3x","7x","12x","20x"],trackFn:u=>(u.achievements.arrange_intermediate||0)},
    {id:"arrange_advanced",icon:"🔠",names:["–","Elite Arranger","Wordsmith Pro","Syntax Virtuoso","Linguistic Warlord","Grand Sentence Architect"],descs:["–","Arrange Advanced 1x","3x","7x","12x","20x"],trackFn:u=>(u.achievements.arrange_advanced||0)},
    {id:"tenses_beginner",icon:"⏱️",names:["–","Tense Rookie","Past Dabbler","Present Planner","Future Gazer","Time Initiate"],descs:["–","Tenses Beginner 1x","3x","7x","12x","20x"],trackFn:u=>(u.achievements.tenses_beginner||0)},
    {id:"tenses_intermediate",icon:"⏳",names:["–","Tense Tactician","Verb Veteran","Grammar Gladiator","Tense Titan","Chronological Commander"],descs:["–","Tenses Intermediate 1x","3x","7x","12x","20x"],trackFn:u=>(u.achievements.tenses_intermediate||0)},
    {id:"tenses_advanced",icon:"🕰️",names:["–","Perfect Master","Temporal Assassin","Grammar Overlord","Tense Warlord","Omniscient Grammarian"],descs:["–","Tenses Advanced 1x","3x","7x","12x","20x"],trackFn:u=>(u.achievements.tenses_advanced||0)},
    {id:"tf_beginner",icon:"⚖️",names:["–","Fact Freshman","Truth Seeker","Reality Checker","Myth Buster Jr.","Logic Apprentice"],descs:["–","T/F Beginner 1x","3x","7x","12x","20x"],trackFn:u=>(u.achievements.tf_beginner||0)},
    {id:"tf_intermediate",icon:"🔍",names:["–","Fact Detective","Truth Analyst","Reality Engineer","Myth Destroyer","Logic Strategist"],descs:["–","T/F Intermediate 1x","3x","7x","12x","20x"],trackFn:u=>(u.achievements.tf_intermediate||0)},
    {id:"tf_advanced",icon:"🧠",names:["–","Knowledge Assassin","Truth Overlord","Fact Annihilator","Reality Dominator","Omniscient Oracle"],descs:["–","T/F Advanced 1x","3x","7x","12x","20x"],trackFn:u=>(u.achievements.tf_advanced||0)},
    {id:"conv_beginner",icon:"💬",names:["–","Conversation Starter","Small Talker","Dialogue Dabbler","Chat Master","Conversation King"],descs:["–","Conversation Beginner 1x","3x","7x","12x","20x"],trackFn:u=>(u.achievements.conv_beginner||0)},
    {id:"conv_intermediate",icon:"🗣️",names:["–","Phrase Dropper","Fluent Talker","Dialogue Pro","Speech Crafter","Eloquent Speaker"],descs:["–","Conversation Intermediate 1x","3x","7x","12x","20x"],trackFn:u=>(u.achievements.conv_intermediate||0)},
    {id:"conv_advanced",icon:"🎙️",names:["–","Debate Rookie","Rhetoric Warrior","Silver Tongue","Golden Orator","Linguistic Sovereign"],descs:["–","Conversation Advanced 1x","3x","7x","12x","20x"],trackFn:u=>(u.achievements.conv_advanced||0)},
];
function getAchLevel(def,user){const v=def.trackFn(user);let lv=0;for(let i=1;i<=5;i++){if(v>=ACH_LEVEL_THRESHOLDS[i])lv=i;}return lv;}
function achBadgeHTML(def,lv){if(!lv)return '';return `<span class="badge-ach badge-ach-${lv}">${def.icon} ${def.names[lv]}</span>`;}
function checkLevelUps(before,after){
    const newLvs=[];
    ACH_DEFS.forEach(def=>{const b=getAchLevel(def,before),a=getAchLevel(def,after);if(a>b)newLvs.push({def,newLv:a});});
    if(newLvs.length>0){playSound('levelup');launchConfetti();const f=newLvs[0];showToast(`${t('level_up')} ${f.def.icon} ${f.def.names[f.newLv]} (LV${f.newLv})`,'purple',4000);}
}

// ── BADGES ──
function badgeHTML(type){
    switch(type){case 'ce2f':return`<span class="badge-ce2f">🎓 CE-2F</span>`;case 'webdev':return`<span class="badge-webdev">⚡ WEB DEV</span>`;case 'lecturer':return`<span class="badge-lecturer">🎖️ LECTURER</span>`;case 'gold':return`<span class="badge-gold">👑 ENG GOLD</span>`;case 'silver':return`<span class="badge-silver">🥈 SILVER</span>`;case 'bronze':return`<span class="badge-bronze">🥉 BRONZE</span>`;default:return '';}
}
function getBadges(student,rank){
    let b=[badgeHTML('ce2f')];
    if(student.name==="Azwar")b.push(badgeHTML('webdev'));
    if(student.name==="Winda")b.push(badgeHTML('lecturer'));
    if(student.correct>0&&student.name!=="Winda"){if(rank===1)b.push(badgeHTML('gold'));else if(rank===2)b.push(badgeHTML('silver'));else if(rank===3)b.push(badgeHTML('bronze'));}
    const achB=ACH_DEFS.map(d=>({d,lv:getAchLevel(d,student)})).filter(x=>x.lv>0).sort((a,b2)=>b2.lv-a.lv).slice(0,3).map(x=>achBadgeHTML(x.d,x.lv));
    b.push(...achB);return b.join(' ');
}

// ── FAV ──
function getFavMode(user){
    const ms=user.modeStats||{};
    const modes={mode1:(ms.arrange_beginner||0)+(ms.arrange_intermediate||0)+(ms.arrange_advanced||0),mode2:(ms.tenses_beginner||0)+(ms.tenses_intermediate||0)+(ms.tenses_advanced||0),mode3:(ms.tf_beginner||0)+(ms.tf_intermediate||0)+(ms.tf_advanced||0),mode4:(ms.conv_beginner||0)+(ms.conv_intermediate||0)+(ms.conv_advanced||0)};
    const best=Object.entries(modes).sort((a,b)=>b[1]-a[1])[0];
    return(!best||best[1]===0)?null:best[0];
}
function getFavDiff(user){const a=user.achievements||{};const d={beginner:a.diff_beginner||0,intermediate:a.diff_intermediate||0,advanced:a.diff_advanced||0};const best=Object.entries(d).sort((a,b)=>b[1]-a[1])[0];return(!best||best[1]===0)?null:best[0];}
function modeName(k){return({mode1:t('fav_arrange'),mode2:t('fav_tenses'),mode3:t('fav_tf'),mode4:t('fav_conv')})[k]||t('fav_none');}
function diffLabel(k){if(!k)return t('fav_none');return({beginner:DIFFICULTY_CONFIG.beginner.icon+' '+t('diff_beginner'),intermediate:DIFFICULTY_CONFIG.intermediate.icon+' '+t('diff_intermediate'),advanced:DIFFICULTY_CONFIG.advanced.icon+' '+t('diff_advanced')})[k]||t('fav_none');}

// ── STATE ──
let currentIdx=0,currentErrorCount=0,selectedWords=[];
let loggedInUser="",currentMode="",currentDifficulty="";
let activeQuestions=[],prevMenuBeforeInspect='leaderboard';
let quizTimer=null,timeLeft=0,snapshotBeforeQuiz=null;
let convScenario=null,convTurnIdx=0;

function addLog(msg){const el=document.getElementById('terminal');if(!el)return;const p=document.createElement('p');p.innerText=`> ${msg}`;el.appendChild(p);el.scrollTop=el.scrollHeight;}
let terminalVisible=false;
window.toggleTerminal=()=>{terminalVisible=!terminalVisible;document.getElementById('terminal').classList.toggle('hidden-term',!terminalVisible);document.getElementById('terminal-toggle').querySelector('div').innerText=terminalVisible?'▼ LOG':'▲ LOG';};

// ONLINE
const ONLINE_THRESHOLD=5*60*1000;
function isOnline(user){return user.lastActive&&(Date.now()-user.lastActive)<ONLINE_THRESHOLD;}
async function heartbeat(){if(!loggedInUser)return;const user=classDatabase.find(u=>u.name===loggedInUser);if(!user)return;user.lastActive=Date.now();try{await update(ref(db,`users/${loggedInUser}`),{lastActive:user.lastActive});}catch(e){}}

// ── LOGIN — NO PERSISTENT SESSION ──
async function enterDashboard(name){
    loggedInUser=name;
    // NO saveSession
    showSyncStatus('syncing');
    await fbLoadAll();
    fbListenLeaderboard();
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');
    document.getElementById('login-modal').classList.add('hidden');
    updateUserDashboard();
    applyLang();
    heartbeat();
    setInterval(heartbeat,60000);
    addLog(`Authorized: ${loggedInUser}.`);
    const mbl=document.getElementById('mobile-username-label');
    if(mbl)mbl.innerText=loggedInUser;
}

window.addEventListener('DOMContentLoaded',async()=>{
    spawnCodeRain();
    applyLang();
    await fbLoadAll();
    fbListenLeaderboard();
    updateLandingStats();
    updateLandingLB();
    document.getElementById('terminal').classList.add('hidden-term');
    // NO session restore — always show landing
});

document.getElementById('login-btn').onclick=()=>{
    playSound('click');
    let input=document.getElementById('username-input').value.trim();
    if(!input)return;
    let fmt=input.charAt(0).toUpperCase()+input.slice(1).toLowerCase();
    if(input.toLowerCase().includes("dosen"))fmt="Winda";
    if(classList.includes(fmt)){
        const w=document.createElement('div');
        w.className="fixed inset-0 bg-[#0a0f1e] z-[400] flex flex-col items-center justify-center text-center p-6 animate__animated animate__fadeIn";
        w.innerHTML=`<div class="animate__animated animate__zoomIn"><div class="text-6xl mb-4">⚡</div><h1 class="text-4xl font-black text-white italic mb-2">YO WELKAM BEK CUY!</h1><p class="text-blue-400 font-bold text-xl">Target: <span class="text-white">${fmt}</span></p><p class="text-gray-500 text-xs mt-10 animate-pulse">INITIATING CE-2F PROTOCOL...</p></div>`;
        document.body.appendChild(w);
        setTimeout(()=>{w.classList.add('animate__fadeOut');setTimeout(()=>{w.remove();enterDashboard(fmt);},500);},2000);
    }else{document.getElementById('login-error').classList.remove('hidden');}
};
document.getElementById('username-input').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('login-btn').click();});
window.doLogout=()=>{location.reload();};

// ── LANDING PAGE ──
function updateLandingStats(){
    const total=classDatabase.reduce((a,u)=>a+u.played,0);
    const online=classDatabase.filter(u=>isOnline(u)).length;
    const ltp=document.getElementById('land-total-played');if(ltp)ltp.innerText=total;
    const loc=document.getElementById('land-online-count');if(loc)loc.innerText=online;
}
function updateLandingLB(){
    const el=document.getElementById('landing-lb-preview');if(!el)return;
    const sorted=[...classDatabase].filter(u=>u.name!=="Winda").sort((a,b)=>b.correct-a.correct).slice(0,5);
    if(sorted.every(u=>u.played===0)){el.innerHTML=`<div class="p-6 text-center text-gray-500 text-sm">Belum ada yang main. Jadilah yang pertama! 🚀</div>`;return;}
    el.innerHTML=sorted.map((u,i)=>`
        <div class="flex items-center gap-3 p-4 ${i<3?'':'opacity-60'}">
            <span class="text-${i===0?'yellow':i===1?'gray':i===2?'orange':'gray'}-400 font-black text-lg w-6">${i===0?'👑':i===1?'🥈':i===2?'🥉':i+1}</span>
            <div class="flex items-center gap-2 flex-1 min-w-0">
                <span class="${isOnline(u)?'dot-online':'dot-offline'}"></span>
                <span class="font-bold text-sm truncate">${u.name}</span>
            </div>
            <span class="text-green-400 font-black text-sm">${u.correct}</span>
            <span class="text-gray-600 text-xs">correct</span>
        </div>`).join('');
}

// ── USER DASHBOARD ──
function updateUserDashboard(){
    const user=classDatabase.find(u=>u.name===loggedInUser);if(!user)return;
    const sorted=[...classDatabase].sort((a,b)=>b.correct-a.correct);
    const rank=sorted.findIndex(u=>u.name===loggedInUser)+1;
    document.getElementById('stat-name').innerText=user.name;
    document.getElementById('stat-played').innerText=user.played;
    document.getElementById('stat-errors').innerText=user.errors;
    document.getElementById('user-badge-main').innerHTML=getBadges(user,rank);
    if(user.name==="Winda"){
        document.getElementById('label-absensi').innerText="Jabatan";
        document.getElementById('stat-absensi').innerText="Dosen";
        const sub=document.getElementById('stat-absensi-sub');sub.innerText="English Practice";sub.classList.remove('hidden');
    }else{
        document.getElementById('label-absensi').innerText=currentLang==='id'?"Absensi Ke-":"Attendance No.";
        document.getElementById('stat-absensi').innerText=user.absen;
        document.getElementById('stat-absensi-sub').classList.add('hidden');
    }
    const rk=[t('rank_gold'),t('rank_silver'),t('rank_bronze')];
    document.getElementById('stat-rank').innerText=`#${rank}`;
    document.getElementById('stat-rank-label').innerText=rank<=3?rk[rank-1]:t('rank_student');
    const favM=getFavMode(user),favD=getFavDiff(user);
    document.getElementById('stat-fav-mode').innerText=favM?modeName(favM):t('fav_none');
    document.getElementById('stat-fav-diff').innerText=favD?diffLabel(favD):'---';
    const tot=user.correct+user.errors,pct=tot>0?Math.round((user.correct/tot)*100):0;
    document.getElementById('stat-acc-bar').style.width=`${pct}%`;
    document.getElementById('stat-acc-pct').innerText=`${pct}%`;
    document.getElementById('stat-acc-correct').innerText=`${user.correct} ✓`;
    document.getElementById('stat-acc-errors').innerText=`${user.errors} ✗`;
    document.getElementById('my-status-dot').className='dot-online';
    document.getElementById('my-status-text').innerText=t('online_label');
    document.getElementById('my-status-text').className='text-xs text-green-400 font-bold';
    const topAch=ACH_DEFS.map(d=>({d,lv:getAchLevel(d,user)})).filter(x=>x.lv>0).sort((a,b)=>b.lv-a.lv).slice(0,6);
    const prev=document.getElementById('profile-ach-preview');
    if(prev)prev.innerHTML=topAch.length?topAch.map(x=>achBadgeHTML(x.d,x.lv)).join(''):`<span class="text-gray-600 text-xs">Belum ada achievement. Mulai quiz!</span>`;
}

window.switchMenu=menuName=>{
    playSound('click');
    document.querySelectorAll('.menu-content').forEach(el=>el.classList.add('hidden'));
    document.querySelectorAll('.menu-btn').forEach(el=>{el.classList.remove('bg-blue-600','text-white');el.classList.add('text-gray-400','hover:bg-white/5');});
    document.getElementById(`menu-${menuName}`).classList.remove('hidden');
    const btn=document.querySelector(`[data-menu="${menuName}"]`);
    if(btn){btn.classList.add('bg-blue-600','text-white');btn.classList.remove('text-gray-400','hover:bg-white/5');}
    if(menuName==='leaderboard')renderLeaderboard();
    if(menuName==='achievement')renderAchievements();
    if(menuName==='user')updateUserDashboard();
    if(menuName==='quiz')resetQuizFlow();
};

// ── QUIZ FLOW ──
function resetQuizFlow(){
    currentMode="";currentDifficulty="";
    document.getElementById('quiz-mode-select').classList.remove('hidden');
    document.getElementById('quiz-diff-select').classList.add('hidden');
    document.getElementById('quiz-ready').classList.remove('hidden');
    document.getElementById('game-engine').classList.add('hidden');
    document.getElementById('quiz-card').classList.remove('hidden');
    document.getElementById('conv-card').classList.add('hidden');
    document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('ring-4','ring-blue-500','scale-105'));
    document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('ring-4','ring-white/40','scale-105'));
}

window.selectQuizMode=mode=>{
    playSound('click');currentMode=mode;
    document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('ring-4','ring-blue-500','scale-105'));
    document.querySelector(`[data-mode="${mode}"]`)?.classList.add('ring-4','ring-blue-500','scale-105');
    const diff=document.getElementById('quiz-diff-select');
    diff.classList.remove('hidden');
    diff.classList.add('animate__animated','animate__fadeInUp');
    setTimeout(()=>diff.classList.remove('animate__animated','animate__fadeInUp'),600);
};

window.selectDifficulty=diff=>{
    playSound('click');currentDifficulty=diff;
    document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('ring-4','ring-white/40','scale-105'));
    document.getElementById(`diff-${diff}`)?.classList.add('ring-4','ring-white/40','scale-105');
};

window.startActualQuiz=()=>{
    if(!currentMode){showToast(currentLang==='id'?'Pilih mode quiz dulu!':'Choose a quiz mode first!','red');return;}
    if(!currentDifficulty){const h=document.getElementById('diff-hint');h.classList.remove('hidden');setTimeout(()=>h.classList.add('hidden'),2500);return;}
    beginQuiz();
};

function beginQuiz(){
    playSound('click');
    document.getElementById('quiz-ready').classList.add('hidden');
    document.getElementById('game-engine').classList.remove('hidden');
    const user=classDatabase.find(u=>u.name===loggedInUser);
    snapshotBeforeQuiz=JSON.parse(JSON.stringify(user));
    user.played++;fbSaveUser(user);updateUserDashboard();
    addLog(`Quiz: ${currentMode}|${currentDifficulty}`);

    if(currentMode==='mode4'){
        // Conversation mode
        document.getElementById('quiz-card').classList.add('hidden');
        document.getElementById('conv-card').classList.remove('hidden');
        initConversation();
    }else{
        document.getElementById('quiz-card').classList.remove('hidden');
        document.getElementById('conv-card').classList.add('hidden');
        activeQuestions=generateQuestions(currentMode,DIFFICULTY_CONFIG[currentDifficulty].count);
        currentIdx=0;
        init();
    }
}

// ── TIMER ──
function startTimer(){
    const cfg=DIFFICULTY_CONFIG[currentDifficulty];
    timeLeft=cfg.time;updateTimerUI();
    if(quizTimer)clearInterval(quizTimer);
    quizTimer=setInterval(()=>{
        timeLeft--;updateTimerUI();
        if(timeLeft<=5)playSound('tick');
        if(timeLeft<=0){clearInterval(quizTimer);quizTimer=null;onTimeUp();}
    },1000);
}
function stopTimer(){if(quizTimer){clearInterval(quizTimer);quizTimer=null;}}
function updateTimerUI(){
    const el=document.getElementById('quiz-timer');if(!el)return;
    el.innerText=`⏱ ${timeLeft}s`;
    el.className=timeLeft<=5?'text-red-400 font-black text-sm animate-pulse':'text-blue-400 font-black text-sm';
}
function onTimeUp(){
    playSound('wrong');
    const user=classDatabase.find(u=>u.name===loggedInUser);
    user.errors++;fbSaveUser(user);updateUserDashboard();
    document.getElementById('ai-feedback').classList.remove('hidden');
    document.getElementById('ai-text').innerText=t('time_up');
    currentErrorCount++;
    setTimeout(()=>{
        document.getElementById('ai-feedback').classList.add('hidden');
        if(currentIdx===activeQuestions.length-1)showFinalStats();
        else{currentIdx++;init();}
    },2000);
}

// ── QUIZ ENGINE ──
function init(){
    stopTimer();
    const q=activeQuestions[currentIdx];
    const optZone=document.getElementById('options-zone'),ansZone=document.getElementById('answer-zone');
    optZone.innerHTML="";ansZone.innerHTML="";
    selectedWords=[];currentErrorCount=0;
    document.getElementById('ai-feedback').classList.add('hidden');
    document.getElementById('q-number').innerText=`${t('task_label')} ${currentIdx+1} ${t('of_label')} ${activeQuestions.length}`;
    document.getElementById('progress-bar').style.width=`${(currentIdx/activeQuestions.length)*100}%`;
    document.getElementById('check-btn').innerText=t('execute_btn');
    startTimer();

    if(currentMode==='mode1'){
        document.getElementById('soal-teks').innerText=`"${q.hint}"`;
        ansZone.classList.remove('hidden');
        // Show all words from q.words (already shuffled in generator)
        q.words.forEach(word=>{
            const btn=createNode('button',word,"bg-white text-gray-700 px-4 py-2 rounded-2xl font-bold border-b-4 border-gray-100 shadow-sm text-sm active:scale-95");
            btn.onclick=()=>{
                playSound('click');selectedWords.push(word);btn.style.visibility='hidden';
                const chip=createNode('button',word,"bg-blue-600 text-white px-4 py-2 rounded-2xl font-bold animate__animated animate__bounceIn text-sm");
                chip.onclick=()=>{playSound('click');selectedWords=selectedWords.filter(w=>w!==word);chip.remove();btn.style.visibility='visible';};
                ansZone.appendChild(chip);
            };
            optZone.appendChild(btn);
        });
    }else{
        document.getElementById('soal-teks').innerText=q.question;
        ansZone.classList.add('hidden');
        const choices=currentMode==='mode2'?q.options:[t('btn_true'),t('btn_false')];
        choices.forEach(opt=>{
            const btn=createNode('button',opt,"bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold border border-white/10 hover:bg-blue-600 transition-all text-sm active:scale-95");
            btn.onclick=()=>{
                playSound('click');
                // For mode3, map localized to English answer
                if(currentMode==='mode3'){
                    const rawOpt=(opt===t('btn_true'))?'True':(opt===t('btn_false'))?'False':opt;
                    selectedWords=[rawOpt];
                }else{selectedWords=[opt];}
                document.querySelectorAll('#options-zone button').forEach(b=>b.classList.remove('ring-4','ring-blue-500','bg-blue-600'));
                btn.classList.add('ring-4','ring-blue-500','bg-blue-600');
            };
            optZone.appendChild(btn);
        });
    }
}
function createNode(t2,text,cls){const el=document.createElement(t2);el.innerText=text;el.className=cls;return el;}

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
    }else{
        playSound('wrong');
        const user=classDatabase.find(u=>u.name===loggedInUser);
        user.errors++;fbSaveUser(user);updateUserDashboard();
        document.getElementById('ai-feedback').classList.remove('hidden');
        document.getElementById('ai-text').innerText=q.hints?q.hints[Math.min(currentErrorCount,q.hints.length-1)]:`${t('alert_label')}: ${q.hint}`;
        currentErrorCount++;
        startTimer();
    }
};

function showSuccess(){
    successOverlay.innerHTML=`<div class="bg-[#1e293b] border-2 border-blue-500 p-8 rounded-3xl max-w-sm w-full text-center animate__animated animate__zoomIn shadow-2xl"><div class="text-6xl mb-4">🚀</div><h2 class="text-2xl font-black text-blue-400 mb-2 italic uppercase">${t('success_title')}</h2><button onclick="nextQ()" class="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-[0_4px_0_0_#1d4ed8]">${t('success_btn')}</button></div>`;
    successOverlay.classList.remove('hidden');
}
window.nextQ=()=>{successOverlay.classList.add('hidden');currentIdx++;init();};

function showFinalStats(){
    stopTimer();playSound('complete');
    const user=classDatabase.find(u=>u.name===loggedInUser);
    if(!user.achievements)user.achievements={};
    user.achievements[`diff_${currentDifficulty}`]=(user.achievements[`diff_${currentDifficulty}`]||0)+1;
    const modeKey={mode1:'arrange',mode2:'tenses',mode3:'tf',mode4:'conv'}[currentMode];
    const comboKey=`${modeKey}_${currentDifficulty}`;
    user.achievements[comboKey]=(user.achievements[comboKey]||0)+1;
    if(!user.modeStats)user.modeStats={};
    user.modeStats[comboKey]=(user.modeStats[comboKey]||0)+1;
    fbSaveUser(user);
    if(snapshotBeforeQuiz)checkLevelUps(snapshotBeforeQuiz,user);
    updateUserDashboard();
    const cfg=DIFFICULTY_CONFIG[currentDifficulty];
    document.getElementById('game-engine').innerHTML=`
        <div class="bg-[#1e293b] border-2 border-blue-500/50 rounded-3xl p-8 text-center animate__animated animate__fadeInUp">
            <div class="text-6xl mb-4">🎯</div>
            <h1 class="text-2xl font-black mb-1 text-blue-400 italic">${t('complete_title')}</h1>
            <p class="text-gray-400 text-sm mb-2">${cfg.icon} ${cfg.label} — ${cfg.count} ${t('of_label').toLowerCase()} ${cfg.count}</p>
            <p class="text-gray-600 text-xs mb-6">${t('unlimited_note')}</p>
            <div class="grid grid-cols-2 gap-3">
                <button onclick="replayQuiz()" class="bg-blue-600 py-3 rounded-2xl font-black text-white text-sm">${t('play_again')}</button>
                <button onclick="goBackToModeSelect()" class="bg-white/5 border border-white/10 py-3 rounded-2xl font-bold text-gray-300 text-sm">${t('back_to_menu')}</button>
            </div>
        </div>`;
    addLog(`Done: ${modeKey} ${currentDifficulty}`);
}

// UNLIMITED — replay with fresh generated questions
window.replayQuiz=()=>{
    document.getElementById('quiz-ready').classList.add('hidden');
    document.getElementById('game-engine').classList.remove('hidden');
    document.getElementById('quiz-card').classList.remove('hidden');
    document.getElementById('conv-card').classList.add('hidden');
    if(currentMode==='mode4'){document.getElementById('quiz-card').classList.add('hidden');document.getElementById('conv-card').classList.remove('hidden');initConversation();}
    else{activeQuestions=generateQuestions(currentMode,DIFFICULTY_CONFIG[currentDifficulty].count);currentIdx=0;init();}
};

window.goBackToModeSelect=()=>{
    document.getElementById('game-engine').classList.add('hidden');
    document.getElementById('quiz-ready').classList.remove('hidden');
    resetQuizFlow();
};

// ── CONVERSATION MODE ──
function initConversation(){
    const pool=CONV_SCENARIOS[currentLang]||CONV_SCENARIOS['en'];
    convScenario=pick(pool);
    convTurnIdx=0;
    const card=document.getElementById('conv-card');
    card.classList.remove('hidden');
    document.getElementById('conv-scenario-label').innerText=t('conv_scenario_label');
    document.getElementById('conv-scenario').innerText=convScenario.title;
    document.getElementById('conv-chat').innerHTML='';
    document.getElementById('conv-options').innerHTML='';
    document.getElementById('q-number').innerText=`Conversation`;
    document.getElementById('progress-bar').style.width='0%';
    document.getElementById('quiz-timer').innerText='';
    renderConvTurn();
}

function renderConvTurn(){
    if(convTurnIdx>=convScenario.turns.length){endConversation();return;}
    const turn=convScenario.turns[convTurnIdx];
    const chat=document.getElementById('conv-chat');
    const opts=document.getElementById('conv-options');
    opts.innerHTML='';

    // Show speaker info bubble
    if(turn.type==='info'){
        const bubble=document.createElement('div');
        bubble.className='flex items-start gap-2';
        bubble.innerHTML=`<div class="text-xs text-gray-500 font-bold mt-1 w-14 flex-shrink-0">${turn.speaker}</div><div class="chat-bubble-left text-sm text-white">${turn.text}</div>`;
        chat.appendChild(bubble);
        chat.scrollTop=chat.scrollHeight;
        convTurnIdx++;
        setTimeout(()=>renderConvTurn(),500);
    }else{
        // Player turn — show options
        const youLabel=document.createElement('p');
        youLabel.className='text-xs text-blue-400 font-black mb-2';
        youLabel.innerText=currentLang==='id'?'Pilih responmu:':'Choose your response:';
        opts.appendChild(youLabel);
        turn.options.forEach((opt,i)=>{
            const btn=document.createElement('button');
            btn.className='chat-option text-sm text-white w-full';
            btn.innerText=opt;
            btn.onclick=()=>{
                // Disable all options
                opts.querySelectorAll('button').forEach(b=>{b.disabled=true;b.style.cursor='default';});
                const isCorrect=i===turn.correct;
                btn.classList.add(isCorrect?'correct-opt':'wrong-opt');
                if(!isCorrect){opts.querySelectorAll('button')[turn.correct].classList.add('correct-opt');}

                // Show player bubble
                const playerBubble=document.createElement('div');
                playerBubble.className='flex items-start gap-2 flex-row-reverse';
                playerBubble.innerHTML=`<div class="text-xs text-gray-500 font-bold mt-1 w-14 flex-shrink-0 text-right">You</div><div class="chat-bubble-right text-sm text-white">${opt}</div>`;
                chat.appendChild(playerBubble);

                // Feedback
                const fb=document.createElement('div');
                fb.className=`text-xs ${isCorrect?'text-green-400':'text-red-400'} font-bold mt-2 mb-2 px-2`;
                fb.innerText=turn.feedback[i];
                opts.appendChild(fb);

                // Update stats
                const user=classDatabase.find(u=>u.name===loggedInUser);
                if(isCorrect){playSound('correct');user.correct++;}else{playSound('wrong');user.errors++;}
                fbSaveUser(user);
                chat.scrollTop=chat.scrollHeight;

                // Update progress
                document.getElementById('progress-bar').style.width=`${((convTurnIdx+1)/convScenario.turns.length)*100}%`;

                // Next turn button
                const nextBtn=document.createElement('button');
                nextBtn.className='w-full mt-3 bg-blue-600 text-white font-black py-3 rounded-2xl text-sm active:scale-95 transition-all';
                nextBtn.innerText=t('success_btn');
                nextBtn.onclick=()=>{convTurnIdx++;opts.innerHTML='';renderConvTurn();};
                opts.appendChild(nextBtn);
            };
            opts.appendChild(btn);
        });
    }
}

function endConversation(){
    const opts=document.getElementById('conv-options');
    opts.innerHTML=`
        <div class="text-center py-4">
            <div class="text-4xl mb-3">🎉</div>
            <p class="font-black text-green-400 mb-4">${t('conv_done')}</p>
            <div class="grid grid-cols-2 gap-3">
                <button onclick="replayConversation()" class="bg-blue-600 text-white font-black py-3 rounded-2xl text-sm">${t('conv_next')}</button>
                <button onclick="goBackToModeSelect()" class="bg-white/5 border border-white/10 text-gray-300 font-bold py-3 rounded-2xl text-sm">${t('back_to_menu')}</button>
            </div>
        </div>`;
    // Update achievements
    showFinalConvStats();
}

function showFinalConvStats(){
    const user=classDatabase.find(u=>u.name===loggedInUser);
    if(!user.achievements)user.achievements={};
    user.achievements[`conv_${currentDifficulty}`]=(user.achievements[`conv_${currentDifficulty}`]||0)+1;
    if(!user.modeStats)user.modeStats={};
    user.modeStats[`conv_${currentDifficulty}`]=(user.modeStats[`conv_${currentDifficulty}`]||0)+1;
    fbSaveUser(user);
    if(snapshotBeforeQuiz)checkLevelUps(snapshotBeforeQuiz,user);
    updateUserDashboard();playSound('complete');
}

window.replayConversation=()=>initConversation();

// ── ACHIEVEMENTS ──
function renderAchievements(){
    const user=classDatabase.find(u=>u.name===loggedInUser);
    const grid=document.getElementById('ach-grid');grid.innerHTML="";
    let unlocked=0;const total=ACH_DEFS.length*5;
    const lvColors=['bg-gray-700','bg-emerald-500','bg-blue-500','bg-purple-500','bg-amber-500','bg-pink-500'];
    const bdrColors=['border-gray-700/50','border-emerald-500/50','border-blue-500/50','border-purple-500/50','border-amber-500/50','border-purple-400'];
    ACH_DEFS.forEach(def=>{
        const lv=getAchLevel(def,user);if(lv>0)unlocked+=lv;
        const nextLv=lv<5?lv+1:null,nextThr=nextLv?ACH_LEVEL_THRESHOLDS[nextLv]:null;
        const curVal=def.trackFn(user),prog=nextThr?Math.min((curVal/nextThr)*100,100):100;
        const card=document.createElement('div');
        card.className=`ach-card bg-[#1e293b] rounded-2xl p-5 border ${bdrColors[lv]} ${lv===0?'ach-locked':''}`;
        card.innerHTML=`
            <div class="flex items-start gap-3 mb-3"><div class="text-3xl">${def.icon}</div>
            <div class="flex-1 min-w-0"><div class="flex items-center gap-2 flex-wrap mb-1">
                <p class="font-black text-white text-sm">${def.names[lv]||def.names[0]}</p>
                ${lv>0?achBadgeHTML(def,lv):`<span class="badge-ach" style="background:#1f2937;border:1px solid #374151;color:#6b7280">${t('ach_locked_badge')}</span>`}
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
    if(ob)ob.innerHTML=topLv>0?`<span class="badge-ach badge-ach-${topLv} text-sm px-3 py-1">⭐ LV${topLv}</span>`:'';
}

// ── LEADERBOARD ──
function renderLeaderboard(){
    const tbody=document.getElementById('leaderboard-body');tbody.innerHTML="";
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
                <td class="p-4 text-sm ${isMe?'text-blue-400':'text-blue-100'}"><span class="font-bold">${student.name}</span>${isMe?` <span class="text-[8px] text-gray-500">${t('lb_you')}</span>`:''}${challengeBtn}</td>
                <td class="p-4 text-center">${statusDot}</td>
                <td class="p-4 text-center text-gray-400 text-sm">${student.played}</td>
                <td class="p-4 text-center text-green-400 text-sm">${student.correct}</td>
                <td class="p-4 text-center text-red-400 text-sm">${student.errors}</td>
                <td class="p-4 text-right">${getBadges(student,i+1)} ${achB}</td>
            </tr>`;
    });
}

// ── INSPECT USER ──
window.inspectUser=name=>{
    prevMenuBeforeInspect='leaderboard';
    const user=classDatabase.find(u=>u.name===name);if(!user)return;
    const sorted=[...classDatabase].sort((a,b)=>b.correct-a.correct);
    const rank=sorted.findIndex(u=>u.name===name)+1;
    const tot=user.correct+user.errors,pct=tot>0?Math.round((user.correct/tot)*100):0;
    const favM=getFavMode(user),favD=getFavDiff(user);
    const topAch=ACH_DEFS.map(d=>({d,lv:getAchLevel(d,user)})).filter(x=>x.lv>0).sort((a,b)=>b.lv-a.lv).slice(0,6);
    const onlineDot=isOnline(user)?`<span class="dot-online"></span><span class="text-xs text-green-400 font-bold ml-1">${t('online_label')}</span>`:`<span class="dot-offline"></span><span class="text-xs text-gray-500 font-bold ml-1">${t('offline_label')}</span>`;
    const rk=[t('rank_gold'),t('rank_silver'),t('rank_bronze')];
    const isWinda=name==="Winda";
    const challengeBtn=name!==loggedInUser&&!isWinda?`<button onclick="sendChallenge('${name}')" class="mt-3 px-4 py-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-xl font-black text-sm hover:bg-orange-500 hover:text-white transition-all">⚔️ ${t('challenge_title').split('!')[0]}</button>`:'';
    document.getElementById('inspect-content').innerHTML=`
        <div class="space-y-4">
            <div class="bg-[#1e293b] rounded-2xl p-5 border border-white/5">
                <div class="flex items-center gap-3 mb-2 flex-wrap"><h2 class="text-2xl font-black text-white">${user.name}</h2><div class="flex items-center gap-1.5">${onlineDot}</div></div>
                <div class="flex flex-wrap gap-1.5 mb-2">${getBadges(user,rank)}</div>
                <p class="text-yellow-400 font-black text-sm">#${rank} — ${rank<=3?rk[rank-1]:t('rank_student')}</p>
                ${isWinda?`<p class="text-gray-400 text-xs mt-1">Jabatan: <span class="text-blue-400 font-bold">Dosen</span> · English Practice</p>`:`<p class="text-gray-400 text-xs mt-1">${currentLang==='id'?'Absensi ke-':'Attendance no.'}<span class="text-blue-400 font-bold">${user.absen}</span></p>`}
                ${challengeBtn}
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-1">${t('label_played')}</p><p class="text-xl font-black text-green-400">${user.played}</p></div>
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-1">Correct</p><p class="text-xl font-black text-blue-400">${user.correct}</p></div>
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-1">${t('label_errors')}</p><p class="text-xl font-black text-red-400">${user.errors}</p></div>
                <div class="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 p-4 rounded-2xl"><p class="text-gray-500 text-[9px] uppercase font-black mb-1">Rank</p><p class="text-xl font-black text-yellow-400">#${rank}</p></div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-2">${t('label_accuracy')}</p><div class="flex gap-2 items-center mb-1"><div class="flex-1 bg-gray-800 h-2.5 rounded-full overflow-hidden"><div class="bg-green-500 h-full rounded-full" style="width:${pct}%"></div></div><span class="text-sm font-black text-green-400">${pct}%</span></div><div class="flex justify-between text-[8px]"><span class="text-green-400 font-bold">${user.correct} ✓</span><span class="text-red-400 font-bold">${user.errors} ✗</span></div></div>
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-2">${t('label_fav_mode')}</p><p class="text-base font-black text-purple-400">${favM?modeName(favM):t('fav_none')}</p><p class="text-[8px] text-gray-500 mt-0.5">${favD?diffLabel(favD):'---'}</p></div>
                <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-2">Quiz Breakdown</p>${['beginner','intermediate','advanced'].map(d=>`<div class="flex justify-between text-[9px] mb-1"><span class="text-gray-400">${DIFFICULTY_CONFIG[d].icon} ${t('diff_'+d)}</span><span class="font-bold text-white">${user.achievements[`diff_${d}`]||0}x</span></div>`).join('')}</div>
            </div>
            <div class="bg-[#1e293b] p-4 rounded-2xl border border-white/5"><p class="text-gray-500 text-[9px] uppercase font-black mb-3">${t('label_top_ach')}</p><div class="flex flex-wrap gap-2">${topAch.length?topAch.map(x=>achBadgeHTML(x.d,x.lv)).join(''):`<span class="text-gray-600 text-xs">Belum ada achievement</span>`}</div></div>
        </div>`;
    document.querySelectorAll('.menu-content').forEach(el=>el.classList.add('hidden'));
    document.getElementById('menu-inspect').classList.remove('hidden');
};
window.backFromInspect=()=>{
    document.querySelectorAll('.menu-content').forEach(el=>el.classList.add('hidden'));
    document.querySelectorAll('.menu-btn').forEach(el=>{el.classList.remove('bg-blue-600','text-white');el.classList.add('text-gray-400');});
    document.getElementById(`menu-${prevMenuBeforeInspect}`).classList.remove('hidden');
    const btn=document.querySelector(`[data-menu="${prevMenuBeforeInspect}"]`);
    if(btn){btn.classList.add('bg-blue-600','text-white');btn.classList.remove('text-gray-400');}
    if(prevMenuBeforeInspect==='leaderboard')renderLeaderboard();
};
window.openUserModal=name=>inspectUser(name);
window.closeModal=()=>document.getElementById('user-modal').classList.add('hidden');
window.sendChallenge=sendChallenge;

function shuffleArray(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}

// ── CODE RAIN ──
function spawnCodeRain(){
    ['code-rain','landing-code-rain'].forEach(id=>{
        const c=document.getElementById(id);if(!c)return;
        c.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden;';
        const syms=['</>','{}','[]','()','//','&&','||','!=','==','++','--','=>','if','for','let','const','fn','def','int','bool','null','true','false','01','10','0xff','var','new','try','git','npm','API','🖥️','💻','⌨️','🔧','🐍','⚛️','🌐','🔒'];
        for(let i=0;i<30;i++){
            const s=document.createElement('span');
            s.style.cssText=`position:absolute;font-family:'Courier New',monospace;color:rgba(59,130,246,.12);font-size:${0.65+Math.random()*.7}rem;font-weight:bold;animation:floatUp linear infinite;user-select:none;left:${Math.random()*100}%;animation-duration:${6+Math.random()*10}s;animation-delay:${Math.random()*8}s;opacity:${0.1+Math.random()*.25};`;
            s.innerText=syms[Math.floor(Math.random()*syms.length)];
            c.appendChild(s);
        }
    });
}
