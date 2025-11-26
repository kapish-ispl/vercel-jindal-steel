import Link from "next/link";
import React from "react";

interface MediaItem {
    cdnPath: string;
    type?: string;
}

interface Post {
    title: string;
    media?: MediaItem[];
}

interface FinancialCardProps {
    postData: Post[];
    totalPost: number;
    itemsPerPage?: number;
}

const FinancialCard: React.FC<FinancialCardProps> = ({ postData }) => {

    return (
        <ul className="bullet__list">
            {postData?.length > 0 &&
                postData.map((post, index) => {
                    let href = "#";

                    if (post.media && post.media.length > 0) {
                        const attachment = post.media.find(
                            (item) => item.type === "attachment"
                        );
                        if (attachment) {
                            href = attachment.cdnPath;
                        } else {
                            href = '#';
                        }
                    }

                    return (
                        <li className="bullet__list-item" key={index}>
                            <Link
                                className="bullet__list-item-link c-content-19 clr-secondry"
                                href={href}
                            >
                                {post.title}
                            </Link>
                        </li>
                    );
                })}
        </ul>
    );
};

export default FinancialCard;
