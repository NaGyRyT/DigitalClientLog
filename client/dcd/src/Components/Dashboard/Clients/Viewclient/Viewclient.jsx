import React, { useState } from 'react'
import { OverlayTrigger, Tooltip, Button, Modal, Row, Col } from 'react-bootstrap';

export default function Viewclient( { listItem } ) {
    const [showViewClientForm, setShowViewClientForm] = useState(false);
    const handleCloseViewClientForm = () => setShowViewClientForm(false);  
    const handleShowViewClientForm = () => setShowViewClientForm(true);
   
    const renderTooltip = (props) => (
        <Tooltip id="View-button-tooltip" >
            {props}
        </Tooltip>
        );
    
      return (
        <>
            <OverlayTrigger
                placement="top"
                delay={{ show: 50, hide: 100 }}
                overlay={renderTooltip('Megnéz')}
            >
                <Button 
                    size="sm"
                    className="m-1"
                    variant="success"
                    onClick={handleShowViewClientForm}>
                    👁
                </Button>
            </OverlayTrigger>
            <Modal show={showViewClientForm} onHide={handleCloseViewClientForm} backdrop='static'>
                <Modal.Header closeButton>
                        <Modal.Title>Részletek</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12} sm={7}>
                            Név: {listItem.name}
                        </Col>
                        <Col xs={12} sm={5}>
                            Azonosító: {listItem.client_id}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={7}>Születési dátum: {listItem.birth_date}</Col>
                        <Col xs={12} sm={2}>Kor: {listItem.age}</Col>
                        <Col xs={12} sm={3}>Nem: {listItem.gender}</Col>                        
                    </Row>
                    <Row>
                        <Col xs={12} sm={7}>E-mail: {listItem.email}</Col>
                        <Col xs={12} sm={5}>Mobil: {listItem.phone}</Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={7}>Ir. szám: {listItem.zip}</Col>
                        <Col xs={12} sm={5}>Város: {listItem.city}</Col>  
                    </Row>
                    <Row>
                        <Col xs={12} sm={12}>Utca: {listItem.street}</Col>
                    </Row>
                    <Row>    
                        <Col xs={12} sm={4}>Házszám: {listItem.house_number}</Col>
                        <Col xs={12} sm={4}>Emelet: {listItem.floor}</Col>
                        <Col xs={12} sm={4}>Ajtó: {listItem.door}</Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCloseViewClientForm}>
                        Bezár
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
      )
    }

