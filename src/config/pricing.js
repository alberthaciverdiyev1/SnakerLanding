/**
 * Data-Driven Pricing Configuration
 * Structured according to actual product tiers:
 * 🟢 Free
 * 🟣 Premium (with 14-day trial)
 * ⚫ Business
 */

function formatCell(val) {
  if (val === true) return { type: 'check' };
  if (val === false) return { type: 'cross' };
  return { type: 'text', val: String(val) };
}

function row(feature, free, premium, business) {
  return {
    feature,
    free: formatCell(free),
    premium: formatCell(premium),
    business: formatCell(business)
  };
}

const pricingPlans = [
  {
    id: 'free',
    type: 'free',
    badge: '🟢 Free',
    dot: 'green',
    price: 0,
    trialDays: 0,
    popular: false,
    orderFlow: 'whatsapp',
    ctaKey: 'pricing.freeCta'
  },
  {
    id: 'premium',
    type: 'subscription',
    badge: '🟣 Premium',
    dot: 'purple',
    price: null,
    trialDays: 14,
    popular: true,
    orderFlow: 'direct_checkout',
    ctaKey: 'pricing.paidCta'
  },
  {
    id: 'business',
    type: 'business',
    badge: '⚫ Business',
    dot: 'black',
    contactSales: true,
    ctaKey: 'pricing.businessCta'
  }
];

const businessPlan = {
  id: 'business',
  type: 'business',
  badge: '⚫ Business',
  dot: 'black',
  contactSales: true,
  ctaKey: 'pricing.businessCta'
};

