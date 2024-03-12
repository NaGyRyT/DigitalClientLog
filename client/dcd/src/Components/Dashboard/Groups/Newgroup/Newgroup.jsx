import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Form, Alert, Button, Modal, Row, Col } from 'react-bootstrap';
import { validateGroup } from '../Validategroup/Validategroup';
import API from '../../../../api';

export default function Newgroup( {loadGroupList, loggedInUserData} ) {
	const [groupName, setGroupName] = useState('');
	const [description, setDescription] = useState('');
	const [errorMessage, setErrorMessage] = useState({
		groupName : '',
		description : '',
		error : false,
  	});
	const [disableSubmitButton, setDisableSubmitButton] = useState(false);
	const [showNewGroupForm, setShowNewGroupForm] = useState(false);
	const handleCloseNewGroupForm = async () => {
		setShowNewGroupForm(false);
		setGroupName('');
		setDescription('');
 	 	setErrorMessage({
            groupName : '',
			description : '',
			error : false, 
		})
	}
	const handleShowNewGroupForm = () => setShowNewGroupForm(true);
  	const handleNewGroupSubmit = async (e) => {
		setDisableSubmitButton(true);
		e.preventDefault();
		const tempErrorMessage = await validateGroup(groupName, description, '', loggedInUserData);
		setErrorMessage(tempErrorMessage);
 		if (! tempErrorMessage.error) {
			axios.post(`${API.address}/newgroup`, {
                groupname : groupName.trim(),
                description : description,
            }, {headers: { 'x-api-key': loggedInUserData.password }})
		.then(() => {
            handleCloseNewGroupForm();
			loadGroupList();
			setDisableSubmitButton(false);
		});
		} else setDisableSubmitButton(false);
	}

	return (
		<>
			<Button className='mx-3' variant="primary" onClick={handleShowNewGroupForm}>
				+ Új csoport
			</Button>
			<Modal 
				show={showNewGroupForm} 
				onHide={handleCloseNewGroupForm}
				backdrop='static'>
				<Modal.Header closeButton>
					<Modal.Title>Új csoport felvitele</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleNewGroupSubmit}>
					<Row className='mb-3'>
                        <Col>
                            <Form.Group className='mb-3' controlId="formName">
                                <Form.Label>Név</Form.Label>
                                {errorMessage.groupName === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.groupName}</Alert>}
                                <Form.Control 
                                    autoComplete="groupName"
                                    maxLength={100}
                                    type='text'
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}/>
                            </Form.Group>
						</Col>
                    </Row>
                    <Row className='mb-3'>
						<Col>
                            <Form.Group className='mb-3' controlId="formId">
                                <Form.Label>Leírás</Form.Label>
                                {errorMessage.description === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.description}</Alert>}
                                <Form.Control 
                                    autoComplete="on"
                                    type='text'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}/>
                            </Form.Group>
						</Col>
						</Row>
                        
					</Form>
				</Modal.Body>
				<Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseNewGroupForm}>
                        Mégse
                    </Button>
                    <Button variant="primary" onClick={handleNewGroupSubmit} disabled={disableSubmitButton}>
                        Rögzít
                    </Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}