import React, { useState, SFC } from 'react'
import { Button } from './index'
import styled, { keyframes, css } from 'styled-components'
import Constants from '../Constants'

interface Props {
  label: string
}

const Dropdown: SFC<Props> = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Container>
      <TriggerButton
        onClick={() => setIsOpen(!isOpen)}
        icon={isOpen ? 'chevron-up' : 'chevron-down'}
        plain
        alignIconRight
        open={isOpen}
      >
        {label}
      </TriggerButton>
      <StyledDropdown open={isOpen} onClick={() => setIsOpen(false)}>
        {children}
      </StyledDropdown>
      <DropdownOverlay open={isOpen} onClick={() => setIsOpen(false)} />
    </Container>
  )
}

export default Dropdown

const Container = styled.div`
  position: relative;
`

const TriggerButton = styled(Button)`
  position: relative;
  z-index: 3;
  margin: 0 20px 0 0;
  text-decoration: none;

  &:after {
    ${({ open }: { open: boolean }) =>
      open &&
      `
    display: none;
    `}
  }
`

const show = keyframes`
  from {
      opacity: 0;
  }
  to {
      opacity: 1;
  }
`

const StyledDropdown = styled.ul`
  display: none;
  position: absolute;
  top: 0;
  right: 0px;
  z-index: 2;
  width: calc(100% + 20px);
  min-width: 120px;
  list-style: none;
  box-sizing: border-box;
  margin: 0;
  padding: 48px 0 0;

  background: ${Constants.colors.light};
  box-shadow: 0 2px 4px 0px rgba(0, 0, 0, 0.08);
  border-radius: 2px;
  border: 1px solid ${Constants.colors.lightGray};

  ${({ open }: { open: boolean }) =>
    open &&
    css`
      display: block;
      animation: ${show} 0.3s ease;
    `}
`

const DropdownOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  margin: 0 !important;

  background: none;

  ${({ open }: { open: boolean }) =>
    open &&
    css`
      display: block;
      animation: ${show} 0.3s ease;
    `}
`

export const DropdownItem = styled.li`
  padding: 0;
  margin: 0;
  transition: all 0.2s ease;
  border-top: 1px solid ${Constants.colors.lightGray};

  button,
  a {
    padding: 2px 12px;
    margin: 0;
    width: 100%;
    border-radius: 0;
    justify-content: flex-start;

    &:last-child {
      border-radius: 0 0 2px 2px;
    }

    &:hover:not([disabled]),
    &:active:not([disabled]) {
      background: ${Constants.colors.darkWithAlpha(0.05)};
      &:after {
        display: none;
      }
    }
  }
`
