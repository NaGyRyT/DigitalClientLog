import React,  { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import './Loginform.css';


export default function Loginform( { setToken, setLoggedInUser }) {
	const [username, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('')
/* 	const [validated, setValidated] = useState(false); */

	async function loginUser(credentials) {
		await axios.post('http://localhost:8080/login', {username : credentials.username.trim(), 
														password : credentials.password.trim()})
		.then ((data) => {
			if (data.data.length !== 0) {
				setMessage('');
				setToken(true);
				/* debugger; */
				setLoggedInUser(data.data[0].username);
				sessionStorage.setItem("token", data.data[0].username + data.data[0].password);
			} else {
				setMessage('Rossz felhasználónév vagy jelszó');
			/* 	setValidated(true); */
			}
		})
	}

	const handleLoginSubmit = async (e) => {
		e.preventDefault();
		e.stopPropagation()
		loginUser({
			username,
			password
		});
	}

return (
    <div className='login-form'>
		<Container>
			<h1>Kérlek lépj be</h1>
			{(message === '') ? 
					'' :
					<Alert variant="danger">{message}</Alert>	
				}
			<Form noValidate /* validated={validated} */ onSubmit={handleLoginSubmit}>
				<Form.Group className="mb-3" controlId="formUsername">
					<Form.Label>Felhasználónév</Form.Label>
					<Form.Control 
						required
						type="text" 
						placeholder="Írd be a felhasználó nevedet!"
						autoComplete="username"
						onChange={e => setUserName(e.target.value)}/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formPassword">		
					<Form.Label>Jelszó</Form.Label>
					<Form.Control 
						required
						type="password" 
						placeholder="Írd be a jelszavadat!"
						autoComplete="password"
						onChange={e => setPassword(e.target.value)}/>
				</Form.Group>
				<Button variant="primary" type="submit">
					Belépés
				</Button>
			</Form>

		</Container>
    </div>
  )
}