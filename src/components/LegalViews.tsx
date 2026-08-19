import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { ShieldCheck, FileText, Scale } from 'lucide-react';

interface LegalViewProps {
  type: 'terms' | 'privacy' | 'legal';
}

export const LegalViews: React.FC<LegalViewProps> = ({ type }) => {
  const { setCurrentTab } = useConfig();

  return (
    <div className="w-full flex-1 flex flex-col bg-background min-h-[calc(100vh-80px)] px-4 sm:px-8 lg:px-16 py-10 select-none">
      <div className="max-w-[1000px] mx-auto w-full space-y-10">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => setCurrentTab('showroom')}
          className="font-label-sm text-xs text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest cursor-pointer flex items-center gap-1.5"
        >
          ← BACK TO SHOWROOM
        </button>

        {/* ========================================================= */}
        {/* TERMS OF SERVICE                                          */}
        {/* ========================================================= */}
        {type === 'terms' && (
          <article className="space-y-8" id="terms-of-service">
            <div>
              <span className="font-label-sm text-xs text-primary-container uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-container" />
                LEGAL AGREEMENT // REVISED 2026
              </span>
              <h1 className="font-headline-md text-3xl sm:text-5xl text-primary font-bold tracking-tighter mt-2">
                Terms of Service
              </h1>
              <p className="font-body-md text-sm text-on-surface-variant mt-2">
                These Terms of Service govern all reservations, configurations, purchases, and telemetry services associated with the HyperDrive electric hypercar platform.
              </p>
            </div>

            <div className="space-y-8 text-on-surface font-body-md text-sm sm:text-base leading-relaxed divide-y divide-[#2A2C32]">
              <section className="pt-6 first:pt-0">
                <h2 className="font-headline-md text-xl text-primary font-bold tracking-tight mb-3">
                  01. Build Reservation & Allocation Priority
                </h2>
                <p className="text-on-surface-variant">
                  By locking your vehicle specification and submitting a refundable reservation deposit ($5,000 USD), you secure a production build slot for the specified calendar delivery window. Final allocation order is determined by chronological timestamp of completed configuration and verified funds. HyperDrive reserves the right to decline or refund allocations in restricted jurisdictions.
                </p>
              </section>

              <section className="pt-6">
                <h2 className="font-headline-md text-xl text-primary font-bold tracking-tight mb-3">
                  02. Pricing, Taxes, and Customization Schedules
                </h2>
                <p className="text-on-surface-variant">
                  All displayed pricing represents Manufacturer's Suggested Retail Price (MSRP) exclusive of destination freight, homologation taxes, registration tariffs, and optional track accessories. Configuration adjustments made after initial lock may adjust the estimated delivery window and final invoice pricing.
                </p>
              </section>

              <section className="pt-6">
                <h2 className="font-headline-md text-xl text-primary font-bold tracking-tight mb-3">
                  03. Limited High-Performance Vehicle Warranty
                </h2>
                <p className="text-on-surface-variant">
                  HyperDrive vehicles are backed by an 8-year / 160,000 km battery and powertrain warranty guaranteeing minimum 80% capacity retention under specified track cooling parameters. The carbon monocoque is covered by a lifetime structural integrity guarantee against manufacturing defects.
                </p>
              </section>

              <section className="pt-6">
                <h2 className="font-headline-md text-xl text-primary font-bold tracking-tight mb-3">
                  04. Track Telemetry & Over-The-Air (OTA) Dynamic Updates
                </h2>
                <p className="text-on-surface-variant">
                  The integrated 100 Hz vehicle telemetry bus automatically aggregates drivetrain performance, thermal profiles, and inverter metrics. Software firmware updates are deployed over encrypted satellite links to enhance torque vectoring maps, thermal envelope management, and active aerodynamic efficiency.
                </p>
              </section>
            </div>
          </article>
        )}

        {/* ========================================================= */}
        {/* PRIVACY POLICY                                            */}
        {/* ========================================================= */}
        {type === 'privacy' && (
          <article className="space-y-8" id="privacy-policy">
            <div>
              <span className="font-label-sm text-xs text-primary-container uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary-container" />
                SECURITY & TELEMETRY PROTOCOL
              </span>
              <h1 className="font-headline-md text-3xl sm:text-5xl text-primary font-bold tracking-tighter mt-2">
                Privacy & Telemetry Policy
              </h1>
              <p className="font-body-md text-sm text-on-surface-variant mt-2">
                HyperDrive is committed to uncompromising driver privacy, zero telemetry monetization, and cryptographically verified on-vehicle computation.
              </p>
            </div>

            <div className="space-y-8 text-on-surface font-body-md text-sm sm:text-base leading-relaxed divide-y divide-[#2A2C32]">
              <section className="pt-6 first:pt-0">
                <h2 className="font-headline-md text-xl text-primary font-bold tracking-tight mb-3">
                  01. Information Collected by Vehicle Sensor Arrays
                </h2>
                <p className="text-on-surface-variant">
                  Telemetry data—including lateral and longitudinal G-forces, inverter temps, rotor speeds, and track lap times—is processed locally on the dual neural inference ECUs. Aggregate telemetry transmitted to HyperDrive cloud infrastructure is stripped of driver identity and pseudonymized with hardware-level cryptographic tokens.
                </p>
              </section>

              <section className="pt-6">
                <h2 className="font-headline-md text-xl text-primary font-bold tracking-tight mb-3">
                  02. Driver Air-Gap Mode & Complete Telemetry Opt-Out
                </h2>
                <p className="text-on-surface-variant">
                  Owners may activate "Air-Gap Track Mode" at any time from the central cockpit yoke interface. In this state, all cellular and satellite transmission hardware is physically isolated from the CAN-FD bus, storing session data solely on an encrypted removable high-speed CFexpress media card.
                </p>
              </section>

              <section className="pt-6">
                <h2 className="font-headline-md text-xl text-primary font-bold tracking-tight mb-3">
                  03. Cryptographic Storage & Zero Data Sales
                </h2>
                <p className="text-on-surface-variant">
                  HyperDrive does not sell, license, or monetize driver behavioral patterns, GPS waypoints, or performance metrics to insurers, marketing agencies, or data brokers. All user-authored configuration keys are stored in encrypted client-side storage and ephemeral state.
                </p>
              </section>
            </div>
          </article>
        )}

        {/* ========================================================= */}
        {/* LEGAL & REGULATORY DISCLOSURES                           */}
        {/* ========================================================= */}
        {type === 'legal' && (
          <article className="space-y-8" id="legal-disclosures">
            <div>
              <span className="font-label-sm text-xs text-primary-container uppercase tracking-widest flex items-center gap-2">
                <Scale className="w-4 h-4 text-primary-container" />
                REGULATORY & HOMOLOGATION COMPLIANCE
              </span>
              <h1 className="font-headline-md text-3xl sm:text-5xl text-primary font-bold tracking-tighter mt-2">
                Legal & Homologation Disclosures
              </h1>
              <p className="font-body-md text-sm text-on-surface-variant mt-2">
                Global vehicle certification standards, battery recycling directives, and safety compliance documentation.
              </p>
            </div>

            <div className="space-y-8 text-on-surface font-body-md text-sm sm:text-base leading-relaxed divide-y divide-[#2A2C32]">
              <section className="pt-6 first:pt-0">
                <h2 className="font-headline-md text-xl text-primary font-bold tracking-tight mb-3">
                  01. FIA Safety Standards & Crashworthiness
                </h2>
                <p className="text-on-surface-variant">
                  The HyperDrive carbon monocoque is engineered to comply with FIA Article 257 crash structure safety parameters. Integrated crumple zones utilize progressive composite shear matrices providing unprecedented passenger cabin deceleration protection in high-speed track impacts.
                </p>
              </section>

              <section className="pt-6">
                <h2 className="font-headline-md text-xl text-primary font-bold tracking-tight mb-3">
                  02. Battery Recycling & Closed-Loop Directives
                </h2>
                <p className="text-on-surface-variant">
                  All 950V high-discharge lithium-titanate immersion cells are 100% recyclable through HyperDrive’s closed-loop metallurgy partnership. At end of vehicle operational lifecycle, battery modules are repowered for grid-stabilization megawatt storage systems.
                </p>
              </section>

              <section className="pt-6">
                <h2 className="font-headline-md text-xl text-primary font-bold tracking-tight mb-3">
                  03. Intellectual Property & Patents
                </h2>
                <p className="text-on-surface-variant">
                  HYPERDRIVE®, the active multi-element aerodynamic control algorithm, axial-flux dual stator architecture, and vehicle silhouette are registered trademarks and patented technologies of HyperDrive Engineering Group Inc.
                </p>
              </section>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};
