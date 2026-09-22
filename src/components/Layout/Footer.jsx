/**
 * Site footer with branding, platform links, contact links, and copyright.
 */
export default function Footer() {
  return (
    <footer className="mt-auto bg-bg-warm border-t border-black/[0.04]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Branding */}
          <div className="max-w-sm">
            <p className="font-serif text-xl font-bold text-primary">AgroVision</p>
            <p className="mt-3 text-sm leading-relaxed text-text-light">
              Precision agriculture for a sustainable future. Empowering farmers with
              data-driven insights.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex gap-16 sm:gap-24">
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-text-dark uppercase mb-4">
                Platform
              </h3>
              <ul className="space-y-2.5">
                {['Solutions', 'Hardware', 'Documentation'].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-sm text-text-light hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-text-dark uppercase mb-4">
                Contact
              </h3>
              <ul className="space-y-2.5">
                {['Support', 'Privacy Policy', 'Terms of Use'].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-text-light hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-10 pt-6 border-t border-black/[0.04] text-center text-xs text-text-light">
          © 2024 AgroVision Systems. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
