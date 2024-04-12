import React, { useState } from 'react';
import { OverlayTrigger, Tooltip, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import API from '../../../../api';

export default function Deleteclient( {listItem, loadClientList, loggedInUserData} ) {
    const [showDeleteClientForm, setShowDeleteClientForm] = useState(false);
    const [existClientIdInLog, setExistClientIdInLog] = useState(true)
    const handleCloseDeleteClientForm = (e) => {
        setShowDeleteClientForm(false);
    };
    const handleShowDeleteClientForm = async (e) => {
        e.stopPropagation();
        setExistClientIdInLog(await checkExistClientIdInLog());
        setShowDeleteClientForm(true)};
    const handleDeleteClientSubmit = (e) => {
        e.preventDefault();
        axios.post(`${API.address}/deleteclient`, {id : listItem.id}, {headers: { 'x-api-key': loggedInUserData.password }})
            .then(() => {
                loadClientList(false);
                setShowDeleteClientForm(false);
            })        
    };

    async function checkExistClientIdInLog() {
        let existClientIdInLog;
        await axios.post(`${API.address}/checkexistclientidinlog`, {clientid : listItem.id}, {headers: { 'x-api-key': loggedInUserData.password }})
        .then((data) => {
            if (data.data.length === 0) existClientIdInLog = false;
            else existClientIdInLog = true;
        })
        return existClientIdInLog
    };
    
    const renderTooltip = (props) => (
        <Tooltip id="delete-button-tooltip" {...props}>
            Törlés
        </Tooltip>
        );
    
      return (
        <>
            <OverlayTrigger
                placement="top"
                delay={{ show: 50, hide: 100 }}
                overlay={renderTooltip}
            >
                <Button 
                    size="sm"
                    className="m-1"
                    variant="danger"
                    onClick={handleShowDeleteClientForm}>
                    &#128465;
                </Button>
            </OverlayTrigger>
            <Modal show={showDeleteClientForm} onHide={handleCloseDeleteClientForm} backdrop='static' onClick={(e)=>e.stopPropagation()}>
                <Modal.Header closeButton>
                        <Modal.Title>Ügyfél törlése</Modal.Title>
                </Modal.Header>
                {existClientIdInLog ?
                <>
                <Modal.Body>
                    Az ügyfélhez tartozik naplóbejegyzés ezért nem törölhető.
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={handleCloseDeleteClientForm}>
                    Ok
                </Button>
                </Modal.Footer>
                </> :
                <>
                <Modal.Body>
                    Valóban törölni szeretnéd {listItem.name} ügyfelet?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteClientForm}>
                        Nem
                    </Button>
                    <Button variant="primary" onClick={handleDeleteClientSubmit}>
                        Igen
                    </Button>
                </Modal.Footer>
                </>
                }
            </Modal>
        </>
      )
    }
