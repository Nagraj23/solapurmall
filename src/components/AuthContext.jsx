import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

const decodeToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        //console.log("JWT Decoded:", decoded); 

        return {
            id: decoded.userId || decoded.id,
            email: decoded.sub,
            userRole: decoded.userRole,
            firstName: decoded.firstName,     // Your custom first name claim
            exp: decoded.exp,                 // Expiration timestamp

        };
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
};


export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [authToken, setAuthToken] = useState(() => localStorage.getItem('jwtToken') || null);

    // State to derive if the user is authenticated, based on the presence of an authToken.
    const [isAuthenticated, setIsAuthenticated] = useState(!!authToken);

    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('jwtToken');
        return token ? decodeToken(token) : null;
    });


    useEffect(() => {
        setIsAuthenticated(!!authToken);

        if (authToken) {
            const decodedUser = decodeToken(authToken);

            // 👇 Check expiry BEFORE setting user
            if (decodedUser && decodedUser.exp * 1000 < Date.now()) {
                console.warn("Token expired. Logging out automatically.");
                logout();
            } else {
                setUser(decodedUser); // ✅ Only set user if token is valid
            }
        } else {
            setUser(null);
        }
    }, [authToken, navigate]); // Dependencies: Re-run when authToken or navigate changes.

    const login = (token, userDataFromBackend) => {
        console.log("🔐 Received Token: ", token);
        console.log("📦 Decoded Token: ", decodeToken(token));

        localStorage.setItem('jwtToken', token);
        setAuthToken(token);
        setUser(userDataFromBackend || decodeToken(token));
    };

    // Logout function: called from Navbar or ProfilePage to end the user's session.
    const logout = () => {
        localStorage.removeItem('jwtToken'); // Remove token from localStorage
        setAuthToken(null); // Clear authToken state (triggers useEffect)
        setUser(null);      // Clear user data state
        navigate('/login'); // Redirect to the login page after logout
    };

    const authContextValue = {
        authToken,
        isAuthenticated,
        user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children} {/* Render all child components wrapped by this provider */}
        </AuthContext.Provider>
    );
};