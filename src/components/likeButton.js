import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Button, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
const LikeButton = ({ user, post: { id, likeCount, likes } }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  const likeButton = user ? (
    liked ? (
      <FavoriteIcon />
    ) : (
      <FavoriteBorderIcon />
    )
  ) : (
    <FavoriteBorderIcon />
  );

  return (
    <Tooltip title={liked ? "unlike" : "like"}>
      <Button
        onClick={likePost}
        startIcon={likeButton}
        color="secondary"
        disabled={!user}
      >
        {likeCount}
      </Button>
    </Tooltip>
  );
};

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      # So in the above line we are getting id so that the apollo updates the current post automatically without doing proxy.writeQuery like in addPost
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
