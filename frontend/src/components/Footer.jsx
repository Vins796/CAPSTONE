import { Link } from "react-router-dom"
import ThemeController from "./ThemeController"

export default function Component() {
  return (
    <footer className="bg-[#0f0f0f] py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* <div className="flex flex-col items-start gap-4">
          <Link to='/' className="flex items-center gap-2">
            <CakeIcon className="w-8 h-8 text-[#C13584]" />
            <span className="text-lg font-bold text-[#666]">Flour & Frosting</span>
          </Link>
          <p className="text-[#666666] text-sm">
            La vostra amichevole panetteria di quartiere.
          </p>
        </div> */}
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-lg font-bold text-[#eeec]">Follow Us</h3>
          <nav className="flex items-center gap-4">
            <a href='https://www.facebook.com/p/Panetteria-Il-Forno-100063551380121/' className="text-[#666666] hover:text-[#FF6B6B]">
              <FacebookIcon className="w-6 h-6" />
            </a>
            <a href="https://www.instagram.com/panetteriailforno/" className="text-[#666666] hover:text-[#f56040]">
              <InstagramIcon className="w-6 h-6" />
            </a>
            {/* <ThemeController /> */}
          </nav>
        </div>
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-lg font-bold text-[#eeec]">Quick Links</h3>
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
          <h3 className="text-lg font-bold text-[#eeec]">Contact</h3>
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
        <p className="text-[#eeec] text-sm mt-4 md:mt-0">
          Designed by{" "}
          <Link to='/' className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-600 to-yellow-100 underline">
            Vincenzo Perretta
          </Link>
        </p>
      </div>
    </footer>
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

