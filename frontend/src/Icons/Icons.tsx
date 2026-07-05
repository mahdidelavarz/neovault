import { SVGProps } from "react";

// NeoVault brand mark: a yellow vault/safe with the letter "V" on the door.
// Multicolor by design (does not follow currentColor). Flat fills are used
// instead of a gradient so the icon stays crisp at small sizes and avoids
// duplicate gradient-id collisions when rendered multiple times per page.
export function LucideVault(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="76 84 360 344"
      fill="none"
      {...props}
    >
      {/* Safe feet */}
      <g fill="#0f172a">
        <rect x="150" y="382" width="34" height="18" rx="5" />
        <rect x="328" y="382" width="34" height="18" rx="5" />
      </g>

      {/* Hinges on the left edge */}
      <g fill="#0f172a">
        <rect x="104" y="172" width="18" height="44" rx="5" />
        <rect x="104" y="300" width="18" height="44" rx="5" />
      </g>

      {/* Vault body */}
      <rect x="96" y="104" width="320" height="304" rx="46" fill="#FBBF24" />

      {/* Door handle on the right edge */}
      <rect x="398" y="214" width="22" height="84" rx="11" fill="#0f172a" />

      {/* Door panel outline */}
      <rect
        x="132"
        y="140"
        width="248"
        height="232"
        rx="30"
        fill="none"
        stroke="#0f172a"
        strokeWidth="9"
        strokeOpacity="0.85"
      />

      {/* Combination dial */}
      <circle cx="256" cy="190" r="27" fill="#0f172a" />
      <line
        x1="256"
        y1="172"
        x2="256"
        y2="182"
        stroke="#FBBF24"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* The "V" on the door */}
      <path
        d="M196 226 L256 334 L316 226"
        fill="none"
        stroke="#0f172a"
        strokeWidth="36"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bolt at the V vertex */}
      <circle cx="256" cy="334" r="13" fill="#FBBF24" />
    </svg>
  );
}
export function LucideUser(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </g>
    </svg>
  );
}
export function LucideLock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </g>
    </svg>
  );
}
export function LucideEyeOff(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575a1 1 0 0 1 0 .696a10.8 10.8 0 0 1-1.444 2.49m-6.41-.679a3 3 0 0 1-4.242-4.242" />
        <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 4.446-5.143M2 2l20 20" />
      </g>
    </svg>
  );
}
export function LucideEye(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M2.062 12.348a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 19.876 0a1 1 0 0 1 0 .696a10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" />
      </g>
    </svg>
  );
}
export function LucideLockKeyhole(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="12" cy="16" r="1" />
        <rect width="18" height="12" x="3" y="10" rx="2" />
        <path d="M7 10V7a5 5 0 0 1 10 0v3" />
      </g>
    </svg>
  );
}
export function LucideSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="m21 21l-4.34-4.34" />
        <circle cx="11" cy="11" r="8" />
      </g>
    </svg>
  );
}
export function LucideX(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18 6L6 18M6 6l12 12"
      />
    </svg>
  );
}
export function LucideMaximize2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 3h6v6m-11 5L21 3M9 21H3v-6m0 6L14 10"
      />
    </svg>
  );
}
export function LucideMinimize2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 14h6v6m11-11h-6V3M14 10l7-7M3 21l7-7"
      />
    </svg>
  );
}
export function LucideFolder(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      />
    </svg>
  );
}
export function LucideChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m6 9l6 6l6-6"
      />
    </svg>
  );
}
export function LucideStar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"
      />
    </svg>
  );
}
export function LucideSearchX(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="m13.5 8.5l-5 5m0-5l5 5" />
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21l-4.3-4.3" />
      </g>
    </svg>
  );
}
export function LucideLink2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 17H7A5 5 0 0 1 7 7h2m6 0h2a5 5 0 1 1 0 10h-2m-7-5h8"
      />
    </svg>
  );
}
export function LucideSunDim(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 4h.01M20 12h.01M12 20h.01M4 12h.01m13.647-5.657h.01m-.01 11.314h.01m-11.324 0h.01m-.01-11.314h.01" />
      </g>
    </svg>
  );
}
export function LucideMoon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      />
    </svg>
  );
}
export function LucideLogOut(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m16 17l5-5l-5-5m5 5H9m0 9H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
      />
    </svg>
  );
}
export function LucideChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m9 18l6-6l-6-6"
      />
    </svg>
  );
}
export function LucideChevronLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m15 18l-6-6l6-6"
      />
    </svg>
  );
}
export function LucideLayoutDashboard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </g>
    </svg>
  );
}
export function LucideFileText(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
        <path d="M14 2v5a1 1 0 0 0 1 1h5M10 9H8m8 4H8m8 4H8" />
      </g>
    </svg>
  );
}
export function LucideFileCode2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4M5 12l-3 3l3 3m4 0l3-3l-3-3" />
      </g>
    </svg>
  );
}
export function LucideMessageSquare(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"
      />
    </svg>
  );
}
export function LucideGlobe(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20M2 12h20" />
      </g>
    </svg>
  );
}
export function LucideServer(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
        <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
        <path d="M6 6h.01M6 18h.01" />
      </g>
    </svg>
  );
}
export function LucideTag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
      </g>
    </svg>
  );
}
export function LucideMail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
        <rect width="20" height="16" x="2" y="4" rx="2" />
      </g>
    </svg>
  );
}
export function LucidePhone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233a14 14 0 0 0 6.392 6.384"
      />
    </svg>
  );
}
export function LucideExternalLink(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
      />
    </svg>
  );
}
export function LucidePencil(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497zM15 5l4 4"
      />
    </svg>
  );
}
export function LucideTrash2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      />
    </svg>
  );
}
export function LucideType(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 4v16M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2M9 20h6"
      />
    </svg>
  );
}
export function LucideCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 6L9 17l-5-5"
      />
    </svg>
  );
}
export function LucideCircleCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12l2 2l4-4" />
      </g>
    </svg>
  );
}
export function LucideCircleX(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9l-6 6m0-6l6 6" />
      </g>
    </svg>
  );
}
export function LucideTriangleAlert(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4m0 4h.01"
      />
    </svg>
  );
}
export function LucideInfo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4m0-4h.01" />
      </g>
    </svg>
  );
}
export function SvgSpinnersRingResize(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g stroke="currentColor">
        <circle
          cx="12"
          cy="12"
          r="9.5"
          fill="none"
          strokeLinecap="round"
          strokeWidth="3"
        >
          <animate
            attributeName="strokeDasharray"
            calcMode="spline"
            dur="1.5s"
            keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
            keyTimes="0;0.475;0.95;1"
            repeatCount="indefinite"
            values="0 150;42 150;42 150;42 150"
          />
          <animate
            attributeName="strokeDashoffset"
            calcMode="spline"
            dur="1.5s"
            keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
            keyTimes="0;0.475;0.95;1"
            repeatCount="indefinite"
            values="0;-16;-59;-59"
          />
        </circle>
        <animateTransform
          attributeName="transform"
          dur="2s"
          repeatCount="indefinite"
          type="rotate"
          values="0 12 12;360 12 12"
        />
      </g>
    </svg>
  );
}
export function LucideCircleAlert(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4m0 4h.01" />
      </g>
    </svg>
  );
}
export function LucidePlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 12h14m-7-7v14"
      />
    </svg>
  );
}
export function LucidePin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4a1 1 0 0 1 1 1z"
      />
    </svg>
  );
}
export function LucideBold(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"
      />
    </svg>
  );
}
export function LucideItalic(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 4h-9m4 16H5M15 4L9 20"
      />
    </svg>
  );
}
export function LucideCodeXml(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m18 16l4-4l-4-4M6 8l-4 4l4 4m8.5-12l-5 16"
      />
    </svg>
  );
}
export function LucideHeading2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 12h8m-8 6V6m8 12V6m9 12h-4c0-4 4-3 4-6c0-1.5-2-2.5-4-1"
      />
    </svg>
  );
}
export function LucideList(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 5h.01M3 12h.01M3 19h.01M8 5h13M8 12h13M8 19h13"
      />
    </svg>
  );
}
export function LucideQuote(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1a6 6 0 0 0 6-6V5a2 2 0 0 0-2-2zM5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1a6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"
      />
    </svg>
  );
}
export function LucideSettings2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M14 17H5M19 7h-9" />
        <circle cx="17" cy="17" r="3" />
        <circle cx="7" cy="7" r="3" />
      </g>
    </svg>
  );
}
export function LucideArrowLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m12 19l-7-7l7-7m7 7H5"
      />
    </svg>
  );
}
export function LucideArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 12h14m-7-7l7 7l-7 7"
      />
    </svg>
  );
}
export function LucideKeyRound(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
      </g>
    </svg>
  );
}
export function LucideContainer(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z" />
        <path d="M10 21.9V14L2.1 9.1M10 14l11.9-6.9M14 19.8v-8.1m4 5.8V9.4" />
      </g>
    </svg>
  );
}
export function LucideRocket(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09" />
        <path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" />
      </g>
    </svg>
  );
}
export function LucideDatabase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14a9 3 0 0 0 18 0V5" />
        <path d="M3 12a9 3 0 0 0 18 0" />
      </g>
    </svg>
  );
}
export function LucideNetwork(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <rect width="6" height="6" x="16" y="16" rx="1" />
        <rect width="6" height="6" x="2" y="16" rx="1" />
        <rect width="6" height="6" x="9" y="2" rx="1" />
        <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3m-7-4V8" />
      </g>
    </svg>
  );
}
export function LucideSettings(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
        <circle cx="12" cy="12" r="3" />
      </g>
    </svg>
  );
}
export function LucideSlidersHorizontal(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 5H3m9 14H3M14 3v4m2 10v4m5-9h-9m9 7h-5m5-14h-7m-6 5v4m0-2H3"
      />
    </svg>
  );
}
export function LucideLayers(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
        <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
        <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
      </g>
    </svg>
  );
}
export function LucideChevronUp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m18 15l-6-6l-6 6"
      />
    </svg>
  );
}
export function LucideCopy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </g>
    </svg>
  );
}
export function LucideShield(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
      />
    </svg>
  );
}
export function LucideZap(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
      />
    </svg>
  );
}
export function LucideTerminal(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 19h8M4 17l6-6l-6-6"
      />
    </svg>
  );
}
export function LucideCpu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M12 20v2m0-20v2m5 16v2m0-20v2M2 12h2m-2 5h2M2 7h2m16 5h2m-2 5h2M20 7h2M7 20v2M7 2v2" />
        <rect width="16" height="16" x="4" y="4" rx="2" />
        <rect width="8" height="8" x="8" y="8" rx="1" />
      </g>
    </svg>
  );
}
export function LucideArrowRightLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m16 3l4 4l-4 4m4-4H4m4 14l-4-4l4-4m-4 4h16"
      />
    </svg>
  );
}
export function LucideRegex(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 3v10m-4.33-7.5l8.66 5m-8.66 0l8.66-5M9 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2z"
      />
    </svg>
  );
}
export function LucideBraces(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2a2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1m8 0h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"
      />
    </svg>
  );
}
export function LucideFolderOpen(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m6 14l1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"
      />
    </svg>
  );
}
export function LucideNotebookPen(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4M2 6h4m-4 4h4m-4 4h4m-4 4h4" />
        <path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
      </g>
    </svg>
  );
}
export function LucideHash(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 9h16M4 15h16M10 3L8 21m8-18l-2 18"
      />
    </svg>
  );
}
export function LucideClock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </g>
    </svg>
  );
}
export function LucideVariable(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 21s-4-3-4-9s4-9 4-9m8 0s4 3 4 9s-4 9-4 9M15 9l-6 6m0-6l6 6"
      />
    </svg>
  );
}
export function LucideBarChart3(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 3v18h18m-3-4V9m-5 8V5M8 17v-3"
      />
    </svg>
  );
}
export function LucideBot(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2m16 0h2m-7-1v2m-6-2v2" />
      </g>
    </svg>
  );
}
export function LucideBrain(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M12 18V5m3 8a4.17 4.17 0 0 1-3-4a4.17 4.17 0 0 1-3 4m8.598-6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
        <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
        <path d="M18 18a4 4 0 0 0 2-7.464" />
        <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
        <path d="M6 18a4 4 0 0 1-2-7.464" />
        <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
      </g>
    </svg>
  );
}
export function LucideSparkles(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594zM20 2v4m2-2h-4" />
        <circle cx="4" cy="20" r="2" />
      </g>
    </svg>
  );
}
export function LucideGem(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M10.5 3L8 9l4 13l4-13l-2.5-6" />
        <path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3zM2 9h20" />
      </g>
    </svg>
  );
}
export function LucideCommand(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
      />
    </svg>
  );
}
export function LucideFilter(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M22 3H2l8 9.46V19l4 2v-8.54z"
      />
    </svg>
  );
}
export function LucideKeyboard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M10 8h.01M12 12h.01M14 8h.01M16 12h.01M18 8h.01M6 8h.01M7 16h10m-9-4h.01" />
        <rect width="20" height="16" x="2" y="4" rx="2" />
      </g>
    </svg>
  );
}
export function SolarHome2Bold(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.52 7.823C2 8.77 2 9.915 2 12.203v1.522c0 3.9 0 5.851 1.172 7.063S6.229 22 10 22h4c3.771 0 5.657 0 6.828-1.212S22 17.626 22 13.725v-1.521c0-2.289 0-3.433-.52-4.381c-.518-.949-1.467-1.537-3.364-2.715l-2-1.241C14.111 2.622 13.108 2 12 2s-2.11.622-4.116 1.867l-2 1.241C3.987 6.286 3.038 6.874 2.519 7.823M11.25 18a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-1.5 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
export function SolarAddCircleBold(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10m.75-13a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}
export function SolarHamburgerMenuLinear(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M20 7H4m16 5H4m16 5H4"
      />
    </svg>
  );
}
export function SolarUserBold(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="6" r="4" fill="currentColor" />
      <path
        fill="currentColor"
        d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5"
      />
    </svg>
  );
}
export function SolarLinkMinimalisticBold(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M8 6.75a5.25 5.25 0 0 0 0 10.5h1a.75.75 0 0 1 0 1.5H8a6.75 6.75 0 0 1 0-13.5h1a.75.75 0 0 1 0 1.5z"
      />
      <path
        fill="currentColor"
        d="M8.25 12a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75"
      />
      <path
        fill="currentColor"
        d="M15 5.25a.75.75 0 0 0 0 1.5h1a5.25 5.25 0 1 1 0 10.5h-1a.75.75 0 0 0 0 1.5h1a6.75 6.75 0 0 0 0-13.5z"
      />
    </svg>
  );
}
export function SolarCodeFileBold(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="m19.352 7.617l-3.96-3.563c-1.127-1.015-1.69-1.523-2.383-1.788L13 5c0 2.357 0 3.536.732 4.268S15.643 10 18 10h3.58c-.362-.704-1.012-1.288-2.228-2.383"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M10 22h4c3.771 0 5.657 0 6.828-1.172S22 17.771 22 14v-.437c0-.873 0-1.529-.043-2.063h-4.052c-1.097 0-2.067 0-2.848-.105c-.847-.114-1.694-.375-2.385-1.066c-.692-.692-.953-1.539-1.067-2.386c-.105-.781-.105-1.75-.105-2.848l.01-2.834q0-.124.02-.244C11.121 2 10.636 2 10.03 2C6.239 2 4.343 2 3.172 3.172C2 4.343 2 6.229 2 10v4c0 3.771 0 5.657 1.172 6.828S6.229 22 10 22m.97-6.53a.75.75 0 0 1 1.06 0l1 1a.75.75 0 0 1 0 1.06l-1 1a.75.75 0 1 1-1.06-1.06l.47-.47l-.47-.47a.75.75 0 0 1 0-1.06m-.268-1.207a.75.75 0 1 0-1.404-.526l-1.5 4a.75.75 0 1 0 1.404.526zM7.53 13.47a.75.75 0 0 1 0 1.06l-.47.47l.47.47a.75.75 0 1 1-1.06 1.06l-1-1a.75.75 0 0 1 0-1.06l1-1a.75.75 0 0 1 1.06 0"
        clipRule="evenodd"
      />
    </svg>
  );
}
export function LucideUserCog(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M10 15H6a4 4 0 0 0-4 4v2m12.305-4.47l.923-.382m0-2.296l-.923-.383m2.547-1.241l-.383-.923m.383 6.467l-.383.924m2.679-6.468l.383-.923m-.001 7.391l-.382-.924m1.624-3.92l.924-.383m-.924 2.679l.924.383" />
        <circle cx="18" cy="15" r="3" />
        <circle cx="9" cy="7" r="4" />
      </g>
    </svg>
  );
}
export function SolarPaletteRoundBoldDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="currentColor" d="M7 18a1 1 0 1 1-2 0a1 1 0 0 1 2 0" />
      <path
        fill="currentColor"
        d="M10 6v12a4 4 0 0 1-8 0V6a4 4 0 1 1 8 0"
        opacity=".4"
      />
      <path
        fill="currentColor"
        d="m9.248 20.336l3.974-3.975l5.838-6.09a4.042 4.042 0 0 0-5.776-5.655L10 7.9V18c0 .872-.279 1.679-.752 2.336"
        opacity=".7"
      />
      <path
        fill="currentColor"
        d="m13.222 16.362l-3.974 3.974A4 4 0 0 1 6 22h11.9a4 4 0 1 0 0-8h-2.414z"
      />
    </svg>
  );
}
export function LucideCheckCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12l2 2l4-4" />
      </g>
    </svg>
  );
}
export function LucideDownload(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M12 15V3m9 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="m7 10l5 5l5-5" />
      </g>
    </svg>
  );
}
export function LucideRefreshCw(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M3 12a9 9 0 0 1 9-9a9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5m5 4a9 9 0 0 1-9 9a9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
      </g>
    </svg>
  );
}
export function LucideShare2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.59 13.51l6.83 3.98m-.01-10.98l-6.82 3.98" />
      </g>
    </svg>
  );
}
export function LucideBox(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7l8.7 5l8.7-5M12 22V12" />
      </g>
    </svg>
  );
}
export function LucideGripVertical(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="9" cy="12" r="1" />
        <circle cx="9" cy="5" r="1" />
        <circle cx="9" cy="19" r="1" />
        <circle cx="15" cy="12" r="1" />
        <circle cx="15" cy="5" r="1" />
        <circle cx="15" cy="19" r="1" />
      </g>
    </svg>
  );
}
export function LucideWifiOff(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 20h.01" />
      <path d="M8.5 16.429a5 5 0 0 1 7 0" />
      <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
      <path d="M19 12.859a10 10 0 0 0-2.007-1.523" />
      <path d="M2 8.82a15 15 0 0 1 4.177-2.643" />
      <path d="M22 8.82a15 15 0 0 0-11.288-3.764" />
      <path d="m2 2 20 20" />
    </svg>
  );
}
export function LucideArrowDownUp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m3 16l4 4l4-4m-4 4V4m14 4l-4-4l-4 4m4-4v16"
      />
    </svg>
  );
}
export function LucideLayoutGrid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </g>
    </svg>
  );
}
export function LucideClipboardCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <rect width="8" height="4" x="8" y="2" rx="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="m9 14 2 2 4-4" />
      </g>
    </svg>
  );
}

