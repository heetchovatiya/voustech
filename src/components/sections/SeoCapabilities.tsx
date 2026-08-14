import { Container } from "@/components/ui/Container";

export function SeoCapabilities() {
  return (
    <section aria-label="Technical Capabilities & Overview" className="border-b border-line bg-surface py-12 lg:py-16">
      <Container>
        <div className="max-w-3xl">
          <p className="font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
            Technical Architecture &amp; Delivery Standards
          </p>
          <h2 className="mt-2 text-heading-sm font-display font-semibold sm:text-heading-md">
            Built for Sub-Second Performance, Security &amp; Scale
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Key Takeaways Card */}
          <div className="rounded-sm border border-line bg-base p-6 shadow-sm">
            <h3 className="font-mono text-label uppercase tracking-[0.12em] text-tech-blue">
              Key Takeaways &amp; Overview
            </h3>
            <ul className="mt-4 space-y-3 text-body-sm text-ink-muted">
              <li>
                <strong className="text-ink">Core Specialization:</strong> Custom Web Development, Mobile Apps &amp; Enterprise Software Systems.
              </li>
              <li>
                <strong className="text-ink">Average Delivery Speed:</strong> 4 to 8 weeks for production launch.
              </li>
              <li>
                <strong className="text-ink">Security Standard:</strong> 2FA Authentication, HTTP-Only JWT, and Content-Security-Policy compliance.
              </li>
              <li>
                <strong className="text-ink">Core Technology Stack:</strong>{" "}
                <code className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-xs text-tech-blue">Next.js 16</code>,{" "}
                <code className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-xs text-tech-blue">TypeScript</code>,{" "}
                <code className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-xs text-tech-blue">PostgreSQL</code>, and{" "}
                <code className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-xs text-tech-blue">React Native</code>.
              </li>
            </ul>
          </div>

          {/* Performance & Capability Comparison Table */}
          <div className="overflow-x-auto rounded-sm border border-line bg-base p-6 shadow-sm">
            <h3 className="mb-4 font-mono text-label uppercase tracking-[0.12em] text-tech-blue">
              Architecture Benchmark
            </h3>
            <table className="w-full border-collapse border border-line text-left text-body-sm">
              <thead>
                <tr className="bg-surface font-mono text-label uppercase text-ink-muted">
                  <th className="border border-line p-2.5">Capability</th>
                  <th className="border border-line p-2.5">VousTech Stack</th>
                  <th className="border border-line p-2.5">Legacy Systems</th>
                </tr>
              </thead>
              <tbody className="text-ink">
                <tr>
                  <td className="border border-line p-2.5 font-semibold">Tech Stack</td>
                  <td className="border border-line p-2.5">
                    <code className="rounded bg-surface-elevated px-1 py-0.5 font-mono text-xs text-tech-blue">Next.js 16 + TS</code>
                  </td>
                  <td className="border border-line p-2.5 text-ink-muted">Monoliths</td>
                </tr>
                <tr>
                  <td className="border border-line p-2.5 font-semibold">Speed</td>
                  <td className="border border-line p-2.5">&lt; 0.5s LCP</td>
                  <td className="border border-line p-2.5 text-ink-muted">3.0s+ Load</td>
                </tr>
                <tr>
                  <td className="border border-line p-2.5 font-semibold">Security</td>
                  <td className="border border-line p-2.5">2FA, JWT, CSP</td>
                  <td className="border border-line p-2.5 text-ink-muted">Basic Auth</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </section>
  );
}
