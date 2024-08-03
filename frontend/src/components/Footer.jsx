import { Link } from "react-router-dom"
import ThemeController from "./ThemeController"

export default function Component() {
  return (
    <footer className="bg-black py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col items-start gap-4">
          <Link to='/' className="flex items-center gap-2">
            <CakeIcon className="w-8 h-8 text-[#C13584]" />
            <span className="text-lg font-bold text-[#666]">Flour & Frosting</span>
          </Link>
          <p className="text-[#666666] text-sm">
            La vostra amichevole panetteria di quartiere.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-lg font-bold text-[#666]">Follow Us</h3>
          <nav className="flex items-center gap-4">
            <Link href='https://www.facebook.com/p/Panetteria-Il-Forno-100063551380121/' className="text-[#666666] hover:text-[#FF6B6B]">
              <FacebookIcon className="w-6 h-6" />
            </Link>
            <Link href="https://www.instagram.com/panetteriailforno/" className="text-[#666666] hover:text-[#FF6B6B]">
              <InstagramIcon className="w-6 h-6" />
            </Link>
            <Link to='/' className="text-[#666666] hover:text-[#FF6B6B]">
              <TwitterIcon className="w-6 h-6" />
            </Link>
            <ThemeController />
          </nav>
        </div>
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-lg font-bold text-[#666]">Quick Links</h3>
          <nav className="flex flex-col items-start gap-2">
            <Link to='/' className="text-[#666666] hover:text-[#eee]">
              Home
            </Link>
            <Link to='/products' className="text-[#666666] hover:text-[#eee]">
              Products
            </Link>
          </nav>
        </div>
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-lg font-bold text-[#666]">Contact</h3>
          <address className="not-italic text-[#666666] text-sm">
          Via Cavour 2
            <br />
            10046 Poirino TO
            <br />
            011 945 0228
          </address>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-between">
        <p className="text-[#666666] text-sm">&copy; 2024 Il Forno di Agostini. All rights reserved.</p>
        <p className="text-[#666666] text-sm mt-4 md:mt-0">
          Designed by{" "}
          <Link to='/' className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-violet-600 to-purple-900 underline">
            Vincenzo Perretta
          </Link>
        </p>
      </div>
    </footer>
  )
}

function CakeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C13584"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
      <path d="M2 21h20" />
      <path d="M7 8v3" />
      <path d="M12 8v3" />
      <path d="M17 8v3" />
      <path d="M7 4h0.01" />
      <path d="M12 4h0.01" />
      <path d="M17 4h0.01" />
    </svg>
  )
}


function FacebookIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4267B2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}


function InstagramIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C13584"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}


function TwitterIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1DA1F2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}


function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}