//----------------------------------------------------------------------bottom nav bar

export function SolarLinkMinimalisticBoldDuotone(
  props: SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M8 6.75a5.25 5.25 0 0 0 0 10.5h1a.75.75 0 0 1 0 1.5H8a6.75 6.75 0 0 1 0-13.5h1a.75.75 0 0 1 0 1.5zm7-1.5a.75.75 0 0 0 0 1.5h1a5.25 5.25 0 1 1 0 10.5h-1a.75.75 0 0 0 0 1.5h1a6.75 6.75 0 0 0 0-13.5z"
        opacity=".5"
      />
      <path
        fill="currentColor"
        d="M8.25 12a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75"
      />
    </svg>
  );
}

export function SolarCodeSquareLineDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          d="m15.5 9l.172.172c1.333 1.333 2 2 2 2.828s-.667 1.495-2 2.828L15.5 15m-2.206-7.83L12 12l-1.294 4.83M8.5 9l-.172.172c-1.333 1.333-2 2-2 2.828s.667 1.495 2 2.828L8.5 15"
        />
        <path
          d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z"
          opacity=".5"
        />
      </g>
    </svg>
  );
}

export function SolarWidgetLineDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          d="M2.5 6.5c0-1.886 0-2.828.586-3.414S4.614 2.5 6.5 2.5s2.828 0 3.414.586s.586 1.528.586 3.414s0 2.828-.586 3.414s-1.528.586-3.414.586s-2.828 0-3.414-.586S2.5 8.386 2.5 6.5Zm11 11c0-1.886 0-2.828.586-3.414s1.528-.586 3.414-.586s2.828 0 3.414.586s.586 1.528.586 3.414s0 2.828-.586 3.414s-1.528.586-3.414.586s-2.828 0-3.414-.586s-.586-1.528-.586-3.414Z"
          opacity=".5"
        />
        <path d="M2.5 17.5c0-1.886 0-2.828.586-3.414S4.614 13.5 6.5 13.5s2.828 0 3.414.586s.586 1.528.586 3.414s0 2.828-.586 3.414s-1.528.586-3.414.586s-2.828 0-3.414-.586S2.5 19.386 2.5 17.5Zm11-11c0-1.886 0-2.828.586-3.414S15.614 2.5 17.5 2.5s2.828 0 3.414.586s.586 1.528.586 3.414s0 2.828-.586 3.414s-1.528.586-3.414.586s-2.828 0-3.414-.586S13.5 8.386 13.5 6.5Z" />
      </g>
    </svg>
  );
}

