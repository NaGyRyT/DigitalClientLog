import React, {useState} from 'react';
import { Button, Modal, ListGroup } from 'react-bootstrap';

export default function Viewlog( {logEntry}) {
    const [showViewLogForm, setShowViewLogForm] = useState(false);
    const handleCloseViewLogForm = () => setShowViewLogForm(false);  
    const handleShowViewLogForm = async() => {
        setShowViewLogForm(true);
    }
    
  return (
    <>
    <Button 
        size="sm"
        className="m-1"
        variant="success"
        onClick={handleShowViewLogForm}>
        👁
    </Button>
    <Modal
        show={showViewLogForm}
        onHide={handleCloseViewLogForm}
        backdrop='static'
        dialogClassName='modal-80w'>
        <Modal.Header closeButton>
            <Modal.Title>Naplóbejegyzés részletek</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ListGroup>
                <ListGroup.Item>Napló sorszám: {logEntry.id}</ListGroup.Item>
                <ListGroup.Item>Felhasználó neve: {logEntry.user_name}</ListGroup.Item>
                <ListGroup.Item>Ügyfél neve: {logEntry.client_name}</ListGroup.Item>
                <ListGroup.Item>Ügyféltalálkozás dátuma, ideje: {logEntry.date_time}</ListGroup.Item>
                <ListGroup.Item>Ügyféltalálkozás időtartama: {logEntry.duration}</ListGroup.Item>
            </ListGroup>
            <h5 className='mt-3'>Ügyféltalálkozás leírása</h5>
            <p>{logEntry.description}</p>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={handleCloseViewLogForm}>
                Bezár
            </Button>

        </Modal.Footer>

    </Modal>
    </>
  )
}
