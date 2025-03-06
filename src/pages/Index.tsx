
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText, Shield, User, RefreshCw } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header/Navigation */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">DocManager</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="transition-all duration-300 hover:text-primary"
            >
              Sign in
            </Button>
            <Button 
              onClick={() => navigate('/register')}
              className="transition-all duration-300"
            >
              Sign up
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Document Management <br className="hidden sm:block" />
            <span className="text-primary">for Accountants</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Securely share financial documents with your clients. 
            Streamline your accounting workflow with our intuitive platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/register')}
              className="min-w-[160px] animate-slide-in-bottom"
              style={{ animationDelay: '300ms' }}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/login')}
              className="min-w-[160px] animate-slide-in-bottom"
              style={{ animationDelay: '400ms' }}
            >
              Sign in
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="h-10 w-10 text-primary mb-4" />,
                title: "Document Management",
                description: "Securely store, organize, and share financial documents with your clients.",
                delay: 100
              },
              {
                icon: <User className="h-10 w-10 text-primary mb-4" />,
                title: "Client Portal",
                description: "Provide clients with a dedicated portal to access their documents.",
                delay: 200
              },
              {
                icon: <Shield className="h-10 w-10 text-primary mb-4" />,
                title: "Secure Sharing",
                description: "Keep sensitive financial information protected with state-of-the-art security.",
                delay: 300
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-card shadow-sm rounded-lg p-8 text-center transition-all duration-200 hover:shadow-md animate-slide-in-bottom"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-3xl mx-auto">
            {[
              {
                step: 1,
                title: "Create your account",
                description: "Sign up as an accountant and set up your profile.",
                delay: 100
              },
              {
                step: 2,
                title: "Add your clients",
                description: "Invite clients to the platform to share documents securely.",
                delay: 200
              },
              {
                step: 3,
                title: "Upload documents",
                description: "Upload and organize financial documents for your clients.",
                delay: 300
              },
              {
                step: 4,
                title: "Collaborate efficiently",
                description: "Clients can access their documents and provide feedback.",
                delay: 400
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className="flex items-start mb-8 animate-slide-in-bottom"
                style={{ animationDelay: `${step.delay}ms` }}
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {step.step}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 text-center bg-primary/5 rounded-2xl my-16">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Ready to streamline your accounting workflow?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start managing your client documents effortlessly today.
            </p>
            <Button 
              size="lg" 
              className="min-w-[200px]"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-bold">DocManager</span>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} DocManager. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
