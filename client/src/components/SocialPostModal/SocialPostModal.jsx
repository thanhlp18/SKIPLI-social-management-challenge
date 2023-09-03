import React from "react";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
} from "@material-tailwind/react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export function SocialPostModal(props) {
  const { isOpen } = props;

  return (
    <>
      <Dialog
        size="xs"
        open={isOpen}
        // handler={handleOpen}
        className="h-96 overflow-y-scroll rounded-lg py-6 shadow-none"
      >
        <form
          className="p-4"
          action="https://graph.facebook.com/111155454937614/photos?access_token=EAAEcuG4pLgUBOZCOJ9HSy2rBWbDqFuKq1x7Aj9BnCF78fByiv04ZAcxsYu9v3sxe0abyomyHcDOi6pEvZC7ObHiDPwbNgXTjkRkeTV1WLVIEv6HgQi9RWZBGNQOj30TdQ2de2VBYo7pol2E9ZCpGW2yZBJZBzw25dOAYzLOzon0lP9jKq2ZCq6QbeQLuTVUzNLrhI41C4RyvmKKUXDZB67FL8zCdMJFEZD"
          method="POST"
        >
          <div className="">
            <div className=" border-b border-gray-900/10">
              <h2 className="text-base font-semibold  text-gray-900">
                Create a post
              </h2>
              <p className="mt-1 text-sm  text-gray-600">
                Enter your post detail and choose the social platform to
                publish!
              </p>

              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="caption"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Your caption
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="caption"
                      name="caption"
                      rows={5}
                      className="focus:border-primary focus:shadow-te-primary dark:focus:border-primary relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base text-sm font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100"
                      defaultValue={""}
                    />
                  </div>
                  <p className=" text-xs leading-6 text-gray-600">
                    Write your copy.
                  </p>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="images"
                    className="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
                  >
                    Your photos
                  </label>
                  <input
                    name="images"
                    className="focus:border-primary focus:shadow-te-primary dark:focus:border-primary relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100"
                    type="file"
                    id="images"
                    accept="image/png, image/jpeg"
                    multiple
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
