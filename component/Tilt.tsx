import { cn } from "@/lib/cn";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { HTMLAttributes, MouseEvent, ReactNode, useRef } from "react";

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    disabled: boolean;
}

const Tilt = ({ children, disabled = false, className }: Props) => {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x);
    const ySpring = useSpring(y);

    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return [0, 0];

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = (event.clientX - rect.left) * ROTATION_RANGE;
        const mouseY = (event.clientY - rect.top) * ROTATION_RANGE;

        const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
        const rY = mouseX / width - HALF_ROTATION_RANGE;

        x.set(rX);
        y.set(rY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    if (disabled) return children;

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                transform,
            }}
            className={cn("relative h-full w-full", className)}
        >
            {children}
        </motion.div>
    );
};

export default Tilt;
