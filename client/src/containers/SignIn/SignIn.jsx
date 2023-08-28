import skipliLogo from "../../assets/logo.svg";
import PhoneNumberInput from "./components/PhoneNumberInput";

const SignIn = () => {
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

        <div className="mt-16 w-96 sm:mx-auto sm:w-full sm:max-w-sm">
          <PhoneNumberInput />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
