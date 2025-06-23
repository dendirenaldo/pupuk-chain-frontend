import Head from 'next/head'
import React, { useRef, useState } from 'react'
import axios from 'axios'
import ReactDOMServer from 'react-dom/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import styles from '@/styles/pages/index.module.css'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';
import AuthLayout from '@/layouts/auth_layout';

const ForgotPassword = ({ configuration }) => {
    const buttonRef = useRef()
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        buttonRef.current.disabled = true
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/account/reset-password`,
            data: { email }
        }).then((res) => {
            if (res.status === 201) {
                Swal.fire('Success', 'Password reset request successful. Please check your email inbox!', 'success').then(() => router.push('/'))
                setEmail('')
                setEmailError('')
            }
        }).catch((err) => {
            const error = err.response.data

            if (err.response.status == 422) {
                setEmailError('Email doesn\'t exists')
            } else {
                if (error.statusCode === 400) {
                    if (error.email) {
                        setEmailError(error.email)
                    } else {
                        setEmailError('')
                    }
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
                <title>{`Forgot Password | ${configuration.applicationName}`}</title>
                <meta name="description" content={configuration.applicationDescription} />
            </Head>

            <div className="d-block d-md-flex align-items-center">
                <div className={styles.gambar} style={{ background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${process.env.NEXT_PUBLIC_RESTFUL_API}/configuration/image/${configuration.applicationImage}) center` }} alt="">
                    <h4 className={styles.nama}>{configuration.applicationName}</h4>
                </div>
                <div className='w-100 py-4 px-3'>
                    <img src={`${process.env.NEXT_PUBLIC_RESTFUL_API}/configuration/image/${configuration.applicationLogo}`} className='mx-auto d-block' style={{ height: '50px', objectFit: 'cover' }} alt="" />
                    <h5 className='text-center text-primary mt-1 mb-3 fw-bold'>Forgot Password</h5>
                    <form action="" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className='mb-1' htmlFor="email">Email Address</label>
                            <div className="input-group">
                                <div className="input-group-text">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>
                                <input type="email" className={`form-control ${emailError !== '' ? 'is-invalid' : ''}`} id='email' onChange={(e) => setEmail(e.target.value)} value={email} required />
                                {emailError !== '' && (
                                    <div className="invalid-feedback">{emailError}</div>
                                )}
                            </div>
                        </div>
                        <button type='submit' ref={buttonRef} className='btn btn-primary w-100 rounded-pill fw-bold'>Reset</button>
                        <p style={{ fontSize: '13px', textDecoration: 'none' }} className='mt-2'>Remember your account password? <Link href='/login' className='text-decoration-none'>Login now</Link></p>
                    </form>
                </div>
            </div>
        </>
    )
}

export async function getStaticProps() {
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
        props: {
            configuration: res,
        },
        revalidate: 600
    }
}

ForgotPassword.getLayout = function getLayout(page) {
    return (
        <AuthLayout>{page}</AuthLayout>
    )
}

export default ForgotPassword;