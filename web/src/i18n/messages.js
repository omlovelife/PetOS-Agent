/** @typedef {typeof messages['zh-CN']} Messages */

export const SITE_URL = 'https://petos.lifemindx.com'

export const LOCALES = /** @type {const} */ (['zh-CN', 'zh-TW', 'en', 'ja', 'ko'])

export const DEFAULT_LOCALE = 'zh-CN'

/** @type {Record<string, { path: string, htmlLang: string, ogLocale: string, hreflang: string, label: string, font: string }>} */
export const LOCALE_META = {
  'zh-CN': {
    path: '/',
    htmlLang: 'zh-CN',
    ogLocale: 'zh_CN',
    hreflang: 'zh-Hans',
    label: '简体中文',
    font: 'sc',
  },
  'zh-TW': {
    path: '/zh-TW/',
    htmlLang: 'zh-TW',
    ogLocale: 'zh_TW',
    hreflang: 'zh-Hant',
    label: '繁體中文',
    font: 'tc',
  },
  en: {
    path: '/en/',
    htmlLang: 'en',
    ogLocale: 'en_US',
    hreflang: 'en',
    label: 'English',
    font: 'en',
  },
  ja: {
    path: '/ja/',
    htmlLang: 'ja',
    ogLocale: 'ja_JP',
    hreflang: 'ja',
    label: '日本語',
    font: 'ja',
  },
  ko: {
    path: '/ko/',
    htmlLang: 'ko',
    ogLocale: 'ko_KR',
    hreflang: 'ko',
    label: '한국어',
    font: 'ko',
  },
}

