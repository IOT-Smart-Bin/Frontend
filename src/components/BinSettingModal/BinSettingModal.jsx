/* eslint-disable react/prop-types */

import { useState } from "react"
import { Button, DropdownButton, Modal } from "react-bootstrap"
import DropdownItem from "react-bootstrap/esm/DropdownItem"
import "./bin-setting-modal.css"

const availTimeSetting = ["hour", "day", "month", "year"]

const BinSettingModal = ({ handleClose, show, settingChange }) => {
  const [timeUnitSetting, setTimeUnit] = useState(availTimeSetting[0]);
  const [numberInput, setNumberInput] = useState(14);

  const handleSettingChange = () => {
    console.table({
      time: timeUnitSetting,
      number: numberInput
    })
    settingChange({
      timeValue: -1 * numberInput,
      timeUnit: timeUnitSetting
    });
    handleClose();
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
    >
      <Modal.Header>
        <Modal.Title>
          Setting
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>View Until</p>
        <input type="number" value={numberInput} onChange={() => setNumberInput(event.target.value)} />
        <DropdownButton className="my-3" title={`Unit: ${timeUnitSetting}`}>
          {
            availTimeSetting.map((time) =>
              <DropdownItem
                active={time === timeUnitSetting}
                key={time}
                onClick={() => setTimeUnit(time)}
              >
                {time}
              </DropdownItem>)
          }
        </DropdownButton>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSettingChange}>Confirm</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default BinSettingModal
