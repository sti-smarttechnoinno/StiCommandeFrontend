'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FeatureCards } from './feature-cards';
import { Badge } from '@/components/ui/badge';

const MODULE_HIGHLIGHTS = [
  { title: 'Field Operations & GPS Tracking', desc: 'Real-time delegate location, shift logs, and territory coverage.' },
  { title: 'Telecom & Credit Line Distribution', desc: 'Mobilis, Djezzy, and Ooredoo credit lines, scratch cards & SIM inventory.' },
  { title: 'Client Line of Credit & Limits', desc: 'Automated credit balance monitoring, limit checks & approval queues.' },
  { title: 'Real-Time ERP Analytics', desc: 'Instant KPI insights, daily sales summaries, and exportable financial reports.' },
];

export function BrandingSection() {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center text-center w-[55%] max-w-[720px] px-6 py-4 mx-auto my-auto select-none space-y-6">
      {/* Brand Identity Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center w-full space-y-2"
      >
        <div className="relative w-[200px] h-auto flex items-center justify-center mb-1">
          <Image
            src="/assets/logo.png"
            alt="ESTSTAR Logo"
            width={200}
            height={80}
            className="object-contain w-[200px] h-auto"
            priority
          />
        </div>

        <h1 className="text-3xl font-extrabold text-foreground tracking-tight leading-tight font-sans">
          ESTSTAR Distribution
        </h1>

        <p className="text-sm font-semibold text-muted-foreground max-w-[500px]">
          Enterprise Telecommunications Distribution ERP
        </p>

        {/* Decorative Red Divider */}
        <div className="w-[60px] h-1 bg-primary rounded-full my-2 mx-auto" />
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-[560px] mx-auto text-center"
      >
        <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground font-medium">
          Manage delegates, clients, mobile credit, SIM cards, territories, inventory, orders, stock movements and real-time business analytics from one unified enterprise platform.
        </p>
      </motion.div>

      {/* Platform Module Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left"
      >
        {MODULE_HIGHLIGHTS.map((module) => (
          <div key={module.title} className="p-3 rounded-xl bg-card border border-border/40 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span className="text-xs font-bold text-foreground truncate">{module.title}</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal pl-3">
              {module.desc}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="w-full"
      >
        <FeatureCards />
      </motion.div>
    </div>
  );
}
