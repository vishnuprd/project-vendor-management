import React, { useState } from 'react';
import LoginJpg from "../../assets/login.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/layouts/authcontent"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminLogin() {
    const Inputform = [
        {
            id: 1,
            name: "email",
            label: "Email",
            type: "email",
            message: "Enter a valid Email ID",
            placeholder: "Email",
            required: true,
        },
    ];

    const [InputValue, setInputValue] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth(); 

    const validation = () => {
        const newErrors = {};

        if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/i.test(InputValue.email)) {
            newErrors.email = "Invalid email address";
        }

        if (InputValue.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue({ ...InputValue, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validation()) return;
      console.log("api url", process.env.REACT_APP_API_URL);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/login`, {
                email: InputValue.email,
                password: InputValue.password,
              });
              
      
          if (response.status === 200) {
            toast.success("Login successful!");
            const { token } = response.data;
      
        
            localStorage.setItem("token", token);
      
           
            localStorage.setItem("user", JSON.stringify(response.data));
      
            navigate("/dashboard");
          } else {
            alert("Login failed. Please check your credentials.");
          }
        } catch (error) {
          console.error("Login error:", error);
          toast.error("An unexpected error occurred. Please try again.");
        }
      };
      

    return (
        <div>
            <section>
                <div className="hero min-h-screen flex flex-col md:flex-row items-center">
                    <div className="hero-content flex-col md:flex-row items-center md:gap-8 lg:gap-16">
                        <img
                            src={LoginJpg}
                            className="max-w-xs sm:max-w-sm md:max-w-md rounded-lg mb-4 md:mb-0"
                            alt="login"
                        />
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-4xl font-bold sm:text-xl">
                                Welcome to Admin Login!
                            </h1>
                            <div className="card max-w-xs sm:max-w-sm md:max-w-md p-4 mt-6">
                                <form className="card-body" onSubmit={handleSubmit}>
                                    <div className="form-control">
                                        {Inputform.map((input) => (
                                            <div key={input.id} className="form-control">
                                                <label className="label">
                                                    <span className="label-text">{input.label}</span>
                                                </label>
                                                <input
                                                    type={input.type}
                                                    name={input.name}
                                                    placeholder={input.placeholder}
                                                    required={input.required}
                                                    className="input input-bordered"
                                                    value={InputValue[input.name]}
                                                    onChange={handleChange}
                                                />
                                                {errors[input.name] && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors[input.name]}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                        <div className="form-control mt-4">
                                            <label className="label">
                                                <span className="label-text">Password</span>
                                            </label>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Password"
                                                required
                                                className="input input-bordered"
                                                value={InputValue.password}
                                                onChange={handleChange}
                                            />
                                            {errors.password && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.password}
                                                </p>
                                            )}
                                            <label className="label mt-2">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2"
                                                    checked={showPassword}
                                                    onChange={() => setShowPassword(!showPassword)}
                                                />
                                                <span className="label-text">Show Password</span>
                                            </label>
                                        </div>
                                    </div>
                                    <label className="label mt-2">
                                        <a
                                            href="/admin-signup"
                                            className="label-text-alt link link-hover text-blue-600"
                                        >
                                            Don't have an account? Sign up here
                                        </a>
                                    </label>
                                    <div className="form-control mt-6">
                                        <button className="custom-btn btn-primary w-full">
                                            Login
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        
    );
}
