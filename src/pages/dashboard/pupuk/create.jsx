
import Head from 'next/head'
import React, { useState, useRef } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { faAngleLeft, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DashboardLayout from '@/layouts/dashboard_layout'
import ReactDOMServer from 'react-dom/server';
import { faSave, faTrashAlt } from '@fortawesome/free-regular-svg-icons'

const Create = () => {
    const router = useRouter()
    const axios = useAxiosPrivate()
    const buttonRef = useRef()
    const [spesifikasi, setSpesifikasi] = useState([{ kandungan: '', deskripsi: '' }])
    const [nama, setNama] = useState('')
    const [namaError, setNamaError] = useState('')
    const [kemasan, setKemasan] = useState('')
    const [kemasanError, setKemasanError] = useState('')
    const handleChangeSpesifikasi = (e, index) => {
        const { name, value } = e.target;
        const list = [...spesifikasi];
        list[index][name] = value;
        setSpesifikasi(list);
    };
    const handleAddSpesifikasi = () => {
        setSpesifikasi([...spesifikasi, { kandungan: '', deskripsi: '' }]);
    };
    const handleRemoveSpesifikasi = (index) => {
        const list = spesifikasi.filter((_, i) => i !== index);
        setSpesifikasi(list);
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        buttonRef.current.disabled = true
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        await axios({
            method: 'PATCH',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/pupuk`,
            data: {
                nama,
                kemasan,
                spesifikasi,
            },
        }).then((res) => {
            if (res.data?.id) {
                Swal.fire('Success', 'Pupuk created successfully!', 'success').then((res) => {
                    router.push('/dashboard/pupuk')
                })
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
                if (error?.nama) {
                    setNamaError(error.nama)
                } else {
                    setNamaError('')
                }

                if (error?.kemasan) {
                    setKemasanError(error.kemasan)
                } else {
                    setKemasanError('')
                }

                if (error?.message) {
                    Swal.fire('Error', error.message, 'error');
                }
            }
        })

        buttonRef.current.disabled = false
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon icon={faSave} />&nbsp; Save</>)
    }
    return (
        <>
            <Head>
                <title>Create Pupuk</title>
            </Head>
            <form action="" onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        <h6 className='fw-bolder'>Data</h6>
                        <div className="mb-3">
                            <label htmlFor="nama" className="mb-1">Nama <span className="text-danger">*</span></label>
                            <input type='text' className={`form-control ${namaError !== '' ? 'is-invalid' : ''}`} id='nama' value={nama} onChange={(e) => setNama(e.target.value)} required />
                            {namaError !== '' && (
                                <div className="invalid-feedback">{namaError}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="kemasan" className="mb-1">Kemasan <span className="text-danger">*</span></label>
                            <input type='text' className={`form-control ${kemasanError !== '' ? 'is-invalid' : ''}`} id='kemasan' value={kemasan} onChange={(e) => setKemasan(e.target.value)} required />
                            {kemasanError !== '' && (
                                <div className="invalid-feedback">{kemasanError}</div>
                            )}
                        </div>
                        <hr />
                        <h6 className='fw-bolder'>Spesifikasi</h6>
                        {spesifikasi.map((singleSpesifikasi, index) => (
                            <div key={index} className='row align-items-end'>
                                <div className="col-12 col-md-5 mb-3">
                                    <label htmlFor={`kandungan-${index}`} className="mb-1">Kandungan {index + 1} <span className="text-danger">*</span></label>
                                    <input type='text' className={`form-control`} name='kandungan' id={`kandungan-${index}`} value={singleSpesifikasi.kandungan} onChange={(e) => handleChangeSpesifikasi(e, index)} required />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <label htmlFor={`deskripsi-${index}`} className="mb-1">Kandungan {index + 1} <span className="text-danger">*</span></label>
                                    <input type='text' className={`form-control`} name='deskripsi' id={`deskripsi-${index}`} value={singleSpesifikasi.deskripsi} onChange={(e) => handleChangeSpesifikasi(e, index)} required />
                                </div>
                                <div className="col-12 col-md-1 mb-3">
                                    <button type='button' className='btn btn-danger' onClick={() => handleRemoveSpesifikasi(index)}><FontAwesomeIcon icon={faTrashAlt} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="card-footer">
                        <div className="d-flex align-items-center justify-content-end gap-1">
                            <button type='button' onClick={handleAddSpesifikasi} className='btn btn-primary float-end'><FontAwesomeIcon icon={faPlus} />&nbsp; Spesifikasi</button>
                            <button type='submit' ref={buttonRef} className='btn btn-primary float-end'><FontAwesomeIcon icon={faSave} />&nbsp; Save</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

Create.getLayout = function getLayout(page) {
    return (<DashboardLayout header='Create Pupuk' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Pupuk', link: '/dashboard/pupuk' }, { label: 'Create Pupuk', link: '/dashboard/pupuk/create' }]} breadCrumbRightContent={
        <Link href='/dashboard/pupuk' className='btn btn-secondary rounded-xl'>
            <FontAwesomeIcon icon={faAngleLeft} />&nbsp; Back
        </Link>
    }>{page}</DashboardLayout>)
}

export default Create