export function HugeiconsCommandLine(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path d="M14 4h-4C6.229 4 4.343 4 3.172 5.172S2 8.229 2 12s0 5.657 1.172 6.828S6.229 20 10 20h4c3.771 0 5.657 0 6.828-1.172S22 15.771 22 12s0-5.657-1.172-6.828S17.771 4 14 4" />
        <path d="m7 9l1.84 1.586c.773.666 1.16 1 1.16 1.414s-.387.748-1.16 1.414L7 15m6 1h4" />
      </g>
    </svg>
  );
}

export function SolarNotesLineDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="m20.312 12.647l.517-1.932c.604-2.255.907-3.382.68-4.358a4 4 0 0 0-1.162-2.011c-.731-.685-1.859-.987-4.114-1.591c-2.255-.605-3.383-.907-4.358-.68a4 4 0 0 0-2.011 1.162c-.587.626-.893 1.543-1.348 3.209l-.244.905l-.517 1.932c-.605 2.255-.907 3.382-.68 4.358a4 4 0 0 0 1.162 2.011c.731.685 1.859.987 4.114 1.592c2.032.544 3.149.843 4.064.73q.15-.019.294-.052a4 4 0 0 0 2.011-1.16c.685-.732.987-1.86 1.592-4.115Z" />
        <path
          d="M16.415 17.974a4 4 0 0 1-1.068 1.678c-.731.685-1.859.987-4.114 1.591s-3.383.907-4.358.679a4 4 0 0 1-2.011-1.161c-.685-.731-.988-1.859-1.592-4.114l-.517-1.932c-.605-2.255-.907-3.383-.68-4.358a4 4 0 0 1 1.162-2.011c.731-.685 1.859-.987 4.114-1.592q.638-.172 1.165-.309"
          opacity=".5"
        />
        <path strokeLinecap="round" d="m11.777 10l4.83 1.294" />
        <path strokeLinecap="round" d="m11 12.898l2.898.776" opacity=".5" />
      </g>
    </svg>
  );
}

