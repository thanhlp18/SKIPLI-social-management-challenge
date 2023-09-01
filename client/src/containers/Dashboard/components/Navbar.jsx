import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  Button,
  ButtonGroup,
  Input,
  Navbar,
} from "@material-tailwind/react";
import CollapseBtn from "../../../components/CollapseBtn/CollapseBtn";

export default function NavbarDashboard() {
  return (
    <Navbar className="mx-auto flex max-w-screen-xl flex-col items-start justify-between gap-3 rounded-none  border border-gray-200 px-4 py-3 shadow-none">
      <div className="flex w-full items-center justify-between gap-1">
        {/* Social account circle start*/}
        <div>
          <Button className="inline rounded-full border border-black bg-transparent p-0 shadow-none">
            <PlusIcon className="inline  h-10 w-10 p-2 text-black" />
          </Button>
          <Button className="rounded-full border border-black bg-transparent p-0 shadow-none">
            <Avatar
              src="https://i.pinimg.com/originals/92/71/3d/92713d2c2307d12678e237a56b3f2092.jpg"
              alt="avatar"
              withBorder={true}
              className="h-10 w-10 p-0.5 "
              size="md"
            />
          </Button>
          <Button className="rounded-full border border-black bg-transparent p-0 shadow-none">
            <Avatar
              src="https://i.pinimg.com/originals/92/71/3d/92713d2c2307d12678e237a56b3f2092.jpg"
              alt="avatar"
              withBorder={true}
              className="h-10 w-10 p-0.5 "
              size="md"
            />
          </Button>
          <Button className="rounded-full border border-black bg-transparent p-0 shadow-none">
            <Avatar
              src="https://i.pinimg.com/originals/92/71/3d/92713d2c2307d12678e237a56b3f2092.jpg"
              alt="avatar"
              withBorder={true}
              className="h-10 w-10 p-0.5 "
              size="md"
            />
          </Button>
        </div>
        {/* Social account circle end*/}
        {/* Social account filter */}
        <ButtonGroup variant="outlined" size="sm">
          <Button className="rounded-s-md">One</Button>
          <Button>Two</Button>
          <Button className="rounded-e-md ">Three</Button>
        </ButtonGroup>
        {/* Social account start */}
      </div>

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
          <Button className="rounded-md">Create A Post</Button>
        </div>
      </div>
    </Navbar>
  );
}