const pricingComparison = {
  tr: [
    {
      category: 'Katalog ve Satış',
      items: [
        row('Ürün ekleme', '25 ürün', '500 ürün', 'Sınırsız'),
        row('Sipariş', 'WhatsApp üzerinden', 'Site üzerinden', 'Site üzerinden'),
        row('Online ödeme', false, true, true),
        row('Kupon / indirim', false, true, true),
        row('Varyantlar (renk, beden vb.)', 'Basit', true, true),
        row('Stok takibi', 'Basit', true, true),
        row('Kargo ayarları', false, true, true)
      ]
    },
    {
      category: 'Marka ve Domain',
      items: [
        row('Snaker subdomain', true, true, true),
        row('Özel domain', false, true, true),
        row('Snaker branding', 'Zorunlu', 'Küçük', 'Kaldırılabilir')
      ]
    },
    {
      category: 'Tasarım ve Özelleştirme',
      items: [
        row('Hazır tema seçimi', true, true, true),
        row('Dark / Light tema', 'Temaya bağlı', true, true),
        row('Renk özelleştirme', false, 'Temel', 'Tam'),
        row('Font özelleştirme', false, 'Temel', 'Tam'),
        row('Hazır component seçimi', false, 'Sınırlı', 'Tam'),
        row('Ana sayfa düzenleme', false, 'Temel', 'Gelişmiş')
      ]
    },
    {
      category: 'Pazarlama ve Analitik',
      items: [
        row('SEO ayarları', 'Temel', true, 'Gelişmiş'),
        row('Google Analytics / Pixel', false, true, true),
        row('Satış raporları', false, 'Temel', 'Gelişmiş')
      ]
    },
    {
      category: 'Operasyon ve Entegrasyon',
      items: [
        row('Personel hesabı', false, '2', '10+'),
        row('Çoklu dil', false, '2 dil', 'Çoklu dil'),
        row('Özel kod / entegrasyon', false, false, true),
        row('API erişimi', false, false, true),
        row('Destek', 'Standart', 'Öncelikli', 'Öncelikli / özel')
      ]
    }
  ],
  az: [
    {
      category: 'Kataloq və Satış',
      items: [
        row('Məhsul əlavə etmə', '25 məhsul', '500 məhsul', 'Limitsiz'),
        row('Sifariş', 'WhatsApp üzərindən', 'Sayt üzərindən', 'Sayt üzərindən'),
        row('Onlayn ödəniş', false, true, true),
        row('Kupon / endirim', false, true, true),
        row('Variantlar (rəng, ölçü və s.)', 'Sadə', true, true),
        row('Stok idarəetməsi', 'Sadə', true, true),
        row('Çatdırılma tənzimləmələri', false, true, true)
      ]
    },
    {
      category: 'Domen və Brendinq',
      items: [
        row('Snaker subdomeni', true, true, true),
        row('Fərdi domen (.com, .az)', false, true, true),
        row('Snaker brendinqi', 'Məcburi', 'Kiçik loqo', 'Silinə bilər')
      ]
    },
    {
      category: 'Dizayn və Fərdiləşdirmə',
      items: [
        row('Hazır mövzu seçimi', true, true, true),
        row('Dark / Light rejim', 'Mövzudan asılı', true, true),
        row('Rəng fərdiləşdirməsi', false, 'Əsas', 'Tam'),
        row('Şrift fərdiləşdirməsi', false, 'Əsas', 'Tam'),
        row('Hazır komponent seçimi', false, 'Məhdud', 'Tam'),
        row('Ana səhifə redaktəsi', false, 'Əsas', 'Təkmil')
      ]
    },
    {
      category: 'Marketinq və Analitika',
      items: [
        row('SEO tənzimləmələri', 'Əsas', true, 'Təkmil'),
        row('Google Analytics / Pixel', false, true, true),
        row('Satış hesabatları', false, 'Əsas', 'Təkmil')
      ]
    },
    {
      category: 'Əməliyyat və İnkişaf',
      items: [
        row('İşçi hesabı', false, '2', '10+'),
        row('Çoxdillilik', false, '2 dil', 'Çoxdilli'),
        row('Fərdi kod / inteqrasiya', false, false, true),
        row('API çıxışı', false, false, true),
        row('Dəstək', 'Standart', 'Öncəlikli', 'Öncəlikli / xüsusi')
      ]
    }
  ],
  en: [
    {
      category: 'Catalog & Sales',
      items: [
        row('Product listing limit', '25 products', '500 products', 'Unlimited'),
        row('Order handling', 'Via WhatsApp', 'On-site checkout', 'On-site checkout'),
        row('Online payments', false, true, true),
        row('Coupons / discounts', false, true, true),
        row('Variants (color, size, etc.)', 'Basic', true, true),
        row('Inventory tracking', 'Basic', true, true),
        row('Shipping settings', false, true, true)
      ]
    },
    {
      category: 'Branding & Domain',
      items: [
        row('Snaker subdomain', true, true, true),
        row('Custom domain connection', false, true, true),
        row('Snaker branding badge', 'Mandatory', 'Subtle', 'Removable')
      ]
    },
    {
      category: 'Design & Customization',
      items: [
        row('Pre-built theme selection', true, true, true),
        row('Dark / Light theme', 'Theme-dependent', true, true),
        row('Color customization', false, 'Essential', 'Full'),
        row('Font customization', false, 'Essential', 'Full'),
        row('Curated component selection', false, 'Limited', 'Full'),
        row('Homepage layout editor', false, 'Essential', 'Advanced')
      ]
    },
    {
      category: 'Marketing & Analytics',
      items: [
        row('SEO settings', 'Essential', true, 'Advanced'),
        row('Google Analytics / Pixel', false, true, true),
        row('Sales analytics & reports', false, 'Essential', 'Advanced')
      ]
    },
    {
      category: 'Operations & Scaling',
      items: [
        row('Staff accounts', false, '2', '10+'),
        row('Multi-language support', false, '2 languages', 'Multi-language'),
        row('Custom code / integrations', false, false, true),
        row('API access', false, false, true),
        row('Customer support', 'Standard', 'Priority', 'Priority / Dedicated')
      ]
    }
  ],
  ru: [
    {
      category: 'Каталог и продажи',
      items: [
        row('Добавление товаров', '25 товаров', '500 товаров', 'Безлимитно'),
        row('Прием заказов', 'Через WhatsApp', 'На сайте', 'На сайте'),
        row('Онлайн-оплата', false, true, true),
        row('Купоны и скидки', false, true, true),
        row('Варианты (цвет, размер и т.д.)', 'Базовые', true, true),
        row('Учет остатков', 'Базовый', true, true),
        row('Настройки доставки', false, true, true)
      ]
    },
    {
      category: 'Бренд и домен',
      items: [
        row('Поддомен Snaker', true, true, true),
        row('Собственный домен', false, true, true),
        row('Брендинг Snaker', 'Обязательный', 'Минимальный', 'Отключаемый')
      ]
    },
    {
      category: 'Дизайн и кастомизация',
      items: [
        row('Выбор готовых тем', true, true, true),
        row('Темная / Светлая тема', 'Зависит от темы', true, true),
        row('Настройка цветов', false, 'Базовая', 'Полная'),
        row('Настройка шрифтов', false, 'Базовая', 'Полная'),
        row('Выбор компонентов', false, 'Ограниченный', 'Полный'),
        row('Редактор главной страницы', false, 'Базовый', 'Расширенный')
      ]
    },
    {
      category: 'Маркетинг и аналитика',
      items: [
        row('Настройки SEO', 'Базовые', true, 'Расширенные'),
        row('Google Analytics / Pixel', false, true, true),
        row('Отчеты по продажам', false, 'Базовые', 'Расширенные')
      ]
    },
    {
      category: 'Операции и масштабирование',
      items: [
        row('Аккаунты сотрудников', false, '2', '10+'),
        row('Мультиязычность', false, '2 языка', 'Мультиязычность'),
        row('Кастомный код / интеграции', false, false, true),
        row('Доступ к API', false, false, true),
        row('Поддержка', 'Стандартная', 'Приоритетная', 'Приоритетная / персональная')
      ]
    }
  ]
};

module.exports = {
  pricingPlans,
  businessPlan,
  pricingComparison
};
