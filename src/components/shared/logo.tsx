import type { SVGProps } from 'react';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 text-primary" // Adjusted size
      {...props}
    >
      <path d="M8 20V10.2c0-1.2.6-2.3 1.7-2.9l5-2.9c.7-.4 1.6-.4 2.3 0l5 2.9c1.1.6 1.7 1.7 1.7 2.9V20" />
      <path d="M4.7 19.3A2 2 0 0 0 6.1 21H8" />
      <path d="M12 13L7 10" />
      <path d="M12 13l5 3" />
      <path d="M12 13v9" />
      <path d="M17 22v-7" />
      <path d="M7 22v-7" />
      <path d="M2 10l5-3" />
      <path d="M22 10l-5-3" />
      <path d="M7 10l5-3" />
      <path d="M17 10l-5-3" />
      <circle cx="12" cy="5" r="2" />
    </svg>
  );
}
