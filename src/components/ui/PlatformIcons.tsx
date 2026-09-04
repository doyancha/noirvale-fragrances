import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function IconShell(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M14.5 4.5h2.7V1.8h-3c-2.9 0-4.8 2-4.8 5.2V10H7v3h2.4v9h3.3v-9h2.9l.4-3H12.7V7.4c0-1.7.8-2.9 1.8-2.9Z" fill="currentColor" stroke="none" />
    </IconShell>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="4.5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </IconShell>
  );
}

export function PinterestIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M12 6.7c-1.9 0-3.3 1.5-3.3 3.6 0 1.5.8 2.6 2 2.6.6 0 1.1-.3 1.3-.8l.2-.6c.2-.5.3-1 .3-1.4 0-.7-.4-1.2-1-1.2-.8 0-1.4.8-1.4 2 0 1 .4 1.9 1 2.5l-.7 3c-.1.5.1.8.6.8.8 0 1.6-.8 2.1-2.5l.5-1.8c.6.4 1.2.6 2 .6 2.6 0 4.7-2.2 4.7-5 0-2.7-2.1-4.8-5.1-4.8-3.4 0-5.8 2.4-5.8 5.6 0 1.4.5 2.5 1.2 3.3" />
    </IconShell>
  );
}
