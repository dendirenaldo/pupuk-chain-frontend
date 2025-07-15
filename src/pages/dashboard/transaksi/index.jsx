import { tanggalIndo } from '@/api/tanggal'
import Spinner from '@/components/Spinner'
import { useAuthContext } from '@/context/AuthProvider'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import DashboardLayout from '@/layouts/dashboard_layout'
import { faFileExcel } from '@fortawesome/free-regular-svg-icons'
import { faExclamationTriangle, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Table } from 'antd'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Index = () => {
    const axios = useAxiosPrivate()
    const [search, setSearch] = useState('')
    const { profile } = useAuthContext();
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
            title: 'Blockchain',
            children: [
                {
                    title: 'Transaction Hash',
                    dataIndex: "transactionHash",
                    key: "transactionHash",
                    sorter: (a, b) => { },
                    sortOrder: currentSort && currentSort.index == 'transactionHash' ? currentSort.order : undefined,
                },
                {
                    title: 'Block Number',
                    dataIndex: "blockNumber",
                    key: "blockNumber",
                    align: 'center',
                    sorter: (a, b) => { },
                    sortOrder: currentSort && currentSort.index == 'blockNumber' ? currentSort.order : undefined,
                }
            ]
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
            title: 'Pupuk',
            dataIndex: "fertilizerType",
            key: "fertilizerType",
            align: 'center',
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'fertilizerType' ? currentSort.order : undefined,
        },
        {
            title: 'Kuantitas',
            dataIndex: "quantity",
            key: "quantity",
            align: 'center',
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'quantity' ? currentSort.order : undefined,
        },
        {
            title: 'Tanggal Buat',
            dataIndex: "createdAt",
            key: "createdAt",
            align: 'center',
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'createdAt' ? currentSort.order : undefined,
            render: (text, record, index) => {
                const date = new Date(text * 1000);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                return tanggalIndo(`${year}-${month}-${day}`);
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
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/transaksi?limit=${pageSize}&offset=${(currentPage - 1) * pageSize}${Object.keys(currentSort).length > 0 ? '&order=' + order : ''}${search != '' ? '&search=' + search : ''}${profile !== null && (profile?.role === 'Distributor' || profile?.role === 'Pengedar') ? `&sourceId=${profile?.pengedar.id}` : ''}`,
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
                <title>Transaksi List</title>
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
        <DashboardLayout header='Transaksi List' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Transaksi', link: '/dashboard/transaksi' }, { label: 'Transaksi List', link: '/dashboard/transaksi' }]} breadCrumbRightContent={(
            <div className='d-flex justify-content-end gap-1'>
                <Link href='/dashboard/transaksi/create' className='btn btn-primary rounded-xl'>
                    <FontAwesomeIcon icon={faPlus} />&nbsp; Create
                </Link>
                <Link href='/dashboard/transaksi/export' className='btn btn-secondary rounded-xl'>
                    <FontAwesomeIcon icon={faFileExcel} />&nbsp; Export
                </Link>
            </div>
        )}>{page}</DashboardLayout>
    )
}

export default Index;