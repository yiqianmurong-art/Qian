import React from 'react';
import { motion } from 'motion/react';
import { Bike, Zap, Leaf, ArrowRight, ChevronRight, MapPin, Shield, Smartphone, Globe, HelpCircle, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onFindBike: () => void;
}

export default function LandingPage({ onFindBike }: LandingPageProps) {
  const [formStatus, setFormStatus] = React.useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('sent'), 1500);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-6 pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-background-dark leading-[0.9] mb-6">
              Ride Across KL <br />
              <span className="text-primary italic">with CityRide</span>
            </h1>
            <p className="text-slate-600 text-lg mb-8 max-w-md">
              The most convenient and eco-friendly way to explore Kuala Lumpur. Find a bike at 10 major stations, scan, and ride.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onFindBike}
                className="bg-primary text-background-dark font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                Find A Bike <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-background-dark border border-slate-200 font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
              >
                See How it Works
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-3xl opacity-50" />
            <img 
              src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800" 
              alt="Bike" 
              className="w-full h-auto rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-background-dark py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-around gap-8">
          <div className="flex flex-col items-center text-center">
            <span className="text-primary text-3xl font-bold">10</span>
            <span className="text-slate-400 text-sm uppercase tracking-widest">Active Hubs</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-primary text-3xl font-bold">24/7</span>
            <span className="text-slate-400 text-sm uppercase tracking-widest">Availability</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-primary text-3xl font-bold">100%</span>
            <span className="text-slate-400 text-sm uppercase tracking-widest">Eco-friendly</span>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-background-dark mb-4">How it Works</h2>
            <p className="text-slate-500">Simple steps to get you moving around the city</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <MapPin className="w-8 h-8" />, title: "Find a Bike", desc: "Use the map to find the nearest station with available bikes." },
              { icon: <Zap className="w-8 h-8" />, title: "Scan to Unlock", desc: "Scan the QR code on the bike to unlock it instantly." },
              { icon: <Bike className="w-8 h-8" />, title: "Ride & Return", desc: "Enjoy your ride and return the bike to any active CityRide hub across KL." }
            ].map((step, i) => (
              <div key={i} className="p-8 rounded-3xl bg-background-light border border-slate-100 hover:border-primary/30 transition-colors group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm group-hover:bg-primary group-hover:text-background-dark transition-colors">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-background-dark mb-3">{step.title}</h3>
                <p className="text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/20 rounded-full blur-3xl" />
              <img 
                src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800" 
                alt="City Cycling" 
                className="rounded-[40px] shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 max-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm">Eco-Friendly</span>
                </div>
                <p className="text-xs text-slate-500">Reducing KL's carbon footprint one ride at a time.</p>
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-bold text-background-dark mb-6 leading-tight">
                  Smart Mobility for a <br />
                  <span className="text-primary italic">Smarter Kuala Lumpur</span>
                </h2>
                <p className="text-slate-600 text-lg">
                  We're more than just a bike-sharing service. We're a technology-driven platform designed to make urban transit seamless, affordable, and sustainable.
                </p>
              </div>

              <div className="grid gap-8">
                {[
                  { icon: <Shield className="w-6 h-6" />, title: "Fully Insured Rides", desc: "Every ride is covered by our comprehensive insurance policy for your peace of mind." },
                  { icon: <Smartphone className="w-6 h-6" />, title: "Seamless App Experience", desc: "Unlock bikes, track your route, and manage payments all from your smartphone." },
                  { icon: <Globe className="w-6 h-6" />, title: "10 Major Hubs", desc: "Strategically located stations at KLCC, Bukit Bintang, KL Sentral, and more." }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-background-dark mb-1">{feature.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <HelpCircle className="w-4 h-4" /> Common Questions
            </div>
            <h2 className="text-4xl font-bold text-background-dark">Got Questions?</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "How do I start a ride?", a: "Simply find a bike at any of our 10 stations, scan the QR code using the CityRide app, and follow the on-screen instructions to unlock." },
              { q: "Where can I return the bike?", a: "You can return your bike to any official CityRide hub. Just park it in an available dock and confirm the return in your app." },
              { q: "What happens if I exceed the time limit?", a: "A penalty fee of RM 50.00 applies for late returns. We recommend checking your timer in the app to avoid extra charges." },
              { q: "Is there a deposit required?", a: "No! CityRide is proud to offer a deposit-free experience for all our riders. You only pay for the time you ride." }
            ].map((item, i) => (
              <details key={i} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden transition-all hover:border-primary/30">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-bold text-background-dark">{item.q}</span>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-background-dark rounded-[60px] p-8 md:p-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl -z-0" />
            
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Need Help? <br />
                  <span className="text-primary italic">We're here for you.</span>
                </h2>
                <p className="text-slate-400 text-lg mb-10">
                  Have a question about your ride or want to partner with us? Send us a message and our team will get back to you within 24 hours.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Live Chat</p>
                      <p className="font-bold">Available 24/7 in-app</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[40px] border border-white/10">
                {formStatus === 'sent' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-slate-400">We'll get back to you very soon.</p>
                    <button 
                      onClick={() => setFormStatus('idle')}
                      className="mt-8 text-primary font-bold hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Name</label>
                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Your name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Email</label>
                        <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Your email" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Message</label>
                      <textarea required rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-colors resize-none" placeholder="How can we help?"></textarea>
                    </div>
                    <button 
                      disabled={formStatus === 'sending'}
                      className="w-full py-5 bg-primary text-background-dark font-bold rounded-2xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {formStatus === 'sending' ? 'Sending...' : <>Send Message <Send className="w-5 h-5" /></>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-background-light">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-background-dark mb-4">Choose Your Ride</h2>
              <p className="text-slate-500">Simple flat-rate pricing for everyone</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
                  <Bike className="w-8 h-8" />
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-background-dark">RM 2.00</span>
                  <p className="text-slate-400 text-sm">/ hour</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-background-dark mb-4">Standard Bike</h3>
              <p className="text-slate-500 mb-8 flex-grow">Perfect for short commutes and casual city exploration. Lightweight and easy to handle.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-600"><ChevronRight className="w-4 h-4 text-primary" /> 7-speed gear system</li>
                <li className="flex items-center gap-2 text-slate-600"><ChevronRight className="w-4 h-4 text-primary" /> Adjustable seat height</li>
                <li className="flex items-center gap-2 text-slate-600"><ChevronRight className="w-4 h-4 text-primary" /> No deposit required</li>
              </ul>
              <button 
                onClick={onFindBike}
                className="w-full py-4 bg-background-dark text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors"
              >
                Select Standard
              </button>
            </div>

            <div className="bg-background-dark p-8 rounded-[40px] shadow-xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-background-dark px-6 py-2 font-bold rounded-bl-3xl">POPULAR</div>
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                  <Zap className="w-8 h-8" />
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-white">RM 3.00</span>
                  <p className="text-slate-400 text-sm">/ hour</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Electric Bike</h3>
              <p className="text-slate-400 mb-8 flex-grow">Effortless riding with pedal assist. Ideal for longer distances or hilly areas in the city.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-300"><ChevronRight className="w-4 h-4 text-primary" /> 40km range per charge</li>
                <li className="flex items-center gap-2 text-slate-300"><ChevronRight className="w-4 h-4 text-primary" /> Smart LCD display</li>
                <li className="flex items-center gap-2 text-slate-300"><ChevronRight className="w-4 h-4 text-primary" /> No deposit required</li>
              </ul>
              <button 
                onClick={onFindBike}
                className="w-full py-4 bg-primary text-background-dark font-bold rounded-2xl hover:bg-opacity-90 transition-all"
              >
                Select Electric
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-dark text-white pt-20 pb-10 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Bike className="w-6 h-6 text-background-dark" />
              </div>
              <span className="font-bold text-2xl tracking-tight">CityRide</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-8">
              Revolutionizing urban mobility in Kuala Lumpur with sustainable and affordable bike-sharing solutions across 10 major hubs.
            </p>
            <div className="mb-8">
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-4">Our Designers</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Tan Yi Qian, Lee Zi Ying, Lau Xin Yi, Tan Tzyy Lynn, Christabell Siet Yong Xing
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all cursor-pointer">
                <Leaf className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="hover:text-primary cursor-pointer transition-colors" onClick={onFindBike}>Find a Bike</li>
              <li className="hover:text-primary cursor-pointer transition-colors" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Features</li>
              <li className="hover:text-primary cursor-pointer transition-colors" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>Pricing</li>
              <li className="hover:text-primary cursor-pointer transition-colors" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>FAQ</li>
              <li className="hover:text-primary cursor-pointer transition-colors" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <div className="space-y-6 text-slate-400 text-sm">
              <div>
                <p className="font-bold text-white">Tan Yi Qian</p>
                <p>WhatsApp: 019-7574697</p>
                <p>Email: yqtan0113@1utar.my</p>
              </div>
              <div>
                <p className="font-bold text-white">Lee Zi Ying</p>
                <p>WhatsApp: 019-8822399</p>
                <p>Email: zyinggg11@1utar.my</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
          <div className="flex flex-col gap-2">
            <p>© 2026 CityRide. All rights reserved.</p>
            <p className="text-primary/60 font-medium italic">This website is used for UTAR-UDPL2333 Transport Planning and Demand Analysis Assignment</p>
          </div>
          <div className="flex gap-8">
            <span>Made with ❤️ in KL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
