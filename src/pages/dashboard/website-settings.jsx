import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import { useConfigurationContext } from '@/context/ConfigurationProvider'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faSpinner } from '@fortawesome/free-solid-svg-icons'
import DashboardLayout from '@/layouts/dashboard_layout'
import { faSave } from '@fortawesome/free-regular-svg-icons'
import ReactDOMServer from 'react-dom/server';

const WebsiteSettings = () => {
    const axios = useAxiosPrivate()
    const buttonRef = useRef()
    const logoRef = useRef()
    const imageRef = useRef()
    const { applicationName, setApplicationName, applicationLogo, setApplicationLogo, applicationImage, setApplicationImage, applicationDescription, setApplicationDescription } = useConfigurationContext()
    const [name, setName] = useState('')
    const [nameError, setNameError] = useState('')
    const [description, setDescription] = useState('')
    const [descriptionError, setDescriptionError] = useState('')
    const [image, setImage] = useState(null)
    const [typeUpload, setTypeUpload] = useState(null)
    const handleSubmit = async (e) => {
        e.preventDefault()
        buttonRef.current.disabled = true
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)

        const applicationNameProcess = await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/configuration`,
            data: {
                upsert: [{
                    name: 'application_name',
                    value: name
                }]
            }
        }).then((res) => {
            if (res.data[0]?.name) {
                return true
            }
        }).catch((err) => {
            const error = err.response.data

            if (err.response?.status === 400) {
                if (error?.value) {
                    setNameError(error.value)
                } else {
                    setNameError('')
                }
            }
        })
        const applicationDescriptionProcess = await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/configuration`,
            data: {
                upsert: [{
                    name: 'application_description',
                    value: description
                }]
            }
        }).then((res) => {
            if (res.data[0]?.name) {
                return true
            }
        }).catch((err) => {
            const error = err.response.data

            if (err.response?.status === 400) {
                if (error?.value) {
                    setDescriptionError(error.value)
                } else {
                    setDescriptionError('')
                }
            }
        })

        if (applicationNameProcess && applicationDescriptionProcess) {
            Swal.fire('Success', 'Website settings updated successfully!', 'success')
            setApplicationName(name)
            setApplicationDescription(description)
        } else if (applicationNameProcess || applicationDescriptionProcess) {
            Swal.fire('Warning', 'Some of the website settings were saved successfully. However, some are still not saved', 'warning')
        } else {
            Swal.fire('Error', 'An error occurred in the system', 'error')
        }

        buttonRef.current.disabled = false
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon icon={faSave} />&nbsp; Save</>)
    }
    const handleChangeImage = async (type) => {
        setTypeUpload(type)

        if (type === 'application_logo') {
            logoRef.current.click()
        } else if (type === 'application_image') {
            imageRef.current.click()
        }
    }
    const handleSubmitImage = (e) => {
        setImage(e.target.files[0])
    }
    const handleSubmitImageAPI = async () => {
        const form = new FormData()
        form.append('image', image)
        form.append('name', typeUpload)
        await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/configuration/image`,
            data: form,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data[0]?.value) {
                Swal.fire('Success', (typeUpload === 'application_logo' ? 'Application logo' : 'Application image') + ' updated successfully!', 'success')

                if (res.data[0]?.name === 'application_logo') {
                    setApplicationLogo(res.data[0].value)
                } else {
                    setApplicationImage(res.data[0].value)
                }
            }
        }).catch((err) => {
            if (err.response?.status === 422) {
                Swal.fire('Error', err.response.data.message, 'error')
            }
        })
    }
    useEffect(() => {
        if (image) {
            handleSubmitImageAPI()
        }
    }, [image])
    useEffect(() => {
        setName(applicationName)
        setDescription(applicationDescription)
    }, [applicationName, applicationDescription])
    return (
        <>
            <Head>
                <title>Website Settings</title>
            </Head>
            <div className="row">
                <div className="col-md-8">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="card my-2">
                            <div className="card-header pt-3 d-block d-md-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center justify-content-start gap-2">
                                    <img style={{ width: '70px', objectFit: 'cover' }} src={`${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/configuration/image/${applicationLogo}`} alt="" />
                                    <div>
                                        <h6 className='mb-0 fw-bold'>{applicationName}</h6>
                                        <small className='text-muted d-block' style={{ fontWeight: '400', fontSize: 12 }}>{applicationDescription}</small>
                                    </div>
                                </div>
                                <button type='button' onClick={() => handleChangeImage('application_logo')} className='btn btn-success btn-sm rounded-pill' style={{ whiteSpace: 'nowrap' }}>Change Image</button>
                                <input type="file" className='d-none' ref={logoRef} onChange={handleSubmitImage} />
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="name" className="mb-1">Application Name</label>
                                        <input type="text" className={`form-control ${nameError !== '' ? 'is-invalid' : ''}`} id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                                        {nameError !== '' && (
                                            <div className="invalid-feedback">{nameError}</div>
                                        )}
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="description" className="mb-1">Application Description</label>
                                        <textarea className={`form-control ${descriptionError !== '' ? 'is-invalid' : ''}`} id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                                        {descriptionError !== '' && (
                                            <div className="invalid-feedback">{descriptionError}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-end">
                                <button type='submit' ref={buttonRef} className='btn btn-primary'><FontAwesomeIcon icon={faSave} />&nbsp; Save</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="col-md-4">
                    <div className="card my-2">
                        <div className="card-header pt-3">
                            <h6 className='mb-0'><FontAwesomeIcon icon={faImage} />&nbsp; Image</h6>
                        </div>
                        <div className="card-body">
                            <img className='w-100' style={{ objectFit: 'cover' }} src={`${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/configuration/image/${applicationImage}`} alt="" />
                            <input type="file" onClick={() => handleChangeImage('application_image')} ref={imageRef} onChange={handleSubmitImage} className='form-control mt-3' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

WebsiteSettings.getLayout = function getLayout(page) {
    return (<DashboardLayout header='Website Settings' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Configuration' }, { label: 'Website Settings', link: '/dashboard/website-settings' }]}>{page}</DashboardLayout>)
}

export default WebsiteSettings