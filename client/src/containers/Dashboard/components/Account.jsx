import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import facebookLogo from "../../../assets/facebook-logo.svg";
import instagramLogo from "../../../assets/instagram-logo.svg";
import twitterLogo from "../../../assets/twitter-logo.svg";
import FacebookLoginBtn from "../../../components/FacebookLogin/FacebookLoginBtn";
import LoginSocialFacebook from "../../../components/FacebookLogin/LoginSocialFacebook";
import { useState } from "react";
import InstagramLoginBtn from "../../../components/FacebookLogin/InstagramLoginBtn";

export default function Account(props) {
  const { profileImage, userName, socialPlatform = "facebook" } = props;
  const [loginStatus, setLoginStatus] = useState(false);
  const social = {
    facebook: {
      name: "Facebook",
      description:
        "Schedule posts, analyze engagement, and automate tasks with ease.",
      logo: facebookLogo,
      loginBtn: (
        <FacebookLoginBtn
          className="w-full overflow-hidden rounded-full p-0 "
          onLogin={setLoginStatus}
        />
      ),
      logoutBtn: (
        <Button
          // ripple={true}
          fullWidth={true}
          variant="filled"
          className="rounded-none rounded-b-lg border border-gray-200  shadow-none  hover:opacity-90 hover:shadow-none focus:shadow-none active:scale-100"
        >
          {"LOG OUT"}
        </Button>
      ),
    },
    instagram: {
      name: "Instagram",
      description:
        "Schedule posts, analyze engagement, and automate tasks with ease.",
      logo: instagramLogo,
      loginBtn: (
        <InstagramLoginBtn
          className="w-full overflow-hidden rounded-full p-0 "
          onLogin={setLoginStatus}
        />
      ),
      logoutBtn: (
        <Button
          // ripple={true}
          fullWidth={true}
          variant="filled"
          className="rounded-none rounded-b-lg border border-gray-200  shadow-none  hover:opacity-90 hover:shadow-none focus:shadow-none active:scale-100"
        >
          {"LOG OUT"}
        </Button>
      ),
    },
    twitter: {
      name: "Twitter",
      description:
        "Schedule posts, analyze engagement, and automate tasks with ease.",
      logo: twitterLogo,
      loginBtn: (
        <FacebookLoginBtn
          className="w-full overflow-hidden rounded-full p-0 "
          onLogin={setLoginStatus}
        />
      ),
      logoutBtn: (
        <Button
          // ripple={true}
          fullWidth={true}
          variant="filled"
          className="rounded-none rounded-b-lg border border-gray-200  shadow-none  hover:opacity-90 hover:shadow-none focus:shadow-none active:scale-100"
        >
          {"LOG OUT"}
        </Button>
      ),
    },
  };
  return (
    <Card className="justify w-full border border-gray-200 shadow-sm">
      <CardHeader shadow={false} floated={false} className="h-fit p-4">
        <img
          src={social[socialPlatform].logo}
          className="w-full  px-2 text-white"
          alt="socail platform logo"
        />
      </CardHeader>
      <CardBody className="flex flex-1 flex-col gap-2 p-4">
        <Typography color="blue-gray" className="font-medium">
          {social[socialPlatform].name}
        </Typography>
        {userName && (
          <Tooltip content={userName}>
            <Button
              variant="outlined"
              className="flex w-full items-center  p-1 "
            >
              <img
                src={profileImage || ""}
                className="h-6 w-6 rounded-full  p-0 text-white"
                alt="facebook user avatar"
              />
              <p className="line-clamp-1 w-full overflow-hidden ps-2 text-left text-xs capitalize">
                {userName}
              </p>
            </Button>
          </Tooltip>
        )}

        <span className=" flex-1 text-xs font-normal opacity-75">
          Schedule posts, analyze engagement, and automate tasks with ease.
        </span>
      </CardBody>
      <CardFooter className="p-0 pt-0  ">
        {userName
          ? social[socialPlatform].logoutBtn
          : social[socialPlatform].loginBtn}
      </CardFooter>
    </Card>
  );
}
