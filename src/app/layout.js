// app/layout.js
import './globals.css';
import LayoutWrapper from './LayoutWrapper';

export const metadata = {
  title: 'TalentLink - Recruitment Platform',
  description: 'Connecting skilled professionals with opportunities in Mining, Tourism, and Manufacturing',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={``}>
      <body suppressHydrationWarning className="bg-gray-50">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}