export function SolarRoundedMagniferLineDuotone(
  props: SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <defs>
        <mask id="SVGJtoKmeBk">
          <g fill="none" strokeWidth="1.5">
            <circle cx="11" cy="11" r="9" stroke="gray" />
            <path
              stroke="#fff"
              strokeLinecap="round"
              d="M21.812 20.975c-.063.095-.176.208-.403.434c-.226.227-.34.34-.434.403a1.13 1.13 0 0 1-1.62-.408c-.053-.1-.099-.254-.19-.561c-.101-.335-.151-.503-.161-.621a1.13 1.13 0 0 1 1.218-1.218c.118.01.285.06.621.16c.307.092.46.138.56.192a1.13 1.13 0 0 1 .409 1.619Z"
            />
          </g>
        </mask>
      </defs>
      <path fill="currentColor" d="M0 0h24v24H0z" mask="url(#SVGJtoKmeBk)" />
    </svg>
  );
}

export function SolarRoundedMagniferBoldDuotone(
  props: SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M20.128 11.143c0 5.05-4.058 9.143-9.064 9.143S2 16.192 2 11.143S6.058 2 11.064 2s9.064 4.093 9.064 9.143"
        opacity=".5"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M17.82 19.7c-.09-1.094.816-2.008 1.9-1.918c.189.016.414.085.643.154l.067.02l.06.018c.21.064.42.127.58.213a1.786 1.786 0 0 1 .637 2.549c-.1.152-.255.308-.41.464l-.045.045l-.044.045c-.155.157-.31.313-.46.414a1.754 1.754 0 0 1-2.527-.643c-.086-.161-.148-.373-.211-.585l-.018-.06l-.02-.068c-.07-.231-.137-.458-.152-.648"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function SolarRoundedMagniferOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M11 2.75a8.25 8.25 0 1 0 0 16.5a8.25 8.25 0 0 0 0-16.5M1.25 11c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S1.25 16.385 1.25 11m18.908 8.751a.38.38 0 0 0-.407.407c0 .001.004.027.024.1c.022.084.056.197.108.37c.047.158.078.26.103.336c.026.078.035.093.031.086a.38.38 0 0 0 .544.137c-.007.004.008-.005.067-.06c.059-.056.134-.131.251-.248s.192-.192.247-.25c.047-.05.06-.069.062-.07a.38.38 0 0 0-.137-.541c-.001 0-.022-.01-.087-.032a13 13 0 0 0-.336-.103a15 15 0 0 0-.37-.108a1 1 0 0 0-.1-.024m-1.902.532a1.88 1.88 0 0 1 2.027-2.027c.2.017.442.09.703.168l.072.022l.065.02c.24.07.465.138.635.229a1.88 1.88 0 0 1 .68 2.694c-.107.16-.273.326-.45.503l-.048.048l-.048.048c-.177.177-.343.343-.503.45a1.88 1.88 0 0 1-2.694-.68c-.091-.17-.158-.395-.23-.635l-.02-.065l-.02-.072c-.08-.26-.152-.503-.169-.703"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function SolarFolderWithFilesOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6.86 1.25h.127c.351 0 .577 0 .798.02a4.75 4.75 0 0 1 2.474.98h6.299c.409 0 .687 0 .931.032a3.75 3.75 0 0 1 3.248 3.427a3 3 0 0 1 .77.503q.15.133.281.28c.529.588.754 1.303.86 2.144c.102.812.102 1.838.102 3.111v2.31c0 1.837 0 3.293-.153 4.432c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.944c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433V6.86c0-.797 0-1.303.082-1.74A4.75 4.75 0 0 1 5.12 1.331c.438-.082.944-.082 1.74-.082m12.287 4.078a2.25 2.25 0 0 0-1.853-1.559c-.134-.017-.306-.019-.794-.019h-4.689c.643.64.935.906 1.266 1.09q.328.182.689.286c.413.117.866.124 2.062.124h.425c1.162 0 2.119 0 2.894.078M6.95 2.75c-.917 0-1.271.003-1.553.056a3.25 3.25 0 0 0-2.59 2.591c-.054.282-.057.636-.057 1.553V14c0 1.907.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008s1.003.677 2.009.812c1.028.138 2.382.14 4.289.14h4c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812s.677-1.003.812-2.009c.138-1.027.14-2.382.14-4.289v-2.202c0-1.336-.001-2.267-.09-2.975c-.087-.689-.246-1.06-.487-1.328a2 2 0 0 0-.168-.168c-.268-.241-.64-.4-1.328-.487c-.707-.089-1.639-.09-2.975-.09h-.484c-1.048 0-1.724 0-2.363-.182c-.35-.1-.689-.24-1.008-.417c-.58-.324-1.058-.801-1.8-1.543l-.077-.078l-.55-.55a8 8 0 0 0-.503-.482a3.25 3.25 0 0 0-1.771-.734a8 8 0 0 0-.696-.014m5.3 7.25a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function FluentPrompt16Regular(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        d="M14 1.5a.5.5 0 0 0-1 0V2h-.5a.5.5 0 0 0 0 1h.5v.5a.5.5 0 0 0 1 0V3h.5a.5.5 0 0 0 0-1H14zm-8.61.63a.2.2 0 0 1 .06-.104C5.474 2.002 5.493 2 5.5 2s.026.002.052.026a.2.2 0 0 1 .059.104a4.2 4.2 0 0 0 1.135 2.124A4.2 4.2 0 0 0 8.87 5.39a.2.2 0 0 1 .104.059c.024.025.026.044.026.051s-.002.026-.026.052a.2.2 0 0 1-.104.058a4.2 4.2 0 0 0-2.124 1.137A4.2 4.2 0 0 0 5.611 8.87a.2.2 0 0 1-.059.104c-.026.024-.044.026-.051.026c-.008 0-.026-.002-.052-.026a.2.2 0 0 1-.058-.104a4.2 4.2 0 0 0-1.137-2.124A4.2 4.2 0 0 0 2.13 5.61a.2.2 0 0 1-.103-.059C2.003 5.526 2 5.507 2 5.501c0-.008.002-.026.026-.052a.2.2 0 0 1 .104-.059a4.2 4.2 0 0 0 2.123-1.136A4.2 4.2 0 0 0 5.391 2.13M5.5 1c-.576 0-.99.453-1.088.926a3.2 3.2 0 0 1-.865 1.62a3.2 3.2 0 0 1-1.62.865c-.473.098-.927.513-.926 1.091c.001.576.454.989.926 1.087c.426.088 1.067.31 1.62.864s.776 1.195.865 1.621c.098.473.512.926 1.089.926s.99-.454 1.089-.927c.088-.425.31-1.066.864-1.62a3.2 3.2 0 0 1 1.62-.864C9.547 6.491 10 6.077 10 5.5s-.453-.99-.926-1.09a3.2 3.2 0 0 1-1.62-.863a3.2 3.2 0 0 1-.864-1.62C6.49 1.452 6.078 1 5.5 1m5.44 4a2.1 2.1 0 0 1 0 1h.56A1.5 1.5 0 0 1 13 7.5v4a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 6 11.5v-.56a2.1 2.1 0 0 1-1 0v.56A2.5 2.5 0 0 0 7.5 14h4a2.5 2.5 0 0 0 2.5-2.5v-4A2.5 2.5 0 0 0 11.5 5zM8 8.5a.5.5 0 0 1 .5-.5H11a.5.5 0 0 1 0 1H8.5a.5.5 0 0 1-.5-.5m.5 1.5a.5.5 0 0 0 0 1H10a.5.5 0 0 0 0-1zm-6 2a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 0 1H3v.5a.5.5 0 0 1-1 0V14h-.5a.5.5 0 0 1 0-1H2v-.5a.5.5 0 0 1 .5-.5"
      />
    </svg>
  );
}
export function SolarGlobalLinear(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12a10 10 0 1 1-20.001 0A10 10 0 0 1 22 12Z" />
        <path d="M16 12c0 1.313-.104 2.614-.305 3.827c-.2 1.213-.495 2.315-.867 3.244c-.371.929-.812 1.665-1.297 2.168c-.486.502-1.006.761-1.531.761s-1.045-.259-1.53-.761c-.486-.503-.927-1.24-1.298-2.168c-.372-.929-.667-2.03-.868-3.244A23.6 23.6 0 0 1 8 12c0-1.313.103-2.614.304-3.827s.496-2.315.868-3.244c.371-.929.812-1.665 1.297-2.168C10.955 2.26 11.475 2 12 2s1.045.259 1.53.761c.486.503.927 1.24 1.298 2.168c.372.929.667 2.03.867 3.244C15.897 9.386 16 10.687 16 12Z" />
        <path strokeLinecap="round" d="M2 12h20" />
      </g>
    </svg>
  );
}

