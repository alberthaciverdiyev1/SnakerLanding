const express = require('express');
const router = express.Router();

const SUPPORTED_LANGS = ['az', 'en', 'ru', 'tr'];
const DEFAULT_LANG = 'az';

const locales = {
  az: require('../locales/az.json'),
  en: require('../locales/en.json'),
  ru: require('../locales/ru.json'),
  tr: require('../locales/tr.json')
};

// FAQ entries localized naturally
const faqData = {
  az: [
    {
      q: 'Mağazanı açmaq və idarə etmək üçün proqramlaşdırma biliyi lazımdırmı?',
      a: 'Xeyr. Snaker xüsusi olaraq sahibkarlar və pərakəndə satıcılar üçün hazırlanıb. Məhsul yükləmək, qiymət dəyişmək və sifarişləri izləmək üçün heç bir kod yazmağa ehtiyac yoxdur.'
    },
    {
      q: 'Öz fərdi domen adımdan (məsələn, magazaminadi.com) istifadə edə bilərəm?',
      a: 'Bəli. Sahib olduğunuz istənilən fərdi domeni mağazanıza qoşa bilərsiniz. Təhlükəsizlik üçün SSL sertifikatı avtomatik olaraq təmənnasız təmin edilir.'
    },
    {
      q: 'Dizayner tutmadan mağazamın görünüşünü dəyişə bilərəm?',
      a: 'Bəli. Snaker fərqli biznes sahələrinə uyğun hazır vitrin üslubları təklif edir. Loqonuzu, rəngləri və əsas bannerləri idarəetmə panelindən birbaşa tənzimləyə bilərsiniz.'
    },
    {
      q: 'Müştərilərim hansı ödəniş üsullarından istifadə edə biləcək?',
      a: 'Müştəriləriniz bank kartları (Visa, Mastercard), Apple Pay və yerli ödəniş sistemləri vasitəsilə təhlükəsiz şəkildə ödəniş edə bilər. Qazanılan vəsait birbaşa bank hesabınıza köçürülür.'
    },
    {
      q: 'Sonradan başqa tarif planına keçmək mümkündürmü?',
      a: 'Bəli. Biznesiniz böyüdükcə və sifariş həcmi artdıqca istənilən vaxt panelinizdən daha geniş imkanlara malik plana keçid edə bilərsiniz.'
    },
    {
      q: 'Mövcud məhsullarımı və ya mağazamı Snaker-ə köçürə bilərəm?',
      a: 'Bəli. Excel və ya CSV faylı vasitəsilə məhsul siyahınızı, qiymətləri və qalıqları bir dəfəyə sistemə daxil edə bilərsiniz.'
    }
  ],
  en: [
    {
      q: 'Do I need technical or coding knowledge to run a store?',
      a: 'No. Snaker is built for business owners, not programmers. Uploading products, updating prices, and tracking customer orders requires no technical background.'
    },
    {
      q: 'Can I connect my own custom domain (e.g. yourstore.com)?',
      a: 'Yes. You can connect any custom domain you already own. Standard SSL security certificates are provisioned automatically at no additional charge.'
    },
    {
      q: 'Can I customize the storefront design without a web agency?',
      a: 'Yes. Snaker provides versatile design foundations tailored for different product categories. You can adjust your logo, brand accents, and layout directly from the dashboard.'
    },
    {
      q: 'Which payment methods are supported for customers?',
      a: 'Your customers can pay using major credit and debit cards, Apple Pay, Google Pay, and standard local settlement rails. Funds deposit directly to your bank account.'
    },
    {
      q: 'Can I upgrade my commercial plan as my volume grows?',
      a: 'Yes. You can start with what your business requires today and transition to higher capacity plans as your inventory and order numbers expand.'
    },
    {
      q: 'Can I import an existing product catalog?',
      a: 'Yes. You can import products, variant options, pricing, and initial stock quantities via standard CSV or spreadsheet files.'
    }
  ],
  ru: [
    {
      q: 'Нужны ли технические навыки или знание кода для работы?',
      a: 'Нет. Snaker разработан специально для предпринимателей. Загрузка товаров, изменение цен и обработка заказов не требуют навыков программирования.'
    },
    {
      q: 'Могу ли я подключить собственный домен (например, yourstore.ru)?',
      a: 'Да. Вы можете подключить любой собственный домен. Сертификаты безопасности SSL подключаются автоматически без скрытых платежей.'
    },
    {
      q: 'Можно ли изменить оформление магазина без дизайнера?',
      a: 'Да. Snaker предлагает готовые стилевые основы для разных сфер торговли. Вы можете настроить логотип, фирменные цвета и баннеры прямо в панели управления.'
    },
    {
      q: 'Какие способы оплаты поддерживаются для покупателей?',
      a: 'Покупатели могут оплачивать заказы банковскими картами, Apple Pay и популярными платежными сервисами. Средства зачисляются напрямую на ваш расчетный счет.'
    },
    {
      q: 'Можно ли сменить тарифный план при росте бизнеса?',
      a: 'Да. Вы можете начать с базового тарифа и перейти на расширенный план в любой момент по мере роста числа заказов.'
    },
    {
      q: 'Возможен ли перенос готовой базы товаров?',
      a: 'Да. Вы можете быстро загрузить список товаров, фотографии, варианты и остатки через стандартные файлы Excel или CSV.'
    }
  ],
  tr: [
    {
      q: 'Mağazayı yönetmek için kodlama veya teknik bilgi gerekir mi?',
      a: 'Hayır. Snaker özellikle işletme sahipleri için tasarlanmıştır. Ürün eklemek, fiyat güncellemek ve siparişleri takip etmek için teknik bilgiye ihtiyaç duymazsınız.'
    },
    {
      q: 'Kendi alan adımı (örneğin magazaminadi.com) bağlayabilir miyim?',
      a: 'Evet. Sahip olduğunuz herhangi bir özel alan adını mağazanıza bağlayabilirsiniz. SSL güvenlik sertifikası ücretsiz olarak otomatik tanımlanır.'
    },
    {
      q: 'Tasarımcı tutmadan mağazamın görünümünü özelleştirebilir miyim?',
      a: 'Evet. Farklı sektörlere uygun vitrin tasarımları mevcuttur. Logonuzu, marka renklerinizi ve vitrin düzeninizi yönetim panelinden kolayca ayarlayabilirsiniz.'
    },
    {
      q: 'Müşterilerim hangi ödeme yöntemleriyle ödeme yapabilir?',
      a: 'Müşterileriniz kredi/banka kartları ve popüler ödeme kanallarıyla güvenli biçimde ödeme yapabilir. Ödemeler doğrudan banka hesabınıza aktarılır.'
    },
    {
      q: 'İşletmem büyüdükçe planımı yükseltebilir miyim?',
      a: 'Evet. İhtiyacınız olan planla başlayabilir, sipariş ve ürün hacminiz arttıkça dilediğiniz zaman üst planlara geçiş yapabilirsiniz.'
    },
    {
      q: 'Mevcut ürünlerimi toplu olarak aktarabilir miyim?',
      a: 'Evet. Excel veya CSV dosyası kullanarak ürünlerinizi, fiyatlarınızı ve stok bilgilerinizi tek seferde Snaker platformuna aktarabilirsiniz.'
    }
  ]
};

