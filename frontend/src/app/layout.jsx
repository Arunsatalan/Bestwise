import './globals.css';
import ReduxProvider from './ReduxProvider';
<<<<<<< HEAD
import { Toaster } from 'react-hot-toast';
=======
import { Toaster } from 'sonner';
>>>>>>> b72d6a6e57ab8402290872919715d1d3ec70ee5a

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
<<<<<<< HEAD
          <Toaster position="top-center" />
=======
          <Toaster position="top-center" richColors />
>>>>>>> b72d6a6e57ab8402290872919715d1d3ec70ee5a
        </ReduxProvider>
      </body>
    </html>
  );
}
