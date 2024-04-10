import React, { useState } from 'react'
import { OverlayTrigger, Tooltip, Button, Modal, CloseButton } from 'react-bootstrap';
import axios from 'axios';
import API from '../../../../api';

export default function Deletelog( {listItem, loadLogEntries, loggedInUserData, buttonTitle} ) {
    const [showDeleteLogForm, setShowDeleteLogForm] = useState(false);
    const handleCloseDeleteLogForm = (e) => {
        e.stopPropagation();
        setShowDeleteLogForm(false);
    }
    const handleShowDeleteLogForm = (e) => {
        e.stopPropagation();
        setShowDeleteLogForm(true);
    };
    
    const handleDeleteLogSubmit = (e) => {
        e.stopPropagation();
        e.preventDefault();
        axios.post(`${API.address}/deletelog`, {id : listItem.id}, {headers: { 'x-api-key': loggedInUserData.password }})
            .then(() => {
                loadLogEntries(false);
                setShowDeleteLogForm(false);
            })        
    }
    
    const renderTooltip = (prop) => (
        <Tooltip id='delete-button-tooltip'{...prop}>
            Törlés
        </Tooltip>
        );
    return (
        <>
            <OverlayTrigger
                placement='top'
                delay={{ show: 50, hide: 100 }}
                overlay={renderTooltip}>
                <Button 
                    size={buttonTitle === undefined ? 'sm' : ''}
                    className='m-1'
                    variant='danger'
                    onClick={handleShowDeleteLogForm}>
                    &#128465;
                    {buttonTitle}
                </Button>
            </OverlayTrigger>
            <Modal show={showDeleteLogForm} backdrop='static' onClick={(e)=>e.stopPropagation()}>
                <Modal.Header>
                    <Modal.Title>Naplóbejegyzés törlése</Modal.Title>
                    <CloseButton className='justify-content-end' onClick={handleCloseDeleteLogForm}/>
                </Modal.Header>
                <Modal.Body>
                    Valóban törölni szeretnéd
                    <span className='fw-bold text-danger'> {listItem.client_name}</span> ügyfélhez tartózó
                    <span className='fw-bold text-danger'> {listItem.id}.</span> sorszámú naplóbejegyzést?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleCloseDeleteLogForm}>
                        Nem
                    </Button>
                    <Button variant='primary' onClick={handleDeleteLogSubmit}>
                        Igen
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
      )
    }
