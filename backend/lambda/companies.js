// Add/remove companies freely. type: 'greenhouse' | 'lever'
//
// Not included (no Greenhouse/Lever board found):
//   Rocky Mountain Institute → Workday
//   Environmental Defense Fund, Earthjustice, The Marshall Project,
//   The Nature Conservancy, Rewiring America, Union of Concerned Scientists
//   → custom ATS or Workday
//   USDS, 18F, NCAR, NOAA, NASA JPL, USGS, EPA → USAJOBS / .gov portals

export const COMPANIES = [
  // ── Climate: Earth Observation & Intelligence ──────────────────────────
  { id: 'planetlabs',  name: 'Planet Labs',   type: 'greenhouse', slug: 'planetlabs',  sector: 'climate', orgType: 'startup'   },
  { id: 'tomorrow',    name: 'Tomorrow.io',   type: 'greenhouse', slug: 'tomorrow',    sector: 'climate', orgType: 'startup'   },
  { id: 'spire',       name: 'Spire Global',  type: 'greenhouse', slug: 'spire',       sector: 'climate', orgType: 'startup'   },
  { id: 'climateai',   name: 'ClimateAI',     type: 'greenhouse', slug: 'climateai',   sector: 'climate', orgType: 'startup'   },

  // ── Climate: Carbon & Decarbonization ─────────────────────────────────
  { id: 'watershed',   name: 'Watershed',     type: 'greenhouse', slug: 'watershedclimate', sector: 'climate', orgType: 'b-corp'  },
  { id: 'arcadia',     name: 'Arcadia',       type: 'greenhouse', slug: 'arcadia',     sector: 'climate', orgType: 'b-corp'    },
  { id: 'persefoni',   name: 'Persefoni',     type: 'greenhouse', slug: 'persefoni',   sector: 'climate', orgType: 'startup'   },
  { id: 'pachama',     name: 'Pachama',       type: 'greenhouse', slug: 'pachama',     sector: 'climate', orgType: 'startup'   },

  // ── Climate: Nonprofits & Research ────────────────────────────────────
  { id: 'firststreet',    name: 'First Street Foundation',   type: 'greenhouse', slug: 'firststreet',    sector: 'climate', orgType: 'nonprofit' },
  { id: 'wri',            name: 'World Resources Institute', type: 'greenhouse', slug: 'wri',            sector: 'climate', orgType: 'nonprofit' },
  { id: 'refed',          name: 'ReFED',                     type: 'lever',      slug: 'refed',          sector: 'climate', orgType: 'nonprofit' },
  { id: 'openclimatefix', name: 'Open Climate Fix',          type: 'lever',      slug: 'openclimatefix', sector: 'climate', orgType: 'nonprofit' },

  // ── Civic: Government Digital Services ───────────────────────────────
  { id: 'codeforamerica', name: 'Code for America', type: 'greenhouse', slug: 'codeforamerica', sector: 'civic', orgType: 'nonprofit' },
  { id: 'nava',           name: 'Nava PBC',          type: 'greenhouse', slug: 'navapbc',        sector: 'civic', orgType: 'pbc'       },
  { id: 'adhoc',          name: 'Ad Hoc',            type: 'greenhouse', slug: 'adhoc',          sector: 'civic', orgType: 'pbc'       },
  { id: 'skylight',       name: 'Skylight Digital',  type: 'greenhouse', slug: 'skylighthq',     sector: 'civic', orgType: 'pbc'       },

  // ── Civic: Justice, Research & Journalism ────────────────────────────
  { id: 'recidiviz',  name: 'Recidiviz',                 type: 'greenhouse', slug: 'recidiviz',              sector: 'civic', orgType: 'nonprofit' },
  { id: 'vera',       name: 'Vera Institute of Justice', type: 'greenhouse', slug: 'verainstituteofjustice', sector: 'civic', orgType: 'nonprofit' },
  { id: 'propublica', name: 'ProPublica',                type: 'greenhouse', slug: 'propublica',             sector: 'civic', orgType: 'nonprofit' },

  // ── Civic: Education & Global Health ─────────────────────────────────
  { id: 'khanacademy', name: 'Khan Academy', type: 'greenhouse', slug: 'khanacademy', sector: 'civic', orgType: 'nonprofit' },
  { id: 'dimagi',      name: 'Dimagi',       type: 'greenhouse', slug: 'dimagi',      sector: 'civic', orgType: 'b-corp'    },

  // ── Civic: Geospatial & Transit ───────────────────────────────────────
  { id: 'azavea',  name: 'Azavea',  type: 'lever', slug: 'azavea',  sector: 'civic', orgType: 'b-corp'  },
  { id: 'swiftly', name: 'Swiftly', type: 'lever', slug: 'goswift', sector: 'civic', orgType: 'startup' },

  // ── Workday ───────────────────────────────────────────────────────────
  // tenant + instance + board derived from each org's myworkdayjobs.com URL
  { id: 'rmi', name: 'Rocky Mountain Institute',  type: 'workday', tenant: 'rockymountain', instance: 'wd1',   board: 'RMI',                sector: 'climate', orgType: 'nonprofit' },
  { id: 'tnc', name: 'The Nature Conservancy',    type: 'workday', tenant: 'nature',        instance: 'wd108', board: 'ExternalCareers',    sector: 'climate', orgType: 'nonprofit' },
  { id: 'edf', name: 'Environmental Defense Fund', type: 'workday', tenant: 'osv-edf',      instance: 'wd5',   board: 'EDF_External_Careers', sector: 'climate', orgType: 'nonprofit' },
]
