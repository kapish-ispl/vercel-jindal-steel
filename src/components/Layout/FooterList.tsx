// import Link from "next/link";
// import { FC } from "react";

// type menuTypo = {
//     type: string;
//     id: number;
//     name: string;
//     link: string;
//     children: menuTypo[];
// };

// const FooterList: FC<{ data: menuTypo[]; cls?: string }> = ({ data, cls }) => {
//     return (
//         <>
//             {data.map((item: menuTypo) => {
//                 return (



//                     <div className="c-footer__info-content" key={item.id}>
//                         <div className="head">{item.name}</div>
//                         {item.children.length > 0 && (
//                             <ul className="footerMenu">
//                                 {item.children.map((item) => (
//                                     <li key={item.id} className="footerMenu__item"><a href={item.link} target={item.type === "external" ? "_blank" : "_self"} className="footerMenu__item-link">{item.name}</a></li>
//                                 ))}
//                             </ul>
//                         )}
//                     </div>
//                 );
//             })}
//         </>
//     );
// };

// export default FooterList;




import Link from "next/link";
import { FC } from "react";

type menuTypo = {
    type: string;
    id: number;
    name: string;
    link: string;
    children: menuTypo[];
};

const FooterList: FC<{ data: menuTypo[]; cls?: string }> = ({ data, cls }) => {
    return (
        <>
            {data.map((item: menuTypo) => {
                return (



                    <div className="c-footer__info-content" key={item.id}>
                        <div className="head">{item.name}</div>
                        {item.children.length > 0 && (
                            <ul className="footerMenu">
                                {item.children.map((item) => (
                                    <li key={item.id} className="footerMenu__item"><svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.5 0.500031L5.34236 4.10009C5.6395 4.32099 5.6395 4.67907 5.34236 4.89998L0.500001 8.50003" stroke="#A1A1A1" stroke-linecap="round"></path></svg>
                                        <Link href={item.link} target={item.type === "external" ? "_blank" : "_self"} className="footerMenu__item-link">{item.name}</Link></li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default FooterList;
