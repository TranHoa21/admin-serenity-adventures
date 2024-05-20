"use client"

import { Inter } from "next/font/google";
import Navbar from '../ui/dashboard/navbar/navbar';
import Sidebar from '../ui/dashboard/sidebar/sidebar';
import "../style/dashboard/dashboard.scss";
import { Provider } from 'react-redux';
import store from "../store/store";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Provider store={store}>
            <html lang="en">
                <body className={inter.className}>
                    <div className="container">
                        <div className="menu">
                            <Sidebar />
                        </div>
                        <div className="content">
                            <Navbar />
                            {children}
                        </div>
                    </div>
                </body>
            </html>
        </Provider>
    );
}

Layout.metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};
