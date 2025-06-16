import './globals.css';
import ReduxProvider from './ReduxProvider';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Best Wishes',
  description: 'Make your loved ones happy',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReduxProvider>
          {children}
          <Toaster position="top-center" />
        </ReduxProvider>
      </body>
    </html>
  );
}
