"use client";
import { FC, useState } from "react";

const ReadMore: FC<{ data: any }> = ({ data }) => {
    const [contentToggler, setContentToggler] = useState(false);

    const handleToggler = () => {
        setContentToggler((prev) => !prev);
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
            {contentToggler &&
                data.length > 0 &&
                data
                    .filter((items: any, index: any) => items.props !== undefined && index > 1)
                    .map((content: any) => {
                        return (
                            <content.type alt={content.props.alt ? content.props.alt : ""} src={content.props.src ? content.props.src : ""} width={content.props.width ? content.props.width : ""} height={content.props.height ? content.props.height : ""} className={content.props.className} key={content.key}>
                                {content.props.children}
                            </content.type>
                        );
                    })}

            <button className="read_more_btn" onClick={handleToggler}>
                {contentToggler ? "Read Less" : "Read More"}
            </button>
        </>
    );
};

export default ReadMore;
