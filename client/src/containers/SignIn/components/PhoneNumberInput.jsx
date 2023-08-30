import "intl-tel-input/build/css/intlTelInput.css";
import { useEffect, useState } from "react";
import ReactIntlTelInput from "react-intl-tel-input-v2";
import { validatePhoneNumberApi } from "../../../api/loginApi";
import "./PhoneNumberInput.css";
import BtnLoading from "../../../components/BtnLoading";
import BtnPrimary from "../../../components/BtnPrimary";

const SignIn = (props) => {
  const { handleValidPhoneNumber } = props;
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

  // ------------------ // State
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumberValue, setPhoneNumberValue] = useState({
    iso2: "vn",
    dialCode: "+84",
    phone: "+84",
  });
  const [phoneNumberInstance, setPhoneNumberInstance] = useState();
  const [error, setError] = useState(null);
  const [formSubmitData, setFormSubmitData] = useState();

  // ------------------ // Function handle logic
  const onChange = (value) => {
    if (phoneNumberValue.phone !== value.phone) setPhoneNumberValue(value);
  };
  const onReady = (instance, IntlTelInput) => {
    setPhoneNumberInstance(instance);
  };

  const onCountryDropdownClose = () => {
    const SelectedCountryData = phoneNumberInstance.getSelectedCountryData();
    const newPhoneNumberValue = {
      iso2: SelectedCountryData.iso2,
      dialCode: SelectedCountryData.dialCode,
      phone: "+" + SelectedCountryData.dialCode + "",
    };
    setPhoneNumberValue(newPhoneNumberValue);
  };

  const handleSubmitPhoneNumber = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const data = {
      phone: phoneNumberValue.phone,
      countryCode: phoneNumberValue.iso2.toUpperCase(),
    };
    validatePhoneNumberApi(data).then((data) => {
      // Data JSON
      //   {
      //     "callingCountryCode": null,
      //     "countryCode": null,
      //     "phoneNumber": "+84 84",
      //     "nationalFormat": "84",
      //     "valid": false,
      //     "validationErrors": [
      //         "TOO_SHORT"
      //     ],
      //     "callerName": null,
      //     "simSwap": null,
      //     "callForwarding": null,
      //     "liveActivity": null,
      //     "lineTypeIntelligence": null,
      //     "identityMatch": null,
      //     "reassignedNumber": null,
      //     "smsPumpingRisk": null,
      //     "disposablePhoneNumberRisk": null,
      //     "url": "http://lookups.twilio.com/v2/PhoneNumbers/%2084?CountryCode=VN"
      // }
      setError(data.validationErrors[0]);
      setFormSubmitData({
        phoneNumberNationFormat: data.nationalFormat,
        phoneNumber: data.phoneNumber,
        error: data.validationErrors[0],
      });
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (error === undefined) {
      console.log("NULL pass", error);
      handleValidPhoneNumber(formSubmitData);
    }
  }, [error]);

  return (
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
          onCountryDropdownClose={onCountryDropdownClose}
        />

        {!!error && (
          <span className="inline text-sm text-red-700">{error}</span>
        )}
      </div>

      <div>
        {isLoading ? (
          <BtnLoading
            disabled={true}
            className={"w-full justify-center rounded-md"}
          />
        ) : (
          <BtnPrimary text={"Next"} type={"submit"} className={"w-full"} />
        )}
      </div>
    </form>
  );
};

export default SignIn;
