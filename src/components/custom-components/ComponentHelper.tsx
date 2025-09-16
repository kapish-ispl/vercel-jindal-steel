import React from "react";
import AnimatedCountUp from "./AnimatedCountUp";
import SplitText from "./SplitText";

export const Counter = ({ to }: { to?: number; }) => {
    return (
        <>
            <AnimatedCountUp to={Number(to)} />
        </>
    );
};

export const SplitAnimation = ({ text }: { text: string }) => {
    return <SplitText text={text} />;
};
