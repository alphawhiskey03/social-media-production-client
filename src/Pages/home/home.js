import Typography from "@mui/material/Typography";
import { useQuery } from "@apollo/client";
import { useContext } from "react";
import { useEffect, useState } from "react";
import PostCard from "./postCard";
import { FETCH_POST_QUERY } from "../../utils/graphql";

const Home = () => {
  const { error, loading, data } = useQuery(FETCH_POST_QUERY);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    if (data) {
      setPosts(data.getPosts);
    }
  }, [data]);
  return (
    <>
      <Typography
        variant={"h5"}
        align="left"
        color="text.primary"
        style={{ marginBottom: 20 }}
      >
        Recent posts
      </Typography>
      <PostCard posts={posts} />
    </>
  );
};
export default Home;
