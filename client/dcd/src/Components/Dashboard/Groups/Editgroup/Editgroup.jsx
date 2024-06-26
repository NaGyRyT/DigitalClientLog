import React, { useState } from 'react';
import axios from 'axios';
import { Form, Alert, Button, Modal, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { validateGroup } from '../Validategroup/Validategroup';
import API from '../../../../api';

export default function Editgroup( { loadGroupList, listItem, loggedInUserData, buttonTitle} ) {
	const [groupName, setGroupName] = useState(listItem.group_name);
	const [description, setDescription] = useState(listItem.description);
	const [disableSubmitButton, setDisableSubmitButton] = useState(false);
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
	const handleShowEditGroupForm = (e) => {
		e.stopPropagation();
		setShowEditGroupForm(true);
	}
  	const handleEditGroupSubmit = async (e) => {
		setDisableSubmitButton(true);
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
			setDisableSubmitButton(false);
		});
		} else setDisableSubmitButton(false);
	};

    const renderTooltip = (props) => (
        <Tooltip id="group-edit-button-tooltip" {...props}>
          Szerkesztés
        </Tooltip>);

	const editGroupButton =
		<Button 
			size={buttonTitle === undefined ? "sm" : ''}
			className = "m-1"
			variant = "info"
			onClick = {handleShowEditGroupForm}>
			{buttonTitle ? buttonTitle : <>&#x270D;</>}
		</Button>

	return (
		<>
			{buttonTitle === undefined ? 
				<OverlayTrigger
					placement="top"
					delay={{ show: 50, hide: 100 }}
					overlay={renderTooltip}
				>{editGroupButton}
	        	</OverlayTrigger> : editGroupButton}
			<Modal 
				show={showEditGroupForm} 
				onHide={handleCloseEditGroupForm}
				backdrop='static'
				onClick={(e)=>e.stopPropagation()}>
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
                    <Button variant="primary" onClick={handleEditGroupSubmit} disabled={disableSubmitButton}>
                        Rögzít
                    </Button>
				</Modal.Footer>
			</Modal>
		</>
	)
};