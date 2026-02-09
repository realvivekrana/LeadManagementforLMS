import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  BarChart3, 
  Target, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Lead Management",
      description: "Centralized lead tracking and assignment system",
      color: "bg-teal-100 text-teal-600"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard", 
      description: "Real-time performance insights and reporting",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Target,
      title: "Sales Pipeline",
      description: "Visual pipeline management and conversion tracking",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Growth Tracking",
      description: "Monitor team performance and business growth",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Shield,
      title: "Role-based Access",
      description: "Secure access control for different user roles",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Automated workflows and follow-up reminders",
      color: "bg-yellow-100 text-yellow-600"
    }
  ];

  const benefits = [
    "Increase conversion rates by 40%",
    "Reduce response time by 60%", 
    "Improve team collaboration",
    "Track performance in real-time",
    "Automated lead distribution",
    "Comprehensive reporting"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/Athenura logo.png" alt="Athenura" className="h-10 w-auto" />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300 hover:bg-gray-50"
              >
                Features
              </Button>
              <Button 
                size="sm"
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Transform Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
                Lead Management
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Streamline your sales process with our comprehensive lead management platform. 
              Track, assign, and convert leads with powerful analytics and automation.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button 
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3"
                onClick={() => navigate('/login')}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-300 hover:bg-gray-50 px-8 py-3"
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Role Access Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {[
                { role: "Admin", description: "Complete system control", color: "border-teal-200 bg-teal-50" },
                { role: "Manager", description: "Team oversight & assignment", color: "border-blue-200 bg-blue-50" },
                { role: "Agent", description: "Lead management & follow-up", color: "border-purple-200 bg-purple-50" }
              ].map((item, index) => (
                <motion.div
                  key={item.role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${item.color}`}
                  onClick={() => navigate('/login')}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Login as {item.role}</h3>
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-gray-300 hover:bg-white"
                  >
                    Access Dashboard
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for{" "}
              <span className="text-teal-600">Sales Success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage leads, track performance, and grow your business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-gray-200 hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-lg mb-4 ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Why Choose{" "}
                <span className="text-teal-600">Athenura?</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of sales teams who have transformed their lead management process
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-teal-600 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Real-time Dashboard</h4>
                      <p className="text-sm text-gray-600">Monitor performance instantly</p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-teal-600 rounded-full"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">85%</div>
                    <div className="text-sm text-gray-600">Conversion Rate Increase</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Sales Process?
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              Start your free trial today and see the difference in 30 days
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-teal-600 hover:bg-gray-50 px-8 py-3"
                onClick={() => navigate('/login')}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-teal-700 px-8 py-3"
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/Athenura logo.png" alt="Athenura" className="h-10 w-auto" />
            </div>
            <div className="text-center md:text-right">
              <p>&copy; 2026 Athenura. All rights reserved.</p>
              <p className="text-sm">Built with modern sales teams in mind.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;