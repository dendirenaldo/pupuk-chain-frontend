import { useAuthContext } from '@/context/AuthProvider'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import DashboardLayout from '@/layouts/dashboard_layout'
import { faSave } from '@fortawesome/free-regular-svg-icons'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

const Create = () => {
    const { profile } = useAuthContext();
    const axios = useAxiosPrivate()
    const [listPupuk, setListPupuk] = useState([])
    const [jenis, setJenis] = useState('')
    const [fertilizerTypeId, setFertilizerTypeId] = useState('')
    const [tahun, setTahun] = useState('')

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

    useEffect(() => {
        getListPupuk()
    }, [])

    return (
        <>
            <Head>
                <title>Export Mutasi</title>
            </Head>
            <form action={`${process.env.NEXT_PUBLIC_URL}/export_mutasi.php`} method='POST' target='_blank' rel="noopener norefferer">
                <div className="card">
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="jenis" className="mb-1">Jenis <span className="text-danger">*</span></label>
                            <select className='form-control' id='jenis' value={jenis} onChange={(e) => setJenis(e.target.value)} {...((profile?.role === 'Produsen' || profile?.role === 'Distributor') && { readOnly: 'true' })} required>
                                <option value="" selected>-- Choose Jenis --</option>
                                <option value="Produsen-Distributor" >Produsen-Distributor</option>
                                <option value="Distributor-Pengecer">Distributor-Pengecer</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="fertilizerTypeId" className="mb-1">Pupuk <span className="text-danger">*</span></label>
                            <select className='form-control' id="fertilizerTypeId" value={fertilizerTypeId} onChange={(e) => setFertilizerTypeId(e.target.value)} required>
                                <option value="" selected hidden disabled>-- Choose Pupuk --</option>
                                {listPupuk.length > 0 && listPupuk.map((val, index, arr) => (
                                    <option value={val.id}>{val.nama}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="tahun" className="mb-1">Tahun <span className="text-danger">*</span></label>
                            <input type="number" className='form-control' id="tahun" value={tahun} onChange={(e) => setTahun(e.target.value)} required />
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-flex align-items-center justify-content-end gap-1">
                            <button type='submit' className='btn btn-primary float-end'><FontAwesomeIcon icon={faSave} />&nbsp; Save</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

Create.getLayout = function getLayout(page) {
    return (
        <DashboardLayout header='Export Mutasi' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Transaksi', link: '/dashboard/transaksi' }, { label: 'Export Mutasi', link: '/dashboard/transaksi/export' }]} breadCrumbRightContent={
            <Link href='/dashboard/transaksi' className='btn btn-secondary rounded-xl'>
                <FontAwesomeIcon icon={faAngleLeft} />&nbsp; Back
            </Link>
        }>{page}</DashboardLayout>
    )
}

export default Create