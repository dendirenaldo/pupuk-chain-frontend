
import Head from 'next/head'
import React, { useState, useEffect, useRef } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { faAngleLeft, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DashboardLayout from '@/layouts/dashboard_layout'
import { faSave, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import ReactDOMServer from 'react-dom/server';

const Create = () => {
    const router = useRouter()
    const axios = useAxiosPrivate()
    const buttonRef = useRef()
    const [listPupuk, setListPupuk] = useState([])
    const [listDistributor, setListDistributor] = useState([])
    const [listPengecer, setListPengecer] = useState([])
    const [jenis, setJenis] = useState('')
    const [jenisError, setJenisError] = useState('')
    const [distributorId, setDistributorId] = useState('')
    const [distributorIdError, setDistributorIdError] = useState('')
    const [pengecerId, setPengecerId] = useState('')
    const [pengecerIdError, setPengecerIdError] = useState('')
    const [nomor, setNomor] = useState('')
    const [nomorError, setNomorError] = useState('')
    const [tahun, setTahun] = useState(null)
    const [tahunError, setTahunError] = useState('')
    const [wilayah, setWilayah] = useState([])
    const [approval, setApproval] = useState([{ name: '', position: '', priority: '', location: '' }]);
    const [realisasi, setRealisasi] = useState([{ fertilizerTypeId: '', quantity: '', month: '' }]);
    const handleChangeApproval = (e, index) => {
        const { name, value } = e.target;
        const list = [...approval];
        list[index][name] = value;
        setApproval(list);
    };
    const handleChangeRealisasi = (e, index) => {
        const { name, value } = e.target;
        const list = [...realisasi];
        list[index][name] = value;
        setRealisasi(list);
    };
    const handleAddApproval = () => {
        setApproval([...approval, { name: '', position: '', priority: '' }]);
    };
    const handleAddRealisasi = () => {
        setRealisasi([...realisasi, { fertilizerTypeId: '', quantity: '', month: '' }]);
    };
    const handleRemoveApproval = (index) => {
        const list = approval.filter((_, i) => i !== index);
        setApproval(list);
    };
    const handleRemoveRealisasi = (index) => {
        const list = realisasi.filter((_, i) => i !== index);
        setRealisasi(list);
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        buttonRef.current.disabled = true
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        await axios({
            method: 'PATCH',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/spjb`,
            data: {
                jenis,
                distributorId,
                pengecerId,
                nomor,
                tahun,
                wilayah,
                approval,
                realisasi
            },
        }).then((res) => {
            if (res.data?.message.includes('successfully') && res.data?.data !== null) {
                Swal.fire('Success', 'SPJB created successfully!', 'success').then((res) => {
                    router.push('/dashboard/spjb')
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

                if (error?.nomor) {
                    setNomorError(error.nomor)
                } else {
                    setNomorError('')
                }

                if (error?.tahun) {
                    setTahunError(error.tahun)
                } else {
                    setTahunError('')
                }

                if (error?.message) {
                    Swal.fire('Error', error.message, 'error');
                }
            }
        })

        buttonRef.current.disabled = false
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon icon={faSave} />&nbsp; Save</>)
    }

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

    const getWilayahPengecer = async () => {
        setWilayah([])

        if (pengecerId !== '') {
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/wilayah?pengedarId=${pengecerId}&isParent=true`
            }).then((res) => {
                if (res.data?.data?.length > 0) {
                    const wilayahPengecer = res.data.data;
                    const wilayahData = wilayahPengecer.map((val, index, arr) => {
                        return {
                            name: val.nama,
                            subRegions: val.children.map((value, index, arr) => value.nama)
                        }
                    })
                    setWilayah(wilayahData)
                } else {
                    setWilayah([])
                }
            })
        }
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

    useEffect(() => {
        getWilayahPengecer()
    }, [pengecerId])
    useEffect(() => {
        getListDistributor()
    }, [jenis])
    useEffect(() => {
        getListPengecer()
    }, [jenis, distributorId])
    useEffect(() => {
        getListPupuk()
    }, [])
    return (
        <>
            <Head>
                <title>Create SPJB</title>
            </Head>
            <form action="" onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        <h6 className='fw-bolder'>Data</h6>
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
                        {jenis !== '' && (
                            <>
                                {jenis === 'Distributor-Pengecer' && (
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
                            <label htmlFor="nomor" className="mb-1">Nomor <span className="text-danger">*</span></label>
                            <input type='text' className={`form-control ${nomorError !== '' ? 'is-invalid' : ''}`} id='nomor' value={nomor} onChange={(e) => setNomor(e.target.value)} required />
                            {nomorError !== '' && (
                                <div className="invalid-feedback">{nomorError}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="tahun" className="mb-1">Tahun <span className="text-danger">*</span></label>
                            <input type='number' min={1800} max={2200} className={`form-control ${tahunError !== '' ? 'is-invalid' : ''}`} id='tahun' value={tahun} onChange={(e) => setTahun(e.target.value)} required />
                            {tahunError !== '' && (
                                <div className="invalid-feedback">{tahunError}</div>
                            )}
                        </div>
                        <hr />
                        <h6 className='fw-bolder'>Approval</h6>
                        {approval.map((singleApproval, index) => (
                            <div key={index} className='row align-items-end'>
                                <div className="col-12 col-md-3 mb-3">
                                    <label htmlFor={`name-${index}`} className="mb-1">Nama {index + 1} <span className="text-danger">*</span></label>
                                    <input type='text' className={`form-control`} name='name' id={`name-${index}`} value={singleApproval.name} onChange={(e) => handleChangeApproval(e, index)} required />
                                </div>
                                <div className="col-12 col-md-3 mb-3">
                                    <label htmlFor={`position-${index}`} className="mb-1">Jabatan {index + 1} <span className="text-danger">*</span></label>
                                    <input type='text' className={`form-control`} name='position' id={`position-${index}`} value={singleApproval.position} onChange={(e) => handleChangeApproval(e, index)} required />
                                </div>
                                <div className="col-12 col-md-4 mb-3">
                                    <label htmlFor={`location-${index}`} className="mb-1">Kedudukan {index + 1} <span className="text-danger">*</span></label>
                                    <input type='text' className={`form-control`} name='location' id={`location-${index}`} value={singleApproval.location} onChange={(e) => handleChangeApproval(e, index)} required />
                                </div>
                                <div className="col-12 col-md-1 mb-3">
                                    <label htmlFor={`priority-${index}`} className="mb-1">Prioritas {index + 1} <span className="text-danger">*</span></label>
                                    <input type='number' className={`form-control`} name='priority' id={`priority-${index}`} value={singleApproval.priority} onChange={(e) => handleChangeApproval(e, index)} required />
                                </div>
                                <div className="col-12 col-md-1 mb-3">
                                    <button type='button' className='btn btn-danger' onClick={() => handleRemoveApproval(index)}><FontAwesomeIcon icon={faTrashAlt} /></button>
                                </div>
                            </div>
                        ))}
                        <hr />
                        <h6 className='fw-bolder'>Realisasi</h6>
                        {realisasi.map((singleRealisasi, index) => (
                            <div key={index} className='row align-items-end'>
                                <div className="col-12 col-md-4 mb-3">
                                    <label htmlFor={`fertilizerType-${index}`} className="mb-1">Pupuk {index + 1} <span className="text-danger">*</span></label>
                                    <select className={`form-control`} name='fertilizerTypeId' id={`fertilizerType-${index}`} value={singleRealisasi.fertilizerTypeId} onChange={(e) => handleChangeRealisasi(e, index)} required>
                                        <option value="" selected hidden disabled>-- Choose Pupuk {index + 1} --</option>
                                        {listPupuk.length > 0 && listPupuk.map((val, index, arr) => (
                                            <option value={val.id}>{val.nama}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-12 col-md-4 mb-3">
                                    <label htmlFor={`quantity-${index}`} className="mb-1">Jumlah {index + 1} <span className="text-danger">*</span></label>
                                    <input type='number' className={`form-control`} name='quantity' id={`quantity-${index}`} value={singleRealisasi.quantity} onChange={(e) => handleChangeRealisasi(e, index)} required />
                                </div>
                                <div className="col-12 col-md-3 mb-3">
                                    <label htmlFor={`month-${index}`} className="mb-1">Bulan {index + 1} <span className="text-danger">*</span></label>
                                    <select className={`form-control`} name='month' id={`month-${index}`} value={singleRealisasi.month} onChange={(e) => handleChangeRealisasi(e, index)} required>
                                        <option value="" selected>-- Choose Bulan --</option>
                                        <option value="Stok Tahun Lalu">Stok Tahun Lalu</option>
                                        <option value="Stok Awal">Stok Awal</option>
                                        <option value="Januari">Januari</option>
                                        <option value="Februari">Februari</option>
                                        <option value="Maret">Maret</option>
                                        <option value="April">April</option>
                                        <option value="Mei">Mei</option>
                                        <option value="Juni">Juni</option>
                                        <option value="Juli">Juli</option>
                                        <option value="Agustus">Agustus</option>
                                        <option value="September">September</option>
                                        <option value="Oktober">Oktober</option>
                                        <option value="November">November</option>
                                        <option value="Desember">Desember</option>
                                    </select>
                                </div>
                                <div className="col-12 col-md-1 mb-3">
                                    <button type='button' className='btn btn-danger' onClick={() => handleRemoveRealisasi(index)}><FontAwesomeIcon icon={faTrashAlt} /></button>
                                </div>
                            </div>
                        ))}
                        <hr />
                        <h6 className='fw-bolder'>Wilayah</h6>
                        <table className='table table-bordered'>
                            <thead className='table-primary text-center'>
                                <tr>
                                    <th className='align-middle'>Wilayah Utama</th>
                                    <th className='align-middle'>Wilayah Cabang</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wilayah.length > 0 ? wilayah.map((val, index, arr) => (
                                    <>
                                        <tr>
                                            <td>{val.name}</td>
                                            <td>{val.subRegions[0]}</td>
                                        </tr>
                                        {val.subRegions.length > 1 && val.subRegions.map((value, index, arr) => {
                                            if (index !== 1) {
                                                return (
                                                    <tr>
                                                        <td></td>
                                                        <td>{value}</td>
                                                    </tr>
                                                )
                                            }
                                        })}
                                    </>
                                )) : (
                                    <tr>
                                        <td colSpan={2} className='text-center'>No data available in table</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-footer">
                        <div className="d-flex align-items-center justify-content-end gap-1">
                            <button type='button' onClick={handleAddApproval} className='btn btn-primary float-end'><FontAwesomeIcon icon={faPlus} />&nbsp; Approval</button>
                            <button type='button' onClick={handleAddRealisasi} className='btn btn-primary float-end'><FontAwesomeIcon icon={faPlus} />&nbsp; Realisasi</button>
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
        <DashboardLayout header='Create SPJB' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'SPJB', link: '/dashboard/spjb' }, { label: 'Create SPJB', link: '/dashboard/spjb/create' }]} breadCrumbRightContent={
            <Link href='/dashboard/spjb' className='btn btn-secondary rounded-xl'>
                <FontAwesomeIcon icon={faAngleLeft} />&nbsp; Back
            </Link>
        }>{page}</DashboardLayout>
    )
}

export default Create