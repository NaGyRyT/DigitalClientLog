import React, { useState } from 'react'
import { OverlayTrigger, Tooltip, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

export default function Deleteclient( {listItem, loadClientList} ) {
    const [showDeleteClientForm, setShowDeleteClientForm] = useState(false);
    const handleCloseDeleteClientForm = () => setShowDeleteClientForm(false);
    const handleShowDeleteClientForm = () => setShowDeleteClientForm(true);
    const handleDeleteClientSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/deleteclient', {id : listItem.id})
            .then(() => {
                loadClientList(false);
                setShowDeleteClientForm(false);
            })
        
        
    }
    
    function checkExistDiary() {
            
            // TODO itt kell ellenőrizni, hogy tartozik-e naplóbejegyzés az ügyfélhez
            // ha kész lesz a napló...
            // ha true a visszadott érték akkor nem törölhető az ügyfél
        return true
    }
    
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
            <Modal show={showDeleteClientForm} onHide={handleCloseDeleteClientForm} backdrop='static'>
                <Modal.Header closeButton>
                        <Modal.Title>Ügyfél törlése</Modal.Title>
                </Modal.Header>
                {checkExistDiary() ? 
                <Modal.Body>
                    Az ügyfélhez tartozik naplóbejegyzés ezért nem törölhető.
                </Modal.Body> :
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
