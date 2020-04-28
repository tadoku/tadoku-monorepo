import { languageByCode } from './database'
import { Contest } from '../contest/interfaces'
import { RankingRegistration } from './interfaces'
import { User } from '../session/interfaces'

export const validateAmount = (amount: string): boolean =>
  Number(amount) !== NaN && Number(amount) > 0

export const validateLanguageCode = (code: string): boolean =>
  code != '' && languageByCode[code] !== undefined

export const isContestActive = (contest: Contest): boolean =>
  contest.open && contest.end > new Date()

export const isRegisteredForContest = (
  registration: RankingRegistration | undefined,
  contest: Contest,
): boolean => registration?.contestId === contest.id

export const canJoinContest = (
  user: User | undefined,
  registration: RankingRegistration | undefined,
  contest: Contest,
) =>
  user &&
  contest &&
  isContestActive(contest) &&
  !isRegisteredForContest(registration, contest)
