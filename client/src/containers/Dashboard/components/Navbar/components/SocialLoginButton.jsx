import { PlusIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  MenuItem,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import FacebookLoginBtn from "../../../../../components/FacebookLogin/FacebookLoginBtn";
export default function SociaLoginButton() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen((cur) => !cur);

  return (
    <>
      {/* <Button onClick={handleOpen}>Connect Wallet</Button> */}
      <Button
        className="inline rounded-full border border-black bg-transparent p-0 shadow-none"
        onClick={handleOpen}
      >
        <PlusIcon className="inline  h-10 w-10 p-2 text-black" />
      </Button>
      <Dialog size="xs" open={open} handler={handleOpen} className="">
        <DialogHeader className=" justify-between">
          <Typography variant="h5" color="blue-gray">
            Connect to social platform
          </Typography>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={handleOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>
        <DialogBody className=" overflow-y-scroll pr-2">
          <div className="mb-6">
            <ul className="-ml-2 mt-1 flex flex-col gap-1">
              <MenuItem className="flex items-center gap-3">
                <FacebookLoginBtn className="w-full" />
              </MenuItem>
            </ul>
          </div>
        </DialogBody>
        <DialogFooter className="border-blue-gray-50  justify-between gap-2 border-t">
          <Typography variant="small" color="gray" className="font-normal">
            Learn to manage your socail account?
          </Typography>
          <Button variant="text" size="sm">
            Learn More
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