export function SolarServerSquareCloudLinear(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none">
        <path
          fill="currentColor"
          d="M13 21.75a.75.75 0 0 0 0-1.5zm-9.828-1.922l.53-.53zM20.828 4.172l-.53.53zM21.25 13a.75.75 0 0 0 1.5 0zM10 3.75h4v-1.5h-4zM2.75 13v-1h-1.5v1zm0-1v-1h-1.5v1zM13 20.25h-3v1.5h3zM21.25 11v1h1.5v-1zm-20 2c0 1.864-.002 3.338.153 4.489c.158 1.172.49 2.121 1.238 2.87l1.06-1.06c-.422-.424-.676-1.004-.811-2.01c-.138-1.027-.14-2.382-.14-4.289zM10 20.25c-1.907 0-3.261-.002-4.29-.14c-1.005-.135-1.585-.389-2.008-.812l-1.06 1.06c.748.75 1.697 1.081 2.869 1.239c1.15.155 2.625.153 4.489.153zm4-16.5c1.907 0 3.262.002 4.29.14c1.005.135 1.585.389 2.008.812l1.06-1.06c-.748-.75-1.697-1.081-2.869-1.239c-1.15-.155-2.625-.153-4.489-.153zM22.75 11c0-1.864.002-3.338-.153-4.489c-.158-1.172-.49-2.121-1.238-2.87l-1.06 1.06c.422.424.676 1.004.811 2.01c.138 1.028.14 2.382.14 4.289zM10 2.25c-1.864 0-3.338-.002-4.489.153c-1.172.158-2.121.49-2.87 1.238l1.06 1.06c.424-.422 1.004-.676 2.01-.811c1.028-.138 2.382-.14 4.289-.14zM2.75 11c0-1.907.002-3.261.14-4.29c.135-1.005.389-1.585.812-2.008l-1.06-1.06c-.75.748-1.081 1.697-1.239 2.869C1.248 7.661 1.25 9.136 1.25 11zM2 12.75h20v-1.5H2zM21.25 12v1h1.5v-1z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
          d="M13.5 7.5H18m-12 10v-2m0-7v-2m3 11v-2m0-7v-2m10.333 10.385a1.9 1.9 0 0 1 1.321-.004m-3.863.972a1.4 1.4 0 0 0-.291-.03c-.828 0-1.5.712-1.5 1.589S15.672 21 16.5 21H20c1.105 0 2-.948 2-2.118c0-.927-.562-1.714-1.346-2.001m-3.863.972a2.2 2.2 0 0 1-.124-.735c0-1.17.895-2.118 2-2.118c1.029 0 1.876.823 1.987 1.88m-3.863.973c.197.041.38.123.542.238"
        />
      </g>
    </svg>
  );
}
export function SolarFolderFavouriteBookmarkLinear(
  props: SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 6v4.853c0 .29 0 .435-.095.494s-.224-.007-.484-.136l-1.242-.622c-.088-.043-.132-.065-.179-.065s-.091.022-.179.065l-1.242.622c-.26.13-.39.194-.484.136c-.095-.06-.095-.204-.095-.494V6" />
        <path d="M2 6.95c0-.883 0-1.324.07-1.692A4 4 0 0 1 5.257 2.07C5.626 2 6.068 2 6.95 2c.386 0 .58 0 .766.017a4 4 0 0 1 2.18.904c.144.119.28.255.554.529L11 4c.816.816 1.224 1.224 1.712 1.495a4 4 0 0 0 .848.352C14.098 6 14.675 6 15.828 6h.374c2.632 0 3.949 0 4.804.77q.119.105.224.224c.77.855.77 2.172.77 4.804V14c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z" />
      </g>
    </svg>
  );
}
export function SolarTagLineDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4.728 16.137c-1.545-1.546-2.318-2.318-2.605-3.321c-.288-1.003-.042-2.068.45-4.197l.283-1.228c.413-1.792.62-2.688 1.233-3.302s1.51-.82 3.302-1.233l1.228-.284c2.13-.491 3.194-.737 4.197-.45c1.003.288 1.775 1.061 3.32 2.606l1.83 1.83C20.657 9.248 22 10.592 22 12.262c0 1.671-1.344 3.015-4.033 5.704c-2.69 2.69-4.034 4.034-5.705 4.034c-1.67 0-3.015-1.344-5.704-4.033z" />
        <circle
          cx="8.607"
          cy="8.879"
          r="2"
          opacity=".5"
          transform="rotate(-45 8.607 8.879)"
        />
        <path strokeLinecap="round" d="m11.542 18.5l6.979-6.98" opacity=".5" />
      </g>
    </svg>
  );
}
export function SolarShieldBoldDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M3 11.991c0 5.638 4.239 8.375 6.899 9.536c.721.315 1.082.473 2.101.473V8l-9 3z"
      />
      <path
        fill="currentColor"
        d="M14.101 21.527C16.761 20.365 21 17.63 21 11.991V11l-9-3v14c1.02 0 1.38-.158 2.101-.473M8.838 2.805L8.265 3c-3.007 1.03-4.51 1.545-4.887 2.082C3 5.62 3 7.22 3 10.417V11l9-3V2c-.811 0-1.595.268-3.162.805"
        opacity=".5"
      />
      <path
        fill="currentColor"
        d="m15.735 3l-.573-.195C13.595 2.268 12.812 2 12 2v6l9 3v-.583c0-3.198 0-4.797-.378-5.335c-.377-.537-1.88-1.052-4.887-2.081"
      />
    </svg>
  );
}
export function SolarFileLinear(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M12.25 2.834c-.46-.078-1.088-.084-2.22-.084c-1.917 0-3.28.002-4.312.14c-1.012.135-1.593.39-2.016.812s-.677 1.003-.812 2.009c-.138 1.028-.14 2.382-.14 4.29v4c0 1.906.002 3.26.14 4.288c.135 1.006.389 1.586.812 2.01c.423.422 1.003.676 2.009.811c1.028.139 2.382.14 4.289.14h4c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812s.677-1.003.812-2.009c.138-1.027.14-2.382.14-4.289v-.437c0-1.536-.01-2.264-.174-2.813h-3.13c-1.133 0-2.058 0-2.79-.098c-.763-.103-1.425-.325-1.954-.854s-.751-1.19-.854-1.955c-.098-.73-.098-1.656-.098-2.79zm1.5.776V5c0 1.2.002 2.024.085 2.643c.08.598.224.891.428 1.094s.496.348 1.094.428c.619.083 1.443.085 2.643.085h2.02a46 46 0 0 0-1.17-1.076l-3.959-3.563A37 37 0 0 0 13.75 3.61m-3.575-2.36c1.385 0 2.28 0 3.103.315c.823.316 1.485.912 2.51 1.835l.107.096l3.958 3.563l.125.112c1.184 1.065 1.95 1.754 2.361 2.678s.412 1.954.411 3.546v.661c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.944c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433V9.945c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.75-.749 1.701-1.08 2.878-1.238c1.144-.153 2.607-.153 4.455-.153h.202" />
        <path d="M9.013 12.953a.75.75 0 0 0-1.026 0l-2 1.875a.75.75 0 1 0 1.026 1.094l.737-.69V18.5a.75.75 0 0 0 1.5 0v-3.269l.737.691a.75.75 0 0 0 1.026-1.094z" />
      </g>
    </svg>
  );
}

