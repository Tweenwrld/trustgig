import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/ClientProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'TrustGig - Decentralized Gig Economy on Cardano',
    description: 'Connect with skilled artisans and clients on a trustless platform powered by Cardano blockchain',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}
