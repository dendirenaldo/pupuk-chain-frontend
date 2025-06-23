import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import Spinner from '@/components/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faPlus, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link'
import { tanggalIndo } from '@/api/tanggal'
import DashboardLayout from '@/layouts/dashboard_layout'
import { Table } from 'antd'
import axios from '@/api/axios'

const Index = () => {
    const axios = useAxiosPrivate()
    const [search, setSearch] = useState('')
    const [currentSort, setCurrentSort] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [tableData, setTableData] = useState([])
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [role, setRole] = useState('')
    const columns = [
        {
            title: 'No',
            key: 'index',
            width: '5%',
            align: 'center',
            render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: "Picture",
            dataIndex: "picture",
            key: "picture",
            align: 'center',
            render: (text, record, index) => (
                <img className='shadow-sm' style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'white', objectFit: 'cover' }} src={`${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user/profile-picture/${text}`} />
            )
        },
        {
            title: 'Full Name',
            dataIndex: "fullName",
            key: "fullName",
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'fullName' ? currentSort.order : undefined
        },
        {
            title: 'Email Address',
            dataIndex: "email",
            key: "email",
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'email' ? currentSort.order : undefined
        },
        {
            title: 'Role',
            dataIndex: "role",
            key: "role",
            align: 'center',
            sorter: (a, b) => { }
        },
        {
            title: 'Date Created',
            dataIndex: "createdAt",
            key: "createdAt",
            align: 'center',
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'createdAt' ? currentSort.order : undefined,
            render: (text, record, index) => (
                <>
                    {`${tanggalIndo(text.split('T')[0])}, ${text.split('T')[1].substring(0, 5)} WIB`}
                </>
            )
        },
        {
            title: 'Action',
            align: 'center',
            render: (text, record, index) => {
                return (
                    <div className='d-flex gap-2 justify-content-center'>
                        <Link href={`/dashboard/user-management/edit/${record.id}`} className='btn btn-success btn-sm' data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content='Edit User'>
                            <FontAwesomeIcon icon={faEdit} fixedWidth />
                        </Link>
                        <button type='button' className='btn btn-danger btn-sm' data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content='Delete User' onClick={() => handleDelete(record.id)}><FontAwesomeIcon icon={faTrashAlt} fixedWidth /></button>
                    </div>
                )
            }
        }
    ];

    const getData = async () => {
        const order = Object.keys(currentSort).length > 0 && JSON.stringify({
            index: currentSort?.index,
            order: currentSort?.order == 'ascend' ? 'asc' : 'desc'
        })
        setIsLoading(true)
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user?limit=${pageSize}&offset=${(currentPage - 1) * pageSize}${Object.keys(currentSort).length > 0 ? '&order=' + order : ''}${search != '' ? '&search=' + search : ''}${role !== '' ? '&role=' + role : ''}`,
        }).then((res) => {
            setTableData(res.data.data)
            setTotal(res.data.totalData)
            setIsLoading(false)
        })
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This data will be deleted and cannot be recovered',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Yes'
        }).then(async (res) => {
            if (res.isConfirmed) {
                await axios({
                    method: 'DELETE',
                    url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user/${id}`
                }).then((res) => {
                    if (res.data?.id) {
                        getData()
                        Swal.fire('Success', 'User deleted successfully!', 'success')
                    }
                }).catch((err) => {
                    console.error(err)
                })
            }
        })
    }

    useEffect(() => {
        getData()
    }, [currentPage, currentSort, pageSize, search, role])

    return (
        <>
            <Head>
                <title>User Management List</title>
            </Head>
            <div className="alert border-success rounded-xl alert-dismissible fade show shadow-sm" role="alert">
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                <h4 className="alert-heading"><FontAwesomeIcon className='text-warning' icon={faExclamationTriangle} /> Warning!</h4>
                <p>The data displayed in the following table is master data, where this data influences other data.</p>
                <hr />
                <p className="mb-0">Use it wisely and according to the instructions for use.</p>
            </div>
            <div className="card">
                <div className="card-body">
                    <table className='table table-bordered mb-3'>
                        <tbody>
                            <tr>
                                <th className='table-secondary w-25 align-middle'>Role</th>
                                <td className='align-middle'>
                                    <select className='form-control' value={role} onChange={(e) => setRole(e.target.value)}>
                                        <option value="" selected>All</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Produsen">Produsen</option>
                                        <option value="Distributor">Distributor</option>
                                        <option value="Pengecer">Pengecer</option>
                                        <option value="Petani">Petani</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ position: 'relative' }}>
                        <input className='form-control mb-3 rounded-pill' onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }} placeholder='Search' />
                        <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translate(0%,-50%)' }} />
                    </div>
                    <div className="table-responsive">
                        <Table
                            loading={{
                                spinning: isLoading ? true : false,
                                indicator: <Spinner />
                            }}
                            sortDirections={['ascend', 'descend', 'ascend']}
                            showSorterTooltip={true}
                            columns={columns}
                            dataSource={tableData}
                            bordered={true}
                            rowKey={record => record.id}
                            onChange={(pagination, filters, sorter, extra) => {
                                if (extra.action === 'sort') {
                                    setCurrentSort({
                                        index: sorter.field,
                                        order: sorter.order
                                    })
                                }
                                if (extra.action === 'paginate') {
                                    setCurrentPage(pagination.current)
                                    setPageSize(pagination.pageSize)
                                }
                            }}
                            pagination={{
                                current: currentPage || 1,
                                pageSize: pageSize,
                                total: total,
                                showSizeChanger: true,
                                locale: { items_per_page: "" },
                                pageSizeOptions: ['5', '10', '25', '50', '100', '150'],
                                showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const user = await axios({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_RESTFUL_API}/user/me`,
        headers: {
            'Authorization': `Bearer ${context.req.cookies['accessToken']}`
        }
    }).then((res) => {
        if (res.data?.id) {
            return res.data;
        } else {
            return null;
        }
    }).catch((err) => {
        console.error(err)
    })

    return {
        notFound: (typeof user !== 'undefined' && (user?.role === 'Admin')) ? false : true,
        props: {},
    };
}

Index.getLayout = function getLayout(page) {
    return (
        <DashboardLayout header='User Management List' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'User Management', link: '/dashboard/user-management' }, { label: 'User Management List', link: '/dashboard/user-management' }]} breadCrumbRightContent={
            <div className='d-flex justify-content-end gap-1'>
                <Link href='/dashboard/user-management/create' className='btn btn-primary rounded-xl'>
                    <FontAwesomeIcon icon={faPlus} />&nbsp; Create
                </Link>
            </div>
        }>{page}</DashboardLayout>
    )
}

export default Index;