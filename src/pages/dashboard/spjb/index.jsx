
import { Table } from 'antd'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import Spinner from '@/components/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faInfoCircle, faPlus, faPrint, faSearch, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import DashboardLayout from '@/layouts/dashboard_layout'
import axios from '@/api/axios'
import { tanggalIndo } from '@/api/tanggal'

const Index = () => {
    const axios = useAxiosPrivate()
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
            dataIndex: "spjbNumber",
            key: "spjbNumber",
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'spjbNumber' ? currentSort.order : undefined,
        },
        {
            title: 'Pihak Pertama',
            children: [{
                title: 'Nama',
                dataIndex: ['distributor', 'name'],
                key: ['distributor', 'name'],
                align: 'center',
            }, {
                title: 'ID',
                dataIndex: ['distributor', 'id'],
                key: ['distributor', 'id'],
                align: 'center',
            }]

        },
        {
            title: 'Pihak Kedua',
            children: [{
                title: 'Nama',
                dataIndex: ['retailer', 'name'],
                key: ['retailer', 'name'],
                align: 'center',
            }, {
                title: 'ID',
                dataIndex: ['retailer', 'id'],
                key: ['retailer', 'id'],
                align: 'center',
            }]

        },
        {
            title: 'Tahun',
            dataIndex: "spjbYear",
            key: "spjbYear",
            align: 'center',
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'spjbYear' ? currentSort.order : undefined,
        },
        {
            title: 'Tanggal Buat',
            dataIndex: "timestamp",
            key: "timestamp",
            align: 'center',
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'timestamp' ? currentSort.order : undefined,
            render: (text, record, index) => {
                const date = new Date(text * 1000);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                return tanggalIndo(`${year}-${month}-${day}`);
            }
        },
        {
            title: 'Action',
            align: 'center',
            render: (text, record, index) => {
                return (
                    <div className='d-flex gap-2 justify-content-center'>
                        <a href={`${process.env.NEXT_PUBLIC_URL}/print.php?nomor=${record.spjbNumber}`} target='_blank' rel='noreferrer noopener' className='btn btn-primary btn-sm' data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content='Cetak SPJB'>
                            <FontAwesomeIcon icon={faPrint} fixedWidth />
                        </a>
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
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/spjb?limit=${pageSize}&offset=${(currentPage - 1) * pageSize}${Object.keys(currentSort).length > 0 ? '&order=' + order : ''}${search != '' ? '&search=' + search : ''}`,
        }).then((res) => {
            setTableData(res.data.data)
            setTotal(res.data.totalData)
            setIsLoading(false)
        })
    }
    useEffect(() => {
        getData()
    }, [currentPage, currentSort, pageSize, search])

    return (
        <>
            <Head>
                <title>SPJB List</title>
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
        <DashboardLayout header='SPJB List' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'SPJB', link: '/dashboard/spjb' }, { label: 'SPJB List', link: '/dashboard/spjb' }]} breadCrumbRightContent={(
            <Link href='/dashboard/spjb/create' className='btn btn-primary rounded-xl'>
                <FontAwesomeIcon icon={faPlus} />&nbsp; Create
            </Link>
        )}>{page}</DashboardLayout>
    )
}

export default Index