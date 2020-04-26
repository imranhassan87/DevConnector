import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Spinner from "../layout/Spinner";
import { getPosts } from "../../actions/post";
import PostItem from "./PostItem";
import PostFrom from "./PostFrom";

const Posts = ({ getPosts, post: { posts, loading } }) => {
  useEffect(() => {
    getPosts(posts);
  }, [getPosts]);
  return loading ? (
    <Spinner />
  ) : (
      <>
        <h1 className="large text-primary">Posts</h1>
        <p className="lead">
          <i className="fas fa-user"></i>Welcome to the community
      </p>
        <PostFrom />
        <div className="posts">
          {posts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))}
        </div>
      </>
    );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);