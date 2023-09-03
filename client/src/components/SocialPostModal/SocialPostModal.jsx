import { Button, Dialog, Spinner } from "@material-tailwind/react";
import React, { Children, useEffect, useState } from "react";
import { createFacebookPost } from "../../api/socialApi";
import Aos from "aos";

import toast, { Toaster } from "react-hot-toast";
import Toast from "../Toast";
import { SocialPostSelectPlatform } from "./SocialPostSelectPlatform";

export function SocialPostModal() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [selectSocial, setSelectSocial] = useState([]);
  useEffect(() => {
    Aos.init({
      duration: 150,
    });
  }, []);

  //   Handle modal
  const handleOpen = () => setOpen(!open);

  //   Handle form
  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    console.log(selectedImage);
    setImage(selectedImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if facebook is checked
    if (selectSocial.facebook) {
      setIsPosting(true);
      console.log("POSTING TO FACEOOK!");
      try {
        // Call the API function to post to Facebook
        const status = await createFacebookPost(image, caption, "+795442122");
        console.log(status.success);

        //   Show toasts
        if (status.success) {
          toast.custom(
            (t) => (
              <Toast
                type={"success"}
                description={"Your post was posted!"}
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                }  	m-auto box-border w-screen rounded-md shadow-sm ease-in-out lg:w-96`}
              />
            ),
            { duration: 700 }
          );
        } else {
          toast.custom(
            (t) => (
              <Toast
                type={"error"}
                description={"Please try again!"}
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                }  	m-auto box-border w-screen rounded-md shadow-sm ease-in-out lg:w-96`}
              />
            ),
            { duration: 700 }
          );
        }

        // Reset form fields or show a success caption
        setIsPosting(false);
        setCaption("");
        setImage(null);
      } catch (error) {
        console.error("Failed to post to Facebook:", error);
      }
    }
  };

  const handleSelectSocial = (selectSocialData) => {
    console.log(selectSocialData);
    setSelectSocial(selectSocialData);
  };

  return (
    <>
      <Button className="rounded-md" onClick={handleOpen}>
        Create A Post
      </Button>
      {/* <Button onClick={handleOpen} variant="gradient">
        Open Dialog
      </Button> */}

      <Dialog
        size="xs"
        open={open}
        // handler={handleOpen}
        className="xs:overflow-scroll h-fit rounded-lg py-6 shadow-none"
      >
        <Toaster position="top-center" reverseOrder={false} />
        <form className="p-8" onSubmit={handleSubmit}>
          <div className="">
            <div className=" border-b border-gray-900/10">
              <h2 className="text-xl font-semibold text-gray-900">
                Create a post
              </h2>
              <p className="mt-1 text-sm  text-gray-600">
                Enter your post detail and choose the social platform to
                publish!
              </p>

              <div className="mt-4 grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-6">
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
                      value={caption}
                      onChange={handleCaptionChange}
                    />
                  </div>
                  <p className=" text-xs leading-6 text-gray-600">
                    Write your copy.
                  </p>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="images"
                    className="mb-2 inline-block text-sm font-medium text-neutral-700 dark:text-neutral-200"
                  >
                    Your photos
                  </label>
                  <input
                    className="focus:border-primary focus:shadow-te-primary dark:focus:border-primary relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100"
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="images"
                    className="mb-1 inline-block text-sm font-medium text-neutral-700 dark:text-neutral-200"
                  >
                    Post to
                  </label>
                  <SocialPostSelectPlatform handleSelect={handleSelectSocial} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-3">
            <button
              type="reset"
              className="rounded-md px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all ease-in-out hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isPosting ? (
                <>
                  <Spinner className="mr-3" />
                  <span> Posting...</span>
                </>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
