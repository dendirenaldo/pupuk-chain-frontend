import { createContext, useContext, useState } from 'react'
import { getCookie } from 'cookies-next';

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const cookieToken = getCookie('accessToken')
    const [auth, setAuth] = useState(cookieToken == null ? '' : cookieToken)
    const [profile, setProfile] = useState({})

    return (
        <AuthContext.Provider value={{ auth, setAuth, profile, setProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    return useContext(AuthContext);
}
