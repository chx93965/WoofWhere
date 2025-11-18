import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Hook to use Auth Context
export const useAuth = () => useContext(AuthContext);

// Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Whenever the user changes, persist it to localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Logout function to clear context and localStorage
    const handleLogout = () => {
        setUser(null);  // Clear user from context
        localStorage.removeItem('user');  // Remove user from localStorage
    };

    return (
        <AuthContext.Provider value={{ user, setUser, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};