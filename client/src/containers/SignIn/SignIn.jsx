import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { CreateNewAccessCode, validateAccessCode } from "../../api/loginApi";
import skipliLogo from "../../assets/logo.svg";
import Toast from "../../components/Toast";
import OTPInput from "./components/OTPInput";
import PhoneNumberInput from "./components/PhoneNumberInput";
import { login } from "./signInSlice";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  // --------------- / State
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(undefined);
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const phoneNumber = useSelector((state) => state.phoneNumber.value);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // If user enter a valid phone number
  const handleValidPhoneNumber = (userInputData) => {
    // 1. set state valid phone number to true
    setIsValidPhoneNumber(!userInputData.error);
    // 2. set user phone number state
    setUserPhoneNumber(userInputData.phoneNumber);
    dispatch(login(userInputData.phoneNumber));
    // 3. Generate a new access code with user phone number
    CreateNewAccessCode(userInputData.phoneNumber);
  };

  useEffect(() => {
    AOS.init({
      duration: 150,
    });
  }, []);

  // RECEIVE the data from the view and processing
  const handleOTP = async (otp, toastData) => {
    // if the otp type is error, show toast
    if (toastData?.type === "error") {
      toast.custom(
        (t) => (
          <Toast
            type={toastData.type}
            description={toastData.description}
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            }  	m-auto box-border w-screen rounded-md shadow-sm ease-in-out lg:w-96`}
          />
        ),
        { duration: 700 }
      );
    } else if (toastData?.type === "success") {
      // if the otp type is success, call api to validate the OTP
      validateAccessCode(userPhoneNumber, otp).then((res) => {
        if (res) {
          // alert
          toast.custom(
            (t) => (
              <Toast
                type={"success"}
                description={"Login successful!"}
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                }  	m-auto box-border w-screen rounded-md shadow-sm ease-in-out lg:w-96`}
              />
            ),
            { duration: 700 }
          );
          navigate("/postlist");
          // save user input to local storage
          localStorage.setItem(
            "skipliAccount",
            JSON.stringify({
              userPhoneNumber: userPhoneNumber,
            })
          );
        }
      });
    }
  };
  return (
    <div
      className="h-100  flex h-screen items-end justify-center 
    bg-social-image-gradient  bg-cover bg-center "
    >
      <div className="relative m-auto box-border flex w-96  flex-col justify-center rounded-md bg-white px-6 py-12 shadow-sm transition ease-in-out lg:px-8">
        <Toaster position="top-center" reverseOrder={false} />
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
            <OTPInput
              handleOTP={handleOTP}
              phoneNumber={userPhoneNumber}
              editPhoneNumber={setIsValidPhoneNumber}
            />
          ) : (
            <PhoneNumberInput handleValidPhoneNumber={handleValidPhoneNumber} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
