import { useEffect, useState } from 'react';
import axios from 'axios';
import Landingpage from './Components/Landingpage/Landingpage';
import Loginform from './Components/Loginform/Loginform';
import Statements from './Components/Dashboard/Statements/Statements';
import Users from './Components/Dashboard/Users/Users';
import Groups from './Components/Dashboard/Groups/Groups';
import Clients from './Components/Dashboard/Clients/Clients';
import Log from './Components/Dashboard/Log/Log';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { Nav, Navbar, Container, Offcanvas } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import './App.css';
import Edituser from './Components/Dashboard/Users/Edituser/Edituser';
import API from './api';
axios.defaults.headers.common['subdomain'] = window.location.host.split('.')[0];

function App() {
    const [token, setToken] = useState(false);
    const [loggedInUserData, setLoggedInUserData] = useState('');
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true'? true : false);
    const [activeMenuItem, setActiveMenuItem] = useState('users');
    const [showOffcanvasMenu, setShowOffcanvasMenu] = useState(false);
    const [companyData, setCompanyData] = useState('');

    function loadCompanyData() {
        axios.get(`${API.address}/getcompanydata`, {
            headers: {
              'x-api-key': loggedInUserData.password
            }})
            .then ((data) => setCompanyData(data.data[0]))
      };
    
    function getToken() {
        let username = getLoggedInUser();
        let password = getLoggedInPassword();
        if (username !== '' && password !== '') {
            axios.post(`${API.address}/checkloggedinuser`, 
                {
                    username : username, 
                    password : password
                },
                {
                    headers: {'x-api-key': API.key}
                }
            )
            .then (async (data) => {
                if (data.data.length > 0) {
                    setToken(true);
                    setLoggedInUserData(data.data[0]);
                } else setToken(false);
            });
        } else {
            setToken(false);
            }
    };

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
            for (let char of token) {
                if (char !== '$') {
                    username += char;
                } else return username;
            }
        } else return '';
    };

    function handleLogOut() {
        sessionStorage.removeItem('token');
        setToken(false);
        return <Loginform setToken={setToken} setLoggedInUserData={setLoggedInUserData}/>
    };
    
    useEffect(() => {
        document.body.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light')
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode] );

    useEffect(getToken, []);
    
    useEffect(() => {if (loggedInUserData !== '') loadCompanyData()}, [loggedInUserData]);

    if (!token && API.subdomains.find((item) => item === window.location.host.split('.')[0])) {    
        return <Loginform setToken={setToken} setLoggedInUserData={setLoggedInUserData} />
    } else if (token && API.subdomains.find((item) => item === window.location.host.split('.')[0]))
    return (
        <>
            <BrowserRouter>
                <Navbar key='md' expand='md' className="bg-body-tertiary mb-3">
                    <Container fluid>
                        <Navbar.Brand className='fs-4 p-0 d-flex flex-column'>
                                <span>D<span className="fs-6">igital</span>C<span className="fs-6">lient</span>L<span className="fs-6">og</span></span>
                                <span className='m-0 p-0 menu-company-name'>{companyData.shortname}</span>
                        </Navbar.Brand>
                        <Navbar.Toggle 
                            onClick={()=> setShowOffcanvasMenu(true)}
                            aria-controls={`offcanvasNavbar-expand-md`} />
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-md`}                       
                            placement="end"
                            show={showOffcanvasMenu}
                            className='w-auto'>
                            <Offcanvas.Header className='p-2 border-bottom'>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
                                <Container className='menu-assets'>
                                    <div className='mobil-menu-name-group-container'>
                                        <Edituser
                                            listItem={loggedInUserData}
                                            setLoggedInUserData={setLoggedInUserData}
                                            loggedInUser={loggedInUserData.username}
                                            loggedInUserData={loggedInUserData}>
                                        </Edituser>
                                    </div>
                                    <div className='mobil-menu-icons-container'>
                                        <span
                                            className='dark-mode-switcher cursor-pointer d-flex align-items-center'
                                            onClick={() => setDarkMode(darkMode ? false : true)}
                                            title={darkMode ? 'Világos mód' : 'Sötét mód'}>
                                            {darkMode ? <Icon.BrightnessHighFill/> : <Icon.MoonStars/>}
                                        </span>
                                        <Icon.BoxArrowInRight 
                                            onClick={handleLogOut} 
                                            title='Kilépés'
                                            className='cursor-pointer'
                                            size={28}/>                        
                                    </div>
                                    <button type="button" className="btn-close" onClick={()=> setShowOffcanvasMenu(false)}></button>
                                </Container>
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav 
                                    className='me-auto'
                                    activeKey={activeMenuItem}
                                    onSelect={(selectedKey) => setActiveMenuItem(selectedKey)}
                                    onClick={()=> setShowOffcanvasMenu(false)}>
                                        {loggedInUserData.group_name === 'Admin' ?
                                            <>
                                                <Nav.Link eventKey='users'as={Link} to='/dashboard/users'>Felhasználó</Nav.Link>
                                                <Nav.Link eventKey='groups'as={Link} to='/dashboard/groups'>Csoport</Nav.Link>
                                            </>  :
                                            ''
                                        }
                                    <Nav.Link eventKey='clients'as={Link} to='/dashboard/clients'>Ügyfél</Nav.Link>
                                    <Nav.Link eventKey='log'as={Link} to='/dashboard/log'>Napló</Nav.Link>
                                    <Nav.Link eventKey='statements'as={Link} to='/dashboard/statements'>Kimutatás</Nav.Link>
                                </Nav>
                                <Container className='display-none menu-assets'>
                                    <span
                                        className='dark-mode-switcher cursor-pointer d-flex align-items-center'
                                        onClick={() => setDarkMode(darkMode ? false : true)}
                                        title={darkMode ? 'Világos mód' : 'Sötét mód'}>
                                        {darkMode ? <Icon.BrightnessHighFill/> : <Icon.MoonStars/>}
                                    </span>
                                    <Edituser
                                        listItem={loggedInUserData}
                                        setLoggedInUserData={setLoggedInUserData}
                                        loggedInUser={loggedInUserData.username}
                                        loggedInUserData={loggedInUserData}>
                                    </Edituser>
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
                <Route path='/' element={<Clients loggedInUserData={loggedInUserData}/>}/>
                {loggedInUserData.group_name === 'Admin' ?
                    <>
                        <Route path='/dashboard/users' element={<Users darkMode={darkMode} loggedInUserData={loggedInUserData}/>}/>
                        <Route path='/dashboard/groups' element={<Groups loggedInUserData={loggedInUserData}/>}/>
                    </> :
                    ''
                }
                <Route path='/dashboard/clients' element={<Clients loggedInUserData={loggedInUserData}/>}/>
                <Route path='/dashboard/log' element={<Log loggedInUserData={loggedInUserData}/>}/>
                <Route path='/dashboard/statements' element={<Statements darkMode={darkMode} loggedInUserData={loggedInUserData}/>}/> :
            
            </Routes>
            </BrowserRouter>
        </>
    ); else {
        return <Landingpage/>
    }
};

export default App;
