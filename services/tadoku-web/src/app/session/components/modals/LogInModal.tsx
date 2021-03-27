import React from 'react'
import LogInForm from '../forms/LogInForm'
import Modal from '@app/ui/components/Modal'

const LogInModal = ({
  isOpen,
  onSuccess,
  onCancel,
}: {
  isOpen: boolean
  onSuccess: () => void
  onCancel: () => void
}) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onCancel} contentLabel="Sign in">
      <LogInForm onSuccess={onSuccess} onCancel={onCancel} />
    </Modal>
  )
}

export default LogInModal
