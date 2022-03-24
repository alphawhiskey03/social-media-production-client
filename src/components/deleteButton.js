import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { makeStyles } from "@mui/styles";
import { gql, useMutation } from "@apollo/client";
import { FETCH_POST_QUERY } from "../utils/graphql";
import FireBaseStorage from "../utils/firebase";
import { ref, deleteObject } from "firebase/storage";
import { Colors } from "../utils/theme";
const useStyles = makeStyles({
  deleteButton: {
    "&:hover": {
      color: "#e8685f",
    },
  },
  Dialog: {
    "& .MuiDialog-paper": {
      backgroundColor: Colors.primary,
    },
  },
});
const DeleteButton = ({ postId, commentId, callBack, imageName }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const [deletePost] = useMutation(mutation, {
    update(proxy) {
      if (!commentId) {
        if (callBack) {
          callBack();
        }
        const data = proxy.readQuery({ query: FETCH_POST_QUERY });
        let getPosts = data.getPosts.filter((d) => d.id !== postId);
        proxy.writeQuery({ query: FETCH_POST_QUERY, data: { getPosts } });
        setOpen(false);
      } else setOpen(false);
    },
    variables: { postId, commentId },
  });
  const onDelete = (e) => {
    e.preventDefault();
    console.log(imageName);
    if (imageName) {
      console.log("hi", imageName);
      const imageRef = ref(FireBaseStorage, `image/${imageName}`);
      deleteObject(imageRef)
        .then(() => {
          deletePost();
        })
        .catch((err) => {
          console.log(err);
        });
    } else deletePost();
  };

  return (
    <>
      <Tooltip title={commentId ? "Delete comment" : "Delete post"}>
        <IconButton
          className={classes.deleteButton}
          aria-label="settings"
          onClick={() => setOpen(true)}
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        style={{ borderRadius: 25 }}
        className={classes.Dialog}
      >
        <DialogTitle>
          <Typography variant="h6" color="secondary">
            Delete post
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure, you wanna delete the {commentId ? "comment" : "post"}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpen(false)}
          >
            No
          </Button>
          <Button variant="contained" color="secondary" onClick={onDelete}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation ($postId: ID!) {
    deletePost(id: $postId)
  }
`;
const DELETE_COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
