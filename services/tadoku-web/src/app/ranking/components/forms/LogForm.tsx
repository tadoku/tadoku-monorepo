import React, { FormEvent, useState } from 'react'
import { allMedia } from '../../database'
import { connect } from 'react-redux'
import { RootState } from '../../../store'
import { RankingRegistration, ContestLog } from '../../interfaces'
import RankingApi from '@app/ranking/api'
import {
  Form,
  Group,
  Label,
  LabelText,
  Input,
  Select,
  RadioButton,
  GroupError,
  ErrorMessage,
} from '@app/ui/components/Form'
import { Button, StackContainer } from '@app/ui/components'
import { validateLanguageCode, validateAmount } from '../../domain'
import { rankingRegistrationMapper } from '../../transform/ranking-registration'
import { formatMediaUnit, formatLanguageName } from '../../transform/format'

interface Props {
  log?: ContestLog
  registration?: RankingRegistration | undefined
  onSuccess: () => void
  onCancel: () => void
}

const LogForm = ({
  log,
  registration,
  onSuccess: completed,
  onCancel: cancel,
}: Props) => {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(undefined as string | undefined)
  const [amount, setAmount] = useState(() => {
    if (log) {
      return log.amount.toString()
    }

    return ''
  })
  const [mediumId, setMediumId] = useState(() => {
    if (log) {
      return log.mediumId.toString()
    }

    return '1'
  })
  const [languageCode, setLanguageCode] = useState(() => {
    if (log) {
      return log.languageCode
    }

    return ''
  })
  const [description, setDescription] = useState(() => {
    if (log) {
      return log.description || ''
    }

    return ''
  })

  if (!registration) {
    return null
  }

  if (languageCode === '') {
    setLanguageCode(registration.languages[0])
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)

    let success: boolean

    switch (log) {
      case undefined:
        success = await RankingApi.createLog({
          contestId: registration.contestId,
          mediumId: Number(mediumId),
          amount: Number(amount),
          languageCode,
          description,
        })
        break
      default:
        success = await RankingApi.updateLog(log.id, {
          contestId: log.contestId,
          mediumId: Number(mediumId),
          amount: Number(amount),
          languageCode,
          description,
        })
        break
    }

    setSubmitting(false)

    if (!success) {
      setError(
        'Something went wrong with saving your update, please try again later.',
      )
    }

    completed()
  }

  const validate = () =>
    validateAmount(amount) && validateLanguageCode(languageCode)

  const hasError = {
    form: !validate(),
    amount: amount !== '' && !validateAmount(amount),
    languageCode: languageCode != '' && !validateLanguageCode(languageCode),
  }

  return (
    <Form onSubmit={submit}>
      <ErrorMessage message={error} />
      <Group>
        <Label>
          <LabelText>{formatMediaUnit(parseInt(mediumId))} read</LabelText>
          <Input
            type="number"
            placeholder="e.g. 7"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min={0}
            max={3000}
            step={0.1}
            error={hasError.amount}
          />
          <GroupError message="Invalid page count" hidden={!hasError.amount} />
        </Label>
      </Group>
      <Group>
        <Label>
          <LabelText>Medium</LabelText>
          <Select value={mediumId} onChange={e => setMediumId(e.target.value)}>
            {allMedia.map(m => (
              <option value={m.id} key={m.id}>
                {m.description}
              </option>
            ))}
          </Select>
        </Label>
      </Group>
      <Group>
        <Label>
          <LabelText>Description (optional)</LabelText>
          <Input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. One Piece volume 45"
          />
        </Label>
      </Group>
      {registration.languages.length > 1 && (
        <Group>
          <LabelText>Language</LabelText>
          {registration.languages.map(code => (
            <RadioButton
              key={code}
              type="radio"
              value={code}
              checked={code === languageCode}
              onChange={e => setLanguageCode(e.target.value)}
              label={formatLanguageName(code)}
            />
          ))}
          <GroupError
            message="Invalid language"
            hidden={!hasError.languageCode}
          />
        </Group>
      )}
      <Group>
        <StackContainer>
          <Button
            type="submit"
            disabled={hasError.form || submitting}
            loading={submitting}
            primary
          >
            Save changes
          </Button>
          <Button type="button" onClick={cancel}>
            Cancel
          </Button>
        </StackContainer>
      </Group>
    </Form>
  )
}

const mapStateToProps = (state: RootState, oldProps: Props) => ({
  ...oldProps,
  registration: rankingRegistrationMapper.optional.fromRaw(
    state.ranking.rawRegistration,
  ),
})

export default connect(mapStateToProps)(LogForm)
