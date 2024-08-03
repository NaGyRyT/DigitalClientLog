import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import moment from 'moment';
import { Form, Alert, Button, Modal, Row, Col, Stack } from 'react-bootstrap';
import { validateClient } from '../Validateclient/Validateclient';
import API from '../../../../api';

export default function Newclient( { 
	loadClientList,
	cityList,
	loggedInUserData
	} ) {
	const [name, setName] = useState('');
	const [clientId, setClientId] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [zip, setZip] = useState('6000');
	const [cityId, setCityId] = useState(1494);
	const [street, setStreet] = useState('');
	const [houseNumber, setHouseNumber] = useState('');
	const [floor, setFloor] = useState('');
	const [door, setDoor] = useState('');
	const [otherData, setOtherData] = useState('');
	const [errorMessage, setErrorMessage] = useState({
		name : '',
		clientId : '',
        birthDate : '',
        gender : '',
        zip : '',
		city : '',
        phone : '',
        email : '',
		registrationDate : '',
		error : false,
  	});

	const [petition, setPetition] = useState(0);
	const [premissionNoticeAffected, setPremissionNoticeAffected] = useState(0);
	const [premissionNoticeRelative, setPremissionNoticeRelative] = useState(0);
	const [premissionNoticeLegalRepresentative, setPremissionNoticeLegalRepresentative] = useState(0);
	const [agreement, setAgreement] = useState(0);
	const [selfCare, setSelfCare] = useState(0);
	const [socialSkills, setSocialSkills] = useState(0);
	const [registrationDate, setRegistrationDate] = useState(moment().format('YYYY-MM-DD'));
	const [interested, setInterested] = useState(0);
	const [diseaseSeverity, setDiseaseSeverity] = useState(0);
	
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
	const [showNewClientForm, setShowNewClientForm] = useState(false);
	const handleCloseNewClientForm = async () => {
		setShowNewClientForm(false);
		setName('');
		setClientId('');
        setBirthDate('');
        setGender('');
        setZip('6000');
		setCityId(1494);
		setStreet('');
		setHouseNumber('');
		setFloor('');
		setDoor('');
        setPhone('');
		setEmail('');
		setRegistrationDate(moment().format('YYYY-MM-DD'));
		setPetition(0);
		setPremissionNoticeAffected(0);
		setPremissionNoticeRelative(0);
		setPremissionNoticeLegalRepresentative(0);
		setAgreement(0);
		setSelfCare(0);
		setSocialSkills(0);
		setInterested(0);
		setOtherData('');
		setDiseaseSeverity(0);
 	 	setErrorMessage({
            name : '',
			clientId : '',
            birthDate : '',
            gender : '',
            zip : '',
			city : '',
            phone : '',
            email : '',
			error : false, 
			registrationDate : '',
		})
	}
	const handleShowNewClientForm = () => setShowNewClientForm(true);
  	const handleNewClientSubmit = async (e) => {
		setDisableSubmitButton(true);
		e.preventDefault();
		const tempErrorMessage = await validateClient(
			name, 
			clientId, 
			'', 
			birthDate, 
			gender, 
			email, 
			phone, 
			zip, 
			cityId, 
			loggedInUserData.accessgroup, 
			loggedInUserData, 
			registrationDate
		);
		setErrorMessage(tempErrorMessage);
 		if (! tempErrorMessage.error) {
			axios.post(`${API.address}/newclient`, {name : name.trim(),
														client_id : clientId,
														accessgroup : loggedInUserData.accessgroup,
														birth_date : birthDate,
														gender : gender,
														city_id : cityId,
														street : street.trim(),
														house_number : houseNumber.trim(),
														floor : floor.trim(),
														door : door.trim(),
														phone : phone.trim(),
														email : email.trim(),
														user_id : loggedInUserData.id,
														petition : petition,
														affected : premissionNoticeAffected,
														relative : premissionNoticeRelative,
														legal_representative : premissionNoticeLegalRepresentative,
														agreement : agreement,
														self_care : selfCare,
														social_skills : socialSkills,
														registration_date : registrationDate,
														end_of_service : '3000-01-01',
														interested : interested,
														disease_severity : diseaseSeverity,
														other_data : otherData.trim()
													}, 
													{headers: { 'x-api-key': loggedInUserData.password }})
			.then(() => {
				handleCloseNewClientForm();
				loadClientList();
				setDisableSubmitButton(false);
			});
		} else setDisableSubmitButton(false);
		
	}
    
	function findCity(zip) {
		const findedCity = cityList.find((cityListItem) => cityListItem.zip === zip)
		if (findedCity !== undefined) return findedCity.id
			else return 0
	}

	function findZip(id) {
		const findedZip = cityList.find((cityListItem) => cityListItem.id === Number(id))
		return findedZip.zip
	}

	return (
		<>{loggedInUserData.readonlypermission === 0 &&
			<Button className='mx-3' variant='primary' onClick={handleShowNewClientForm}>
				+ Új ügyfél
			</Button>}
			<Modal 
				show={showNewClientForm} 
				onHide={handleCloseNewClientForm}
				dialogClassName='modal-80w'
				backdrop='static'>
				<Modal.Header closeButton>
					<Modal.Title>Új ügyfél felvitele</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleNewClientSubmit}>
						<Stack gap={3} className='d-flex flex-lg-row'>
						<Stack>
							<Row className='mb-3'>
								<Col xs={12} sm={8}>
									<Form.Group className='mb-3' controlId='formName'>
										<Form.Label>Név</Form.Label>
										{errorMessage.name === '' ? '' : <Alert variant='danger' size='sm'>{errorMessage.name}</Alert>}
										<Form.Control 
											autoComplete='name'
											maxLength={100}
											type='text'
											value={name}
											onChange={(e) => setName(e.target.value)}/>
									</Form.Group>
								</Col>
								<Col xs={12} sm={4}>
									<Form.Group className='mb-3' controlId='formId'>
										<Form.Label>Iktatószám</Form.Label>
										{errorMessage.clientId === '' ? '' : <Alert variant='danger' size='sm'>{errorMessage.clientId}</Alert>}
										<Form.Control 
											autoComplete='on'
											maxLength={18}
											type='text'
											value={clientId}
											onChange={(e) => setClientId(e.target.value)}/>
									</Form.Group>
								</Col>
							</Row>
							<Row className='mb-3'>
								<Col xs={12} sm={6}>
									<Form.Group controlId='formBirthDate'>
										<Form.Label>Születési dátum</Form.Label>
										{errorMessage.birthDate === '' ? '' : <Alert variant='danger' size='sm'>{errorMessage.birthDate}</Alert>}
										<Form.Control
											min='1900-01-01'
											max='2099-12-31'
											type='date'
											value={birthDate}
											onChange={(e) => setBirthDate(e.target.value)}/>
									</Form.Group>
								</Col>
								<Col xs={12} sm={6}>
									<Form.Group controlId='formSelectFromGender'>
										<Form.Label>Nem</Form.Label>
										{errorMessage.gender === '' ? '' : <Alert variant='danger' size='sm'>{errorMessage.gender}</Alert>}
										<Form.Select onChange={(e) => setGender(e.target.value)}>
											<option key='0' value=''>Válassz nemet!</option>
											<option key='man' value='férfi'>férfi</option>
											<option key='woman' value='nő'>nő</option>
										</Form.Select>	
									</Form.Group>
								</Col>
							</Row>
							<Row className='mb-3'>
								<Col xs={12} sm={6}>
									<Form.Group controlId='formEmail'>
										<Form.Label>E-mail</Form.Label>
										{errorMessage.email === '' ? '' : <Alert variant='danger' size='sm'>{errorMessage.email}</Alert>}
										<Form.Control 
											autoComplete='email'
											type='e-mail'
											value={email}
											maxLength={100}
											onChange={(e) => setEmail(e.target.value)}/>
									</Form.Group>
								</Col>
								<Col xs={12} sm={6}>
									<Form.Group controlId='formPhone'>
										<Form.Label>Telefon</Form.Label>
										{errorMessage.phone === '' ? '' : <Alert variant='danger' size='sm'>{errorMessage.phone}</Alert>}
										<Form.Control 
											autoComplete='tel'
											maxLength={12}
											type='tel'
											placeholder='+36.........'
											value={phone}
											onChange={(e) => setPhone(e.target.value)}/>
									</Form.Group>
								</Col>
							</Row>
							<Row className='mb-3'>
								<Col xs={12} sm={4}>
									<Form.Group controlId='formZip'>
										<Form.Label>Irányítószám</Form.Label>
										{errorMessage.zip === '' ? '' : <Alert variant='danger' size='sm'>{errorMessage.zip}</Alert>}
										<Form.Control 
											autoComplete='postal-code'
											maxLength={4}
											type='text'
											value={zip}
											onChange={(e) => {
												setZip(e.target.value.replace(/\D/g, ''))
												e.target.value.length === 4 ? setCityId(findCity(e.target.value)) : setCityId(0)
											}}/>
									</Form.Group>
								</Col>
								<Col xs={12} sm={8}>
								<Form.Group md='4' controlId='formSelectCity'>
									<Form.Label>Város</Form.Label>
									{errorMessage.city === '' ? '' : <Alert variant='danger' size='sm'>{errorMessage.city}</Alert>}
									<Form.Select 
										onChange={(e) => {
											setCityId(e.target.value)
											e.target.value !== '0' ? setZip(findZip(e.target.value)) : setZip('')
										}}
										value={
											zip === '6000' ? 1494 :
											zip.length === 4 ? cityList.filter((cityListItem) => cityListItem.id === Number(cityId)).map((item) => item.id) : 0}
									>				
										<option key={0} value={0}>Válassz várost!</option>
										{cityList.map((cityListItem) => 
											<option 
												key={cityListItem.id}
												value={cityListItem.id}>
												{cityListItem.city}
											</option>)}
									</Form.Select>	
								</Form.Group>
								</Col>
							</Row>
							<Row className='mb-3'>
								<Col xs={12} sm={6}>
									<Form.Group controlId='formStreet'>
										<Form.Label>Közterület</Form.Label>
										<Form.Control 
											autoComplete='on'
											maxLength={100}
											type='text'
											value={street}
											onChange={(e) => setStreet(e.target.value)}/>
									</Form.Group>
								</Col>
								<Col xs={3} sm={2}>
									<Form.Group controlId='formHouseNumber'>
										<Form.Label>Házszám</Form.Label>
										<Form.Control 
											autoComplete='on'
											maxLength={5}
											type='text'
											value={houseNumber}
											onChange={(e) => setHouseNumber(e.target.value)}/>
									</Form.Group>
								</Col>
								<Col xs={3} sm={2}>
									<Form.Group controlId='formFloor'>
										<Form.Label>Emelet</Form.Label>
										<Form.Control 
											autoComplete='on'
											maxLength={4}
											type='text'
											value={floor}
											onChange={(e) => setFloor(e.target.value)}/>
									</Form.Group>
								</Col>
								<Col xs={3} sm={2}>
									<Form.Group controlId='formDoor'>
										<Form.Label>Ajtó</Form.Label>
										<Form.Control 
											autoComplete='on'
											maxLength={4}
											type='text'
											value={door}
											onChange={(e) => setDoor(e.target.value)}/>
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col xs={12} sm={12}>
									<Form.Group controlId="formOtherData">
										<Form.Label>Egyéb Adatok</Form.Label>
										<Form.Control
											as="textarea"
											rows={3}
											type='text'
											placeholder='Egyéb adatok...'
											value={otherData}
											onChange={(e) => setOtherData(e.target.value)}/>
									</Form.Group>
								</Col>
							</Row>
						</Stack>
						<div className='d-none d-lg-block vr'></div>
						<hr className='d-lg-none mt-1 mb-1'/>
						<Stack>
							<Row>
								<Col>Kérelem</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='petition'
										value={1}
										checked={petition === 1}
										type='radio'
										id='newUserRadio1'
										onChange={()=> setPetition(1)}
										/>
									</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='petition'
										value={0}
										checked={petition === 0}
										type='radio'
										id='newUserRadio2'
										onChange={()=> setPetition(0)}
									/>
								</Col>
							</Row>
							<hr className='mt-1 mb-1'/>
							<Row>
								<Form.Text>Hozzájáruló nyilatkozat személyes adatok, információk rögzítéséhez és kezeléséhez</Form.Text>
							</Row>
							<Row>
								<Col>Érintett részére</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='affected'
										value={1}
										checked={premissionNoticeAffected === 1}
										type='radio'
										id='newUserRadio3'
										onChange={()=> setPremissionNoticeAffected(1)}
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='affected'
										value={0}
										checked={premissionNoticeAffected === 0}
										type='radio'
										id='newUserRadio4'
										onChange={()=> setPremissionNoticeAffected(0)}
									/>
								</Col>
							</Row>
							<Row>
								<Col>Hozzátartozó részére</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='relative'
										value={1}
										checked={premissionNoticeRelative === 1}
										type='radio'
										id='newUserRadio5'
										onChange={()=> setPremissionNoticeRelative(1)}
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='relative'
										value={0}
										checked={premissionNoticeRelative === 0}
										type='radio'
										id='newUserRadio6'
										onChange={()=> setPremissionNoticeRelative(0)}
									/>
								</Col>
							</Row>
							<Row>
								<Col>Törvényes képviselő részére</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='legalRepresentative'
										value={1}
										checked={premissionNoticeLegalRepresentative === 1}
										type='radio'
										id='newUserRadio7'
										onChange={()=> setPremissionNoticeLegalRepresentative(1)}
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='legalRepresentative'
										value={0}
										checked={premissionNoticeLegalRepresentative === 0}
										type='radio'
										id='newUserRadio8'
										onChange={()=> setPremissionNoticeLegalRepresentative(0)}
									/>
								</Col>
							</Row>
							<hr className='mt-1 mb-1'/>
							<Row>
								<Col>Megállapodás</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='agreement'
										value={1}
										checked={agreement === 1}
										type='radio'
										id='newUserRadio9'
										onChange={()=> setAgreement(1)}
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='agreement'
										value={0}
										checked={agreement === 0}
										type='radio'
										id='newUserRadio10'
										onChange={()=> setAgreement(0)}
									/>
								</Col>
							</Row>
							<Row>
								<Col>Önálló életvitel felmérése</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='selfCare'
										value={1}
										checked={selfCare === 1}
										type='radio'
										id='newUserRadio11'
										onChange={()=> setSelfCare(1)}
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='selfCare'
										value={0}
										checked={selfCare === 0}
										type='radio'
										id='newUserRadio12'
										onChange={()=> setSelfCare(0)}
									/>
								</Col>
							</Row>
							<Row>
								<Col>Szociális készségek felmérése</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='socialSkills'
										value={1}
										checked={socialSkills === 1}
										type='radio'
										id='newUserRadio13'
										onChange={()=> setSocialSkills(1)}
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='socialSkills'
										value={0}
										checked={socialSkills === 0}
										type='radio'
										id='newUserRadio14'
										onChange={()=> setSocialSkills(0)}
									/>
								</Col>
							</Row>
							<hr className='mt-1 mb-1'/>
							<Row className='mb-3'>
								<Col className='d-flex align-items-center'>Szolgáltatás kezdete</Col>
								<Col >
									<Form.Group controlId='formREgistrationDate'>
										{errorMessage.registrationDate === '' ? '' : <Alert variant='danger' size='sm'>{errorMessage.registrationDate}</Alert>}
										<Form.Control
											min='1900-01-01'
											max='2099-12-31'
											type='date'
											value={registrationDate}
											onChange={(e) => setRegistrationDate(e.target.value)}/>
									</Form.Group>
								</Col>
							</Row>
							<hr className='mt-1 mb-1'/>
							<Row>
								<Col>Érdeklődő</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='interested'
										value={1}
										checked={interested === 1}
										type='radio'
										id='newUserRadio15'
										onChange={()=> setInterested(1)}
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='interested'
										value={0}
										checked={interested === 0}
										type='radio'
										id='newUserRadio16'
										onChange={()=> setInterested(0)}
									/>
								</Col>
							</Row>
							<hr className='mt-1 mb-1'/>
							<Row>
								<Col>Betegség foka</Col>
							</Row>
							<Row>
								<Col xs={4}>
									<Form.Check
										label='enyhe'
										name='diseaseSeverity'
										value={1}
										checked={diseaseSeverity === 1}
										type='radio'
										id='newUserRadio17'
										onChange={()=> setDiseaseSeverity(1)}
										/>
								</Col>
								<Col xs={4}>
									<Form.Check
										label='középsúlyos'
										name='diseaseSeverity'
										value={2}
										checked={diseaseSeverity === 2}
										type='radio'
										id='newUserRadio18'
										onChange={()=> setDiseaseSeverity(2)}
									/>
								</Col>
								<Col xs={4}>
									<Form.Check
										label='súlyos'
										name='diseaseSeverity'
										value={3}
										checked={diseaseSeverity === 3}
										type='radio'
										id='newUserRadio19'
										onChange={()=> setDiseaseSeverity(3)}
									/>
								</Col>
							</Row>
						</Stack>
					</Stack>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={handleCloseNewClientForm}>
					Mégse
				</Button>
				<Button variant='primary' onClick={handleNewClientSubmit} disabled={disableSubmitButton}>
					Rögzít
				</Button>
			</Modal.Footer>
			</Modal>
		</>
	);
}