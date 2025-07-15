import { useAuthContext } from '@/context/AuthProvider'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import DashboardLayout from '@/layouts/dashboard_layout'
import { faSave } from '@fortawesome/free-regular-svg-icons'
import { faAngleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOMServer from 'react-dom/server';
import Swal from 'sweetalert2'

const Create = () => {
    const router = useRouter()
    const axios = useAxiosPrivate()
    const buttonRef = useRef()
    const { profile } = useAuthContext()
    const [listPupuk, setListPupuk] = useState([])
    const [listDistributor, setListDistributor] = useState([])
    const [listPengecer, setListPengecer] = useState([])
    const [jenis, setJenis] = useState('')
    const [jenisError, setJenisError] = useState('')
    const [distributorId, setDistributorId] = useState('')
    const [distributorIdError, setDistributorIdError] = useState('')
    const [pengecerId, setPengecerId] = useState('')
    const [pengecerIdError, setPengecerIdError] = useState('')
    const [fertilizerTypeId, setFertilizerTypeId] = useState('')
    const [fertilizerTypeIdError, setFertilizerTypeIdError] = useState('')
    const [quantity, setQuantity] = useState('')
    const [quantityError, setQuantityError] = useState('')

    const getListPupuk = async () => {
        setListPupuk([])
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/pupuk`
        }).then((res) => {
            if (res.data?.data?.length > 0) {
                setListPupuk(res.data.data)
            }
        })
    }

    const getListDistributor = async () => {
        setDistributorId('')
        setListDistributor([])

        if (jenis !== '' && jenis !== 'Produsen-Distributor') {
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/pengedar?tingkat=Distributor`
            }).then((res) => {
                if (res.data?.data?.length > 0) {
                    setListDistributor(res.data.data);
                }
            })
        } else {
            setListDistributor([]);
        }
    }

    const getListPengecer = async () => {
        setPengecerId('')
        setListPengecer([])

        if (jenis !== '' && ((jenis === 'Distributor-Pengecer' && distributorId !== '') || jenis === 'Produsen-Distributor')) {
            const tingkat = jenis === 'Distributor-Pengecer' && distributorId !== '' ? `Pengecer&pid=${distributorId}` : 'Distributor'
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/pengedar?tingkat=${tingkat}`
            }).then((res) => {
                if (res.data?.data?.length > 0) {
                    setListPengecer(res.data.data);
                }
            })
        } else {
            setListPengecer([]);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        buttonRef.current.disabled = true
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        await axios({
            method: 'PATCH',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/transaksi`,
            data: {
                jenis,
                distributorId,
                pengecerId,
                fertilizerTypeId,
                quantity
            },
        }).then((res) => {
            if (res.data?.message.includes('successfully') && res.data?.data !== null) {
                Swal.fire('Success', 'Transaksi created successfully!', 'success').then((res) => {
                    router.push('/dashboard/transaksi')
                })
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
                if (error?.jenis) {
                    setJenisError(error.jenis)
                } else {
                    setJenisError('')
                }

                if (error?.distributorId) {
                    setDistributorIdError(error.distributorId)
                } else {
                    setDistributorIdError('')
                }

                if (error?.pengecerId) {
                    setPengecerIdError(error.pengecerId)
                } else {
                    setPengecerIdError('')
                }

                if (error?.fertilizerTypeId) {
                    setFertilizerTypeIdError(error.fertilizerTypeId)
                } else {
                    setFertilizerTypeIdError('')
                }

                if (error?.quantity) {
                    setQuantityError(error.quantity)
                } else {
                    setQuantityError('')
                }

                if (error?.message) {
                    Swal.fire('Error', error.message, 'error');
                }
            }
        })

        buttonRef.current.disabled = false
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon icon={faSave} />&nbsp; Save</>)
    }

    useEffect(() => {
        getListDistributor()
    }, [jenis])

    useEffect(() => {
        getListPengecer()
    }, [jenis, distributorId])

    useEffect(() => {
        getListPupuk()
    }, [])
    useEffect(() => {
        if (profile?.role === 'Distributor') {
            setJenis('Produsen-Distributor')
            setDistributorId(profile?.pengedar.id)
        } else if (profile?.role === 'Pengecer') {
            setJenis('Distributor-Pengecer')
            setDistributorId(profile?.pengedar.pid)
            setPengecerId(profile?.pengedar.id)
        }
    }, [profile])
    return (
        <>
            <Head>
                <title>Create Transaksi</title>
            </Head>
            <form action="" onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        {profile?.role === 'Admin' && (
                            <div className="mb-3">
                                <label htmlFor="jenis" className="mb-1">Jenis <span className="text-danger">*</span></label>
                                <select className={`form-control ${jenisError !== '' ? 'is-invalid' : ''}`} id='jenis' value={jenis} onChange={(e) => setJenis(e.target.value)} required>
                                    <option value="" selected>-- Choose Jenis --</option>
                                    <option value="Produsen-Distributor">Produsen-Distributor</option>
                                    <option value="Distributor-Pengecer">Distributor-Pengecer</option>
                                </select>
                                {jenisError !== '' && (
                                    <div className="invalid-feedback">{jenisError}</div>
                                )}
                            </div>
                        )}
                        {jenis !== '' && (
                            <>
                                {(jenis === 'Distributor-Pengecer' && profile?.role === 'Admin') && (
                                    <div className="mb-3">
                                        <label htmlFor="distributorId" className="mb-1">Distributor <span className="text-danger">*</span></label>
                                        <select className={`form-control ${distributorIdError !== '' ? 'is-invalid' : ''}`} id='distributorId' value={distributorId} onChange={(e) => setDistributorId(e.target.value)} required>
                                            <option value="" selected>-- Choose Distributor --</option>
                                            {listDistributor.length > 0 && listDistributor.map((val, index, arr) => (
                                                <option value={val.id}>{val.nama}</option>
                                            ))}
                                        </select>
                                        {distributorIdError !== '' && (
                                            <div className="invalid-feedback">{distributorIdError}</div>
                                        )}
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label htmlFor="pengecerId" className="mb-1">{jenis === 'Distributor-Pengecer' ? 'Pengecer' : 'Distributor'} <span className="text-danger">*</span></label>
                                    <select className={`form-control ${pengecerIdError !== '' ? 'is-invalid' : ''}`} id='pengecerId' value={pengecerId} onChange={(e) => setPengecerId(e.target.value)} required>
                                        <option value="" selected>-- Choose {jenis === 'Distributor-Pengecer' ? 'Pengecer' : 'Distributor'} --</option>
                                        {listPengecer.length > 0 && listPengecer.map((val, index, arr) => (
                                            <option value={val.id}>{val.nama}</option>
                                        ))}
                                    </select>
                                    {pengecerIdError !== '' && (
                                        <div className="invalid-feedback">{pengecerIdError}</div>
                                    )}
                                </div>
                            </>
                        )}
                        <div className="mb-3">
                            <label htmlFor="fertilizerTypeId" className="mb-1">Pupuk <span className="text-danger">*</span></label>
                            <select className={`form-control ${fertilizerTypeIdError !== '' ? 'is-invalid' : ''}`} id="fertilizerTypeId" value={fertilizerTypeId} onChange={(e) => setFertilizerTypeId(e.target.value)} required>
                                <option value="" selected hidden disabled>-- Choose Pupuk --</option>
                                {listPupuk.length > 0 && listPupuk.map((val, index, arr) => (
                                    <option value={val.id}>{val.nama}</option>
                                ))}
                            </select>
                            {fertilizerTypeIdError !== '' && (
                                <div className="invalid-feedback">{fertilizerTypeIdError}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="quantity" className="mb-1">Kuantitas <span className="text-danger">*</span></label>
                            <input type="number" className={`form-control ${quantityError !== '' ? 'is-invalid' : ''}`} id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                            {quantityError !== '' && (
                                <div className="invalid-feedback">{quantityError}</div>
                            )}
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-flex align-items-center justify-content-end gap-1">
                            <button type='submit' ref={buttonRef} className='btn btn-primary float-end'><FontAwesomeIcon icon={faSave} />&nbsp; Save</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

Create.getLayout = function getLayout(page) {
    return (
        <DashboardLayout header='Create Transaksi' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Transaksi', link: '/dashboard/transaksi' }, { label: 'Create Transaksi', link: '/dashboard/transaksi/create' }]} breadCrumbRightContent={
            <Link href='/dashboard/transaksi' className='btn btn-secondary rounded-xl'>
                <FontAwesomeIcon icon={faAngleLeft} />&nbsp; Back
            </Link>
        }>{page}</DashboardLayout>
    )
}

export default Create