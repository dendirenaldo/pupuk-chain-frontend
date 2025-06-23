
import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { faAngleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons'
import DashboardLayout from '@/layouts/dashboard_layout'
import { faSave } from '@fortawesome/free-regular-svg-icons'
import ReactDOMServer from 'react-dom/server';

const Edit = ({ id }) => {
    const router = useRouter()
    const axios = useAxiosPrivate()
    const buttonRef = useRef()
    const [listPengedar, setListPengedar] = useState([])
    const [fullName, setFullName] = useState('')
    const [fullNameError, setFullNameError] = useState('')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [role, setRole] = useState('')
    const [roleError, setRoleError] = useState('')
    const [picture, setPicture] = useState(null)
    const [pictureError, setPictureError] = useState('')
    const [isActive, setIsActive] = useState('')
    const [isActiveError, setIsActiveError] = useState('')
    const [pengedarId, setPengedarId] = useState('')
    const [pengedarIdError, setPengedarIdError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        buttonRef.current.disabled = true
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        const form = new FormData();
        form.append('fullName', fullName)
        form.append('email', email)
        form.append('password', password)
        form.append('role', role)
        form.append('isActive', isActive)
        if (role !== '' && (role === 'Distributor' || role === 'Pengecer') && pengedarId !== '') form.append('pengedarId', pengedarId)
        if (picture !== null) form.append('picture', picture)
        await axios({
            method: 'PUT',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user/${id ? id : ''}`,
            data: form,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data?.id) {
                Swal.fire('Success', 'User updated successfully!', 'success').then((res) => {
                    router.push('/dashboard/user-management')
                })
            }
        }).catch((err) => {
            const error = err.response?.data

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

                if (error?.password) {
                    setPasswordError(error.password)
                } else {
                    setPasswordError('')
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

                if (error?.isActive) {
                    setIsActiveError(error.isActive)
                } else {
                    setIsActiveError('')
                }

                if (error?.pengedarId) {
                    setPengedarIdError(error.pengedarId)
                } else {
                    setPengedarIdError('')
                }

                if (error?.message) {
                    Swal.fire('Error', error.message, 'error');
                }

                if (error?.remaining) {
                    Swal.fire('Success', 'User updated successfully, but you are asked to wait 2 minutes for an account verification email to be sent', 'warning')
                }
            }
        })

        buttonRef.current.disabled = false
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon icon={faSave} />&nbsp; Save</>)
    }
    const getData = async () => {
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user/${id ? id : ''}`
        }).then((res) => {
            if (res?.data?.id) {
                setFullName(res.data.fullName)
                setEmail(res.data.email)
                setRole(res.data.role)
                setIsActive(res.data.isActive)
            }
        }).catch((err) => {
            console.error(err)
        })
    }

    const getListPengedar = async () => {
        setPengedarId('')

        if (role !== '' && (role === 'Distributor' || role === 'Pengecer')) {
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/pengedar?tingkat=${role}`
            }).then((res) => {
                if (res.data?.data?.length > 0) {
                    setListPengedar(res.data.data);
                }
            })
        } else {
            setListPengedar([])
        }
    }

    useEffect(() => {
        getListPengedar()
    }, [role])

    useEffect(() => {
        if (typeof id !== 'undefined' && id !== '') getData()
    }, [id])
    return (
        <>
            <Head>
                <title>Edit User</title>
            </Head>
            <form action="" onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label htmlFor="email" className="mb-1">Email Address <span className="text-danger">*</span></label>
                                <input type="email" className={`form-control ${emailError !== '' ? 'is-invalid' : ''}`} id='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                                {emailError !== '' && (
                                    <div className="invalid-feedback">{emailError}</div>
                                )}
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="password" className="mb-1">Password</label>
                                <input type="password" className={`form-control ${passwordError !== '' ? 'is-invalid' : ''}`} id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                {passwordError !== '' && (
                                    <div className="invalid-feedback">{passwordError}</div>
                                )}
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="fullName" className="mb-1">Full Name <span className="text-danger">*</span></label>
                                <input type="text" className={`form-control ${fullNameError !== '' ? 'is-invalid' : ''}`} id='fullName' value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                                {fullNameError !== '' && (
                                    <div className="invalid-feedback">{fullNameError}</div>
                                )}
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="role" className="mb-1">Role <span className="text-danger">*</span></label>
                                <select className={`form-select ${roleError !== '' ? 'is-invalid' : ''}`} id='role' value={role} onChange={(e) => setRole(e.target.value)} required>
                                    <option value="" selected hidden disabled>-- Choose Role --</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Produsen">Produsen</option>
                                    <option value="Distributor">Distributor</option>
                                    <option value="Pengecer">Pengecer</option>
                                    <option value="Petani">Petani</option>
                                </select>
                                {roleError !== '' && (
                                    <div className="invalid-feedback">{roleError}</div>
                                )}
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="picture" className="mb-1">Picture</label>
                                <input type="file" className={`form-control ${pictureError !== '' ? 'is-invalid' : ''}`} id='picture' onChange={(e) => setPicture(e.target.files[0])} />
                                {pictureError !== '' && (
                                    <div className="invalid-feedback">{pictureError}</div>
                                )}
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="isActive" className="mb-1">Active? <span className="text-danger">*</span></label>
                                <select className={`form-select ${isActiveError !== '' ? 'is-invalid' : ''}`} id='isActive' value={isActive} onChange={(e) => setIsActive(e.target.value)} required>
                                    <option value="" selected hidden disabled>-- Choose Status --</option>
                                    <option value="true">Active</option>
                                    <option value="false">Not Active</option>
                                </select>
                                {isActiveError !== '' && (
                                    <div className="invalid-feedback">{isActiveError}</div>
                                )}
                            </div>
                            {(role !== '' && (role === 'Distributor' || role === 'Pengecer')) && (
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="pengedarId" className="mb-1">{role} <span className="text-danger">*</span></label>
                                    <select className={`form-select ${pengedarIdError !== '' ? 'is-invalid' : ''}`} id='pengedarId' value={pengedarId} onChange={(e) => setPengedarId(e.target.value)} required>
                                        <option value="" selected hidden disabled>-- Choose {role} --</option>
                                        {listPengedar.length > 0 && listPengedar.map((val, index, arr) => (
                                            <option value={val.id}>{val.nama}</option>
                                        ))}
                                    </select>
                                    {pengedarIdError !== '' && (
                                        <div className="invalid-feedback">{pengedarIdError}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="clearfix">
                            <button type='submit' ref={buttonRef} className='btn btn-primary float-end'><FontAwesomeIcon icon={faSave} />&nbsp; Save</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.params; // Get id from URL

    return {
        props: { id }, // Pass id as a prop
    };
}

Edit.getLayout = function getLayout(page) {
    const { id } = page.props;

    return (
        <DashboardLayout header='Edit User' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'User', link: '/dashboard/user-management' }, { label: 'Edit User', link: `/dashboard/user-management/edit/${id}` }]} breadCrumbRightContent={
            <Link href='/dashboard/user-management' className='btn btn-secondary rounded-xl'>
                <FontAwesomeIcon icon={faAngleLeft} />&nbsp; Back
            </Link>
        }>{page}</DashboardLayout>
    )
}

export default Edit