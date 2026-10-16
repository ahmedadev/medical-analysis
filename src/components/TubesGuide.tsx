import { useState } from 'preact/hooks';

interface Tube {
  id: string;
  order: number;
  name: string;
  colorName: string;
  hexColor: string;
  textColor: string;
  additive: string;
  action: string;
  tests: string[];
  inversions: string;
  notes: string;
  rejectionCauses: string[];
}

const TUBES: Tube[] = [
  {
    id: 'culture',
    order: 1,
    name: 'زجاجات مزارع الدم (Blood Culture Bottles)',
    colorName: 'أصفر / قوارير هوائية ولاهوائية',
    hexColor: '#eab308',
    textColor: '#000',
    additive: 'مرق نمو بكتيري (SPS - Sodium Polyanethol Sulfonate)',
    action: 'تثبيط متممات المناعة والمضادات الحيوية والسماح بنمو البكتيريا المعزولة.',
    tests: ['مزرعة الدم وعزل البكتيريا (Blood Culture)', 'فحص حساسية المضادات الحيوية'],
    inversions: '8 - 10 مرات برفق',
    notes: 'تُسحب أولاً تماماً في ظل تعقيم جراحي صارم لموقع السحب بالكحول والبيتادين لمنع تلوث العينة بفلورا الجلد.',
    rejectionCauses: ['سحب كمية دم غير كافية (أقل من 8-10 مل للبالغين)', 'استخدام زجاجات منتهية الصلاحية']
  },
  {
    id: 'blue',
    order: 2,
    name: 'أنبوبة السترات للسيولة (Light Blue Top)',
    colorName: 'أزرق سماوي',
    hexColor: '#0284c7',
    textColor: '#fff',
    additive: 'صوديوم سترات 3.2% (Sodium Citrate 3.2%) بنسبة ثابتة 1 : 9',
    action: 'يربط أيونات الكالسيوم لمنع تجلط عينة الدم بشكل عكوس.',
    tests: ['زمن البروثرومبين والسيولة (PT / INR)', 'زمن الثرومبوبلاستين الجزئي (aPTT)', 'الدي دايمر (D-Dimer)', 'عوامل التجلط وعامل فيبرينوجين'],
    inversions: '3 - 4 مرات برفق شديد',
    notes: 'خط التعبئة إلزامي تماماً بنسبة 9 أجزاء دم لجزء سترات. النقص أو الزيادة بأكثر من 10% يلغي النتيجة تماماً.',
    rejectionCauses: ['العينات غير الممتلئة للعلامة (Underfilled)', 'وجود أي تجلط ميكروي (Micro-clots)', 'تكسر كرات الدم (Hemolysis)']
  },
  {
    id: 'red',
    order: 3,
    name: 'أنبوبة السيرم العادية (Red Top - Plain)',
    colorName: 'أحمر داكن',
    hexColor: '#dc2626',
    textColor: '#fff',
    additive: 'بدون مانع تجلط (قد تحتوي على منشط تجلط Clot Activator بدون جل)',
    action: 'تسمح بتجلط الدم الطبيعي وفصل السيرم الصافي بالسنترفيوج بعد 20-30 دقيقة.',
    tests: ['كيمياء الدم (وظائف كبد، كلى، سكر، دهون)', 'الفحوصات المصلية والأجسام المضادة (Serology)', 'تحاليل الأدوية والمخدرات العلاجية'],
    inversions: '5 مرات إذا وُجد منشط تجلط، أو 0 إذا كانت زجاجية سادة',
    notes: 'تُترك لتتجلط في درجة حرارة الغرفة لمدة 20 دقيقة قبل وضعها في جهاز الطرد المركزي لمنع تكون ألياف الفيبرين.',
    rejectionCauses: ['الفصل المبكر قبل اكتمال التجلط (Fibrin threads)', 'تكسر الدم الشديد (Hemolysis)']
  },
  {
    id: 'gold',
    order: 4,
    name: 'أنبوبة السيرم بجل فاصل (Gold / SST Yellow)',
    colorName: 'أصفر / ذهبي (SST)',
    hexColor: '#ca8a04',
    textColor: '#fff',
    additive: 'جل بوليمر فاصل (Inert Gel) + منشط تجلط ميكروي',
    action: 'يتحرك الجل أثناء السنترفيوج ليشكل حاجزاً فيزيائياً عازلاً تماماً بين السيرم وكرات الدم الحمراء.',
    tests: ['الهرمونات ودلالات الأورام (Thyroid, PSA, CA-125)', 'الفيتامينات (فيتامين D، فيتامين B12)', 'المعادن والكيمياء الروتينية'],
    inversions: '5 مرات برفق',
    notes: 'ممتازة للاحتفاظ بالعينة ثابتة وإرسالها للمعامل المرجعية (Outsource) دون تلوث بالخلايا.',
    rejectionCauses: ['فصل غير مكتمل وتداخل الجل مع السيرم', 'تكسر كرات الدم الحمراء']
  },
  {
    id: 'green',
    order: 5,
    name: 'أنبوبة الهيبارين (Green Top)',
    colorName: 'أخضر',
    hexColor: '#16a34a',
    textColor: '#fff',
    additive: 'صوديوم أو ليثيوم هيبارين (Lithium / Sodium Heparin)',
    action: 'تثبيط الثرومبين لمنع تكون خيوط الفيبرين وفصل البلازما الفورية.',
    tests: ['غازات الدم الوريدية ومستويات الأمونيا', 'الكروموسومات والفحوصات الوراثية السيتوجينية', 'التحاليل الإسعافية الطارئة (Stat Chemistry)'],
    inversions: '8 - 10 مرات',
    notes: 'لا تستخدم ليثيوم هيبارين إذا كان الفحص المطلوب هو قياس مستوى عنصر الليثيوم العلاجي في الدم.',
    rejectionCauses: ['تكون خثرات دموية بسبب ضعف التقليب السريع', 'استخدام نوع هيبارين يتعارض مع الفحص']
  },
  {
    id: 'purple',
    order: 6,
    name: 'أنبوبة EDTA لأمراض الدم (Lavender / Purple Top)',
    colorName: 'بنفسجي / لافندر',
    hexColor: '#7c3aed',
    textColor: '#fff',
    additive: 'بوتاسيوم EDTA (K2-EDTA أو K3-EDTA)',
    action: 'مخلب قوي يربط الكالسيوم ويحافظ على الحجم والشكل الطبيعي لخلايا الدم والصفائح دون انكماش.',
    tests: ['صورة الدم الكاملة (CBC)', 'السكر التراكمي (HbA1c)', 'فصائل الدم وعامل ريسوس (Blood Group & Rh)', 'الفيلم الدموي وتفريق الخلايا'],
    inversions: '8 - 10 مرات مباشرة وفور السحب',
    notes: 'السحب بعد أنبوبة السيرم دائماً لمنع تسرب أملاح البوتاسيوم EDTA إلى عينات كيمياء البوتاسيوم.',
    rejectionCauses: ['وجود أي جلطات دقيقة (تفسد عد الصفائح الدموية)', 'تخفيف العينة بنقص الدم عن المقدار المحدد']
  },
  {
    id: 'gray',
    order: 7,
    name: 'أنبوبة الجلوكوز ومثبط التحلل (Gray Top)',
    colorName: 'رمادي',
    hexColor: '#64748b',
    textColor: '#fff',
    additive: 'صوديوم فلورايد + بوتاسيوم أوكسالات (Sodium Fluoride / Oxalate)',
    action: 'تثبيط إنزيم Enolase لمنع تحلل السكر داخل العينة بفعل خلايا الدم (Glycolysis).',
    tests: ['سكر الجلوكوز الدقيق في المعامل المرجعية', 'منحنى السكر للحوامل (OGTT)', 'حمض اللاكتيك (Lactic Acid)'],
    inversions: '8 - 10 مرات',
    notes: 'تحافظ على تركيز السكر ثابتاً لمدة تصل إلى 3 أيام حتى بدون فصل فوري للبلازما.',
    rejectionCauses: ['التحلل والتكسر الشديد', 'عدم ملء الأنبوبة للحد المناسب']
  },
  {
    id: 'black',
    order: 8,
    name: 'أنبوبة سرعة الترسيب (Black Top - ESR)',
    colorName: 'أسود',
    hexColor: '#1e293b',
    textColor: '#fff',
    additive: 'صوديوم سترات بنسبة 1 : 4 (جزء سترات لـ 4 أجزاء دم)',
    action: 'تخفيف الدم المخصص لقراءة أعمدة وسترجرين لقياس سرعة ترسيب كريات الدم الحمراء.',
    tests: ['سرعة ترسيب الدم (ESR - Westergren Method)'],
    inversions: '8 - 10 مرات',
    notes: 'يجب ضبط مستوى الدم بدقة متناهية على علامة الصفر أو المؤشر الرأسي للأنبوبة.',
    rejectionCauses: ['فقاعات هواء داخل العمود', 'عدم دقة نسبة التخفيف 1:4']
  }
];

