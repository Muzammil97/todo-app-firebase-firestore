// src/components/Header.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login'); // Redirect to login after logout
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <header className="app-header">
            <h1>My Todo App</h1>
            {currentUser && (
                <div>
                    <span>Welcome,<br/> {currentUser.email}</span>
                    <br/>
                    <button id="logoutbtn" onClick={handleLogout}>Log Out</button>
                </div>
            )}
        </header>
    );
}

export default Header;