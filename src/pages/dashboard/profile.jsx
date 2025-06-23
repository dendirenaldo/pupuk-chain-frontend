import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import { useAuthContext } from '@/context/AuthProvider'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import DashboardLayout from '@/layouts/dashboard_layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-regular-svg-icons'

const Profile = () => {
    const axios = useAxiosPrivate()
    const inputRef = useRef()
    const { profile, setProfile } = useAuthContext()
    const [fullName, setFullName] = useState('')
    const [fullNameError, setFullNameError] = useState('')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [role, setRole] = useState('')
    const [roleError, setRoleError] = useState('')
    const [picture, setPicture] = useState(null)
    const [pictureError, setPictureError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const form = new FormData();
        form.append('fullName', fullName)
        form.append('email', email)
        if (profile?.role === 'Admin') form.append('role', role)
        await axios({
            method: 'PUT',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user/change-profile`,
            data: form
        }).then((res) => {
            if (res.data?.email) {
                Swal.fire('Success', 'Your profile updated successfully!', 'success')
                setProfile(res.data)
                setFullNameError('')
                setPictureError('')
            }
        }).catch((err) => {
            const error = err.response.data

            if (err.response?.status === 400) {
                if (error?.fullName) {
                    setFullNameError(error.fullName)
                } else {
                    setFullNameError('')
                }

                if (error?.email) {
                    setEmailError(error.email)
                } else {
                    setEmailError('')
                }

                if (error?.role) {
                    setRoleError(error.role)
                } else {
                    setRoleError('')
                }

                if (error?.picture) {
                    setPictureError(error.picture)
                } else {
                    setPictureError('')
                }

                if (error?.remaining) {
                    Swal.fire('Success', 'Your profile updated successfully, but you are asked to wait 2 minutes because an account verification email will be sent', 'warning')
                }
            }
        })
    }
    const handleChangeImage = () => {
        inputRef.current.click()
    }
    const handleSubmitImage = (e) => {
        setPicture(e.target.files[0])
    }
    const handleSubmitImageAPI = async () => {
        const form = new FormData()
        form.append('picture', picture)
        await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user/change-profile-picture`,
            data: form,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data?.email) {
                Swal.fire('Success', 'Profile picture updated successfully!', 'success')
                setProfile(res.data)
            }
        }).catch((err) => {
            if (err.response?.status === 422) {
                Swal.fire('Error', err.response.data.message, 'error')
            }
        })
    }

    useEffect(() => {
        if (picture) {
            handleSubmitImageAPI()
        }
    }, [picture])
    useEffect(() => {
        if (Object.keys(profile).length > 0) {
            setFullName(profile.fullName)
            setEmail(profile.email)
            setRole(profile.role)
        }
    }, [profile])
    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <form action="" onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-header pt-3 d-block d-md-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center justify-content-start gap-2">
                            <img style={{ width: '70px', aspectRatio: '1/1', objectFit: 'cover' }} className='rounded-circle' src={`${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user/profile-picture/${profile.picture}`} alt="" />
                            <div>
                                <h6 className='mb-0 fw-bold'>{profile.fullName}</h6>
                                <small className='text-muted d-block'>{profile.role}</small>
                            </div>
                        </div>
                        <button type='button' onClick={() => handleChangeImage()} className='btn btn-success btn-sm rounded-pill'>Change Image</button>
                        <input type="file" className='d-none' ref={inputRef} onChange={handleSubmitImage} />
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label htmlFor="fullName" className="mb-1">Full Name <span className="text-danger">*</span></label>
                                <input type="text" className={`form-control ${fullNameError !== '' ? 'is-invalid' : ''}`} id='fullName' value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                                {fullNameError !== '' && (
                                    <div className="invalid-feedback">{fullNameError}</div>
                                )}
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="email" className="mb-1">Email Address <span className="text-danger">*</span></label>
                                <input type="email" className={`form-control ${emailError !== '' ? 'is-invalid' : ''}`} id='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                                {emailError !== '' && (
                                    <div className="invalid-feedback">{emailError}</div>
                                )}
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="role" className="mb-1">Role <span className="text-danger">*</span></label>
                                <select className={`form-select ${roleError !== '' ? 'is-invalid' : ''}`} id='role' value={role} onChange={(e) => setRole(e.target.value)} required={profile?.role === 'Admin' ? true : false} disabled={profile?.role === 'Admin' ? false : true}>
                                    <option value="" selected hidden disabled>-- Pilih Role --</option>
                                    <option value="Admin">Admin</option>
                                    <option value="User">User</option>
                                </select>
                                {roleError !== '' && (
                                    <div className="invalid-feedback">{roleError}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="card-footer d-flex justify-content-end">
                        <button type='submit' className='btn btn-primary'><FontAwesomeIcon icon={faSave} />&nbsp; Save</button>
                    </div>
                </div>
            </form>
        </>
    )
}

Profile.getLayout = function getLayout(page) {
    return (
        <DashboardLayout header='Profile' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Configuration' }, { label: 'Profile', link: '/dashboard/profile' }]}>{page}</DashboardLayout>
    )
}

export default Profile