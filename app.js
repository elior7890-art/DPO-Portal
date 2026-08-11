"use strict";

/* ============================================================
   מרשם — פורטל ניהול ציות
   פרונט-אנד עצמאי (ללא תלות ב-React / dc-runtime), בנוי ישירות
   מהעיצוב פורטל ציות.dc.html. אין כאן חיבור לשרת/מסד נתונים
   אמיתי — הנתונים סטטיים לצורך הדגמה, וההתנהגות האינטראקטיבית
   תואמת בדיוק את מה שהוגדר במקור העיצובי (ניווט בין מסכים
   וטאבים, החלפת תפקיד). אימות, שמירת קבצים, ושליחת הודעות
   דורשים בחירת stack אמיתי ואינם מיושמים כאן.
   ============================================================ */

const state = { screen: "login", role: "dpo", tab: "overview" };

function mute(p) {
  return `color-mix(in srgb, var(--color-text) ${p}%, transparent)`;
}

function levelClass(l) {
  return l === "גבוהה" ? "tag tag-accent" : l === "בינונית" ? "tag tag-outline" : "tag tag-neutral";
}

function tabStyle(active) {
  return `padding:10px 16px;font-size:14px;cursor:pointer;background:transparent;border:0;border-bottom:2px solid ${active ? "var(--color-accent)" : "transparent"};color:${active ? "var(--color-text)" : mute(50)};font-family:inherit;border-radius:6px 6px 0 0`;
}

function segStyle(active) {
  return `padding:0 12px;font-size:12px;cursor:pointer;border:0;font-family:inherit;background:${active ? "var(--color-accent-800)" : "transparent"};color:${active ? "var(--color-accent-100)" : mute(55)}`;
}

function tabDefs() {
  const base = [
    ["overview", "תמונת מצב"],
    ["questionnaire", "שאלון"],
    ["files", "קבצים"],
    ["security", "סיווג אבטחה"],
    ["docs", "מסמכים"],
    ["chat", "הודעות"]
  ];
  if (state.role === "dpo") base.push(["private", "המרחב שלי"]);
  return base;
}

/* ---------------- data (mirrors the mockup's static demo data) ---------------- */

