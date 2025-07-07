"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Disclosure, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const navigation = [
  { name: 'Home', href: '/#home' },
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Testimonials', href: '/#testimonials' },
  { name: 'Contact', href: '/#contact' },
];

interface Contact2Props {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  web?: { label: string; url: string };
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
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-gray-800/50 backdrop-blur-md'
    }`}>
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <Image
                    src="/logo.png"
                    alt="CamVitals Logo"
                    width={40}
                    height={40}
                    className="w-auto h-8"
                  />
                  <span className={`text-xl font-bold ${isScrolled ? 'text-primary' : 'text-white'}`}>
                    CamVitals
                  </span>
                </Link>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/login"
                  className={`text-sm font-medium px-4 py-2 rounded-lg border-2 transition-colors duration-200
                    ${isScrolled 
                      ? 'border-primary text-primary hover:bg-primary hover:text-white' 
                      : 'border-white text-white hover:bg-white hover:text-gray-900'
                    }`}
                >
                  Log In
                </Link>
              </div>

              <div className="md:hidden flex items-center">
                <Disclosure.Button className={`p-2 rounded-md ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}>
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
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
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-white hover:bg-primary"
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

export const Contact2 = ({
  title = "Request a Demo",
  description = "Get in touch with our team to see how CamVitals can transform your workplace wellness program. We're here to help you enhance employee well-being and boost productivity.",
  phone = "(555) 123-4567",
  email = "hi@camvitals.com",
  web = { label: "camvitals.com", url: "https://camvitals.com" },
}: Contact2Props) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    subject: false,
    message: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when user starts typing
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [id]: false
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: !formData.firstName.trim(),
      lastName: !formData.lastName.trim(),
      email: !formData.email.trim(),
      subject: !formData.subject.trim(),
      message: !formData.message.trim(),
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create mailto link with form data
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(formData.subject || 'Demo Request')}&body=${encodeURIComponent(
        `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`
      )}`;
      
      window.location.href = mailtoLink;
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({
        firstName: false,
        lastName: false,
        email: false,
        subject: false,
        message: false,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-24 py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start max-w-7xl mx-auto">
            {/* Left Column - Contact Info */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h1 className="text-5xl font-bold text-white mb-8 lg:text-6xl xl:text-7xl">
                  {title}
                </h1>
                <p className="text-gray-300 text-xl leading-relaxed">{description}</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <h3 className="text-3xl font-semibold text-white mb-8">
                  Contact Details
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-gray-300 text-lg">Phone:</span>
                    <span className="text-white text-lg">{phone}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-gray-300 text-lg">Email:</span>
                    <a href={`mailto:${email}`} className="text-blue-400 hover:text-blue-300 underline transition-colors text-lg">
                      {email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-gray-300 text-lg">Web:</span>
                    <a href={web.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline transition-colors text-lg">
                      {web.label}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-10 border border-gray-700 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="firstName" className="text-gray-300 font-medium text-lg">
                      First Name *
                    </Label>
                    <Input 
                      type="text" 
                      id="firstName" 
                      placeholder="First Name" 
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 text-lg ${
                        errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-sm">First name is required</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="lastName" className="text-gray-300 font-medium text-lg">
                      Last Name *
                    </Label>
                    <Input 
                      type="text" 
                      id="lastName" 
                      placeholder="Last Name" 
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 text-lg ${
                        errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-sm">Last name is required</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-gray-300 font-medium text-lg">
                    Email *
                  </Label>
                  <Input 
                    type="email" 
                    id="email" 
                    placeholder="your@email.com" 
                    value={formData.email}
                    onChange={handleChange}
                    className={`bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 text-lg ${
                      errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm">Email is required</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="subject" className="text-gray-300 font-medium text-lg">
                    Subject *
                  </Label>
                  <Input 
                    type="text" 
                    id="subject" 
                    placeholder="Demo Request" 
                    value={formData.subject}
                    onChange={handleChange}
                    className={`bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 text-lg ${
                      errors.subject ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                  {errors.subject && (
                    <p className="text-red-400 text-sm">Subject is required</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="message" className="text-gray-300 font-medium text-lg">
                    Message *
                  </Label>
                  <Textarea 
                    placeholder="Tell us about your needs and how we can help..." 
                    id="message" 
                    value={formData.message}
                    onChange={handleChange}
                    rows={8}
                    className={`bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 resize-none text-lg ${
                      errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-sm">Message is required</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 