import React from 'react'
import styled from 'styled-components'
import Constants from '../Constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SFC, SelectHTMLAttributes, InputHTMLAttributes } from 'react'

export const Form = styled.form``

export const Group = styled.div`
  position: relative;

  & + & {
    margin-top: 30px;
  }
`

export const ErrorMessage: SFC<{ message?: string }> = ({ message }) => (
  <StyledMessage
    hidden={!message}
    color={Constants.colors.destructive}
    background={Constants.colors.lightDestructive}
  >
    {message}
  </StyledMessage>
)

export const SuccessMessage: SFC<{ message?: string }> = ({ message }) => (
  <StyledMessage
    hidden={!message}
    color={Constants.colors.success}
    background={Constants.colors.lightSuccess}
  >
    {message}
  </StyledMessage>
)

interface MessageProps {
  hidden?: boolean
  color: string
  background: string
}

const StyledMessage = styled.p`
  ${({ hidden }: MessageProps) =>
    hidden &&
    `
    display: hidden;
    opacity: 0;
  `}

  ${({ color, background }: MessageProps) => `
    color: ${color};
    background-color: ${background};
    border: 1px solid ${background};
    box-shadow: 0px 2px 3px 0px ${background};
  `}
  padding: 12px;
  margin: 24px 0;
  border-radius: 3px;
  transition: all 0.2s ease;
`

export const Label = styled.label`
  display: block;

  & + & {
    margin-top: 12px;
  }
`
export const LabelText = styled.span`
  display: block;
  font-weight: 600;
  font-size: 1.1em;
  margin-bottom: 7px;
`

interface LabelForRadioProps {
  checked?: boolean
}

const RadioLabel = styled(Label)`
  display: flex;
  align-items: center;
  padding: 3px 8px;
  height: 44px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  border-bottom-width: 3px;

  ${({ checked }: LabelForRadioProps) =>
    checked &&
    `
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-bottom-width: 3px;

    span {
      font-weight: 600;
    }
  `}

  span {
    margin-left: 8px;
  }
`

const HiddenRadio = styled.input`
  display: none;
`

const StyledRadio = styled.span`
  display: inline-block;
  height: 10px;
  width: 10px;
  border-radius: 8px;
  border: 2px solid ${Constants.colors.secondary};
  transition: all 0.2s ease;
  position: relative;

  ${({ checked }: LabelForRadioProps) =>
    checked &&
    `
    background:  ${Constants.colors.primary};
    &:after {
      content: '';
      border: 0.5px solid white;
      position: absolute;
      left: 0px;
      right: 0px;
      top: 0;
      bottom: 0;
      border-radius: 8px;
    }
  `}
`

export const RadioButton: SFC<
  InputHTMLAttributes<HTMLInputElement> & {
    label: string
  }
> = ({ label, checked, ...props }) => (
  <RadioLabel checked={checked}>
    <HiddenRadio type="radio" {...props} checked={checked} />
    <StyledRadio checked={checked} />
    <span>{label}</span>
  </RadioLabel>
)

export const SelectGroup = styled.div`
  position: relative;
`

const SelectArrow = styled(FontAwesomeIcon)`
  font-size: 12px;
  position: absolute;
  top: 16px;
  right: 16px;
  color: #434b67;
  pointer-events: none;
`

export const Select: SFC<SelectHTMLAttributes<HTMLSelectElement>> = ({
  children,
  ...props
}) => (
  <SelectGroup>
    <SelectArrow icon="chevron-down" />
    <StyledSelect {...props}>{children}</StyledSelect>
  </SelectGroup>
)

const StyledSelect = styled.select`
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-bottom-width: 3px;
  border-radius: 0;
  background: ${Constants.colors.light};
  padding: 4px 20px 4px 12px;
  font-size: 1.1em;
  height: 44px;
  width: 100%;
  box-sizing: border-box;
`

export const Input = styled.input`
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-bottom-width: 3px;
  border-radius: 0;
  background: ${Constants.colors.light};
  padding: 4px 12px;
  font-size: 1.1em;
  height: 44px;
  width: 100%;
  box-sizing: border-box;

  ${({ error }: Errorable) =>
    error &&
    `
    border: 1px solid ${Constants.colors.destructive};
  `}
`

interface Errorable {
  error?: boolean
}

export const GroupError: SFC<{ message: string; hidden: boolean }> = ({
  message,
  hidden,
}) => <StyledGroupError hidden={hidden}>{message}</StyledGroupError>

const StyledGroupError = styled.span`
  margin-top: 4px;
  font-size: 0.7em;
  display: block;
  width: 100%;
  text-align: right;
  color: ${Constants.colors.destructive};
  transition: all 0.2s ease;
  position: absolute;

  ${({ hidden }: { hidden: boolean }) =>
    hidden &&
    `
    font-size: 0;
    opacity: 0;
    display: none;
  `}
`
