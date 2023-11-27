import { useEffect, useState } from 'react';
import axios from 'axios';
import Loginform from './Components/Loginform/Loginform';
import Statements from './Components/Dashboard/Statements/Statements';
import Users from './Components/Dashboard/Users/Users';
import Clients from './Components/Dashboard/Clients/Clients';
import Log from './Components/Dashboard/Log/Log';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { Nav, Navbar, Container, Offcanvas} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

import './App.css';

function App() {
    const [ token, setToken ] = useState(false);
    const [ loggedInUser, setLoggedInUser ] = useState(getLoggedInUser);
    const [ darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') ? localStorage.getItem('darkMode') : false);
    const [activeMenuItem, setActiveMenuItem] = useState('users');
    const [showOffcanvasMenu, setShowOffcanvasMenu] = useState(false);

    function getToken() {
        let username = getLoggedInUser();
        let password = getLoggedInPassword();
        if (username !== '' && password !== '') {
            axios.post('http://localhost:8080/checkloggedinuser', {
                username : username, 
                password : password
            })
            .then ((data) => {
                setToken(data.data);
            }
            )
        } else {
            setToken(false);
            }
    }

    function getLoggedInPassword( ) {
        let token = sessionStorage.getItem('token')
        if (token !== null) {
            for (let char of token) {
                if (char !== '$') token = token.slice(1)   
                else return token
            }
        } else return ''
    }

    function getLoggedInUser( ) {
        let token = sessionStorage.getItem('token');
        let username = '';
        if (token !== null) {
            for (let char of token){
                if (char !== '$') {
                    username += char
                } else return username;
            }
        } else return '';

    }

    function handleLogOut() {
        sessionStorage.removeItem('token');
        setToken(false);
        return <Loginform setToken={setToken} setLoggedInUser={setLoggedInUser}/>
    };

    useEffect(() => {
        document.body.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light')
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode] )

    useEffect(getToken, []);
    
    if (!token) {         
        return <Loginform setToken={setToken} setLoggedInUser={setLoggedInUser}/>
    }

    return (
        <>
        <BrowserRouter>
            <Navbar key='md' expand='md' className="bg-body-tertiary mb-3">
                <Container fluid>
                    <Navbar.Brand>DCL</Navbar.Brand>
                    <Navbar.Toggle 
                        onClick={()=> setShowOffcanvasMenu(true)}
                        aria-controls={`offcanvasNavbar-expand-md`} />
                    <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand-md`}                       
                        placement="end"
                        show={showOffcanvasMenu}
                        className='w-auto'>
                        <Offcanvas.Header>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
                                {loggedInUser}
                            </Offcanvas.Title>
                            <button type="button" className="btn-close" onClick={()=> setShowOffcanvasMenu(false)}></button>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav 
                                className='me-auto'
                                activeKey={activeMenuItem}
                                onSelect={(selectedKey) => setActiveMenuItem(selectedKey)}
                                onClick={()=> setShowOffcanvasMenu(false)}>
                                <Nav.Link eventKey='users'as={Link} to='/dashboard/users'>Felhasználók</Nav.Link>
                                <Nav.Link eventKey='clients'as={Link} to='/dashboard/clients'>Ügyfelek</Nav.Link>
                                <Nav.Link eventKey='log'as={Link} to='/dashboard/log'>Napló</Nav.Link>
                                <Nav.Link eventKey='statements'as={Link} to='/dashboard/statements'>Kimutatások</Nav.Link>
                            </Nav>
                            <Container className='menuAssets'>
                                <span
                                    className='dark-mode-switcher cursor-pointer'
                                    onClick={() => setDarkMode(darkMode ? false : true)}
                                    title={darkMode ? 'Világos mód' : 'Sötét mód'}>
                                    {darkMode ? <Icon.BrightnessHighFill/> : <Icon.MoonStars/>}    
                                </span>
                                <span title='Bejelentkezett felhasználó' className='display-none'>{loggedInUser}</span>
                                 <Icon.BoxArrowInRight 
                                    onClick={handleLogOut} 
                                    title='Kilépés'
                                    className='cursor-pointer'
                                    size={28}/>                         
                            </Container>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
        </Navbar>
        <Routes className='mx-3'>
            <Route path='/' element={<Users darkMode={darkMode}/>}/>
            <Route path='/dashboard/users' element={<Users darkMode={darkMode}/>}/>
            <Route path='/dashboard/clients' element={<Clients/>}/>
            <Route path='/dashboard/log' element={<Log/>}/>
            <Route path='/dashboard/statements' element={<Statements/>}/>
        </Routes>
      </BrowserRouter>
    </>
    );
}

export default App;
