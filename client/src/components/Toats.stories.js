import Toasts from "./Toasts";

export default {
  title: "Global/Toasts",
  component: Toasts,
  // ...
};

export const success = {
  args: {
    type: "success",
    description: "OTP has been sent to you!",
  },
};