export function SolarFileBold(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M12.25 2.834c-.46-.078-1.088-.084-2.22-.084c-1.917 0-3.28.002-4.312.14c-1.012.135-1.593.39-2.016.812s-.677 1.003-.812 2.009c-.138 1.028-.14 2.382-.14 4.29v4c0 1.906.002 3.26.14 4.288c.135 1.006.389 1.586.812 2.01c.423.422 1.003.676 2.009.811c1.028.139 2.382.14 4.289.14h4c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812s.677-1.003.812-2.009c.138-1.027.14-2.382.14-4.289v-.437c0-1.536-.01-2.264-.174-2.813h-3.13c-1.133 0-2.058 0-2.79-.098c-.763-.103-1.425-.325-1.954-.854s-.751-1.19-.854-1.955c-.098-.73-.098-1.656-.098-2.79zm1.5.776V5c0 1.2.002 2.024.085 2.643c.08.598.224.891.428 1.094s.496.348 1.094.428c.619.083 1.443.085 2.643.085h2.02a46 46 0 0 0-1.17-1.076l-3.959-3.563A37 37 0 0 0 13.75 3.61m-3.575-2.36c1.385 0 2.28 0 3.103.315c.823.316 1.485.912 2.51 1.835l.107.096l3.958 3.563l.125.112c1.184 1.065 1.95 1.754 2.361 2.678s.412 1.954.411 3.546v.661c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.944c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433V9.945c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.75-.749 1.701-1.08 2.878-1.238c1.144-.153 2.607-.153 4.455-.153h.202" />
        <path d="M9.013 12.953a.75.75 0 0 0-1.026 0l-2 1.875a.75.75 0 1 0 1.026 1.094l.737-.69V18.5a.75.75 0 0 0 1.5 0v-3.269l.737.691a.75.75 0 0 0 1.026-1.094z" />
      </g>
    </svg>
  );
}
export function LucideUpload(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" x2="12" y1="3" y2="15" />
      </g>
    </svg>
  );
}
export function LucideFolderPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M12 10v6m-3-3h6" />
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </g>
    </svg>
  );
}
export function LucideImage(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </g>
    </svg>
  );
}
export function LucideMusic(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </g>
    </svg>
  );
}
export function LucideFilm(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M7 3v18M17 3v18M3 7h4m10 0h4M3 12h18M3 17h4m10 0h4" />
      </g>
    </svg>
  );
}
export function LucideRadio(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M4.9 4.9A10 10 0 1 0 19.1 19.1" />
        <path d="M7.76 7.76a6 6 0 1 0 8.49 8.49" />
        <circle cx="12" cy="12" r="2" />
        <path d="M21.17 2.83 12 12" />
      </g>
    </svg>
  );
}
export function LucidePanelLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
      </g>
    </svg>
  );
}
export function LucideMoreHorizontal(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="currentColor">
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </g>
    </svg>
  );
}
export function LucideClock3(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16.5 12" />
      </g>
    </svg>
  );
}
export function LucideSend(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="m22 2-7 20-4-9-9-4z" />
        <path d="M22 2 11 13" />
      </g>
    </svg>
  );
}
export function LucideInbox(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11 2 12v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </g>
    </svg>
  );
}
export function LucideSave(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </g>
    </svg>
  );
}
export function LucideBookmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"
      />
    </svg>
  );
}
export function LucideBookmarkPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        <path d="M12 7v6m-3-3h6" />
      </g>
    </svg>
  );
}
export function LucideShieldCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </g>
    </svg>
  );
}
export function LucideShieldAlert(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="M12 8v4m0 4h.01" />
      </g>
    </svg>
  );
}
export function LucideTimer(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M10 2h4" />
        <path d="M12 14v-4" />
        <path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6" />
        <path d="M9 17H4v5" />
      </g>
    </svg>
  );
}
export function LucideHardDrive(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M2 12h20" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        <circle cx="6" cy="16" r=".5" fill="currentColor" />
        <circle cx="10" cy="16" r=".5" fill="currentColor" />
      </g>
    </svg>
  );
}
export function LucideCode(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="m16 18 6-6-6-6" />
        <path d="m8 6-6 6 6 6" />
      </g>
    </svg>
  );
}
export function LucideCode2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
      </g>
    </svg>
  );
}
export function LucideGitBranch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <line x1="6" y1="3" x2="6" y2="15" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 9a9 9 0 0 1-9 9" />
      </g>
    </svg>
  );
}
export function LucideWrapText(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M3 12h15a3 3 0 1 1 0 6h-4" />
        <polyline points="16 16 14 18 16 20" />
        <line x1="3" y1="18" x2="10" y2="18" />
      </g>
    </svg>
  );
}
export function SolarChatLineDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" opacity=".5" strokeLinejoin="round"/>
        <path d="M8 10h8M8 14h5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}
