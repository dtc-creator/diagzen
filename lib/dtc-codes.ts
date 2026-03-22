export const TOP_100_DTC_CODES = [
  'P0087', 'P0088', 'P0089', 'P0090', 'P0091',
  'P0100', 'P0101', 'P0102', 'P0103', 'P0104',
  'P0110', 'P0111', 'P0112', 'P0113', 'P0114',
  'P0120', 'P0121', 'P0122', 'P0123', 'P0128',
  'P0130', 'P0131', 'P0132', 'P0133', 'P0134',
  'P0171', 'P0172', 'P0174', 'P0175',
  'P0200', 'P0201', 'P0202', 'P0203', 'P0204',
  'P0300', 'P0301', 'P0302', 'P0303', 'P0304',
  'P0335', 'P0336', 'P0340', 'P0341',
  'P0400', 'P0401', 'P0402', 'P0420', 'P0421',
  'P0440', 'P0441', 'P0442', 'P0443', 'P0455',
  'P0500', 'P0505', 'P0506', 'P0507',
  'P0600', 'P0601', 'P0602', 'P0603', 'P0604',
  'P0700', 'P0715', 'P0720', 'P0730', 'P0740',
  'P0800', 'P0811', 'P0841', 'P0842',
  'B0001', 'B0010', 'B0020', 'B0051',
  'C0035', 'C0040', 'C0045', 'C0050',
  'U0001', 'U0100', 'U0101', 'U0121', 'U0140',
];

