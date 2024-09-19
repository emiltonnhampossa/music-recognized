import { Metadata } from 'next';
import Sidebar from '../components/Sidebar';

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
  };
  
  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <html lang="en">
        <body className="bg-gray-900 text-white">
          <div className="flex">
            {/* Sidebar */}
  
            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>
          </div>
        </body>
      </html>
    );
  }
