import {
  ArrowLeftOnRectangleIcon,
  AtSymbolIcon,
  Square2StackIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  Chip,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Typography,
} from "@material-tailwind/react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navagte = useNavigate();

  return (
    <Card className="shadow-blue-gray-900/5 h-screen w-full rounded-none border border-gray-200 p-4 shadow-none">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Skipli Project
        </Typography>
      </div>
      <List>
        <ListItem
          className={
            location.pathname === "/posts" ? "bg-gray-900 text-white" : ""
          }
          onClick={() => navagte("/posts")}
        >
          <ListItemPrefix>
            <Square2StackIcon className="h-5 w-5" />
          </ListItemPrefix>
          All Post
          <ListItemSuffix>
            <Chip
              value="14"
              size="sm"
              variant="ghost"
              color="blue-gray"
              className="rounded-full"
            />
          </ListItemSuffix>
        </ListItem>
        <ListItem
          className={
            location.pathname === "/accounts" ? "bg-gray-900 text-white" : ""
          }
          onClick={() => navagte("/accounts")}
        >
          <ListItemPrefix>
            <AtSymbolIcon className="h-5 w-5" />
          </ListItemPrefix>
          Accounts
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Sign Out
        </ListItem>
      </List>
    </Card>
  );
}
