import React, { useEffect, useState } from "react";
import { createFavoritePostApi, getPostFacebook } from "../../../api/socialApi";
import SocialPost from "../../../components/SocialPost/SocialPost";
import NavbarDashboard from "./Navbar/Navbar";
import ReactLoading from "react-loading";

function PostList(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [socialPosts, setSocialPost] = useState([]); // Array[{created_time,full_picture,id,isFavorite,message,permalink_url,socialID,socialName,socialPlatform....}]
  const [initialPosts, setInitialPosts] = useState([]); // Array[{created_time,full_picture,id,isFavorite,message,permalink_url,....}]
  const [accountList, setAccountList] = useState();
  const [filter, setFilter] = useState({ type: "", data: "" });

  const skipliAccount = JSON.parse(localStorage.getItem("skipliAccount"));

  // Get facebook post from api
  useEffect(() => {
    if (skipliAccount) {
      const fetchData = async () => {
        try {
          const response = await getPostFacebook(skipliAccount.userPhoneNumber);
          // console.log("DATA:", response.posts);
          setSocialPost(response);
          setInitialPosts(response);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, []);

  // Handle filter
  useEffect(() => {
    if (initialPosts.length > 0) {
      switch (filter.type) {
        // FILTER BY NAME
        case "name": {
          console.log("filter by name ", filter.type);
          function filterByName(socialPostArray, searchTerm) {
            // Convert the searchTerm to lowercase for case-insensitive search
            searchTerm = searchTerm.toLowerCase();

            return socialPostArray.filter((post) => {
              console.log(post);
              if (post.message) {
                const postMessage = post.message.toLowerCase();
                return postMessage.includes(searchTerm);
              }

              return false;
            });
          }
          setSocialPost(filterByName(initialPosts, filter.data));
          break;
        }
        // FILTER BY RANGE
        case "date": {
          function filterByDateRange(socialPostArray, startDate, endDate) {
            console.log("socialPostArray: ", socialPostArray);
            return socialPostArray.filter((post) => {
              const postDate = new Date(post.created_time);
              const start = startDate ? new Date(startDate) : null;
              const end = endDate ? new Date(endDate) : null;

              if (!start || !end) {
                return false; // Return false if either start or end date is missing
              }

              // To compare dates, set the time of day to midnight
              start.setHours(0, 0, 0, 0);
              end.setHours(0, 0, 0, 0);
              postDate.setHours(0, 0, 0, 0);

              return postDate >= start && postDate <= end;
            });
          }

          setSocialPost(
            filterByDateRange(
              initialPosts,
              filter.data.startDate,
              filter.data.endDate
            )
          );
          console.log("social posts", socialPosts);

          break;
        }
        // FILTER BY SOCIAL ACCOUNT
        case "socialID": {
          function filterBySocialID(socialPostArray, selectSocial) {
            console.log(socialPostArray);
            // Ensure that valueID is an array
            if (!Array.isArray(selectSocial)) {
              return [];
            }

            // Convert the search values to lowercase for case-insensitive search
            const lowercasedSelectID = selectSocial.map((id) =>
              id.toLowerCase()
            );

            return socialPostArray.filter((post) => {
              if (post.socialID) {
                const socialID = post.socialID.toLowerCase();
                // Use `includes` or `some` to check if the postSocialID is in the array
                return lowercasedSelectID.includes(socialID);
              }

              return false;
            });
          }
          // console.log(socialPostArray);
          setSocialPost(filterBySocialID(initialPosts, filter.data));
          break;
        }
        default:
          break;
      }
    }
  }, [filter]);

  // Add post to favortie
  const handleClickFavorite = (id, social) => {
    createFavoritePostApi(skipliAccount.userPhoneNumber, social, id);
  };

  // Get social account
  useEffect(() => {
    const accountsObject = {};
    initialPosts.forEach((post, index) => {
      if (!accountsObject[post.socialID]) {
        accountsObject[post.socialID] = post.socialName;
      }
      //
    });
    const accountArray = Object.keys(accountsObject).map((socialID, index) => ({
      label: accountsObject[socialID],
      value: socialID,
    }));
    setAccountList(accountArray);
  }, [initialPosts]);

  return (
    <div className="h-full w-full">
      <NavbarDashboard
        onFilter={setFilter}
        className="z-50"
        accountList={accountList}
      />
      {isLoading ? (
        <div className=" flex h-[75%] w-full flex-col items-center justify-center ">
          <ReactLoading color={"#000"} height={"8rem"} width={"8rem"} />
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="font-medium">Get ready for some awesomeness!</span>
            <span>Your post is coming to you 💌🌟🚀✨</span>
          </div>
        </div>
      ) : (
        <div className="xs:grid-cols-1 z-0 grid  gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {socialPosts.map((post, index) => (
            <SocialPost
              pageData={{
                social: post.socialPlatform,
                socialID: post.socialID,
                socialName: post.socialName,
              }}
              media={
                post?.full_picture && (
                  <img
                    src={post.full_picture}
                    // className="h-60 w-full object-cover object-center transition-all duration-300 ease-out hover:object-contain"
                    className=" h-60 w-full object-cover object-center transition-all duration-300  ease-out  hover:bg-gray-200 hover:object-contain"
                    alt={`${post.socialPlatform} social post`}
                  />
                )
              }
              copy={post.description || post.caption || post.message}
              key={`social-post-${index}`}
              handleClickFavorite={handleClickFavorite}
              postId={post.id}
              isFavorite={post.isFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PostList;
