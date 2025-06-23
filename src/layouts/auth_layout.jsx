import styles from '@/styles/pages/index.module.css'
import Launcher from '@/components/Launcher'

const AuthLayout = ({ children }) => {
    return (
        <>
            <Launcher>
                <div className={`${styles.container} container w-100`}>
                    <div className="card overflow-hidden rounded-3 shadow border-0 w-100">
                        <div className="card-body p-0">
                            {children}
                        </div>
                    </div>
                </div>
            </Launcher>
        </>
    )
}

export default AuthLayout