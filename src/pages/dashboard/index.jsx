import { faUserCircle } from '@fortawesome/free-regular-svg-icons'
import { faBriefcase, faBuilding, faCannabis, faGlobeAsia, faInfoCircle, faPencilAlt, faTh, faUserFriends, faUserPlus, faUserShield, faUsersCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useAuthContext } from '@/context/AuthProvider'
import DashboardLayout from '@/layouts/dashboard_layout'

const Index = () => {
    const { profile } = useAuthContext()
    const axios = useAxiosPrivate()
    const [account, setAccount] = useState(0)
    const [admin, setAdmin] = useState(0)
    const [user, setUser] = useState(0)
    const [pupuk, setPupuk] = useState(0)
    const [wilayah, setWilayah] = useState(0)
    const [pengedar, setPengedar] = useState(0)
    const [spjb, setSpjb] = useState(0)
    const [transaksi, setTransaksi] = useState(0)
    const [countRegisteredUsersData, setCountRegisteredUsersData] = useState([])
    const [countPurchasedCoursesByCategory, setCountPurchasedCoursesByCategory] = useState([])
    const formatRupiah = (angka, prefix) => {
        var number_string = angka.replace(/[^,\d]/g, '').toString(),
            split = number_string.split(','),
            sisa = split[0].length % 3,
            rupiah = split[0].substr(0, sisa),
            ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (ribuan) {
            let separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
        return prefix == undefined ? rupiah : (rupiah ? 'Rp' + rupiah : '');
    }

    const getRandomColor = () => {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    };

    const getCountRegisteredUsersData = async () => {
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user/count-registered-users?lastMonths=6`
        }).then((res) => {
            if (res.data?.data) {
                setCountRegisteredUsersData(res.data.data)
            } else {
                setCountRegisteredUsersData([])
            }
        }).catch((err) => {
            console.error(err)
        })
    };

    const getCountPurchasedCoursesByCategory = async () => {
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/transaction/count-purchased-courses-by-content`
        }).then((res) => {
            if (res.data?.data) {
                setCountPurchasedCoursesByCategory(res.data.data)
            } else {
                setCountPurchasedCoursesByCategory([])
            }
        }).catch((err) => {
            console.error(err)
        })
    };

    const getJumlah = async () => {
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user?offset=0&limit=1`
        }).then((res) => {
            if (res.data?.totalData) {
                setAccount(res.data.totalData)
            }
        }).catch((err) => {
            console.error(err)
        })
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user?offset=0&limit=1&role=Admin`
        }).then((res) => {
            if (res.data?.totalData) {
                setAdmin(res.data.totalData)
            }
        }).catch((err) => {
            console.error(err)
        })
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user?offset=0&limit=1&role=User`
        }).then((res) => {
            if (res.data?.totalData) {
                setUser(res.data.totalData)
            }
        }).catch((err) => {
            console.error(err)
        })
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/pupuk?offset=0&limit=1`
        }).then((res) => {
            if (res.data?.totalData) {
                setPupuk(res.data.totalData)
            }
        }).catch((err) => {
            console.error(err)
        })
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/wilayah?offset=0&limit=1`
        }).then((res) => {
            if (res.data?.totalData) {
                setWilayah(res.data.totalData)
            }
        }).catch((err) => {
            console.error(err)
        })
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/pengedar?offset=0&limit=1`
        }).then((res) => {
            if (res.data?.totalData) {
                setPengedar(res.data.totalData)
            }
        }).catch((err) => {
            console.error(err)
        })
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/spjb?offset=0&limit=1`
        }).then((res) => {
            if (res.data?.totalData) {
                setSpjb(res.data.totalData)
            }
        }).catch((err) => {
            console.error(err)
        })
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/transaksi?offset=0&limit=1`
        }).then((res) => {
            if (res.data?.totalData) {
                setTransaksi(res.data.totalData)
            }
        }).catch((err) => {
            console.error(err)
        })
    }

    useEffect(() => {
        getJumlah()
        getCountRegisteredUsersData()
        getCountPurchasedCoursesByCategory()
    }, [])
    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <div className="row mb-4">
                {(profile && profile?.role === 'Admin') && (
                    <>
                        <div className="col-md-4 my-1">
                            <div className='card rounded-xl'>
                                <div className="card-body d-flex align-items-center gap-3">
                                    <FontAwesomeIcon icon={faUserPlus} size={'3x'} fixedWidth />
                                    <div>
                                        <h6>Total Account</h6>
                                        <h3 className='mb-0 fw-bolder text-primary'>{formatRupiah(account.toString())}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 my-1">
                            <div className='card rounded-xl'>
                                <div className="card-body d-flex align-items-center gap-3">
                                    <FontAwesomeIcon icon={faUsersCog} size={'3x'} fixedWidth />
                                    <div>
                                        <h6>Admin</h6>
                                        <h3 className='mb-0 fw-bolder text-primary'>{formatRupiah(admin.toString())}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 my-1">
                            <div className='card rounded-xl'>
                                <div className="card-body d-flex align-items-center gap-3">
                                    <FontAwesomeIcon icon={faUserFriends} size={'3x'} fixedWidth />
                                    <div>
                                        <h6>User</h6>
                                        <h3 className='mb-0 fw-bolder text-primary'>{formatRupiah(user.toString())}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {(profile && profile?.role === 'Admin') && (
                    <div className="col-md-4 my-1">
                        <div className='card rounded-xl'>
                            <div className="card-body d-flex align-items-center gap-3">
                                <FontAwesomeIcon icon={faCannabis} size={'3x'} fixedWidth />
                                <div>
                                    <h6>Pupuk</h6>
                                    <h3 className='mb-0 fw-bolder text-primary'>{formatRupiah(pupuk.toString())}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {(profile && (profile?.role === 'Admin' || profile?.role === 'Distributor' || profile?.role === 'Pengecer')) && (
                    <div className="col-md-4 my-1">
                        <div className='card rounded-xl'>
                            <div className="card-body d-flex align-items-center gap-3">
                                <FontAwesomeIcon icon={faGlobeAsia} size={'3x'} fixedWidth />
                                <div>
                                    <h6>Wilayah</h6>
                                    <h3 className='mb-0 fw-bolder text-primary'>{formatRupiah(wilayah.toString())}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {(profile && (profile?.role === 'Admin' || profile?.role === 'Produsen')) && (
                    <div className="col-md-4 my-1">
                        <div className='card rounded-xl'>
                            <div className="card-body d-flex align-items-center gap-3">
                                <FontAwesomeIcon icon={faPencilAlt} size={'3x'} fixedWidth />
                                <div>
                                    <h6>Pengedar</h6>
                                    <h3 className='mb-0 fw-bolder text-primary'>{formatRupiah(pengedar.toString())}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="col-md-4 my-1">
                    <div className='card rounded-xl'>
                        <div className="card-body d-flex align-items-center gap-3">
                            <FontAwesomeIcon icon={faBuilding} size={'3x'} fixedWidth />
                            <div>
                                <h6>SPJB</h6>
                                <h3 className='mb-0 fw-bolder text-primary'>{formatRupiah(spjb.toString())}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 my-1">
                    <div className='card rounded-xl'>
                        <div className="card-body d-flex align-items-center gap-3">
                            <FontAwesomeIcon icon={faBriefcase} size={'3x'} fixedWidth />
                            <div>
                                <h6>Transaksi</h6>
                                <h3 className='mb-0 fw-bolder text-primary'>{formatRupiah(transaksi.toString())}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {profile != null && Object.keys(profile).length > 0 && (
                <>
                    <div className="card my-1">
                        <div className="card-header pt-3 d-flex align-items-center justify-content-between">
                            <h6 className='mb-0'><FontAwesomeIcon icon={faUserCircle} className='text-primary' />&nbsp; User Information</h6>
                        </div>
                        <div className="card-body">
                            <img className='w-25 d-block mx-auto mb-4' src={`${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user/profile-picture/${profile.picture}`} alt="" />
                            <div className='row'>
                                <div className='col-6 mb-2'>
                                    <p className='text-uppercase small fw-bold mb-0'>Email Address</p>
                                    <p className='mb-0'>{profile.email}</p>
                                </div>
                                <div className='col-6 mb-2'>
                                    <p className='text-uppercase small fw-bold mb-0'>Full Name</p>
                                    <p className='mb-0'>{profile.fullName}</p>
                                </div>
                                <div className='col-6 mb-2'>
                                    <p className='text-uppercase small fw-bold mb-0'>Role</p>
                                    <p className='mb-0'>{profile.role}</p>
                                </div>
                                <div className='col-6 mb-2'>
                                    <p className='text-uppercase small fw-bold mb-0'>Status</p>
                                    <p className='mb-0'>{profile.isActive == true ? 'Active' : 'Not Active'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

Index.getLayout = function getLayout(page) {
    return (
        <DashboardLayout breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }]} header='Dashboard'>{page}</DashboardLayout>
    )
}

export default Index


