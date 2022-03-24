import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Button, Tooltip } from "@mui/material";
import moment from "moment";
import CommentIcon from "@mui/icons-material/Comment";
import AddPost from "./addPost";
import Zoom from "@mui/material/Zoom";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import {
  useMediaQuery,
  CardHeader,
  CardMedia,
  Avatar,
  Typography,
} from "@mui/material";
import { AuthContext } from "../../context/auth";
import { useContext } from "react";
import LikeButton from "../../components/likeButton";
import DeleteButton from "../../components/deleteButton";
import { Colors } from "../../utils/theme";
import Masonry from "@mui/lab/Masonry";
const useStyles = makeStyles({
  body: {
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
  },
  cardHeader: {
    "& .MuiCardHeader-title": {
      color: Colors.secondary,
    },
  },
});
const PostCard = ({ posts }) => {
  const { user } = useContext(AuthContext);
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:600px)");

  const columnSize = () => {
    if (matches) {
      return 1;
    } else {
      if (posts.length <= 2) {
        return 2;
      } else if (posts.length <= 3) {
        return 3;
      } else {
        return 4;
      }
    }
  };
  return (
    <Zoom in={true} style={{ transitionDelay: "500ms" }}>
      <Masonry columns={columnSize()} spacing={1}>
        {user && (
          <>
            <AddPost />
          </>
        )}
        {posts &&
          posts.map((post, i) => (
            <div key={i}>
              <Card
                sx={{ minWidth: 50 }}
                style={{ backgroundColor: Colors.primary, borderRadius: 15 }}
                elevation={5}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      aria-label="recipe"
                      style={{
                        backgroundColor: "white",
                        border: "1px solid " + Colors.text.primary,
                      }}
                    >
                      <img
                        src="https://i.pinimg.com/originals/7b/aa/25/7baa252dbdfeed669c152bedd2fa5feb.jpg"
                        style={{ height: 50, width: 50 }}
                      />
                    </Avatar>
                  }
                  action={
                    user &&
                    user.username === post.username && (
                      <DeleteButton
                        postId={post.id}
                        imageName={post.imageName ? post.imageName : ""}
                      />
                    )
                  }
                  title={post.username}
                  subheader={moment(post.createdAt).fromNow()}
                  className={classes.cardHeader}
                />
                {post.imageUrl && (
                  <CardMedia
                    component="img"
                    height="194"
                    image={post.imageUrl}
                  />
                )}
                <CardContent>
                  <div style={{ marginTop: 5 }}>
                    <Link to={`/post/${post.id}`} className={classes.body}>
                      <Typography color="secondary" variant="body2">
                        {post.body}
                      </Typography>
                    </Link>
                  </div>
                </CardContent>
                <CardActions>
                  <LikeButton post={post} user={user} />
                  <Tooltip title={"comment"}>
                    <Button
                      size="small"
                      href={`/post/${post.id}/comment`}
                      color="secondary"
                      startIcon={<CommentIcon />}
                    >
                      {post.commentCount}
                    </Button>
                  </Tooltip>
                </CardActions>
              </Card>
            </div>
          ))}
      </Masonry>
    </Zoom>
  );
};

export default PostCard;
