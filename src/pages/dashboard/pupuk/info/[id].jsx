
import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DashboardLayout from '@/layouts/dashboard_layout'
import { Table } from 'antd'

const Info = ({ id }) => {
    const axios = useAxiosPrivate()
    const [data, setData] = useState({})
    const [currentSort, setCurrentSort] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const columns = [
        {
            title: 'No',
            key: 'index',
            width: '5%',
            align: 'center',
            render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Kandungan',
            dataIndex: "kandungan",
            key: "kandungan",
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'kandungan' ? currentSort.order : undefined,
        },
        {
            title: 'Deskripsi',
            dataIndex: "deskripsi",
            key: "deskripsi",
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'deskripsi' ? currentSort.order : undefined,
        }
    ];

    const getData = async () => {
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/pupuk/${id ? id : ''}`,
        }).then((res) => {
            if (res.data?.id) {
                setData(res.data);
            }
        }).catch((err) => {
            console.error(err)
        })
    }
    useEffect(() => {
        getData()
    }, [id])
    return (
        <>
            <Head>
                <title>Informasi Pupuk</title>
            </Head>
            <div className="card">
                <div className="card-body">
                    <div>
                        <h6 className='small mb-0' style={{ letterSpacing: 2 }}>NAMA</h6>
                        <p className='fw-bold mb-4'>{data?.nama}</p>
                    </div>
                    <div>
                        <h6 className='small mb-0' style={{ letterSpacing: 2 }}>KEMASAN</h6>
                        <p className='fw-bold mb-4'>{data?.kemasan}</p>
                    </div>
                    <div>
                        <h6 className='small mb-2' style={{ letterSpacing: 2 }}>SPESIFIKASI</h6>
                        <Table
                            sortDirections={['ascend', 'descend', 'ascend']}
                            showSorterTooltip={true}
                            columns={columns}
                            dataSource={data?.pupukSpesifikasi}
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
    const { id } = context.params;

    return {
        props: { id },
    };
}

Info.getLayout = function getLayout(page) {
    const { id } = page.props;
    return (<DashboardLayout header='Info Pupuk' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Pupuk', link: '/dashboard/pupuk' }, { label: 'Informasi Pupuk', link: '/dashboard/pupuk/info/' + id }]} breadCrumbRightContent={
        <Link href='/dashboard/pupuk' className='btn btn-secondary rounded-xl'>
            <FontAwesomeIcon icon={faAngleLeft} />&nbsp; Back
        </Link>
    }>{page}</DashboardLayout>)
}

export default Info;