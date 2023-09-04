import {
  Checkbox,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";

export function SocialPostSelectPlatform({ handleSelect }) {
  const [selectSocial, setSelectSocial] = useState({
    facebook: false,
    instagram: false,
    twitter: false,
  });
  const handleCheckSocial = async (e) => {
    const social = e.target.value;
    setSelectSocial({ ...selectSocial, [social]: !selectSocial[social] });
  };
  useEffect(() => {
    handleSelect(selectSocial);
  }, [selectSocial]);
  return (
    <Card className="w-full border-0 p-0 shadow-none">
      <List className="ml-[-0.5rem] flex-row justify-start p-0">
        <ListItem className="p-0">
          <label
            htmlFor="horizontal-list-react"
            className="flex w-full cursor-pointer items-center p-2"
          >
            <ListItemPrefix className="mr-1.5">
              <Checkbox
                id="horizontal-list-react"
                ripple={false}
                className="hover:before:opacity-0"
                // containerProps={{
                //   className: "p-0",
                // }}
                value={"facebook"}
                onChange={handleCheckSocial}
              />
            </ListItemPrefix>
            <Typography color="blue-gray" className="text-sm font-semibold">
              Facebook
            </Typography>
          </label>
        </ListItem>
        <ListItem className="p-0">
          <label
            htmlFor="horizontal-list-vue"
            className="flex w-full cursor-pointer items-center p-2"
          >
            <ListItemPrefix className="mr-1.5">
              <Checkbox
                id="horizontal-list-vue"
                ripple={false}
                className="hover:before:opacity-0"
                // containerProps={{
                //   className: "p-0",
                // }}
                value={"instagram"}
                onChange={handleCheckSocial}
              />
            </ListItemPrefix>
            <Typography color="blue-gray" className="text-sm font-semibold">
              Instagram
            </Typography>
          </label>
        </ListItem>
        <ListItem className="p-0">
          <label
            htmlFor="horizontal-list-svelte"
            className="flex w-full cursor-pointer items-center p-2"
          >
            <ListItemPrefix className="mr-1.5">
              <Checkbox
                id="horizontal-list-svelte"
                ripple={false}
                className="hover:before:opacity-0"
                // containerProps={{
                //   className: "p-0",
                // }}
                value={"twitter"}
                onChange={handleCheckSocial}
              />
            </ListItemPrefix>
            <Typography color="blue-gray" className="text-sm font-semibold">
              Twitter
            </Typography>
          </label>
        </ListItem>
      </List>
    </Card>
  );
}
