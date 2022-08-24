import React, { ReactNode } from "react";
import Link from "next/link";
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
        </Head>
        <Navbar />
        <div className="bg-corbeau min-h-screen text-white font-satoshi">
            {children}
        </div>
    </div>
);

export default Layout;
