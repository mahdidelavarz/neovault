"use client";

import {
  ComponentType,
  SVGProps,
} from "react";
import {
  FluentPrompt16Regular,
  LucideVault,
  SolarCodeSquareLineDuotone,
  SolarFileLinear,
  SolarFolderFavouriteBookmarkLinear,
  SolarFolderWithFilesOutline,
  SolarGlobalLinear,
  SolarLinkMinimalisticBold,
  SolarNotesLineDuotone,
  SolarRoundedMagniferLineDuotone,
  SolarServerSquareCloudLinear,
  SolarShieldBoldDuotone,
  SolarTagLineDuotone,
} from "@/Icons/Icons";

// ─── Data ───────────────────────────────────────────────────────────────────

type ModuleType = { name: string; desc: string };

type Module = {
  name: string;
  summary: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Type-specific sub-features (e.g. the 7 snippet types, 5 infra types). */
  types?: ModuleType[];
  /** General capabilities of the module. */
  points: string[];
};

const MODULES: Module[] = [
  {
    name: "لینک‌ها",
    icon: SolarLinkMinimalisticBold,
    summary:
      "مدیریت بوکمارک‌ها همراه با اطلاعات ورود؛ آدرس و اعتبارنامه‌ها کنار هم ذخیره می‌شوند.",
    points: [
      "ذخیره‌ی URL همراه با نام کاربری، ایمیل، تلفن و گذرواژه",
      "دریافت خودکار عنوان، توضیحات و فاوآیکون صفحه هنگام وارد کردن آدرس",
      "گذرواژه با گاوصندوق رمزنگاری می‌شود و فقط در حالت بازشده دیده می‌شود",
      "تشخیص لینک تکراری، کپی سریع آدرس و علامت‌گذاری به‌عنوان علاقه‌مندی",
      "عملیات گروهی (حذف یا علاقه‌مندی چندتایی)، فیلتر، مرتب‌سازی و اسکرول بی‌نهایت",
    ],
  },
  {
    name: "نوت‌ها",
    icon: SolarNotesLineDuotone,
    summary:
      "یادداشت‌های متنی با پشتیبانی کامل Markdown و ذخیره‌ی خودکار.",
    points: [
      "نگارش با Markdown: تیترها، بولد/ایتالیک، کد، لیست‌ها و نقل‌قول",
      "ذخیره‌ی خودکار ۲ ثانیه پس از توقف تایپ، با نمایش زمان آخرین ذخیره",
      "تغییر بین حالت نوشتن و پیش‌نمایش، به‌همراه میانبرهای قالب‌بندی",
      "سنجاق‌کردن (Pin)، علاقه‌مندی، کلون و کپی محتوا",
      "شمارش کلمه و کاراکتر، فیلتر و مرتب‌سازی",
    ],
  },
  {
    name: "اسنیپت‌ها",
    icon: SolarCodeSquareLineDuotone,
    summary:
      "نگهداری قطعه‌کدهای پرکاربرد در ۷ نوع، که هر نوع ابزار اختصاصی خودش را دارد.",
    types: [
      { name: "Code", desc: "انتخاب زبان و هایلایت نحوی (بیش از ۴۰ زبان)" },
      { name: "SQL", desc: "فرمت‌کننده‌ی SQL و تعیین نوع دیتابیس" },
      { name: "Regex", desc: "تستر زنده با شمارش و هایلایت تطبیق + فلگ‌ها" },
      { name: "Command", desc: "تعیین نوع شل (bash، zsh، PowerShell، cmd)" },
      { name: "cURL", desc: "متد و آدرس پایه به‌صورت خودکار استخراج می‌شوند" },
      { name: "JSON", desc: "فرمت‌کننده‌ی JSON" },
      { name: "Script", desc: "تعیین زبان/رانتایم و فهرست وابستگی‌ها" },
    ],
    points: [
      "Smart Paste: تشخیص خودکار نوع و زبان هنگام چسباندن محتوا",
      "تشخیص اسنیپت تکراری، کلون، کپی و پیش‌نمایش جمع‌شونده",
      "فیلتر بر اساس متن، دسته، برچسب، نوع، زبان و علاقه‌مندی",
    ],
  },
  {
    name: "پرامپت‌ها",
    icon: FluentPrompt16Regular,
    summary:
      "قالب‌های پرامپت هوش مصنوعی در ۶ نوع، با سیستم متغیر و تاریخچه‌ی نسخه‌ها.",
    types: [
      { name: "AI Chat", desc: "پرامپت‌های گفت‌وگومحور" },
      { name: "Project Template", desc: "اسکلت‌بندی یک پروژه یا قابلیت" },
      { name: "Code Generation", desc: "تولید کد مشخص" },
      { name: "Documentation", desc: "تولید مستندات و README" },
      { name: "System Design", desc: "طراحی معماری و فنی" },
      { name: "Custom", desc: "هر چیز خارج از موارد بالا" },
    ],
    points: [
      "سیستم متغیر «{{variable}}»: استخراج خودکار + مقدار پیش‌فرض و توضیح برای هر متغیر",
      "حالت تست: پر کردن متغیرها و دیدن پرامپت نهاییِ رندرشده",
      "ارسال به ۷ پلتفرم: ChatGPT، Claude، Gemini، Copilot، Perplexity، DeepSeek و Generic",
      "تاریخچه‌ی نسخه‌ها (تا ۵ نسخه) با امکان بازگردانی، و شمارش دفعات استفاده",
    ],
  },
  {
    name: "API Client",
    icon: SolarGlobalLinear,
    summary:
      "سازنده و تستر کامل درخواست‌های HTTP، بدون نیاز به خروج از برنامه یا ابزار جداگانه.",
    points: [
      "همه‌ی متدها (GET/POST/PUT/PATCH/DELETE/HEAD/OPTIONS) با هدر، پارامتر و بدنه",
      "احراز هویت Bearer، Basic، API Key و OAuth2 (رمزنگاری‌شده در گاوصندوق)",
      "محیط‌ها (Environments) با جایگزینی «{{متغیر}}» در زمان ارسال",
      "یکپارچگی با زیرساخت: آیتم‌های نوع env به‌صورت محیط در دسترس قرار می‌گیرند",
      "نمایش پاسخ: کد وضعیت، زمان، حجم، هدرها و درخت تعاملی JSON",
      "ارسال از طریق سرور (بدون مشکل CORS) به‌همراه محافظت SSRF",
      "دسته‌بندی در Collectionها، ذخیره‌ی خودکار پیش‌نویس، ایمپورت cURL و تولید کد",
    ],
  },
  {
    name: "زیرساخت",
    icon: SolarServerSquareCloudLinear,
    summary:
      "نگهداری آرتیفکت‌های پیکربندی در ۵ نوع؛ مقادیر حساس با گاوصندوق محافظت می‌شوند.",
    types: [
      {
        name: "env",
        desc: "متغیرهای محیطی کلید-مقدار؛ مقادیر حساس ماسک و کل محتوا رمزنگاری می‌شود",
      },
      {
        name: "server",
        desc: "اتصال SSH (هاست، پورت، کاربر، گذرواژه/کلید) — کلید و گذرواژه رمزنگاری‌شده",
      },
      { name: "docker", desc: "نسخه‌ی Docker Compose و فهرست سرویس‌ها" },
      {
        name: "deployment",
        desc: "پلتفرم مقصد، مراحل دیپلوی و برنامه‌ی بازگشت (rollback)",
      },
      {
        name: "config",
        desc: "پیکربندی اتصال دیتابیس (موتور، هاست، پورت، نام و اعتبارنامه‌ها)",
      },
    ],
    points: [
      "یکپارچگی با API Client: آیتم‌های env به‌عنوان مجموعه‌متغیر در درخواست‌ها استفاده می‌شوند",
      "پیش‌نمایش ۵ خط اول، آشکار/ماسک کردن مقادیر حساس به‌صورت تکی، کپی و فیلتر",
    ],
  },
  {
    name: "فایل‌ها",
    icon: SolarFileLinear,
    summary:
      "آپلود و نگهداری فایل‌های مهم در کنار بقیه‌ی داده‌ها.",
    points: [
      "آپلود فایل و مشاهده‌ی پیش‌نمایش و اطلاعات آن",
      "دسته‌بندی و برچسب‌گذاری برای پیدا کردن سریع",
    ],
  },
  {
    name: "پروژه‌ها",
    icon: SolarFolderWithFilesOutline,
    summary:
      "لایه‌ی سازمان‌دهیِ فرا-ماژولی؛ گردآوری هر نوع آیتم از همه‌ی ماژول‌ها زیر یک نام.",
    points: [
      "افزودن آیتم از هر ماژول به یک یا چند پروژه (بدون محدودیت)",
      "۵ قالب آماده: JWT Auth، Docker Compose، REST API، PostgreSQL و CI/CD",
      "ترتیب‌دهی دستی با کشیدن، رنگ و اموجی برای شناسایی، و شمارنده‌ی عضویت روی هر آیتم",
      "حذف پروژه فقط گروه‌بندی را برمی‌دارد و آیتم‌ها را حذف نمی‌کند",
    ],
  },
  {
    name: "دسته‌بندی‌ها و برچسب‌ها",
    icon: SolarFolderFavouriteBookmarkLinear,
    summary:
      "دو سیستم سازمان‌دهی سراسری که روی همه‌ی ماژول‌ها اعمال می‌شوند.",
    points: [
      "دسته‌بندی: ساختار درختی سلسله‌مراتبی؛ هر آیتم حداکثر در یک دسته",
      "برچسب: سیستم تخت؛ چند برچسب برای هر آیتم و مشترک میان همه‌ی ماژول‌ها",
      "فیلتر ترکیبی بر اساس دسته و برچسب در هر ماژول و در جست‌وجوی سراسری",
    ],
  },
];

