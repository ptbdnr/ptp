'use client';

import { ErrorBoundary } from 'react-error-boundary';
import Header from '@/components/header/Header';
import Navigation from '@/components/navigation/Navigation';

import styles from '@/styles/plato.module.css';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 m-4 border border-red-300 rounded bg-red-50 text-red-800">
      <h2 className="text-lg font-semibold mb-2">Layout Error</h2>
      <p>{error.message}</p>
    </div>
  );
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          {children}
        </main>
        <Navigation />
      </div>
    </ErrorBoundary>
  );
} 