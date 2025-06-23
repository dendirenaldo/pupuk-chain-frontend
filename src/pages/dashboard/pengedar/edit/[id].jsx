import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons'
import ReactDOMServer from 'react-dom/server';
import { faSave } from '@fortawesome/free-regular-svg-icons'
import DashboardLayout from '@/layouts/dashboard_layout'

const Edit = ({ id }) => {
    const router = useRouter()
    const axios = useAxiosPrivate()
    const buttonRef = useRef()
    const [listParent, setListParent] = useState([])
    const [tingkat, setTingkat] = useState('')
    const [tingkatError, setTingkatError] = useState('')
    const [nama, setNama] = useState('')
    const [namaError, setNamaError] = useState('')
    const [pid, setPid] = useState('')
    const [pidError, setPidError] = useState('')
    const [npwp, setNpwp] = useState('')
    const [npwpError, setNpwpError] = useState('')
    const [alamat, setAlamat] = useState('')
    const [alamatError, setAlamatError] = useState('')
    const [footer, setFooter] = useState('')
    const [footerError, setFooterError] = useState('')
    const [kontakNama, setKontakNama] = useState('')
    const [kontakNamaError, setKontakNamaError] = useState('')
    const [bankNama, setBankNama] = useState('')
    const [bankNamaError, setBankNamaError] = useState('')
    const [bankNomorRekening, setBankNomorRekening] = useState('')
    const [bankNomorRekeningError, setBankNomorRekeningError] = useState('')
    const [bankAtasNama, setBankAtasNama] = useState('')
    const [bankAtasNamaError, setBankAtasNamaError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        buttonRef.current.disabled = true
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        await axios({
            method: 'PUT',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/pengedar/${id ? id : ''}`,
            data: {
                tingkat,
                nama,
                ...((pid !== null && pid !== '') && { pid }),
                npwp,
                alamat,
                footer,
                kontakNama,
                bankNama,
                bankNomorRekening,
                bankAtasNama
            }
        }).then((res) => {
            if (res.data?.id) {
                Swal.fire('Success', 'Pengedar updated successfully!', 'success').then((res) => {
                    router.push('/dashboard/pengedar')
                })
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
                if (error?.tingkat) {
                    setTingkatError(error.tingkat)
                } else {
                    setTingkatError('')
                }

                if (error?.nama) {
                    setNamaError(error.nama)
                } else {
                    setNamaError('')
                }

                if (error?.pid) {
                    setPidError(error.pid)
                } else {
                    setPidError('')
                }

                if (error?.npwp) {
                    setNpwpError(error.npwp)
                } else {
                    setNpwpError('')
                }

                if (error?.alamat) {
                    setAlamatError(error.alamat)
                } else {
                    setAlamatError('')
                }

                if (error?.footer) {
                    setFooterError(error.footer)
                } else {
                    setFooterError('')
                }

                if (error?.kontakNama) {
                    setKontakNamaError(error.kontakNama)
                } else {
                    setKontakNamaError('')
                }

                if (error?.bankNama) {
                    setBankNamaError(error.bankNama)
                } else {
                    setBankNamaError('')
                }

                if (error?.bankNomorRekening) {
                    setBankNomorRekeningError(error.bankNomorRekening)
                } else {
                    setBankNomorRekeningError('')
                }

                if (error?.bankAtasNama) {
                    setBankAtasNamaError(error.bankAtasNama)
                } else {
                    setBankAtasNamaError('')
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
        const getData = async () => {
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/pengedar/${id ? id : ''}`,
            }).then((res) => {
                if (res.data?.id) {
                    setNama(res.data.nama);
                    setPid(res.data.pid ?? '');
                    setTingkat(res.data.tingkat);
                    setNpwp(res.data.npwp ?? '');
                    setAlamat(res.data.alamat ?? '');
                    setKontakNama(res.data.kontakNama ?? '');
                    setBankNama(res.data.bankNama);
                    setBankNomorRekening(res.data.bankNomorRekening);
                    setBankAtasNama(res.data.bankAtasNama);
                }
            }).catch((err) => {
                console.error(err)
            })
        }
        getData()
    }, [id])
    const getListParent = async () => {
        if (tingkat === 'Pengecer') {
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/pengedar?tingkat=Distributor`
            }).then((res) => {
                if (res.data?.data?.length > 0) {
                    setListParent(res.data.data);
                }
            })
        } else {
            setListParent([]);
        }
    }
    useEffect(() => {
        getListParent();
    }, [tingkat])
    return (
        <>
            <Head>
                <title>Edit Pengedar</title>
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
                        {tingkat === 'Pengecer' && (
                            <div className="mb-3">
                                <label htmlFor="pid" className="mb-1">Parent <span className="text-danger">*</span></label>
                                <select className={`form-control ${pidError !== '' ? 'is-invalid' : ''}`} id='pid' value={pid} onChange={(e) => setPid(e.target.value)} required>
                                    <option value="" selected>-- Choose Parent --</option>
                                    {listParent.length > 0 && listParent.map((val, index, arr) => (
                                        <option value={val.id}>{val.nama}</option>
                                    ))}
                                </select>
                                {pidError !== '' && (
                                    <div className="invalid-feedback">{pidError}</div>
                                )}
                            </div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="tingkat" className="mb-1">Tingkat <span className="text-danger">*</span></label>
                            <select className={`form-control ${tingkatError !== '' ? 'is-invalid' : ''}`} id='tingkat' value={tingkat} onChange={(e) => setTingkat(e.target.value)} required>
                                <option value="" selected>-- Choose Tingkat --</option>
                                <option value="Distributor">Distributor</option>
                                <option value="Pengecer">Pengecer</option>
                            </select>
                            {tingkatError !== '' && (
                                <div className="invalid-feedback">{tingkatError}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="npwp" className="mb-1">NPWP</label>
                            <input type='text' className={`form-control ${npwpError !== '' ? 'is-invalid' : ''}`} id='npwp' value={npwp} onChange={(e) => setNpwp(e.target.value)} />
                            {npwpError !== '' && (
                                <div className="invalid-feedback">{npwpError}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="alamat" className="mb-1">Alamat</label>
                            <input type='text' className={`form-control ${alamatError !== '' ? 'is-invalid' : ''}`} id='alamat' value={alamat} onChange={(e) => setAlamat(e.target.value)} />
                            {alamatError !== '' && (
                                <div className="invalid-feedback">{alamatError}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="kontakNama" className="mb-1">Kontak Nama</label>
                            <input type='text' className={`form-control ${kontakNamaError !== '' ? 'is-invalid' : ''}`} id='kontakNama' value={kontakNama} onChange={(e) => setKontakNama(e.target.value)} />
                            {kontakNamaError !== '' && (
                                <div className="invalid-feedback">{kontakNamaError}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="bankNama" className="mb-1">Bank Nama</label>
                            <input type='text' className={`form-control ${bankNamaError !== '' ? 'is-invalid' : ''}`} id='bankNama' value={bankNama} onChange={(e) => setBankNama(e.target.value)} />
                            {bankNamaError !== '' && (
                                <div className="invalid-feedback">{bankNamaError}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="bankNomorRekening" className="mb-1">Bank Nomor Rekening</label>
                            <input type='text' className={`form-control ${bankNomorRekeningError !== '' ? 'is-invalid' : ''}`} id='bankNomorRekening' value={bankNomorRekening} onChange={(e) => setBankNomorRekening(e.target.value)} />
                            {bankNomorRekeningError !== '' && (
                                <div className="invalid-feedback">{bankNomorRekeningError}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="bankAtasNama" className="mb-1">Bank Atas Nama</label>
                            <input type='text' className={`form-control ${bankAtasNamaError !== '' ? 'is-invalid' : ''}`} id='bankAtasNama' value={bankAtasNama} onChange={(e) => setBankAtasNama(e.target.value)} />
                            {bankAtasNamaError !== '' && (
                                <div className="invalid-feedback">{bankAtasNamaError}</div>
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
    return (<DashboardLayout header='Edit Pengedar' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Pengedar', link: '/dashboard/pengedar' }, { label: 'Edit Pengedar', link: '/dashboard/pengedar/edit/' + id }]} breadCrumbRightPengedar={
        <Link href='/dashboard/pengedar' className='btn btn-secondary rounded-xl'>
            <FontAwesomeIcon icon={faAngleLeft} />&nbsp; Back
        </Link>
    }>{page}</DashboardLayout>)
}

export default Edit;