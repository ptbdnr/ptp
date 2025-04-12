'use client';

import { useRouter } from 'next/navigation';

import LoginLayout from './login-layout';

import styles from '@/styles/plato.module.css';

export default function Page() {
    const router = useRouter();

    return (
        <LoginLayout>
        <main className={styles.main}>
            <form
                onSubmit={function (event) {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const username = formData.get("username") as string;
                const allowedUsername = process.env.NEXT_PUBLIC_ALLOWED_USERNAME;
        
                if (username !== allowedUsername) {
                    alert("Invalid username");
                    return;
                } else {
                    router.push("/"); // Redirect to the home page after login
                }
                }}
            />
        </main>
        </LoginLayout>
    );
}