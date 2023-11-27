import React, { useState} from 'react'
import axios from 'axios';
import { OverlayTrigger, Tooltip, Form, Alert, Button, Modal } from 'react-bootstrap';
import bcrypt from "bcryptjs-react";

export default function Edituser( { listItem, loadUserList, groupList } ) {
	const [password, setPassword] = useState('');
	const [name, setName] = useState(listItem.name);
	const [errorMessage, setErrorMessage] = useState({
		name : '',
		username : '',
		password : '',
		group : ''
  	});
	const [selectedGroup, setSelectedGroup] = useState(listItem.accessgroup);
	const [showEditUserForm, setShowEditUserForm] = useState(false);

	const handleCloseEditUserForm = () => {
			setShowEditUserForm(false);
  }

	const handleShowEditUserForm = () => {
		setShowEditUserForm(true);
  }

	const handleEditUserSubmit = async (e) => {
		e.preventDefault();
		if (! await validateEditUser()) {
			const trimmedHashedPassword = password === '' ? '' : bcrypt.hashSync(password.trim(), 10);
			axios.post('http://localhost:8080/edituser', {
				password : trimmedHashedPassword,
				name : name.trim(),
				group : selectedGroup,
				id : listItem.id
			})
		.then(() => {
			setErrorMessage({
			name : '',
			
			password : '',
			
			})
			loadUserList(false);
			setShowEditUserForm(false);
		})
		}
	}

	async function validateEditUser() {
		const newErrorMessage = structuredClone(errorMessage);
		let error = false;
		if ( name.length === 0 ) {
			newErrorMessage.name = 'A név mező nem lehet üres.';
			error = true;
		} else newErrorMessage.name = '';
		if ( password.length < 8 && password.length > 0) {
			newErrorMessage.password = 'A jelszó mező minimum 8 karakter lehet.';
			error = true;
		} else newErrorMessage.password = '';
		if ( error ) setErrorMessage(newErrorMessage);
		return error
	}

	const renderTooltip = (props) => (
    <Tooltip id="edit-button-tooltip" {...props}>
      Szerkesztés
    </Tooltip>
  );

  return (
    <>
		<OverlayTrigger
			placement="top"
			delay={{ show: 50, hide: 100 }}
			overlay={renderTooltip}>
			<Button 
				size = "sm"
				className = "m-1"
				variant = "info"
				onClick = {handleShowEditUserForm}>
				&#x270D;
    		</Button>
		</OverlayTrigger>
    	<Modal show={showEditUserForm} onHide={handleCloseEditUserForm} backdrop='static'>
				<Modal.Header closeButton>
					<Modal.Title>Felhasználó szerkesztése</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleEditUserSubmit}>
            <Form.Group controlId="formUsername">
							<Form.Label>Felhasználónév</Form.Label>
							<Form.Control
                disabled
								value={listItem.username}/>
						</Form.Group>
						<Form.Group controlId="formName">
							<Form.Label>Név</Form.Label>
							{errorMessage.name === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.name}</Alert>}
							<Form.Control 
								autoComplete="name"
								type='text'
								value={name}
								onChange={(e) => setName(e.target.value)}/>
						</Form.Group>
						<Form.Group md="4" controlId="formPassword">
							<Form.Label>Jelszó</Form.Label>
							{errorMessage.password === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.password}</Alert>}
							<Form.Control 
								autoComplete="password"
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}/>
						</Form.Group>
						<Form.Group  className={listItem.username === "admin" ? "d-none" : ""} controlId="formSelectFromGroup">
							<Form.Label>Csoport</Form.Label>
							<Form.Select onChange={(e) => setSelectedGroup(Number(e.target.value))}>
								{groupList
										.filter((groupListItem) => listItem.group_name === groupListItem.group_name)
										.map((groupListItem) => 
											<option 
											key = { groupListItem.id }
											value = { groupListItem.id }>
											{groupListItem.group_name}
										</option>
										)}
								{groupList
										.filter((groupListItem) => listItem.group_name !== groupListItem.group_name)
										.map((groupListItem) => (
											<option 
												key={groupListItem.id}
												value={groupListItem.id}
												>{groupListItem.group_name}
											</option>
							))}
							</Form.Select>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
				<Button variant="secondary" onClick={handleCloseEditUserForm}>
					Mégse
				</Button>
				<Button variant="primary" onClick={handleEditUserSubmit}>
					Rögzít
				</Button>
				</Modal.Footer>
			</Modal>
        </>
  )
}
