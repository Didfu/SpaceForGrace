import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" passHref>
          <span className="text-2xl font-bold cursor-pointer">Space For Grace</span>
        </Link>
        <div className="flex space-x-4">
          <Link href="/about" passHref>
            <span className="text-lg text-gray-700 hover:text-gray-900 cursor-pointer">About</span>
          </Link>
          <Link href="/contact" passHref>
            <span className="text-lg text-gray-700 hover:text-gray-900 cursor-pointer">Contact</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}