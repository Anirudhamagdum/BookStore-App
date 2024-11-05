import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Login from "./Login"; // Make sure this component handles login

function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const [isLogin, setIsLogin] = useState(false); // State to toggle between login and signup

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (isLogin) {
      // Handle login
      const loginInfo = {
        email: data.email,
        password: data.password,
      };
      await axios
        .post("http://localhost:4001/user/login", loginInfo)
        .then((res) => {
          toast.success("Login Successful");
          localStorage.setItem("Users", JSON.stringify(res.data.user));
          navigate(from, { replace: true });
        })
        .catch((err) => {
          if (err.response) {
            console.log(err);
            toast.error("Error: " + err.response.data.message);
          }
        });
    } else {
      // Handle signup
      const userInfo = {
        fullname: data.fullname,
        email: data.email,
        password: data.password,
      };
      await axios
        .post("http://localhost:4001/user/signup", userInfo)
        .then((res) => {
          toast.success("Signup Successfully");
          localStorage.setItem("Users", JSON.stringify(res.data.user));
          navigate(from, { replace: true });
        })
        .catch((err) => {
          if (err.response) {
            console.log(err);
            toast.error("Error: " + err.response.data.message);
          }
        });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-[600px]">
        <div className="modal-box">
          <form onSubmit={handleSubmit(onSubmit)} method="dialog">
            <Link
              to="/"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </Link>

            <h3 className="font-bold text-lg">{isLogin ? "Login" : "Signup"}</h3>

            {/* Conditional rendering of the fullname field */}
            {!isLogin && (
              <div className="mt-4 space-y-2">
                <span>Name</span><br />
                <input
                  type="text"
                  placeholder="Enter your fullname"
                  className="w-80 px-3 py-1 border rounded-md outline-none"
                  {...register("fullname", { required: !isLogin })}
                />
                {errors.fullname && (
                  <span className="text-sm text-red-500"><br />This field is required</span>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="mt-4 space-y-2">
              <span>Email</span><br />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-sm text-red-500"><br />This field is required</span>
              )}
            </div>

            {/* Password Field */}
            <div className="mt-4 space-y-2">
              <span>Password</span><br />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <span className="text-sm text-red-500"><br />This field is required</span>
              )}
            </div>

            {/* Button */}
            <div className="flex justify-between mt-4  ">
              <button className="bg-pink-500 text-white rounded-md px-4 py-1 hover:bg-pink-700 duration-200">
                {isLogin ? "Login" : "Signup"}
              </button>
              <p className="text-xl">
                {isLogin ? "Don't have an account?" : "Have an account?"}{" "}
                <button
                  type="button"
                  className="underline text-blue-500 cursor-pointer"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Signup" : "Login"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
