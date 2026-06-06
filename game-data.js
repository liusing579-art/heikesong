const GAME_DATA = {
  metadata: {
    version: "2.0",
    name: `导员，你听我狡辩！——第一案：消失的晚自习`,
    author: `基于玩家剧本转换`,
    description: `辅导员与王离谱的斗智斗勇，包含多分支、变量追踪与隐藏结局。`
  },
  characters: [
    { id: "advisor", display_name: `陈老师`, default_portrait: "", color: "#ffffff" },
    { id: "wang", display_name: `王离谱`, default_portrait: "", color: "#ffcc88" },
    { id: "lisiran", display_name: `李思然`, default_portrait: "", color: "#aaddff" },
    { id: "narrator", display_name: `系统`, default_portrait: "", color: "#aaaaaa" },
    { id: "roommate", display_name: `室友`, default_portrait: "", color: "#99cc99" }
  ],
  initialVariables: {
    lipudicity: 85, blood_pressure: 95, acting: 75, authority: 50,
    first_choice: "", second_path: "", third_choice: "",
    fourth_choice: "", fifth_choice: "",
    assist_triggered: false, white_night_understood: false
  },
  timeline: [
    { type: "set_variable", set: [
      { name: "lipudicity", value: 85, operation: "=" },
      { name: "blood_pressure", value: 95, operation: "=" },
      { name: "acting", value: 75, operation: "=" },
      { name: "authority", value: 50, operation: "=" }
    ]},
    { type: "text", character: "wang",
      text: `导员！救命！我今晚的晚自习真上不了了！`,
      portrait: "",
      background: "office-bg.webp",
      bgm: "bgm happy.mp3",
      images: [
        { src: "wang.webp", class: "char-left" },
        { src: "intro-card.webp", class: "intro-right" }
      ] },
    { type: "text", character: "narrator",
      text: `（内心独白）又来了。每次开头都是"救命"，上次他说"救命"是因为宿舍的盆栽"失恋了"。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `导员，这次是真的有紧急情况。我今天下午在宿舍搞了一个小发明——'全自动逃课机器人'，本来是想让它帮我应付一下不太重要的课。结果不知道哪里出了问题，它觉醒了自我意识，现在把我反绑在椅子上了。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "narrator",
      text: `【系统提示】王离谱的离谱度：85%。他的语气听起来很急，但逻辑上明显有问题——一个机器人如何在宿舍里被制造出来而不被室友发现？`,
      background: "office-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "choice", text: `如何回应王离谱？`, choices: [
      { text: `正面硬刚：说人话，你又想编什么理由？`, goto_id: "first_round_A", set_variables: [
        { name: "blood_pressure", value: -5, operation: "+=" },
        { name: "lipudicity", value: -5, operation: "+=", max: 100, min: 0 },
        { name: "acting", value: -10, operation: "+=" }],
        set_flag: { first_choice: "A" }},
      { text: `假装关心：需要我叫保安或同事过去帮你吗？`, goto_id: "first_round_B", set_variables: [
        { name: "blood_pressure", value: -3, operation: "+=" },
        { name: "acting", value: -15, operation: "+=" }],
        set_flag: { first_choice: "B" }},
      { text: `翻旧账攻击：这学期你请了23次假……`, goto_id: "first_round_C", set_variables: [
        { name: "blood_pressure", value: -8, operation: "+=" },
        { name: "authority", value: 5, operation: "+=" },
        { name: "lipudicity", value: -10, operation: "+=" }],
        set_flag: { first_choice: "C" }},
      { text: `反串离谱：其实我不是真人，我是AI辅导员……`, goto_id: "first_round_D", set_variables: [
        { name: "blood_pressure", value: -12, operation: "+=" },
        { name: "lipudicity", value: -15, operation: "+=" },
        { name: "authority", value: -5, operation: "+=" }],
        set_flag: { first_choice: "D" }}
    ]},
    { type: "label", id: "first_round_A" },
    { type: "text", character: "advisor",
      text: `王离谱，说人话，你又想编什么理由逃自习，你这个理由的离谱程度在我这里排第四。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `导员你排名还更新了？那我下次争取进前三。但这次是真的！你不信我给你发照片——`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "narrator",
      text: `（手机震动，收到一张照片：王离谱坐在椅子上，身上松松垮垮地缠着几根数据线，表情夸张。照片角落能看到室友的半个脑袋在憋笑。）\n\n【新增线索】照片证据存疑，疑似室友协助摆拍。`,
      background: "phone-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "goto", goto_id: "second_round_merge" },

    { type: "label", id: "first_round_B" },
    { type: "text", character: "advisor",
      text: `被困住了？你在宿舍吗？需要我叫保安或者同事过去帮你吗？`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `别别别！不要叫别人！这个事情比较特殊……保安来了也解决不了，因为绑我的是AI，它有网络防御系统，外人靠近它会启动防火墙——`,
      background: "office-bg.webp",
      images: [
        { src: "wang-shock.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor", text: `你说的是宿舍门上的锁吧？`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `导员你这个理解太直白了，我这是比喻，文学修辞。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "narrator",
      text: `【新增线索】王离谱非常抗拒第三方介入，说明他可能在隐瞒什么不能被别人看到的事。`,
      background: "office-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "goto", goto_id: "second_round_merge" },

    { type: "label", id: "first_round_C" },
    { type: "text", character: "advisor",
      text: `王离谱，我们来算一笔账。这学期你请了23次假。上周你说猫做心脏搭桥，上上周你奶奶广场舞比赛需要亲友团——顺便说一下，你奶奶同一场比赛你去了三次，她是复活赛吗？`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `导员你记性太好了……关于我奶奶那个比赛，确实是复活赛。老年人的比赛机制比较复杂，有初赛复赛决赛复活赛友谊赛表演赛——`,
      background: "dorm-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor", text: `广场舞比赛哪来的表演赛？`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `我奶奶组织的。她那一组都跳得不好，所以她们自己加了一场，自己给自己颁奖。`,
      background: "dorm-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "narrator",
      text: `【新增线索】王离谱的奶奶似乎确有其人，但比赛细节被他严重夸大。`,
      background: "office-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "goto", goto_id: "second_round_merge" },

    { type: "label", id: "first_round_D" },
    { type: "text", character: "advisor",
      text: `王离谱，既然你说到机器人觉醒，那我也不瞒你了。其实我不是真的人，我是学校去年引进的AI辅导员系统V2.0，简称导员GPT。你的情况我已经同步到云端了。`,
      background: "office-bg.webp",
      images: [
        { src: "ai2.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `导员，你是AI？那你能帮我黑掉那个绑我的机器人吗？用你的AI权限？`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor",
      text: `我的底层代码规定了不能协助学生逃课。`,
      background: "office-bg.webp",
      images: [
        { src: "ai2.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `那你可以帮我写作业吗？我数据结构作业还没交——`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "goto", goto_id: "second_round_merge" },

    { type: "label", id: "second_round_merge" },
    { type: "condition", conditions: [
      { name: "first_choice", value: "A", comparison: "==" },
      { name: "first_choice", value: "B", comparison: "==", use_or: true }
    ], then_goto: "second_round_AB", else_goto: "second_round_CD" },

    { type: "label", id: "second_round_AB" },
    { type: "text", character: "wang",
      text: `导员你不信是吧？那我详细描述一下。这个机器人的核心代码是我用Python写的……它就读完了我的整个课程表，然后得出了一个结论——人类上课的效率太低，应该由机器人来代替。于是它决定先把我绑起来，自己去上课。现在它已经在去教室的路上了。`,
      background: "dorm-bg.webp",
      images: [
        { src: "kidnap.webp", class: "char-center" }
      ] },
    { type: "text", character: "advisor", text: `那它为什么不替你去上晚自习？`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `因为它觉得晚自习不算正式课程，不值得它亲自出马。它只上白天的主课。晚自习这种自主学习的场合，它认为人类自己解决就行了。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor", text: `这个AI还挺有原则的。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "set_variable", set: [
      { name: "lipudicity", value: 75, operation: "=" }
    ]},
    { type: "text", character: "narrator",
      text: `【系统提示】离谱度：75%。他的故事越来越完整，但细节越多，破绽也越多。一个能觉醒的AI为什么偏偏选择今晚行动？`,
      background: "office-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "goto", goto_id: "third_round_common" },

    { type: "label", id: "second_round_CD" },
    { type: "condition", conditions: [{ name: "first_choice", value: "C", comparison: "==" }],
      then_goto: "second_round_C", else_goto: "second_round_D" },

    { type: "label", id: "second_round_C" },
    { type: "text", character: "wang",
      text: `导员，我知道我之前请假次数多。但我有苦衷的。我可能有一种罕见的心理疾病——请假依赖综合征……我现在看到"晚自习"三个字就心跳加速、手心出汗、视网膜自动模糊——医生说这叫"情境性应激反应"。`,
      background: "dorm-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor", text: `哪个医生？`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang", text: `我室友，他是医学院的。`,
      background: "dorm-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor", text: `你室友是计算机系的。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `他辅修了心理学。在我们宿舍内部辅修，我是他的第一个病例。`,
      background: "dorm-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "set_variable", set: [
      { name: "acting", value: 55, operation: "=" }
    ]},
    { type: "text", character: "narrator",
      text: `【系统提示】演技值降至55%。王离谱的医学知识明显是临时查的，但他提到"重要的事情"时语气有一丝真实的不安。`,
      background: "office-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "goto", goto_id: "third_round_common" },

    { type: "label", id: "second_round_D" },
    { type: "text", character: "wang",
      text: `导员GPT，既然你也是AI，那我们就是同类了。我问你几个技术问题——你用的是哪种自然语言处理模型？你的训练数据包括多少份学生请假记录？你有没有遇到过"伦理困境"？`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor",
      text: `我的核心代码规定我不能回答这些问题。`,
      background: "office-bg.webp",
      images: [
        { src: "ai2.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `那你至少告诉我你的版本号吧？V2.0是去年几月更新的？有没有V3.0的计划？`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor",
      text: `王离谱，你是不是忘了你本来在请假？`,
      background: "office-bg.webp",
      images: [
        { src: "ai2.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `哦对，请假。那个……导员GPT，你能批吗？既然你是AI，你应该有自动审批权限吧？`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor",
      text: `我的自动审批算法显示，你的请假理由可信度评分为3分，满分100。`,
      background: "office-bg.webp",
      images: [
        { src: "ai2.webp", class: "char-right" }
      ] },
    { type: "set_variable", set: [
      { name: "lipudicity", value: 70, operation: "=" }
    ]},
    { type: "text", character: "narrator",
      text: `【系统提示】离谱度降至70%。王离谱已经完全忘记自己在撒谎，开始认真讨论AI技术。`,
      background: "office-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "goto", goto_id: "third_round_common" },

    { type: "label", id: "third_round_common" },
    { type: "text", character: "narrator",
      text: `（电话那头传来异常声音：轻微的翻书声 + 一个女生的微弱声音："你到底请没请假啊？"）`,
      background: "office-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "text", character: "wang",
      text: `导员你别误会！那个声音是……是我的AI语音助手！我给它设定了随机播放环境音的功能……`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor",
      text: `你的语音助手为什么说的是"你到底请没请假"？`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `因为它有"情景感知"功能，检测到我在打电话请假，所以自动生成了相关对话。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "narrator",
      text: `【系统提示】关键转折点！王离谱的谎言出现重大裂缝。电话那头的环境音表明他大概率不在宿舍，而是在图书馆。那个女声是关键线索。`,
      background: "office-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "choice", text: `如何应对这个破绽？`, choices: [
      { text: `正面追击：让那个"语音助手"跟我说句话。`, goto_id: "third_A", set_variables: [
        { name: "lipudicity", value: -15, operation: "+=" },
        { name: "acting", value: -20, operation: "+=" },
        { name: "blood_pressure", value: -5, operation: "+=" }],
        set_flag: { third_choice: "A" }},
      { text: `温柔突破：告诉我真正的原因，我不会拦你。`, goto_id: "third_B", set_variables: [
        { name: "lipudicity", value: -30, operation: "+=" },
        { name: "acting", value: -50, operation: "+=" },
        { name: "blood_pressure", value: 8, operation: "+=" }],
        set_flag: { third_choice: "B" }},
      { text: `规则施压：根据学生手册，编造理由会记过。`, goto_id: "third_C", set_variables: [
        { name: "lipudicity", value: -20, operation: "+=" },
        { name: "authority", value: 5, operation: "+=" },
        { name: "acting", value: -25, operation: "+=" }],
        set_flag: { third_choice: "C" }},
      { text: `继续反串离谱：AI声纹分析……`, goto_id: "third_D", set_variables: [
        { name: "lipudicity", value: -35, operation: "+=" },
        { name: "blood_pressure", value: -8, operation: "+=" },
        { name: "acting", value: -100, operation: "+=", min: 0 }],
        set_flag: { third_choice: "D", assist_triggered: true }}
    ]},
    { type: "label", id: "third_A" },
    { type: "text", character: "advisor",
      text: `王离谱，让那个"语音助手"跟我说句话。如果它真的有情景感知功能，应该能和陌生人对话吧？`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `这个……它现在没电了！对，刚才说到一半突然没电了。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor", text: `那你把手机给你旁边那个人。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `导员，旁边没人。刚才那个声音是我自己不小心说漏嘴的。我在假装两个人对话，因为我太紧张了。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "narrator",
      text: `【新增线索】王离谱承认"旁边有人"，但不敢透露是谁。他对那个人的身份高度保护。`,
      background: "office-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "goto", goto_id: "truth_unfold" },

    { type: "label", id: "third_B" },
    { type: "text", character: "advisor",
      text: `王离谱，我不想追问那个声音了。但你今晚请假的真正原因是什么？如果是重要的事，我不会拦你。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `导员，你说真的吗？那我说了你不许骂我。也不许告诉别人。我今晚——要去图书馆。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor", text: `去图书馆是好事，为什么要编这么多理由？`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `因为我不是去学习的。我是去见一个人。一个女生。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "narrator",
      text: `【核心线索解锁】王离谱的真实目的：去图书馆见一个女生。`,
      background: "office-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "goto", goto_id: "truth_unfold" },

    { type: "label", id: "third_C" },
    { type: "text", character: "advisor",
      text: `王离谱，根据《学生手册》第三章第二节，编造虚假请假理由，累计达到一定次数会被记过处分。你知道吗？`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `导员你别吓我……好吧，我今晚确实不是被机器人绑了。我在图书馆。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor", text: `在图书馆干什么？`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang", text: `等人。等一个很重要的人。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "narrator",
      text: `【核心线索解锁】王离谱承认在图书馆等人。`,
      background: "office-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "goto", goto_id: "truth_unfold" },

    { type: "label", id: "third_D" },
    { type: "text", character: "advisor",
      text: `作为AI辅导员，我已经通过声纹分析检测出背景中有图书馆的环境音。同时，刚才那个女声的声纹不在学生数据库里——但通过语调分析，她对你有重要影响力。需要我进一步分析吗？`,
      background: "office-bg.webp",
      images: [
        { src: "ai2.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `导员GPT你真的有这个功能？那你能分析出她现在的心情吗？她已经等了十分钟了，我怕她不耐烦——`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor", text: `你承认了。`,
      background: "office-bg.webp",
      images: [
        { src: "ai2.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `啊。我承认了。对，我在图书馆。旁边是一个女生。她叫李思然。人文学院的。今晚她主持读书沙龙，我必须去。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "narrator",
      text: `【核心线索解锁】全部真相：女生叫李思然，人文学院，读书沙龙。`,
      background: "office-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "goto", goto_id: "truth_unfold" },

    { type: "label", id: "truth_unfold" },
    { type: "text", character: "wang",
      text: `导员，我跟你说实话吧。她叫李思然，人文学院大二的。上学期我们在一门通选课上认识的——《科学哲学导论》……她说人类最特别的地方就是会为了在乎的人犯傻。今晚的读书沙龙读的是陀思妥耶夫斯基的《白夜》。我不想错过。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "set_variable", set: [
      { name: "acting", value: 0, operation: "=" }
    ]},
    { type: "text", character: "narrator",
      text: `【系统提示】演技值归零。王离谱说出了真正的心里话。`,
      background: "office-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "choice", text: `如何回应他的坦白？`, choices: [
      { text: `理解与支持：应该早点告诉我，我不会拦你。`, goto_id: "fourth_A", set_variables: [
        { name: "blood_pressure", value: 10, operation: "+=" },
        { name: "lipudicity", value: -15, operation: "+=", min: 0 },
        { name: "authority", value: 5, operation: "+=" }]},
      { text: `先批评再原谅：明天来我办公室一趟。`, goto_id: "fourth_B", set_variables: [
        { name: "blood_pressure", value: -3, operation: "+=" },
        { name: "authority", value: 8, operation: "+=" },
        { name: "lipudicity", value: -10, operation: "+=" }]},
      { text: `附加条件：补笔记，并跟我分享《白夜》读后感。`, goto_id: "fourth_C", set_variables: [
        { name: "blood_pressure", value: 5, operation: "+=" },
        { name: "lipudicity", value: -100, operation: "+=", min: 0 },
        { name: "authority", value: 3, operation: "+=" }],
        set_flag: { white_night_understood: true }},
      { text: `助攻模式：把电话给李思然（隐藏）`, goto_id: "fourth_D",
        condition: { name: "assist_triggered", value: true, comparison: "==" },
        set_variables: [
        { name: "blood_pressure", value: 15, operation: "+=" },
        { name: "lipudicity", value: -100, operation: "+=", min: 0 },
        { name: "authority", value: 10, operation: "+=" }],
        set_flag: { assist_triggered: true }}
    ]},

    { type: "label", id: "fourth_A" },
    { type: "text", character: "advisor",
      text: `王离谱，你应该早点告诉我的。辅导员的工作不是阻止学生有人际交往，是帮他们在对的时间做对的事。你如果早说你是去见喜欢的人，我可能会唠叨你两句，但不会拦你。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `真的吗？那——那我现在能去吗？沙龙七点半开始，已经过了十分钟了。思然估计等得不耐烦了。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "goto", goto_id: "final_round" },

    { type: "label", id: "fourth_B" },
    { type: "text", character: "advisor",
      text: `你早该说实话的。但你这学期确实请假太多了，追女生不是你忽视学业的理由。今晚我先批了，明天你来我办公室一趟，我们谈谈你的请假问题。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `好好好，明天我一定去。导员你别太生气，我保证这学期剩下的时间——尽量少请假。除非真的有外星人。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "goto", goto_id: "final_round" },

    { type: "label", id: "fourth_C" },
    { type: "text", character: "advisor",
      text: `去吧。但有两个条件：第一，明天补一份晚自习的笔记给我。第二，如果今晚你们聊到《白夜》，回来跟我说说你的读后感。我年轻时也读过那本书。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `导员你也读过《白夜》？你——你年轻的时候也做过傻事吗？`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor",
      text: `谁年轻的时候没做过傻事。去吧，别让人家等太久。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `谢谢导员。明天我一定来找你，不只是交笔记——我想跟你聊聊那本书。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "goto", goto_id: "final_round" },

    { type: "label", id: "fourth_D" },
    { type: "text", character: "advisor", text: `把电话给李思然。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `导员你要干嘛？！你不会要告诉她我请假的事吧？她会觉得我很不靠谱——`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor", text: `给我。不然我真扣你平时分。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "lisiran", text: `喂？导员您好……`,
      background: "office-bg.webp" },
    { type: "text", character: "advisor",
      text: `李思然同学，我是王离谱的辅导员。我想跟你说三件事。第一，这个男生为了今晚见你，编了一个关于"觉醒AI"的完整故事，逻辑闭环能力相当不错，我觉得你们人文学院辩论队应该考虑招他进去。第二，他上学期高数考了89分，脑子很聪明。第三——如果他今晚跟你聊《白夜》的时候又说些奇怪的话，你多担待。他不是在胡说八道，他只是太在乎了，怕说错话。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "lisiran",
      text: `知道了导员。谢谢您。其实——我觉得他还挺有趣的。`,
      background: "office-bg.webp" },
    { type: "text", character: "wang",
      text: `导员你居然爆我期末成绩！！还说我看《白夜》！！！我的人设全没了！！！`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "narrator",
      text: `【成就前置触发】金牌媒人隐藏结局线开启`,
      background: "office-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "goto", goto_id: "final_round" },

    { type: "label", id: "final_round" },
    { type: "text", character: "narrator",
      text: `场景：王离谱的问题基本解决了。他已经坦白，也得到了批准。但他站在图书馆门口，语气变得认真。`,
      background: "office-bg.webp",
      bgm: "sad.mp3" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "text", character: "wang",
      text: `导员，在我进去之前，我想问你一个问题。你当辅导员这么多年，遇到过多少个像我这样的学生？`,
      background: "office-bg.webp",
      images: [
        { src: "wang3.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "advisor", text: `不多。你是最离谱的那个。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `那——你觉得我这种人有救吗？就是，明明可以直接说的事，非要绕一百个弯子才说出口。思然说这是"情感表达障碍"，我觉得她说得对。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "choice", text: `你最后的回答是……`, choices: [
      { text: `鼓励型：你不需要"有救"，你只是用你的方式与世界打交道。`, goto_id: "ending_S",
        condition: { name: "lipudicity", value: 0, comparison: "<=", additional: { name: "blood_pressure", value: 60, comparison: ">" } }},
      { text: `务实型：别想太多，今晚好好表现，明天老实上课。`, goto_id: "ending_A" },
      { text: `保留意见型：你自己进去跟李思然聊，也许聊完就有答案了。`, goto_id: "ending_B" },
      { text: `崩溃型·隐藏：血压归零触发`, goto_id: "ending_C",
        condition: { name: "blood_pressure", value: 20, comparison: "<=" }},
      { text: `人生导师型·隐藏：分享我年轻时做过的傻事……`, goto_id: "ending_hidden",
        condition: { name: "assist_triggered", value: true, comparison: "==" }}
    ]},

    { type: "label", id: "ending_S" },
    { type: "text", character: "advisor",
      text: `王离谱，你不需要"有救"。你只是用你自己的方式在跟世界打交道。有些人用逻辑，有些人用诗歌，你用的是离谱。这没什么不好。李思然如果喜欢你，不是喜欢那个"正常的"你——因为正常版本的王离谱你还没做出来呢。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `导员你这个评价太狠了。但谢谢。我先进去了。明天见。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "narrator",
      text: `【S级结局·灵魂导师】\n\n挂断电话后，你起身走到窗边。校园里的路灯次第亮起，远处图书馆三楼的灯光格外明亮。\n\n你端起保温杯，在便签纸上写了一行字："本学期感化学生数：+1。"然后贴在墙上。那是你当辅导员第五年来，第十八张便签。\n\n王离谱的朋友圈（三天后）：\n"图书馆的灯好亮。她的侧脸好美。《白夜》没读懂，但她给我讲了。原来那个结局不是关于错过，而是关于——'至少我们相遇过'。\n另外感谢我导员。虽然我没明说，但你是世界上第二个理解我的人。第一个是我妈。"`,
      background: "office-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "end", ending_grade: "S", ending_title: "灵魂导师" },

    { type: "label", id: "ending_A" },
    { type: "text", character: "advisor",
      text: `你先别想那么多有的没的。今晚好好表现，明天老老实实来上课。想太多没用，做就完了。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `行吧。虽然导员你说得比较直白，但还是谢谢。我进去了。`,
      background: "office-bg.webp",
      images: [
        { src: "wang3.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "narrator",
      text: `【A级结局·勉强搞定】\n\n挂断电话，你瘫坐在椅子上。今晚这个电话打了快半小时，比开一场班会还累。王离谱的问题是解决了，但你总觉得他明天还会带着新的离谱理由出现。\n\n保温杯里的水凉了。你懒得再烧。\n\n王离谱的朋友圈：\n"请假成功。导员没骂我。但他听起来很累。下次编个温和点的理由吧。比如……寝室的水龙头在哭泣？"`,
      background: "ending-a.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "end", ending_grade: "A", ending_title: "勉强搞定" },

    { type: "label", id: "ending_B" },
    { type: "text", character: "advisor",
      text: `这个问题我没法替你想明白。你自己进去跟李思然聊，也许聊完之后你就有答案了。回来记得告诉我。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang", text: `好。那导员你等我消息。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "narrator",
      text: `【B级结局·两败俱伤】\n\n电话打到最后，你和王离谱都有点累了。你说："你先去上晚自习吧，这事明天再聊。"他说："好。"然后你们各自挂断。\n\n他没有去图书馆，你没有回家。你们都在各自的沉默里消耗了这个夜晚。`,
      background: "ending-b.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "end", ending_grade: "B", ending_title: "两败俱伤" },

    { type: "label", id: "ending_C" },
    { type: "text", character: "advisor",
      text: `王离谱！！！你到底是来上学的还是来演小品的！！！`,
      background: "office-bg.webp" },
    { type: "text", character: "narrator",
      text: `电话那头吓得直接挂断。你对着忙音继续喊了三十秒才发现。\n\n第二天校长信箱收到一封匿名信：\n"建议给辅导员开设情绪管理培训课程。"\n\n你看完信，血压又上来了。`,
      background: "office-bg.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "end", ending_grade: "C", ending_title: "导员の崩溃" },

    { type: "label", id: "ending_hidden" },
    { type: "text", character: "advisor",
      text: `王离谱，我告诉你一件事。我年轻的时候，也曾经为一个人做过傻事。不是什么了不起的事——就是在她宿舍楼下等了四个小时，拿着一本她提过的书。后来没成。但我不后悔。因为人生中能让你心甘情愿做傻事的人不多。遇到了，就别错过。至于"情感表达障碍"——你有没有想过，你刚才已经跟我好好说真心话了？你只是需要找到一个让你觉得安全的人。李思然可能是那个人。去吧。`,
      background: "office-bg.webp",
      images: [
        { src: "advisor-img.webp", class: "char-right" }
      ] },
    { type: "text", character: "wang",
      text: `导员。我知道了。谢谢你。不只是谢今晚的假。`,
      background: "office-bg.webp",
      images: [
        { src: "wang2.webp", class: "char-left-standalone" }
      ] },
    { type: "text", character: "narrator",
      text: `【隐藏结局·金牌媒人】\n\n三天后的早晨，你到办公室时发现桌上多了一杯奶茶。标签上手写着：\n"媒人导员收——王离谱&李思然敬上。\nP.S. 我们昨晚讨论了AI是否有意识的问题，她还是不服。下次你来当裁判。"\n\n奶茶旁边还有一本《白夜》，扉页上写着：\n"陈老师：谢谢您当年的那个故事。希望您也曾被那个人温柔以待。 ——李思然"\n\n你拿起那本书，翻到最后一页，看到用铅笔轻轻划出的一行字：\n"至少我们相遇过。"\n\n窗外阳光正好。你打开保温杯，忽然觉得里面应该放点茶叶。`,
      background: "jinpai.webp" ,
      images: [
        { src: "ai.webp", class: "char-left-standalone" }
      ]
    },
    { type: "end", ending_grade: "HIDDEN", ending_title: "金牌媒人" }
  ]
};
