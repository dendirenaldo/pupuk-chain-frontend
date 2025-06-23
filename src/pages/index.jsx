import { faKey, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import { useAuthContext } from '@/context/AuthProvider'
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link'
import Swal from 'sweetalert2'
import ReactDOMServer from 'react-dom/server';
import AuthLayout from '@/layouts/auth_layout'
import styles from '@/styles/pages/index.module.css'

const Login = ({ configuration }) => {
    const router = useRouter()
    const buttonRef = useRef()
    const { auth, setAuth } = useAuthContext()
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')

    useEffect(() => {
        if (auth != '') {
            router.push('/dashboard')
        } else {
            const accessToken = getCookie('accessToken')

            if (accessToken) {
                router.push('/dashboard')
            }
        }
    }, [auth])

    const handleSubmit = async (e) => {
        e.preventDefault()
        buttonRef.current.disabled = true
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user/login`,
            data: { email, password }
        }).then(async (res) => {
            if (res.data?.access_token) {
                setAuth(res.data.access_token)
                setCookie('accessToken', res.data.access_token, { maxAge: 86400 * 30 })
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
                if (error?.email) {
                    setEmailError(error.email)
                } else {
                    setEmailError('')
                }

                if (error?.password) {
                    setPasswordError(error.password)
                } else {
                    setPasswordError('')
                }
            } else if (err.response?.status === 403) {
                Swal.fire('Failed', 'Incorrect email address or password entered!', 'error')
            }
        }).finally(() => {
            buttonRef.current.disabled = false
            buttonRef.current.innerHTML = 'Login'
        })
    }

    return (
        <>
            <Head>
                <title>{`Login | ${configuration.applicationName}`}</title>
                <meta name="description" content={configuration.applicationDescription} />
            </Head>
            <div className="d-block d-md-flex align-items-center">
                <div className={styles.gambar} style={{ background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${process.env.NEXT_PUBLIC_RESTFUL_API}/configuration/image/${configuration.applicationImage}) center` }} alt="">
                    <h4 className={styles.nama}>{configuration.applicationName}</h4>
                </div>
                <div className='w-100 py-4 px-4'>
                    <img src={`${process.env.NEXT_PUBLIC_RESTFUL_API}/configuration/image/${configuration.applicationLogo}`} className='mx-auto d-block' style={{ height: '50px', objectFit: 'cover' }} alt="" />
                    <h5 className='text-center text-primary mt-1 mb-3 fw-bold'>Login</h5>
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
                        <div className="mb-3">
                            <label className='mb-1' htmlFor="password">Password</label>
                            <div className="input-group">
                                <div className="input-group-text">
                                    <FontAwesomeIcon icon={faKey} />
                                </div>
                                <input type="password" className={`form-control ${passwordError !== '' ? 'is-invalid' : ''}`} id='password' onChange={(e) => setPassword(e.target.value)} value={password} required />
                                {passwordError !== '' && (
                                    <div className="invalid-feedback">{passwordError}</div>
                                )}
                            </div>
                            <div className="clearfix">
                                <Link href='/forgot_password' legacyBehavior>
                                    <a className='float-end text-decoration-none'>
                                        <small>Forgot password?</small>
                                    </a>
                                </Link>
                            </div>
                        </div>
                        <button type='submit' ref={buttonRef} className='btn btn-primary w-100 rounded-pill fw-bold'>Submit</button>
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

Login.getLayout = function getLayout(page) {
    return (
        <AuthLayout>{page}</AuthLayout>
    )
}

export default Login