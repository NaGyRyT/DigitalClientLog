import React, { useState } from 'react'
import { OverlayTrigger, Tooltip, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import API from '../../../../api';

export default function Deletelog( {listItem, loadLogEntries} ) {
    const [showDeleteLogForm, setShowDeleteLogForm] = useState(false);
    const handleCloseDeleteLogForm = () => setShowDeleteLogForm(false);
    const handleShowDeleteLogForm = () => {
        setShowDeleteLogForm(true)};
    
    const handleDeleteLogSubmit = (e) => {
        e.preventDefault();
        axios.post(`${API.address}/deletelog`, {id : listItem.id})
            .then(() => {
                loadLogEntries(false);
                setShowDeleteLogForm(false);
            })        
    }
    
    const renderTooltip = (tooltip) => (
        <Tooltip id="delete-button-tooltip">
            {tooltip}
        </Tooltip>
        );
    return (
        <>
            <OverlayTrigger
                placement="top"
                delay={{ show: 50, hide: 100 }}
                overlay={renderTooltip('Törlés')}>
                <Button 
                    size="sm"
                    className="m-1"
                    variant="danger"
                    onClick={handleShowDeleteLogForm}>
                    &#128465;
                </Button>
            </OverlayTrigger>
            <Modal show={showDeleteLogForm} onHide={handleCloseDeleteLogForm} backdrop='static'>
                <Modal.Header closeButton>
                        <Modal.Title>Naplóbejegyzés törlése</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Valóban törölni szeretnéd
                    <span className='fw-bold text-danger'> {listItem.client_name}</span> ügyfélhez tartózó
                    <span className='fw-bold text-danger'> {listItem.id}.</span> sorszámú naplóbejegyzést?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteLogForm}>
                        Nem
                    </Button>
                    <Button variant="primary" onClick={handleDeleteLogSubmit}>
                        Igen
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
      )
    }
