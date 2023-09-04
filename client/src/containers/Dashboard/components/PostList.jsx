import React, { useEffect, useState } from "react";
import { createFavoritePostApi, getPostFacebook } from "../../../api/socialApi";
import SocialPost from "../../../components/SocialPost/SocialPost";
import NavbarDashboard from "./Navbar/Navbar";

function PostList(props) {
  const [socialPosts, setSocialPost] = useState([]); // Array[{created_time,full_picture,id,isFavorite,message,permalink_url,....}]

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
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, []);

  // Handle filter
  useEffect(() => {
    console.log("filter");
    if (socialPosts.length > 0) {
      switch (filter.type) {
        // FILTER BY NAME
        case "name": {
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
          setSocialPost(filterByName(socialPosts, filter.data));
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
              socialPosts,
              filter.data.startDate,
              filter.data.endDate
            )
          );
          break;
        }
        default:
          break;
      }
      console.log("Run filter");

      // FILTER BY SOCIAL ACCOUNT
    }
  }, [filter]);

  console.log(socialPosts);
  // Add post to favortie
  const handleClickFavorite = (id, social) => {
    createFavoritePostApi(skipliAccount.userPhoneNumber, social, id);
  };

  return (
    <div>
      <NavbarDashboard />
      <div className="xs:grid-cols-1 grid  gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* <div className="flex flex-wrap gap-4"> */}
        {/* <div className=" xs:columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"> */}
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
    </div>
  );
}

export default PostList;
