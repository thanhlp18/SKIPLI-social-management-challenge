import { useNavigate } from "react-router-dom";
import skipliLogo from "../../assets/logo.svg";
import PhoneNumberInput from "./components/PhoneNumberInput";
import OTPInput from "./components/OTPInput";
import { useEffect, useState } from "react";
import { CreateNewAccessCode } from "../../api/loginApi";
import Toasts from "../../components/Toasts";
import AOS from "aos";
import "aos/dist/aos.css";

const SignIn = () => {
  // --------------- / State
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(undefined);
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const handleValidPhoneNumber = (userInputData) => {
    setIsValidPhoneNumber(!userInputData.error);
    setUserPhoneNumber(userInputData.phoneNumberNationFormat);
    console.log(userInputData.phoneNumber);
    CreateNewAccessCode(userInputData.phoneNumber);
  };

  useEffect(() => {
    AOS.init({
      duration: 150,
    });
  }, []);

  const handleInputOTP = () => {};
  return (
    <div
      className="h-100  flex h-screen items-end justify-center 
    bg-social-image-gradient  bg-cover bg-center "
    >
      <div className="relative m-auto box-content flex w-96  flex-col justify-center rounded-md bg-white px-6 py-12 shadow-sm transition ease-in-out lg:px-8">
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

        <div className="mt-10 w-96 sm:mx-auto sm:w-full sm:max-w-sm">
          {isValidPhoneNumber ? (
            <>
              <Toasts
                type={isValidPhoneNumber ? "success" : "error"}
                description={
                  isValidPhoneNumber
                    ? "OTP has been sent!"
                    : "Your phone number is wrong! Please try again!"
                }
                className={"absolute left-0 top-0"}
              />
              <OTPInput
                handleInputOTP={handleInputOTP}
                phoneNumber={userPhoneNumber}
                editPhoneNumber={setIsValidPhoneNumber}
              />
            </>
          ) : (
            <PhoneNumberInput handleValidPhoneNumber={handleValidPhoneNumber} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
