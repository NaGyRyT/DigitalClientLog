import React, { useState} from 'react';
import axios from 'axios';
import { OverlayTrigger, Tooltip, Form, Alert, Button, Modal, Row, Col } from 'react-bootstrap';
import bcrypt from "bcryptjs-react";
import { validateUser } from '../Validateuser/Validateuser';
import API from '../../../../api';

export default function Edituser( {
	listItem,
	loadUserList,
	groupList,
	loggedInUser,
	setLoggedInUserData,
	loggedInUserData,
	buttonTitle
} ) {
	const [password, setPassword] = useState('');
	const [name, setName] = useState(listItem.name);
	const [errorMessage, setErrorMessage] = useState({
		name : '',
		username : '',
		password : '',
		group : '',
		error : false,
  	});
	const [selectedGroup, setSelectedGroup] = useState(listItem.accessgroup);
	const [showEditUserForm, setShowEditUserForm] = useState(false);
	const [auditPermission, setAuditPermission] = useState(listItem.auditpermission);
	const [statementPermission, setStatementPermission] = useState(listItem.statementpermission);

	const handleCloseEditUserForm = () => {
		setShowEditUserForm(false);
		setName(listItem.name);
		setAuditPermission(listItem.auditpermission);
		setStatementPermission(listItem.statementpermission)
		setPassword('');
		setErrorMessage({
			name : '',
			username : '',
			password : '',
			group : '',
			error : false,
		});
  	};

	const handleShowEditUserForm = (e) => {
		e.stopPropagation();
		setShowEditUserForm(true);
  	};

	const handleEditUserSubmit = async () => {
		const tempErrorMessage = await validateUser(listItem.username, name, password, selectedGroup, loggedInUserData, true, password === '' ? false : true);
		setErrorMessage(tempErrorMessage);
		if (! tempErrorMessage.error) {
			const trimmedHashedPassword = password === '' ? '' : bcrypt.hashSync(password.trim(), 10);
			axios.post(`${API.address}/edituser`, {
				password : trimmedHashedPassword,
				name : name.trim(),
				group : selectedGroup,
				auditpermission : auditPermission,
				statementpermission : statementPermission,
				id : listItem.id
			}, {headers: { 'x-api-key': loggedInUserData.password }})
		.then(() => {
			if (loggedInUser === undefined) loadUserList(false) 
			else {
				let newListItem = listItem;
				newListItem.name = name;
				if (password !== '') newListItem.password = trimmedHashedPassword;
				setLoggedInUserData(newListItem);
			}
			setShowEditUserForm(false);
		})
		};
	};

	const renderTooltip = (props) => (
		<Tooltip id="edit-button-tooltip" {...props}>
			Szerkesztés
		</Tooltip>
  	);

	const editUserButton =
	<Button 
		size={buttonTitle === undefined ? "sm" : ''}
		className = "m-1"
		variant = "info"
		onClick = {handleShowEditUserForm}>
		{buttonTitle ? buttonTitle : <>&#x270D;</>}
	</Button>

  return (
    <> 
 		{loggedInUser === undefined ? 
			buttonTitle === undefined ? 
			<OverlayTrigger
				placement="top"
				delay={{ show: 50, hide: 100 }}
				overlay={renderTooltip}>
					{editUserButton}
			</OverlayTrigger>: editUserButton : 
			<div className='d-flex flex-column'>
			<span 
				title='Bejelentkezett felhasználó' 
				onClick={handleShowEditUserForm}
				className='cursor-pointer'>
				{listItem.name}
			</span>
			<span 
				className='m-0 p-0 menu-group-name'
				title='Csoport neve' >
				{listItem.group_name}
			</span>
			</div>
		}
    	<Modal show={showEditUserForm} onHide={handleCloseEditUserForm} backdrop='static' onClick={(e)=>e.stopPropagation()}>
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
								maxLength={60}
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}/>
							<Form.Text>Ha nem írsz jelszót, akkor a jelszó nem fog módosulni.</Form.Text>
						</Form.Group>
						<Row>
							<p className='my-1'>Jogosultság</p>
							<Col xs={12} sm={4}>
								<Form.Check
									disabled={loggedInUser !== undefined ? true : false}
									type='switch'
									label='Ellenőrzés'
									id='formAuditPermission'
									defaultChecked={auditPermission ? true : false}
									onChange={(e) => setAuditPermission(e.target.checked ? 1 : 0)}/>
								</Col>
							<Col xs={12} sm={4}>
								<Form.Check
									disabled={loggedInUser !== undefined ? true : false}
									type='switch'
									label='Kimutatás'
									id='formStatementPermission'
									defaultChecked={statementPermission ? true : false}
									onChange={(e) => setStatementPermission(e.target.checked ? 1 : 0)}/>
							</Col>
						</Row>
						<Form.Group className={listItem.username === "admin" ? "d-none" : ""} controlId="formSelectFromGroup">
							<Form.Label>Csoport</Form.Label>
							<Form.Select 
								onChange={(e) => setSelectedGroup(Number(e.target.value))}
								disabled={loggedInUser !== undefined ? true : false}
								defaultValue={listItem.accessgroup}>
								{loggedInUser === undefined ? 
									groupList
									.map((groupListItem) =>
										<option
											key={ groupListItem.id }
											value={ groupListItem.id }>
										{groupListItem.group_name}
										</option>
									) :
									<option>{listItem.group_name}</option>
								}
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
};