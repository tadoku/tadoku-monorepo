import { useDispatch } from 'react-redux'
import { Contest } from '../interfaces'
import ContestApi from '../api'
import { updateRecentContests } from '../redux'
import { useCachedApiState } from '../../cache'
import { ContestMapper, ContestsSerializer } from '../transform'

const ContestEffects = () => {
  const dispatch = useDispatch()

  const update = (contests: Contest[]) => {
    const rawContests = contests.map(ContestMapper.toRaw)
    dispatch(updateRecentContests(rawContests))
  }

  useCachedApiState({
    cacheKey: `recent_contest?i=1`,
    defaultValue: [] as Contest[],
    fetchData: async () => await ContestApi.getAll(5),
    onChange: update,
    serializer: ContestsSerializer,
  })

  return null
}

export default ContestEffects
