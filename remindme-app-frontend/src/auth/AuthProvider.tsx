import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ICredential, ILoginData } from '../utils/interface';
import APIService from '../utils/APIService';

// Define AuthContext with a default state
interface AuthContextType {
    session?: ILoginData;
    login: (data: ICredential) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const USER_SESSION_KEY = "session";

export const GET_SESSION = () => {
    const data = localStorage.getItem(USER_SESSION_KEY);
    if (data) {
        return JSON.parse(data) as ILoginData;
    }
    return undefined;
}

// AuthProvider component that provides authentication state
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<ILoginData | undefined>(GET_SESSION());

    const login = async (credential: ICredential) => {
        try {
            const data: ILoginData = await APIService.post('session', credential);
            localStorage.setItem(USER_SESSION_KEY, JSON.stringify(data));
            setSession(data);
        } catch (err) {
            console.error(err);
        }
    };

    const logout = () => {
        localStorage.removeItem(USER_SESSION_KEY);
        setSession(undefined);
    };

    return (
        <AuthContext.Provider value={{ session, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
