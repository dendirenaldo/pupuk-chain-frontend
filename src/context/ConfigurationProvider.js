import { createContext, useContext, useState } from 'react';

const ConfigurationContext = createContext({})

export const ConfigurationProvider = ({ children }) => {
    const [applicationName, setApplicationName] = useState('')
    const [applicationLogo, setApplicationLogo] = useState('')
    const [applicationImage, setApplicationImage] = useState('')
    const [applicationDescription, setApplicationDescription] = useState('')

    return (
        <ConfigurationContext.Provider value={{ applicationName, setApplicationName, applicationLogo, setApplicationLogo, applicationImage, setApplicationImage, applicationDescription, setApplicationDescription }}>
            {children}
        </ConfigurationContext.Provider>
    )
}

export function useConfigurationContext() {
    return useContext(ConfigurationContext);
}
