
import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import Spinner from '@/components/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faFileAlt, faPlus, faSearch, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import Swal from 'sweetalert2'
import DashboardLayout from '@/layouts/dashboard_layout'
import Head from 'next/head'
import axios from '@/api/axios'

const Index = () => {
    const axios = useAxiosPrivate()
    const [tingkat, setTingkat] = useState('')
    const [search, setSearch] = useState('')
    const [currentSort, setCurrentSort] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [tableData, setTableData] = useState([])
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const columns = [
        {
            title: 'No',
            key: 'index',
            width: '5%',
            align: 'center',
            render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Nomor',
            dataIndex: "nomor",
            key: "nomor",
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'nomor' ? currentSort.order : undefined,
        },
        {
            title: 'Nama',
            dataIndex: "nama",
            key: "nama",
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'nama' ? currentSort.order : undefined,
        },
        {
            title: 'Parent',
            dataIndex: ['distributor', 'nama'],
            key: ['distributor', 'nama'],
            // sorter: (a, b) => { },
            // sortOrder: currentSort && JSON.stringify(currentSort.index) == JSON.stringify(['distributor', 'nama']) ? currentSort.order : undefined,
        },
        {
            title: 'Tingkat',
            dataIndex: "tingkat",
            key: "tingkat",
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'tingkat' ? currentSort.order : undefined,
        },
        {
            title: 'Alamat',
            dataIndex: "alamat",
            key: "alamat",
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'alamat' ? currentSort.order : undefined,
        },
        {
            title: 'NPWP',
            dataIndex: "npwp",
            key: "npwp",
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'npwp' ? currentSort.order : undefined,
        },
        {
            title: 'Kontak',
            dataIndex: "kontakNama",
            key: "kontakNama",
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'kontakNama' ? currentSort.order : undefined,
        },
        {
            title: 'Action',
            align: 'center',
            render: (text, record, index) => {
                return (
                    <div className='d-flex gap-2 justify-content-center'>
                        <Link href={`/dashboard/pengedar/edit/${record.id}`} className='btn btn-success btn-sm' data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content='Edit Content'>
                            <FontAwesomeIcon icon={faEdit} fixedWidth />
                        </Link>
                        <button type='button' className='btn btn-danger btn-sm' onClick={() => handleDelete(record.id)} data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content='Delete Content'><FontAwesomeIcon icon={faTrashAlt} fixedWidth /></button>
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
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/pengedar?limit=${pageSize}&offset=${(currentPage - 1) * pageSize}${Object.keys(currentSort).length > 0 ? '&order=' + order : ''}${search != '' ? '&search=' + search : ''}${tingkat !== '' ? `&tingkat=${tingkat}` : ''}`,
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
                    url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/pengedar/${id}`
                }).then((res) => {
                    if (res.data?.id) {
                        getData()
                        Swal.fire('Success', 'Content deleted successfully!', 'success')
                    }
                }).catch((err) => {
                    console.error(err)
                })
            }
        })
    }
    useEffect(() => {
        getData()
    }, [currentPage, currentSort, pageSize, search, tingkat])

    return (
        <>
            <Head>
                <title>Pengedar List</title>
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
                                <th className='table-secondary w-25 align-middle'>Tingkat</th>
                                <td className='align-middle'>
                                    <select className='form-control' value={tingkat} onChange={(e) => setTingkat(e.target.value)}>
                                        <option value="" selected>All</option>
                                        <option value="Distributor">Distributor</option>
                                        <option value="Pengecer">Pengecer</option>
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

Index.getLayout = function getLayout(page) {
    return (
        <DashboardLayout header='Pengedar List' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Pengedar', link: '/dashboard/pengedar' }, { label: 'Pengedar List', link: '/dashboard/pengedar' }]} breadCrumbRightContent={(
            <div className='d-flex justify-content-end gap-1'>
                <Link href='/dashboard/pengedar/create' className='btn btn-primary rounded-xl'>
                    <FontAwesomeIcon icon={faPlus} />&nbsp; Create
                </Link>
            </div>
        )}>{page}</DashboardLayout>
    )
}

export default Index;