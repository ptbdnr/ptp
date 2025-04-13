'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import LoginLayout from './login-layout';

import styles from './login.module.css';

export default function Page() {
    const router = useRouter();
    const [username, setUsername] = useState('');    

    function handleSubmit () {
        if (username == 'ptp') {
            // TODO: use === process.env.NEXT_PUBLIC_ALLOWED_USERNAME or better
            router.push('/home');
        } else {
            alert('Invalid username');
        }    
    };

    return (
        <LoginLayout>
            <div className={styles.formcontainer}>
                <input
                        type="text"
                        placeholder="Your username ..."
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles.loginUsername}
                    />
                <button
                    className={styles.loginButton}
                    onClick={() => handleSubmit()}
                >
                    Login
                </button>
            </div>
        </LoginLayout>
    );
}