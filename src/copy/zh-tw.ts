import type { IconName } from '@components/ui/icons/icons';

/**
 * 全站文案（繁體中文）。網站上看得到的文字幾乎都在這裡，
 * 依頁面分區：home（首頁）、activities、career、resources、partners、venues、recruit、about。
 *
 * - 有些字串含 HTML（例如 `<br />`、`<span class="...">`），用來換行或上色，可以保留或拿掉。
 * - 網址、名單等結構性資料在 `src/data_files/`；專案與活動內容在 `src/content/`。
 */
export const zhTw = {
  site: {
    /** 預設的 `<meta name="description">` */
    description:
      '國立臺灣大學工商管理學系系學會：籌辦工管系的系上活動、整理職涯與學習資源、管理系上教研教室，陪伴每一位工管人。',
    /** schema.org `WebSite.description` */
    descriptionShort: '國立臺灣大學工商管理學系系學會',
    ogTitle: '臺大工管系學會',
    ogDescription:
      '從小迎新、宿營到之夜，從職涯訪談到場地借用，工管系的大小事都在這裡。',
  },

  layout: {
    skipToContent: '跳至主要內容',
    toggleNavigation: '切換選單',
    darkTheme: '切換深色主題',
    lightTheme: '切換淺色主題',
    toggleTheme: '切換主題',
  },

  nav: {
    /** 導覽列文字，以 `@data/navigation` 的 id 對應 */
    labels: {
      home: '首頁',
      activities: '活動成果',
      career: '職涯發展',
      resources: '學習資源',
      partners: '合作夥伴',
      venues: '場地借用',
      about: '關於我們',
    },
    footer: {
      quickLinks: '快速連結',
      faq: '常見問題',
      contact: '聯絡我們',
      followUs: '追蹤我們',
      rights: '版權所有',
    },
  },

  banner: {
    dismiss: '關閉',
    region: '公告橫幅',
  },

  common: {
    learnMore: '了解更多',
    viewMore: '查看更多',
    readMore: '閱讀更多',
  },

  /** Google 登入（導覽列右上角） */
  auth: {
    signIn: '登入',
    signOut: '登出',
    admin: '管理後台',
    roles: {
      member: '一般',
      student: '系上同學',
      admin: '管理員',
      super: '超級管理員',
    },
  },

  /** 管理後台（/admin，不在導覽列上，管理員登入後從右上角選單進入） */
  admin: {
    title: '管理後台',
    subTitle: '設定每個人的角色。新登入的人一律是「一般」，核准後改成「系上同學」才能線上預約。',
    signInFirst: '請先登入管理員帳號。',
    noPermission: '只有管理員可以使用這個頁面。',
    notConfigured: '尚未設定 Firebase，請先依照 FIREBASE.md 完成設定。',
    search: '搜尋姓名或信箱',
    filterAll: '全部',
    name: '姓名',
    email: '信箱',
    role: '角色',
    joined: '第一次登入',
    you: '（你）',
    empty: '沒有符合的使用者。',
    saved: '已更新',
    saveFailed: '更新失敗，請重新整理後再試一次。',
  },

  notFound: {
    title: '找不到頁面',
    subTitle: '糟糕，這個頁面不存在！',
    content: '你要找的頁面可能已經移除或改名了，先回首頁看看吧。',
    goHome: '回到首頁',
    goBack: '返回上一頁',
  },

  /** 常見問題：首頁與關於我們頁共用 */
  faq: {
    title: '常見<br />問題',
    subTitle: '關於系學會、系上活動與系上空間的常見問題。',
    faqs: [
      {
        question: '系學會是什麼？',
        answer:
          '系學會是由工管系同學組成的學生自治組織，負責籌辦系上活動、整理職涯與學習資源、管理系上的教研教室，也是同學與系上之間溝通的橋樑。',
      },
      {
        question: '系上的活動要怎麼參加？',
        answer:
          '各項活動的報名方式與時間都會公告在系學會 IG（@ntubasa_），也可以在「活動成果」頁看到每個活動的介紹與連結。',
      },
      {
        question: '怎麼成為系學會幹部？',
        answer:
          '每年會招募新一屆幹部，歡迎工管系同學報名。招募時程與方式請見「關於我們」頁最下方的招募資訊，或留意 IG 公告。',
      },
      {
        question: '系上的教室可以借嗎？',
        answer:
          '可以。管理學院教研館 103、105、108、110 教室開放工管系同學借用，105 的三張討論桌也能分開借，詳細辦法請見「場地借用」頁。',
      },
      {
        question: '刷學生證進不去系上空間怎麼辦？',
        answer:
          '請私訊系學會 IG，系學會會立即請系辦助教協助處理。',
      },
      {
        question: '有其他問題要找誰？',
        answer:
          '歡迎私訊系學會 IG（@ntubasa_），或寄信到 ntubassgoo@gmail.com，我們會盡快回覆。',
      },
    ],
  },

  home: {
    banner: {
      text: '系學會幹部招募中！',
      btn: '查看招募資訊',
    },
    hero: {
      title:
        '工管人的大學生活，<br />從這裡開始',
      subTitle:
        '我們是國立臺灣大學工商管理學系系學會，籌辦系上大大小小的活動、整理職涯與學習資源，也管理系上的空間，陪伴每一位工管人走過大學四年。',
      primaryBtn: '看看我們的活動',
      secondaryBtn: '加入系學會',
    },
    mission: {
      title: '系學會在做什麼',
      body: '系學會是工管系同學自己的組織。我們從開學前的小迎新一路辦到暑假的管理之鑰，整理各領域的職涯與學習資源，並管理系上的教研教室，讓每位同學都能在工管系找到歸屬，也找到方向。',
      /** 數字會依網站上的資料自動計算，這裡只寫說明文字 */
      statLabels: {
        activities: '項年度系上活動',
        departments: '個幹部部門',
        venues: '間系上教研教室',
        fields: '個領域的學習資源',
      },
    },
    values: {
      title: '我們重視的事',
      subTitle: '這是系學會想帶給每位工管人的三件事。',
      items: [
        {
          icon: 'community' as IconName,
          title: '凝聚',
          description:
            '透過迎新、宿營、系烤與之夜，讓不同年級的工管人彼此認識，在系上找到歸屬感。',
        },
        {
          icon: 'verified' as IconName,
          title: '服務',
          description:
            '管理系上的教研教室、處理同學的大小問題，當同學與系上之間的橋樑。',
        },
        {
          icon: 'sparks' as IconName,
          title: '成長',
          description:
            '整理職涯訪談、實習經驗與各領域的學習資源，陪大家找到自己的下一步。',
        },
      ],
    },
    events: {
      title: '活動成果',
      subTitle: '從迎新到之夜，系學會一整年的活動，點進去看介紹與相簿。',
      cta: '看所有活動',
    },
    team: {
      title: '現任幹部團隊',
      subTitle:
        '系學會由六個部門組成，分工負責財務、行政、學術、活動與行銷，讓系上的大小事順利運作。',
      cta: '認識所有幹部',
    },
  },

  career: {
    title: '職涯發展',
    metaDescription:
      '臺大工管系學會的職涯資源：職涯訪談、職涯講座、學長姐交流、實習與求職資源，以及實習申請經驗。',
    hero: {
      subTitle:
        '從認識產業、累積經驗到實際求職，系學會整理學長姐的經驗與各種資源，陪你找到自己的職涯方向。',
    },
    /** 手機版選單下方的小提示 */
    swipeHint: '左右滑動切換分類',
    /** 頁面上方的分類選單，id 對應下面各區塊 */
    sectionNav: [
      { id: 'interviews', label: '職涯訪談' },
      { id: 'talks', label: '職涯講座' },
      { id: 'mentorship', label: '學長姐交流' },
      { id: 'jobs', label: '實習與求職資源' },
      { id: 'internships', label: '實習申請經驗' },
    ],
    interviews: {
      title: '職涯訪談',
      subTitle:
        '我們訪談了在不同產業工作的工管系學長姐與業界前輩，聽他們分享職涯選擇、工作日常與給學弟妹的建議。',
      empty: '訪談整理中，敬請期待。',
    },
    talks: {
      title: '職涯講座',
      subTitle: '邀請不同產業的講者，分享第一線的工作日常與職涯選擇。',
      items: [
        {
          icon: 'user' as IconName,
          title: '業界講者分享',
          description:
            '邀請顧問、科技、金融、快速消費品等產業的講者，分享工作內容、入行準備與真實案例。',
        },
        {
          icon: 'chatBubble' as IconName,
          title: 'Coffee Chat',
          description:
            '講座結束後以小組形式與講者近距離交流，問出你最想知道的問題。',
        },
        {
          icon: 'earth' as IconName,
          title: '產業探索',
          description:
            '涵蓋不同產業與職能，幫助你在投入實習前，先認識各種職涯可能。',
        },
      ],
    },
    mentorship: {
      title: '學長姐交流',
      subTitle: '工管系有很多走在前面的學長姐，有人帶路，少走很多冤枉路。',
      items: [
        {
          icon: 'rocket' as IconName,
          title: '業界學長姐',
          description:
            '透過系學會牽線，向已經在業界工作的學長姐請教職涯規劃、產業選擇與求職準備。',
        },
        {
          icon: 'community' as IconName,
          title: '系上學長姐',
          description:
            '從選課、修課到實習申請，系上的學長姐都是最好的諮詢對象，歡迎多多交流。',
        },
      ],
    },
    jobs: {
      title: '實習與求職資源',
      subTitle: '在申請實習與工作前，先把準備做好。',
      items: [
        {
          icon: 'clipboard' as IconName,
          title: '履歷健檢',
          description: '請學長姐看看你的履歷，讓經歷說出重點。',
        },
        {
          icon: 'chatBubble' as IconName,
          title: '模擬面試',
          description: '個案面試與行為面試的練習，事先演練過，上場更有把握。',
        },
        {
          icon: 'checkCircle' as IconName,
          title: '實習機會分享',
          description: '校友與合作夥伴提供的實習職缺，會透過系學會社群公告。',
        },
      ],
    },
    internships: {
      title: '實習申請經驗',
      subTitle:
        '工管系學長姐把自己申請實習的過程整理成心得，從投遞履歷、筆試到面試，都是第一手的經驗。',
      /** 「你會看到」的清單 */
      highlights: [
        '各公司的申請時程與流程',
        '履歷撰寫與投遞的注意事項',
        '筆試、個案面試與行為面試題目',
        '錄取者的準備方式與心得',
      ],
      btn: '前往實習申請經驗分享',
      /**
       * 按鈕要連到的網址（Notion、Google 雲端硬碟、文章網址都可以），會用新分頁開啟。
       * 留空字串的話，按鈕會顯示「連結即將開放」且不能點。
       */
      url: '',
      comingSoon: '連結即將開放',
    },
  },

  resources: {
    title: '學習資源',
    metaDescription: '臺大工管系學會依領域整理的學習資源：管顧、金融、FMCG、科技與新創，以及考古題。',
    hero: {
      subTitle:
        '系學會依照不同領域整理了面試準備資源與講座筆記，點選下方的領域就能切換內容；考古題則整理在頁面最下方。',
    },
    linkLabel: '前往閱讀',
    /** 卡片是網站內文章時的按鈕 */
    articleLabel: '閱讀全文',
    comingSoon: '即將推出',
    /** 單篇資源文章頁 */
    article: {
      back: '返回學習資源',
      ogSection: '學習資源',
    },
    /** 考古題：獨立一塊，放在領域分頁下方；按鈕連到外部（例如 Google 雲端硬碟資料夾） */
    exams: {
      id: 'exams',
      title: '考古題',
      subTitle:
        '工管系學長姐整理的筆試與面試考古題，申請實習或工作前，先練過一輪再上場。',
      /** 「你會看到」的清單 */
      highlights: [
        '各公司筆試與線上測驗題型',
        '個案面試考古題',
        '行為面試常見問題',
        '參考解法與作答技巧',
      ],
      btn: '前往考古題',
      /**
       * 按鈕要連到的網址，會用新分頁開啟。
       * 留空字串的話，按鈕會顯示「連結即將開放」且不能點。
       */
      url: '',
      comingSoon: '連結即將開放',
    },
    /**
     * 依領域分區，順序就是頁面上的順序。要新增領域，複製一整個 `{ id, title, ... }` 區塊即可
     * （`id` 用英文，會變成頁面上的跳轉錨點，例如 /resources#finance）。
     * 每張卡片的 `url` 填連結（PDF、Notion、Google Drive、網頁都可以）；
     * 留空字串會顯示「即將推出」。
     */
    /**
     * 領域分頁，順序就是頁面上的順序。每個領域的資源卡片是 Markdown 檔，
     * 放在 `src/content/resources/zh-tw/`，用 `field` 對應這裡的 `id`。
     * 要新增領域：在這裡加一個 `{ id, title, subTitle }`，並把 `id` 加進
     * `src/content.config.ts` 的 `field` 清單。
     */
    /** 手機版選單下方的小提示 */
    swipeHint: '左右滑動切換領域',
    sections: [
      {
        id: 'consulting',
        title: '管顧',
        subTitle: '分析框架、Casebook 與顧問公司官方練習個案，準備個案面試從這裡開始。',
      },
      {
        id: 'finance',
        title: '金融',
        subTitle: '投資銀行、資產管理等金融職涯的面試題庫與準備資源。',
      },
      {
        id: 'fmcg',
        title: 'FMCG',
        subTitle: '快速消費品產業的儲備幹部計畫、線上測驗與面試準備。',
      },
      {
        id: 'tech',
        title: '科技',
        subTitle: '產品經理、業務開發與工程職缺的面試準備資源。',
      },
      {
        id: 'startup',
        title: '新創',
        subTitle: '想創業或加入新創團隊？從這些免費資源開始認識新創的世界。',
      },
    ],
  },

  /** 單一訪談頁（/interviews/xxx/）用的文字 */
  interviews: {
    ogSection: '職涯訪談',
    back: '返回職涯訪談',
    interviewee: '受訪者',
    writers: '訪談・撰文',
    moreTitle: '更多訪談',
  },

  venues: {
    title: '場地借用',
    metaDescription: '工管系管理學院教研館 103、105、108、110 教室的借用狀況、借用辦法與使用規範。',
    hero: {
      subTitle: '工管系在管理學院教研館有 103、105、108、110 四間教室，先看看哪些時段有空，再依照借用辦法登記。',
    },
    schedule: {
      title: '借用狀況',
      subTitle: '黃色是已被借用的時段，沒有標示的時間都可以借用。',
      prevWeek: '上一週',
      nextWeek: '下一週',
      thisWeek: '回到本週',
      today: '今天',
      free: '可借用',
      /** 借整間時，在每張討論桌那一行顯示的標示 */
      wholeRoom: '整間借用',
      allFree: '這天所有場地都可以借用',
      weekdays: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
      noscript: '請開啟瀏覽器的 JavaScript 功能，才能查看借用狀況。',
      loading: '讀取借用狀況中…',
      loadFailed: '借用狀況讀取失敗，請重新整理頁面。',
    },
    /** 線上預約（借用狀況上方的提示列與預約視窗） */
    booking: {
      bookBtn: '我要預約',
      signInHint: '工管系同學用 Google 帳號登入、經系學會核准後，就可以直接在這裡預約。',
      signInBtn: '用 Google 登入',
      pendingHint: '你的帳號還沒有核准為系上同學，請私訊系學會 IG 告知你的姓名與登入信箱。',
      readyHint: '點討論桌那幾行「可借用」的格子，或按右邊的按鈕預約討論桌。整間借用請私訊行政部長，由管理員登記。',
      /** 管理員看到的提示：可以登記整間借用，也可以代同學登記 */
      adminHint: '你是管理員，可以登記整間借用，也可以代同學預約；借用單位請填實際使用的人或單位。',
      daysAhead: '最多可預約 {n} 天內的時段。',
      dialogTitle: '預約場地',
      venue: '場地',
      table: '範圍',
      date: '日期',
      start: '開始時間',
      end: '結束時間',
      by: '借用單位或姓名',
      byPlaceholder: '例如：學術部、大二班代、王小明',
      purpose: '用途（選填）',
      purposePlaceholder: '例如：小組討論',
      submit: '確認預約',
      cancel: '取消',
      submitting: '預約中…',
      success: '預約成功！',
      remove: '取消預約',
      removeConfirm: '確定要取消這筆預約嗎？',
      removed: '已取消預約',
      errors: {
        required: '請填寫日期、時間與借用單位。',
        order: '結束時間要晚於開始時間。',
        past: '不能預約已經過去的時段。',
        tooFar: '只能預約 {n} 天內的時段。',
        tooLong: '這個場地單次最多借 {n} 小時。',
        wholeRoom: '整間借用需要由管理員登記，請私訊行政部長。',
        overlap: '這個時段已經有人預約了，請換一個時段。',
        failed: '預約失敗，請重新整理頁面後再試一次。',
      },
    },
    list: {
      title: '場地介紹',
      subTitle: '四間教室都在管理學院教研館。',
      location: '位置',
      capacity: '容納人數',
      equipment: '設備',
      /** 有討論桌的場地，卡片上顯示的說明 */
      tablesNote: '可以分開借用其中一張討論桌，也可以整間借用：',
    },
    /** 進入方式（場地介紹上方的提示框） */
    access: {
      title: '進入方式',
      text: '以工管系學生證即可刷開門禁。',
      help: '若刷卡被拒絕，請私訊系學會社群帳號，系學會會立即請系辦助教協助處理。',
      helpBtn: '私訊系學會 IG',
    },
    /** 借用辦法（依「工管系空間使用規章」） */
    howTo: {
      title: '借用辦法',
      subTitle: '依借用範圍分成兩種方式。',
      single: {
        title: '分區借用',
        tag: '單張桌子',
        items: [
          '教研 105 內設有 3 張桌子，可以分別借用',
          '系上同學登入後，直接在上方「借用狀況」線上預約即可，不需要申請表',
          '須至少有一名工管系學生，並由該名學生進行登記',
          '單次借用與使用時間上限為 3 小時',
        ],
      },
      whole: {
        title: '全間借用',
        tag: '整間教室',
        items: [
          '工管系本系活動：私訊行政部長登記即可',
          '本系活動以外：須事先填寫申請表，私訊繳交給行政部長審核',
        ],
        btn: '借用規範與申請表',
      },
    },
    /** 使用規範（依「工管系空間使用規章」） */
    rules: {
      title: '使用規範',
      subTitle: '請大家一起維護空間，讓每個人都用得舒服。',
      items: [
        '非工管系學生禁止進入，違者將請系辦協助註銷學生證權限',
        '進入教研 105 須脫鞋，並將鞋子整齊放好',
        '產生的垃圾務必在離開時一併帶走',
        '空間內的設備（影印機、電腦、桌椅等）為工管系財產，蓄意或使用不當造成損壞須負賠償責任',
        '請勿堆放私人物品，系學會有權將其移除',
        '若後續無人使用，離開前請關閉電燈與冷氣',
        '禁止在空間內打麻將',
      ],
    },
  },

  partners: {
    title: '合作夥伴',
    metaDescription: '支持臺大工管系學會活動的企業與組織，以及合作方式與聯絡窗口。',
    hero: {
      subTitle:
        '感謝這些夥伴支持工管系學會的活動，一起為工管系同學創造更多機會。',
    },
    logos: {
      title: '合作企業',
      subTitle: '曾贊助系學會活動，或與我們合作講座、參訪的企業與組織。',
    },
    ways: {
      title: '合作方式',
      subTitle: '我們歡迎各種形式的合作，也可以依需求討論。',
      items: [
        {
          icon: 'sparks' as IconName,
          title: '活動贊助',
          description:
            '贊助系學會的年度活動，例如宿營、之夜或管理之鑰，在工管系同學之間提升品牌能見度。',
        },
        {
          icon: 'user' as IconName,
          title: '講座與企業參訪',
          description:
            '派員分享產業與職涯經驗，或開放工管系同學參訪辦公室，提前認識未來的人才。',
        },
        {
          icon: 'checkCircle' as IconName,
          title: '實習與徵才資訊',
          description:
            '提供實習或正職職缺，由系學會透過社群轉達給工管系同學。',
        },
      ],
    },
    contact: {
      title: '邀請合作',
      description: '如果您有興趣與工管系學會合作，歡迎來信，我們會盡快回覆。',
      btn: '寄信給我們',
      /** 點按鈕後信件預設的主旨 */
      mailSubject: '合作邀約：臺大工管系學會',
    },
  },

  activities: {
    title: '活動成果',
    metaDescription:
      '臺大工管系學會一整年的活動：小迎新、宿營、系烤、杜鵑花節、之夜、期末聯歡與管理之鑰。',
    hero: {
      subTitle:
        '從開學前的小迎新到暑假的管理之鑰，一起回顧系學會這一年的活動。',
    },
    websiteBtn: '活動網站',
    photosBtn: '活動相簿',
    /** 連結還沒填時，滑鼠移到灰色按鈕上顯示的提示 */
    comingSoon: '連結即將開放',
    /** 照片輪播的按鈕（給螢幕閱讀器與滑鼠提示用） */
    prevPhoto: '上一張照片',
    nextPhoto: '下一張照片',
    photoPlaceholder: '活動照片',
  },

  /** 幹部招募（顯示在「關於我們」頁最下方） */
  recruit: {
    title: '加入系學會',
    faqTitle: '常見問題',
    metaDescription: '臺大工管系學會幹部招募：招募部門、報名方式與甄選流程。',
    hero: {
      subTitle:
        '想為工管系做點什麼、和一群夥伴一起把活動辦起來嗎？歡迎加入下一屆系學會幹部。',
      openBadge: '幹部招募中',
      closedBadge: '本屆幹部招募已結束，下一屆招募資訊將公布於系學會 IG',
      applyBtn: '立即報名',
    },
    why: {
      title: '為什麼加入系學會',
      items: [
        {
          icon: 'rocket' as IconName,
          title: '親手辦活動',
          description: '從企劃、預算到現場執行，實際辦一場活動的經驗。',
        },
        {
          icon: 'community' as IconName,
          title: '認識各屆工管人',
          description: '和不同年級的同學一起工作，交到一輩子的朋友。',
        },
        {
          icon: 'sparks' as IconName,
          title: '練習團隊合作',
          description: '在部門分工中學會溝通、協調與帶領團隊。',
        },
        {
          icon: 'verified' as IconName,
          title: '為系上服務',
          description: '讓工管系同學的大學生活因為你而更精彩。',
        },
      ],
    },
    criteria: {
      title: '招募資訊',
      items: [
        { label: '招募對象', value: '臺大工管系在學同學' },
        { label: '招募部門', value: '財務部、行政部、學術部、活動部、行銷部' },
        { label: '報名方式', value: '填寫線上報名表，並參加與現任幹部的面談' },
      ],
    },
    qualities: {
      title: '我們在找這樣的你',
      items: [
        '願意為系上同學服務',
        '有責任感，能準時完成工作',
        '樂於溝通與團隊合作',
        '對辦活動或部門工作有熱情',
      ],
    },
    timeline: {
      title: '招募流程',
      subTitle: '實際日期以系學會 IG 公告為準。',
      steps: [
        { date: 'STEP 1', title: '開放報名', description: '系學會 IG 公告招募，填寫線上報名表。' },
        { date: 'STEP 2', title: '報名截止', description: '確認報名資料，安排面談時段。' },
        { date: 'STEP 3', title: '面談', description: '與現任幹部聊聊你的想法與想加入的部門。' },
        { date: 'STEP 4', title: '公布結果', description: '通知錄取結果，歡迎加入新一屆系學會！' },
      ],
    },
    process: {
      title: '面談會聊什麼',
      steps: [
        {
          title: '認識你',
          description: '聊聊你的經驗、興趣，以及為什麼想加入系學會。',
        },
        {
          title: '想加入的部門',
          description: '了解你對各部門工作的想像，也會介紹每個部門實際在做什麼。',
        },
        {
          title: '你的問題',
          description: '對系學會有任何好奇，都歡迎在面談時直接問我們。',
        },
      ],
    },
  },

  about: {
    title: '關於我們',
    metaDescription: '認識國立臺灣大學工商管理學系系學會：我們做的事、一年的活動、現任幹部與幹部招募。',
    hero: {
      subTitle:
        '我們是國立臺灣大學工商管理學系系學會，由工管系同學組成，為大家籌辦活動、整理資源，也管理系上的空間。',
    },
    story: {
      title: '我們是誰',
      paragraphs: [
        '臺大工管系學會是工管系同學自己的學生組織。從迎接新生、凝聚系上感情，到整理職涯與學習資源，我們希望每位工管人都能在系上找到歸屬，也找到方向。',
        '系學會由正副會長與財務、行政、學術、活動、行銷五個部門組成，分工籌辦一整年的系上活動，並管理管理學院教研館的系上教室，也是同學與系辦之間溝通的橋樑。',
      ],
    },
    history: {
      title: '系學會的一年',
      items: [
        { year: '上學期', text: '小迎新、宿營、系烤，帶新生認識工管系。' },
        { year: '下學期', text: '杜鵑花節、之夜、期末聯歡，和全系一起留下回憶。' },
        { year: '暑假', text: '管理之鑰，為這一年畫下句點。' },
      ],
    },
    team: {
      title: '現任幹部',
      subTitle: '這一屆由正副會長與五個部門組成，每個部門各司其職。',
    },
    contact: {
      title: '聯絡我們',
      description: '活動合作、贊助邀約或任何問題，都歡迎來信或私訊系學會 IG。',
    },
  },
};
