import { useState, useEffect } from 'preact/hooks';

interface ChecklistItem {
  id: string;
  category: 'architectural' | 'equipment' | 'administrative';
  categoryName: string;
  title: string;
  danger: string; // سبب الرفض الفوري
  requirement: string; // الحل المعتمد والمطلوب
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // المعمارية
  {
    id: 'arch-1',
    category: 'architectural',
    categoryName: 'المواصفات المعمارية والإنشائية',
    title: 'حظر قواطع الجبسون بورد (Gypsum Board)',
    danger: 'إلغاء المعاينة فوراً؛ غير مطابقة لاشتراطات العزل والتطهير ومقاومة الحريق.',
    requirement: 'استخدام قواطع مبنية من الطوب ومكسوة بالسيراميك أو قواطع رخامية مثبتة بالأرض والسقف.'
  },
  {
    id: 'arch-2',
    category: 'architectural',
    categoryName: 'المواصفات المعمارية والإنشائية',
    title: 'حظر الشقق ببابين خارجيين مفتوحين',
    danger: 'رفض الترخيص بدعوى إمكانية فتح منفذ غير مراقب أو غير آمن.',
    requirement: 'سد الباب الثاني تماماً بالطوب والمحارة وتجليده بالسيراميك من الداخل والخارج ليكون جداراً مصمتاً.'
  },
  {
    id: 'arch-3',
    category: 'architectural',
    categoryName: 'المواصفات المعمارية والإنشائية',
    title: 'حظر وجود حمام داخل صالة المعمل أو غرفة السحب',
    danger: 'مخالفة جسيمة لمكافحة العدوى وتلويث بيئة التحاليل.',
    requirement: 'فك قاعدة الحمام وسد مواسير الصرف والتغذية بالسيراميك وتحويل المكان إلى مخزن كواشف فقط.'
  },
  {
    id: 'arch-4',
    category: 'architectural',
    categoryName: 'المواصفات المعمارية والإنشائية',
    title: 'حظر بلاعات الصرف المكشوفة داخل غرفة المعمل',
    danger: 'مصدر رئيسي لخروج الروائح والحشرات والقوارض.',
    requirement: 'إلغاء وسد كافة البلاعات الأرضية المكشوفة داخل صالة المعمل بالسيراميك نهائياً.'
  },
  {
    id: 'arch-5',
    category: 'architectural',
    categoryName: 'المواصفات المعمارية والإنشائية',
    title: 'ارتفاع السقف الصافي والمساحة الصافية',
    danger: 'رفض المعاينة إذا قل ارتفاع السقف عن 2.55م أو قلت صالة المعمل عن 9 م².',
    requirement: 'التأكد من أن الارتفاع من السيراميك للسقف لا يقل عن 2.60م وصالة المعمل 3×3م على الأقل.'
  },
  {
    id: 'arch-6',
    category: 'architectural',
    categoryName: 'المواصفات المعمارية والإنشائية',
    title: 'سلك ضيق ثابت على كافة النوافذ والمناور',
    danger: 'رفض مكافحة العدوى لمنع دخول الذباب والحشرات.',
    requirement: 'تركيب إطارات سلك معدني ضيق وثابت على كافة شبابيك المعمل ودورة المياه والمنور.'
  },
  
  // التجهيزات ومكافحة العدوى
  {
    id: 'eq-1',
    category: 'equipment',
    categoryName: 'التجهيزات ومكافحة العدوى',
    title: 'حظر المراوح الكهربائية والاعتماد على التكييف فقط',
    danger: 'المراوح تنشر الرذاذ الميكروبي وتلوث عينات المرضى وأجهزة السحب.',
    requirement: 'إزالة أي مروحة حائط أو سقف داخل صالة التحاليل والاعتماد حصراً على تكييف هواء سبليت.'
  },
  {
    id: 'eq-2',
    category: 'equipment',
    categoryName: 'التجهيزات ومكافحة العدوى',
    title: 'أوتوكلاف رأسي برميلي (سعة 18-20 لتر فأكثر)',
    danger: 'رفض أوتوكلافات عيادات الأسنان الأفقية الصغيرة (6-12 لتر).',
    requirement: 'توفير أوتوكلاف رأسي سليم به محبس أمان ومؤشر ضغط حراري صالح للاستخدام.'
  },
  {
    id: 'eq-3',
    category: 'equipment',
    categoryName: 'التجهيزات ومكافحة العدوى',
    title: 'كرسي سحب دم هيدروليكي مبطن بالجلد بالكامل',
    danger: 'حظر المساند الخشبية أو الكراسي البلاستيكية أو الشيزلونج لعدم قابليتها للتعقيم.',
    requirement: 'كرسي مخصص لسحب العينات مع مساند يد مبطنة بالجلد الطبي أو الصناعي المقاوم للمطهرات.'
  },
  {
    id: 'eq-4',
    category: 'equipment',
    categoryName: 'التجهيزات ومكافحة العدوى',
    title: 'حظر الستائر القماشية والسجاد والموكيت',
    danger: 'بيئة خصبة لنمو وتراكم البكتيريا والفيروسات وصعوبة التطهير اليومي.',
    requirement: 'ستائر شرائح بلاستيكية (Vertical Blinds) سهلة المسح بالكلور، وأرضيات سيراميك مكشوفة خالية من المفارش.'
  },
  {
    id: 'eq-5',
    category: 'equipment',
    categoryName: 'التجهيزات ومكافحة العدوى',
    title: 'صناديق الأمان (Safety Boxes) وأكياس النفايات الحمراء',
    danger: 'رفض فوري من مفتش السلامة والصحة المهنية لعدم وجود مسار آمن للسنون.',
    requirement: 'صندوق أمان مخصص للتخلص من السنون بدون لمس، مع أكياس نفايات حمراء سميكة داخل برميل مخصص.'
  },
  {
    id: 'eq-6',
    category: 'equipment',
    categoryName: 'التجهيزات ومكافحة العدوى',
    title: 'ثلاجة كواشف بها ترمومتر وسجل حرارة يومي معلق',
    danger: 'تلف الكواشف الطبية وسقوط شروط سلسلة التبريد المعملية.',
    requirement: 'ثلاجة بحالة ممتازة (2-8°C)، ترمومتر بالرف الأوسط، مع كشف ورقي لتسجيل درجة الحرارة صباحاً ومساءً.'
  },

