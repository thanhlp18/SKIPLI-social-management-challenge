import React, { useEffect, useState } from "react";
import { createFavoritePostApi, getPostFacebook } from "../../../api/socialApi";
import SocialPost from "../../../components/SocialPost/SocialPost";
import NavbarDashboard from "./Navbar/Navbar";
import ReactLoading from "react-loading";

function PostList(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [socialPosts, setSocialPost] = useState([]); // Array[{created_time,full_picture,id,isFavorite,message,permalink_url,....}]
  const [initialPosts, setInitialPosts] = useState([]); // Array[{created_time,full_picture,id,isFavorite,message,permalink_url,....}]

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
            return socialPostArray.filter((post) => {
              const postDate = new Date(post.created_time);
              const start = startDate ? new Date(startDate) : null;
              const end = endDate ? new Date(endDate) : null;

              // Check if the post's date is within the specified range
              if (start && end) {
                return postDate >= start && postDate <= end;
              } else if (start) {
                return postDate >= start;
              } else if (end) {
                return postDate <= end;
              }

              return false; // No date range specified, return false
            });
          }
          setSocialPost(
            filterByDateRange(
              initialPosts,
              filter.data.startDate,
              filter.data.endDate
            )
          );
          break;
        }
        // FILTER BY SOCIAL ACCOUNT
        case "socialID": {
          function filterBySocialID(socialPostArray, id) {
            // Convert the searchTerm to lowercase for case-insensitive search
            id = id.toLowerCase();

            return socialPostArray.filter((post) => {
              if (post.postSocialID) {
                const postSocialID = post.message.toLowerCase();
                return postSocialID.equals(id);
              }

              return false;
            });
          }
          break;
        }
        default:
          break;
      }
    }
  }, [filter]);
  console.log("Initial POST: ", initialPosts);
  console.log("Render POST: ", socialPosts);
  // Add post to favortie
  const handleClickFavorite = (id, social) => {
    createFavoritePostApi(skipliAccount.userPhoneNumber, social, id);
  };
  console.log(filter);
  return (
    <div className="h-full w-full">
      <NavbarDashboard onFilter={setFilter} />
      {isLoading ? (
        <div className=" flex h-[75%] w-full flex-col items-center justify-center ">
          <ReactLoading color={"#000"} height={"8rem"} width={"8rem"} />
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="font-medium">Get ready for some awesomeness!</span>
            <span>Your post is coming to you 💌🌟🚀✨</span>
          </div>
        </div>
      ) : (
        <div className="xs:grid-cols-1 grid  gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
