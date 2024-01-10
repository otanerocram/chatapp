import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterForm, RegisterResponse } from "../types/user";
import axios, { AxiosError, AxiosResponse } from "axios";
import { API_URL } from "../helpers/config";

const Register = () => {
  const [form, setForm] = useState<RegisterForm>({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    axios
      .post(`${API_URL}/auth/register`, form)
      .then((response: AxiosResponse<RegisterResponse>) => {
        if (response.data.message) {
          setMessage(response?.data?.message);
          setTimeout(() => {
            setMessage("");
          }, 3000);
        }

        if (response.data.nickname) {
          setMessage("User registered!");
          setTimeout(() => {
            navigate("/login");
          }, 1000);

          return;
        }

        console.log(response);
      })
      .catch(function (err: AxiosError<RegisterResponse>) {
        console.error(err.response?.data?.message);
      });
  };

  const isDisabled = () => {
    if (!form.nickname || !form.email) return true;
    if (form.password !== form.passwordConfirmation) return true;
    return false;
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Register a new account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium leading-6 text-gray-900">
              Nickname
            </label>
            <div className="mt-2">
              <input
                id="nickname"
                name="nickname"
                type="text"
                autoComplete="nickname"
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="passwordConfirmation" className="block text-sm font-medium leading-6 text-gray-900">
                Password Confirmation
              </label>
            </div>
            <div className="mt-2">
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isDisabled()}
              className={`flex w-full justify-center rounded-md ${
                isDisabled() ? "bg-gray-300" : "bg-indigo-600 hover:bg-indigo-500"
              }  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              Sign up
            </button>
          </div>
        </form>

        {message && <p className="my-3 text-center text-sm text-red-600">{message}</p>}

        <p className="mt-10 text-center text-sm text-gray-500">
          Already member?{" "}
          <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
