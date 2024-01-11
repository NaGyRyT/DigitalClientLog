import React, { useEffect, useState } from 'react'
import { OverlayTrigger, Tooltip, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

export default function Deleteuser( {listItem, loadUserList} ) {
    const [showDeleteUserForm, setShowDeleteUserForm] = useState(false);
    const [existUserIdInLog, setExistUserIdInLog] = useState(false)

    useEffect(()=> {
        const callApi = async () => {
            setExistUserIdInLog(await checkExistUserIdInLog());
        }
        callApi()
    }, []);

    const handleCloseDeleteUserForm = () => setShowDeleteUserForm(false);
    const handleShowDeleteUserForm = () => setShowDeleteUserForm(true);

    const handleDeleteUserSubmit = async (e) => {
        e.preventDefault();
        if (existUserIdInLog) {
            axios.post('http://localhost:8080/inactiveuser', {id : listItem.id})
            .then(() => {
                loadUserList(false);
                setShowDeleteUserForm(false);
            })
        } else {
            axios.post('http://localhost:8080/deleteuser', {id : listItem.id})
            .then(() => {
                loadUserList(false);
                setShowDeleteUserForm(false);
            })
        }
    }

    async function checkExistUserIdInLog() {
        let existUserIdInLog;
        await axios.post('http://localhost:8080/checkExistUserIdInLog', {userid : listItem.id})
        .then((data) => {
            if (data.data.length === 0) existUserIdInLog = false;
            else existUserIdInLog = true;
        })
        return existUserIdInLog;
    }
    
    const renderTooltip = (props) => (
        <Tooltip id="delete-button-tooltip" {...props}>
            Törlés/Inaktiválás
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
                    onClick={handleShowDeleteUserForm}>
                    &#128465;
                </Button>
            </OverlayTrigger>
            <Modal show={showDeleteUserForm} onHide={handleCloseDeleteUserForm} backdrop='static'>
                <Modal.Header closeButton>
                        <Modal.Title>Felhasználó törlése</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Valóban <span className='fw-bold text-danger'>{existUserIdInLog ? 'inaktiválni' : 'törölni'}</span> szeretnéd {listItem.username} felhasználót?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteUserForm}>
                        Nem
                    </Button>
                    <Button variant="primary" onClick={handleDeleteUserSubmit}>
                        Igen
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
      )
    }
