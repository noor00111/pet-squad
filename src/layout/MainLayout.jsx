import PageTransition from '@/common/PageTransition';
import ScrollToTop from '@/common/ScrollToTop';
import Footer from '@/pages/Shared/Footer';
import Navbar from '@/pages/Shared/Navbar';
import React from 'react';

const MainLayout = () => {
    return (
        <div className='font-bodyFont'>
            <Navbar></Navbar>
            <div><PageTransition></PageTransition></div>
            <Footer></Footer>
            <ScrollToTop></ScrollToTop>
        </div>
    );
};

export default MainLayout;