export function SolarBarChartLineDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 21h18" opacity=".5"/>
        <path d="M5 21v-8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8" opacity=".5"/>
        <path d="M10 21V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v14"/>
        <path d="M15 21v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" opacity=".5"/>
      </g>
    </svg>
  );
}
export function SolarBoltLineDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 3L3 14h9l-2 8 11-11.5h-9L13 3z" opacity=".5"/>
        <path d="M13 3L3 14h9"/>
      </g>
    </svg>
  );
}
export function SolarClockCircleLineDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" opacity=".5"/>
        <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}
export function SolarSparklesLineDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 3v4M22 5h-4" strokeLinecap="round" opacity=".5"/>
        <path d="M4 17v2M5 18H3" strokeLinecap="round" opacity=".5"/>
      </g>
    </svg>
  );
}
export function SolarClipboardCheckLineDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" opacity=".5"/>
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" opacity=".5"/>
        <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}
export function SolarChatLineOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="currentColor" fillRule="evenodd" d="M10.46 1.25h3.08c1.603 0 2.86 0 3.864.095c1.023.098 1.861.3 2.6.752a5.75 5.75 0 0 1 1.899 1.899c.452.738.654 1.577.752 2.6c.095 1.004.095 2.261.095 3.865v1.067c0 1.141 0 2.036-.05 2.759c-.05.735-.153 1.347-.388 1.913a5.75 5.75 0 0 1-3.112 3.112c-.805.334-1.721.408-2.977.43a11 11 0 0 0-.929.036c-.198.022-.275.054-.32.08c-.047.028-.112.078-.224.232c-.121.166-.258.396-.476.764l-.542.916c-.773 1.307-2.69 1.307-3.464 0l-.542-.916a11 11 0 0 0-.476-.764c-.112-.154-.177-.204-.224-.232c-.045-.026-.122-.058-.32-.08c-.212-.023-.49-.03-.93-.037c-1.255-.021-2.171-.095-2.976-.429A5.75 5.75 0 0 1 1.688 16.2c-.235-.566-.338-1.178-.389-1.913c-.049-.723-.049-1.618-.049-2.76v-1.066c0-1.604 0-2.86.095-3.865c.098-1.023.3-1.862.752-2.6a5.75 5.75 0 0 1 1.899-1.899c.738-.452 1.577-.654 2.6-.752C7.6 1.25 8.857 1.25 10.461 1.25M6.739 2.839c-.914.087-1.495.253-1.959.537A4.25 4.25 0 0 0 3.376 4.78c-.284.464-.45 1.045-.537 1.96c-.088.924-.089 2.11-.089 3.761v1c0 1.175 0 2.019.046 2.685c.045.659.131 1.089.278 1.441a4.25 4.25 0 0 0 2.3 2.3c.515.214 1.173.294 2.429.316h.031c.398.007.747.013 1.037.045c.311.035.616.104.909.274c.29.17.5.395.682.645c.169.232.342.525.538.856l.559.944a.52.52 0 0 0 .882 0l.559-.944c.196-.331.37-.624.538-.856c.182-.25.392-.476.682-.645c.293-.17.598-.24.909-.274c.29-.032.639-.038 1.037-.045h.032c1.255-.022 1.913-.102 2.428-.316a4.25 4.25 0 0 0 2.3-2.3c.147-.352.233-.782.278-1.441c.046-.666.046-1.51.046-2.685v-1c0-1.651 0-2.837-.089-3.762c-.087-.914-.253-1.495-.537-1.959a4.25 4.25 0 0 0-1.403-1.403c-.464-.284-1.045-.45-1.96-.537c-.924-.088-2.11-.089-3.761-.089h-3c-1.651 0-2.837 0-3.762.089M7.25 9A.75.75 0 0 1 8 8.25h8a.75.75 0 0 1 0 1.5H8A.75.75 0 0 1 7.25 9m0 3.5a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75" clipRule="evenodd"/>
    </svg>
  );
}