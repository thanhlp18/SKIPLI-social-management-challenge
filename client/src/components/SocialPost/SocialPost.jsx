import {
  BookmarkIcon as BookmarkIconInActive,
  ChartBarIcon,
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowPathRoundedSquareIcon,
  ArrowUturnRightIcon,
  BookmarkIcon as BookmarkIconActive,
} from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import clsx from "clsx";
import { useState } from "react";
import IconGroup from "./components/IconGroup";

// SocialPost.propTypes = {
//   media: PropTypes.element,
//   copy: PropTypes.element,
//   social: PropTypes.oneOf(["facebook", "instagram", "twitter"]),
//   user: PropTypes.object,
// };

export default function SocialPost(props) {
  const {
    media,
    copy,
    social,
    user,
    className,
    postId,
    isFavorite,
    handleClickFavorite,
  } = props;
  const socialReactions = {
    facebook: [
      {
        type: "Like",
        icon: (
          <HandThumbUpIcon className="sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5 " />
        ),
        data: "100",
      },
      {
        type: "Comment",
        icon: (
          <ChatBubbleLeftIcon className="sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5  " />
        ),
        data: "20",
      },
      {
        type: "Share",
        icon: (
          <ArrowUturnRightIcon className="sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5  " />
          // <ArrowPathRoundedSquareIcon className="sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5  " />
        ),
        data: "1",
      },
    ],
    instagram: [
      {
        type: "Like",
        icon: (
          <HeartIcon className="sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5 " />
        ),
        data: "100",
      },
      {
        type: "Comment",
        icon: (
          <ChatBubbleLeftIcon className="sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5  " />
        ),
        data: "20",
      },
    ],
    twitter: [
      {
        type: "Like",
        icon: (
          <HandThumbUpIcon className="sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5 " />
        ),
        data: "100",
      },
      {
        type: "Reply",
        icon: (
          <ChatBubbleLeftIcon className="sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5  " />
        ),
        data: "20",
      },
      {
        type: "Repost",
        icon: (
          <ArrowPathRoundedSquareIcon className="sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5  " />
        ),
        data: "1",
      },
      {
        type: "View",
        icon: (
          <ChartBarIcon className="sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5  " />
        ),
        data: "1",
      },
    ],
  };

  const [isSateFavorite, setIsStateFavorite] = useState(isFavorite);

  const onClickFavorite = (id, social) => {
    console.log("BEFORE CLICK: ", isSateFavorite);

    setIsStateFavorite(!isSateFavorite);
    // When click is favorite (isSateFavorite = true)
    if (!isSateFavorite) handleClickFavorite(id, social);
  };
  return (
    // <Card className="w-full max-w-[16rem]  break-before-column rounded-none border border-gray-100 shadow-sm">
    <Card
      className={clsx(
        "w-full max-w-[16rem] break-inside-avoid-column rounded-none border border-gray-100 shadow-sm	",
        className
      )}
    >
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 rounded-none"
      >
        <div className=" flex items-center justify-between">
          <Tooltip
            content={
              <span className="ps-1   font-normal">
                {social} | @{user.username}
              </span>
            }
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 25 },
            }}
          >
            <Typography
              variant="h5"
              color="blue-gray"
              className="cursor-pointer p-2 text-xs font-medium text-black"
            >
              {user.fullname}
            </Typography>
          </Tooltip>
          {/* <CollapseBtn
            label={<EllipsisVerticalIcon className="h-5 w-5 text-black" />}
            btnClass={"bg-transparent shadow-none hover:shadow-none p-2"}
            collapseClass={" top-full absolute"}
            cardClass={"border border-gray-50 rounded-none"}
          /> */}
        </div>
        {media ? media : ""}
      </CardHeader>
      <CardBody className="px-4 py-2">
        {/* Start social reaction  */}
        <div className="flex  items-center justify-between ">
          <div className="flex items-center justify-start sm:gap-4 lg:gap-2 xl:gap-3">
            {socialReactions[social].map((ele, index) => {
              return (
                <IconGroup
                  icon={ele.icon}
                  data={ele.data}
                  type={ele.type}
                  key={`social-reaction-facebook-${index}`}
                  className="py-2"
                />
              );
            })}
          </div>
          <Button
            variant="text"
            className="p-0"
            onClick={() => onClickFavorite(postId, social)}
          >
            <IconGroup
              icon={
                isSateFavorite ? (
                  <BookmarkIconActive className="sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                ) : (
                  <BookmarkIconInActive className="sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                )
              }
              type={"Favorite"}
              className="p-2"
            />
          </Button>

          {/* End social reaction  */}

          {/* Start social post content */}
        </div>
        <p className="line-clamp-5 text-sm text-gray-500">{copy ? copy : ""}</p>
        {/* End social post content */}
      </CardBody>
      {/* <CardFooter className="pt-0">fads</CardFooter> */}
    </Card>
  );
}
