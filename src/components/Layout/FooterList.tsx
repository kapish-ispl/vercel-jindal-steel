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
                                    <li key={item.id} className="footerMenu__item"><a href={item.link} target={item.type === "external" ? "_blank" : "_self"} className="footerMenu__item-link">{item.name}</a></li>
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
