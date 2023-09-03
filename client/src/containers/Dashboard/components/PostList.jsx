import React, { useEffect, useState } from "react";
import { createFavoritePostApi, getPostFacebook } from "../../../api/socialApi";
import SocialPost from "../../../components/SocialPost/SocialPost";
import NavbarDashboard from "./Navbar/Navbar";

function PostList(props) {
  const [socialPosts, setSocialPost] = useState([]);
  const [pageData, setPageData] = useState({ username: "", fullname: "" });

  const skipliAccount = JSON.parse(localStorage.getItem("skipliAccount"));

  useEffect(() => {
    if (skipliAccount) {
      const fetchData = async () => {
        try {
          const response = await getPostFacebook(skipliAccount.userPhoneNumber);
          // console.log("DATA:", response.posts);
          setSocialPost(response.posts);
          setPageData({
            social: response.pageData.social,
            username: response.pageData.id,
            name: response.pageData.name,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, []);

  const handleClickFavorite = (id, social) => {
    createFavoritePostApi(skipliAccount.userPhoneNumber, social, id);
    // console.log("ID: ", id, "SOCIAL: ", social);
  };

  return (
    <div>
      <NavbarDashboard />
      <div className="xs:grid-cols-1 grid  gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* <div className="flex flex-wrap gap-4"> */}
        {/* <div className=" xs:columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"> */}
        {socialPosts.map((post, index) => (
          <SocialPost
            pageData={pageData}
            media={
              post?.full_picture && (
                <img
                  src={post.full_picture}
                  // className="h-60 w-full object-cover object-center transition-all duration-300 ease-out hover:object-contain"
                  className=" h-60 w-full object-cover object-center transition-all duration-300  ease-out  hover:bg-gray-200 hover:object-contain"
                  alt={`${pageData.social} social post`}
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
