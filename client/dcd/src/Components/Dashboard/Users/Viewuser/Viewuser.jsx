import React, { useState } from 'react';
import { OverlayTrigger, Tooltip, Button, Modal } from 'react-bootstrap';

export default function Viewuser( { listItem } ) {
    const [showViewUserForm, setShowViewUserForm] = useState(false);
    const handleCloseViewUserForm = () => setShowViewUserForm(false);  
    const handleShowViewUserForm = () => setShowViewUserForm(true);
   
    const renderTooltip = (props) => (
        <Tooltip id="View-button-tooltip"{...props}>
            Részletek
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
                        variant="success"
                        onClick={handleShowViewUserForm}>
                        👁
                    </Button>
                </OverlayTrigger>
                <Modal show={showViewUserForm} onHide={handleCloseViewUserForm} backdrop='static'>
                    <Modal.Header closeButton>
                            <Modal.Title>Felhasználó részletek</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className='border-bottom'>Felhasználónév: {listItem.username}</p>
                        <p className='border-bottom'>Név: {listItem.name}</p>
                        <p className='border-bottom'>Csoport: {listItem.group_name}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleCloseViewUserForm}>
                            Bezár
                        </Button>

                    </Modal.Footer>
                </Modal>
            </>
        )
    }
