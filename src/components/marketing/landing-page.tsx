'use client';

import { motion } from 'framer-motion';
import { LandingAboutSection } from './landing-about-section';
import { LandingBackground } from './landing-background';
import { LandingContactSection } from './landing-contact-section';
import { LandingFooter } from './landing-footer';
import { LandingHeader } from './landing-header';
import { LandingHero } from './landing-hero';
import { LandingPlatformSection } from './landing-platform-section';
import { LandingTrustSection } from './landing-trust-section';
import { LandingUserSection } from './landing-user-section';
import { LandingWorkflowSection } from './landing-workflow-section';

export function LandingPage() {
  return (
    <motion.div className="relative h-full overflow-x-hidden overflow-y-auto bg-background text-foreground">
      <LandingBackground />
      <LandingHeader />

      <main id="home" className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-28 md:pt-36">
        <LandingHero />
        <LandingUserSection />
        <LandingPlatformSection />
        <LandingAboutSection />
        <LandingWorkflowSection />
        <LandingTrustSection />
        <LandingContactSection />
      </main>

      <LandingFooter />
    </motion.div>
  );
}
