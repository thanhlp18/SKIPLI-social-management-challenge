import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Button, Input, Navbar } from "@material-tailwind/react";
import { useState } from "react";
import CollapseBtn from "../../../../components/CollapseBtn/CollapseBtn";
import { SocialPostModal } from "../../../../components/SocialPostModal/SocialPostModal";
// import FacebookPostForm from "../../../../components/SocialPostModal/SocialPostModal copy";

export default function NavbarDashboard() {
  const [socialAccount, setSocialAccount] = useState([]);
  const [isCreatePost, SetIsCreatePost] = useState(false);

  const socialExample = [
    {
      avatar:
        "https://i.pinimg.com/originals/92/71/3d/92713d2c2307d12678e237a56b3f2092.jpg",
      social: "facebook",
      name: "Le Phuoc Thanh",
    },
    {
      avatar:
        "https://i.pinimg.com/originals/92/71/3d/92713d2c2307d12678e237a56b3f2092.jpg",
      social: "facebook",
      name: "Le Phuoc Thanh",
    },
  ];
  console.log(isCreatePost);
  return (
    <Navbar className=" flex  flex-col  items-start justify-between gap-3 rounded-none  border border-gray-200 px-4 py-3 shadow-none">
      {/* Social account circle start*/}
      {/* <div className="flex w-full items-center justify-between gap-1">
        <div>
         
          <SociaLoginButton />
          {socialExample.map((ele, index) => (
            <Button
              className="ms-1 rounded-full border border-black bg-transparent p-0 shadow-none"
              key={index}
            >
              <Avatar
                src={ele.avatar}
                alt={ele.name}
                withBorder={true}
                className="h-10 w-10 p-0.5 "
                size="md"
              />
            </Button>
          ))}
        </div>
        
        <ButtonGroup variant="outlined" size="sm">
          <Button className="rounded-s-md">Facebook</Button>
          <Button>Twitter</Button>
          <Button className="rounded-e-md ">Instagram</Button>
        </ButtonGroup>
      </div> */}
      {/* Social account start */}

      <div className="flex w-full items-start justify-between">
        <div className="flex flex-wrap items-start justify-start gap-4 text-blue-950">
          <div className="relative flex w-full gap-2 md:w-max">
            <Input
              type="search"
              label="Search here..."
              variant="standard"
              className="border-none pr-12  "
              containerProps={{
                className: "min-w-[288px]",
              }}
            />

            <Button
              size="sm"
              className="!absolute right-0 top-2.5 rounded-md bg-transparent bg-white shadow-none hover:shadow-none"
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-black" />
            </Button>
          </div>
          <CollapseBtn
            label={"Filter"}
            btnClass="rounded-md"
            cardClass={"border border-gray-50 "}
          >
            fasdf
          </CollapseBtn>
        </div>
        <div className="ml-auto ">
          <SocialPostModal />
          {/* <FacebookPostForm /> */}
        </div>
      </div>
    </Navbar>
  );
}
