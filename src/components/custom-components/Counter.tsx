import React from 'react'
import AnimatedCountUp from './AnimatedCountUp'

const Counter = ({ to }: any) => {

    return (
        <>
            <AnimatedCountUp to={Number(to)} />
        </>
    )
}

export default Counter
