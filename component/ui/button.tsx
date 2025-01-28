"use client";

import { cn } from "@/lib/cn";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, Ref } from "react";

export const buttonVariants = cva(
    "gap-3 inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-lg outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:z-10 transition-all",
    {
        variants: {
            variant: {
                default: "bg-amber-300 font-bold tracking-wide text-black hover:bg-amber-400  uppercase ",
                secondary:
                    "bg-white font-bold tracking-wide text-black hover:bg-amber-300 uppercase active:bg-amber-400",
            },
            size: {
                default: "h-11 min-h-11 px-5 w-fit min-w-48",
            },
            effect: {
                press: "transition-all shadow-[0_0.5rem_0_0_rgba(0,0,0,0.75)] hover:-translate-y-1 hover:shadow-[0_0.75rem_0_0_rgba(0,0,0,0.75)] active:translate-y-1 active:shadow-[0_0.25rem_0_0_rgba(0,0,0,0.75)]",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            effect: "press",
        },
    },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    ref?: Ref<HTMLButtonElement>;
}

export const Button = ({ className, variant, size, effect, asChild = false, ref, ...props }: ButtonProps) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, effect, className }))} ref={ref} {...props} />;
};