/** @type {Record<string, Messages>} */
export const messages = {
  'zh-CN': {
    metaTitle: 'PetOS · 成长陪伴的 AI 宠物 Agent',
    metaDescription:
      'PetOS：成长陪伴的 AI 宠物 Agent。常驻桌面、自主成长、本地记忆，越相处越懂你。支持 Windows 与 macOS。',
    metaKeywords: 'PetOS,桌面宠物,AI Agent,桌面宠物Agent,成长陪伴,本地记忆,电子宠物',
    ogTitle: 'PetOS · 成长陪伴的 AI 宠物 Agent',
    ogDescription: '常驻桌面的 AI 宠物 Agent。自主成长、记住相处，越陪越懂你。',
    skipLink: '跳到主要内容',
    brandHome: 'PetOS 首页',
    navGrow: '成长陪伴',
    navFeatures: '能力',
    navStart: '开始',
    navDownload: '下载',
    langLabel: '语言',
    heroTitle: '成长陪伴的 AI 宠物 Agent',
    heroLead:
      '常驻桌面，陪着你一起长大。自主活动、记住相处，越陪越懂你；密钥与记忆默认留在本机。',
    downloadWin: '下载 Windows',
    downloadMac: '下载 macOS',
    downloadLoading: '正在从 GitHub 获取最新版本…',
    downloadReady: '已从 GitHub 获取最新 {version}，点击直接下载安装包',
    downloadMissing: '暂未找到安装包，请稍后再试',
    downloadFailed: '获取最新版本失败，将打开发布页作为备选',
    growTitle: '成长，是相处出来的',
    growLead:
      'PetOS 把桌面宠物做成会成长的 AI Agent：它会陪着你活动、说话、安静，并把每一次相处写进本地记忆。',
    growItem1Title: '陪伴在侧',
    growItem1Body: '透明置顶常驻桌面。走走停停、点点摸摸，像一只真正待在你身边的小伙伴。',
    growItem2Title: '自主成长',
    growItem2Body: '对话与经历按宠物隔离保存。相处越久，回应越贴近「你的那一只」。',
    growItem3Title: '安静懂你',
    growItem3Body: '专注模式、勿扰时段、话唠程度可调。番茄钟进行时它会收敛存在感。',
    featuresTitle: '桌面宠物系统',
    featuresLead: '围绕成长与陪伴展开：存在感、互动、记忆，以及你对自己数据的控制。',
    spotlightTitle: '始终是宠物，陪着你长大',
    spotlightBody:
      '桌面气泡是唯一聊天入口。它以宠物身份回应，不跳出人设，陪伴感来自相处，而不是通用问答。',
    feature1Title: '常驻陪伴',
    feature1Body: '透明置顶、可拖动互动。没有突兀的任务栏入口，像贴在桌面上的小生命。',
    feature2Title: '本地成长记忆',
    feature2Body: '密钥与记忆默认只存在本机。联网能力由你显式配置，PetOS 不提供模型服务。',
    feature3Title: '自备模型',
    feature3Body: '填入 OpenAI 兼容的 Base URL、Key 与模型名，即可开始对话与成长。',
    feature4Title: '选你的伙伴',
    feature4Body: '内置默认伙伴，也可从 Petdex 或本地文件夹导入。每只宠物有独立记忆空间。',
    startTitle: '开始陪伴',
    step1Title: '安装',
    step1Body: '下载最新安装包，装好后打开即可。',
    step2Title: '选宠物',
    step2Body: '使用默认伙伴，或导入你喜欢的形象与设定。',
    step3Title: '开始相处',
    step3Body: '配置自己的 API，和它说话、陪伴，让它慢慢长大。',
    footerTagline: '成长陪伴的 AI 宠物 Agent。',
    footerLatest: '最新',
    footerContact: '联系',
    footerEmailLabel: '邮箱',
    footerNotes: '说明',
    footerNote1: '需自备大模型 API',
    footerNote2: '密钥与宠物数据默认仅存本机',
    footerDisclaimer: '使用第三方 API 时请遵守对应服务条款与当地法规。',
    navAria: '页面导航',
  },
  'zh-TW': {
    metaTitle: 'PetOS · 成長陪伴的 AI 寵物 Agent',
    metaDescription:
      'PetOS：成長陪伴的 AI 寵物 Agent。常駐桌面、自主成長、本地記憶，越相處越懂你。支援 Windows 與 macOS。',
    metaKeywords: 'PetOS,桌面寵物,AI Agent,桌面寵物Agent,成長陪伴,本地記憶,電子寵物',
    ogTitle: 'PetOS · 成長陪伴的 AI 寵物 Agent',
    ogDescription: '常駐桌面的 AI 寵物 Agent。自主成長、記住相處，越陪越懂你。',
    skipLink: '跳到主要內容',
    brandHome: 'PetOS 首頁',
    navGrow: '成長陪伴',
    navFeatures: '能力',
    navStart: '開始',
    navDownload: '下載',
    langLabel: '語言',
    heroTitle: '成長陪伴的 AI 寵物 Agent',
    heroLead:
      '常駐桌面，陪著你一起長大。自主活動、記住相處，越陪越懂你；金鑰與記憶預設留在本機。',
    downloadWin: '下載 Windows',
    downloadMac: '下載 macOS',
    downloadLoading: '正在從 GitHub 取得最新版本…',
    downloadReady: '已從 GitHub 取得最新 {version}，點擊即可下載安裝包',
    downloadMissing: '暫未找到安裝包，請稍後再試',
    downloadFailed: '取得最新版本失敗，將打開發布頁作為備選',
    growTitle: '成長，是相處出來的',
    growLead:
      'PetOS 把桌面寵物做成會成長的 AI Agent：它會陪著你活動、說話、安靜，並把每一次相處寫進本地記憶。',
    growItem1Title: '陪伴在側',
    growItem1Body: '透明置頂常駐桌面。走走停停、點點摸摸，像一隻真正待在你身邊的小夥伴。',
    growItem2Title: '自主成長',
    growItem2Body: '對話與經歷按寵物隔離保存。相處越久，回應越貼近「你的那一隻」。',
    growItem3Title: '安靜懂你',
    growItem3Body: '專注模式、勿擾時段、話癆程度可調。番茄鐘進行時它會收斂存在感。',
    featuresTitle: '桌面寵物系統',
    featuresLead: '圍繞成長與陪伴展開：存在感、互動、記憶，以及你對自己資料的控制。',
    spotlightTitle: '始終是寵物，陪著你長大',
    spotlightBody:
      '桌面氣泡是唯一聊天入口。它以寵物身分回應，不跳出人設，陪伴感來自相處，而不是通用問答。',
    feature1Title: '常駐陪伴',
    feature1Body: '透明置頂、可拖動互動。沒有突兀的工作列入口，像貼在桌面上的小生命。',
    feature2Title: '本地成長記憶',
    feature2Body: '金鑰與記憶預設只存在本機。連網能力由你明確設定，PetOS 不提供模型服務。',
    feature3Title: '自備模型',
    feature3Body: '填入 OpenAI 相容的 Base URL、Key 與模型名，即可開始對話與成長。',
    feature4Title: '選你的夥伴',
    feature4Body: '內建預設夥伴，也可從 Petdex 或本機資料夾匯入。每隻寵物有獨立記憶空間。',
    startTitle: '開始陪伴',
    step1Title: '安裝',
    step1Body: '下載最新安裝包，裝好後打開即可。',
    step2Title: '選寵物',
    step2Body: '使用預設夥伴，或匯入你喜歡的形象與設定。',
    step3Title: '開始相處',
    step3Body: '設定自己的 API，和它說話、陪伴，讓它慢慢長大。',
    footerTagline: '成長陪伴的 AI 寵物 Agent。',
    footerLatest: '最新',
    footerContact: '聯絡',
    footerEmailLabel: '信箱',
    footerNotes: '說明',
    footerNote1: '需自備大模型 API',
    footerNote2: '金鑰與寵物資料預設僅存本機',
    footerDisclaimer: '使用第三方 API 時請遵守對應服務條款與當地法規。',
    navAria: '頁面導覽',
  },
  en: {
    metaTitle: 'PetOS · An AI Pet Agent That Grows With You',
    metaDescription:
      'PetOS is a desktop AI pet agent for growth and companionship. Always on your desk, local memory by default, bring your own model. Windows and macOS.',
    metaKeywords:
      'PetOS,desktop pet,AI agent,desktop pet agent,companionship,local memory,virtual pet',
    ogTitle: 'PetOS · An AI Pet Agent That Grows With You',
    ogDescription:
      'A desktop AI pet agent that lives on your desk, remembers your time together, and grows with you.',
    skipLink: 'Skip to main content',
    brandHome: 'PetOS home',
    navGrow: 'Growth',
    navFeatures: 'Features',
    navStart: 'Start',
    navDownload: 'Download',
    langLabel: 'Language',
    heroTitle: 'An AI pet agent that grows with you',
    heroLead:
      'Always on your desk. It moves on its own, remembers your time together, and gets closer to you. Keys and memory stay on your device by default.',
    downloadWin: 'Download Windows',
    downloadMac: 'Download macOS',
    downloadLoading: 'Fetching the latest release from GitHub…',
    downloadReady: 'Latest {version} from GitHub is ready. Click to download the installer.',
    downloadMissing: 'No installer found. Please try again later.',
    downloadFailed: 'Could not fetch the latest release. Opening the releases page instead.',
    growTitle: 'Growth comes from time together',
    growLead:
      'PetOS turns a desktop pet into a growing AI agent. It stays with you, talks when it should, stays quiet when you focus, and writes every moment into local memory.',
    growItem1Title: 'By your side',
    growItem1Body:
      'Always-on, transparent, and draggable. It wanders, pauses, and reacts like a real companion on your desk.',
    growItem2Title: 'Grows with you',
    growItem2Body:
      'Chats and memories are isolated per pet. The longer you stay together, the more it feels like yours.',
    growItem3Title: 'Quiet when needed',
    growItem3Body:
      'Focus mode, quiet hours, and adjustable chatter. During a pomodoro it keeps a lower profile.',
    featuresTitle: 'A desktop pet system',
    featuresLead:
      'Built around growth and companionship: presence, interaction, memory, and control of your own data.',
    spotlightTitle: 'Always a pet, growing with you',
    spotlightBody:
      'The desktop bubble is the only chat entry. It answers in character, so companionship comes from living together, not generic Q&A.',
    feature1Title: 'Always present',
    feature1Body:
      'Transparent and topmost, with drag and play. No blunt taskbar icon, just a small life on your desk.',
    feature2Title: 'Local growth memory',
    feature2Body:
      'Keys and memory stay on your machine by default. Networking is opt-in. PetOS does not provide model hosting.',
    feature3Title: 'Bring your own model',
    feature3Body:
      'Add an OpenAI-compatible Base URL, key, and model name to start chatting and growing together.',
    feature4Title: 'Choose your partner',
    feature4Body:
      'Start with a built-in companion, or import from Petdex or a local folder. Each pet has its own memory space.',
    startTitle: 'Start the companionship',
    step1Title: 'Install',
    step1Body: 'Download the latest installer, install it, and open the app.',
    step2Title: 'Pick a pet',
    step2Body: 'Use the default companion, or import the look and settings you like.',
    step3Title: 'Grow together',
    step3Body: 'Add your own API, talk with it, keep it company, and let it grow over time.',
    footerTagline: 'An AI pet agent for growth and companionship.',
    footerLatest: 'Latest',
    footerContact: 'Contact',
    footerEmailLabel: 'Email',
    footerNotes: 'Notes',
    footerNote1: 'Bring your own LLM API',
    footerNote2: 'Keys and pet data stay local by default',
    footerDisclaimer:
      'When using third-party APIs, follow their terms of service and local laws.',
    navAria: 'Page navigation',
  },
  ja: {
    metaTitle: 'PetOS · 成長と寄り添いの AI ペット Agent',
    metaDescription:
      'PetOS はデスクトップに常駐する AI ペット Agent。自律的に動き、一緒に過ごした記憶を端末に残します。Windows / macOS 対応。',
    metaKeywords: 'PetOS,デスクトップペット,AI Agent,成長,寄り添い,ローカルメモリ,仮想ペット',
    ogTitle: 'PetOS · 成長と寄り添いの AI ペット Agent',
    ogDescription:
      'デスクに常駐する AI ペット Agent。一緒に過ごすほど、あなたに寄り添って成長します。',
    skipLink: 'メインコンテンツへ',
    brandHome: 'PetOS ホーム',
    navGrow: '成長と寄り添い',
    navFeatures: '機能',
    navStart: 'はじめる',
    navDownload: 'ダウンロード',
    langLabel: '言語',
    heroTitle: '成長と寄り添いの AI ペット Agent',
    heroLead:
      'デスクに常駐し、一緒に育ちます。自分で動き、過ごした時間を覚え、鍵と記憶は既定で端末内に残ります。',
    downloadWin: 'Windows をダウンロード',
    downloadMac: 'macOS をダウンロード',
    downloadLoading: 'GitHub から最新版を取得中…',
    downloadReady: 'GitHub から最新 {version} を取得しました。クリックでインストーラーをダウンロード',
    downloadMissing: 'インストーラーが見つかりません。後でもう一度お試しください。',
    downloadFailed: '最新版の取得に失敗しました。リリースページを開きます。',
    growTitle: '成長は、一緒に過ごす時間から',
    growLead:
      'PetOS はデスクトップペットを、成長する AI Agent にします。そばで動き、話し、静かにし、すべての時間をローカル記憶へ残します。',
    growItem1Title: 'そばにいる',
    growItem1Body:
      '透過・最前面で常駐。歩いたり、止まったり、触れる反応があり、本当にそばにいる相棒のようです。',
    growItem2Title: '自律的に成長',
    growItem2Body:
      '会話と経験はペットごとに分離保存。一緒にいるほど、「あなたの一匹」に近づきます。',
    growItem3Title: '静かに理解する',
    growItem3Body:
      '集中モード、おやすみ時間、おしゃべり度を調整可能。ポモドーロ中は存在感を抑えます。',
    featuresTitle: 'デスクトップペットシステム',
    featuresLead: '成長と寄り添いを軸に、存在感・対話・記憶・データの主導権を組み立てています。',
    spotlightTitle: 'いつもペットとして、一緒に育つ',
    spotlightBody:
      'デスクトップの吹き出しが唯一のチャット入口。キャラクターとして応答し、寄り添いは汎用 Q&A ではなく、一緒に過ごす時間から生まれます。',
    feature1Title: '常駐の寄り添い',
    feature1Body:
      '透過・最前面、ドラッグして触れ合えます。唐突なタスクバー入口はなく、デスクに貼りついた小さな命のようです。',
    feature2Title: 'ローカル成長メモリ',
    feature2Body:
      '鍵と記憶は既定で端末内のみ。通信は明示的な設定時のみ。PetOS はモデル自体を提供しません。',
    feature3Title: '自分のモデルを使う',
    feature3Body:
      'OpenAI 互換の Base URL、Key、モデル名を入力すれば、会話と成長を始められます。',
    feature4Title: '相棒を選ぶ',
    feature4Body:
      '標準の相棒に加え、Petdex やローカルフォルダから読み込めます。ペットごとに独立した記憶空間があります。',
    startTitle: '寄り添いをはじめる',
    step1Title: 'インストール',
    step1Body: '最新のインストーラーをダウンロードして開くだけです。',
    step2Title: 'ペットを選ぶ',
    step2Body: '標準の相棒を使うか、好きな見た目と設定を読み込みます。',
    step3Title: '一緒に過ごす',
    step3Body: '自分の API を設定し、話し、寄り添い、ゆっくり成長させましょう。',
    footerTagline: '成長と寄り添いの AI ペット Agent。',
    footerLatest: '最新',
    footerContact: '連絡先',
    footerEmailLabel: 'メール',
    footerNotes: '注意',
    footerNote1: '大規模言語モデル API はご自身でご用意ください',
    footerNote2: '鍵とペットデータは既定で端末内のみ',
    footerDisclaimer: 'サードパーティ API を使う場合は、各利用規約と現地法令を守ってください。',
    navAria: 'ページナビ',
  },
  ko: {
    metaTitle: 'PetOS · 성장과 동행의 AI 펫 Agent',
    metaDescription:
      'PetOS는 데스크톱에 상주하는 AI 펫 Agent입니다. 스스로 움직이고, 함께한 기억을 기기에 남깁니다. Windows / macOS 지원.',
    metaKeywords: 'PetOS,데스크톱 펫,AI Agent,성장,동행,로컬 메모리,가상 펫',
    ogTitle: 'PetOS · 성장과 동행의 AI 펫 Agent',
    ogDescription: '책상 위에 상주하는 AI 펫 Agent. 함께할수록 더 당신답게 성장합니다.',
    skipLink: '본문으로 건너뛰기',
    brandHome: 'PetOS 홈',
    navGrow: '성장 동행',
    navFeatures: '기능',
    navStart: '시작',
    navDownload: '다운로드',
    langLabel: '언어',
    heroTitle: '성장과 동행의 AI 펫 Agent',
    heroLead:
      '데스크톱에 상주하며 함께 자랍니다. 스스로 움직이고 추억을 기억하며, 키와 기억은 기본적으로 기기에만 남습니다.',
    downloadWin: 'Windows 다운로드',
    downloadMac: 'macOS 다운로드',
    downloadLoading: 'GitHub에서 최신 버전을 가져오는 중…',
    downloadReady: 'GitHub에서 최신 {version}을(를) 가져왔습니다. 클릭하면 설치 파일을 다운로드합니다.',
    downloadMissing: '설치 파일을 찾지 못했습니다. 잠시 후 다시 시도해 주세요.',
    downloadFailed: '최신 버전을 가져오지 못했습니다. 릴리스 페이지로 이동합니다.',
    growTitle: '성장은 함께한 시간에서 옵니다',
    growLead:
      'PetOS는 데스크톱 펫을 성장하는 AI Agent로 만듭니다. 곁에서 움직이고, 대화하고, 집중할 때는 조용히 있으며, 모든 순간을 로컬 기억에 남깁니다.',
    growItem1Title: '곁에 머무름',
    growItem1Body:
      '투명 최상단으로 상주합니다. 걷고, 멈추고, 쓰다듬는 반응이 있어 진짜 곁의 친구 같습니다.',
    growItem2Title: '스스로 성장',
    growItem2Body:
      '대화와 경험은 펫별로 분리 저장됩니다. 함께할수록 「당신만의 그 아이」에 가까워집니다.',
    growItem3Title: '필요할 때 조용히',
    growItem3Body:
      '집중 모드, 방해 금지 시간, 수다 정도를 조절할 수 있습니다. 포모도로 중에는 존재감을 줄입니다.',
    featuresTitle: '데스크톱 펫 시스템',
    featuresLead: '성장과 동행을 중심으로 존재감, 상호작용, 기억, 데이터 주권을 구성합니다.',
    spotlightTitle: '언제나 펫으로, 함께 자랍니다',
    spotlightBody:
      '데스크톱 말풍선이 유일한 채팅 입구입니다. 캐릭터로 응답하므로 동행감은 범용 Q&A가 아니라 함께 지낸 시간에서 옵니다.',
    feature1Title: '상주 동행',
    feature1Body:
      '투명 최상단, 드래그 상호작용. 툭 튀는 작업 표시줄 진입 없이 책상 위 작은 생명처럼 보입니다.',
    feature2Title: '로컬 성장 기억',
    feature2Body:
      '키와 기억은 기본적으로 기기에만 남습니다. 네트워크는 명시적으로 설정할 때만. PetOS는 모델 호스팅을 제공하지 않습니다.',
    feature3Title: '내 모델 사용',
    feature3Body:
      'OpenAI 호환 Base URL, Key, 모델 이름을 입력하면 대화와 성장을 시작할 수 있습니다.',
    feature4Title: '파트너 선택',
    feature4Body:
      '기본 파트너를 쓰거나 Petdex·로컬 폴더에서 가져올 수 있습니다. 펫마다 독립된 기억 공간이 있습니다.',
    startTitle: '동행 시작하기',
    step1Title: '설치',
    step1Body: '최신 설치 파일을 받아 설치한 뒤 실행하면 됩니다.',
    step2Title: '펫 선택',
    step2Body: '기본 파트너를 쓰거나 좋아하는 모습과 설정을 가져옵니다.',
    step3Title: '함께 지내기',
    step3Body: '자신의 API를 설정하고 대화하며 동행하고, 천천히 성장하게 하세요.',
    footerTagline: '성장과 동행의 AI 펫 Agent.',
    footerLatest: '최신',
    footerContact: '연락',
    footerEmailLabel: '이메일',
    footerNotes: '안내',
    footerNote1: '대규모 언어 모델 API는 직접 준비해야 합니다',
    footerNote2: '키와 펫 데이터는 기본적으로 기기에만 저장',
    footerDisclaimer: '타사 API 사용 시 해당 약관과 현지 법령을 지켜 주세요.',
    navAria: '페이지 탐색',
  },
}

/**
 * @param {string} locale
 * @returns {Messages}
 */
export function getMessages(locale) {
  return messages[locale] || messages[DEFAULT_LOCALE]
}

/**
 * @param {string} template
 * @param {Record<string, string>} vars
 */
export function formatMessage(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '')
}
