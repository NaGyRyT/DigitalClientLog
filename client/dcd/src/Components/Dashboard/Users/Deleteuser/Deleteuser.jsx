import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import API from '../../../../api';

export default function Deleteuser( {listItem, loadUserList, loggedInUserData, buttonTitle} ) {
    const [showDeleteUserForm, setShowDeleteUserForm] = useState(false);
    const [existUserIdInLog, setExistUserIdInLog] = useState(false);

    useEffect(()=> {
        const callApi = async () => {
            setExistUserIdInLog(await checkExistUserIdInLog());
        }
        callApi()
    }, []);

    const handleCloseDeleteUserForm = () => {
        setShowDeleteUserForm(false);
    };
    const handleShowDeleteUserForm = (e) => {
        e.stopPropagation();
        setShowDeleteUserForm(true);
    };

    const handleDeleteUserSubmit = async () => {
        if (existUserIdInLog) {
            axios.post(`${API.address}/inactiveuser`, {id : listItem.id}, {headers: { 'x-api-key': loggedInUserData.password }})
            .then(() => {
                loadUserList(false);
                setShowDeleteUserForm(false);
            })
        } else {
            axios.post(`${API.address}/deleteuser`, {id : listItem.id}, {headers: { 'x-api-key': loggedInUserData.password }})
            .then(() => {
                loadUserList(false);
                setShowDeleteUserForm(false);
            })
        }
    };

    async function checkExistUserIdInLog() {
        let existUserIdInLog;
        await axios.post(`${API.address}/checkExistUserIdInLog`, {userid : listItem.id}, {headers: { 'x-api-key': loggedInUserData.password }})
        .then((data) => {
            if (data.data.length === 0) existUserIdInLog = false;
            else existUserIdInLog = true;
        })
        return existUserIdInLog;
    };
    
    const renderTooltip = (props) => (
        <Tooltip id="delete-button-tooltip" {...props}>
            Törlés/Inaktiválás
        </Tooltip>
        );

    const deleteUserButton =
        <Button 
            size={buttonTitle === undefined ? "sm" : ''}
            className="m-1"
            variant="danger"
            onClick={handleShowDeleteUserForm}>
            {buttonTitle ? buttonTitle : <>&#128465;</>}
        </Button>
    
    return (
        <>
            {buttonTitle === undefined ? <OverlayTrigger
                placement="top"
                delay={{ show: 50, hide: 100 }}
                overlay={renderTooltip}>
                {deleteUserButton}
            </OverlayTrigger> : deleteUserButton}
            <Modal show={showDeleteUserForm} onHide={handleCloseDeleteUserForm} backdrop='static' onClick={(e)=>e.stopPropagation()}>
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
