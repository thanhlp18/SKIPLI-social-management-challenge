import skipliLogo from "../../assets/logo.svg";
import "intl-tel-input/build/css/intlTelInput.css";
import { useState } from "react";
import ReactIntlTelInput from "react-intl-tel-input-v2";
import "./SignIn.css";
import { validatePhoneNumberApi } from "../../api/loginApi";
const SignIn = () => {
  const inputTelProps = {
    placeholder: "Phone number",
    id: "tel",
    name: "tel",
    type: "tel",
    size: "lg",
    width: "400px",
    className:
      "block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
  };

  const intlTelOpts = {
    preferredCountries: ["vn"],
  };

  const [phoneNumberValue, setPhoneNumberValue] = useState({
    iso2: "vn",
    dialCode: "+84",
    phone: "+84",
  });

  // Function handle logic
  const onChange = (value) => {
    setPhoneNumberValue(value);
  };
  const onReady = (instance, IntlTelInput) => {};
  // console.log(instance, IntlTelInput);

  const handleSubmitPhoneNumber = (e) => {
    e.preventDefault();
    console.log("CALL API", phoneNumberValue);
    const data = {
      phone: phoneNumberValue.phone,
      countryCode: phoneNumberValue.iso2.toUpperCase(),
    };
    validatePhoneNumberApi(data).then((data) => {
      alert(data.valid);
    });
  };

  return (
    <div
      className="h-100 flex h-screen items-end justify-center bg-social-image-gradient 
    bg-cover  bg-center"
    >
      <div className="m-auto box-content flex w-96  flex-col justify-center rounded-md bg-white px-6 py-12 shadow-sm lg:px-8">
        <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src={skipliLogo}
            alt="Social Management Company Logo"
          />
          <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Social Management
          </h2>
        </div>

        <div className="mt-16 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmitPhoneNumber}>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="tel"
                  className="block text-xl font-medium leading-6 text-gray-900"
                >
                  Enter your phone number
                </label>
              </div>
              <ReactIntlTelInput
                className="mt-4"
                inputProps={inputTelProps}
                intlTelOpts={intlTelOpts}
                value={phoneNumberValue}
                onChange={onChange}
                onReady={onReady}
              />
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
