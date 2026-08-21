"use client"

import React, { forwardRef, useRef } from "react"

import { cn } from "@/lib/utils"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { PiPath } from "react-icons/pi";
import { GrTask } from "react-icons/gr";
import { RiTargetLine } from "react-icons/ri";
import Image from "next/image";

const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "border-border z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3",
                className
            )}
        >
            {children}
        </div>
    )
})

Circle.displayName = "Circle"

export function AnimatedBeamMultipleOutputDemo({
    className,
}: {
    className?: string
}) {
    const containerRef = useRef<HTMLDivElement>(null)
    const divUserRef = useRef<HTMLDivElement>(null)
    const divAIRef = useRef<HTMLDivElement>(null)
    const divPanduRef = useRef<HTMLDivElement>(null)
    const div1Ref = useRef<HTMLDivElement>(null)
    const div2Ref = useRef<HTMLDivElement>(null)
    const div3Ref = useRef<HTMLDivElement>(null)

    return (
        <div
            className={cn(
                "relative flex h-[250px] mt-10 w-full items-center justify-center overflow-hidden",
                className
            )}
            ref={containerRef}
        >
            <div className="flex size-full flex-row items-stretch justify-between gap-10">

                <div className="flex flex-col justify-center">
                    <Circle ref={divUserRef}>
                        <Icons.user />
                    </Circle>
                </div>
                <div className="flex flex-col justify-center">
                    <Circle ref={divPanduRef} className="size-16">
                        <Image src="/icon/PanduIcon-new.svg" alt="PanduIcon" width={25} height={25} />
                    </Circle>
                </div>
                <div className="flex flex-col justify-center">
                    <Circle ref={divAIRef} className="size-16">
                        <Image src="/icon/Google_Gemini_icon_2025.svg" alt="AI" width={25} height={25} />
                    </Circle>
                </div>
                <div className="flex flex-col justify-center gap-2">
                    <Circle ref={div1Ref} className="size-14 text-primary-hover font-">
                        <PiPath />
                    </Circle>
                    <Circle ref={div2Ref} className="size-14 text-primary-hover font-">
                        <GrTask />
                    </Circle>
                    <Circle ref={div3Ref} className="size-14 text-primary-hover font-">
                        <RiTargetLine />
                    </Circle>
                </div>
            </div>

            <AnimatedBeam
                containerRef={containerRef}
                fromRef={divUserRef}
                toRef={divPanduRef}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={divPanduRef}
                toRef={divAIRef}
                curvature={0}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={divAIRef}
                toRef={div1Ref}
                curvature={100}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={divAIRef}
                toRef={div2Ref}
                curvature={0}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={divAIRef}
                toRef={div3Ref}
                curvature={-100}
            />
        </div>
    )
}

const Icons = {
    user: () => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
}
