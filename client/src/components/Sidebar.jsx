import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  Square2StackIcon,
  AtSymbolIcon,
  ArrowDownLeftIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";

export default function Sidebar() {
  return (
    <Card className="shadow-blue-gray-900/5 h-screen w-full max-w-[20rem] rounded-none border border-gray-200 p-4 shadow-none">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Skipli Project
        </Typography>
      </div>
      <List>
        <ListItem>
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
        <ListItem>
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
