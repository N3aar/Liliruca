const { loadTypes } = require('./utils/items')

const TEAM_MEMBER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
}

const TEAM_MEMBER_TAGS = {
  OWNER: '\\👑 Owner',
  BACK_END: '\\📕 Back-end',
  FRONT_END: '\\📘 Front-end',
  DESIGNER: '\\🎨 Designer'
}

const PLACE_NAMES = {
  FARM: 'farm',
  FISHING: 'fishing',
  MINING: 'mining'
}

const SEASON_NAMES = {
  SPRING: 'spring',
  SUMMER: 'summer',
  AUTUMN: 'autumn',
  WINTER: 'winter'
}

const WEATHER_NAMES = {
  SUNNY: 'sunny',
  RAINY: 'rainy',
  CLOUDY: 'cloudy',
  STORM: 'storm'
}

const RESOURCE_NAMES = {
  FOOD: 'food',
  FISH: 'fish',
  METAL: 'metal'
}

const BOOSTER_NAMES = {
  FERTILIZER: 'fertilizer',
  FISHING_NET: 'fishing-net',
  BOMB: 'bomb'
}

module.exports = {
  SUPPORT_GUILD: 'https://discord.com/invite/8RbHNfr',
  DEFAULT_PREFIX: '>',
  PREFIX_MAX_LIMIT: 5,
  DEFAULT_LANGUAGE: 'pt-br',
  EMBED_COLORS: {
    default: '#ff9900',
    success: '#0aa329',
    error: '#db3939',
    warn: '#ebe728'
  },
  OWNER_IDS: [
    '158001949415833600',
    '281561868844269569',
    '616410427794128909',
    '332581129704177664'
  ],
  TEAM: [
    {
      name: 'Near',
      emoji: '<:near:699049733238554675>',
      tags: [TEAM_MEMBER_TAGS.OWNER, TEAM_MEMBER_TAGS.BACK_END],
      joined: 1550880000000,
      status: TEAM_MEMBER_STATUS.ACTIVE
    },
    {
      name: 'Ichi',
      emoji: '<:ichi:758089072148348948>',
      tags: [TEAM_MEMBER_TAGS.FRONT_END],
      joined: 1553990400000,
      status: TEAM_MEMBER_STATUS.ACTIVE
    },
    {
      name: 'Tsugami',
      emoji: '<:tsugami:758075414869442684>',
      tags: [TEAM_MEMBER_TAGS.BACK_END],
      joined: 1557273600000,
      status: TEAM_MEMBER_STATUS.ACTIVE
    },
    {
      name: 'Derpy',
      emoji: '<:derpy:758089742054326382>',
      tags: [TEAM_MEMBER_TAGS.BACK_END],
      joined: 1586995200000,
      status: TEAM_MEMBER_STATUS.ACTIVE
    },
    {
      name: 'Psyka',
      emoji: '<:psyka:758075415607640124>',
      tags: [TEAM_MEMBER_TAGS.BACK_END],
      joined: 1599419160000,
      status: TEAM_MEMBER_STATUS.ACTIVE
    }
  ],
  CATEGORIES: [
    'production',
    'user',
    'rewards',
    'items',
    'time',
    'administration',
    'bot',
    'others'
  ],
  DAILY_COOLDOWN: 72000000,
  DAILY_REWARD: 5,
  DAILY_BONUS: 40,
  DAILY_STREAK: [
    '772905049541312532/daily_1.png',
    '772905051659436062/daily_2.png',
    '772905054608556052/daily_3.png',
    '772905245932126218/daily_4.png',
    '772905268102430770/daily_5.png'
  ],
  GIVE_COOLDOWN: 18000000,
  GIVE_TAX: 0.95,
  GIVE_MIN: 50,
  ENERGY_COST: 10,
  ENERGY_COOLDOWN: 21600000,
  SEASON_NAMES,
  PLACE_NAMES,
  RESOURCE_NAMES,
  ITEMS_TYPES: loadTypes(),
  ORES: ['copper-ore', 'iron-ore', 'gold-ore', 'cobalt-ore'],
  RARE_FISHES: [
    'anglerfish',
    'eel',
    'goldenfish',
    'mantaray',
    'marlin',
    'octopus',
    'pufferfish',
    'squid'
  ],
  TREASURE: {
    money: { min: 80, max: 800 },
    lilistars: { min: 1, max: 30 }
  },
  WEIGHTS: {
    rare: { min: 5, max: 50, price: 25 },
    fish: { min: 1, max: 20, price: 20 },
    trash: { min: 1, max: 5, price: 2 },
    treasure: { min: 10, max: 40 }
  },
  PLACES_ALIASES: {
    [PLACE_NAMES.FARM]: ['farm', 'fm', 'fazenda'],
    [PLACE_NAMES.FISHING]: ['fishing', 'fs', 'pescaria'],
    [PLACE_NAMES.MINING]: ['mining', 'mn', 'mineradora']
  },
  PLACES_RESOURCES: {
    [PLACE_NAMES.FARM]: RESOURCE_NAMES.FOOD,
    [PLACE_NAMES.FISHING]: RESOURCE_NAMES.FISH,
    [PLACE_NAMES.MINING]: RESOURCE_NAMES.METAL
  },
  PLACES_BOOSTERS: {
    [PLACE_NAMES.FARM]: BOOSTER_NAMES.FERTILIZER,
    [PLACE_NAMES.FISHING]: BOOSTER_NAMES.FISHING_NET,
    [PLACE_NAMES.MINING]: BOOSTER_NAMES.BOMB
  },
  SEASONS: Object.values(SEASON_NAMES),
  WEATHERS: Object.values(WEATHER_NAMES),
  RESOURCES: Object.values(RESOURCE_NAMES),
  PLACES: Object.values(PLACE_NAMES),
  PLACE_START_LEVEL: 1,
  PLACE_MAX_LEVEL: 50,
  PLACE_MIN_LEVEL: 1,
  PLACE_GENERATE: {
    [PLACE_NAMES.FARM]: 80,
    [PLACE_NAMES.FISHING]: 15,
    [PLACE_NAMES.MINING]: 20
  },
  UPGRADE_PRICE: {
    [PLACE_NAMES.FARM]: 500,
    [PLACE_NAMES.FISHING]: 2000,
    [PLACE_NAMES.MINING]: 3500
  },
  UPGRADE_MATERIALS: {
    [PLACE_NAMES.FARM]: {
      material: 'wooden-plank',
      amount: 3
    },
    [PLACE_NAMES.FISHING]: {
      material: 'wooden-plank',
      amount: 4
    },
    [PLACE_NAMES.MINING]: {
      material: 'iron-bar',
      amount: 2
    },
    storage: 2
  },
  PRODUCTION_LIMIT: {
    [PLACE_NAMES.FARM]: 6,
    [PLACE_NAMES.FISHING]: 5,
    [PLACE_NAMES.MINING]: 4
  },
  STORAGE_PRICES: {
    [PLACE_NAMES.FARM]: 150,
    [PLACE_NAMES.FISHING]: 350,
    [PLACE_NAMES.MINING]: 550
  },
  STORAGES_SIZE: {
    [PLACE_NAMES.FARM]: 480,
    [PLACE_NAMES.FISHING]: 90,
    [PLACE_NAMES.MINING]: 120
  },
  LEADERBOARD_TYPES: [
    'money',
    'lilistars',
    'fishs',
    PLACE_NAMES.FARM,
    PLACE_NAMES.FISHING,
    PLACE_NAMES.MINING
  ],
  WEATHER_PERCENTAGE: {
    [WEATHER_NAMES.STORM]: {
      [PLACE_NAMES.FARM]: 1.10,
      [PLACE_NAMES.FISHING]: 0.85,
      [PLACE_NAMES.MINING]: 0.9
    },
    [WEATHER_NAMES.RAINY]: {
      [PLACE_NAMES.FARM]: 1.15,
      [PLACE_NAMES.FISHING]: 1.1
    },
    [WEATHER_NAMES.CLOUDY]: {
      [PLACE_NAMES.FISHING]: 0.95
    }
  },
  WEATHERS_COLORS: {
    [WEATHER_NAMES.SUNNY]: '#FFD335',
    [WEATHER_NAMES.RAINY]: '#00B2FF',
    [WEATHER_NAMES.CLOUDY]: '#F2FFFF',
    [WEATHER_NAMES.STORM]: '#00007A'
  },
  SEASONS_PERCENTAGE: {
    [SEASON_NAMES.SPRING]: {
      [PLACE_NAMES.FARM]: 0.9,
      [PLACE_NAMES.FISHING]: 0.85,
      [PLACE_NAMES.MINING]: 1.05
    },
    [SEASON_NAMES.SUMMER]: {
      [PLACE_NAMES.FARM]: 1.15,
      [PLACE_NAMES.FISHING]: 1.2,
      [PLACE_NAMES.MINING]: 0.8
    },
    [SEASON_NAMES.AUTUMN]: {
      [PLACE_NAMES.FARM]: 1.2,
      [PLACE_NAMES.FISHING]: 1.15,
      [PLACE_NAMES.MINING]: 0.85
    },
    [SEASON_NAMES.WINTER]: {
      [PLACE_NAMES.FARM]: 0.75,
      [PLACE_NAMES.FISHING]: 0.8,
      [PLACE_NAMES.MINING]: 1.3
    }
  },
  SEASONS_COLORS: {
    [SEASON_NAMES.SPRING]: '#fe8afa',
    [SEASON_NAMES.SUMMER]: '#fbce18',
    [SEASON_NAMES.AUTUMN]: '#ab7f4f',
    [SEASON_NAMES.WINTER]: '#00ccff'
  },
  STATISTICS_TYPES: {
    axe: [
      'axe',
      'copper_axe',
      'iron_axe',
      'gold_axe',
      'cobalt_axe'
    ],
    pickaxe: [
      'pickaxe',
      'copper_pickaxe',
      'iron_pickaxe',
      'gold_pickaxe',
      'cobalt_pickaxe'
    ],
    materials: [
      'copper-ore',
      'iron-ore',
      'gold-ore',
      'cobalt-ore',
      'coal',
      'wood',
      'wooden-plank'
    ],
    fishing: [
      'rare',
      'fish',
      'trash',
      'treasure'
    ]
  },
  STATISTICS_EMOJIS: {
    axe: '🪓',
    pickaxe: '⛏',
    materials: '🧰',
    fishing: '🎣',
    rare: '🐡',
    fish: '🐟',
    trash: '🗑️',
    treasure: '💰'
  },
  EMOJIS: {
    money: '💰',
    lilistars: '⭐',
    month: '📅',
    cloud: '☁️',
    spring: '🌺',
    summer: '☀️',
    autumn: '🍂',
    winter: '❄️',
    key: '🔑',
    papyrus: '📜',
    clipboard: '📋',
    clock: '⏰',
    pencil: '✏️',
    picture: '🖼️',
    books: '📚',
    backpack: '🎒',
    gift: '🎁',
    graph: '📊',
    handshake: '🤝',
    bank: '🏦',
    shopcart: '🛒',
    antenna: '📡',
    lamp: '💡',
    beatingHeart: '💓',
    abacus: '🧮',
    bookmark: '🔖',
    trophy: '🏆',
    axe: '🪓',
    fire: '🔥',
    pack: '📦',
    nut: '🔩',
    wrench: '🔧',
    hammerwrench: '🛠️',
    gear: '⚙️',
    battery: '🔋',
    voltage: '⚡',
    drink: '🥤',
    locked: '🔒',
    open: '🔓',
    news: '🆕',
    pagecurl: '📃',
    card: '🎴',
    paintbrush: '🖌️',
    blowfish: '🐡',
    star: '⭐',
    glowingstar: '🌟',
    farm: '🌳',
    fishing: '⛵',
    mining: '⛏',
    food: ['🥕', '🌽', '🍅', '🍍', '🍆', '🥔', '🥒', '🥦'],
    fish: ['🐟', '🐠', '🦐', '🐡', '🦀', '🦑', '🐙'],
    metal: ['💎'],
    storage: '📥',
    fishingpole: '🎣',
    balance: '⚖️',
    umbrella: '☂️',
    cloudrain: '⛅',
    cloudy: '☁️',
    storm: '⛈️',
    rainy: '🌧️',
    sunny: '🌤️',
    produced: '📬',
    production: '🏭',
    user: '🎓',
    rewards: '🎁',
    items: '🧰',
    time: '🌦️',
    administration: '🔧',
    bot: '🤖',
    others: '🔍',
    fishs: {
      fish: [
        '<:fish_1:763957178523451453>',
        '<:fish_2:763957215556010055>',
        '<:fish_3:763957241711689738>',
        '<:fish_4:763957268009320478>',
        '<:fish_5:763957649313628171>'
      ],
      treasure: [
        '<:treasure_chest_2:763957075914653797>',
        '<:treasure_chest:763957075776241684>',
        '<:treasure:763957075926843442>'
      ],
      trash: [
        '<:trashbanana:763957773020823552>',
        '<:trashboot:763957773229621288>',
        '<:brokenglasses:763957773549436998>',
        '<:brokenbottle:763957773431603210>'
      ],
      rare: {
        anglerfish: '<:anglerfish:763957907430703135>',
        eel: '<:eel:763957907838468096>',
        goldenfish: '<:goldenfish:763957908190265394>',
        mantaray: '<:mantaray:763957909272788992>',
        marlin: '<:marlin:763957909821718549>',
        octopus: '<:octopus:763957910681419796>',
        pufferfish: '<:pufferfish:763957909972320277>',
        squid: '<:squid:763957908970668034>'
      }
    }
  },
  backgrounds: [
    '776939404417171466/1.png',
    '776939411383779368/2.png',
    '776939417323569162/3.png',
    '776939423823691806/4.png',
    '776939430622658600/5.png',
    '776939435090509845/6.png',
    '776939438491566080/7.png',
    '776939444191756308/8.png',
    '776939448776654858/9.png',
    '776939456585269289/10.png',
    '776939460469325844/11.png',
    '776939465116745738/12.png',
    '776939484188246046/13.png',
    '776939489079066634/14.png',
    '776939502605303818/15.png',
    '776939524097310820/16.png',
    '776939547384348672/17.png',
    '776939553982251078/18.png',
    '776939560637693952/19.png',
    '776939573593899058/20.png',
    '776939581207085058/21.png',
    '776939586823651368/22.png',
    '776939592603533322/23.png',
    '776939599053717504/24.png',
    '776939605811396648/25.png',
    '776939613162962964/26.png',
    '776939619429515274/27.png',
    '776939626396123146/28.png',
    '776940446315970570/29.png',
    '776940452870881310/30.png',
    '776940460970344448/31.png',
    '776940473314050048/32.png',
    '776940492877201460/33.png',
    '776940502116990976/34.png',
    '776940507908538469/35.png',
    '776940519980400640/36.png',
    '776940529689690143/37.png',
    '776940547578527774/38.png',
    '776940553786621952/39.png',
    '776940561600086016/40.png',
    '776940567179296818/41.png',
    '776940572245753906/42.png',
    '776940576439926824/43.png',
    '776940582353371146/44.png',
    '776940587886182400/45.png',
    '776940595599507476/46.png',
    '776940602235027487/47.png',
    '776940610149023784/48.png',
    '776940618202611722/49.png',
    '776940625785520139/50.png',
    '776940632731418684/51.png',
    '776940644471013376/52.png',
    '776940650347888741/53.png',
    '776940658677252146/54.png',
    '776940665098469396/55.png',
    '776940673814495292/56.png',
    '776940683159142421/57.png',
    '776940693770993674/58.png',
    '776940702222516224/59.png',
    '776940708271095808/60.png',
    '776940712524644402/61.png',
    '776940717238910986/62.png',
    '776940723722256384/63.png',
    '776940729352060938/64.png',
    '776940742307348540/65.png',
    '776940749354172457/66.png',
    '776940754857361408/67.png',
    '776940760255168612/68.png',
    '776940768388186122/70.png',
    '776940764864708638/69.png',
    '776940775883669574/71.png',
    '776940783513108490/72.png',
    '776940793058426950/73.png',
    '776940800918814740/74.png',
    '776940809085780039/75.png',
    '776940820761673788/76.png',
    '776940823987879946/77.png',
    '776940829901062164/78.png',
    '776940835698376764/79.png',
    '776940843793776660/80.png'
  ]
}
