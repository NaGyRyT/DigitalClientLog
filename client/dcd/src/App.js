import { useEffect, useState } from 'react';
import axios from 'axios';
import Loginform from './Components/Loginform/Loginform';
import Statements from './Components/Dashboard/Statements/Statements';
import Users from './Components/Dashboard/Users/Users';
import Clients from './Components/Dashboard/Clients/Clients';
import Diary from './Components/Dashboard/Diary/Diary';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    const [ token, setToken ] = useState(false);
    const [ loggedInUser, setLoggedInUser ] = useState(getLoggedInUser);
    function getToken() {
        let username = getLoggedInUser();
        let password = getLoggedInPassword();
        if (username !== '' && password !== '') {
            axios.post('http://localhost:8080/checkloggedinuser', {
                username : username, 
                password : password
            })
            .then ((data) => {
    /*             console.log(data.data) */
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
        /* console.log('lefutott a getLoggedInUser függvény', token); */
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

    useEffect(getToken, []);
    
    if (!token) {         
        return <Loginform setToken={setToken} setLoggedInUser={setLoggedInUser}/>
    }
    
    return (
        <>
        <BrowserRouter>
            <div className="menu">
                <div>{loggedInUser}</div>
                <Button variant="secondary" size="sm" onClick={handleLogOut}>Kilépés</Button>
{/*                 <Link to="/">Home</Link> */}
                <Link to="/dashboard/users">Felhasználók</Link>
                <Link to="/dashboard/clients">Ügyfelek</Link>
                <Link to="/dashboard/diary">Napló</Link>
                <Link to="/dashboard/statements">Kimutatások</Link>
            </div>
            
              {/*   <Route path="/" element={<Dashboard setToken={setToken} loggedInUser={loggedInUser}/>}/>
                <Route path="/dashboard" element={<Dashboard setToken={setToken} loggedInUser={loggedInUser} setLoggedInUser={{setLoggedInUser}}/>}/> */}
            <div className="dashboard-items">
                <Routes>
                    <Route path="/dashboard/users" element={<Users className="dashboard-items"/>}/>
                    <Route path="/dashboard/clients" element={<Clients/>}/>
                    <Route path="/dashboard/diary" element={<Diary/>}/>
                    <Route path="/dashboard/statements" element={<Statements/>}/>
                </Routes>
            </div>
        </BrowserRouter>
        </>
    );
}

export default App;
