// app/layout.js

import { GeistSans } from 'geist/font/sans';
import './globals.css';
import LayoutWrapper from './LayoutWrapper';

export const metadata = {
  title: 'MDI-Connect Recruitment Web Application',
  description: 'Employee leave management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body suppressHydrationWarning className="bg-gray-50">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}