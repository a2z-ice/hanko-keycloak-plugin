import * as React from 'react'
import { fetchApi } from '../utils/fetchApi'
import { Device } from '../models/Device'
import * as moment from 'moment'
import { PopupDialog } from './PopupDialog'
import { FormattedMessage } from 'react-intl'

import EditIcon from '../images/edit.svg'
import CancelIcon from '../images/cancel.svg'
import DeleteIcon from '../images/delete.svg'
import SaveIcon from '../images/save.svg'
import { Input } from '../atoms/Input'

type DeviceProps = {
  device: Device
  keycloak: Keycloak.KeycloakInstance
  deviceDeletedHandler: () => void
  startEditHandler: () => void
  stopEditHandler: (shouldRefetch: boolean) => void
  confirmDeregistration: boolean
  isEditing: boolean
  editingIndex: number | undefined
}

type DeviceState = {
  showConfirmationDialog: boolean
  newDeviceName: string
}

export class DeviceComponent extends React.Component<DeviceProps, DeviceState> {
  constructor(props: DeviceProps) {
    super(props)
    this.state = {
      showConfirmationDialog: false,
      newDeviceName: props.device.name
    }
  }

  showConformationDialog = () => {
    this.setState({ showConfirmationDialog: true })
  }

  hideConfirmationDialog = () => {
    this.setState({ showConfirmationDialog: false })
  }

  confirmOrDeregister = () => {
    if (this.props.confirmDeregistration) {
      this.showConformationDialog()
    } else {
      this.deregister()
    }
  }

  startEdit = () => {
    this.setState({ newDeviceName: this.props.device.name })
    this.props.startEditHandler()
  }

  cancelEdit = () => {
    this.props.stopEditHandler(false)
  }

  finishEdit = () => {
    const { newDeviceName } = this.state
    const {
      keycloak,
      device: { deviceId }
    } = this.props

    fetchApi(keycloak, `/hanko/devices/${deviceId}`, 'POST', {
      newName: newDeviceName
    })
      .then(_ => {
        this.props.stopEditHandler(true)
      })
      .catch(reason => {
        console.error(reason)
        this.props.stopEditHandler(true)
      })
  }

  deregister = () => {
    const { device, keycloak, deviceDeletedHandler } = this.props

    this.hideConfirmationDialog()

    fetchApi(
      keycloak,
      `/hanko/devices/${device.typeId}/${device.deviceId}`,
      'DELETE'
    ).then(_ => {
      deviceDeletedHandler()
    })

    return false
  }

  nameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDeviceName: event.target.value })
  }

  componentDidUpdate() {
    if (this.nameInput) {
      this.nameInput.focus()
      this.nameInput.select()
    }
  }

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.finishEdit()
    }
  }

  nameInput: HTMLInputElement | null

  render() {
    const { device, isEditing } = this.props
    const { showConfirmationDialog, newDeviceName } = this.state

    return (
      <tr>
        <td style={{ width: '30%' }}>
          {isEditing ? (
            <Input
              value={newDeviceName}
              onChange={this.nameChanged}
              handleEnter={this.finishEdit}
            />
          ) : (
            device.name
          )}
        </td>
        <td>{device.type}</td>
        <td>{moment(device.createdAt).fromNow()}</td>
        <td>{moment(device.lastUsage).fromNow()}</td>
        <td>
          {isEditing ? (
            <div className="spread">
              <FormattedMessage
                id="DeviceComponent.saveButton"
                defaultMessage="save"
              >
                {content => <SaveIcon onClick={this.finishEdit} />}
              </FormattedMessage>
              <FormattedMessage
                id="DeviceComponent.cancelButton"
                defaultMessage="cancel"
              >
                {content => <CancelIcon onClick={this.cancelEdit} />}
              </FormattedMessage>
            </div>
          ) : (
            <div className="spread">
              <FormattedMessage
                id="DeviceComponent.editButton"
                defaultMessage="edit"
              >
                {content => (
                  <EditIcon onClick={this.startEdit}>
                    <title>TEST</title>
                  </EditIcon>
                )}
              </FormattedMessage>
              <FormattedMessage
                id="DeviceComponent.deleteButton"
                defaultMessage="delete"
              >
                {content => <DeleteIcon onClick={this.confirmOrDeregister} />}
              </FormattedMessage>
            </div>
          )}

          {showConfirmationDialog ? (
            <PopupDialog>
              <FormattedMessage
                id="DeviceComponent.warningHeader"
                defaultMessage="Warning"
              >
                {content => <h3>{content}</h3>}
              </FormattedMessage>
              <FormattedMessage
                id="DeviceComponent.warningMessage"
                defaultMessage="You are about to delete your last device. You will not be able to login unless you register another device."
              >
                {content => <p>{content}</p>}
              </FormattedMessage>
              <div className="button-list pull-right">
                <FormattedMessage
                  id="DeviceComponent.cancelButton"
                  defaultMessage="cancel"
                >
                  {content => (
                    <button
                      className="small"
                      onClick={this.hideConfirmationDialog}
                    >
                      {content}
                    </button>
                  )}
                </FormattedMessage>

                <FormattedMessage
                  id="DeviceComponent.confirmButton"
                  defaultMessage="confirm"
                >
                  {content => (
                    <button className="small" onClick={this.deregister}>
                      {content}
                    </button>
                  )}
                </FormattedMessage>
              </div>
            </PopupDialog>
          ) : null}
        </td>
      </tr>
    )
  }
}
