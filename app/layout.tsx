import './globals.css';
import Navigation from '../components/Navigation';
import { AuthProvider } from '../components/AuthProvider';


export const metadata = {
  title: 'Book Explorer - World of Books',
  description: 'Explore real books and products from World of Books',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
         <AuthProvider>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 Book Explorer. All data sourced from World of Books.</p>
          </div>
        </footer>
         </AuthProvider>
      </body>
    </html>
  );
}