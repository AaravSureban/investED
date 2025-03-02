import React, { useEffect, useRef } from "react";
import * as THREE from 'three'
import NET from 'vanta/dist/vanta.net.min'

export default function VantaBackground() {
    const vantaRef = useRef(null)

    useEffect(() => {
        const VantaEffect = NET({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: true,
            minHeight: 850.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xF7EBE8,
            backgroundColor: 0x282828,
            points: 10.00,
            maxDistance: 20.00,
            spacing:20.00
        })
    }, [])

    return (
        <div className="background" ref={vantaRef}></div>
    )
}