export const DTC_STATIC_DATA: Record<string, {
  name_en: string;
  name_ar: string;
  name_fr: string;
  severity: 'critical' | 'moderate' | 'minor';
  description_en: string;
  description_ar: string;
  description_fr: string;
  causes_en: string[];
  causes_ar: string[];
  causes_fr: string[];
  related: string[];
}> = {
  P0087: {
    name_en: 'Fuel Rail Pressure Too Low',
    name_ar: 'انخفاض ضغط سكة الوقود',
    name_fr: 'Pression de rampe carburant trop basse',
    severity: 'critical',
    description_en: 'The P0087 code indicates that the fuel pressure in the fuel rail is lower than the specified minimum threshold. This condition prevents the engine from receiving adequate fuel delivery, resulting in poor performance, stalling, or inability to start. The fuel system must maintain precise pressure for proper atomization and combustion. When pressure drops below specification (typically 58 PSI for most vehicles), the ECM triggers this code and may activate a fail-safe mode.',
    description_ar: 'يشير كود P0087 إلى أن ضغط الوقود في سكة الوقود أقل من الحد الأدنى المحدد. هذه الحالة تمنع المحرك من الحصول على إمداد كافٍ من الوقود، مما يؤدي إلى ضعف الأداء أو التوقف أو عدم القدرة على التشغيل. يجب أن يحافظ نظام الوقود على ضغط دقيق لضمان التبخير والاحتراق الصحيح.',
    description_fr: 'Le code P0087 indique que la pression du carburant dans la rampe est inférieure au seuil minimum spécifié. Cette condition empêche le moteur de recevoir une alimentation suffisante en carburant, entraînant de mauvaises performances, des calages ou une incapacité à démarrer. Le système de carburant doit maintenir une pression précise pour une atomisation et une combustion correctes.',
    causes_en: ['Clogged fuel filter', 'Weak or failing fuel pump', 'Faulty fuel pressure regulator', 'Restricted fuel line'],
    causes_ar: ['فلتر الوقود المسدود', 'مضخة الوقود الضعيفة أو المعطلة', 'منظم ضغط الوقود المعيب', 'خط الوقود المقيد'],
    causes_fr: ['Filtre à carburant bouché', 'Pompe à carburant défaillante', 'Régulateur de pression défectueux', 'Conduite de carburant obstruée'],
    related: ['P0088', 'P0089', 'P0090', 'P0091'],
  },
  P0300: {
    name_en: 'Random/Multiple Cylinder Misfire Detected',
    name_ar: 'اكتشاف إطلاق خاطئ في أسطوانات متعددة',
    name_fr: 'Raté d\'allumage aléatoire / multiple détecté',
    severity: 'critical',
    description_en: 'The P0300 code is triggered when the ECM detects random or multiple cylinder misfires. Unlike codes P0301–P0308 which target a specific cylinder, P0300 indicates the misfire is not isolated to one cylinder. This can cause rough running, increased emissions, catalytic converter damage if left unaddressed, and poor fuel economy. Misfires occur when combustion fails to complete properly in one or more cylinders during the power stroke.',
    description_ar: 'يتم تشغيل كود P0300 عندما يكتشف ECM إطلاقاً خاطئاً عشوائياً أو في أسطوانات متعددة. هذا يمكن أن يسبب اهتزازاً في تشغيل المحرك وزيادة الانبعاثات وتلف المحول الحفازي.',
    description_fr: 'Le code P0300 est déclenché lorsque l\'ECM détecte des ratés d\'allumage aléatoires ou multiples. Contrairement aux codes P0301-P0308 qui ciblent un cylindre spécifique, P0300 indique que le raté n\'est pas isolé à un seul cylindre.',
    causes_en: ['Worn spark plugs', 'Faulty ignition coils', 'Clogged fuel injectors', 'Low fuel pressure'],
    causes_ar: ['شمعات إشعال بالية', 'ملفات إشعال معطلة', 'حاقنات وقود مسدودة', 'ضغط وقود منخفض'],
    causes_fr: ['Bougies d\'allumage usées', 'Bobines d\'allumage défectueuses', 'Injecteurs de carburant bouchés', 'Faible pression carburant'],
    related: ['P0301', 'P0302', 'P0303', 'P0304'],
  },
  P0171: {
    name_en: 'System Too Lean (Bank 1)',
    name_ar: 'المزيج الفقير - الضفة 1',
    name_fr: 'Système trop pauvre (Banque 1)',
    severity: 'moderate',
    description_en: 'The P0171 code indicates that the engine air/fuel mixture is running too lean on Bank 1 (the side of the engine containing cylinder #1). Too lean means there is too much air and not enough fuel in the mixture. The ECM is adding more fuel than expected via long-term fuel trim to compensate, indicating a real underlying problem. This can lead to engine damage if the lean condition is severe or prolonged.',
    description_ar: 'يشير كود P0171 إلى أن خليط الهواء والوقود في المحرك فقير جداً في الضفة 1. الفقر يعني وجود هواء أكثر من اللازم ووقود أقل من الكافي في الخليط.',
    description_fr: 'Le code P0171 indique que le mélange air/carburant du moteur est trop pauvre sur la Banque 1. Trop pauvre signifie qu\'il y a trop d\'air et pas assez de carburant dans le mélange.',
    causes_en: ['Vacuum leak', 'MAF sensor dirty or faulty', 'Clogged fuel injectors', 'Low fuel pressure'],
    causes_ar: ['تسرب فراغي', 'حساس MAF متسخ أو معطل', 'حاقنات وقود مسدودة', 'ضغط وقود منخفض'],
    causes_fr: ['Fuite de vide', 'Capteur MAF sale ou défectueux', 'Injecteurs bouchés', 'Pression carburant faible'],
    related: ['P0172', 'P0174', 'P0175'],
  },
  P0128: {
    name_en: 'Coolant Temperature Below Thermostat Regulating Temperature',
    name_ar: 'درجة حرارة سائل التبريد أقل من درجة منظم الحرارة',
    name_fr: 'Température de liquide de refroidissement inférieure au thermostat',
    severity: 'minor',
    description_en: 'The P0128 code means the engine is not reaching or maintaining the proper operating temperature as regulated by the thermostat. The ECM monitors coolant temperature via the ECT sensor and compares it against the expected temperature range. If the coolant takes too long to warm up or stays below the set threshold, P0128 is set. This usually points to a thermostat stuck open or a faulty coolant temperature sensor.',
    description_ar: 'يعني كود P0128 أن المحرك لا يصل إلى درجة حرارة التشغيل المناسبة أو لا يحافظ عليها كما ينظمها الثرموستات.',
    description_fr: 'Le code P0128 signifie que le moteur n\'atteint pas ou ne maintient pas la bonne température de fonctionnement régulée par le thermostat.',
    causes_en: ['Thermostat stuck open', 'Faulty coolant temperature sensor', 'Low coolant level', 'Radiator cap failure'],
    causes_ar: ['ترموستات عالق مفتوحاً', 'حساس درجة حرارة سائل التبريد المعطل', 'مستوى منخفض لسائل التبريد', 'فشل غطاء الرديتر'],
    causes_fr: ['Thermostat bloqué ouvert', 'Capteur de température de liquide défectueux', 'Niveau de liquide bas', 'Bouchon de radiateur défaillant'],
    related: ['P0115', 'P0116', 'P0117', 'P0118'],
  },
  P0420: {
    name_en: 'Catalyst System Efficiency Below Threshold (Bank 1)',
    name_ar: 'كفاءة نظام المحول الحفازي أقل من الحد المطلوب',
    name_fr: 'Efficacité du catalyseur sous le seuil (Banque 1)',
    severity: 'moderate',
    description_en: 'The P0420 code is triggered when the catalytic converter on Bank 1 is not operating at the expected efficiency level. The ECM monitors the oxygen sensor readings before and after the catalytic converter. When the converter is working properly, the downstream sensor should show a relatively stable signal. P0420 means the catalyst is aging or damaged and no longer effectively reducing emissions.',
    description_ar: 'يتم تشغيل كود P0420 عندما لا يعمل المحول الحفازي في الضفة 1 بمستوى الكفاءة المتوقع.',
    description_fr: 'Le code P0420 est déclenché lorsque le catalyseur de la Banque 1 ne fonctionne pas au niveau d\'efficacité attendu.',
    causes_en: ['Failing catalytic converter', 'Faulty downstream oxygen sensor', 'Engine misfire damaging catalyst', 'Oil burning into exhaust'],
    causes_ar: ['محول حفازي معطل', 'حساس أكسجين خلفي معطل', 'إطلاق خاطئ يتلف المحول', 'احتراق زيت في العادم'],
    causes_fr: ['Convertisseur catalytique défaillant', 'Sonde lambda aval défectueuse', 'Raté d\'allumage endommagant le catalyseur', 'Huile brûlant dans l\'échappement'],
    related: ['P0421', 'P0430', 'P0431'],
  },
  P0401: {
    name_en: 'Exhaust Gas Recirculation Flow Insufficient',
    name_ar: 'تدفق غاز العادم المُعاد تدويره غير كافٍ',
    name_fr: 'Débit de recirculation des gaz d\'échappement insuffisant',
    severity: 'moderate',
    description_en: 'The P0401 code indicates that the Exhaust Gas Recirculation (EGR) system is not flowing enough exhaust gas back into the intake manifold. The EGR system reduces NOx emissions by recirculating a portion of exhaust gas. When the ECM commands EGR flow and detects insufficient flow via the MAP sensor or EGR position sensor, P0401 is set.',
    description_ar: 'يشير كود P0401 إلى أن نظام إعادة تدوير غاز العادم لا يعيد تدوير كميات كافية من غاز العادم إلى مشعب السحب.',
    description_fr: 'Le code P0401 indique que le système EGR ne fait pas recirculer suffisamment de gaz d\'échappement dans le collecteur d\'admission.',
    causes_en: ['Clogged EGR valve', 'Faulty EGR valve solenoid', 'Blocked EGR passages', 'Faulty differential pressure sensor'],
    causes_ar: ['صمام EGR مسدود', 'ملف صمام EGR المعطل', 'مجاري EGR المسدودة', 'حساس ضغط تفاضلي معطل'],
    causes_fr: ['Vanne EGR bouchée', 'Solénoïde EGR défectueux', 'Passages EGR bloqués', 'Capteur de pression différentiel défectueux'],
    related: ['P0400', 'P0402', 'P0403', 'P0404'],
  },
  P0335: {
    name_en: 'Crankshaft Position Sensor A Circuit Malfunction',
    name_ar: 'عطل في دائرة حساس موضع عمود المرفق A',
    name_fr: 'Dysfonctionnement du circuit capteur de position vilebrequin A',
    severity: 'critical',
    description_en: 'The P0335 code means the ECM is not receiving a valid signal from the crankshaft position sensor (CKP). This sensor is critical as it tells the ECM the rotational speed and position of the crankshaft, which is essential for ignition timing and fuel injection. Without this signal, the engine may not start or will stall immediately.',
    description_ar: 'يعني كود P0335 أن ECM لا يتلقى إشارة صالحة من حساس موضع عمود المرفق. هذا الحساس أساسي لأنه يخبر ECM بسرعة وموضع عمود المرفق.',
    description_fr: 'Le code P0335 signifie que l\'ECM ne reçoit pas de signal valide du capteur de position du vilebrequin (CKP). Ce capteur est critique car il indique la vitesse de rotation et la position du vilebrequin.',
    causes_en: ['Faulty crankshaft position sensor', 'Damaged reluctor ring', 'Wiring harness damage', 'ECM failure'],
    causes_ar: ['حساس موضع عمود المرفق المعطل', 'حلقة الشدة التالفة', 'تلف تلبيسة الأسلاك', 'فشل ECM'],
    causes_fr: ['Capteur de position vilebrequin défectueux', 'Couronne phonique endommagée', 'Câblage endommagé', 'Défaillance ECM'],
    related: ['P0336', 'P0337', 'P0338', 'P0339'],
  },
  P0113: {
    name_en: 'Intake Air Temperature Sensor Circuit High Input',
    name_ar: 'إدخال مرتفع في دائرة حساس درجة حرارة هواء السحب',
    name_fr: 'Signal élevé du capteur de température d\'air d\'admission',
    severity: 'minor',
    description_en: 'The P0113 code is triggered when the ECM detects a high voltage signal (above 4.91 volts typically) from the Intake Air Temperature (IAT) sensor. The IAT sensor measures the temperature of air entering the intake manifold. A high voltage usually indicates an open circuit in the sensor or wiring, causing the ECM to read an unrealistically cold temperature.',
    description_ar: 'يتم تشغيل كود P0113 عندما يكتشف ECM إشارة فولتية عالية من حساس درجة حرارة هواء السحب (IAT).',
    description_fr: 'Le code P0113 est déclenché lorsque l\'ECM détecte un signal de tension élevé du capteur de température de l\'air d\'admission (IAT).',
    causes_en: ['Faulty IAT sensor', 'Open circuit in sensor wiring', 'Poor sensor connector', 'ECM issue'],
    causes_ar: ['حساس IAT معطل', 'دائرة مفتوحة في أسلاك الحساس', 'موصل حساس رديء', 'مشكلة في ECM'],
    causes_fr: ['Capteur IAT défectueux', 'Circuit ouvert dans le câblage', 'Mauvais connecteur', 'Problème ECM'],
    related: ['P0110', 'P0111', 'P0112', 'P0114'],
  },
  P0011: {
    name_en: 'Camshaft Position Timing Over-Advanced (Bank 1)',
    name_ar: 'توقيت موضع عمود الكامة متقدم جداً - الضفة 1',
    name_fr: 'Calage arbre à cames trop avancé (Banque 1)',
    severity: 'moderate',
    description_en: 'The P0011 code means the intake camshaft on Bank 1 is more advanced than what the ECM has commanded. This is related to Variable Valve Timing (VVT) systems. The camshaft timing affects engine performance, fuel economy, and emissions. An over-advanced condition can cause rough idle, poor fuel economy, and a rattling noise from the engine.',
    description_ar: 'يعني كود P0011 أن عمود الكامة للسحب في الضفة 1 أكثر تقدماً مما أمر به ECM. يتعلق هذا بأنظمة توقيت الصمام المتغير.',
    description_fr: 'Le code P0011 signifie que l\'arbre à cames d\'admission de la Banque 1 est plus avancé que ce que l\'ECM a commandé. Cela est lié aux systèmes VVT.',
    causes_en: ['Low engine oil level or pressure', 'Dirty oil sludge in VVT system', 'Faulty oil control valve (OCV)', 'Timing chain stretched'],
    causes_ar: ['مستوى أو ضغط زيت المحرك منخفض', 'ترسبات زيت متسخة في نظام VVT', 'صمام التحكم في الزيت (OCV) المعطل', 'سلسلة التوقيت ممتدة'],
    causes_fr: ['Niveau ou pression d\'huile moteur faible', 'Dépôts de boue dans le système VVT', 'Electrovanne de contrôle d\'huile (OCV) défectueuse', 'Chaîne de distribution étirée'],
    related: ['P0010', 'P0012', 'P0013', 'P0014'],
  },
  B0001: {
    name_en: 'Airbag Deployment Circuit Malfunction',
    name_ar: 'عطل في دائرة نشر الوسادة الهوائية',
    name_fr: 'Dysfonctionnement du circuit de déploiement de l\'airbag',
    severity: 'critical',
    description_en: 'The B0001 code is a body code indicating a malfunction in the airbag deployment circuit. This typically refers to the driver\'s frontal airbag squib circuit. A fault in this circuit means the airbag may not deploy in an accident or could deploy unexpectedly. This is a serious safety concern and should be addressed immediately by a qualified technician.',
    description_ar: 'كود B0001 هو كود هيكلي يشير إلى عطل في دائرة نشر الوسادة الهوائية. يعد هذا مصدر قلق أمني خطير يجب معالجته فوراً.',
    description_fr: 'Le code B0001 est un code carrosserie indiquant un dysfonctionnement dans le circuit de déploiement de l\'airbag. C\'est une préoccupation sécuritaire grave.',
    causes_en: ['Faulty airbag squib', 'Damaged airbag wiring', 'Faulty airbag clock spring', 'Defective airbag module'],
    causes_ar: ['فتيلة وسادة هوائية معطلة', 'أسلاك وسادة هوائية تالفة', 'زنبرك ساعة وسادة هوائية معطل', 'وحدة وسادة هوائية معيبة'],
    causes_fr: ['Squib d\'airbag défectueux', 'Câblage d\'airbag endommagé', 'Ressort spirale d\'airbag défectueux', 'Module d\'airbag défectueux'],
    related: ['B0002', 'B0010', 'B0020', 'B0051'],
  },
};

