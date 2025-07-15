import React, { useEffect, useState } from 'react'
import { useAuthContext } from '@/context/AuthProvider'
import { useConfigurationContext } from '@/context/ConfigurationProvider'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import Launcher from '@/components/Launcher';
import styles from '@/styles/Template.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faBars, faBriefcase, faBuilding, faCannabis, faCertificate, faCircle, faCogs, faDashboard, faExclamationTriangle, faGlobeAsia, faLock, faMessage, faPencilAlt, faShoppingCart, faSignOutAlt, faTh, faUserCog, faUsersCog } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import SimpleBar from 'simplebar-react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import ModalBody from '@/components/ModalBody'

const DashboardLayout = ({ header = null, breadCrumb = null, breadCrumbRightContent, children }) => {
    const axios = useAxiosPrivate();
    const router = useRouter();
    const currentURL = router.pathname;
    const [isShowedSidebar, setIsShowedSidebar] = useState(false)
    const [isCollapseSidebar, setIsCollapseSidebar] = useState(false)
    const { auth, setAuth, profile, setProfile } = useAuthContext();
    const { applicationName, applicationLogo } = useConfigurationContext();
    const BreadCrumb = () => {
        return (
            <>
                {breadCrumb && breadCrumb.map((val, index) => (
                    <span key={index}>
                        {val.link ? (
                            <Link className='text-decoration-none pe-3 text-dark' style={{ fontWeight: '500' }} href={val.link}>{val.label}</Link>
                        ) : (
                            <span className="text-decoration-none pe-3 text-muted">{val.label}</span>
                        )}
                        <span>{index + 1 !== breadCrumb.length && <FontAwesomeIcon icon={faCircle} size={'xs'} className='pe-3' />}</span>
                    </span>
                ))}
            </>
        )
    }
    const handleCollapse = () => {
        const condition = !isCollapseSidebar;
        setCookie('collapsed_sidebar', condition, {
            maxAge: 86400 * 30
        })
        setIsCollapseSidebar(condition)
    }
    const handleCollapseMobile = () => {
        const condition = !isShowedSidebar
        setCookie('collapsed_sidebar', false, {
            maxAge: 86400 * 30
        })
        setIsCollapseSidebar(false)
        setIsShowedSidebar(condition)
    }
    const handleLogout = () => {
        setAuth('')
        setProfile({})
        deleteCookie('accessToken')
        router.push('/logout')
    }
    useEffect(() => {
        [].slice.call(document.querySelectorAll('.popover')).map((val, index, arr) => {
            val.remove()
        })
        setTimeout(() => {
            var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
            popoverTriggerList.map(function (popoverTriggerEl) {
                return new bootstrap.Popover(popoverTriggerEl)
            })
        }, 1000)
    }, [router.asPath])
    const getOwnProfile = async () => {
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API}/user/me`
        }).then((res) => {
            if (res.data?.id) {
                setProfile(res.data)
            }
        }).catch((err) => {
            console.error(err)
        })
    }

    useEffect(() => {
        if (auth && auth != '') {
            getOwnProfile()
            const cookie = getCookie('collapsed_sidebar')
            setIsCollapseSidebar(cookie !== undefined ? cookie : false)
        }
    }, [auth])
    return (
        <Launcher>
            <div className='d-md-flex d-block' style={{ minHeight: '100vh' }}>
                {/* Topbar */}
                <div style={{ width: 'calc(100% - ' + (isCollapseSidebar ? '80px' : '280px') + ')' }} className={`${styles.topbar} px-md-5 px-3`}>
                    <div>
                        <a className='d-block d-md-none' onClick={handleCollapseMobile}>
                            <FontAwesomeIcon icon={faBars} fixedWidth />
                        </a>
                    </div>
                    <a id="dropdown_aksi" data-bs-toggle="dropdown" aria-expanded="false" href='#!' className={styles['profile-info-picture-container']}>
                        <img src={`${process.env.NEXT_PUBLIC_RESTFUL_API}/user/profile-picture/${profile?.picture}`} alt="" />
                    </a>
                    <div className="shadow-sm dropdown-menu px-2 py-3 ms-sm-n4 ms-n5 rounded-xl" style={{ marginTop: 15, right: 0, minWidth: 200 }} aria-labelledby="dropdown_aksi">
                        <div className='d-flex align-items-center gap-2 px-2 mb-2'>
                            <div className={`${styles['profile-info-picture-container']}`}>
                                <img src={`${process.env.NEXT_PUBLIC_RESTFUL_API}/user/profile-picture/${profile?.picture}`} className="Template_foto_profil_kedua__Nv6h8" />
                            </div>
                            <span>
                                <h6 style={{ lineHeight: 1.5, fontSize: 15 }} className="m-0 fw-bold">{profile?.fullName}</h6>
                                <h6 style={{ lineHeight: 1.5, fontSize: 12 }} className="m-0 text-muted">{profile?.role}</h6>
                            </span>
                        </div>
                        <hr className='my-1' />
                        <li className='rounded-xl overflow-hidden'>
                            <Link className="dropdown-item border-radius-md" href='/dashboard/profile'><FontAwesomeIcon className='text-success' icon={faUserCog} fixedWidth /> Profile</Link>
                        </li>
                        <li className='rounded-xl overflow-hidden'>
                            <Link className="dropdown-item border-radius-md" href='/dashboard/change-password'><FontAwesomeIcon className='text-success' icon={faLock} fixedWidth /> Change Password</Link>
                        </li>
                        <li className='rounded-xl overflow-hidden'>
                            <a className="dropdown-item border-radius-md" href="#!" data-bs-toggle="modal" data-bs-target="#modalLogout"><FontAwesomeIcon className='text-success' icon={faSignOutAlt} fixedWidth /> Logout</a>
                        </li>
                    </div>
                </div>
                {/* Sidebar */}
                <div style={{ width: isCollapseSidebar ? '80px' : '280px', flexShrink: 0, zIndex: 1002 }} className={`${isShowedSidebar ? 'd-block' : 'd-none'} d-md-flex position-relative`}>
                    <a onClick={handleCollapseMobile} className='d-flex d-md-none border rounded-circle position-absolute align-items-center justify-content-center bg-white' style={{ right: -12.5, top: 30, width: 25, height: 25, zIndex: 9999 }}>
                        <FontAwesomeIcon icon={isCollapseSidebar ? faAngleRight : faAngleLeft} fixedWidth />
                    </a>
                    <a onClick={handleCollapse} className='d-none d-md-flex border rounded-circle position-absolute align-items-center justify-content-center bg-white' style={{ right: -12.5, top: 30, width: 25, height: 25, zIndex: 9999 }}>
                        <FontAwesomeIcon icon={isCollapseSidebar ? faAngleRight : faAngleLeft} fixedWidth />
                    </a>
                    <div className={styles['sidebar']}>
                        <SimpleBar scrollbarMaxSize={125} className='h-100 add-transition bg-white' style={{ position: 'fixed', width: isCollapseSidebar ? '80px' : '280px' }}>
                            <div className={styles['header-info']}>
                                <Link href='/dashboard' className='d-flex align-items-center gap-2 text-decoration-none'>
                                    <div className={styles['header-info-picture-container']}>
                                        <img src={`${process.env.NEXT_PUBLIC_RESTFUL_API}/configuration/image/${applicationLogo}`} alt="" />
                                    </div>
                                </Link>
                                <div className={`${styles['profile-info']} ${isCollapseSidebar === true ? 'd-none' : ''}`}>
                                    <div className={styles['profile-info-picture-container']}>
                                        <img src={`${process.env.NEXT_PUBLIC_RESTFUL_API}/user/profile-picture/${profile?.picture}`} alt="" />
                                    </div>
                                    <span>
                                        <h6 className='m-0'>{profile?.fullName}</h6>
                                        <small className='m-0 fw-bolder' style={{ color: 'rgb(0, 171, 85)', fontSize: '12px' }}>{profile?.role}</small>
                                    </span>
                                </div>
                            </div>
                            <ul className={`${styles['sidebar-content']} ${isCollapseSidebar ? 'px-1' : ''}`}>
                                <li className={`${styles['sidebar-header']} ${isCollapseSidebar ? 'd-none' : ''}`}>General</li>
                                <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL === '/dashboard' ? styles['sidebar-list-active'] : ''}`}>
                                    <Link href='/dashboard' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                        <div className={styles['sidebar-list-icon']}>
                                            <FontAwesomeIcon icon={faDashboard} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                        </div>
                                        <h6>Dashboard</h6>
                                    </Link>
                                </li>
                                {profile?.role === 'Admin' && (
                                    <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL.includes('/pupuk') ? styles['sidebar-list-active'] : ''}`}>
                                        <Link href='/dashboard/pupuk' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                            <div className={styles['sidebar-list-icon']}>
                                                <FontAwesomeIcon icon={faCannabis} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                            </div>
                                            <h6>Pupuk</h6>
                                        </Link>
                                    </li>
                                )}
                                {(profile?.role === 'Admin' || profile?.role === 'Distributor' || profile?.role === 'Pengecer') && (
                                    <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL.includes('/wilayah') ? styles['sidebar-list-active'] : ''}`}>
                                        <Link href='/dashboard/wilayah' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                            <div className={styles['sidebar-list-icon']}>
                                                <FontAwesomeIcon icon={faGlobeAsia} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                            </div>
                                            <h6>Wilayah</h6>
                                        </Link>
                                    </li>
                                )}
                                {(profile?.role === 'Admin' || profile?.role === 'Produsen') && (
                                    <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL.includes('/pengedar') ? styles['sidebar-list-active'] : ''}`}>
                                        <Link href='/dashboard/pengedar' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                            <div className={styles['sidebar-list-icon']}>
                                                <FontAwesomeIcon icon={faBuilding} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                            </div>
                                            <h6>Pengedar</h6>
                                        </Link>
                                    </li>
                                )}
                                {(profile?.role === 'Admin' || profile?.role === 'Produsen' || profile?.role === 'Distributor') && (
                                    <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL.includes('/spjb') ? styles['sidebar-list-active'] : ''}`}>
                                        <Link href='/dashboard/spjb' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                            <div className={styles['sidebar-list-icon']}>
                                                <FontAwesomeIcon icon={faPencilAlt} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                            </div>
                                            <h6>SPJB</h6>
                                        </Link>
                                    </li>
                                )}
                                <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL.includes('/transaksi') ? styles['sidebar-list-active'] : ''}`}>
                                    <Link href='/dashboard/transaksi' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                        <div className={styles['sidebar-list-icon']}>
                                            <FontAwesomeIcon icon={faBriefcase} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                        </div>
                                        <h6>Transaksi</h6>
                                    </Link>
                                </li>
                                {profile?.role === 'Admin' && (
                                    <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL.includes('/user-management') ? styles['sidebar-list-active'] : ''}`}>
                                        <Link href='/dashboard/user-management' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                            <div className={styles['sidebar-list-icon']}>
                                                <FontAwesomeIcon icon={faUsersCog} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                            </div>
                                            <h6>User Management</h6>
                                        </Link>
                                    </li>
                                )}
                                <li className={`${styles['sidebar-header']} ${isCollapseSidebar ? 'd-none' : ''}`}>Configuration</li>
                                <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL.includes('/profile') ? styles['sidebar-list-active'] : ''}`}>
                                    <Link href='/dashboard/profile' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                        <div className={styles['sidebar-list-icon']}>
                                            <FontAwesomeIcon icon={faUserCog} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                        </div>
                                        <h6>Profile</h6>
                                    </Link>
                                </li>
                                <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL.includes('/change-password') ? styles['sidebar-list-active'] : ''}`}>
                                    <Link href='/dashboard/change-password' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                        <div className={styles['sidebar-list-icon']}>
                                            <FontAwesomeIcon icon={faLock} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                        </div>
                                        <h6>Change Password</h6>
                                    </Link>
                                </li>
                                {profile?.role === 'Admin' && (
                                    <>
                                        <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''} ${currentURL.includes('/website-settings') ? styles['sidebar-list-active'] : ''}`}>
                                            <Link href='/dashboard/website-settings' className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                                <div className={styles['sidebar-list-icon']}>
                                                    <FontAwesomeIcon icon={faCogs} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                                </div>
                                                <h6>Website Settings</h6>
                                            </Link>
                                        </li>
                                    </>
                                )}
                                <li className={`${styles['sidebar-list']} ${isCollapseSidebar ? styles['collapsed-sidebar-list'] : ''}`}>
                                    <a data-bs-toggle="modal" data-bs-target="#modalLogout" className={`${isCollapseSidebar ? styles['collapsed-sidebar-item'] : ''}`}>
                                        <div className={styles['sidebar-list-icon']}>
                                            <FontAwesomeIcon icon={faSignOutAlt} size={isCollapseSidebar ? '1x' : 'xl'} fixedWidth />
                                        </div>
                                        <h6>Logout</h6>
                                    </a>
                                </li>
                            </ul>
                        </SimpleBar>
                    </div>
                </div>
                <div className={styles['root-content']}>
                    <div className='d-flex align-items-center justify-content-between mb-4'>
                        <span>
                            {(header && typeof header === 'string') && (
                                <h4 className='fw-bolder'>{header}</h4>
                            )}
                            <BreadCrumb />
                        </span>
                        {breadCrumbRightContent && (
                            breadCrumbRightContent
                        )}
                    </div>
                    {children}
                </div>
            </div>
            <ModalBody
                targetModal="modalLogout"
                title={<h5 className='mb-0'><FontAwesomeIcon className='text-warning' icon={faExclamationTriangle} fixedWidth />&nbsp;Peringatan</h5>}
            >
                <p>Are you sure you want to logout?</p>
                <div className='d-flex justify-content-end gap-1'>
                    <button className='btn btn-secondary btn-sm' data-bs-dismiss="modal">No</button>
                    <button onClick={handleLogout} className='btn btn-danger btn-sm' data-bs-dismiss="modal">Yes</button>
                </div>
            </ModalBody>
        </Launcher>
    )
}

export default DashboardLayout;