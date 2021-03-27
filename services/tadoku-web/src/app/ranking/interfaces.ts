export interface Ranking {
  contestId: number
  userId: number
  userDisplayName: string
  languageCode: string
  amount: number
}

export interface RawRanking {
  contest_id: number
  user_id: number
  user_display_name: string
  language_code: string
  amount: number
}

export interface RankingWithRank {
  rank: number
  tied: boolean
  data: Ranking
}

export interface RankingRegistrationOverview {
  contestId: number
  userId: number
  userDisplayName: string

  registrations: {
    languageCode: string
    amount: number
  }[]
}

export interface RankingRegistration {
  start: Date
  end: Date
  contestId: number
  languages: string[]
}

export interface RawRankingRegistration {
  start: string
  end: string
  contest_id: number
  languages: string[]
}

export interface Medium {
  id: number
  description: string
  unit: string
}

export interface Language {
  code: string
  name: string
}

export interface ContestLog {
  id: number
  contestId: number
  userId: number
  userDisplayName?: string
  languageCode: string
  mediumId: number
  amount: number
  adjustedAmount: number
  description?: string
  date: Date
}

export interface RawContestLog {
  id: number
  contest_id: number
  user_id: number
  user_display_name?: string
  language_code: string
  medium_id: number
  amount: number
  adjusted_amount: number
  description: string
  date: string
}
