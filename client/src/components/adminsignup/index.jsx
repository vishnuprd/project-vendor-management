import React, { useState } from 'react';
import SignupJpg from "../../assets/signup.jpg";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminSignup() {
    const Inputform = [
        {
            id: 1,
            name: "firstName",
            label: "First Name",
            type: "text",
            placeholder: "First Name",
            required: true,
        },
        {
            id: 2,
            name: "lastName",
            label: "Last Name",
            type: "text",
            placeholder: "Last Name",
            required: true,
        },
        {
            id: 3,
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "Email",
            required: true,
        },
        {
            id: 4,
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "Password",
            required: true,
        },
    ];

    const [InputValue, setInputValue] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});


    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue({ ...InputValue, [name]: value });
        setErrors({ ...errors, [name]: "" }); 
    };

    const validateInputs = () => {
        const newErrors = {};

        if (!InputValue.firstName.trim()) {
            newErrors.firstName = "First Name is required";
        }

        if (!InputValue.lastName.trim()) {
            newErrors.lastName = "Last Name is required";
        }

        if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(InputValue.email)) {
            newErrors.email = "Invalid email address";
        }

        if (InputValue.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        }

        setErrors(newErrors);

   
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateInputs()) {
            return; 
        }
         try{
            const response = await axios.post("http://localhost:5000/api/chat/signup", InputValue)

            console.log("Form submitted successfully:", response.data);
            toast.success("Signup successful!");
            navigate("/");
        } catch (error) {
            console.error("Error signing up admin:", error);
            toast.error("Error signing up admin. Please try again.");
        }
      
        
    };

    return (
        <>
            <div>
                <section>
                    <div className="hero min-h-screen flex flex-col md:flex-row items-center">
                        <div className="hero-content flex-col md:flex-row items-center md:gap-8 lg:gap-16">
                            <img
                                src={SignupJpg}
                                className="max-w-xs sm:max-w-sm md:max-w-md rounded-lg shadow-2xl mb-4 md:mb-0"
                                alt="signup"
                            />
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl md:text-4xl font-bold sm:text-xl">
                                    Welcome to Admin Signup!
                                </h1>
                                <div className="card max-w-xs sm:max-w-sm md:max-w-md p-4 bg-white shadow-lg mt-6">
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
                                        </div>
                                        <label className="label mt-2">
                                            <a
                                                href="/"
                                                className="label-text-alt link link-hover text-blue-600"
                                            >
                                                Already have an account? Click here to login
                                            </a>
                                        </label>
                                        <div className="form-control mt-6">
                                            <button className="custom-btn btn-primary w-full">
                                                Signup
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
