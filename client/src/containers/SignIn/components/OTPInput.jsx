import React, { useState } from "react";
import PropTypes from "prop-types";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";

function OTPInput(props) {
  const { phoneNumber, handleOTP, editPhoneNumber } = props;
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const handleEditPhoneNumber = () => {
    navigate("/login");
    editPhoneNumber(false);
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-bold  tracking-tight text-gray-900 text-indigo-600">
          OTP Verification
        </h2>
        <div className="mt-6">
          <div className="text-sm  tracking-tight text-gray-500 ">
            Enter the OTP you received to
          </div>
          <span className=" text-sm font-bold  tracking-tight text-gray-900 text-indigo-600 ">
            {phoneNumber}
          </span>
          <span
            className="cursor-pointer ps-1 text-sm tracking-tight text-gray-400 underline underline-offset-2"
            onClick={handleEditPhoneNumber}
          >
            Edit
          </span>
        </div>
      </div>
      <form className="mt-3 " action="#" method="POST">
        {/* <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Password
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div> */}

        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          //   renderSeparator={<span className="mx-2 sm:mx-1">-</span>}
          renderInput={(props) => <input {...props} />}
          containerStyle={"mb-12 space-x-4 "}
          inputStyle={
            "flex-1 h-12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          }
        />

        <div>
          <button
            type="submit"
            className=" flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>
        </div>
      </form>
    </>
  );
}

export default OTPInput;