const DATA = {
  clientRows: [
    ["לקוח א׳", "שירותים פיננסיים", "בינונית", 62, 7, "2 קבצים", "היום, 09:12"],
    ["לקוח ב׳", "קמעונאות מקוונת", "גבוהה", 38, 12, "5 קבצים", "אתמול"],
    ["לקוח ג׳", "קליניקה", "גבוהה", 84, 3, "—", "לפני יומיים"],
    ["לקוח ד׳", "סטארטאפ B2B", "בסיסית", 95, 1, "—", "לפני 3 ימים"],
    ["לקוח ה׳", "חינוך", "בינונית", 20, 15, "1 קובץ", "לפני 4 ימים"],
    ["לקוח ו׳", "לוגיסטיקה", "בסיסית", 71, 4, "—", "לפני שבוע"],
    ["לקוח ז׳", "נדל״ן", "בינונית", 55, 8, "3 קבצים", "לפני שבוע"],
    ["לקוח ח׳", "עמותה", "בסיסית", 12, 18, "—", "לפני שבועיים"]
  ],
  moduleRows: [
    ["ממשל ומדיניות", 80, 1, "בבדיקה שלך"],
    ["מיפוי מאגרי מידע (ROPA)", 45, 2, "בתהליך"],
    ["סיווג רמת אבטחה", 100, 0, "ממתין לאישורך"],
    ["בסיס חוקי והסכמות", 60, 2, "בתהליך"],
    ["זכויות נושאי מידע", 30, 3, "בתהליך"],
    ["אבטחת מידע ואירועים", 55, 2, "בתהליך"],
    ["ניהול ספקים ומעבדי מידע", 20, 4, "בתהליך"],
    ["העברות מידע לחו״ל", 0, 0, "לא התחיל"],
    ["הערכת השפעה (DPIA)", 0, 0, "לא רלוונטי כרגע"],
    ["מסמכי לקוח קצה", 70, 1, "בתהליך"]
  ],
  visibility: [
    { mark: "◈", color: "var(--color-accent-400)", what: "קבצים ותשובות שאלון", who: "שניכם" },
    { mark: "◈", color: "var(--color-accent-400)", what: "היסטוריית הודעות", who: "שניכם" },
    { mark: "◇", color: mute(40), what: "הערות פנימיות וסקירות", who: "רק היועץ" },
    { mark: "◇", color: mute(40), what: "טיוטות לפני שחרור", who: "רק היועץ" }
  ],
  records: [
    { name: "מאגר לקוחות — CRM", sens: "מידע רגיל", sensClass: "tag tag-neutral", status: "הושלם",
      statusColor: "var(--color-accent-300)", purpose: "ניהול התקשרות ושירות", volume: "כ-14,000 רשומות",
      access: "9 עובדים", retention: "7 שנים מסיום ההתקשרות", retentionColor: "var(--color-text)" },
    { name: "מאגר מועמדים לעבודה", sens: "מידע רגיש", sensClass: "tag tag-accent", status: "חסרה תקופת שמירה",
      statusColor: "var(--color-accent-400)", purpose: "גיוס", volume: "כ-800 רשומות",
      access: "3 עובדים", retention: "לא הוגדר", retentionColor: "var(--color-accent-300)" },
    { name: "רשימת דיוור שיווקי", sens: "מידע רגיל", sensClass: "tag tag-neutral", status: "הושלם",
      statusColor: "var(--color-accent-300)", purpose: "שיווק ישיר", volume: "כ-31,000 רשומות",
      access: "2 עובדים", retention: "עד הסרה מרשימה", retentionColor: "var(--color-text)" }
  ],
  gapsList: [
    { text: "למאגר המועמדים לא הוגדרה תקופת שמירה", ref: "תק׳ 2(א)" },
    { text: "לא צוין אם רשימת הדיוור נאספה בהסכמה מפורשת", ref: "חוק התקשורת, ס׳ 30א" }
  ],
  files: [
    { name: "רשימת ספקים 2026.xlsx", meta: "142KB · העלה: לקוח א׳", sens: "מידע רגיל", sensClass: "tag tag-neutral", date: "היום, 09:04", status: "ממתין לסקירה", statusColor: "var(--color-accent-300)" },
    { name: "מדיניות פרטיות קיימת.pdf", meta: "310KB · העלה: לקוח א׳", sens: "מידע רגיל", sensClass: "tag tag-neutral", date: "אתמול", status: "נסקר", statusColor: mute(50) },
    { name: "טופס הצטרפות עובדים.docx", meta: "88KB · העלה: לקוח א׳", sens: "מידע רגיש", sensClass: "tag tag-accent", date: "12.08", status: "ממתין לסקירה", statusColor: "var(--color-accent-300)" },
    { name: "צילום מסך הרשאות CRM.png", meta: "1.2MB · העלה: לקוח א׳", sens: "מידע רגיש", sensClass: "tag tag-accent", date: "10.08", status: "נסקר", statusColor: mute(50) },
    { name: "הסכם ספק ענן.pdf", meta: "504KB · העלה: לקוח א׳", sens: "מידע רגיל", sensClass: "tag tag-neutral", date: "08.08", status: "נסקר", statusColor: mute(50) },
    { name: "נוהל גיבויים.docx", meta: "64KB · העלה: לקוח א׳", sens: "מידע רגיל", sensClass: "tag tag-neutral", date: "05.08", status: "נסקר", statusColor: mute(50) }
  ],
  missing: [
    { text: "הסכם עיבוד מידע מול ספק הדיוור" },
    { text: "רשימת בעלי הרשאה למאגר המועמדים" },
    { text: "נוהל טיפול בבקשות עיון" }
  ],
  classFactors: [
    { text: "המאגר כולל מידע רגיש (מועמדים לעבודה)", src: "מודול 2" },
    { text: "מעל 10,000 נושאי מידע", src: "מודול 2" },
    { text: "יותר מ-10 בעלי הרשאה", src: "מודול 2" },
    { text: "אין העברת מידע לחו״ל שדווחה", src: "מודול 8" }
  ],
  duties: [
    { mark: "◈", color: "var(--color-accent-400)", text: "מסמך הגדרות מאגר מעודכן" },
    { mark: "◈", color: "var(--color-accent-400)", text: "נוהל אבטחת מידע כתוב" },
    { mark: "◈", color: "var(--color-accent-400)", text: "סקר סיכונים תקופתי" },
    { mark: "◇", color: mute(38), text: "בקרת גישה ותיעוד גישות" },
    { mark: "◇", color: mute(38), text: "נוהל טיפול באירוע אבטחה" },
    { mark: "◇", color: mute(38), text: "הפרדה בין סביבת פיתוח לייצור" }
  ],
  docs: [
    { name: "מדיניות פרטיות", desc: "נבנתה ממיפוי המאגרים ומהבסיס החוקי שהוזן.", meta: "עודכן היום · גרסה 3",
      banner: "טיוטה — טרם אושרה", bannerBg: "var(--color-accent-800)", bannerFg: "var(--color-accent-100)", action: "אישור ושחרור" },
    { name: "דוח פערים ותוכנית תיקון", desc: "68 פערים, מדורגים לפי תחום ואחראי.", meta: "עודכן היום · גרסה 2",
      banner: "טיוטה — טרם אושרה", bannerBg: "var(--color-accent-800)", bannerFg: "var(--color-accent-100)", action: "אישור ושחרור" },
    { name: "נוהל אבטחת מידע", desc: "מותאם לרמת אבטחה בינונית.", meta: "עודכן 09.08 · גרסה 1",
      banner: "טיוטה — טרם אושרה", bannerBg: "var(--color-accent-800)", bannerFg: "var(--color-accent-100)", action: "אישור ושחרור" },
    { name: "הסכם עיבוד מידע (DPA)", desc: "ממתין לרשימת ספקים מלאה.", meta: "לא נוצר עדיין",
      banner: "חסרים נתונים", bannerBg: "var(--color-neutral-900)", bannerFg: mute(55), action: "מה חסר" },
    { name: "נוסח באנר הסכמה", desc: "אושר ונשלח ללקוח ב-04.08.", meta: "אושר · גרסה 1",
      banner: "אושר על ידך", bannerBg: "var(--color-neutral-900)", bannerFg: "var(--color-accent-300)", action: "הורדה" }
  ],
  messages: [
    ["היועץ", "10:02", "שלחתי לך את השאלון. אפשר להתחיל ממיפוי המאגרים — זה החלק שממנו נגזר כל השאר.", false],
    ["את/ה", "10:20", "מה נחשב מאגר? גם קובץ אקסל של לקוחות?", true],
    ["היועץ", "10:24", "כן. כל אוסף מסודר של פרטי אנשים נחשב מאגר, גם באקסל וגם ב-CRM.", false],
    ["את/ה", "10:31", "הבנתי. העליתי את רשימת הספקים.", true],
    ["היועץ", "11:05", "קיבלתי, אני עובר עליה היום.", false]
  ],
  notes: [
    { text: "איש הקשר מגיב לאט. לתאם שיחה קבועה פעם בשבועיים.", date: "09.08" },
    { text: "רשימת הדיוור מריחה כאיסוף ללא הסכמה — לבדוק לעומק לפני שמאשרים מדיניות.", date: "07.08" }
  ],
  reviews: [
    { name: "רשימת ספקים 2026.xlsx", status: "לא נסקר", color: "var(--color-accent-300)" },
    { name: "טופס הצטרפות עובדים.docx", status: "לא נסקר", color: "var(--color-accent-300)" },
    { name: "מדיניות פרטיות קיימת.pdf", status: "נסקר · תקין", color: mute(50) },
    { name: "נוהל גיבויים.docx", status: "נסקר · חלקי", color: mute(50) }
  ],
  tasks: [
    { mark: "☐", color: "var(--color-accent-400)", title: "לסגור סיווג אבטחה מול הלקוח", due: "עד 14.08" },
    { mark: "☐", color: "var(--color-accent-400)", title: "לעבור על רשימת הספקים", due: "עד 15.08" },
    { mark: "☐", color: "var(--color-accent-400)", title: "לנסח סעיף שמירה למאגר מועמדים", due: "עד 18.08" },
    { mark: "☑", color: mute(40), title: "פגישת פתיחה", due: "בוצע 12.05" }
  ],
  heldDrafts: [
    { name: "מדיניות פרטיות — גרסה 3", meta: "נוצרה היום · לא נשלחה ללקוח" },
    { name: "דוח פערים — גרסה 2", meta: "נוצרה היום · לא נשלחה ללקוח" }
  ],
  hours: [
    { label: "סקירת מסמכים", value: "5.0" },
    { label: "פגישות ושיחות", value: "4.5" },
    { label: "ניסוח מסמכים", value: "3.0" }
  ],
  timeline: [
    { what: "העלאת קובץ: רשימת ספקים 2026.xlsx", who: "לקוח א׳", when: "היום, 09:04" },
    { what: "צפייה בקובץ: טופס הצטרפות עובדים.docx", who: "אתה", when: "היום, 08:51" },
    { what: "עדכון תשובה במודול מיפוי מאגרים", who: "לקוח א׳", when: "אתמול, 17:22" },
    { what: "הפקת טיוטת דוח פערים", who: "המערכת", when: "אתמול, 17:22" },
    { what: "שינוי סיווג אבטחה: בסיסית ← בינונית", who: "המערכת", when: "10.08" },
    { what: "כניסה למערכת", who: "לקוח א׳", when: "10.08, 14:03" }
  ]
};

