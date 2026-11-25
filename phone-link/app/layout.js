import './globals.css';

export const metadata = {
  title: 'Phone Link',
  description: 'Share a phone number through a private link.',
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
