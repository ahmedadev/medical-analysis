import { useState, useMemo } from 'preact/hooks';
import type { MedicalAnalysis } from '../data/analyses';
import { medicalCategories } from '../data/analyses';

interface Props {
  analyses: MedicalAnalysis[];
}

export default function MedicalExplorer({ analyses }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<MedicalAnalysis | null>(null);

  // Filter items declaratively
  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return analyses.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        !q ||
        item.nameAr.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.abbr.toLowerCase().includes(q) ||
        item.categoryAr.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [analyses, search, activeCategory]);

  return (
    <div>
      {/* Search & Category Filter Card */}
      <section class="controls-card">
        <div class="search-box-wrapper">
          <input
            type="search"
            value={search}
            onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
            class="search-input"
            placeholder="ابحث باسم التحليل (مثل: صورة دم، كلى، سكر، CBC، ALT، TSH)..."
            aria-label="البحث في التحاليل"
          />
        </div>

        {/* Categories Pills */}
        <div class="categories-nav">
          {medicalCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              class={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.nameAr}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Counter bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <small style={{ color: 'var(--pico-muted-color)' }}>
          عرض <strong>{filteredItems.length}</strong> فحص مخبري
        </small>
        {(search || activeCategory !== 'all') && (
          <button
            type="button"
            class="outline secondary"
            style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}
            onClick={() => {
              setSearch('');
              setActiveCategory('all');
            }}
          >
            إعادة تعيين الفلاتر ✕
          </button>
        )}
      </div>

      {/* Cards Grid */}
      {filteredItems.length > 0 ? (
        <div class="analyses-grid">
          {filteredItems.map((item) => (
            <article key={item.id} class="analysis-card">
              <div>
                <div class="card-header-badge">
                  <span class="badge badge-category">{item.categoryAr}</span>
                  <span
                    class={`badge ${
                      item.fastingRequirements.includes('لا يشترط') ? 'badge-free' : 'badge-fasting'
                    }`}
                  >
                    {item.fastingRequirements.includes('لا يشترط') ? '✓ بدون صيام' : '⏱ يتطلب صيام'}
                  </span>
                </div>

                <h2 class="card-title-ar">{item.nameAr}</h2>
                <div class="card-title-en">
                  <span class="latin-term">{item.nameEn}</span> •{' '}
                  <span class="latin-term" style={{ fontWeight: 700, color: 'var(--pico-primary)' }}>
                    ({item.abbr})
                  </span>
                </div>

                <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--pico-color)' }}>
                  {item.summary}
                </p>

                <div class="range-box">
                  <span class="range-label">النطاق الطبيعي المعتاد:</span>
                  {item.normalRange.general ? (
                    <div>
                      {item.normalRange.general} <span class="latin-term">{item.normalRange.unit}</span>
                    </div>
                  ) : (
                    <div>
                      {item.normalRange.male && (
                        <div>
                          رجال: {item.normalRange.male} <span class="latin-term">{item.normalRange.unit}</span>
                        </div>
                      )}
                      {item.normalRange.female && (
                        <div>
                          نساء: {item.normalRange.female} <span class="latin-term">{item.normalRange.unit}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  class="details-btn outline"
                  onClick={() => setSelectedItem(item)}
                >
                  📖 التفاصيل وأسباب الخلل
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3>لم نجد أي تحليل يطابق بحثك</h3>
          <p style={{ color: 'var(--pico-muted-color)' }}>
            جرب البحث بالاختصار الطبي بالإنجليزي (مثل: CBC، TSH، ALT) أو تصفح باقي الأقسام.
          </p>
          <button
            type="button"
            class="outline"
            style={{ marginTop: '1rem' }}
            onClick={() => {
              setSearch('');
              setActiveCategory('all');
            }}
          >
            عرض كافة التحاليل
          </button>
        </div>
      )}

      {/* Interactive Modal Details */}
      {selectedItem && (
        <dialog open style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <article style={{ maxWidth: '680px', width: '100%', textAlign: 'right', direction: 'rtl' }}>
            <header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                paddingBottom: '0.75rem',
              }}
            >
              <div>
                <span class="badge badge-category" style={{ marginBottom: '0.5rem' }}>
                  {selectedItem.categoryAr}
                </span>
                <h3 style={{ marginBottom: '0.2rem' }}>{selectedItem.nameAr}</h3>
                <p style={{ margin: 0, color: 'var(--pico-muted-color)' }} class="latin-term">
                  {selectedItem.nameEn} ({selectedItem.abbr})
                </p>
              </div>
              <button
                type="button"
                class="outline secondary"
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '1.2rem',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="إغلاق"
                onClick={() => setSelectedItem(null)}
              >
                ×
              </button>
            </header>

            <div style={{ padding: '1rem 0' }}>
              <p>
                <strong>وصف الفحص:</strong> {selectedItem.summary}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  margin: '1rem 0',
                }}
              >
                <div
                  style={{
                    background: 'var(--pico-card-background-color)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--pico-muted-border-color)',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', color: 'var(--pico-muted-color)', display: 'block' }}>
                    💉 نوع العينة:
                  </span>
                  <strong>{selectedItem.sampleType}</strong>
                </div>
                <div
                  style={{
                    background: 'var(--pico-card-background-color)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--pico-muted-border-color)',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', color: 'var(--pico-muted-color)', display: 'block' }}>
                    ⏱ شروط الصيام:
                  </span>
                  <strong>{selectedItem.fastingRequirements}</strong>
                </div>
              </div>

              <div class="range-box" style={{ margin: '1rem 0' }}>
                <span class="range-label">📊 المعدلات الطبيعية المرجعية:</span>
                {selectedItem.normalRange.general && (
                  <p style={{ margin: '0.25rem 0' }}>
                    {selectedItem.normalRange.general}{' '}
                    <span class="latin-term">({selectedItem.normalRange.unit})</span>
                  </p>
                )}
                {selectedItem.normalRange.male && (
                  <p style={{ margin: '0.25rem 0' }}>
                    للذكور: {selectedItem.normalRange.male}{' '}
                    <span class="latin-term">({selectedItem.normalRange.unit})</span>
                  </p>
                )}
                {selectedItem.normalRange.female && (
                  <p style={{ margin: '0.25rem 0' }}>
                    للإناث: {selectedItem.normalRange.female}{' '}
                    <span class="latin-term">({selectedItem.normalRange.unit})</span>
                  </p>
                )}
              </div>

              <div class="detail-section detail-high">
                <strong style={{ color: 'var(--badge-high)', display: 'block', marginBottom: '0.4rem' }}>
                  🔺 أبرز أسباب ارتفاع القراءة:
                </strong>
                <ul style={{ margin: 0, paddingRight: '1.25rem', fontSize: '0.95rem' }}>
                  {selectedItem.highIndication.map((cause, idx) => (
                    <li key={idx}>{cause}</li>
                  ))}
                </ul>
              </div>

              <div class="detail-section detail-low">
                <strong style={{ color: 'var(--badge-low)', display: 'block', marginBottom: '0.4rem' }}>
                  🔻 أبرز أسباب انخفاض القراءة:
                </strong>
                <ul style={{ margin: 0, paddingRight: '1.25rem', fontSize: '0.95rem' }}>
                  {selectedItem.lowIndication.map((cause, idx) => (
                    <li key={idx}>{cause}</li>
                  ))}
                </ul>
              </div>

              <div class="detail-section detail-notes">
                <strong style={{ color: '#b45309', display: 'block', marginBottom: '0.3rem' }}>
                  💡 نصيحة وإرشاد مخبري:
                </strong>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>{selectedItem.notes}</p>
              </div>
            </div>

            <footer style={{ textAlign: 'left', paddingTop: '0.75rem' }}>
              <button
                type="button"
                class="secondary outline"
                onClick={() => setSelectedItem(null)}
              >
                إغلاق النافذة
              </button>
            </footer>
          </article>
        </dialog>
      )}
    </div>
  );
}
