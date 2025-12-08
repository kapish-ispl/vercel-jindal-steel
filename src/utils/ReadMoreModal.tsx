import { FC, useState } from "react";

const ReadMoreModal = (props: any) => {
    const data = props.data;
    const title = props.title;
    const subTitle = props.subtitle;
    const imgurl = props.imgurl;


    const [contentToggler, setContentToggler] = useState(false);

    const hanndleModalOpen = () => {
        document.body.classList.add("modal-open");
        setContentToggler(true);
    };

    const hanndleModalClose = () => {
        document.body.classList.remove("modal-open");
        setContentToggler(false);
    };
    return (
        <>
            {data.length > 0 &&
                data
                    .filter((items: any, index: any) => items.props !== undefined && index < 2)
                    .map((content: any) => {
                        return (
                            <content.type width={content.props.width ? content.props.width : ""} height={content.props.height ? content.props.height : ""} className={content.props.className} key={content.key}>
                                {content.props.children}
                            </content.type>
                        );
                    })}

            <button className="read_more_btn" onClick={() => hanndleModalOpen()}>
                {"Read More"}
            </button>

            <div className={`c-modal ${contentToggler ? 'active' : ''}`} data-lenis-ignore>
                <div className="generic_spacer_container genric_bottom_spacer">
                    <div className="container cus-conatiner">
                        <div className="row">
                            <div className="col-12 col-md-4">
                                <div className="c-card h-auto sticky">
                                    <div className="c-card__media ratio ratio-1x1"><img alt="card media" className="img-fluid u-img" src={imgurl} /></div>

                                    <div className="c-card__content">
                                        <div className="c-card__content-wrapper">
                                            <div className="c-content-24 ft_medium title lh_1-3">{title}</div>

                                            <div className="label c-content-20 ft_light">{subTitle}</div>
                                        </div>
                                        <a href="https://www.linkedin.com/in/naveenjindalmp/" className="social-link" target="_blank">
                                            <img src={"https://d2lptvt2jijg6f.cloudfront.net/document/126/1764069257_Group481.png"} className="img-fluid u-img" />
                                        </a>

                                    </div>
                                </div>


                            </div>
                            <div className="col-12 col-md-7 offset-lg-1">
                                <div className="genric__content mb-50">
                                    <div className="c-content-32 ft_semiBold clr-gray mb-1">{title}</div>
                                    <div className="c-content-32 ft_semiBold clr-blue">{subTitle}</div>

                                </div>
                                <div>{data}</div>

                            </div>

                        </div>
                    </div>

                </div>
                <button className="modle-cls-btn" onClick={() => hanndleModalClose()}>
                    <div className="close-btn">
                        <svg width="30" height="30" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.8651 0.585741C17.6462 -0.195217 18.9122 -0.195277 19.6932 0.585741C20.4742 1.36677 20.4742 2.63284 19.6932 3.41386L12.9676 10.1394L19.6932 16.865C20.4741 17.6461 20.4742 18.9121 19.6932 19.6931C18.9122 20.4741 17.6462 20.474 16.8651 19.6931L10.1395 12.9676L3.41385 19.6931C2.63281 20.4739 1.36669 20.474 0.585706 19.6931C-0.195272 18.9122 -0.19512 17.6461 0.585706 16.865L7.31133 10.1394L0.585706 3.41386C-0.195179 2.6328 -0.195291 1.36673 0.585706 0.585741C1.3667 -0.195233 2.63279 -0.195132 3.41385 0.585741L10.1395 7.31132L16.8651 0.585741Z" fill="#F5821E" />
                        </svg>

                    </div>
                </button>
            </div>
        </>
    );
};

export default ReadMoreModal;
