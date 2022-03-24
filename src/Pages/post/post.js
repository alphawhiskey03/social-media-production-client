import { Navigate, useNavigate, useParams } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Paper,
  Grid,
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  CardHeader,
  CardMedia,
  Avatar,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { AuthContext } from "../../context/auth";
import LikeButton from "../../components/likeButton";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteButton from "../../components/deleteButton";
import { useForm } from "../../hooks/hooks";
import { Colors } from "../../utils/theme";
import { useMediaQuery } from "@mui/material";

const useStyles = makeStyles({
  deleteButton: {
    "&:hover": {
      color: "#e8685f",
    },
  },
  body: {
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
  },
  Card: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    marginBottom: 10,
  },
  cardHeader: {
    "& .MuiCardHeader-title": {
      color: Colors.secondary,
    },
  },
});

const Post = (props) => {
  const { postId, cmd } = useParams();
  const matches = useMediaQuery("(max-width:600px)");

  const { user } = useContext(AuthContext);
  const [post, setPost] = useState();
  const commentRef = useRef();
  const { onSubmit, onChange, values } = useForm(addCommentCallback, {
    body: "",
  });
  const classes = useStyles();
  const navigate = useNavigate();
  const { data, error, loading } = useQuery(GET_POST_QUERY, {
    variables: { id: postId },
  });

  const [addComment] = useMutation(ADD_COMMENT_MUTATION, {
    update(proxy, result) {
      values.body = "";
    },
    variables: {
      postId,
      body: values.body,
    },
  });

  function addCommentCallback() {
    console.log("clicked");
    if (!user) return navigate("/login");
    addComment();
  }

  useEffect(() => {
    if (data) setPost(data.getPost);
  }, [data]);
  const deleteCallback = () => {
    navigate("/");
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item>
          <Paper style={{ borderRadius: 5 }}>
            <img
              src="https://i.pinimg.com/originals/7b/aa/25/7baa252dbdfeed669c152bedd2fa5feb.jpg"
              style={{ height: 80, width: 80 }}
            />
          </Paper>
        </Grid>
        {post && (
          <>
            <Grid item xs={12} sm={6}>
              <Card
                className={classes.Card}
                style={{ backgroundColor: Colors.primary }}
                elevation={2}
              >
                <CardHeader
                  action={
                    user &&
                    user.username === post.username && (
                      <DeleteButton id={post.id} callBack={deleteCallback} />
                    )
                  }
                  title={post.username}
                  subheader={moment(post.createdAt).fromNow(true)}
                  className={classes.cardHeader}
                />

                {post.imageUrl && (
                  <CardMedia
                    component="img"
                    height="240"
                    image={post.imageUrl}
                  />
                )}
                <CardContent>
                  <div style={{ marginTop: 5 }}>
                    <Link to={`/post/${post.id}`} className={classes.body}>
                      <Typography>{post.body}</Typography>
                    </Link>
                  </div>
                </CardContent>
                <CardActions>
                  <LikeButton post={post} user={user} />
                  <Tooltip title={"comment"}>
                    <Button
                      size="small"
                      color="secondary"
                      startIcon={<CommentIcon />}
                      onClick={() => commentRef.current.focus()}
                    >
                      {post.commentCount}
                    </Button>
                  </Tooltip>
                </CardActions>
              </Card>
              <Card
                className={classes.Card}
                style={{
                  backgroundColor: Colors.primary,
                  padding: 10,
                  marginBottom: 2,
                }}
              >
                <TextField
                  variant="outlined"
                  label="Add your comment"
                  color="secondary"
                  style={{ width: matches ? "80%" : "90%" }}
                  value={values.body}
                  name="body"
                  inputRef={commentRef}
                  autoFocus={cmd == "comment" ? true : false}
                  size="small"
                  onChange={onChange}
                />
                <IconButton color="secondary" size="small" onClick={onSubmit}>
                  <SendIcon />
                </IconButton>
              </Card>
            </Grid>
            <Grid item sm={5} xs={12}>
              <Typography
                color="text.primary"
                style={{ paddingBottom: "10px", paddingLeft: "2px" }}
              >
                Previous comments
              </Typography>

              {post.comments.map((comment, i) => (
                <Card
                  className={classes.Card}
                  sx={{
                    marginBottom: 1,
                    borderRadius: 1.5,
                  }}
                  style={{ backgroundColor: Colors.primary }}
                  elevation={2}
                  key={comment.body + i}
                >
                  <CardHeader
                    className={classes.cardHeader}
                    avatar={
                      <Avatar
                        aria-label="recipe"
                        style={{
                          backgroundColor: "white",
                          border: "1px solid grey",
                        }}
                      >
                        <img
                          src="../../logo192.png"
                          style={{ height: 30, width: 30 }}
                        />
                      </Avatar>
                    }
                    action={
                      user &&
                      user.username === comment.username && (
                        <DeleteButton postId={post.id} commentId={comment.id} />
                      )
                    }
                    title={comment.username}
                    subheader={moment(comment.createdAt).fromNow(true)}
                  />
                  <CardContent>
                    <Typography variant="body1">{comment.body}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

const GET_POST_QUERY = gql`
  query ($id: ID!) {
    getPost(id: $id) {
      id
      username
      body
      imageUrl
      imageName
      likes {
        username
        id
      }
      comments {
        id
        username
        body
        createdAt
      }
      createdAt
      likeCount
      commentCount
    }
  }
`;

const ADD_COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      username
      body
      imageUrl
      imageName
      likes {
        username
        id
      }
      comments {
        id
        username
        body
        createdAt
      }
      createdAt
      likeCount
      commentCount
    }
  }
`;

export default Post;
