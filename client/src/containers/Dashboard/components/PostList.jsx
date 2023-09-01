import React from "react";
import PropTypes from "prop-types";
import NavbarDashboard from "./Navbar";
import SocialPost from "../../../components/SocialPost/SocialPost";

PostList.propTypes = {};

function PostList(props) {
  return (
    <div>
      <NavbarDashboard />
      <div className="xs:grid-cols-1 grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 5 })
          .map((_, index) => ({
            user: { username: "thanhlp18", fullname: "Le Phuoc Thanh" },
            media: (
              <img
                src="https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="ui/ux review check"
              />
            ),
            copy: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            social: "twitter",
          }))
          .map((ele, index) => (
            <SocialPost
              user={ele.user}
              media={ele.media}
              copy={ele.copy}
              social={ele.social}
            />
          ))}
      </div>
    </div>
  );
}

export default PostList;
