import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Form, Alert, Button, Modal, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { validateGroup } from '../Validategroup/Validategroup';
import API from '../../../../api';

export default function Editgroup( {loadGroupList, listItem, loggedInUserData} ) {
	const [groupName, setGroupName] = useState(listItem.group_name);
	const [description, setDescription] = useState(listItem.description);
	const [errorMessage, setErrorMessage] = useState({
		groupName : '',
		description : '',
		error : false,
  	});

	const [showEditGroupForm, setShowEditGroupForm] = useState(false);
	const handleCloseEditGroupForm = async () => {
		setShowEditGroupForm(false);
		setGroupName(listItem.group_name);
		setDescription(listItem.description);
		setErrorMessage({
			groupName : '',
			description : '',
			error : false,
		});
	};
	const handleShowEditGroupForm = () => setShowEditGroupForm(true);
  	const handleEditGroupSubmit = async (e) => {
		e.preventDefault();
		const tempErrorMessage = await validateGroup(groupName, description, listItem.group_name, loggedInUserData);
		setErrorMessage(tempErrorMessage);
 		if (! tempErrorMessage.error) {
			axios.post(`${API.address}/Editgroup`, {
                id : listItem.id,
                groupname : groupName.trim(),
                description : description,
			}, {headers: { 'x-api-key': loggedInUserData.password }})
		.then(() => {
			setShowEditGroupForm(false);
			loadGroupList();
		});
		};
	};

    const renderTooltip = (tooltip) => (
        <Tooltip id="group-edit-button-tooltip">
          {tooltip}
        </Tooltip>);

	return (
		<>
			<OverlayTrigger
                placement="top"
                delay={{ show: 50, hide: 100 }}
                overlay={renderTooltip('Szerkesztés')}>
                <Button 
                    size = "sm"
                    className = "m-1"
                    variant = "info"
                    onClick = {handleShowEditGroupForm}>
                    &#x270D;
                </Button>
	        </OverlayTrigger>
			<Modal 
				show={showEditGroupForm} 
				onHide={handleCloseEditGroupForm}
				backdrop='static'>
				<Modal.Header closeButton>
					<Modal.Title>Csoport szerkesztése</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleEditGroupSubmit}>
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
                    <Button variant="secondary" onClick={handleCloseEditGroupForm}>
                        Mégse
                    </Button>
                    <Button variant="primary" onClick={handleEditGroupSubmit}>
                        Rögzít
                    </Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}