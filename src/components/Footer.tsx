'use client';

import React from 'react';
import type { ComponentProps } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { Landmark } from 'lucide-react';
import { useLocale } from 'next-intl';

interface FooterLink {
        title: string;
        titleAm?: string;
        href: string;
}

interface FooterSection {
        label: string;
        labelAm?: string;
        links: FooterLink[];
}

const footerLinks: FooterSection[] = [
        {
                label: 'Product',
                labelAm: 'ምርቶቻችን',
                links: [
                        { title: 'Listings', titleAm: 'የሚከራዩ ቤቶች', href: '/home/listings' },
                        { title: 'Services', titleAm: 'አገልግሎቶች', href: '/home/services' },
                        { title: 'Pricing', titleAm: 'የክፍያ አማራጮች', href: '#' },
                        { title: 'Virtual Tours', titleAm: 'የቪዲዮ ጉብኝት', href: '#' },
                ],
        },
        {
                label: 'Company',
                labelAm: 'ድርጅት',
                links: [
                        { title: 'About Us', titleAm: 'ስለ እኛ', href: '/home/about' },
                        { title: 'Contact', titleAm: 'ያግኙን', href: '/home/contact' },
                        { title: 'Careers', titleAm: 'ስራ', href: '#' },
                        { title: 'Press', titleAm: 'ዜና', href: '#' },
                ],
        },
        {
                label: 'Resources',
                labelAm: 'መረጃዎች',
                links: [
                        { title: 'Blog', titleAm: 'ብሎግ', href: '#' },
                        { title: 'Help Center', titleAm: 'የእገዛ ማዕከል', href: '#' },
                        { title: 'Privacy Policy', titleAm: 'የግላዊነት ፖሊሲ', href: '#' },
                        { title: 'Terms of Service', titleAm: 'የአገልግሎት ውል', href: '#' },
                ],
        },
];

export function Footer() {
        const locale = useLocale();
        const isAm = locale === 'am';

        return (
                <footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-6 py-12 lg:py-16">
                        <div className="bg-[#1F3549]/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />
                        <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
                                <AnimatedContainer className="space-y-4">
                                        <div className="flex items-center gap-2">
                                                <Landmark className="size-6 text-[#1F3549]" />
                                                <span className="text-base font-bold tracking-tight text-[#1F3549]">BMS</span>
                                        </div>
                                        <p className="text-muted-foreground mt-8 text-sm md:mt-0">
                                                © {new Date().getFullYear()} {isAm ? 'የህንፃ አስተዳደር ሲስተም። መብቱ በህግ የተጠበቀ ነው።' : 'Building Management System. All rights reserved.'}
                                        </p>
                                </AnimatedContainer>

                                <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 xl:col-span-2 xl:mt-0">
                                        {footerLinks.map((section, index) => (
                                                <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                                                        <div className="mb-10 md:mb-0">
                                                                <h3 className="text-xs font-semibold text-[#1F3549]">{isAm && section.labelAm ? section.labelAm : section.label}</h3>
                                                                <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                                                                        {section.links.map((link) => (
                                                                                <li key={link.title}>
                                                                                        <Link
                                                                                                href={link.href}
                                                                                                className="hover:text-[#1F3549] inline-flex items-center transition-all duration-300"
                                                                                        >
                                                                                                {isAm && link.titleAm ? link.titleAm : link.title}
                                                                                        </Link>
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        </div>
                                                </AnimatedContainer>
                                        ))}
                                </div>
                        </div>
                </footer>
        );
};

type ViewAnimationProps = {
        delay?: number;
        className?: ComponentProps<typeof motion.div>['className'];
        children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
        const shouldReduceMotion = useReducedMotion();

        if (shouldReduceMotion) {
                return children;
        }

        return (
                <motion.div
                        initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
                        whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay, duration: 0.8 }}
                        className={className}
                >
                        {children}
                </motion.div>
        );
}
