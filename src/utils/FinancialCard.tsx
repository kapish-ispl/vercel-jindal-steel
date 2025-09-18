import { PostData } from "@/types/post";
import Link from "next/link";
import React from "react";

const FinancialCard: React.FC<any> = (props:any) => {
    console.log(props.postData);
    return (
        <ul className="bullet__list">
            {props.postData && props.postData.length > 0 && props.postData.map((post:any, index:number) => (
                <li className="bullet__list-item" key={index}>
                    <Link
                        className="bullet__list-item-link c-content-19 clr-secondry"
                        href={post?.media?.cdnPath || "#"}
                    >
                        {post?.title}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default FinancialCard;
