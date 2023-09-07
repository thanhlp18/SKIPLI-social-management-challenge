import React, { useEffect, useState } from "react";
import {
  createFavoritePostApi,
  getPostFacebook,
  getSocialAccountLoginStatus,
} from "../../../api/socialApi";
import SocialPost from "../../../components/SocialPost/SocialPost";
import NavbarDashboard from "./Navbar/Navbar";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";

function PostList(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [socialPosts, setSocialPost] = useState([]); //-----> Expect: Array[{id, caption, mediaUrl, isFavorite, timestamp, permalink},...]
  const [initialPosts, setInitialPosts] = useState([]); //-----> Expect: Array[{id, caption, mediaUrl, isFavorite, timestamp, permalink},...]
  const [accountList, setAccountList] = useState();
  const [filter, setFilter] = useState({ type: "", data: "" });
  console.log("initial post: ", initialPosts);
  const skipliAccount = JSON.parse(localStorage.getItem("skipliAccount"));

  // Check whether use login skipli account, if false, navigate use to login page
  useEffect(() => {
    if (skipliAccount) {
      const fetchData = async () => {
        try {
          const response = await getSocialAccountLoginStatus(
            skipliAccount.userPhoneNumber
          );
          var isLoginSocial = false;
          response.map((social, index) => {
            if (social.isLogin) {
              isLoginSocial = true;
            }
          });
          // If user doen't login any social account, navigate them to accounts list
          if (!isLoginSocial) navigate("/accounts");
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, []);

  // Get posts from api
  useEffect(() => {
    if (skipliAccount) {
      console.log("runn");
      const fetchData = async () => {
        try {
          const response = await getPostFacebook(skipliAccount.userPhoneNumber);
          console.log("DATA:", response);
          console.log(response);
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
              if (post.caption) {
                const postCaption = post.caption.toLowerCase();
                return postCaption.includes(searchTerm);
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
              const postDate = new Date(post.createTime);
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
  const handleClickFavorite = (id, socialPlatform, isSateFavorite) => {
    createFavoritePostApi(
      skipliAccount.userPhoneNumber,
      socialPlatform,
      id,
      isSateFavorite
    );
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

  console.log(socialPosts);

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
          {socialPosts.map((post, index) => {
            return (
              <SocialPost
                key={`social-post-${index}`}
                pageData={{
                  social: post.socialPlatform,
                  socialID: post.socialID,
                  socialName: post.socialName,
                }}
                media={
                  post?.mediaUrl && (
                    <img
                      src={post.mediaUrl}
                      // className="h-60 w-full object-cover object-center transition-all duration-300 ease-out hover:object-contain"
                      className=" h-60 w-full object-cover object-center transition-all duration-300  ease-out  hover:bg-gray-200 hover:object-contain"
                      alt={`${post.socialPlatform} social post`}
                    />
                  )
                }
                copy={post.description || post.caption || post.message}
                handleClickFavorite={handleClickFavorite}
                postId={post?.id || null}
                isFavorite={post.isFavorite}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PostList;
