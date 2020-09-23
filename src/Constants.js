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

const RESOURCE_NAMES = {
  FOOD: 'food',
  FISH: 'fish',
  METAL: 'metal'
}

const BOOSTER_NAMES = {
  FERTILIZER: 'fertilizer',
  WORMS: 'worms',
  ENERGETIC: 'energetic'
}

const BOOSTER_TYPES = {
  BASIC: 'basic',
  MEDIUM: 'medium',
  PREMIUM: 'premium'
}

module.exports = {
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
    'seasons',
    'ranking',
    'administration',
    'others'
  ],
  DAILY_COOLDOWN: 72000000,
  SEASON_NAMES,
  PLACE_NAMES,
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
    [PLACE_NAMES.FISHING]: BOOSTER_NAMES.WORMS,
    [PLACE_NAMES.MINING]: BOOSTER_NAMES.ENERGETIC
  },
  RESOURCE_NAMES,
  PLACES: Object.values(PLACE_NAMES),
  PLACE_START_LEVEL: 1,
  PLACE_MAX_LEVEL: 10,
  PLACE_MIN_LEVEL: 1,
  PLACE_GENERATE: {
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
  STORAGES_SIZE: {
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
  ],
  EMOJIS: {
    money: '💰',
    star: '⭐',
    month: '📅',
    cloud: '☁️',
    spring: '🌺',
    summer: '☀️',
    autumn: '🍂',
    winter: '❄️',
    key: '🔑',
    pencil: '✏️',
    picture: '🖼️',
    books: '📚',
    graph: '📊',
    antenna: '📡',
    lamp: '💡',
    beatingHeart: '💓',
    abacus: '🧮',
    wrench: '🔧',
    farm: '🌳',
    fishing: '⛵',
    mining: '⛏',
    food: ['🥕', '🌽', '🍅', '🍍', '🍆', '🥔', '🥒', '🥦'],
    fish: ['🐟', '🐠', '🦐', '🐡', '🦀', '🦑', '🐙'],
    metal: ['💎'],
    storage: '📥',
    production: '🏭',
    produced: '📬',
    scarecrow: '<:scarecrow:698353463716741182>',
    fence: '<:fence:698353484017303603>',
    fertilizer: {
      basic: '<:fertilizer_1:698353399871176704>',
      medium: '<:fertilizer_2:698353438001594418>',
      premium: '<:fertilizer_3:698353438093869076>'
    },
    worms: {
      basic: '<:worms_1:698353333672607744>',
      medium: '<:worms_2:698353363971997756>',
      premium: '<:worms_3:698353379599974480>'
    },
    energetic: {
      basic: '<:energetic_1:698353310062870590>',
      medium: '<:energetic_2:698353310071259207>',
      premium: '<:energetic_3:698353310289100903>'
    }
  }
}
