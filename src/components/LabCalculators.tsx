import { useState } from 'preact/hooks';

export default function LabCalculators() {
  const [activeCalc, setActiveCalc] = useState<'ldl' | 'eag' | 'egfr' | 'calcium'>('ldl');

  // 1. Friedewald LDL State
  const [tc, setTc] = useState<number | ''>(210);
  const [hdl, setHdl] = useState<number | ''>(45);
  const [tg, setTg] = useState<number | ''>(150);

  // 2. HbA1c to eAG State
  const [hba1c, setHba1c] = useState<number | ''>(7.2);

  // 3. eGFR (Cockcroft-Gault) State
  const [age, setAge] = useState<number | ''>(45);
  const [weight, setWeight] = useState<number | ''>(75);
  const [creat, setCreat] = useState<number | ''>(1.1);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // 4. Corrected Calcium State
  const [rawCal, setRawCal] = useState<number | ''>(8.0);
  const [albumin, setAlbumin] = useState<number | ''>(3.0);

  // Computations
  // LDL
  let ldlResult: { value: number | null; error?: string; status?: string; color?: string } = { value: null };
  if (typeof tc === 'number' && typeof hdl === 'number' && typeof tg === 'number') {
    if (tg >= 400) {
      ldlResult = { value: null, error: 'معادلة فريدوالد غير صالحة علمياً إذا تجاوزت الدهون الثلاثية 400 mg/dL؛ يجب قياس LDL المباشر (Direct LDL).' };
    } else {
      const val = Math.round(tc - hdl - (tg / 5));
      let status = 'مثالي (< 100)';
      let color = '#10b981';
      if (val >= 100 && val < 130) { status = 'فوق المثالي (100-129)'; color = '#0284c7'; }
      else if (val >= 130 && val < 160) { status = 'حد مرتفع (130-159)'; color = '#f59e0b'; }
      else if (val >= 160 && val < 190) { status = 'مرتفع (160-189)'; color = '#ea580c'; }
      else if (val >= 190) { status = 'مرتفع جداً (≥ 190)'; color = '#dc2626'; }
      ldlResult = { value: val, status, color };
    }
  }

  // eAG
  let eagResult: { value: number | null; status?: string; color?: string } = { value: null };
  if (typeof hba1c === 'number' && hba1c > 3) {
    const mgDl = Math.round((28.7 * hba1c) - 46.7);
    let status = 'طبيعي وممتاز';
    let color = '#10b981';
    if (hba1c >= 5.7 && hba1c < 6.5) { status = 'مرحلة ما قبل السكري (Prediabetes)'; color = '#f59e0b'; }
    else if (hba1c >= 6.5 && hba1c <= 7.0) { status = 'سكري منضبط جيداً'; color = '#0284c7'; }
    else if (hba1c > 7.0 && hba1c <= 8.5) { status = 'تحكم غير كافٍ بالسكري'; color = '#ea580c'; }
    else if (hba1c > 8.5) { status = 'خطر مضاعفات وسكري غير منضبط'; color = '#dc2626'; }
    eagResult = { value: mgDl, status, color };
  }

  // eGFR (Cockcroft-Gault)
  let egfrResult: { value: number | null; stage?: string; color?: string } = { value: null };
  if (typeof age === 'number' && typeof weight === 'number' && typeof creat === 'number' && creat > 0) {
    let crCl = ((140 - age) * weight) / (72 * creat);
    if (gender === 'female') {
      crCl = crCl * 0.85;
    }
    const val = Math.round(crCl);
    let stage = 'المرحلة 1: كفاءة طبيعية تماماً (≥ 90)';
    let color = '#10b981';
    if (val >= 60 && val < 90) { stage = 'المرحلة 2: انخفاض طفيف في كفاءة الكلى (60-89)'; color = '#0284c7'; }
    else if (val >= 45 && val < 60) { stage = 'المرحلة 3a: انخفاض معتدل (45-59)'; color = '#f59e0b'; }
    else if (val >= 30 && val < 45) { stage = 'المرحلة 3b: انخفاض شديد (30-44)'; color = '#ea580c'; }
    else if (val >= 15 && val < 30) { stage = 'المرحلة 4: قصور كلوي متقدم (15-29)'; color = '#dc2626'; }
    else if (val < 15) { stage = 'المرحلة 5: فشل كلوي نهائي يحتاج غسيل (< 15)'; color = '#991b1b'; }
    egfrResult = { value: val, stage, color };
  }

  // Corrected Calcium
  let calResult: { value: number | null; status?: string; color?: string } = { value: null };
  if (typeof rawCal === 'number' && typeof albumin === 'number') {
    const val = Number((rawCal + 0.8 * (4.0 - albumin)).toFixed(2));
    let status = 'طبيعي (8.5 - 10.5 mg/dL)';
    let color = '#10b981';
    if (val < 8.5) { status = 'نقص كالسيوم حقيقي مصحح'; color = '#dc2626'; }
    else if (val > 10.5) { status = 'فرط كالسيوم حقيقي مصحح'; color = '#dc2626'; }
    calResult = { value: val, status, color };
  }

  return (
    <div class="lab-calculators-container">
      {/* Selector Tabs */}
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem;">
        <button 
          onClick={() => setActiveCalc('ldl')} 
          class={activeCalc === 'ldl' ? '' : 'outline secondary'}
          style="padding: 0.6rem 1rem; font-size: 0.95rem; margin: 0;"
        >
          حاسبة كوليسترول LDL 🫀
        </button>
        <button 
          onClick={() => setActiveCalc('eag')} 
          class={activeCalc === 'eag' ? '' : 'outline secondary'}
          style="padding: 0.6rem 1rem; font-size: 0.95rem; margin: 0;"
        >
          حاسبة السكر التراكمي (eAG) 🩸
        </button>
        <button 
          onClick={() => setActiveCalc('egfr')} 
          class={activeCalc === 'egfr' ? '' : 'outline secondary'}
          style="padding: 0.6rem 1rem; font-size: 0.95rem; margin: 0;"
        >
          حاسبة كفاءة الكلى (eGFR) 🩺
        </button>
        <button 
          onClick={() => setActiveCalc('calcium')} 
          class={activeCalc === 'calcium' ? '' : 'outline secondary'}
          style="padding: 0.6rem 1rem; font-size: 0.95rem; margin: 0;"
        >
          الكالسيوم المصحح للألبومين 🦴
        </button>
      </div>

      {/* 1. LDL Friedewald */}
      {activeCalc === 'ldl' && (
        <div class="card" style="padding: 1.75rem; border-radius: 14px; background: var(--pico-card-background-color); border: 1px solid var(--pico-muted-border-color);">
          <h3 style="margin: 0 0 0.5rem 0; color: var(--pico-primary);">
            حاسبة الكوليسترول الضار (معادلة فريدوالد Friedewald)
          </h3>
          <p style="color: var(--pico-muted-color); font-size: 0.92rem; margin-bottom: 1.5rem;">
            المعادلة القياسية المعتمدة لحساب الكوليسترول منخفض الكثافة: <code>LDL = TC - HDL - (TG / 5)</code>
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <label>
              الكوليسترول الكلي (Total Cholesterol)
              <input 
                type="number" 
                value={tc} 
                onInput={(e) => setTc(Number((e.target as HTMLInputElement).value) || '')} 
                placeholder="مثال: 210"
              />
              <small>mg/dL</small>
            </label>

            <label>
              الكوليسترول النافع (HDL)
              <input 
                type="number" 
                value={hdl} 
                onInput={(e) => setHdl(Number((e.target as HTMLInputElement).value) || '')} 
                placeholder="مثال: 45"
              />
              <small>mg/dL</small>
            </label>

            <label>
              الدهون الثلاثية (Triglycerides)
              <input 
                type="number" 
                value={tg} 
                onInput={(e) => setTg(Number((e.target as HTMLInputElement).value) || '')} 
                placeholder="مثال: 150"
              />
              <small>mg/dL (أقل من 400)</small>
            </label>
          </div>

          {/* Result */}
          <div style="background: rgba(0,0,0,0.03); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--pico-muted-border-color);">
            {ldlResult.error ? (
              <div style="color: #dc2626; font-weight: 700;">⚠️ {ldlResult.error}</div>
            ) : ldlResult.value !== null ? (
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <div style="font-size: 0.9rem; color: var(--pico-muted-color);">الكوليسترول الضار المحسوب (LDL-C):</div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 800, color: ldlResult.color }}>
                    {ldlResult.value} <span style="font-size: 1rem; font-weight: 500;">mg/dL</span>
                  </div>
                </div>
                <div style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: ldlResult.color, color: '#fff', fontWeight: 700 }}>
                  {ldlResult.status}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* 2. HbA1c to eAG */}
      {activeCalc === 'eag' && (
        <div class="card" style="padding: 1.75rem; border-radius: 14px; background: var(--pico-card-background-color); border: 1px solid var(--pico-muted-border-color);">
          <h3 style="margin: 0 0 0.5rem 0; color: var(--pico-primary);">
            حاسبة متوسط السكر اليومي المقابل للتراكمي (eAG Calculator)
          </h3>
          <p style="color: var(--pico-muted-color); font-size: 0.92rem; margin-bottom: 1.5rem;">
            تُترجم نسبة الهيموجلوبين السكري (HbA1c %) إلى متوسط قراءة السكر اليومية بالدم (mg/dL) حسب دراسات الجمعية الأمريكية للسكري (ADA).
          </p>

          <div style="max-width: 300px; margin-bottom: 1.5rem;">
            <label>
              نسبة السكر التراكمي (HbA1c)
              <input 
                type="number" 
                step="0.1"
                value={hba1c} 
                onInput={(e) => setHba1c(Number((e.target as HTMLInputElement).value) || '')} 
                placeholder="مثال: 7.2"
              />
              <small>النسبة المئوية %</small>
            </label>
          </div>

          {/* Result */}
          <div style="background: rgba(0,0,0,0.03); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--pico-muted-border-color);">
            {eagResult.value !== null && (
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <div style="font-size: 0.9rem; color: var(--pico-muted-color);">متوسط السكر اليومي في دم المريض (eAG):</div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 800, color: eagResult.color }}>
                    ~{eagResult.value} <span style="font-size: 1rem; font-weight: 500;">mg/dL</span>
                  </div>
                </div>
                <div style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: eagResult.color, color: '#fff', fontWeight: 700 }}>
                  {eagResult.status}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. eGFR Cockcroft-Gault */}
      {activeCalc === 'egfr' && (
        <div class="card" style="padding: 1.75rem; border-radius: 14px; background: var(--pico-card-background-color); border: 1px solid var(--pico-muted-border-color);">
          <h3 style="margin: 0 0 0.5rem 0; color: var(--pico-primary);">
            حاسبة معدل ترشيح وتصفية الكلى (eGFR / CrCl)
          </h3>
          <p style="color: var(--pico-muted-color); font-size: 0.92rem; margin-bottom: 1.5rem;">
            معادلة كوكروفت-جولت القياسية لتقييم كفاءة الكلى وتحديد مراحل القصور الكلوي المزمن (CKD Stages).
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <label>
              العمر (بالسنوات)
              <input 
                type="number" 
                value={age} 
                onInput={(e) => setAge(Number((e.target as HTMLInputElement).value) || '')} 
              />
            </label>

            <label>
              الوزن (كجم)
              <input 
                type="number" 
                value={weight} 
                onInput={(e) => setWeight(Number((e.target as HTMLInputElement).value) || '')} 
              />
            </label>

            <label>
              الكرياتينين في السيرم
              <input 
                type="number" 
                step="0.1"
                value={creat} 
                onInput={(e) => setCreat(Number((e.target as HTMLInputElement).value) || '')} 
              />
              <small>mg/dL</small>
            </label>

            <label>
              الجنس
              <select 
                value={gender} 
                onChange={(e) => setGender((e.target as HTMLSelectElement).value as 'male' | 'female')}
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى (ضرب 0.85)</option>
              </select>
            </label>
          </div>

          {/* Result */}
          <div style="background: rgba(0,0,0,0.03); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--pico-muted-border-color);">
            {egfrResult.value !== null && (
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <div style="font-size: 0.9rem; color: var(--pico-muted-color);">معدل تصفية الكرياتينين (Creatinine Clearance):</div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 800, color: egfrResult.color }}>
                    {egfrResult.value} <span style="font-size: 1rem; font-weight: 500;">mL/min</span>
                  </div>
                </div>
                <div style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: egfrResult.color, color: '#fff', fontWeight: 700 }}>
                  {egfrResult.stage}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Corrected Calcium */}
      {activeCalc === 'calcium' && (
        <div class="card" style="padding: 1.75rem; border-radius: 14px; background: var(--pico-card-background-color); border: 1px solid var(--pico-muted-border-color);">
          <h3 style="margin: 0 0 0.5rem 0; color: var(--pico-primary);">
            حاسبة الكالسيوم المصحح لنقص الألبومين (Corrected Calcium)
          </h3>
          <p style="color: var(--pico-muted-color); font-size: 0.92rem; margin-bottom: 1.5rem;">
            يرتبط 40-50% من كالسيوم الدم ببروتين الألبومين. عند انخفاض الألبومين، يبدو الكالسيوم منخفضاً زائفاً؛ وتصححه هذه المعادلة: <code>Corrected Ca = Total Ca + 0.8 × (4.0 - Albumin)</code>.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <label>
              الكالسيوم الكلي المقاس (Total Calcium)
              <input 
                type="number" 
                step="0.1"
                value={rawCal} 
                onInput={(e) => setRawCal(Number((e.target as HTMLInputElement).value) || '')} 
              />
              <small>mg/dL</small>
            </label>

            <label>
              ألبومين السيرم (Serum Albumin)
              <input 
                type="number" 
                step="0.1"
                value={albumin} 
                onInput={(e) => setAlbumin(Number((e.target as HTMLInputElement).value) || '')} 
              />
              <small>g/dL (المعدل الطبيعي 4.0)</small>
            </label>
          </div>

          {/* Result */}
          <div style="background: rgba(0,0,0,0.03); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--pico-muted-border-color);">
            {calResult.value !== null && (
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <div style="font-size: 0.9rem; color: var(--pico-muted-color);">الكالسيوم الفعلي المصحح (Corrected Total Calcium):</div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 800, color: calResult.color }}>
                    {calResult.value} <span style="font-size: 1rem; font-weight: 500;">mg/dL</span>
                  </div>
                </div>
                <div style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: calResult.color, color: '#fff', fontWeight: 700 }}>
                  {calResult.status}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
