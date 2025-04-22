import Link from "next/link"

const Navbar = () => {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/club", label: "Club" },
    { href: "/join-us", label: "Join Us" },
    { href: "/writers", label: "Writers" },
    { href: "/about-us", label: "About Us" },
    { href: "/profile", label: "Profile" },
  ]

  return (
    <nav>
      <ul className="flex space-x-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-[#5b3758]">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar