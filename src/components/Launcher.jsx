import React, { useEffect } from 'react'
import axios from '@/api/axios'
import { useConfigurationContext } from '@/context/ConfigurationProvider'
import Head from 'next/head'

const Launcher = ({ children }) => {
    const { applicationName, setApplicationName, applicationLogo, setApplicationLogo, applicationImage, setApplicationImage, applicationDescription, setApplicationDescription } = useConfigurationContext()

    const getKonfigurasi = async () => {
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API}/configuration?name[]=application_name&name[]=application_logo&name[]=application_image&name[]=application_description`
        }).then((res) => {
            if (res.data?.length > 0) {
                res.data.map((val) => {
                    if (val.name === 'application_name') setApplicationName(val.value)
                    if (val.name === 'application_logo') setApplicationLogo(val.value)
                    if (val.name === 'application_image') setApplicationImage(val.value)
                    if (val.name === 'application_description') setApplicationDescription(val.value)
                })
            }
        }).catch((err) => {
            console.error(err)
        })
    }

    useEffect(() => {
        if (applicationName === '' || applicationLogo === '' || applicationImage === '' || applicationDescription === '') {
            getKonfigurasi()
        }
    }, [applicationName, applicationLogo, applicationImage, applicationDescription])
    return (
        <>
            <Head>
                <link rel="shortcut icon" href={`${process.env.NEXT_PUBLIC_RESTFUL_API}/configuration/image/${applicationLogo}`} type="image/x-icon" />
            </Head>
            {children}
        </>
    )
}

export default Launcher