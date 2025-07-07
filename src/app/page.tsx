'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Disclosure, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Typewriter from 'typewriter-effect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import { HowItWorks } from "@/components/ui/how-it-works";
import { ComparisonView } from "@/components/ui/comparison-view";

const navigation = [
  { name: 'Home', href: '#home' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' },
];

// Custom Cursor Component
function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 }); // Start offscreen
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const updateHoverState = (hovering: boolean) => {
      setIsHovering(hovering);
    };

    window.addEventListener('mousemove', updatePosition);
    document.querySelectorAll('a, button').forEach(element => {
      element.addEventListener('mouseenter', () => updateHoverState(true));
      element.addEventListener('mouseleave', () => updateHoverState(false));
    });

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.querySelectorAll('a, button').forEach(element => {
        element.removeEventListener('mouseenter', () => updateHoverState(true));
        element.removeEventListener('mouseleave', () => updateHoverState(false));
      });
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`custom-cursor ${isHovering ? 'hover' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
}

// Navbar Component
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Disclosure as="nav" className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-3">
                  <Image
                    src="/logo.png"
                    alt="CamVitals Logo"
                    width={60}
                    height={60}
                    className="w-auto h-10"
                  />
                  <motion.span 
                    className={`text-2xl font-bold ${isScrolled ? 'text-black' : 'text-white'}`}
                    whileHover={{ 
                      scale: 1.05,
                      textShadow: isScrolled ? "0 0 8px rgba(0,0,0,0.2)" : "0 0 8px rgba(255,255,255,0.2)",
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                  >
                    CamVitals
                  </motion.span>
                </Link>
              </div>
              
              <div className="hidden md:flex items-center space-x-10">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-base font-medium transition-colors ${
                      isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/login"
                  className={`text-base font-medium px-6 py-3 rounded-lg border-2 transition-colors duration-200
                    ${isScrolled 
                      ? 'border-black text-black hover:bg-black hover:text-white' 
                      : 'border-accent text-accent hover:bg-accent hover:text-white'
                    }`}
                >
                  Log In
                </Link>
              </div>

              <div className="md:hidden flex items-center">
                <Disclosure.Button className={`p-3 rounded-md ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}>
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="h-7 w-7" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="h-7 w-7" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="md:hidden bg-white shadow-lg">
              <div className="px-4 pt-4 pb-4 space-y-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block px-4 py-3 rounded-md text-lg font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
                <Link
                  href="/login"
                  className={`block px-4 py-3 rounded-md text-lg font-medium ${isScrolled ? 'text-black hover:text-white hover:bg-black' : 'text-accent hover:text-white hover:bg-accent'}`}
                >
                  Log In
                </Link>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}