/* ---------------- screens ---------------- */

function renderLogin() {
  return `
  <div style="min-height:100vh;display:grid;grid-template-columns:1fr 1fr">
    <div style="display:flex;flex-direction:column;justify-content:center;padding:0 88px;gap:28px">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:26px;height:26px;border-radius:7px;border:1px solid var(--color-accent);display:grid;place-items:center">
          <div style="width:9px;height:9px;border-radius:3px;background:var(--color-accent)"></div>
        </div>
        <div style="font-size:17px;font-weight:500">מרשם</div>
        <div style="font-size:13px;color:${mute(50)}">פורטל ניהול ציות</div>
      </div>
      <div>
        <h1 style="font-size:34px;font-weight:500;margin:0 0 10px">כניסה לפורטל</h1>
        <p style="margin:0;max-width:38ch;color:${mute(62)}">
          כל פרויקט ציות מופרד לחלוטין. אתה נכנס רק לפרויקט שלך, ולא לשום נתון של ארגון אחר.
        </p>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;max-width:380px">
        <div style="display:flex;flex-direction:column;gap:6px">
          <label style="font-size:12px;color:${mute(60)}">שם משתמש</label>
          <input class="input" value="dpo@office.co.il" readonly style="text-align:right">
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <label style="font-size:12px;color:${mute(60)}">סיסמה</label>
          <input class="input" type="password" value="••••••••••" readonly style="text-align:right">
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
          <div style="font-size:12px;color:${mute(55)}">היכנס בתור</div>
          <div style="display:flex;gap:10px">
            <button data-action="login-dpo" class="btn btn-primary" style="flex:1;padding:10px">מנהל (DPO)</button>
            <button data-action="login-client" class="btn btn-secondary" style="flex:1;padding:10px">לקוח</button>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:10px;font-size:12px;color:${mute(48)}">
          <span style="color:var(--color-accent-400)">◈</span>
          החיבור מוצפן. סיסמאות נשמרות כ-hash בלבד ואינן ניתנות לשחזור.
        </div>
      </div>
    </div>
    <div style="background:linear-gradient(200deg, var(--color-neutral-900), var(--color-bg) 70%);border-right:1px solid var(--color-divider);display:flex;align-items:center;justify-content:center;padding:64px">
      <div style="max-width:360px;display:flex;flex-direction:column;gap:18px">
        <div style="font-size:11px;letter-spacing:0.1em;color:var(--color-accent);text-transform:uppercase">מה יש כאן</div>
        <div style="display:flex;flex-direction:column;gap:14px">
          <div style="display:flex;gap:12px"><div style="color:var(--color-accent-400)">01</div><div><div style="font-weight:500">שאלון בעשרה תחומים</div><div style="font-size:13px;color:${mute(55)}">כל תחום עומד בפני עצמו, עם ציון והפערים שלו</div></div></div>
          <div style="display:flex;gap:12px"><div style="color:var(--color-accent-400)">02</div><div><div style="font-weight:500">קבצים במקום אחד</div><div style="font-size:13px;color:${mute(55)}">מוצפנים באחסון ובמעבר, עם תיעוד גישה מלא</div></div></div>
          <div style="display:flex;gap:12px"><div style="color:var(--color-accent-400)">03</div><div><div style="font-weight:500">טיוטות לסקירה</div><div style="font-size:13px;color:${mute(55)}">שום מסמך לא מגיע ללקוח לפני אישור מפורש</div></div></div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderNav() {
  const isDpo = state.role === "dpo";
  const encLabel = isDpo ? "מוצפן · תיעוד גישה פעיל" : "החיבור והקבצים שלך מוצפנים";
  const userName = isDpo ? "עו״ד ד. — DPO" : "לקוח א׳";
  const userInitial = isDpo ? "ד" : "א";
  return `
  <div style="position:sticky;top:0;z-index:10;background:color-mix(in srgb, var(--color-bg) 92%, transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--color-divider)">
    <div style="max-width:1320px;margin:0 auto;display:flex;align-items:center;gap:18px;padding:12px 28px">
      <div data-action="go-clients" style="display:flex;align-items:center;gap:9px;cursor:pointer">
        <div style="width:22px;height:22px;border-radius:6px;border:1px solid var(--color-accent);display:grid;place-items:center">
          <div style="width:8px;height:8px;border-radius:2px;background:var(--color-accent)"></div>
        </div>
        <div style="font-size:16px;font-weight:500">מרשם</div>
      </div>
      <div style="width:1px;height:20px;background:var(--color-divider)"></div>
      <div style="display:flex;align-items:center;gap:7px;font-size:12px;color:${mute(55)}">
        <span style="color:var(--color-accent-400)">◈</span>${encLabel}
      </div>
      <div style="margin-right:auto"></div>
      <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:${mute(50)}">מוצג בתור</div>
      <div class="seg" style="height:32px">
        <button data-action="set-role" data-role="dpo" style="${segStyle(isDpo)}">מנהל</button>
        <button data-action="set-role" data-role="client" style="${segStyle(!isDpo)}">לקוח</button>
      </div>
      <div style="display:flex;align-items:center;gap:9px;padding-right:8px;border-right:1px solid var(--color-divider)">
        <div style="width:28px;height:28px;border-radius:50%;background:var(--color-accent-800);color:var(--color-accent-100);display:grid;place-items:center;font-size:12px">${userInitial}</div>
        <div style="font-size:13px">${userName}</div>
      </div>
      <button data-action="logout" class="btn btn-ghost" style="font-size:13px">יציאה</button>
    </div>
  </div>`;
}

function renderClients() {
  const stats = [
    { label: "ממתין לסקירה שלך", value: "11", note: "קבצים" },
    { label: "פערים פתוחים", value: "68", note: "בכל הלקוחות" },
    { label: "טיוטות לא מאושרות", value: "4", note: "לפני שחרור" },
    { label: "לא זזו שבועיים", value: "2", note: "לקוחות" }
  ];
  const statsHtml = stats.map(s => `
    <div style="padding:16px 18px;border-radius:8px;background:var(--color-surface);box-shadow:var(--shadow-sm)">
      <div style="font-size:12px;color:${mute(55)};margin-bottom:8px">${s.label}</div>
      <div style="display:flex;align-items:baseline;gap:8px">
        <div style="font-size:28px;font-weight:500;line-height:1">${s.value}</div>
        <div style="font-size:12px;color:var(--color-accent-300)">${s.note}</div>
      </div>
    </div>`).join("");

  const rowsHtml = DATA.clientRows.map(r => {
    const [name, sector, level, pct, gaps, pending, last] = r;
    const initial = name.replace("לקוח ", "").charAt(0);
    const pendingColor = pending === "—" ? mute(35) : "var(--color-accent-300)";
    return `
      <div data-action="open-project" class="client-row" style="display:grid;grid-template-columns:1.6fr 1fr 1.3fr 0.8fr 1fr 0.9fr;gap:16px;padding:14px 18px;align-items:center;border-bottom:1px solid var(--color-divider);cursor:pointer">
        <div style="display:flex;align-items:center;gap:11px">
          <div style="width:30px;height:30px;border-radius:8px;background:var(--color-neutral-900);display:grid;place-items:center;font-size:12px;color:var(--color-accent-300)">${initial}</div>
          <div>
            <div style="font-weight:500">${name}</div>
            <div style="font-size:12px;color:${mute(45)}">${sector}</div>
          </div>
        </div>
        <div><span class="${levelClass(level)}">${level}</span></div>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="flex:1;height:5px;border-radius:3px;background:var(--color-neutral-900);overflow:hidden">
            <div style="height:100%;background:var(--color-accent-500);width:${pct}%"></div>
          </div>
          <div style="font-size:12px;width:34px;color:${mute(70)}">${pct}%</div>
        </div>
        <div style="font-size:14px">${gaps}</div>
        <div style="font-size:13px;color:${pendingColor}">${pending}</div>
        <div style="font-size:12px;color:${mute(45)}">${last}</div>
      </div>`;
  }).join("");

  return `
  <div style="max-width:1320px;margin:0 auto;padding:34px 28px 80px">
    <div style="display:flex;align-items:flex-end;gap:24px;margin-bottom:26px">
      <div>
        <h1 style="font-size:30px;font-weight:500;margin:0 0 6px">פרויקטי ציות</h1>
        <div style="color:${mute(55)};font-size:14px">8 פרויקטים פעילים · 3 ממתינים לפעולה שלך</div>
      </div>
      <div style="margin-right:auto;display:flex;gap:10px">
        <input class="input" placeholder="חיפוש לקוח" style="width:200px;text-align:right">
        <button class="btn btn-primary">פרויקט חדש</button>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:26px">${statsHtml}</div>

    <div style="border-radius:8px;background:var(--color-surface);box-shadow:var(--shadow-sm);overflow:hidden">
      <div style="display:grid;grid-template-columns:1.6fr 1fr 1.3fr 0.8fr 1fr 0.9fr;gap:16px;padding:12px 18px;font-size:11px;letter-spacing:0.06em;color:${mute(55)};border-bottom:1px solid var(--color-divider)">
        <div>לקוח</div><div>סיווג אבטחה</div><div>השלמת שאלון</div><div>פערים</div><div>ממתין לסקירה שלך</div><div>פעילות אחרונה</div>
      </div>
      ${rowsHtml}
    </div>
    <div style="margin-top:14px;font-size:12px;color:${mute(40)}">
      כל צפייה בפרויקט נרשמת ביומן הגישה של אותו לקוח.
    </div>
  </div>`;
}

function renderProject() {
  const isDpo = state.role === "dpo";
  const tabs = tabDefs().map(([key, label]) =>
    `<button data-action="set-tab" data-tab="${key}" style="${tabStyle(state.tab === key)}">${label}</button>`
  ).join("");

  const backBtn = isDpo
    ? `<button data-action="go-clients" class="btn btn-ghost" style="font-size:13px;padding-inline:0">→ כל הפרויקטים</button>`
    : "";

  let body = "";
  if (state.tab === "overview") body = renderOverviewTab();
  else if (state.tab === "questionnaire") body = renderQuestionnaireTab();
  else if (state.tab === "files") body = renderFilesTab();
  else if (state.tab === "security") body = renderSecurityTab();
  else if (state.tab === "docs") body = renderDocsTab();
  else if (state.tab === "chat") body = renderChatTab();
  else if (state.tab === "private" && isDpo) body = renderPrivateTab();
  else body = renderOverviewTab();

  return `
  <div>
    <div style="border-bottom:1px solid var(--color-divider);background:linear-gradient(180deg, var(--color-neutral-900), transparent)">
      <div style="max-width:1320px;margin:0 auto;padding:22px 28px 0">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">${backBtn}</div>
        <div style="display:flex;align-items:flex-end;gap:16px;margin-bottom:16px">
          <div style="width:42px;height:42px;border-radius:10px;background:var(--color-neutral-900);display:grid;place-items:center;font-size:15px;color:var(--color-accent-300)">א</div>
          <div>
            <h1 style="font-size:26px;font-weight:500;margin:0 0 4px">לקוח א׳</h1>
            <div style="font-size:13px;color:${mute(50)}">פרויקט ציות · נפתח 12.05.2026 · תיקון 13 לחוק הגנת הפרטיות</div>
          </div>
          <div style="margin-right:auto;display:flex;align-items:center;gap:10px">
            <span class="tag tag-accent">סיווג: בינונית</span>
            <span class="tag tag-outline">◈ מוצפן</span>
          </div>
        </div>
        <div style="display:flex;gap:2px">${tabs}</div>
      </div>
    </div>
    <div style="max-width:1320px;margin:0 auto;padding:28px 28px 80px">${body}</div>
  </div>`;
}

function renderOverviewTab() {
  const modulesHtml = DATA.moduleRows.map((m, i) => {
    const [name, pct, gaps, status] = m;
    const num = String(i + 1).padStart(2, "0");
    const pctColor = pct === 0 ? mute(32) : pct >= 80 ? "var(--color-accent-300)" : mute(70);
    const barColor = pct >= 80 ? "var(--color-accent-400)" : pct >= 40 ? "var(--color-accent-500)" : "var(--color-accent-700)";
    const gapsLabel = gaps === 0 ? "אין פערים פתוחים" : `${gaps} פערים פתוחים`;
    return `
      <div data-action="set-tab" data-tab="questionnaire" class="module-card" style="padding:15px 16px;border-radius:8px;background:var(--color-surface);box-shadow:var(--shadow-sm);cursor:pointer">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div style="font-size:11px;color:${mute(38)};width:18px">${num}</div>
          <div style="font-weight:500;font-size:14px">${name}</div>
          <div style="margin-right:auto;font-size:13px;color:${pctColor}">${pct}%</div>
        </div>
        <div style="height:4px;border-radius:3px;background:var(--color-neutral-900);overflow:hidden;margin-bottom:9px">
          <div style="height:100%;background:${barColor};width:${pct}%"></div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:${mute(50)}">
          <span>${gapsLabel}</span>
          <span style="margin-right:auto">${status}</span>
        </div>
      </div>`;
  }).join("");

  const visibilityHtml = DATA.visibility.map(v => `
    <div style="display:flex;gap:9px;padding:7px 0;border-bottom:1px solid var(--color-divider);font-size:13px">
      <div style="color:${v.color};width:14px">${v.mark}</div>
      <div style="flex:1">${v.what}</div>
      <div style="font-size:12px;color:${mute(45)}">${v.who}</div>
    </div>`).join("");

  return `
  <div style="display:grid;grid-template-columns:1fr 300px;gap:28px;align-items:start">
    <div>
      <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:4px">
        <h2 style="font-size:19px;font-weight:500;margin:0">תמונת מצב לפי תחום</h2>
        <div style="font-size:13px;color:${mute(50)}">אין ציון כללי אחד — כל תחום נמדד בנפרד</div>
      </div>
      <div style="margin:16px 0 0;display:grid;grid-template-columns:repeat(2,1fr);gap:12px">${modulesHtml}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px">
      <div style="padding:16px;border-radius:8px;background:var(--color-surface);box-shadow:var(--shadow-sm)">
        <div style="font-size:11px;letter-spacing:0.08em;color:var(--color-accent);margin-bottom:10px">הצעד הבא</div>
        <div style="font-size:14px;margin-bottom:6px">להשלים את מיפוי המאגרים</div>
        <div style="font-size:13px;color:${mute(55)};margin-bottom:12px">שלושה מאגרים מופו, אחד בלי תקופת שמירה. אחרי זה אפשר לסגור את סיווג האבטחה.</div>
        <button data-action="set-tab" data-tab="questionnaire" class="btn btn-primary" style="width:100%">המשך שאלון</button>
      </div>
      <div style="padding:16px;border-radius:8px;background:var(--color-surface);box-shadow:var(--shadow-sm)">
        <div style="font-size:11px;letter-spacing:0.08em;color:var(--color-accent);margin-bottom:12px">מי רואה מה</div>
        ${visibilityHtml}
      </div>
    </div>
  </div>`;
}

function renderQuestionnaireTab() {
  const recordsHtml = DATA.records.map(r => `
    <div style="border-radius:8px;background:var(--color-surface);box-shadow:var(--shadow-sm);overflow:hidden">
      <div style="display:flex;align-items:center;gap:10px;padding:13px 16px;border-bottom:1px solid var(--color-divider)">
        <div style="font-weight:500">${r.name}</div>
        <span class="${r.sensClass}">${r.sens}</span>
        <div style="margin-right:auto;font-size:12px;color:${r.statusColor}">${r.status}</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:14px 16px">
        <div>
          <div style="font-size:11px;color:${mute(45)};margin-bottom:5px">מטרת האיסוף</div>
          <div style="font-size:13px">${r.purpose}</div>
        </div>
        <div>
          <div style="font-size:11px;color:${mute(45)};margin-bottom:5px">היקף רשומות</div>
          <div style="font-size:13px">${r.volume}</div>
        </div>
        <div>
          <div style="font-size:11px;color:${mute(45)};margin-bottom:5px">בעלי גישה</div>
          <div style="font-size:13px">${r.access}</div>
        </div>
        <div>
          <div style="font-size:11px;color:${mute(45)};margin-bottom:5px">תקופת שמירה</div>
          <div style="font-size:13px;color:${r.retentionColor}">${r.retention}</div>
        </div>
      </div>
    </div>`).join("");

  const gapsHtml = DATA.gapsList.map(g => `
    <div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--color-divider);font-size:13px">
      <div style="color:var(--color-accent-400)">—</div>
      <div style="flex:1">${g.text}</div>
      <div style="font-size:12px;color:${mute(42)}">${g.ref}</div>
    </div>`).join("");

  return `
  <div style="display:grid;grid-template-columns:1fr 300px;gap:28px;align-items:start">
    <div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px">
        <div style="font-size:12px;color:${mute(45)}">מודול 2 מתוך 10</div>
        <div style="font-size:12px;color:var(--color-accent-300)">נשמר אוטומטית</div>
      </div>
      <h2 style="font-size:22px;font-weight:500;margin:0 0 8px">מיפוי מאגרי מידע ותהליכי עיבוד</h2>
      <p style="max-width:62ch;color:${mute(60)};margin:0 0 20px">
        כאן רושמים אילו סוגי מידע הארגון שומר, למה, ולכמה זמן. אפשר להתחיל מהברור ולהשלים בהמשך — כל מאגר נשמר בנפרד.
      </p>

      <div style="display:flex;flex-direction:column;gap:12px">
        ${recordsHtml}
        <div style="border-radius:8px;border:1px dashed var(--color-divider);padding:16px">
          <div style="font-size:14px;margin-bottom:10px">להוסיף מאגר נוסף</div>
          <div style="display:grid;grid-template-columns:1.2fr 1fr 1fr auto;gap:10px;align-items:center">
            <input class="input" placeholder="שם המאגר (למשל: רשימת דיוור)" style="text-align:right">
            <select class="input" style="text-align:right"><option>מידע רגיל</option><option>מידע רגיש</option></select>
            <input class="input" placeholder="תקופת שמירה" style="text-align:right">
            <button class="btn btn-primary">הוספה</button>
          </div>
        </div>
      </div>

      <div style="margin-top:22px;padding:16px;border-radius:8px;background:var(--color-neutral-900);box-shadow:var(--shadow-sm)">
        <div style="font-size:11px;letter-spacing:0.08em;color:var(--color-accent);margin-bottom:10px">פערים שזוהו בתחום הזה</div>
        ${gapsHtml}
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:12px">
      <div style="padding:16px;border-radius:8px;background:var(--color-surface);box-shadow:var(--shadow-sm)">
        <div style="font-size:13px;margin-bottom:10px">התקדמות המודול</div>
        <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:10px">
          <div style="font-size:26px;font-weight:500">45%</div>
          <div style="font-size:12px;color:${mute(50)}">3 מתוך 7 שאלות</div>
        </div>
        <div style="height:5px;border-radius:3px;background:var(--color-neutral-900);overflow:hidden">
          <div style="height:100%;width:45%;background:var(--color-accent-500)"></div>
        </div>
      </div>
      <div style="padding:16px;border-radius:8px;background:var(--color-surface);box-shadow:var(--shadow-sm)">
        <div style="font-size:11px;letter-spacing:0.08em;color:var(--color-accent);margin-bottom:9px">למה שואלים את זה</div>
        <p style="font-size:13px;color:${mute(62)};margin:0 0 10px">
          מיפוי המאגרים הוא הבסיס לכל השאר: ממנו נגזרת רמת האבטחה שחלה עליך, וממנו נבנית מדיניות הפרטיות.
        </p>
        <div style="font-size:12px;color:${mute(42)}">תקנות הגנת הפרטיות (אבטחת מידע), תק׳ 2 — מסמך הגדרות המאגר</div>
      </div>
      <div style="padding:16px;border-radius:8px;background:var(--color-surface);box-shadow:var(--shadow-sm)">
        <div style="font-size:13px;margin-bottom:8px">לא בטוח בתשובה?</div>
        <div style="font-size:13px;color:${mute(55)};margin-bottom:12px">אפשר להשאיר ריק ולשאול את היועץ. שדה ריק לא נחשב תשובה שגויה.</div>
        <button data-action="set-tab" data-tab="chat" class="btn btn-secondary" style="width:100%">שאלה ליועץ</button>
      </div>
    </div>
  </div>`;
}

function renderFilesTab() {
  const filesHtml = DATA.files.map(f => `
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:14px;padding:12px 16px;align-items:center;border-bottom:1px solid var(--color-divider)">
      <div>
        <div style="font-size:14px">${f.name}</div>
        <div style="font-size:12px;color:${mute(40)}">${f.meta}</div>
      </div>
      <div><span class="${f.sensClass}">${f.sens}</span></div>
      <div style="font-size:12px;color:${mute(50)}">${f.date}</div>
      <div style="font-size:13px;color:${f.statusColor}">${f.status}</div>
    </div>`).join("");

  const missingHtml = DATA.missing.map(x => `
    <div style="display:flex;gap:9px;padding:7px 0;border-bottom:1px solid var(--color-divider);font-size:13px">
      <div style="color:${mute(35)}">☐</div>
      <div>${x.text}</div>
    </div>`).join("");

  return `
  <div style="display:grid;grid-template-columns:1fr 300px;gap:28px;align-items:start">
    <div>
      <h2 style="font-size:19px;font-weight:500;margin:0 0 6px">קבצים</h2>
      <div style="font-size:13px;color:${mute(50)};margin-bottom:18px">מוצפנים בהעלאה ובאחסון. כל הורדה נרשמת ביומן.</div>
      <div style="border:1px dashed var(--color-accent-700);border-radius:8px;padding:26px;text-align:center;margin-bottom:18px;background:color-mix(in srgb, var(--color-accent) 4%, transparent)">
        <div style="font-size:15px;margin-bottom:6px">גרור לכאן קבצים, או</div>
        <button class="btn btn-primary">בחר מהמחשב</button>
        <div style="font-size:12px;color:${mute(45)};margin-top:10px">PDF, Word, Excel, תמונות · עד 50MB לקובץ</div>
      </div>
      <div style="border-radius:8px;background:var(--color-surface);box-shadow:var(--shadow-sm);overflow:hidden">
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:14px;padding:11px 16px;font-size:11px;color:${mute(50)};border-bottom:1px solid var(--color-divider)">
          <div>קובץ</div><div>רגישות</div><div>הועלה</div><div>סטטוס</div>
        </div>
        ${filesHtml}
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px">
      <div style="padding:16px;border-radius:8px;background:var(--color-surface);box-shadow:var(--shadow-sm)">
        <div style="font-size:11px;letter-spacing:0.08em;color:var(--color-accent);margin-bottom:10px">מה עוד חסר</div>
        ${missingHtml}
      </div>
      <div style="padding:16px;border-radius:8px;background:var(--color-surface);box-shadow:var(--shadow-sm)">
        <div style="font-size:11px;letter-spacing:0.08em;color:var(--color-accent);margin-bottom:9px">גישה לקבצים</div>
        <div style="font-size:13px;color:${mute(60)}">
          רק אתה והיועץ שלך. לקוחות אחרים בפורטל אינם רואים את הפרויקט הזה בשום מסך.
        </div>
      </div>
    </div>
  </div>`;
}

function renderSecurityTab() {
  const factorsHtml = DATA.classFactors.map(k => `
    <div style="display:flex;gap:10px;font-size:13px;padding:8px 0;border-bottom:1px solid var(--color-divider)">
      <div style="color:var(--color-accent-400)">◈</div>
      <div style="flex:1">${k.text}</div>
      <div style="font-size:12px;color:${mute(42)}">${k.src}</div>
    </div>`).join("");

  const dutiesHtml = DATA.duties.map(d => `
    <div style="display:flex;gap:9px;font-size:13px">
      <div style="color:${d.color}">${d.mark}</div>
      <div>${d.text}</div>
    </div>`).join("");

  return `
  <div style="display:grid;grid-template-columns:1fr 340px;gap:28px;align-items:start">
    <div>
      <h2 style="font-size:19px;font-weight:500;margin:0 0 6px">סיווג רמת אבטחה</h2>
      <div style="font-size:13px;color:${mute(50)};margin-bottom:20px">הצעה אוטומטית מתוך תשובות השאלון. אתה מאשר או דורס.</div>

      <div style="padding:22px;border-radius:8px;background:var(--color-surface);box-shadow:var(--shadow-md);margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
          <div style="font-size:11px;letter-spacing:0.08em;color:var(--color-accent)">הצעת המערכת</div>
          <div style="margin-right:auto;font-size:12px;color:${mute(45)}">חושב מחדש לאחרונה: היום, 09:12</div>
        </div>
        <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:14px">
          <div style="font-size:32px;font-weight:500">רמה בינונית</div>
          <div style="font-size:13px;color:${mute(55)}">מתוך בסיסית / בינונית / גבוהה</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:9px;margin-bottom:18px">${factorsHtml}</div>
        <div style="display:flex;align-items:center;gap:12px">
          <button class="btn btn-primary">אישור הסיווג</button>
          <div class="seg"><button class="seg-opt">בסיסית</button><button class="seg-opt" aria-selected="true">בינונית</button><button class="seg-opt">גבוהה</button></div>
          <div style="font-size:12px;color:${mute(42)}">דריסה ידנית תתועד ביומן</div>
        </div>
      </div>

      <div style="padding:18px;border-radius:8px;background:var(--color-neutral-900);box-shadow:var(--shadow-sm)">
        <div style="font-size:11px;letter-spacing:0.08em;color:var(--color-accent);margin-bottom:12px">חובות שנגזרות מרמה בינונית</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 20px">${dutiesHtml}</div>
      </div>
    </div>
    <div style="padding:16px;border-radius:8px;background:var(--color-surface);box-shadow:var(--shadow-sm)">
      <div style="font-size:11px;letter-spacing:0.08em;color:var(--color-accent);margin-bottom:10px">על מה זה מבוסס</div>
      <p style="font-size:13px;color:${mute(62)};margin:0 0 10px">
        תקנות הגנת הפרטיות (אבטחת מידע), התשע״ז-2017 — רמת האבטחה נקבעת לפי סוג המידע, היקף הרשומות ומספר בעלי ההרשאה.
      </p>
      <p style="font-size:12px;color:${mute(42)};margin:0">
        ההצעה היא כלי עבודה. ההחלטה הסופית שלך.
      </p>
    </div>
  </div>`;
}

function renderDocsTab() {
  const docsHtml = DATA.docs.map(d => `
    <div style="border-radius:8px;background:var(--color-surface);box-shadow:var(--shadow-sm);overflow:hidden;display:flex;flex-direction:column">
      <div style="padding:9px 14px;background:${d.bannerBg};color:${d.bannerFg};font-size:12px;letter-spacing:0.02em">${d.banner}</div>
      <div style="padding:16px;display:flex;flex-direction:column;gap:8px;flex:1">
        <div style="font-size:15px;font-weight:500">${d.name}</div>
        <div style="font-size:13px;color:${mute(55)};flex:1">${d.desc}</div>
        <div style="font-size:12px;color:${mute(40)}">${d.meta}</div>
        <div style="display:flex;gap:8px;margin-top:6px">
          <button class="btn btn-secondary" style="font-size:13px">פתיחה</button>
          <button class="btn btn-ghost" style="font-size:13px">${d.action}</button>
        </div>
      </div>
    </div>`).join("");

  return `
  <div>
    <div style="display:flex;align-items:flex-end;gap:20px;margin-bottom:20px">
      <div>
        <h2 style="font-size:19px;font-weight:500;margin:0 0 6px">מסמכים</h2>
        <div style="font-size:13px;color:${mute(50)}">נבנים מנתוני הפרויקט. כל מסמך יוצא כטיוטה עד לאישור מפורש.</div>
      </div>
      <div style="margin-right:auto"><button class="btn btn-primary">הפקת טיוטה חדשה</button></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">${docsHtml}</div>
  </div>`;
}

function renderChatTab() {
  const messagesHtml = DATA.messages.map(m => {
    const [who, time, text, isRight] = m;
    const rowStyle = `display:flex;justify-content:${isRight ? "flex-start" : "flex-end"}`;
    const bubbleStyle = `max-width:74%;padding:11px 14px;border-radius:10px;background:${isRight ? "var(--color-accent-900)" : "var(--color-neutral-900)"}`;
    return `
      <div style="${rowStyle}">
        <div style="${bubbleStyle}">
          <div style="font-size:11px;color:${mute(45)};margin-bottom:5px">${who} · ${time}</div>
          <div style="font-size:14px">${text}</div>
        </div>
      </div>`;
  }).join("");

  return `
  <div style="max-width:760px">
    <h2 style="font-size:19px;font-weight:500;margin:0 0 6px">הודעות</h2>
    <div style="font-size:13px;color:${mute(50)};margin-bottom:18px">שיחה אחת לפרויקט. נשמרת בתוך המערכת, לא באימייל.</div>
    <div style="border-radius:8px;background:var(--color-surface);box-shadow:var(--shadow-sm);padding:18px;display:flex;flex-direction:column;gap:14px">
      ${messagesHtml}
      <div style="display:flex;gap:10px;padding-top:12px;border-top:1px solid var(--color-divider)">
        <input class="input" placeholder="כתוב הודעה" style="flex:1;text-align:right">
        <button class="btn btn-primary">שליחה</button>
      </div>
    </div>
  </div>`;
}

function renderPrivateTab() {
  const notesHtml = DATA.notes.map(n => `
    <div style="padding:10px 0;border-bottom:1px solid var(--color-divider)">
      <div style="font-size:13px;margin-bottom:5px">${n.text}</div>
      <div style="font-size:11px;color:${mute(38)}">${n.date}</div>
    </div>`).join("");

  const reviewsHtml = DATA.reviews.map(rv => `
    <div style="display:flex;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid var(--color-divider)">
      <div style="flex:1;font-size:13px">${rv.name}</div>
      <div style="font-size:12px;color:${rv.color}">${rv.status}</div>
    </div>`).join("");

  const tasksHtml = DATA.tasks.map(t => `
    <div style="display:flex;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid var(--color-divider)">
      <div style="color:${t.color}">${t.mark}</div>
      <div style="flex:1;font-size:13px">${t.title}</div>
      <div style="font-size:12px;color:${mute(38)}">${t.due}</div>
    </div>`).join("");

  const heldDraftsHtml = DATA.heldDrafts.map(hd => `
    <div style="padding:10px 0;border-bottom:1px solid var(--color-divider)">
      <div style="display:flex;gap:10px;align-items:center">
        <div style="flex:1;font-size:13px">${hd.name}</div>
        <button class="btn btn-ghost" style="font-size:12px">שחרור ללקוח</button>
      </div>
      <div style="font-size:11px;color:${mute(38)}">${hd.meta}</div>
    </div>`).join("");

  const hoursHtml = DATA.hours.map(h => `
    <div style="display:flex;gap:10px;font-size:13px;padding:6px 0;border-bottom:1px solid var(--color-divider)">
      <div style="flex:1">${h.label}</div>
      <div style="color:${mute(55)}">${h.value}</div>
    </div>`).join("");

  const timelineHtml = DATA.timeline.map(tl => `
    <div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--color-divider)">
      <div style="color:var(--color-accent-600);font-size:12px">●</div>
      <div style="flex:1">
        <div style="font-size:13px">${tl.what}</div>
        <div style="font-size:11px;color:${mute(38)}">${tl.who} · ${tl.when}</div>
      </div>
    </div>`).join("");

  return `
  <div style="margin:-28px -28px -80px;padding:28px 28px 80px;background:color-mix(in srgb, var(--color-bg) 55%, #000);border-top:1px solid var(--color-accent-800)">
    <div style="max-width:1264px;margin:0 auto">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px">
        <h2 style="font-size:19px;font-weight:500;margin:0">המרחב שלי</h2>
        <span class="tag tag-accent">סגור ללקוח</span>
      </div>
      <div style="font-size:13px;color:${mute(45)};margin-bottom:22px">
        כל מה שברקע הכהה גלוי רק לך. הלקוח לא רואה שהלשונית הזו קיימת.
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 300px;gap:16px;align-items:start">
        <div style="display:flex;flex-direction:column;gap:16px">
          <div style="padding:16px;border-radius:8px;background:color-mix(in srgb, var(--color-surface) 55%, #000);border:1px solid var(--color-accent-800)">
            <div style="font-size:11px;letter-spacing:0.08em;color:var(--color-accent-300);margin-bottom:12px">הערות פנימיות</div>
            ${notesHtml}
            <input class="input" placeholder="הערה חדשה" style="margin-top:12px;text-align:right;background:transparent">
          </div>
          <div style="padding:16px;border-radius:8px;background:color-mix(in srgb, var(--color-surface) 55%, #000);border:1px solid var(--color-accent-800)">
            <div style="font-size:11px;letter-spacing:0.08em;color:var(--color-accent-300);margin-bottom:12px">סקירת מסמכים שהתקבלו</div>
            ${reviewsHtml}
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:16px">
          <div style="padding:16px;border-radius:8px;background:color-mix(in srgb, var(--color-surface) 55%, #000);border:1px solid var(--color-accent-800)">
            <div style="font-size:11px;letter-spacing:0.08em;color:var(--color-accent-300);margin-bottom:12px">המשימות שלי מול הלקוח</div>
            ${tasksHtml}
          </div>
          <div style="padding:16px;border-radius:8px;background:color-mix(in srgb, var(--color-surface) 55%, #000);border:1px solid var(--color-accent-800)">
            <div style="font-size:11px;letter-spacing:0.08em;color:var(--color-accent-300);margin-bottom:12px">טיוטות לפני שחרור</div>
            ${heldDraftsHtml}
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:16px">
          <div style="padding:16px;border-radius:8px;background:color-mix(in srgb, var(--color-surface) 55%, #000);border:1px solid var(--color-accent-800)">
            <div style="font-size:11px;letter-spacing:0.08em;color:var(--color-accent-300);margin-bottom:10px">שעות עבודה החודש</div>
            <div style="font-size:28px;font-weight:500;margin-bottom:12px">12.5 ש׳</div>
            ${hoursHtml}
          </div>
          <div style="padding:16px;border-radius:8px;background:color-mix(in srgb, var(--color-surface) 55%, #000);border:1px solid var(--color-accent-800)">
            <div style="font-size:11px;letter-spacing:0.08em;color:var(--color-accent-300);margin-bottom:12px">יומן פעילות</div>
            ${timelineHtml}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ---------------- render + actions ---------------- */

function render() {
  const root = document.getElementById("root");
  if (state.screen === "login") {
    root.innerHTML = renderLogin();
  } else if (state.screen === "clients") {
    root.innerHTML = renderNav() + renderClients();
  } else {
    root.innerHTML = renderNav() + renderProject();
  }
}

function handleAction(action, el) {
  if (action === "login-dpo") {
    Object.assign(state, { screen: "clients", role: "dpo", tab: "overview" });
  } else if (action === "login-client") {
    Object.assign(state, { screen: "project", role: "client", tab: "overview" });
  } else if (action === "logout") {
    state.screen = "login";
  } else if (action === "go-clients") {
    state.screen = "clients";
  } else if (action === "open-project") {
    state.screen = "project";
    state.tab = "overview";
  } else if (action === "set-tab") {
    state.tab = el.dataset.tab;
  } else if (action === "set-role") {
    const r = el.dataset.role;
    state.role = r;
    if (r === "client") {
      state.screen = "project";
      if (state.tab === "private") state.tab = "overview";
    }
  }
  render();
}

document.getElementById("root").addEventListener("click", e => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  handleAction(el.dataset.action, el);
});

render();
