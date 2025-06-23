import { NextResponse } from 'next/server';

export default async function middleware(req) {
    const url = req.nextUrl
    const auth = req.cookies.get('accessToken')

    const isUserAuthenticated = async () => {
        let isAuthenticated = false
        await fetch(`${process.env.NEXT_PUBLIC_RESTFUL_API}/user/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${auth?.value}`
            }
        }).then(async (res) => {
            const data = await res.json()

            if (data?.id) {
                isAuthenticated = true
            }
        }).catch((err) => {
            if (err.response?.status === 403) {
                isAuthenticated = false
            } else {
                isAuthenticated = null
            }

        })

        return isAuthenticated
    }

    const isAuthenticated = await isUserAuthenticated().then((res) => { return res })

    if (url.pathname.includes('/dashboard')) {
        if (isAuthenticated === true) {
            return NextResponse.next()
        } else if (isAuthenticated === false) {
            url.pathname = '/logout'
            req.cookies.delete('accessToken')
            return NextResponse.redirect(url)
        } else if (isAuthenticated === null) {
            url.pathname = '/'
            return NextResponse.redirect(url)
        }
    } else if (url.pathname.includes('/login')) {
        if (isAuthenticated === true) {
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        } else if (isAuthenticated === false) {
            req.cookies.delete('accessToken')
            return NextResponse.next()
        } else if (isAuthenticated === null) {
            return NextResponse.next()
        }
    } else if (url.pathname.includes('/logout')) {
        if (isAuthenticated === true || isAuthenticated === false) {
            req.cookies.delete('accessToken')
        }
    }

    return NextResponse.next()
}