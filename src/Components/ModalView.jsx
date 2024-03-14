import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'

const ModalView = ({children, setShowModal,showModal,title}) => {  
    const closeModal = () => setShowModal(false);

  return (
    <Modal show={showModal} onHide={closeModal} className='modalShow'>
        <Modal.Header closeButton onClick={closeModal}>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {children}
        </Modal.Body>
    </Modal>
  )
}

export default ModalView