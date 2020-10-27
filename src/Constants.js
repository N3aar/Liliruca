const { loadTypes } = require('@utils/items')

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
    'https://cdn.discordapp.com/attachments/612298119547191340/761722286129545227/daily_1.png',
    'https://cdn.discordapp.com/attachments/612298119547191340/761722287606988880/daily_2.png',
    'https://cdn.discordapp.com/attachments/612298119547191340/761722289611472926/daily_3.png',
    'https://cdn.discordapp.com/attachments/612298119547191340/761722291192201257/daily_4.png',
    'https://cdn.discordapp.com/attachments/612298119547191340/761722293181218866/daily_5.png'
  ],
  GIVE_COOLDOWN: 18000000,
  GIVE_TAX: 0.95,
  GIVE_MIN: 50,
  ENERGY_COST: 20,
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
    rare: { min: 5, max: 50 },
    fishs: { min: 1, max: 20 },
    treasure: { min: 10, max: 40 },
    trash: { min: 1, max: 5 }
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
      amount: 10
    },
    [PLACE_NAMES.FISHING]: {
      material: 'wooden-plank',
      amount: 30
    },
    [PLACE_NAMES.MINING]: {
      material: 'iron-bar',
      amount: 10
    }
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
    wrench: '🔧',
    hammerwrench: '🛠️',
    gear: '⚙️',
    battery: '🔋',
    voltage: '⚡',
    drink: '🥤',
    locked: '🔒',
    open: '🔓',
    news: '🆕',
    page: '📃',
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
    balance: '⚖️',
    fishs: [
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
}
