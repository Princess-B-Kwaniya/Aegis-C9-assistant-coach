// Team data extracted and curated for the Aegis coaching platform
// These teams represent competitive esports organizations

export const valorantTeams = [
  // NA Teams
  'Cloud9',
  'Sentinels',
  'OpTic Gaming',
  'NRG Esports',
  '100 Thieves',
  'Evil Geniuses',
  'LOUD',
  'XSET',
  'FaZe Clan',
  'TSM',
  'Version1',
  'The Guard',
  'Ghost Gaming',
  'Luminosity Gaming',
  
  // EMEA Teams
  'Fnatic',
  'Team Liquid',
  'G2 Esports',
  'Team Vitality',
  'FUT Esports',
  'Natus Vincere',
  'BBL Esports',
  'KOI',
  'Giants Gaming',
  'Karmine Corp',
  
  // Pacific Teams
  'DRX',
  'T1',
  'Gen.G',
  'Paper Rex',
  'ZETA DIVISION',
  'DetonatioN FocusMe',
  'Team Secret',
  'Talon Esports',
  'Rex Regum Qeon',
  'Global Esports',
  
  // CN Teams
  'EDward Gaming',
  'FunPlus Phoenix',
  'Bilibili Gaming',
  'Trace Esports',
  'All Gamers',
  'Wolves Esports',
  'Nova Esports',
  'Dragon Ranger Gaming',
  
  // Other
  'MIBR',
  'Leviatán',
  'KRÜ Esports',
  'Furia',
];

export const lolTeams = [
  // LCS (NA)
  'Cloud9',
  'Team Liquid',
  '100 Thieves',
  'Evil Geniuses',
  'TSM',
  'FlyQuest',
  'Golden Guardians',
  'Dignitas',
  'CLG',
  'Immortals',
  'NRG Esports',
  
  // LEC (EU)
  'Fnatic',
  'G2 Esports',
  'MAD Lions',
  'Rogue',
  'Team Vitality',
  'Excel Esports',
  'SK Gaming',
  'Astralis',
  'Team BDS',
  'Team Heretics',
  
  // LCK (Korea)
  'T1',
  'Gen.G',
  'DRX',
  'Dplus KIA',
  'KT Rolster',
  'Hanwha Life Esports',
  'Liiv SANDBOX',
  'Nongshim RedForce',
  'Kwangdong Freecs',
  'BRO',
  
  // LPL (China)
  'JD Gaming',
  'Bilibili Gaming',
  'LNG Esports',
  'Weibo Gaming',
  'Top Esports',
  'EDward Gaming',
  'Royal Never Give Up',
  'FunPlus Phoenix',
  'ThunderTalk Gaming',
  'OMG',
  
  // Other
  'LOUD',
  'paiN Gaming',
  'DetonatioN FocusMe',
  'GAM Esports',
  'PSG Talon',
];

export function searchTeams(query: string, game: 'valorant' | 'lol'): string[] {
  const teams = game === 'valorant' ? valorantTeams : lolTeams;
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return teams.filter(team => 
    team.toLowerCase().includes(lowerQuery)
  ).slice(0, 8); // Limit to 8 suggestions
}

export function isValidTeam(teamName: string, game: 'valorant' | 'lol'): boolean {
  const teams = game === 'valorant' ? valorantTeams : lolTeams;
  return teams.some(team => team.toLowerCase() === teamName.toLowerCase());
}
