import React, { useState } from 'react';
import { Button, Modal, CloseButton } from 'react-bootstrap';
import axios from 'axios';
import API from '../../../../api';

export default function Deleteevent( {selectedEvent, loadEventsFromCalendar, loggedInUserData, setShowEditEventForm} ) {
    const [showDeleteEventForm, setShowDeleteEventForm] = useState(false);
    const handleCloseDeleteEventForm = (e) => {
        e.stopPropagation();
        setShowDeleteEventForm(false);
    };
    const handleShowDeleteEventForm = (e) => {
        e.stopPropagation();
        setShowDeleteEventForm(true);
    };
    const handleDeleteEventSubmit = (e) => {
        e.stopPropagation();
        e.preventDefault();
        axios.post(`${API.address}/deleteevent`, {id : selectedEvent.id}, {headers: { 'x-api-key': loggedInUserData.password }})
            .then(() => {
                loadEventsFromCalendar();
                setShowDeleteEventForm(false);
                setShowEditEventForm(false);
            });        
    };
    
    return (
        <>  
            <Button 
                className='m-1'
                variant='danger'
                onClick={handleShowDeleteEventForm}>
                &#128465;
                Töröl
            </Button>
            <Modal show={showDeleteEventForm} backdrop='static' onClick={(e)=>e.stopPropagation()}>
                <Modal.Header>
                    <Modal.Title>Naptárbejegyzés törlése</Modal.Title>
                    <CloseButton className='justify-content-end' onClick={handleCloseDeleteEventForm}/>
                </Modal.Header>
                <Modal.Body>
                    Valóban törölni szeretnéd
                    <span className='fw-bold text-danger'> {selectedEvent.subject}</span> tárgyú
                    <span className='fw-bold text-danger'> {selectedEvent.id}.</span> sorszámú naptárbejegyzést?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleCloseDeleteEventForm}>
                        Nem
                    </Button>
                    <Button variant='primary' onClick={handleDeleteEventSubmit}>
                        Igen
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
      )
    }
