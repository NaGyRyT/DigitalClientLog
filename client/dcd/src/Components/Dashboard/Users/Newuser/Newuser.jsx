import React from 'react'
import axios from 'axios';
import { useState} from 'react';
import bcrypt from "bcryptjs-react";
import { Form, Alert, Button, Modal } from 'react-bootstrap';

export default function Newuser( { loadUserList, groupList } ) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [errorMessage, setErrorMessage] = useState({
		name : '',
		username : '',
		password : '',
		group : ''
  	});
  	const [selectedGroup, setSelectedGroup] = useState(0);
	const [showNewUserForm, setShowNewUserForm] = useState(false);

	const handleCloseNewUserForm = () => {
		setShowNewUserForm(false);
		setUsername('');
		setName('');
		setPassword('');
		setErrorMessage({
		name : '',
		username : '',
		password : '',
		group : ''
		})
	}

	const handleShowNewUserForm = () => setShowNewUserForm(true);

  	const handleNewUserSubmit = async (e) => {
		e.preventDefault();
		if (! await validateNewUser()) {
			const trimmedHashedPassword = bcrypt.hashSync(password.trim(), 10);
		axios.post('http://localhost:8080/newuser', {username : username.trim(), 
													password : trimmedHashedPassword,
													name : name.trim(),
													group : selectedGroup})
		.then(() => {
			setUsername('');
			setName('');
			setPassword('');
			setErrorMessage({
			name : '',
			username : '',
			password : '',
			group : ''
			})
			loadUserList();
			setShowNewUserForm(false);
		})
		}
	}
    
	async function checkExistUsername() {
		let existUser;
		await axios.post('http://localhost:8080/checkexistusername', {username : username})
		.then((data) => {
			if (data.data.length === 0) existUser = false;
			else existUser = true;
		})
		return existUser
		}

	async function validateNewUser() {
		const newErrorMessage = structuredClone(errorMessage);
		let error = false;
		if (username.length < 4) {
			newErrorMessage.username = 'A felhasználónév minimum 4 karakter lehet.';
			error = true;
		} else if (await checkExistUsername()) {
			newErrorMessage.username = 'Ez a felhasználónév foglalt.';
			error = true;
		} else newErrorMessage.username = ""; 
		if (name.length === 0) {
			newErrorMessage.name = 'A név mező nem lehet üres.';
			error = true;
		} else newErrorMessage.name = '';
		if (password.length < 8) {
			newErrorMessage.password = 'A jelszó mező minimum 8 karakter lehet.';
			error = true;
		} else newErrorMessage.password = '';
		if (selectedGroup === 0 ) {
			newErrorMessage.group = 'Csoport választása kötelező.';
			error = true;
		} else newErrorMessage.group = '';
		if (error) setErrorMessage(newErrorMessage);
		return error
	}

	return (
		<>
			<Button variant="primary" onClick={handleShowNewUserForm}>
				+ Új felhasználó
			</Button>
			<Modal 
				show={showNewUserForm} 
				onHide={handleCloseNewUserForm}>
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
								onChange={(e) => setUsername(e.target.value)}/>
						</Form.Group>
						<Form.Group md="4" controlId="formName">
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
				<Button variant="primary" onClick={handleNewUserSubmit}>
					Rögzít
				</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}
