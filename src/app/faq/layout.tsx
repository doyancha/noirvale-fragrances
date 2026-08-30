import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | NOIRVALE',
  description:
    'Frequently asked questions about NOIRVALE ordering, delivery, COD, returns, and fragrance care.',
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}