// Hero Section
function Hero() {
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [typewriterKey, setTypewriterKey] = useState(0);
  const [showFirstGif, setShowFirstGif] = useState(true);
  const [showSecondGif, setShowSecondGif] = useState(false);

  useEffect(() => {
    // GIF synchronization cycle - 10-second total cycle
    const gifCycle = setInterval(() => {
      // Reset both GIFs
      setShowFirstGif(false);
      setShowSecondGif(false);
      
      // Start first GIF after brief delay
      setTimeout(() => {
        setShowFirstGif(true);
      }, 100);
      
      // Start second GIF after first one completes (4 seconds)
      setTimeout(() => {
        setShowFirstGif(false);
        setShowSecondGif(true);
      }, 4000);
      
      // Hide second GIF after it completes (8 seconds total)
      setTimeout(() => {
        setShowSecondGif(false);
      }, 8000);
    }, 10000);

    // Text synchronization cycle - 8-second cycle
    const textCycle = setInterval(() => {
      setShowSubtitle(false);
      setTypewriterKey(prev => prev + 1);
      
      // Show subtitle after typewriter completes (3 seconds)
      setTimeout(() => {
        setShowSubtitle(true);
      }, 3000);
    }, 8000);

    // Initial setup
    const initialTextTimeout = setTimeout(() => {
      setShowSubtitle(true);
    }, 3000);

    return () => {
      clearInterval(gifCycle);
      clearInterval(textCycle);
      clearTimeout(initialTextTimeout);
    };
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center text-center bg-gradient-to-br from-sky-400 via-primary-600 to-blue-900 relative overflow-hidden">
      {/* First GIF - Left Side */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-start z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: showFirstGif ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/rate2.gif"
          alt="Heart animation left"
          width={600}
          height={600}
          className="opacity-60 object-contain"
          unoptimized
        />
      </motion.div>
      
      {/* Second GIF - Right Side */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-end z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: showSecondGif ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/rate2.gif"
          alt="Heart animation right"
          width={600}
          height={600}
          className="opacity-60 object-contain"
          unoptimized
        />
      </motion.div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-wide">
            CamVitals
          </h1>
          
          <div className="text-2xl md:text-4xl font-bold text-white whitespace-nowrap mb-4">
            <Typewriter
              key={typewriterKey}
              options={{
                strings: ['AI-Powered Employee Well-Being'],
                autoStart: true,
                loop: false,
                delay: 50,
                deleteSpeed: Infinity,
                cursor: '',
              }}
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: showSubtitle ? 1 : 0, 
              y: showSubtitle ? 0 : 20 
            }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-l text-white whitespace-nowrap mb-1">
              Transform your workplace with real-time health monitoring and AI-driven insights.
            </p>
            <p className="text-xl text-white/90 max-w-xl mx-auto">
              Enhance employee well-being and boost productivity.
            </p>
          </motion.div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/demo/request"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-white bg-gray-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
              >
                Request Demo
              </Link>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-white text-white bg-transparent rounded-lg hover:bg-white hover:text-primary transition-all duration-200"
            >
              <Link href="/login">
              Log In
              </Link>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Trusted By Section
function TrustedBy() {
  const clients = [
    { name: "Company 1", logo: "/econddnnect.png" },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-gray-600 mb-8 text-4xl font-bold mb-14">Trusted by leading companies</h1>
        <div className="flex justify-center items-center">
          <div className="flex overflow-x-auto pb-4 space-x-12 no-scrollbar">
            {clients.map((client, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="flex-none w-40 h-50 relative  hover:grayscale-0 transition-all"
              >
                <Image
                  src={client.logo}
                  alt={client.name}
                  fill
                  className="object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function Testimonials() {
  const testimonials = [
    {
      text: "CamVitals has transformed how we monitor and improve employee well-being. The insights are invaluable.",
      author: "Sarah Johnson",
      title: "HR Director",
      avatar: "/client1.jpg"
    },
    {
      text: "The real-time monitoring and AI-driven alerts have helped us prevent several potential health incidents.",
      author: "Michael Chen",
      title: "Safety Manager",
      avatar: "/client2.jpg"
    },
    {
      text: "Implementation was smooth, and the results were immediate. Our employees feel more cared for than ever.",
      author: "Emma Williams",
      title: "Operations Lead",
      avatar: "/client3.jpg"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
        </motion.div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          pagination={{
            clickable: true,
            bulletActiveClass: 'swiper-pagination-bullet-active bg-accent'
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false
          }}
          className="pb-12"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-600">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">{testimonial.text}</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

// Call to Action Section
function CallToAction() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Transform Your Workplace?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join the future of employee well-being monitoring with CamVitals
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 border border-white/10 transition-all duration-200 shadow-lg hover:shadow-white/10"
          >
            Get Started Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  const footerLinks = {
    Product: ['Features', 'Security', 'Enterprise', 'Customer Stories'],
    Company: ['About', 'Careers', 'Contact', 'Partners'],
    Resources: ['Documentation', 'Guides', 'API Reference', 'Status'],
    Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
  };

  const socialLinks = [
    { name: 'Twitter', href: '#' },
    { name: 'LinkedIn', href: '#' },
    { name: 'GitHub', href: '#' },
    { name: 'YouTube', href: '#' },
  ];

  return (
    <footer className="text-white" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Image
                src="/logo.png"
                alt="CamVitals Logo"
                width={60}
                height={60}
                className="w-auto h-8"
              />
              <span className="text-3xl font-bold">CamVitals</span>
            </div>
            <p className="text-white/90 mb-8">
              Transforming workplace wellness through real-time health monitoring and AI-driven insights.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/80 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <form className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Subscribe to our newsletter</h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-white/40 text-white placeholder:text-white/60"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 border border-white/10 transition-all duration-200 shadow-lg hover:shadow-white/10"
              >
                Subscribe
              </motion.button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center text-white/80">
          <p>&copy; {new Date().getFullYear()} CamVitals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Main Page Component
export default function Home() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ComparisonView />
        <TrustedBy />
        <Testimonials />
        <div className="bg-gradient-to-br from-sky-800 via-primary-900 to-blue-950">
          <CallToAction />
          <Footer />
        </div>
      </main>
    </>
  );
}
