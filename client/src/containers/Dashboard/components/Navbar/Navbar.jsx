import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Checkbox,
  Input,
  List,
  ListItem,
  ListItemPrefix,
  Navbar,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import CollapseBtn from "../../../../components/CollapseBtn/CollapseBtn";
import { SocialPostModal } from "../../../../components/SocialPostModal/SocialPostModal";
// import FacebookPostForm from "../../../../components/SocialPostModal/SocialPostModal copy";

export default function NavbarDashboard(props) {
  const { onFilter } = props;
  const [socialAccount, setSocialAccount] = useState([]);

  const [filter, setFilter] = useState({ type: "name", data: "" });

  const handleFilter = (e) => {
    setFilter({ ...filter, data: e.target.value });
    onFilter({ ...filter, data: e.target.value });
  };
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
            <input
              type="search"
              label="Search here..."
              variant="standard"
              className="border-none pr-12  "
              containerProps={{
                className: "min-w-[288px]",
              }}
              onInput={handleFilter}
            />

            <Button
              size="sm"
              className="!absolute right-0 top-2.5 rounded-md bg-transparent bg-white shadow-none hover:shadow-none"
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-black" />
            </Button>
          </div>
          <CollapseBtn label={"Filter"} btnClass="rounded-md">
            <List className="ml-[-0.5rem] flex-row justify-start p-0">
              <ListItem className="w-fit p-0">
                <label
                  htmlFor="filter-caption"
                  className="flex w-full cursor-pointer items-center p-2"
                >
                  <ListItemPrefix className="mr-1.5">
                    <input
                      id="filter-caption"
                      ripple={false}
                      name="filter"
                      type="radio"
                      className="hover:before:opacity-0"
                      containerProps={{
                        className: "p-0",
                      }}
                      defaultChecked={true}
                    />
                  </ListItemPrefix>

                  <Typography
                    color="blue-gray"
                    className="text-sm font-semibold"
                  >
                    by caption
                  </Typography>
                </label>
              </ListItem>
              <ListItem className="w-fit p-0">
                <label
                  htmlFor="filter-social-account"
                  className="flex w-full cursor-pointer items-center p-2"
                >
                  <ListItemPrefix className="mr-1.5">
                    <input
                      id="filter-social-account"
                      name="filter"
                      type="radio"
                      ripple={false}
                      className="hover:before:opacity-0"
                      containerProps={{
                        className: "p-0",
                      }}
                    />
                  </ListItemPrefix>

                  <Typography
                    color="blue-gray"
                    className="text-sm font-semibold"
                  >
                    by social account id
                  </Typography>
                </label>
              </ListItem>
            </List>
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