export default function TubesGuide() {
  const [selectedTube, setSelectedTube] = useState<Tube>(TUBES[1]); // default to Blue

  return (
    <div class="tubes-guide-wrapper">
      {/* Visual Tube selector banner */}
      <div style="margin-bottom: 2rem;">
        <h3 style="margin-bottom: 0.75rem; font-size: 1.15rem;">
          انقر على الأنبوبة لعرض تفاصيلها وترتيب سحبها القياسي (CLSI Order of Draw):
        </h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem;">
          {TUBES.map((tube) => {
            const isSelected = selectedTube.id === tube.id;
            return (
              <button
                key={tube.id}
                onClick={() => setSelectedTube(tube)}
                style={{
                  padding: '0.85rem 0.5rem',
                  border: isSelected ? '3px solid var(--pico-primary)' : '1px solid var(--pico-muted-border-color)',
                  borderRadius: '12px',
                  backgroundColor: 'var(--pico-card-background-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                  boxShadow: isSelected ? '0 4px 14px rgba(13, 148, 136, 0.25)' : 'none'
                }}
              >
                {/* Cap representation */}
                <div 
                  style={{
                    width: '32px',
                    height: '24px',
                    backgroundColor: tube.hexColor,
                    borderRadius: '6px 6px 2px 2px',
                    border: '2px solid rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tube.textColor,
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}
                >
                  {tube.order}
                </div>
                <span style="font-size: 0.82rem; font-weight: 700; text-align: center; color: var(--pico-color);">
                  {tube.colorName.split('/')[0]}
                </span>
                <span style="font-size: 0.7rem; color: var(--pico-muted-color); text-align: center;">
                  الترتيب #{tube.order}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Tube Details Card */}
      <div 
        class="card" 
        style={{
          padding: '1.75rem',
          borderRadius: '16px',
          border: `2px solid ${selectedTube.hexColor}`,
          backgroundColor: 'var(--pico-card-background-color)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
        }}
      >
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--pico-muted-border-color); padding-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div 
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '12px',
                backgroundColor: selectedTube.hexColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: selectedTube.textColor,
                fontSize: '1.3rem',
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              #{selectedTube.order}
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.35rem; color: var(--pico-primary);">
                {selectedTube.name}
              </h3>
              <span style="font-size: 0.9rem; color: var(--pico-muted-color);">
                اللون: {selectedTube.colorName} • التقليب: {selectedTube.inversions}
              </span>
            </div>
          </div>
          <span class="badge" style={{ backgroundColor: selectedTube.hexColor, color: selectedTube.textColor, padding: '0.4rem 0.8rem', fontWeight: 700 }}>
            رقم السحب: {selectedTube.order}
          </span>
        </div>

        {/* Specs Grid */}
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div style="background: rgba(0,0,0,0.02); padding: 1rem; border-radius: 10px; border: 1px solid var(--pico-muted-border-color);">
            <strong style="color: var(--pico-primary); display: block; margin-bottom: 0.35rem;">🧪 المادة المضافة (Additive):</strong>
            <span style="font-size: 0.95rem;">{selectedTube.additive}</span>
          </div>
          <div style="background: rgba(0,0,0,0.02); padding: 1rem; border-radius: 10px; border: 1px solid var(--pico-muted-border-color);">
            <strong style="color: var(--pico-primary); display: block; margin-bottom: 0.35rem;">⚙️ آلية العمل البيولوجية:</strong>
            <span style="font-size: 0.95rem;">{selectedTube.action}</span>
          </div>
        </div>

        {/* Tests List */}
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 1.05rem; margin-bottom: 0.6rem; color: var(--pico-color);">
            📋 أشهر التحاليل والفحوصات المطلوبة عليها:
          </h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            {selectedTube.tests.map((test, i) => (
              <span key={i} class="badge" style="background: rgba(13, 148, 136, 0.12); color: var(--pico-primary); font-size: 0.88rem; padding: 0.4rem 0.75rem;">
                ✓ {test}
              </span>
            ))}
          </div>
        </div>

        {/* Critical notes & Rejection */}
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          <div style="background: rgba(13, 148, 136, 0.05); padding: 1rem; border-radius: 10px; border-right: 4px solid #0d9488;">
            <strong style="color: #0d9488; display: block; margin-bottom: 0.35rem;">💡 إرشادات السحب الذهبية:</strong>
            <p style="margin: 0; font-size: 0.9rem; line-height: 1.6;">{selectedTube.notes}</p>
          </div>

          <div style="background: rgba(239, 68, 68, 0.05); padding: 1rem; border-radius: 10px; border-right: 4px solid #ef4444;">
            <strong style="color: #ef4444; display: block; margin-bottom: 0.35rem;">🚫 مسببات رفض العينة (Sample Rejection):</strong>
            <ul style="margin: 0; padding-right: 1.2rem; font-size: 0.88rem; line-height: 1.5;">
              {selectedTube.rejectionCauses.map((cause, i) => (
                <li key={i}>{cause}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Phlebotomy golden tips */}
      <div style="margin-top: 2.5rem; padding: 1.5rem; background: var(--pico-card-background-color); border-radius: 14px; border: 1px solid var(--pico-muted-border-color);">
        <h3 style="font-size: 1.2rem; margin-bottom: 1rem; color: var(--pico-primary);">
          ✨ القواعد الذهبية لسحب العينات الوريدية (Phlebotomy Best Practices):
        </h3>
        <ol style="padding-right: 1.5rem; line-height: 1.8; font-size: 0.95rem; margin-bottom: 0;">
          <li><strong>زمن التورنيكيه:</strong> لا تترك الرباط الضاغط مشدوداً أكثر من 60 ثانية أبداً لتجنب حدوث Hemoconcentration وتكسر الدم.</li>
          <li><strong>جفاف الكحول:</strong> انتظر 30 ثانية حتى يجف كحول التعقيم 70% تماماً قبل وخز الوريد لتجنب ألم المريض وتكسر الخلايا (Hemolysis).</li>
          <li><strong>التقليب الفوري برفق:</strong> اقلب كل أنبوبة بعد سحبها فوراً 5-8 مرات في حركة دائرية ناعمة، ولا ترج الأنبوبة بقوة مطلقاً.</li>
          <li><strong>تسمية الأنابيب أمام المريض:</strong> اكتب الاسم رباعياً ورقم الكود وتاريخ السحب على الأنبوبة في حضور المريض قبل مغادرته غرفة السحب.</li>
        </ol>
      </div>
    </div>
  );
}
