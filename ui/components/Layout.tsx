import React, { ReactNode } from "react";
import NextNProgress from "nextjs-progressbar";
import Head from "next/head";

import Navbar from '@components/Shared/Navbar'

type LayoutProps = {
    children?: ReactNode;
    title?: string;
};

const Layout = ({ children, title = "Default title" }: LayoutProps) => (
    <div>
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <NextNProgress 
            height={2} 
            color="#75CEE8"
            options={{ showSpinner: false }}
        />
        <Navbar />
        <div className="bg-repeat-y min-h-screen text-white font-satoshi bg-gradientbg bg-cover">
            {children}
        </div>
    </div>
);

export default Layout;
