import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip, Button, Modal } from 'react-bootstrap';
import Edituser from '../Edituser/Edituser';
import Deleteuser from '../Deleteuser/Deleteuser';

export default function Viewuser( {
        listItem,
        clickedRowIndex,
        setClickedRowIndex,
        loadUserList,
        groupList,
        loggedInUserData
    } ) {
    const [showViewUserForm, setShowViewUserForm] = useState(false);
    const handleCloseViewUserForm = () => {
        setShowViewUserForm(false);
        setClickedRowIndex(null);
    }
    const handleShowViewUserForm = (e) => {
        e.stopPropagation();
        setShowViewUserForm(true);
    }
   
    const renderTooltip = (props) => (
        <Tooltip id="View-button-tooltip"{...props}>
            Részletek
        </Tooltip>
        );

    useEffect(()=> {
            if (clickedRowIndex === listItem.id && clickedRowIndex !== null) setShowViewUserForm(true);
        },[clickedRowIndex]);
    
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
                        variant="success"
                        onClick={handleShowViewUserForm}>
                        👁
                    </Button>
                </OverlayTrigger>
                <Modal show={showViewUserForm} onHide={handleCloseViewUserForm} backdrop='static' onClick={(e)=>e.stopPropagation()}>
                    <Modal.Header closeButton>
                            <Modal.Title>Felhasználó részletek</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className='border-bottom'>Felhasználónév: {listItem.username}</p>
                        <p className='border-bottom'>Név: {listItem.name}</p>
                        <p className='border-bottom'>Csoport: {listItem.group_name}</p>
                        {listItem.auditpermission === 1 || listItem.statementpermission === 1 || listItem.readonlypermission === 1 ? <p className='my-0'>Jogosultságok</p> : ''}
                        <ul>
                            {listItem.auditpermission ? <li>Ellenőrzési jog aktív</li> : ''}
                            {listItem.statementpermission ? <li>Kimutatási jog aktív</li> : ''}
                            {listItem.readonlypermission ? <li>Csak olvasási jog aktív</li> : ''}
                            {listItem.calendaronlypermission ? <li>Csak naptár jog aktív</li> : ''}
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleCloseViewUserForm} variant='secondary'>
                            Bezár
                        </Button>
                        <Edituser
                            listItem={listItem}
                            loadUserList={loadUserList}
                            groupList={groupList}
                            loggedInUserData={loggedInUserData}
                            buttonTitle={'Szerkeszt'}
                        />
                        <Deleteuser
                            listItem={listItem}
                            loadUserList={loadUserList}
                            loggedInUserData={loggedInUserData}
                            buttonTitle={'Töröl'}
                      />
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
