import React, { useEffect } from 'react'
import { useAuthContext } from '@/context/AuthProvider';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import LandingLayout from '@/layouts/landing_layout';

const Logout = () => {
    const router = useRouter();
    const { setAuth, setProfile } = useAuthContext();

    useEffect(() => {
        setAuth('')
        setProfile({})
        deleteCookie('accessToken')

        setTimeout(() => {
            router.push('/')
        }, 2000)
    }, [])

    return (
        <div style={{ paddingTop: '96px', minHeight: '55vh' }} className='container d-flex align-items-center justify-content-center'>
            <span className='text-center'>
                <FontAwesomeIcon className='text-warning' icon={faExclamationTriangle} style={{ fontSize: '100px' }} />
                <h3 className='fw-bold'>Peringatan</h3>
                <h6>Anda akan terlogout</h6>
            </span>
        </div>
    )
}

Logout.getLayout = function getLayout(page) {
    return (<LandingLayout title={'Logout'}>{page}</LandingLayout>)
}

export default Logout