type GlobalFeature = {
  name: string;
  desc: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const GLOBAL_FEATURES: GlobalFeature[] = [
  {
    name: "جست‌وجوی سراسری",
    desc: "جست‌وجو در همه‌ی ماژول‌ها به‌طور هم‌زمان با رتبه‌بندی بر اساس ارتباط، و پالت سریع با کلید Ctrl+K از هر جای برنامه.",
    icon: SolarRoundedMagniferLineDuotone,
  },
  {
    name: "نصب و حالت آفلاین (PWA)",
    desc: "قابل نصب روی دسکتاپ و موبایل؛ در حالت آفلاین داده‌های بارگذاری‌شده به‌صورت فقط‌خواندنی در دسترس‌اند.",
    icon: SolarFileLinear,
  },
];

type SecurityPoint = { title: string; desc: string };

const SECURITY_POINTS: SecurityPoint[] = [
  {
    title: "رمزنگاری روی دستگاه شما (Zero-Knowledge)",
    desc: "داده‌های حساس مثل گذرواژه‌ها، کلیدهای API و متغیرهای محیطی پیش از خروج از مرورگر، روی دستگاه شما رمزنگاری می‌شوند. سرور تنها متن رمزشده را دریافت می‌کند و هرگز نمی‌تواند آن را بخواند.",
  },
  {
    title: "دو رازِ شما",
    desc: "یک PIN چهار رقمی برای باز کردن گاوصندوق روی همین دستگاه، و یک عبارت بازیابی ۱۲ کلمه‌ای برای بازیابی دسترسی روی دستگاه جدید. هیچ‌کدام از این دو هرگز جایی ذخیره نمی‌شوند.",
  },
  {
    title: "الگوریتم‌های استاندارد",
    desc: "رمزنگاری با AES‑256‑GCM، استخراج کلید با PBKDF2-SHA256 و ۳۱۰٬۰۰۰ تکرار (بالاتر از توصیه‌ی NIST)، و تولید عبارت بازیابی با استاندارد BIP39. همه از طریق Web Crypto API مرورگر انجام می‌شود.",
  },
  {
    title: "قفل خودکار",
    desc: "گاوصندوق پس از ۵ دقیقه بی‌کاری، و همچنین هنگام تعویض تب یا برنامه، به‌صورت خودکار قفل می‌شود. برای باز کردن دوباره به PIN نیاز است.",
  },
  {
    title: "محدودیت‌ها (صادقانه)",
    desc: "اگر هم PIN و هم عبارت بازیابی را گم کنید، داده‌ی رمزشده برای همیشه غیرقابل‌بازیابی است؛ هیچ راه پشتیبانی وجود ندارد. امنیت در برابر سرقت فیزیکی دستگاهِ باز یا بدافزار، بر عهده‌ی خود شماست.",
  },
];

type Guarantee = { claim: string; guarantee: string };

const GUARANTEES: Guarantee[] = [
  {
    claim: "سرور نمی‌تواند داده‌ی شما را بخواند",
    guarantee: "تضمین رمزنگاری — هیچ کلید فعالی روی سرور نیست",
  },
  {
    claim: "PIN اشتباه رد می‌شود",
    guarantee: "تضمین رمزنگاری — خطای احراز اصالت AES-GCM، نه بررسی گذرواژه",
  },
  {
    claim: "گم‌شدن عبارت بازیابی = از دست رفتن داده",
    guarantee: "طبق طراحی — هیچ درِ پشتی‌ای وجود ندارد",
  },
  {
    claim: "قفل‌شدن در بی‌کاری",
    guarantee: "تایمر ۵ دقیقه‌ای + رویداد پنهان‌شدن تب",
  },
  {
    claim: "بدون داده‌ی حساس در لاگ‌ها",
    guarantee: "مقادیر رمزشده هرگز لاگ نمی‌شوند",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AboutContent() {
  return (
    <div className="about" dir="rtl" lang="fa">
      <style>{CSS}</style>

      {/* Intro */}
      <section className="about-hero">
        <div className="about-hero-icon">
          <LucideVault width={48} height={48} />
        </div>
        <h2 className="about-hero-title">NeoVault چیست؟</h2>
        <p className="about-hero-text">
          NeoVault گاوصندوق دانشِ شخصیِ توسعه‌دهنده‌هاست؛ جایی امن برای نگهداری
          همه‌ی چیزهایی که کار روزمره‌تان به آن‌ها وابسته است — لینک‌ها و
          اعتبارنامه‌ها، نوت‌ها، اسنیپت‌های کد، پرامپت‌های هوش مصنوعی، پیکربندی‌های
          زیرساخت و درخواست‌های API. همه‌چیز قابل دسته‌بندی، برچسب‌گذاری و
          جست‌وجوی سریع است و داده‌های حساس با یک گاوصندوقِ رمزنگاری‌شده محافظت
          می‌شوند.
        </p>
      </section>

      {/* Modules */}
      <section className="about-section">
        <h3 className="about-section-title">امکانات و ماژول‌ها</h3>
        <div className="about-modules">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <article key={m.name} className="about-module">
                <header className="about-module-head">
                  <div className="about-module-icon">
                    <Icon width={20} height={20} />
                  </div>
                  <div>
                    <p className="about-module-name">{m.name}</p>
                    <p className="about-module-summary">{m.summary}</p>
                  </div>
                </header>

                {m.types && (
                  <div className="about-types">
                    {m.types.map((t) => (
                      <div key={t.name} className="about-type">
                        <span className="about-type-name">{t.name}</span>
                        <span className="about-type-desc">{t.desc}</span>
                      </div>
                    ))}
                  </div>
                )}

                <ul className="about-points-list">
                  {m.points.map((p, i) => (
                    <li key={i} className="about-point-item">
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      {/* Global features */}
      <section className="about-section">
        <h3 className="about-section-title">قابلیت‌های سراسری</h3>
        <div className="about-grid">
          {GLOBAL_FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.name} className="about-feature">
                <div className="about-feature-icon">
                  <Icon width={20} height={20} />
                </div>
                <div className="about-feature-body">
                  <p className="about-feature-name">{f.name}</p>
                  <p className="about-feature-desc">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Security */}
      <section className="about-section">
        <div className="about-section-head">
          <SolarShieldBoldDuotone width={22} height={22} className="about-shield" />
          <h3 className="about-section-title about-section-title--inline">
            امنیت و حریم خصوصی
          </h3>
        </div>
        <p className="about-section-lead">
          گاوصندوق امن NeoVault بر پایه‌ی معماری «بدون‌دانش» (Zero-Knowledge)
          ساخته شده؛ یعنی حتی گردانندگان NeoVault هم نمی‌توانند به داده‌های شما
          دسترسی پیدا کنند.
        </p>

        <div className="about-points">
          {SECURITY_POINTS.map((p) => (
            <div key={p.title} className="about-point">
              <p className="about-point-title">{p.title}</p>
              <p className="about-point-desc">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="about-table-wrap">
          <table className="about-table">
            <thead>
              <tr>
                <th>تضمین</th>
                <th>چگونگی</th>
              </tr>
            </thead>
            <tbody>
              {GUARANTEES.map((g) => (
                <tr key={g.claim}>
                  <td>{g.claim}</td>
                  <td>{g.guarantee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
.about, .about * { box-sizing: border-box; min-width: 0; }
.about {
  display:        flex;
  flex-direction: column;
  gap:            20px;
  max-width:      980px;
  width:          100%;
  margin:         0 auto;
  text-align:     right;
  line-height:    1.9;
  overflow-wrap:  anywhere;
  word-break:     break-word;
}

/* Hero */
.about-hero {
  background:     var(--bg-surface);
  border:         1px solid var(--border-default);
  border-radius:  var(--radius-lg);
  padding:        24px;
  text-align:     center;
}
.about-hero-icon {
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  width:           56px;
  height:          56px;
  margin-bottom:   12px;
}
.about-hero-title {
  font-size:     var(--text-xl);
  font-weight:   700;
  color:         var(--text-primary);
  margin-bottom: 8px;
}
.about-hero-text {
  font-size: var(--text-sm);
  color:     var(--text-secondary);
  max-width: 680px;
  margin:    0 auto;
}

/* Section */
.about-section {
  background:    var(--bg-surface);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding:       20px;
}
.about-section-title {
  font-size:     var(--text-lg);
  font-weight:   700;
  color:         var(--text-primary);
  margin-bottom: 14px;
}
.about-section-head {
  display:       flex;
  align-items:   center;
  gap:           8px;
  margin-bottom: 8px;
}
.about-section-title--inline { margin-bottom: 0; }
.about-shield { color: var(--cyan-400); flex-shrink: 0; }
.about-section-lead {
  font-size:     var(--text-sm);
  color:         var(--text-secondary);
  margin-bottom: 16px;
}

/* Modules */
.about-modules {
  display:               grid;
  grid-template-columns: repeat(2, 1fr);
  gap:                   12px;
  align-items:           start;
}
.about-module {
  display:        flex;
  flex-direction: column;
  gap:            12px;
  padding:        14px;
  background:     var(--bg-base);
  border:         1px solid var(--border-subtle);
  border-radius:  var(--radius-md);
}
.about-module-head {
  display:     flex;
  align-items: flex-start;
  gap:         10px;
}
.about-module-icon {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           38px;
  height:          38px;
  border-radius:   var(--radius-md);
  background:      var(--accent-muted);
  color:           var(--cyan-400);
  flex-shrink:     0;
}
.about-module-name {
  font-size:   var(--text-md);
  font-weight: 700;
  color:       var(--text-primary);
}
.about-module-summary {
  font-size:  var(--text-xs);
  color:      var(--text-tertiary);
  margin-top: 2px;
}

/* Type-specific sub-features */
.about-types {
  display:        flex;
  flex-direction: column;
  gap:            6px;
  padding:        10px;
  background:     var(--bg-surface);
  border:         1px solid var(--border-subtle);
  border-radius:  var(--radius-md);
}
.about-type {
  display:     flex;
  align-items: baseline;
  gap:         8px;
  font-size:   var(--text-xs);
}
.about-type-name {
  flex-shrink:   0;
  min-width:     78px;
  font-weight:   700;
  color:         var(--cyan-300);
  font-family:   var(--font-mono);
}
.about-type-desc { color: var(--text-secondary); }

/* Points list */
.about-points-list {
  display:        flex;
  flex-direction: column;
  gap:            6px;
  list-style:     none;
  margin:         0;
  padding:        0;
}
.about-point-item {
  position:   relative;
  padding-right: 16px;
  font-size:  var(--text-sm);
  color:      var(--text-secondary);
}
.about-point-item::before {
  content:     "";
  position:    absolute;
  right:       0;
  top:         11px;
  width:       5px;
  height:      5px;
  border-radius: 50%;
  background:  var(--accent);
}

/* Generic feature grid (global features) */
.about-grid {
  display:               grid;
  grid-template-columns: repeat(2, 1fr);
  gap:                   10px;
}
.about-feature {
  display:       flex;
  align-items:   flex-start;
  gap:           10px;
  padding:       12px;
  background:    var(--bg-base);
  border:        1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}
.about-feature-icon {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           36px;
  height:          36px;
  border-radius:   var(--radius-md);
  background:      var(--accent-muted);
  color:           var(--cyan-400);
  flex-shrink:     0;
}
.about-feature-name {
  font-size:   var(--text-sm);
  font-weight: 600;
  color:       var(--text-primary);
}
.about-feature-desc {
  font-size: var(--text-xs);
  color:     var(--text-tertiary);
  margin-top: 2px;
}

/* Security points */
.about-points {
  display:        flex;
  flex-direction: column;
  gap:            10px;
  margin-bottom:  16px;
}
.about-point {
  padding:       12px 14px;
  background:    var(--bg-base);
  border:        1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  border-right:  3px solid var(--accent);
}
.about-point-title {
  font-size:   var(--text-sm);
  font-weight: 600;
  color:       var(--text-primary);
  margin-bottom: 4px;
}
.about-point-desc {
  font-size: var(--text-sm);
  color:     var(--text-secondary);
}

/* Guarantee table */
.about-table-wrap { overflow-x: auto; }
.about-table {
  width:           100%;
  border-collapse: collapse;
  font-size:       var(--text-sm);
}
.about-table th,
.about-table td {
  text-align:    right;
  padding:       10px 12px;
  border-bottom: 1px solid var(--border-subtle);
}
.about-table th {
  font-weight: 600;
  color:       var(--text-primary);
  background:  var(--bg-base);
}
.about-table td { color: var(--text-secondary); }
.about-table tr:last-child td { border-bottom: none; }

@media (max-width: 639px) {
  .about { gap: 14px; }

  .about-modules { grid-template-columns: 1fr; }
  .about-grid    { grid-template-columns: 1fr; }

  .about-hero    { padding: 18px 14px; }
  .about-section { padding: 16px 14px; }

  /* Allow long mono type-names to wrap instead of pushing the row wide */
  .about-type {
    flex-direction: column;
    gap:            2px;
  }
  .about-type-name { min-width: 0; }

  /* Stack the guarantee table into card rows so it never overflows */
  .about-table-wrap { overflow-x: visible; }
  .about-table,
  .about-table tbody,
  .about-table tr,
  .about-table td { display: block; width: 100%; }
  .about-table thead { display: none; }
  .about-table tr {
    margin-bottom:  8px;
    border:         1px solid var(--border-subtle);
    border-radius:  var(--radius-md);
    overflow:       hidden;
  }
  .about-table td { border-bottom: none; }
  .about-table td:first-child {
    font-weight: 600;
    color:       var(--text-primary);
    background:  var(--bg-base);
  }
}
`;