  // الإدارية والمهنية
  {
    id: 'adm-1',
    category: 'administrative',
    categoryName: 'الضوابط المهنية والرقابية',
    title: 'حظر أجهزة صورة الدم والسيولة (CBC & Coagulometer) في معاينة الكيمياء',
    danger: 'إلغاء المعاينة وتحرير محضر العمل خارج التخصص إذا كان ترخيصك كيمياء طبية.',
    requirement: 'يوم مرور اللجنة، لا يتواجد سوى أجهزة الكيمياء، الميكروسكوب، والسنترفيوج؛ ولا توضع أنابيب EDTA.'
  },
  {
    id: 'adm-2',
    category: 'administrative',
    categoryName: 'الضوابط المهنية والرقابية',
    title: 'تطابق الرسم الهندسي مع الواقع الفعلي 100%',
    danger: 'إلغاء المعاينة فوراً في حال اختلاف أي حائط أو منور أو مساحة عن المخطط المعتمد.',
    requirement: 'مراجعة أبعاد الغرف، المناور، وأماكن الأحواض ومطابقتها تماماً مع النسخ الـ 3 المعتمدة من المهندس النقابي.'
  },
  {
    id: 'adm-3',
    category: 'administrative',
    categoryName: 'الضوابط المهنية والرقابية',
    title: 'عينة ضبط الجودة (Normal Control) بالثلاجة',
    danger: 'التفتيش على كفاءة نتائج التحاليل ودقة المحاليل.',
    requirement: 'تواجد محلول كنترول كيميائي ساري الصلاحية محفوظ بالثلاجة ومسجل في دفتر ضبط الجودة اليومي.'
  },
  {
    id: 'adm-4',
    category: 'administrative',
    categoryName: 'الضوابط المهنية والرقابية',
    title: 'تطابق لافتة المعمل وبانر الواجهة مع قرار الترخيص',
    danger: 'حظر الأسماء التجارية الرنانة (مثل القمة أو البرج) بدون سجل تجاري مخصص.',
    requirement: 'الصيغة الرسمية: "معمل التحاليل الكيميائية الطبية لـ د/ [الاسم رباعياً]"، مع لوحة 50×70سم على باب الشقة.'
  },
  {
    id: 'adm-5',
    category: 'administrative',
    categoryName: 'الضوابط المهنية والرقابية',
    title: 'عقد التخلص من النفايات الطبية الخطرة ساري وموثق',
    danger: 'رفض المعاينة لعدم وجود جهة رسمية معتمدة تستلم النفايات البيولوجية.',
    requirement: 'عقد ساري مع شركة النفايات المعتمدة بالمحافظة أو إدارة المستشفيات الحكومية مصحوباً بإيصال سداد.'
  }
];

