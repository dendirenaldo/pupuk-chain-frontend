
import Head from 'next/head'
import React, { useState, useEffect, useRef } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { faAngleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DashboardLayout from '@/layouts/dashboard_layout'
import ReactDOMServer from 'react-dom/server';
import { faSave } from '@fortawesome/free-regular-svg-icons'
import { useAuthContext } from '@/context/AuthProvider'

const Edit = ({ id }) => {
    const router = useRouter()
    const axios = useAxiosPrivate()
    const buttonRef = useRef()
    const { profile } = useAuthContext();
    const [pengedar, setPengedar] = useState(null)
    const [listPengedar, setListPengedar] = useState([])
    const [listParent, setListParent] = useState([])
    const [pengedarId, setPengedarId] = useState('')
    const [pengedarIdError, setPengedarIdError] = useState('')
    const [pid, setPid] = useState('')
    const [pidError, setPidError] = useState('')
    const [nama, setNama] = useState('')
    const [namaError, setNamaError] = useState('')
    const [jenis, setJenis] = useState('')
    const [jenisError, setJenisError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        buttonRef.current.disabled = true
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        await axios({
            method: 'PUT',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/wilayah/${id}`,
            data: {
                nama,
                pengedarId: pengedarId,
                ...((pid !== null && pid !== '') && { pid }),
                jenis
            },
        }).then((res) => {
            if (res.data?.id) {
                Swal.fire('Success', 'Wilayah updated successfully!', 'success').then((res) => {
                    router.push('/dashboard/wilayah')
                })
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
                if (error?.pid) {
                    setPidError(error.pid)
                } else {
                    setPidError('')
                }

                if (error?.pengedarId) {
                    setPengedarIdError(error.pengedarId)
                } else {
                    setPengedarIdError('')
                }

                if (error?.nama) {
                    setNamaError(error.nama)
                } else {
                    setNamaError('')
                }

                if (error?.jenis) {
                    setJenisError(error.jenis)
                } else {
                    setJenisError('')
                }

                if (error?.message) {
                    Swal.fire('Error', error.message, 'error');
                }
            }
        })

        buttonRef.current.disabled = false
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon icon={faSave} />&nbsp; Save</>)
    }
    const getData = async () => {
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/wilayah/${id ? id : ''}`,
        }).then((res) => {
            if (res.data?.id) {
                setNama(res.data.nama);
                setPid(res.data.pid !== null && res.data.pid !== '' ? res.data.pid : '');
                setPengedarId(res.data.pengedarId);
                setJenis(res.data.jenis);
            }
        }).catch((err) => {
            console.error(err)
        })
    }
    const getListPengedar = async () => {
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/pengedar`
        }).then((res) => {
            if (res.data?.data?.length > 0) {
                setListPengedar(res.data.data);
            }
        })
    }
    const getListParent = async () => {
        if (pengedarId !== null && pengedarId !== '' && jenis !== null && jenis !== '' && jenis !== 'Kabupaten/Kota') {
            let jenisType = jenis === 'Kecamatan' ? 'Kabupaten/Kota' : 'Kecamatan';
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/wilayah?pengedarId=${pengedarId}&jenis=${jenisType}`
            }).then((res) => {
                if (res.data?.data?.length > 0) {
                    setListParent(res.data.data);
                }
            })
        } else {
            setListParent([]);
        }
    }
    const getPengedar = async () => {
        if (pengedarId !== null && pengedarId !== '') {
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/pengedar/${pengedarId}`
            }).then((res) => {
                if (res.data?.id) {
                    setPengedar(res.data);
                } else {
                    setPengedar(null);
                }
            })
        } else {
            setPengedar(null);
        }
    }

    useEffect(() => {
        getListParent();
    }, [id, pengedarId, jenis])

    useEffect(() => {
        getPengedar();
    }, [pengedarId])

    useEffect(() => {
        getData()
        getListPengedar()
    }, [id])

    useEffect(() => {
        if (profile && profile !== null && profile?.role) {
            if (profile.role === 'Distributor' || profile.role === 'Pengecer') {
                setPengedarId(profile.pengedar.id)
            }
        } else {
            setPengedarId('')
        }
    }, [profile])
    return (
        <>
            <Head>
                <title>Edit Wilayah</title>
            </Head>
            <form action="" onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="nama" className="mb-1">Nama <span className="text-danger">*</span></label>
                            <input type='text' className={`form-control ${namaError !== '' ? 'is-invalid' : ''}`} id='nama' value={nama} onChange={(e) => setNama(e.target.value)} required />
                            {namaError !== '' && (
                                <div className="invalid-feedback">{namaError}</div>
                            )}
                        </div>
                        {!(profile?.role === 'Distributor' || profile?.role === 'Pengecer') && (
                            <div className="mb-3">
                                <label htmlFor="pengedarId" className="mb-1">Pengedar <span className="text-danger">*</span></label>
                                <select className={`form-control ${pengedarIdError !== '' ? 'is-invalid' : ''}`} id='pengedarId' value={pengedarId} onChange={(e) => setPengedarId(e.target.value)} required>
                                    <option value="" selected hidden disabled>-- Choose Pengedar --</option>
                                    {listPengedar.length > 0 && listPengedar.map((val, index, arr) => (
                                        <option value={val.id}>{val.nama}</option>
                                    ))}
                                </select>
                                {pengedarIdError !== '' && (
                                    <div className="invalid-feedback">{pengedarIdError}</div>
                                )}
                            </div>
                        )}
                        {(jenis !== 'Kabupaten/Kota' && jenis !== '') && (
                            <div className="mb-3">
                                <label htmlFor="pid" className="mb-1">Parent</label>
                                <select className={`form-control ${pidError !== '' ? 'is-invalid' : ''}`} id='pid' value={pid} onChange={(e) => setPid(e.target.value)}>
                                    <option value="" selected hidden disabled>-- Choose Parent --</option>
                                    {listParent.length > 0 && listParent.map((val, index, arr) => {
                                        return val.id != id ? (
                                            <option value={val.id}>{val.nama}</option>
                                        ) : (<></>)
                                    })}
                                </select>
                                {pidError !== '' && (
                                    <div className="invalid-feedback">{pidError}</div>
                                )}
                            </div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="jenis" className="mb-1">Jenis <span className="text-danger">*</span></label>
                            <select className={`form-control ${jenisError !== '' ? 'is-invalid' : ''}`} id='jenis' value={jenis} onChange={(e) => setJenis(e.target.value)} {...(!pengedarId && { readOnly: true })} required>
                                <option value="" selected hidden disabled>-- Choose Jenis --</option>
                                {(pengedar !== null && Object.keys(pengedar).length > 0) && (
                                    <>
                                        {pengedar.tingkat === 'Distributor' ? (
                                            <>
                                                <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                                                <option value="Kecamatan">Kecamatan</option>
                                            </>
                                        ) : (pengedar.tingkat === 'Pengecer' && (
                                            <>
                                                <option value="Kecamatan">Kecamatan</option>
                                                <option value="Kelurahan">Kelurahan</option>
                                            </>
                                        ))}
                                    </>
                                )}
                            </select>
                            {jenisError !== '' && (
                                <div className="invalid-feedback">{jenisError}</div>
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
    const { id } = context.params;

    return {
        props: { id },
    };
}

Edit.getLayout = function getLayout(page) {
    const { id } = page.props;
    return (<DashboardLayout header='Edit Wilayah' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Wilayah', link: '/dashboard/wilayah' }, { label: 'Edit Wilayah', link: '/dashboard/wilayah/edit/' + id }]} breadCrumbRightContent={
        <Link href='/dashboard/wilayah' className='btn btn-secondary rounded-xl'>
            <FontAwesomeIcon icon={faAngleLeft} />&nbsp; Back
        </Link>
    }>{page}</DashboardLayout>)
}

export default Edit;