// Pricing plans structure with configurable null prices (no fake $9/$29 prices)
const plansConfig = [
  {
    id: 'starter',
    price: null,
    highlight: false
  },
  {
    id: 'business',
    price: null,
    highlight: true
  },
  {
    id: 'pro',
    price: null,
    highlight: false
  }
];

// Root redirect to default language
router.get('/', (req, res) => {
  res.redirect(`/${DEFAULT_LANG}`);
});

// Localized promotional page
router.get('/:lang', (req, res, next) => {
  const lang = req.params.lang.toLowerCase();
  if (!SUPPORTED_LANGS.includes(lang)) {
    return next();
  }

  const locale = locales[lang] || locales.az;
  const languages = SUPPORTED_LANGS.map(code => ({
    code: code,
    label: code.toUpperCase(),
    active: code === lang,
    url: `/${code}`
  }));

  res.render('home', {
    currentLang: lang,
    pageTitle: locale.meta.title,
    metaDescription: locale.meta.description,
    languages: languages,
    faqs: faqData[lang] || faqData.az,
    plans: plansConfig,
    tData: locale
  });
});

// Demo Request handler
router.post('/request-demo', (req, res) => {
  const { name, email, store_name, selling_category, website, lang = 'az' } = req.body;
  if (!email || !email.includes('@') || !name) {
    const errMap = {
      az: 'Zəhmət olmasa adınızı və düzgün e-poçt ünvanınızı qeyd edin.',
      en: 'Please enter your name and a valid work email.',
      ru: 'Пожалуйста, укажите имя и корректный адрес электронной почты.',
      tr: 'Lütfen adınızı ve geçerli bir e-posta adresi belirtin.'
    };
    return res.status(400).json({ error: errMap[lang] || errMap.az });
  }

  const successMap = {
    az: `Təşəkkür edirik, ${name}. Məlumatlarınız qeydə alındı, nümayəndəmiz tezliklə sizinlə əlaqə saxlayacaq.`,
    en: `Thank you, ${name}. Our team has received your details and will reach out shortly.`,
    ru: `Спасибо, ${name}. Мы получили вашу заявку и свяжемся с вами в ближайшее время.`,
    tr: `Teşekkürler, ${name}. Talebiniz alındı, ekibimiz en kısa sürede sizinle iletişime geçecektir.`
  };

  return res.json({
    success: true,
    message: successMap[lang] || successMap.az
  });
});

module.exports = router;
