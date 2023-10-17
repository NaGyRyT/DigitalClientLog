import { useEffect, useState } from 'react';
import axios from 'axios';
import Loginform from './Components/Loginform/Loginform';
import Statements from './Components/Dashboard/Statements/Statements';
import Users from './Components/Dashboard/Users/Users';
import Clients from './Components/Dashboard/Clients/Clients';
import Diary from './Components/Dashboard/Diary/Diary';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import './App.css';

function App() {
    const [ token, setToken ] = useState(false);
    const [ loggedInUser, setLoggedInUser ] = useState(getLoggedInUser);
    const [ darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') ? localStorage.getItem('darkMode') : false);

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
        <div data-bs-theme={darkMode ? 'dark' : 'light'}>
            <BrowserRouter>
                <div className="menu">
                    <div>{loggedInUser}</div>
                    <Button variant="secondary" size="sm" onClick={handleLogOut}>Kilépés</Button>
                    <Link to="/dashboard/users">Felhasználók</Link>
                    <Link to="/dashboard/clients">Ügyfelek</Link>
                    <Link to="/dashboard/diary">Napló</Link>
                    <Link to="/dashboard/statements">Kimutatások</Link>
{/*                        <Form.Check
                        className='dark-mode-switcher'
                        type="switch"
                        id="custom-switch"
                        defaultChecked={ darkMode }
                        onChange={(e) => setDarkMode(e.target.checked)}
                        label="☼"
                    /> */}
                    <div
                        className='dark-mode-switcher cursor-pointer'
                        onClick={() => setDarkMode(darkMode ? false : true)}>
                        {darkMode ? '☼' : '☾'}
                    </div>
                </div>

                <div className="dashboard-items">
                    <Routes>
                        <Route path="/" element={<Users darkMode={darkMode}/>}/>
                        <Route path="/dashboard/users" element={<Users className="dashboard-items" darkMode={darkMode}/>}/>
                        <Route path="/dashboard/clients" element={<Clients/>}/>
                        <Route path="/dashboard/diary" element={<Diary/>}/>
                        <Route path="/dashboard/statements" element={<Statements/>}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
