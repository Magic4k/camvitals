"use client";

import React from "react";
import { Camera, LineChart, Brain } from "lucide-react";
import { motion } from "framer-motion";

export const HowItWorks = () => {
  const steps = [
    {
      title: "Capture Vitals",
      description: "Advanced AI-powered cameras monitor vital signs in real-time, ensuring non-intrusive and continuous health tracking.",
      icon: Camera,
      color: "text-blue-500",
      gradient: "from-blue-500/10 to-transparent"
    },
    {
      title: "Analyze & Alert",
      description: "Smart algorithms process health data instantly, detecting patterns and triggering alerts for potential health concerns.",
      icon: LineChart,
      color: "text-green-500",
      gradient: "from-green-500/10 to-transparent"
    },
    {
      title: "Act & Advise",
      description: "Provide actionable insights and personalized recommendations to improve employee well-being and workplace safety.",
      icon: Brain,
      color: "text-purple-500",
      gradient: "from-purple-500/10 to-transparent"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Three steps to transform workplace wellness
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`${step.color} mb-6 inline-flex p-3 rounded-xl bg-gray-50 group-hover:bg-white/80 transition-colors`}>
                  <step.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}; 