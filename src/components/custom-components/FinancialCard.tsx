import { PostData } from "@/types/post";
import Link from "next/link";
import React from "react";

export interface FinancialCardProps {
    postData: PostData[];
    postTotal?: number;
    type: string;
}

const FinancialCard: React.FC<FinancialCardProps> = ({ postData, type }) => {
    const filteredResults = postData.filter(
        (post) => post?.metaInfo?.type === type
    );

    const topResults = filteredResults.slice(0, 3);

    if (topResults.length === 0) return null;

    return (
        <ul className="bullet__list">
            {topResults.map((post, index) => (
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
