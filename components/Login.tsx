// pages/login.tsx
import React from 'react';
import { useRouter } from 'next/router';

const LoginPage: React.FC = () => {
  const router = useRouter();

  const handleLogin = () => {
    // เมื่อกดปุ่มเข้าสู่ระบบ, ระบบจะไปยังหน้าล็อกอินของ Auth0
    router.push('/api/auth/login');
  };

  return (
    <div className="login-container">
      <h2>เข้าสู่ระบบก่อนเริ่มเกม</h2>
      <button onClick={handleLogin}>เข้าสู่ระบบด้วย Auth0</button>
    </div>
  );
};

export default LoginPage;
