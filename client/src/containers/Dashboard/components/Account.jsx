import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import facebookLogo from "../../../assets/facebookLogo.svg";
import logo from "../../../assets/logo.svg";

export default function Account(props) {
  const { userAvatar, userName, socialType } = props;
  return (
    <Card className="w-full border border-gray-200 shadow-sm">
      <CardHeader shadow={false} floated={false} className="h-fit">
        {userAvatar || (
          <img src={facebookLogo} className="w-full p-6 text-white" />
        )}
      </CardHeader>
      <CardBody>
        <Typography color="blue-gray" className="mb-2 font-medium">
          {userName || socialType}
        </Typography>

        <Typography
          variant="small"
          color="gray"
          className="font-normal opacity-75"
        >
          With plenty of talk and listen time, voice-activated Siri access, and
          an available wireless charging case.
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <Button
          ripple={true}
          fullWidth={true}
          className="bg-blue-gray-900/10 text-blue-gray-900 border border-gray-200 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
        >
          {userName ? "LOG OUT" : "LOG IN"}
        </Button>
      </CardFooter>
    </Card>
  );
}
