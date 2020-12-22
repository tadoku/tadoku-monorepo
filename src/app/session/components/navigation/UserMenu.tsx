import React from 'react'
import LogOutLink from './LogOut'
import Dropdown, { DropdownItem } from '@app/ui/components/Dropdown'
import { ButtonLink } from '@app/ui/components'
import Link from 'next/link'
import { SettingsTab } from '@app/user/interfaces'

import { RankingRegistration } from '@app/ranking/interfaces'
import { User } from '../../interfaces'
import styled from 'styled-components'
import Constants from '@app/ui/Constants'
import { isAdmin } from '@app/session/domain'

interface Props {
  user: User
  registration: RankingRegistration | undefined
}

const SettingsLink = () => (
  <Link href="/settings/[tab]" as={`/settings/${SettingsTab.Profile}`} passHref>
    <ButtonLink plain icon="cog">
      Settings
    </ButtonLink>
  </Link>
)

const AdminLink = () => (
  <Link href="/manage" passHref>
    <ButtonLink plain icon="tools">
      Admin
    </ButtonLink>
  </Link>
)

const ContestProfileLink = ({
  user,
  registration,
}: {
  user: User
  registration: RankingRegistration
}) => {
  return (
    <Link
      href="/contest-profile/[contest_id]/[user_id]"
      as={`/contest-profile/${registration.contestId}/${user.id}`}
      passHref
    >
      <ButtonLink plain icon="user">
        Profile
      </ButtonLink>
    </Link>
  )
}

const UserMenuDropdown = ({ user, registration }: Props) => (
  <Dropdown label={user.displayName}>
    {isAdmin(user) && (
      <DropdownItem>
        <AdminLink />
      </DropdownItem>
    )}
    <DropdownItem>
      <SettingsLink />
    </DropdownItem>
    {registration && (
      <DropdownItem>
        <ContestProfileLink user={user} registration={registration} />
      </DropdownItem>
    )}
    <DropdownItem>
      <LogOutLink />
    </DropdownItem>
  </Dropdown>
)

const UserMenuList = ({ user, registration }: Props) => (
  <List>
    <ListItem>
      <DisplayName>{user.displayName}</DisplayName>
    </ListItem>
    {isAdmin(user) && (
      <ListItem>
        <AdminLink />
      </ListItem>
    )}
    <ListItem>
      <SettingsLink />
    </ListItem>
    {registration && (
      <ListItem>
        <ContestProfileLink user={user} registration={registration} />
      </ListItem>
    )}
    <ListItem>
      <LogOutLink />
    </ListItem>
  </List>
)

const ListItem = styled.li`
  margin-left: 0;
  border-bottom: 1px solid ${Constants.colors.lightGray};
  display: block;

  > a,
  > button {
    width: 100%;
    padding-left: 30px;
    align-items: center;
    justify-content: flex-start;

    &:after {
      bottom: 0 !important;
    }
  }

  &:last-child {
    border: none;
  }
`

const List = styled.ul`
  margin: 0;
  padding: 0;
`

const DisplayName = styled.div`
  padding: 0 30px;
  font-weight: 600;
  font-size: 24px;
  height: 55px;
  line-height: 55px;
  background: ${Constants.colors.lighter};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  box-sizing: border-box;
`

export default { Dropdown: UserMenuDropdown, List: UserMenuList }
