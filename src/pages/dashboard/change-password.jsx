import { faEye, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import ReactDOMServer from 'react-dom/server';
import { faSave } from '@fortawesome/free-regular-svg-icons'
import DashboardLayout from '@/layouts/dashboard_layout'

const ChangePassword = () => {
    const axios = useAxiosPrivate()
    const buttonRef = useRef()
    const [oldPassword, setOldPassword] = useState('')
    const [oldPasswordError, setOldPasswordError] = useState('')
    const [oldPasswordSee, setOldPasswordSee] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordError, setNewPasswordError] = useState('')
    const [newPasswordSee, setNewPasswordSee] = useState(false)
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')
    const [newPasswordConfirmationError, setNewPasswordConfirmationError] = useState('')
    const [newPasswordConfirmationSee, setNewPasswordConfirmationSee] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        buttonRef.current.disabled = true
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)

        if (newPassword === newPasswordConfirmation) {
            await axios({
                method: 'PUT',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user/change-password`,
                data: {
                    oldPassword,
                    newPassword,
                    newPasswordConfirmation
                }
            }).then((res) => {
                if (res.data?.email) {
                    Swal.fire('Success', 'Password updated successfully!', 'success')
                }
            }).catch((err) => {
                const error = err.response.data

                if (err.response?.status === 400) {
                    if (error?.oldPassword) {
                        setOldPasswordError(error.oldPassword)
                    } else {
                        setOldPasswordError('')
                    }

                    if (error?.newPassword) {
                        setNewPasswordError(error.newPassword)
                    } else {
                        setNewPasswordError('')
                    }

                    if (error?.newPasswordConfirmation) {
                        setNewPasswordConfirmationError(error.newPasswordConfirmation)
                    } else {
                        setNewPasswordConfirmationError('')
                    }
                }
            })
        } else {
            Swal.fire('Gagal', 'Periksa isian form!', 'error')
        }

        buttonRef.current.disabled = false
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon icon={faSave} />&nbsp; Save</>)
    }
    useEffect(() => {
        setOldPasswordError('')

        if (newPassword !== newPasswordConfirmation) {
            setNewPasswordConfirmationError('New password confirmation must be the same as new password')
        } else {
            setNewPasswordConfirmationError('')
        }
    }, [oldPassword, newPassword, newPasswordConfirmation])
    return (
        <>
            <Head>
                <title>Change Password</title>
            </Head>
            <form action="" onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        <div className='mb-3'>
                            <label className='mb-1'>Old Password <span className="text-danger">*</span></label>
                            <div className='position-relative'>
                                <input type={oldPasswordSee ? 'text' : 'password'} onChange={(e) => setOldPassword(e.target.value)} value={oldPassword} className={`form-control ${oldPasswordError != '' ? 'is-invalid' : ''}`} required />
                                <a href='#!' className='position-absolute' style={{ right: 10, top: '50%', transform: 'translate(0%, -50%)' }} onClick={() => setOldPasswordSee(!oldPasswordSee)}><FontAwesomeIcon icon={faEye} className='text-muted' /></a>
                            </div>
                            {oldPasswordError != '' && (<div className='invalid-feedback'>{oldPasswordError}</div>)}
                        </div>
                        <div className='mb-3'>
                            <label className='mb-1'>New Password <span className="text-danger">*</span></label>
                            <div className='position-relative'>
                                <input type={newPasswordSee ? 'text' : 'password'} onChange={(e) => setNewPassword(e.target.value)} value={newPassword} className={`form-control ${newPasswordError != '' ? 'is-invalid' : ''}`} required />
                                <a href='#!' className='position-absolute' style={{ right: 10, top: '50%', transform: 'translate(0%, -50%)' }} onClick={() => setNewPasswordSee(!newPasswordSee)}><FontAwesomeIcon icon={faEye} className='text-muted' /></a>
                            </div>
                            {newPasswordError != '' && (<div className='invalid-feedback'>{newPasswordError}</div>)}
                        </div>
                        <div className='mb-3'>
                            <label className='mb-1'>New Password Confirmation <span className="text-danger">*</span></label>
                            <div className='position-relative'>
                                <input type={newPasswordConfirmationSee ? 'text' : 'password'} onChange={(e) => setNewPasswordConfirmation(e.target.value)} value={newPasswordConfirmation} className={`form-control ${newPasswordConfirmationError != '' ? 'is-invalid' : ''}`} required />
                                <a href='#!' className='position-absolute' style={{ right: 10, top: '50%', transform: 'translate(0%, -50%)' }} onClick={() => setNewPasswordConfirmationSee(!newPasswordConfirmationSee)}><FontAwesomeIcon icon={faEye} className='text-muted' /></a>
                            </div>
                            {newPasswordConfirmationError != '' && (<div className='invalid-feedback'>{newPasswordConfirmationError}</div>)}
                        </div>
                    </div>
                    <div className="card-footer d-flex justify-content-end">
                        <button type='submit' ref={buttonRef} className='btn btn-primary'><FontAwesomeIcon icon={faSave} />&nbsp; Save</button>
                    </div>
                </div>
            </form>
        </>
    )
}

ChangePassword.getLayout = function getLayout(page) {
    return (<DashboardLayout header='Change Password' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Configuration' }, { label: 'Change Password', link: '/dashboard/change-password' }]}>{page}</DashboardLayout>)
}

export default ChangePassword