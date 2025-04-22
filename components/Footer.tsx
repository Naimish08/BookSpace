import { FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#b27b92] text-[#ffffff] p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-5">
        <div>
          <h3 className="font-bold mb-2">BookSpace</h3>
        </div>
        <div>
          <h3 className="font-bold mb-2">Address</h3>
          <p className="text-sm">
            Dwarkadas J. Sanghvi College of Engineering,
            <br />
            Vile Parle West, Mumbai-400056
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Contact</h3>
          <p className="text-sm">bookspace@gmail.com</p>
          <p className="text-sm">+91 98765432</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Follow us</h3>
          <div className="flex space-x-2">
            <div className="w-6 h-6 rounded-full bg-white">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                  alt="Instagram"
                  width="30"
                />
              </a>
            </div>
            <div className="w-6 h-6 rounded-full bg-white">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                  alt="LinkedIn"
                  width="30"
                />
              </a>
            </div>
            <div className="w-6 h-6 rounded-full bg-white">
              <a href="mailto:example@gmail.com">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
                  alt="Gmail"
                  width="30"
                />
              </a>
            </div>
            <div className="w-6 h-6 rounded-full bg-white">
              <a href="tel:+1234567890">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/159/159832.png"
                  alt="Phone"
                  width="30"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
