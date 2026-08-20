import React from 'react';

// Inlined (rather than <img src="...">) so the fill/stroke colors below,
// driven by the `.pv-diagram` CSS custom properties in src/css/custom.css,
// react to the site's explicit [data-theme] toggle instead of only the
// OS-level prefers-color-scheme a plain image would be limited to.

export function HeadsUpArchitectureDiagram(): JSX.Element {
  return (
    <svg
      className="pv-diagram"
      viewBox="0 0 980 480"
      xmlns="http://www.w3.org/2000/svg"
      fontFamily="Helvetica, Arial, sans-serif"
      role="img"
      aria-label="Heads-up architecture diagram">
      <defs>
        <marker id="pv-diagram-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--pv-diagram-text-muted)" />
        </marker>
      </defs>

      <rect x="20" y="150" width="180" height="80" rx="6" fill="var(--pv-diagram-card-bg)" stroke="var(--pv-diagram-card-border)" />
      <text x="110" y="180" textAnchor="middle" fontSize="12" fill="var(--pv-diagram-text-muted)">LAYER 0</text>
      <text x="110" y="202" textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--pv-diagram-text-primary)">Hardware</text>

      <line x1="110" y1="230" x2="110" y2="260" stroke="var(--pv-diagram-text-muted)" strokeWidth="1.5" markerEnd="url(#pv-diagram-arrow)" />

      <rect x="20" y="260" width="180" height="80" rx="6" fill="var(--pv-diagram-card-bg)" stroke="var(--pv-diagram-card-border)" />
      <text x="110" y="290" textAnchor="middle" fontSize="12" fill="var(--pv-diagram-text-muted)">LAYER 1</text>
      <text x="110" y="312" textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--pv-diagram-text-primary)">Bootloader</text>

      <line x1="200" y1="300" x2="255" y2="240" stroke="var(--pv-diagram-text-muted)" strokeWidth="1.5" markerEnd="url(#pv-diagram-arrow)" />

      <rect x="260" y="60" width="480" height="360" rx="10" fill="var(--pv-diagram-accent-bg)" stroke="var(--pv-diagram-accent-border)" strokeWidth="2" />
      <text x="284" y="92" fontSize="12" fill="var(--pv-diagram-accent-text)" fontWeight="700">PID 1</text>
      <text x="284" y="116" fontSize="20" fontWeight="800" fill="var(--pv-diagram-text-primary)">Pantavisor</text>
      <text x="736" y="92" textAnchor="end" fontSize="11" fill="var(--pv-diagram-text-muted)">reads / writes</text>
      <text x="736" y="108" textAnchor="end" fontSize="12" fontWeight="600" fill="var(--pv-diagram-text-primary)">state.json</text>

      <rect x="284" y="140" width="210" height="80" rx="6" fill="var(--pv-diagram-box-bg)" stroke="var(--pv-diagram-card-border)" />
      <text x="294" y="165" fontSize="13" fontWeight="700" fill="var(--pv-diagram-text-primary)">BSP container</text>
      <text x="294" y="184" fontSize="10.5" fill="var(--pv-diagram-text-muted)">kernel · bootloader ·</text>
      <text x="294" y="198" fontSize="10.5" fill="var(--pv-diagram-text-muted)">firmware, versioned</text>

      <rect x="506" y="140" width="210" height="80" rx="6" fill="var(--pv-diagram-box-bg)" stroke="var(--pv-diagram-card-border)" />
      <text x="516" y="165" fontSize="13" fontWeight="700" fill="var(--pv-diagram-text-primary)">App containers</text>
      <text x="516" y="184" fontSize="10.5" fill="var(--pv-diagram-text-muted)">LXC-first, ring-3,</text>
      <text x="516" y="198" fontSize="10.5" fill="var(--pv-diagram-text-muted)">update independently</text>

      <g fontSize="10.5" fill="var(--pv-diagram-text-primary)">
        <rect x="284" y="245" width="100" height="30" rx="4" fill="var(--pv-diagram-box-bg)" stroke="var(--pv-diagram-card-border)" />
        <text x="334" y="264" textAnchor="middle">watchdog</text>
        <rect x="394" y="245" width="100" height="30" rx="4" fill="var(--pv-diagram-box-bg)" stroke="var(--pv-diagram-card-border)" />
        <text x="444" y="264" textAnchor="middle">xconnect</text>
        <rect x="504" y="245" width="100" height="30" rx="4" fill="var(--pv-diagram-box-bg)" stroke="var(--pv-diagram-card-border)" />
        <text x="554" y="264" textAnchor="middle">ipam</text>
        <rect x="614" y="245" width="102" height="30" rx="4" fill="var(--pv-diagram-box-bg)" stroke="var(--pv-diagram-card-border)" />
        <text x="665" y="264" textAnchor="middle">local ctrl</text>
      </g>

      <text x="284" y="305" fontSize="11" fill="var(--pv-diagram-text-muted)" fontWeight="700">UPDATE &amp; ROLLBACK FLOW</text>
      <g fontSize="10.5" fill="var(--pv-diagram-text-primary)">
        <text x="284" y="330">New revision</text>
        <text x="284" y="343" fill="var(--pv-diagram-text-muted)" fontSize="9.5">changed objects only</text>
        <text x="386" y="330" fill="var(--pv-diagram-text-muted)">→</text>
        <text x="404" y="330">Pending slot</text>
        <text x="484" y="330" fill="var(--pv-diagram-text-muted)">→</text>
        <text x="502" y="330">Switch &amp; boot</text>
        <rect x="586" y="317" width="80" height="22" rx="4" fill="var(--pv-diagram-accent-bg)" stroke="var(--pv-diagram-accent-border)" />
        <text x="626" y="332" textAnchor="middle" fill="var(--pv-diagram-accent-text)" fontWeight="700">Health check</text>
        <text x="596" y="352" fontSize="9.5" fill="var(--pv-diagram-text-muted)">pass → stays</text>
        <text x="596" y="364" fontSize="9.5" fill="var(--pv-diagram-text-muted)">fail → auto-rollback ↩</text>
      </g>

      <line x1="740" y1="240" x2="800" y2="240" stroke="var(--pv-diagram-dashed-border)" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#pv-diagram-arrow)" />
      <text x="770" y="228" textAnchor="middle" fontSize="9.5" fill="var(--pv-diagram-text-muted)">optional</text>
      <rect x="800" y="190" width="160" height="100" rx="6" fill="var(--pv-diagram-box-bg)" stroke="var(--pv-diagram-dashed-border)" strokeDasharray="4 3" />
      <text x="880" y="216" textAnchor="middle" fontSize="11" fill="var(--pv-diagram-text-muted)">CLOUD (OPTIONAL)</text>
      <text x="880" y="238" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--pv-diagram-text-primary)">Pantahub</text>
      <text x="880" y="260" textAnchor="middle" fontSize="10" fill="var(--pv-diagram-text-muted)">fleet push, logs,</text>
      <text x="880" y="273" textAnchor="middle" fontSize="10" fill="var(--pv-diagram-text-muted)">device claim</text>
    </svg>
  );
}

export function StackSideBySideDiagram(): JSX.Element {
  return (
    <svg
      className="pv-diagram"
      viewBox="0 0 980 420"
      xmlns="http://www.w3.org/2000/svg"
      fontFamily="Helvetica, Arial, sans-serif"
      role="img"
      aria-label="Traditional vs Pantavisor stack diagram">
      <text x="230" y="30" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--pv-diagram-text-muted)">TRADITIONAL MONOLITHIC IMAGE</text>
      <g stroke="var(--pv-diagram-card-border)" fill="var(--pv-diagram-card-bg)">
        <rect x="60" y="50" width="340" height="60" rx="4" />
        <rect x="60" y="110" width="340" height="60" rx="4" />
        <rect x="60" y="170" width="340" height="60" rx="4" />
        <rect x="60" y="230" width="340" height="60" rx="4" />
        <rect x="60" y="290" width="340" height="50" rx="4" />
      </g>
      <g fontSize="13" fontWeight="700" fill="var(--pv-diagram-text-primary)">
        <text x="76" y="76">App A · App B · App C</text>
        <text x="76" y="136">Root filesystem</text>
        <text x="76" y="196">Kernel + drivers + firmware</text>
        <text x="76" y="256">Bootloader</text>
        <text x="76" y="320">Hardware</text>
      </g>
      <g fontSize="10" fill="var(--pv-diagram-text-muted)">
        <text x="76" y="92">installed into shared rootfs</text>
        <text x="76" y="152">userland, libs, package manager</text>
        <text x="76" y="212">baked into the same image</text>
        <text x="76" y="272">boots the single active image</text>
      </g>
      <text x="230" y="365" textAnchor="middle" fontSize="10" fill="var(--pv-diagram-text-muted)">One artifact — full rebuild/reflash for any change.</text>

      <text x="740" y="30" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--pv-diagram-accent-text)">PANTAVISOR-ENABLED DEVICE</text>
      <rect x="570" y="45" width="340" height="300" rx="10" fill="var(--pv-diagram-accent-bg)" stroke="var(--pv-diagram-accent-border)" strokeWidth="2" />

      <g stroke="var(--pv-diagram-card-border)" fill="var(--pv-diagram-box-bg)">
        <rect x="586" y="60" width="102" height="46" rx="4" />
        <rect x="694" y="60" width="102" height="46" rx="4" />
        <rect x="802" y="60" width="92" height="46" rx="4" />
      </g>
      <g fontSize="11.5" fontWeight="700" fill="var(--pv-diagram-text-primary)" textAnchor="middle">
        <text x="637" y="86">App A</text>
        <text x="745" y="86">App B</text>
        <text x="848" y="86">App C</text>
      </g>

      <rect x="586" y="118" width="308" height="50" rx="4" fill="var(--pv-diagram-box-bg)" stroke="var(--pv-diagram-card-border)" />
      <text x="596" y="140" fontSize="13" fontWeight="700" fill="var(--pv-diagram-text-primary)">BSP container</text>
      <text x="596" y="156" fontSize="9.5" fill="var(--pv-diagram-text-muted)">kernel, bootloader assets, firmware</text>

      <rect x="586" y="180" width="308" height="46" rx="4" fill="var(--pv-diagram-box-bg)" stroke="var(--pv-diagram-accent-border)" strokeWidth="1.5" />
      <text x="740" y="199" textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--pv-diagram-accent-text)">Pantavisor (PID 1)</text>
      <text x="740" y="215" textAnchor="middle" fontSize="9.5" fill="var(--pv-diagram-text-muted)">state.json · content-addressed objects</text>

      <rect x="586" y="238" width="308" height="46" rx="4" fill="var(--pv-diagram-box-bg)" stroke="var(--pv-diagram-card-border)" />
      <text x="596" y="257" fontSize="13" fontWeight="700" fill="var(--pv-diagram-text-primary)">Bootloader</text>
      <text x="596" y="273" fontSize="9.5" fill="var(--pv-diagram-text-muted)">verifies &amp; boots Pantavisor, then the revision</text>

      <rect x="586" y="296" width="308" height="38" rx="4" fill="var(--pv-diagram-box-bg)" stroke="var(--pv-diagram-card-border)" />
      <text x="596" y="320" fontSize="13" fontWeight="700" fill="var(--pv-diagram-text-primary)">Hardware</text>

      <text x="740" y="365" textAnchor="middle" fontSize="10" fill="var(--pv-diagram-text-muted)">Every layer versioned separately — ship only what changed, auto-rollback on failure.</text>
    </svg>
  );
}
