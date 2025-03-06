
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-secondary/30">
      <div className="mb-8 text-center">
        <Link to="/" className="flex items-center justify-center gap-2 mb-4">
          <FileText className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl">DocManager</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground">Get started with our document management system</p>
      </div>
      <RegisterForm />
    </div>
  );
};

export default Register;
