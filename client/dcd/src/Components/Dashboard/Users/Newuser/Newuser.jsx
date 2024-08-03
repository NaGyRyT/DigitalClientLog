import React from 'react';
import axios from 'axios';
import { useState} from 'react';
import bcrypt from "bcryptjs-react";
import { Form, Alert, Button, Modal, Row, Col } from 'react-bootstrap';
import { validateUser } from '../Validateuser/Validateuser';
import API from '../../../../api';

export default function Newuser( { loadUserList, groupList, loggedInUserData } ) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [errorMessage, setErrorMessage] = useState({
		name : '',
		username : '',
		password : '',
		group : '',
		error : false,
  	});
  	const [selectedGroup, setSelectedGroup] = useState(0);
	const [showNewUserForm, setShowNewUserForm] = useState(false);
	const [disableSubmitButton, setDisableSubmitButton] = useState(false);
	const [auditPermission, setAuditPermission] = useState(0);
	const [statementPermission, setStatementPermission] = useState(0);
	const [readOnlyPermission, setReadOnlyPermission] = useState(0);

	const handleCloseNewUserForm = () => {
		setShowNewUserForm(false);
		setUsername('');
		setName('');
		setPassword('');
		setSelectedGroup(0);
		setAuditPermission(0);
		setStatementPermission(0);
		setReadOnlyPermission(0);
		setErrorMessage({
			name : '',
			username : '',
			password : '',
			group : '',
			error : false,
		})
	}

	const handleShowNewUserForm = () => setShowNewUserForm(true);

  	const handleNewUserSubmit = async (e) => {
		e.preventDefault();
		setDisableSubmitButton(true);
		const tempErrorMessage = await validateUser(username, name, password, selectedGroup, loggedInUserData);
		setErrorMessage(tempErrorMessage);
		if (! tempErrorMessage.error) {
			const trimmedHashedPassword = bcrypt.hashSync(password.trim(), 10);
			axios.post(`${API.address}/newuser`, {username : username.trim(), 
														password : trimmedHashedPassword,
														name : name.trim(),
														group : selectedGroup,
														auditpermission : auditPermission,
														statementpermission : statementPermission,
														readonlypermission : readOnlyPermission,

													}, {headers: { 'x-api-key': loggedInUserData.password }})
			.then(() => {
				handleCloseNewUserForm();
				loadUserList();
				setDisableSubmitButton(false);
			})
			
		} else setDisableSubmitButton(false);
	}
    
	return (
		<>
			<Button className='mx-3' variant="primary" onClick={handleShowNewUserForm}>
				+ Új felhasználó
			</Button>
			<Modal 
				show={showNewUserForm} 
				onHide={handleCloseNewUserForm}
				backdrop='static'>
				<Modal.Header closeButton>
					<Modal.Title>Új felhasználó felvitele</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleNewUserSubmit}>
						<Form.Group md="4" controlId="formUsername">
							<Form.Label>Felhasználónév</Form.Label>
							{errorMessage.username === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.username}</Alert>}
							<Form.Control 
								autoComplete="username"
								type='text'
								value={username}
								maxLength={20}
								onChange={(e) => setUsername(e.target.value)}/>
						</Form.Group>
						<Form.Group md="4" controlId="formName">
							<Form.Label>Név</Form.Label>
							{errorMessage.name === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.name}</Alert>}
							<Form.Control 
								autoComplete="name"
								maxLength={100}
								type='text'
								value={name}
								onChange={(e) => setName(e.target.value)}/>
						</Form.Group>
						<Form.Group md="4" controlId="formPassword">
							<Form.Label>Jelszó</Form.Label>
							{errorMessage.password === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.password}</Alert>}
							<Form.Control 
								autoComplete="new-password"
								type='password'
								value={password}
								maxLength={60}
								onChange={(e) => setPassword(e.target.value)}/>
						</Form.Group>
						<Row>
							<p className='my-1'>Jogosultságok</p>
							<Col xs={12} sm={4}>
								<Form.Check
									type='switch'
									label='Ellenőrzés'
									id='formAuditPermission'
									defaultChecked={auditPermission ? true : false}
									onChange={(e) => setAuditPermission(e.target.checked ? 1 : 0)}/>
								</Col>
							<Col xs={12} sm={4}>
								<Form.Check
									type='switch'
									label='Kimutatás'
									id='formStatementPermission'
									defaultChecked={statementPermission ? true : false}
									onChange={(e) => setStatementPermission(e.target.checked ? 1 : 0)}/>
							</Col>
							<Col xs={12} sm={4}>
								<Form.Check
									type='switch'
									label='Csak olvasás'
									id='formReadOnlyPermission'
									defaultChecked={readOnlyPermission ? true : false}
									onChange={(e) => setReadOnlyPermission(e.target.checked ? 1 : 0)}/>
							</Col>
						</Row>
						<Form.Group md="4" controlId="formSelectFromGroup">
							<Form.Label>Csoport</Form.Label>
							{errorMessage.group === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.group}</Alert>}
							<Form.Select onChange={(e) => setSelectedGroup(Number(e.target.value))}>
							<option key={0} value={Number(0)}>Válassz egy lehetőséget!</option>
							{groupList.map((groupListItem) => (
								<option key={groupListItem.id} value={groupListItem.id}>{groupListItem.group_name}</option>
							))}
							</Form.Select>	
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseNewUserForm}>
						Mégse
					</Button>
					<Button variant="primary" onClick={handleNewUserSubmit} disabled={disableSubmitButton}>
						Rögzít
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}