export default function InspectionChecklist() {
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lab_inspection_checklist');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<'all' | 'architectural' | 'equipment' | 'administrative'>('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lab_inspection_checklist', JSON.stringify(checkedIds));
    }
  }, [checkedIds]);

  const toggleItem = (id: string) => {
    setCheckedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const resetAll = () => {
    if (confirm('هل أنت متأكد من إعادة ضبط القائمة وإلغاء جميع التحديدات؟')) {
      setCheckedIds([]);
    }
  };

  const filteredItems = activeTab === 'all' 
    ? CHECKLIST_ITEMS 
    : CHECKLIST_ITEMS.filter(item => item.category === activeTab);

  const total = CHECKLIST_ITEMS.length;
  const completed = checkedIds.length;
  const percentage = Math.round((completed / total) * 100);

  // Status badge logic
  let statusColor = '#ef4444';
  let statusText = 'غير جاهز للمعاينة ⚠️';
  if (percentage >= 80 && percentage < 100) {
    statusColor = '#f59e0b';
    statusText = 'جاهزية شبه كاملة - انتبه للمتبقي ⚡';
  } else if (percentage === 100) {
    statusColor = '#10b981';
    statusText = 'جاهز بنسبة 100% لاجتياز المعاينة بنجاح! 🏆';
  }

  return (
    <div class="inspection-checklist-container">
      {/* Progress Summary Card */}
      <div class="card checklist-summary" style="padding: 1.5rem; margin-bottom: 2rem; border-radius: 14px; border: 1px solid var(--pico-muted-border-color); background: var(--pico-card-background-color);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.3rem;">
              مؤشر جاهزية المعمل للمعاينة الحكومية
            </h3>
            <p style="margin: 0; color: var(--pico-muted-color); font-size: 0.95rem;">
              تم استيفاء <strong style="color: var(--pico-primary);">{completed}</strong> من أصل <strong>{total}</strong> شرط ومعيار رقابي حاسم.
            </p>
          </div>
          <div style="text-align: left;">
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: statusColor, lineHeight: 1 }}>
              {percentage}%
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: statusColor }}>
              {statusText}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style="width: 100%; height: 12px; background: rgba(0,0,0,0.08); border-radius: 6px; overflow: hidden; margin-top: 1.25rem;">
          <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: statusColor, transition: 'width 0.4s ease' }} />
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 1rem; align-items: center;">
          <small style="color: var(--pico-muted-color);">💡 البيانات تُحفظ تلقائياً في متصفحك.</small>
          {completed > 0 && (
            <button onClick={resetAll} class="outline secondary" style="font-size: 0.8rem; padding: 0.25rem 0.75rem; margin: 0;">
              إعادة ضبط القائمة ↺
            </button>
          )}
        </div>
      </div>

      {/* Tabs Filter */}
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
        <button 
          onClick={() => setActiveTab('all')} 
          class={activeTab === 'all' ? '' : 'outline secondary'}
          style="padding: 0.5rem 1rem; font-size: 0.9rem; margin-bottom: 0;"
        >
          الكل ({total})
        </button>
        <button 
          onClick={() => setActiveTab('architectural')} 
          class={activeTab === 'architectural' ? '' : 'outline secondary'}
          style="padding: 0.5rem 1rem; font-size: 0.9rem; margin-bottom: 0;"
        >
          المعمارية والإنشائية 🏗️
        </button>
        <button 
          onClick={() => setActiveTab('equipment')} 
          class={activeTab === 'equipment' ? '' : 'outline secondary'}
          style="padding: 0.5rem 1rem; font-size: 0.9rem; margin-bottom: 0;"
        >
          التجهيزات والعدوى 🧪
        </button>
        <button 
          onClick={() => setActiveTab('administrative')} 
          class={activeTab === 'administrative' ? '' : 'outline secondary'}
          style="padding: 0.5rem 1rem; font-size: 0.9rem; margin-bottom: 0;"
        >
          المهنية والرقابية 📜
        </button>
      </div>

      {/* Checklist items */}
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        {filteredItems.map(item => {
          const isChecked = checkedIds.includes(item.id);
          return (
            <div 
              key={item.id}
              onClick={() => toggleItem(item.id)}
              class="card"
              style={{
                cursor: 'pointer',
                padding: '1.25rem',
                borderRadius: '12px',
                border: isChecked ? '2px solid #10b981' : '1px solid var(--pico-muted-border-color)',
                backgroundColor: isChecked ? 'rgba(16, 185, 129, 0.05)' : 'var(--pico-card-background-color)',
                transition: 'all 0.2s ease',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}
            >
              <input 
                type="checkbox" 
                checked={isChecked} 
                onChange={() => toggleItem(item.id)}
                style="width: 22px; height: 22px; cursor: pointer; margin-top: 0.25rem; accent-color: #10b981;" 
              />
              <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <h4 style={{ 
                    margin: 0, 
                    fontSize: '1.05rem', 
                    fontWeight: 700,
                    textDecoration: isChecked ? 'line-through' : 'none',
                    color: isChecked ? 'var(--pico-muted-color)' : 'var(--pico-color)'
                  }}>
                    {item.title}
                  </h4>
                  <span class="badge" style="font-size: 0.75rem; background: rgba(13, 148, 136, 0.1); color: var(--pico-primary);">
                    {item.categoryName}
                  </span>
                </div>

                <div style="font-size: 0.9rem; margin-top: 0.5rem; line-height: 1.6;">
                  <div style="color: #ef4444; margin-bottom: 0.25rem;">
                    <strong>سبب الرفض القاتل:</strong> {item.danger}
                  </div>
                  <div style="color: #0d9488;">
                    <strong>الحل والاشتراط المعتمد:</strong> {item.requirement}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
