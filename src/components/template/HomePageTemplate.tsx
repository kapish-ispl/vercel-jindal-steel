"use client";
import dynamic from 'next/dynamic';
const PageTemplate = dynamic(() => import('./PageTemplate'), { ssr: false });
// const HomeBanner = dynamic(() => import('../Elements/HomeBanner'), { ssr: false });

const HomePage = ({ data }: any) => {
    return (
        <>
            {/* <div className="c-banner">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 p-0">
                            <HomeBanner bannerMedia={data?.media} />
                        </div>
                    </div>
                </div>
            </div> */}
            <PageTemplate data={data} />
        </>
    )
}

export default HomePage;