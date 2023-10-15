import React, { useState } from 'react'
import { OverlayTrigger, Tooltip, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

export default function Deleteuser( {listItem, loadUserList} ) {
    const [showDeleteUserForm, setShowDeleteUserForm] = useState(false);

    const handleCloseDeleteUserForm = () => setShowDeleteUserForm(false);
    
    const handleShowDeleteUserForm = () => setShowDeleteUserForm(true);
    
    const handleDeleteUserSubmit = (e) => {
		e.preventDefault();
        if (checkExistDiary()) {
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

    function checkExistDiary() {
        
        // TODO itt kell ellenőrizni, hogy van-e naplóbejegyzése a felhasználónak
        // ha kész lesz a napló...
        // ha true a visszadott érték akkor inkativált lesz a felhasználó
        return true
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
                className="mx-1"
                variant="danger"
                onClick={handleShowDeleteUserForm}>
                &#128465;
            </Button>
        </OverlayTrigger>
        <Modal show={showDeleteUserForm} onHide={handleCloseDeleteUserForm}>
			<Modal.Header closeButton>
					<Modal.Title>Felhasználó törlése</Modal.Title>
			</Modal.Header>
			<Modal.Body>
                Valóban törölni szeretnéd {listItem.username} felhasználót?
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
