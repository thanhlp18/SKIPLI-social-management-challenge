import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  Button,
  List,
  ListItem,
  ListItemPrefix,
  Navbar,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import Select from "react-select";
import { SocialPostModal } from "../../../../components/SocialPostModal/SocialPostModal";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import Datepicker from "react-tailwindcss-datepicker";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

export default function NavbarDashboard(props) {
  const { onFilter, accountList } = props;
  const [filter, setFilter] = useState({ type: "name", data: "" });
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const handleFilterSearch = (e) => {
    setFilter({ type: "name", data: e.target.value });
    onFilter({ type: "name", data: e.target.value });
    setDateRange({
      startDate: null,
      endDate: null,
    });
  };

  const handleFilterSocialId = (selectObject) => {
    const selectsValue = selectObject.map((select) => select.value);
    if (selectsValue.length > 0) {
      setFilter({ type: "socialID", data: selectsValue });
      onFilter({ type: "socialID", data: selectsValue });
    } else {
      setFilter({ type: "name", data: "" });
      onFilter({ type: "name", data: "" });
    }
  };

  const handleFilterDateRange = (newValue) => {
    setDateRange(newValue);
    console.log(filter);
    console.log("new Value: ", newValue);
    if (!newValue.startDate && !newValue.endDate) {
      setFilter({ type: "name", data: "" });
      onFilter({ type: "name", data: "" });
    } else {
      setFilter({ type: "date", data: newValue });
      onFilter({ type: "date", data: newValue });
    }
  };

  console.log("render");
  return (
    <Navbar className=" relative z-20 flex flex-col  items-start justify-between gap-3 rounded-none border border-gray-200 px-4 py-3 shadow-none">
      <div className="flex w-full items-start justify-between gap-4">
        <div className="grid flex-1 grid-rows-2 items-start justify-start gap-4 text-blue-950">
          {/* Search box and option */}
          <div className=" grid grid-cols-2 gap-4 md:w-max  ">
            <div className="relative">
              <input
                type="search"
                label="Search here..."
                variant="standard"
                placeholder="🔍🌟 Enter your word to search! 🌟🔎"
                className={
                  "w-100 min-w-[288px] rounded-md border border-gray-300 pr-12 shadow-sm"
                }
                onInput={handleFilterSearch}
              />

              <Button
                size="sm"
                className="!absolute right-0 top-1 rounded-md bg-transparent  shadow-none hover:shadow-none"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-black" />
              </Button>
            </div>
            <List className="ml-[-0.5rem] flex-row justify-start p-0">
              <ListItem className="w-fit p-0">
                <label
                  htmlFor="filter-caption"
                  className="flex w-full cursor-pointer items-center p-2"
                >
                  <ListItemPrefix className="mr-1.5">
                    <input
                      id="filter-caption"
                      name="filter"
                      type="radio"
                      className="hover:before:opacity-0"
                      // containerProps={{
                      //   className: "p-0",
                      // }}
                      defaultChecked={true}
                      onClick={() => setFilter({ ...filter, type: "name" })}
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
            </List>
          </div>

          {/* Search by account id */}
          {/* Search by date range */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              isMulti
              name="colors"
              options={accountList}
              className="basic-multi-select z-999 w-96"
              classNamePrefix="select"
              // getOptionValue={getOptionsValue}
              placeholder={"Select social accounts"}
              onChange={handleFilterSocialId}
            />

            <Datepicker
              useRange={false}
              primaryColor={"blue"}
              value={dateRange}
              onChange={handleFilterDateRange}
              placeholder={"Filter by date range"}
              separator={"-"}
              showShortcuts={true}
              showFooter={true}
              containerClassName={"w-64 relative"}
              inputClassName={
                "w-64 rounded-md border-gray-300 p-1.5 pl-3 pr-8 "
              }
            />
            {/* <CalendarDaysIcon className="absolute right-0 h-6 w-6" /> */}
          </div>
        </div>
        <div className="">
          <SocialPostModal />
          {/* <FacebookPostForm /> */}
        </div>
      </div>
    </Navbar>
  );
}
