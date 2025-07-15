
import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { faAngleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DashboardLayout from '@/layouts/dashboard_layout'
import ReactDOMServer from 'react-dom/server';
import { faSave } from '@fortawesome/free-regular-svg-icons'

const Create = () => {
    const router = useRouter()
    const axios = useAxiosPrivate()
    const buttonRef = useRef()
    const [listParent, setListParent] = useState([])
    const [tingkat, setTingkat] = useState('')
    const [tingkatError, setTingkatError] = useState('')
    const [nomor, setNomor] = useState('')
    const [nomorError, setNomorError] = useState('')
    const [nama, setNama] = useState('')
    const [namaError, setNamaError] = useState('')
    const [pid, setPid] = useState('')
    const [pidError, setPidError] = useState('')
    const [npwp, setNpwp] = useState('')
    const [npwpError, setNpwpError] = useState('')
    const [alamat, setAlamat] = useState('')
    const [alamatError, setAlamatError] = useState('')
    const [kop, setKop] = useState(null)
    const [kopError, setKopError] = useState('')
    const [kontakNama, setKontakNama] = useState('')
    const [kontakNamaError, setKontakNamaError] = useState('')
    const [kontakEmail, setKontakEmail] = useState('')
    const [kontakEmailError, setKontakEmailError] = useState('')
    const [bankNama, setBankNama] = useState('')
    const [bankNamaError, setBankNamaError] = useState('')
    const [bankNomorRekening, setBankNomorRekening] = useState('')
    const [bankNomorRekeningError, setBankNomorRekeningError] = useState('')
    const [bankAtasNama, setBankAtasNama] = useState('')
    const [bankAtasNamaError, setBankAtasNamaError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        const form = new FormData();
        form.append('tingkat', tingkat)
        form.append('nomor', nomor)
        form.append('nama', nama)
        if (pid !== null && pid !== '') form.append('pid', pid)
        form.append('npwp', npwp)
        if (kop !== null) form.append('kop', kop)
        form.append('alamat', alamat)
        form.append('kontakNama', kontakNama)
        form.append('kontakEmail', kontakEmail)
        form.append('bankNama', bankNama)
        form.append('bankNomorRekening', bankNomorRekening)
        form.append('bankAtasNama', bankAtasNama)
        buttonRef.current.disabled = true
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        await axios({
            method: 'PATCH',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/pengedar`,
            data: form,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data?.id) {
                Swal.fire('Success', 'Pengedar created successfully!', 'success').then((res) => {
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

                if (error?.nomor) {
                    setNomorError(error.nomor)
                } else {
                    setNomorError('')
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

                if (error?.kop) {
                    setKopError(error.kop)
                } else {
                    setKopError('')
                }

                if (error?.kontakNama) {
                    setKontakNamaError(error.kontakNama)
                } else {
                    setKontakNamaError('')
                }

                if (error?.kontakEmail) {
                    setKontakEmailError(error.kontakEmail)
                } else {
                    setKontakEmailError('')
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
                <title>Create Pengedar</title>
            </Head>
            <form action="" onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="nomor" className="mb-1">Nomor <span className="text-danger">*</span></label>
                            <input type='text' className={`form-control ${nomorError !== '' ? 'is-invalid' : ''}`} id='nomor' value={nomor} onChange={(e) => setNomor(e.target.value)} required />
                            {nomorError !== '' && (
                                <div className="invalid-feedback">{nomorError}</div>
                            )}
                        </div>
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
                            <label htmlFor="kop" className="mb-1">Kop Surat <span className="text-danger">*</span></label>
                            <input type="file" className={`form-control ${kopError !== '' ? 'is-invalid' : ''}`} id='kop' onChange={(e) => setKop(e.target.files[0])} required />
                            {kopError !== '' && (
                                <div className="invalid-feedback">{kopError}</div>
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
                            <label htmlFor="kontakEmail" className="mb-1">Kontak Email</label>
                            <input type='email' className={`form-control ${kontakEmailError !== '' ? 'is-invalid' : ''}`} id='kontakEmail' value={kontakEmail} onChange={(e) => setKontakEmail(e.target.value)} />
                            {kontakEmailError !== '' && (
                                <div className="invalid-feedback">{kontakEmailError}</div>
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

Create.getLayout = function getLayout(page) {
    return (<DashboardLayout header='Create Pengedar' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Pengedar', link: '/dashboard/pengedar' }, { label: 'Create Pengedar', link: '/dashboard/pengedar/create' }]} breadCrumbRightPengedar={
        <Link href='/dashboard/pengedar' className='btn btn-secondary rounded-xl'>
            <FontAwesomeIcon icon={faAngleLeft} />&nbsp; Back
        </Link>
    }>{page}</DashboardLayout>)
}

export default Create;