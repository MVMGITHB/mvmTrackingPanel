import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseurl } from './helper/Helper';
import { useAuth } from './context/auth';
import { UserOutlined, LockOutlined } from '@ant-design/icons';


const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseurl}/api/users/login`, {
        email: values.username,
        password: values.password,
      });

      const { user, token } = response.data;

      if (user && token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('auth', JSON.stringify({ user, token }));

        setAuth({ user, token });
        message.success('Login successful!');
        navigate('/dashboard');
      } else {
        message.error('Login failed: No user or token');
      }
    } catch (error) {
      console.error(error);
      message.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (


    <div className='h-[100vh] w-full flex justify-center items-center bg-gradient-to-r from-purple-300 to-indigo-200'>
    <div className=" flex font-sans bg-gradient-to-r from-purple-400 to-indigo-500">
      {/* Left Section */}
      <div className="w-1/2 text-white flex flex-col justify-center items-center relative overflow-hidden px-10 py-20">
        <div className="z-10 text-left max-w-sm">
          <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
          <p className="text-lg text-white/90">
            You can sign in to access with your existing account.
          </p>
        </div>

        {/* Decorative Background Shapes */}
        <div className="absolute inset-0 z-0">
          <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 400 400">
            <circle cx="80" cy="80" r="60" fill="white" />
            <rect x="260" y="140" width="120" height="100" fill="white" transform="rotate(45 300 200)" />
          </svg>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-white flex items-center justify-center p-10 rounded-l-3xl">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Sign In</h2>

          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please enter your email!' }]}
            >
              <Input
                size="large"
                placeholder="Username or email"
                prefix={<UserOutlined className="text-gray-400" />}
                className="rounded-full"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password
                size="large"
                placeholder="Password"
                prefix={<LockOutlined className="text-gray-400" />}
                className="rounded-full"
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-4">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a className="text-sm text-purple-600 hover:underline" href="#">Forgot password?</a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white font-semibold h-10 rounded-full"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <p className="text-sm text-center text-gray-600">
            New here? <a className="text-purple-600 hover:underline" href="#">Create an Account</a>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
