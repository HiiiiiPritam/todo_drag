import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Users, 
  ArrowRight, 
  Play, 
  Star, 
  Zap, 
  Shield, 
  Smartphone,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Calendar,
  Target,
  Sparkles,
  Globe,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate feature showcase
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Efficient task management",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "End-to-end encryption keeps your tasks safe and private",
      color: "from-green-400 to-blue-500"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile First",
      description: "Responsive for mobile with full functionality",
      color: "from-purple-400 to-pink-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      content: "TeamFlow transformed how our team collaborates. The interface is intuitive and the features are exactly what we needed.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Freelance Designer",
      content: "As a creative professional, I love how TeamFlow makes organization feel effortless. The design is simply beautiful.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Startup Founder",
      content: "We've tried dozens of task managers. TeamFlow is the only one that our entire team actually enjoys using.",
      rating: 5
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: <Users className="w-5 h-5" /> },
    { number: "99.9%", label: "Uptime", icon: <TrendingUp className="w-5 h-5" /> },
    { number: "4.9★", label: "User Rating", icon: <Star className="w-5 h-5" /> },
    { number: "150+", label: "Countries", icon: <Globe className="w-5 h-5" /> }
  ];

  const TaskCard = ({ task, delay = 0 }: { task: { title: string; color: string; completed: boolean }; delay?: number }) => (
    <div 
      className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${task.color}`}></div>
        <span className="text-gray-700 font-medium">{task.title}</span>
      </div>
      <div className="flex items-center space-x-2">
        {task.completed ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
        )}
      </div>
    </div>
  );

  const FloatingShape = ({ className, delay = 0 }: { className: string; delay?: number }) => (
    <div
      className={`absolute rounded-full opacity-20 animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    ></div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingShape className="w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 -top-36 -left-36" delay={0} />
        <FloatingShape className="w-96 h-96 bg-gradient-to-r from-pink-400 to-red-400 top-1/2 -right-48" delay={2} />
        <FloatingShape className="w-64 h-64 bg-gradient-to-r from-green-400 to-blue-400 bottom-0 left-1/4" delay={4} />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                TeamFlow
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/login" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Features</a>
              <a href="/login" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">About</a>
              <a href="/login" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Reviews</a>
              <a href="/login" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Pricing</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button onClick={() => navigate('/login')} className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                Sign In
              </button>
              <button onClick={() => navigate('/register')} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="px-4 py-6 space-y-4">
              <a href="/login" className="block text-gray-700 hover:text-blue-600">Features</a>
              <a href="/login" className="block text-gray-700 hover:text-blue-600">About</a>
              <a href="/login" className="block text-gray-700 hover:text-blue-600">Reviews</a>
              <a href="/login" className="block text-gray-700 hover:text-blue-600">Pricing</a>
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-full">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mb-16 lg:mb-0">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                New: Time-Line for tracking tasks
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Manage Tasks
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Beautifully
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Experience the most elegant way to organize your life. TeamFlow combines stunning design with powerful functionality to make productivity feel effortless.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button onClick={() => navigate('/register')} className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigate('/register')} className="group bg-white/80 backdrop-blur-sm text-gray-800 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center border border-gray-200">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gradient-to-r ${
                      i === 0 ? 'from-pink-400 to-red-400' :
                      i === 1 ? 'from-blue-400 to-purple-400' :
                      i === 2 ? 'from-green-400 to-blue-400' :
                      'from-yellow-400 to-orange-400'
                    }`} />
                  ))}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">Loved by 50,000+ users</span>
                </div>
              </div>
            </div>

            {/* Hero Demo */}
            <div className="relative">
              <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Today's Focus</h3>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">March 15</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <TaskCard 
                    task={{ title: "Complete project proposal", completed: true, color: "bg-green-400" }} 
                    delay={0}
                  />
                  <TaskCard 
                    task={{ title: "Review design mockups", completed: false, color: "bg-blue-400" }} 
                    delay={200}
                  />
                  <TaskCard 
                    task={{ title: "Team meeting at 3 PM", completed: false, color: "bg-purple-400" }} 
                    delay={400}
                  />
                  <TaskCard 
                    task={{ title: "Update documentation", completed: true, color: "bg-yellow-400" }} 
                    delay={600}
                  />
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Daily Progress</span>
                    <span className="text-sm font-bold text-blue-600">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose TeamFlow?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience task management like never before with our thoughtfully designed features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 ${
                  activeFeature === index ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl mb-6 flex items-center justify-center text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                {activeFeature === index && (
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Target className="w-6 h-6" />, title: "Smart Prioritization", desc: "AI-powered task ranking" },
              { icon: <Clock className="w-6 h-6" />, title: "Time Tracking", desc: "Built-in productivity analytics" },
              { icon: <Users className="w-6 h-6" />, title: "Team Collaboration", desc: "Real-time sync and sharing" },
              { icon: <Calendar className="w-6 h-6" />, title: "Calendar Integration", desc: "Seamless scheduling" },
              { icon: <TrendingUp className="w-6 h-6" />, title: "Progress Analytics", desc: "Detailed productivity insights" },
              { icon: <Smartphone className="w-6 h-6" />, title: "Mobile Friendly", desc: "Responsive design" },
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-white/70 rounded-xl hover:bg-white/90 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied users worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who've already discovered the joy of beautiful task management. Start your free trial today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="group bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105 border border-white/30">
              Schedule Demo
            </button>
          </div>

          <div className="flex items-center justify-center space-x-6 text-white/80">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TeamFlow</span>
              </div>
              <p className="text-gray-400 mb-4">
                Beautiful task management for modern teams and individuals.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/login" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/login" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/login" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TeamFlow. All rights reserved. Built with ❤️ for productivity enthusiasts.</p>
          </div>
        </div>
      </footer>

      
    </div>
  );
};

export default HomePage;