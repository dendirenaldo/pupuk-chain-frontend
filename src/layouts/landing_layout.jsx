import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

const LandingLayout = ({ title, children, icon = null }) => {
    const router = useRouter();
    const { asPath } = router;
    return (
        <>
            <Head>
                <title>{title}</title>
                {icon && (
                    <link rel="shortcut icon" href={`${process.env.NEXT_PUBLIC_RESTFUL_API}/configuration/image/${icon}`} type="image/x-icon" />
                )}
            </Head>
            <section style={{ minHeight: '100vh' }}>
                {children}
            </section>
        </>
    )
}

export default LandingLayout;