export const MOST_SEARCHED_CODES = [
  'P0300', 'P0171', 'P0128', 'P0420', 'P0401',
  'P0087', 'P0335', 'P0113', 'P0011', 'B0001',
];

export const BRANDS = [
  'toyota', 'honda', 'hyundai', 'kia', 'nissan',
  'renault', 'peugeot', 'mercedes', 'bmw', 'ford',
];

export const BRAND_CODES: Record<string, string[]> = {
  toyota: ['P0171', 'P0301', 'P0420', 'P0128', 'P0335', 'P0011', 'P0441', 'P0505', 'C0040', 'U0100'],
  honda: ['P0300', 'P0420', 'P0171', 'P0401', 'P0128', 'P0113', 'P0302', 'P0440', 'P0715', 'U0101'],
  hyundai: ['P0087', 'P0300', 'P0171', 'P0420', 'P0128', 'P0335', 'P0011', 'P0507', 'B0001', 'U0121'],
  kia: ['P0087', 'P0300', 'P0171', 'P0420', 'P0128', 'P0011', 'P0335', 'P0441', 'B0001', 'U0121'],
  nissan: ['P0300', 'P0171', 'P0420', 'P0335', 'P0128', 'P0101', 'P0441', 'P0507', 'C0045', 'U0100'],
  renault: ['P0087', 'P0300', 'P0401', 'P0171', 'P0420', 'P0128', 'P0113', 'P0505', 'B0001', 'U0001'],
  peugeot: ['P0087', 'P0300', 'P0401', 'P0171', 'P0420', 'P0128', 'P0113', 'P0505', 'B0001', 'U0001'],
  mercedes: ['P0300', 'P0171', 'P0420', 'P0335', 'P0128', 'P0011', 'P0441', 'P0600', 'B0010', 'U0140'],
  bmw: ['P0300', 'P0171', 'P0420', 'P0335', 'P0128', 'P0011', 'P0441', 'P0600', 'B0010', 'U0140'],
  ford: ['P0087', 'P0300', 'P0171', 'P0420', 'P0128', 'P0335', 'P0401', 'P0505', 'B0001', 'U0100'],
};

export function getDTCStaticData(code: string) {
  return DTC_STATIC_DATA[code.toUpperCase()] ?? null;
}

export function isValidDTC(code: string): boolean {
  return /^[PBCU]\d{4}$/i.test(code);
}

export function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical': return 'text-red-400 bg-red-900/30 border-red-700';
    case 'moderate': return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
    case 'minor': return 'text-green-400 bg-green-900/30 border-green-700';
    default: return 'text-gray-400 bg-gray-900/30 border-gray-700';
  }
}
