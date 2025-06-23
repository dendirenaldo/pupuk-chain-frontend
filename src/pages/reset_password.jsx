import Head from 'next/head'
import React, { useRef, useState } from 'react'
import axios from 'axios'
import styles from '@/styles/pages/index.module.css'
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import AuthLayout from '@/layouts/auth_layout';
import ReactDOMServer from 'react-dom/server';

const ResetPassword = ({ token, email, permission, configuration }) => {
    const router = useRouter()
    const buttonRef = useRef()
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordError, setNewPasswordError] = useState('')
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')
    const [newPasswordConfirmationError, setNewPasswordConfirmationError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        buttonRef.current.disabled = true
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        await axios({
            method: 'PUT',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user/reset-password`,
            data: {
                token,
                email,
                newPassword,
                newPasswordConfirmation
            }
        }).then((res) => {
            if (res.data?.id) {
                Swal.fire('Success', 'Your password has been successfully reset. You will be redirected to the main page in 5 seconds!', 'success').then(() => router.push('/'))
                setNewPassword('')
                setNewPasswordError('')
                setNewPasswordConfirmation('')
                setNewPasswordConfirmationError('')
            }
        }).catch((err) => {
            const error = err.response.data

            if (error.statusCode === 400) {
                if (error.newPassword) {
                    setNewPasswordError(error.newPassword)
                } else {
                    setNewPasswordError('')
                }

                if (error.newPasswordConfirmation) {
                    setNewPasswordConfirmationError(error.newPasswordConfirmation)
                } else {
                    setNewPasswordConfirmationError('')
                }
            }
        }).finally(() => {
            buttonRef.current.disabled = false
            buttonRef.current.innerHTML = 'Reset'
        })
    }
    return (
        <>
            <Head>
                <title>{`Reset Password | ${configuration.applicationName}`}</title>
                <meta name="description" content={configuration.applicationDescription} />
            </Head>
            {permission === true && (

                <div className="d-block d-md-flex align-items-center">
                    <div className={styles.gambar} style={{ background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${process.env.NEXT_PUBLIC_RESTFUL_API}/configuration/image/${configuration.applicationImage}) center` }} alt="">
                        <h4 className={styles.nama}>{configuration.applicationName}</h4>
                    </div>
                    <div className='w-100 py-4 px-3'>
                        <img src={`${process.env.NEXT_PUBLIC_RESTFUL_API}/configuration/image/${configuration.applicationLogo}`} className='mx-auto d-block' style={{ height: '50px', objectFit: 'cover' }} alt="" />
                        <h5 className='text-center text-primary mt-1 mb-3 fw-bold'>Reset Password</h5>
                        <form action="" onSubmit={handleSubmit}>
                            <div>
                                <label className='mb-1'>New Password</label>
                                <input type='password' onChange={(e) => setNewPassword(e.target.value)} value={newPassword} className={`form-control ${newPasswordError != '' && 'is-invalid'}`} />
                                {newPasswordError != '' && (<div className='invalid-feedback'>{newPasswordError}</div>)}
                            </div>
                            <div className='mt-4 mb-3'>
                                <label className='mb-1'>New Password Confirmation</label>
                                <input type='password' onChange={(e) => setNewPasswordConfirmation(e.target.value)} value={newPasswordConfirmation} className={`form-control ${newPasswordConfirmationError != '' && 'is-invalid'}`} />
                                {newPasswordConfirmationError != '' && (<div className='invalid-feedback'>{newPasswordConfirmationError}</div>)}
                            </div>
                            <button type='submit' ref={buttonRef} className='btn btn-primary w-100 rounded-pill fw-bold'>Reset</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export async function getServerSideProps(context) {
    const { token, email } = context.query;
    let permission = false
    await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user/check-reset-password-token`,
        data: {
            token,
            email
        }
    }).then((res) => {
        if (res.data?.accountId) {
            permission = true
        }
    }).catch((err) => {
        console.error(err)
    })
    const res = await axios({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/configuration?name[]=application_name&name[]=application_logo&name[]=application_image&name[]=application_description`
    }).then((res) => {
        let configuration = {}

        if (res.data?.length > 0) {
            res.data.map((val) => {
                if (val.name === 'application_name') configuration = { ...configuration, ...{ applicationName: val.value } }
                if (val.name === 'application_logo') configuration = { ...configuration, ...{ applicationLogo: val.value } }
                if (val.name === 'application_image') configuration = { ...configuration, ...{ applicationImage: val.value } }
                if (val.name === 'application_description') configuration = { ...configuration, ...{ applicationDescription: val.value } }
            })
        }

        return configuration
    })
    return {
        notFound: permission === true ? false : true,
        props: {
            token,
            email,
            permission,
            configuration: res,
        }
    }
}

ResetPassword.getLayout = function getLayout(page) {
    return (
        <AuthLayout>{page}</AuthLayout>
    )
}

export default ResetPassword;