const TEAM_MEMBER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
}

const TEAM_MEMBER_TAGS = {
  OWNER: '👑 Owner',
  BACK_END: '📕 Back-end',
  FRONT_END: '📘 Front-end',
  DESIGNER: '🎨 Designer'
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

const BOOSTER_TYPES = {
  BASIC: 'basic',
  MEDIUM: 'medium',
  PREMIUM: 'premium'
}

module.exports = {
  SEASON_NAMES,
  PLACE_NAMES,
  PLACES_ALIASES: {
    [PLACE_NAMES.FARM]: ['farm', 'fm', 'fazenda'],
    [PLACE_NAMES.FISHING]: ['fishing', 'fs', 'pescaria'],
    [PLACE_NAMES.MINING]: ['mining', 'mn', 'mineradora']
  },
  OWNER_IDS: ['158001949415833600', '281561868844269569', '616410427794128909'],
  PLACES: Object.values(PLACE_NAMES),
  PLACE_START_LEVEL: 1,
  PLACE_MAX_LEVEL: 10,
  PLACE_MIN_LEVEL: 1,
  DEFAULT_LANGUAGE: 'pt-BR',
  DEFAULT_PREFIX: process.env.BOT_PREFIX || '>',
  PREFIX_MAX_LIMIT: 5,
  EMOJIS: {
    month: '📅',
    cloud: '☁️',
    spring: '🌺',
    summer: '☀️',
    autumn: '🍂',
    winter: '❄️',
    key: '🔑',
    antenna: '📡',
    lamp: '💡',
    beatingHeart: '💓',
    abacus: '🧮',
    wrench: '🔧',
    FARM: '🌳',
    FISHING: '⛵',
    MINING: '⛏',
    FOOD: ['🥕', '🌽', '🍅', '🍍', '🍆', '🥔', '🥒', '🥦'],
    FISH: ['🐟', '🐠', '🦐', '🐡', '🦀', '🦑', '🐙'],
    METAL: ['💎'],
    scarecrow: '<:scarecrow:698353463716741182>',
    fence: '<:fence:698353484017303603>',
    fertilizer: [
      '<:fertilizer_1:698353399871176704>',
      '<:fertilizer_2:698353438001594418>',
      '<:fertilizer_3:698353438093869076>'
    ],
    worms: [
      '<:worms_1:698353333672607744>',
      '<:worms_2:698353363971997756>',
      '<:worms_3:698353379599974480>'
    ],
    energitc: [
      '<:energetic_1:698353310062870590>',
      '<:energetic_2:698353310071259207>',
      '<:energetic_3:698353310289100903>'
    ]
  },
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
      emoji: '<:ichi:699049751038918748>',
      tags: [TEAM_MEMBER_TAGS.FRONT_END],
      joined: 1553990400000,
      status: TEAM_MEMBER_STATUS.ACTIVE
    },
    {
      name: 'Tsugami',
      emoji: '<:tsugami:699049764234461304>',
      tags: [TEAM_MEMBER_TAGS.BACK_END],
      joined: 1557273600000,
      status: TEAM_MEMBER_STATUS.ACTIVE
    },
    {
      name: 'Derpy',
      tags: [TEAM_MEMBER_TAGS.BACK_END],
      joined: 1586995200000,
      status: TEAM_MEMBER_STATUS.ACTIVE
    }
  ],
  EMBED_COLORS: {
    default: process.env.EMBED_COLOR_DEFAULT || '#ff9900',
    success: process.env.EMBED_COLOR_SUCCESS || '#0aa329',
    error: process.env.EMBED_COLOR_ERROR || '#db3939',
    warn: process.env.EMBED_COLOR_WARN || '#ebe728'
  },
  GENERATE: {
    [PLACE_NAMES.FARM]: 80,
    [PLACE_NAMES.FISHING]: 15,
    [PLACE_NAMES.MINING]: 20
  },
  PLACE_BOOSTER: {
    [PLACE_NAMES.FARM]: {
      [BOOSTER_TYPES.BASIC]: { min: 5, max: 25 },
      [BOOSTER_TYPES.MEDIUM]: { min: 15, max: 35 },
      [BOOSTER_TYPES.PREMIUM]: { min: 25, max: 50 }
    },
    [PLACE_NAMES.FISHING]: {
      [BOOSTER_TYPES.BASIC]: { min: 5, max: 10 },
      [BOOSTER_TYPES.MEDIUM]: { min: 10, max: 20 },
      [BOOSTER_TYPES.PREMIUM]: { min: 15, max: 30 }
    },
    [PLACE_NAMES.MINING]: {
      [BOOSTER_TYPES.BASIC]: { min: 5, max: 10 },
      [BOOSTER_TYPES.MEDIUM]: { min: 10, max: 15 },
      [BOOSTER_TYPES.PREMIUM]: { min: 15, max: 25 }
    }
  },
  PRODUCTION_LIMIT_BY_LEVEL: {
    [PLACE_NAMES.FARM]: [0, 8, 10, 12, 15, 17, 19, 21, 23, 25, 28],
    [PLACE_NAMES.FISHING]: [0, 7, 9, 11, 14, 16, 18, 20, 22, 24, 27],
    [PLACE_NAMES.MINING]: [0, 6, 8, 10, 13, 15, 17, 19, 21, 23, 26]
  },
  STORAGE_PRICES: {
    [PLACE_NAMES.FARM]: 150,
    [PLACE_NAMES.FISHING]: 350,
    [PLACE_NAMES.MINING]: 550
  },
  STORAGES: {
    [PLACE_NAMES.FARM]: 480,
    [PLACE_NAMES.FISHING]: 90,
    [PLACE_NAMES.MINING]: 120
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
  SEQUENCE_OF_SESSIONS: [
    SEASON_NAMES.SPRING,
    SEASON_NAMES.SUMMER,
    SEASON_NAMES.AUTUMN,
    SEASON_NAMES.WINTER
  ]
}
