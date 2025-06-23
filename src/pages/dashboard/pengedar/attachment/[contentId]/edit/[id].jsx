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

const Edit = ({ contentId, id }) => {
    const router = useRouter()
    const axios = useAxiosPrivate()
    const buttonRef = useRef()
    const [name, setName] = useState('')
    const [nameError, setNameError] = useState('')
    const [type, setType] = useState('')
    const [typeError, setTypeError] = useState('')
    const [link, setLink] = useState('')
    const [linkError, setLinkError] = useState('')
    const [attachment, setAttachment] = useState(null)
    const [attachmentError, setAttachmentError] = useState('')
    const [thumbnail, setThumbnail] = useState(null)
    const [thumbnailError, setThumbnailError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        buttonRef.current.disabled = true
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        const form = new FormData();
        form.append('contentId', contentId);
        form.append('name', name);
        form.append('type', type);
        if (type === 'Link') form.append('link', link);
        if (type === 'PDF' || type === 'Attachment' || type === 'Image') form.append('file', attachment);
        if (type === 'Link' && thumbnail !== null) form.append('thumbnail', thumbnail);
        await axios({
            method: 'PUT',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/content/attachment/${id ? id : ''}`,
            data: form,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data?.id) {
                Swal.fire('Success', 'Content attachment updated successfully!', 'success').then((res) => {
                    router.push(`/dashboard/content/attachment/${contentId}`)
                })
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
                if (error?.name) {
                    setNameError(error.name)
                } else {
                    setNameError('')
                }

                if (error?.type) {
                    setTypeError(error.type)
                } else {
                    setTypeError('')
                }

                if (error?.link) {
                    setLinkError(error.link)
                } else {
                    setLinkError('')
                }

                if (error?.attachment) {
                    setAttachmentError(error.attachment)
                } else {
                    setAttachmentError('')
                }

                if (error?.thumbnail) {
                    setThumbnailError(error.thumbnail)
                } else {
                    setThumbnailError('')
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
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/content/attachment/${id ? id : ''}`,
            }).then((res) => {
                if (res.data?.id) {
                    setName(res.data.name);
                    setType(res.data.type);
                    setLink(res.data.link ?? '');
                }
            }).catch((err) => {
                console.error(err)
            })
        }
        getData()
    }, [id])
    return (
        <>
            <Head>
                <title>Edit Content Attachment</title>
            </Head>
            <form action="" onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="name" className="mb-1">Name <span className="text-danger">*</span></label>
                            <input type='text' className={`form-control ${nameError !== '' ? 'is-invalid' : ''}`} id='name' value={name} onChange={(e) => setName(e.target.value)} required />
                            {nameError !== '' && (
                                <div className="invalid-feedback">{nameError}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="type" className="mb-1">Type <span className="text-danger">*</span></label>
                            <select className={`form-control ${typeError !== '' ? 'is-invalid' : ''}`} id='type' value={type} onChange={(e) => setType(e.target.value)} required>
                                <option value="" selected>-- Choose Type --</option>
                                <option value="PDF">PDF</option>
                                <option value="Image">Image</option>
                                <option value="Attachment">Attachment</option>
                                <option value="Link">Link</option>
                            </select>
                            {typeError !== '' && (
                                <div className="invalid-feedback">{typeError}</div>
                            )}
                        </div>
                        {type === 'Link' && (
                            <div className="mb-3">
                                <label htmlFor="link" className="mb-1">Link <span className="text-danger">*</span></label>
                                <input type='text' className={`form-control ${linkError !== '' ? 'is-invalid' : ''}`} id='link' value={link} onChange={(e) => setLink(e.target.value)} required />
                                {linkError !== '' && (
                                    <div className="invalid-feedback">{linkError}</div>
                                )}
                            </div>
                        )}
                        {(type === 'PDF' || type === 'Attachment' || type === 'Image') && (
                            <div className="mb-3">
                                <label htmlFor="attachment" className="mb-1">{type}</label>
                                <input type='file' className={`form-control ${attachmentError !== '' ? 'is-invalid' : ''}`} id='attachment' onChange={(e) => setAttachment(e.target.files[0])} />
                                {attachmentError !== '' && (
                                    <div className="invalid-feedback">{attachmentError}</div>
                                )}
                            </div>
                        )}
                        {type === 'Link' && (
                            <div className="mb-3">
                                <label htmlFor="thumbnail" className="mb-1">Thumbnail</label>
                                <input type='file' className={`form-control ${thumbnailError !== '' ? 'is-invalid' : ''}`} id='thumbnail' onChange={(e) => setThumbnail(e.target.files[0])} />
                                {thumbnailError !== '' && (
                                    <div className="invalid-feedback">{thumbnailError}</div>
                                )}
                            </div>
                        )}
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
    const { contentId, id } = context.params;

    return {
        props: { contentId, id },
    };
}

Edit.getLayout = function getLayout(page) {
    const { contentId, id } = page.props;
    return (<DashboardLayout header='Edit Content Attachment' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Content', link: '/dashboard/content' }, { label: 'Edit Content Attachment', link: `/dashboard/content/attachment/${contentId}/edit/${id}` }]} breadCrumbRightContent={
        <Link href={`/dashboard/content/attachment/${contentId}`} className='btn btn-secondary rounded-xl'>
            <FontAwesomeIcon icon={faAngleLeft} />&nbsp; Back
        </Link>
    }>{page}</DashboardLayout>)
}

export default Edit;