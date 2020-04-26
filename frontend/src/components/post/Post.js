import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import PostItem from "../posts/PostItem";
import Spinner from "../layout/Spinner";
import { getPost } from "../../actions/post";
import CommentFrom from "./CommentForm";
import CommentItem from './CommentItem'

const Post = ({
  getPost,
  post: { post, loading },
  match: {
    params: { id },
  },
}) => {
  useEffect(() => {
    getPost(id);
  }, [getPost]);
  return loading || post === null ? (
    <Spinner />
  ) : (
    <>
      <Link className="btn btn-primary" to="/posts">
        Go Back
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentFrom postId={post._id} />
      <div className="comments">
        {post.comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
