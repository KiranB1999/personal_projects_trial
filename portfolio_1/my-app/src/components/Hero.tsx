'use client';

import { useCallback } from 'react';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Container, Engine } from "tsparticles-engine";

const Hero = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log("Particles container loaded");
  }, []);

  const [text] = useTypewriter({
    words: [
      'Process Optimization',
      'Data Analysis',
      'Project Management',
      'Stakeholder Management',
      'Business Strategy'
    ],
    loop: true,
    delaySpeed: 2000
  });

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fullScreen: { enable: false },
          background: {
            opacity: 0
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: ["#3b82f6", #9333ea", "#6366f1"]
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce"
              },
              random: true,
              speed: 2,
              straight: false
            },
            number: {
              density: {
                enable: true,
                area: 800
              },
              value: 80
            },
            opacity: {
              value: 0.5
            },
            shape: {
              type: "circle"
            },
            size: {
              value: { min: 1, max: 5 }
            }
          },
          detectRetina: true,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "grab"
              },
              onClick: {
                enable: true,
                mode: "push"
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 140,
                links: {
                  opacity: 0.5
                }
              },
              push: {
                quantity: 4
              }
            }
          }
        }}
        className="absolute inset-0"
      />
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="text-center z-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">
          Senior Business Analyst
        </h1>
        <h2 className="text-2xl md:text-3xl mb-6 text-gray-300 animate-fade-in-up animation-delay-500">
          Specializing in <span className="text-blue-400">{text}</span>
          <Cursor cursorStyle="|" />
        </h2>
        <p className="text-xl mb-8 text-gray-400 max-w-2xl mx-auto animate-fade-in-up animation-delay-1000">
          Transforming complex business challenges into actionable solutions through
          data-driven analysis and strategic thinking
        </p>
        <a
          href="#contact"
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold 
                   hover:bg-blue-700 transition-all duration-300 
                   hover:shadow-lg hover:-translate-y-1
                   animate-fade-in-up animation-delay-1500"
        >
          Let's Connect
        </a>
      </div>
    </section>
  );
};

export default Hero;