import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { X, Check, Copy, Download, Shield, Sparkles } from 'lucide-react';

export const ReserveModal: React.FC = () => {
  const {
    config,
    pricing,
    currentTrim,
    currentPaint,
    isReserveModalOpen,
    setIsReserveModalOpen,
    isSpecLocked,
  } = useConfig();

  const [copied, setCopied] = useState(false);
  const [reservationSubmitted, setReservationSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'United States',
  });

  if (!isReserveModalOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadBuildSheet = () => {
    const buildSheet = `
=====================================================
HYPERDRIVE MOTOR VEHICLE SPECIFICATION SHEET
=====================================================
BUILD CODE: HD-${btoa(JSON.stringify(config)).substring(0, 10).toUpperCase()}
GENERATED: ${new Date().toUTCString()}

TRIM LEVEL:
- Model: HyperDrive ${currentTrim.name.toUpperCase()}
- Base MSRP: $${currentTrim.basePrice.toLocaleString()}
- Power Output: ${currentTrim.peakOutputHp} HP (1,420 Nm Torque)
- 0-100 km/h: ${currentTrim.acceleration0to100}
- Est. Range: ${currentTrim.rangeKm} km

EXTERIOR:
- Paint: ${currentPaint.name} (${currentPaint.category})
- Wheel: ${config.wheels.toUpperCase()}
- Calipers: ${config.caliperColor.toUpperCase()}
- Active Aero Suite: ${config.activeAero ? 'INSTALLED' : 'STANDARD'}

INTERIOR:
- Material: ${config.interior.toUpperCase()}

PRICING BREAKDOWN:
- Base Vehicle MSRP: $${pricing.basePrice.toLocaleString()}
- Selected Options: $${(pricing.totalPrice - pricing.basePrice).toLocaleString()}
- Total Build Price: $${pricing.totalPrice.toLocaleString()} USD
- Refundable Reservation Deposit: $5,000 USD

=====================================================
HYPERDRIVE ENGINEERING // FIA COMPLIANT ARCHITECTURE
=====================================================
    `.trim();

    const blob = new Blob([buildSheet], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hyperdrive_build_spec_${config.trim}_${config.paint}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmitReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setReservationSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reserve-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <div className="bg-level-1 border border-[#2A2C32] rounded-lg max-w-xl w-full p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh] text-primary">
        {/* Close Button */}
        <button
          id="close-reserve-modal-btn"
          onClick={() => {
            setIsReserveModalOpen(false);
            setReservationSubmitted(false);
          }}
          className="absolute top-6 right-6 text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!reservationSubmitted ? (
          <div className="space-y-6">
            {/* Modal Title */}
            <div>
              <span className="font-label-sm text-xs text-primary-container uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary-container" />
                {isSpecLocked ? 'SPECIFICATION LOCKED' : 'BUILD ALLOCATION'}
              </span>
              <h2
                id="reserve-modal-title"
                className="font-headline-md text-2xl sm:text-3xl text-primary font-bold tracking-tight mt-1"
              >
                HyperDrive {currentTrim.name} Reservation
              </h2>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
                Lock your bespoke configuration into the production schedule.
              </p>
            </div>

            {/* Build Spec Summary Card */}
            <div className="bg-[#0C0C0E] border border-[#2A2C32] rounded p-4 space-y-2 font-spec-data text-xs">
              <div className="flex justify-between border-b border-[#1E2116] pb-2">
                <span className="text-on-surface-variant uppercase">TRIM & OUTPUT</span>
                <span className="text-primary font-bold">
                  {currentTrim.name} ({currentTrim.peakOutputHp} HP)
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1E2116] pb-2">
                <span className="text-on-surface-variant uppercase">PAINT & WHEELS</span>
                <span className="text-primary">
                  {currentPaint.name} / {config.wheels.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1E2116] pb-2">
                <span className="text-on-surface-variant uppercase">INTERIOR ENVIRONMENT</span>
                <span className="text-primary">{config.interior.toUpperCase()}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-on-surface-variant uppercase font-bold">TOTAL BUILD PRICE</span>
                <span className="text-primary-container font-bold text-sm">
                  ${pricing.totalPrice.toLocaleString()} USD
                </span>
              </div>
            </div>

            {/* Share & Download Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                id="copy-build-url-btn"
                onClick={handleCopyLink}
                className="py-2.5 px-3 border border-[#2A2C32] rounded text-on-surface-variant hover:text-primary hover:border-primary transition-all font-label-sm text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-primary-container" />
                    <span>LINK COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>SHARE CONFIG URL</span>
                  </>
                )}
              </button>

              <button
                id="download-build-sheet-btn"
                onClick={handleDownloadBuildSheet}
                className="py-2.5 px-3 border border-[#2A2C32] rounded text-on-surface-variant hover:text-primary hover:border-primary transition-all font-label-sm text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>BUILD SHEET (.TXT)</span>
              </button>
            </div>

            {/* Reservation Form */}
            <form onSubmit={handleSubmitReservation} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label
                  htmlFor="reserve-name"
                  className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider block"
                >
                  Full Name
                </label>
                <input
                  id="reserve-name"
                  type="text"
                  required
                  placeholder="e.g. Adrian Newey"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#0C0C0E] border border-[#2A2C32] focus:border-primary-container text-primary rounded px-3 py-2 text-sm outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="reserve-email"
                    className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider block"
                  >
                    Email Address
                  </label>
                  <input
                    id="reserve-email"
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0C0C0E] border border-[#2A2C32] focus:border-primary-container text-primary rounded px-3 py-2 text-sm outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="reserve-phone"
                    className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider block"
                  >
                    Phone
                  </label>
                  <input
                    id="reserve-phone"
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#0C0C0E] border border-[#2A2C32] focus:border-primary-container text-primary rounded px-3 py-2 text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Shield className="w-4 h-4 text-primary-container shrink-0" />
                <span className="font-label-sm text-[11px] text-outline">
                  Refundable $5,000 reservation deposit held in escrow.
                </span>
              </div>

              <button
                type="submit"
                id="submit-reservation-btn"
                className="w-full py-3.5 bg-primary-container text-background font-label-sm text-xs uppercase tracking-widest rounded font-bold hover:opacity-90 transition-all cursor-pointer mt-4 active:scale-98"
              >
                CONFIRM BUILD ALLOCATION
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-6 space-y-5">
            <div className="w-14 h-14 bg-primary-container/20 border border-primary-container text-primary-container rounded-full flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>

            <div>
              <span className="font-label-sm text-xs text-primary-container uppercase tracking-widest">
                ALLOCATION VERIFIED
              </span>
              <h2 className="font-headline-md text-3xl text-primary font-bold tracking-tight mt-1">
                Build Priority Reserved
              </h2>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto mt-2">
                Thank you, {formData.fullName}. Your build allocation for the{' '}
                <strong className="text-primary">HyperDrive {currentTrim.name}</strong> has been logged.
                A confirmation dossier has been dispatched to{' '}
                <span className="text-primary-container font-mono">{formData.email}</span>.
              </p>
            </div>

            <div className="bg-[#0C0C0E] border border-[#2A2C32] rounded p-4 font-spec-data text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">SERIAL CODE:</span>
                <span className="text-primary font-bold font-mono">
                  HD-2026-{Math.floor(100000 + Math.random() * 900000)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">EST. PRODUCTION:</span>
                <span className="text-primary">Q4 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">DELIVERY CONCIERGE:</span>
                <span className="text-primary-container">ASSIGNED</span>
              </div>
            </div>

            <button
              id="success-close-btn"
              onClick={() => {
                setIsReserveModalOpen(false);
                setReservationSubmitted(false);
              }}
              className="w-full py-3 border border-primary text-primary font-label-sm text-xs uppercase tracking-widest rounded hover:bg-primary-container hover:text-background transition-all cursor-pointer font-bold"
            >
              RETURN TO SHOWROOM
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
