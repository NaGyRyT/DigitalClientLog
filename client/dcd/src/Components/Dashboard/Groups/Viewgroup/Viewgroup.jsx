import React, { useState } from 'react';
import { OverlayTrigger, Tooltip, Button, Modal } from 'react-bootstrap';

export default function Viewgroup( { listItem } ) {
    const [showViewGroupForm, setShowViewGroupForm] = useState(false);
    const handleCloseViewGroupForm = () => setShowViewGroupForm(false);  
    const handleShowViewGroupForm = () => setShowViewGroupForm(true);
   
    const renderTooltip = (props) => (
        <Tooltip id="View-button-tooltip" {...props}>
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
                        onClick={handleShowViewGroupForm}>
                        👁
                    </Button>
                </OverlayTrigger>
                <Modal show={showViewGroupForm} onHide={handleCloseViewGroupForm} backdrop='static'>
                    <Modal.Header closeButton>
                            <Modal.Title>Csoport részletek</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className='border-bottom'>Csoportnév: {listItem.group_name}</p>
                        <p className='border-bottom'>Csoport leirás: {listItem.description}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleCloseViewGroupForm}>
                            Bezár
                        </Button>

                    </Modal.Footer>
                </Modal>
            </>
        )
    }