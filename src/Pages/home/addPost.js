import {
  TextField,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useForm } from "../../hooks/hooks";
import { gql, useMutation } from "@apollo/client";
import { FETCH_POST_QUERY } from "../../utils/graphql";
import { Colors } from "../../utils/theme";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import FireBaseStorage from "../../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const AddPost = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [firebaseUrl, setFirebaseUrl] = useState(null);
  const [postLoader, setPostLoader] = useState(false);
  useEffect(() => {
    if (selectedImage) setImageUrl(URL.createObjectURL(selectedImage));
  }, [selectedImage]);
  const { onChange, onSubmit, values, clearValues } = useForm(addPostCallback, {
    body: "",
  });
  const [addPost, { data, loading, error, called }] = useMutation(
    selectedImage
      ? CREATE_POST_MUTATION_WITH_PICTURE
      : CREATE_POST_MUTATION_WITHOUT_PICTURE,
    {
      update(proxy, result) {
        const data = proxy.readQuery({
          query: FETCH_POST_QUERY,
        });
        let getPosts = [result.data.createPost, ...data.getPosts];
        proxy.writeQuery({ query: FETCH_POST_QUERY, data: { getPosts } });
        setPostLoader(false);
        clearValues();
        setImageUrl(null);
      },
      onError(err) {
        console.log(err.graphQLErrors);
      },
    }
  );
  useEffect(() => {
    if (selectedImage && firebaseUrl) {
      const name = {
        variables: {
          body: values.body,
          imageUrl: firebaseUrl,
          imageName: selectedImage.name,
        },
      };
      console.log(name);
      addPost(name);
    }
  }, [firebaseUrl]);

  function addPostCallback() {
    setPostLoader(true);
    if (selectedImage) {
      const storageRef = ref(FireBaseStorage, `image/${selectedImage.name}`);
      console.log(storageRef);
      uploadBytesResumable(storageRef, selectedImage)
        .then((snapshot) => {
          return getDownloadURL(
            ref(FireBaseStorage, `image/${selectedImage.name}`)
          );
        })
        .then((url) => {
          console.log(url);
          setFirebaseUrl(url);
        });
    } else {
      console.log("shoudnt be called");
      addPost({
        variables: {
          body: values.body,
        },
      });
    }
  }

  return (
    <>
      <Card
        sx={{ minWidth: 50 }}
        style={{ backgroundColor: Colors.primary, borderRadius: 15 }}
        elevation={5}
      >
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="raised-button-file"
          type="file"
          onChange={(e) => setSelectedImage(e.target.files[0])}
        />
        <CardHeader
          title={"Whats on your mind?"}
          color="text.primary"
          titleTypographyProps={{ variant: "body1" }}
          action={
            <label htmlFor="raised-button-file">
              <Button variant="raised" size={"small"} component="span">
                <CameraAltIcon size={"small"} />
              </Button>
            </label>
          }
        />
        {imageUrl && (
          <CardMedia component="img" image={imageUrl} height="194" />
        )}
        <CardContent>
          <TextField
            variant="standard"
            color="secondary"
            style={{ width: "100%" }}
            multiline
            label="Say hello"
            rows={1}
            name="body"
            value={values.body}
            onChange={onChange}
          />
        </CardContent>
        <CardActions>
          <LoadingButton
            loading={postLoader}
            loadingPosition={"start"}
            startIcon={<SendIcon />}
            color="secondary"
            onClick={onSubmit}
          >
            {postLoader ? "Posting" : "Post"}
          </LoadingButton>
        </CardActions>
      </Card>
    </>
  );
};

const CREATE_POST_MUTATION_WITHOUT_PICTURE = gql`
  mutation ($body: String!) {
    createPost(body: $body) {
      id
      body
      username
      createdAt
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        username
        body
      }
    }
  }
`;
const CREATE_POST_MUTATION_WITH_PICTURE = gql`
  mutation ($body: String!, $imageUrl: String!, $imageName: String!) {
    createPost(body: $body, imageUrl: $imageUrl, imageName: $imageName) {
      id
      body
      imageUrl
      imageName
      username
      createdAt
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        username
        body
      }
    }
  }
`;

export default AddPost;
