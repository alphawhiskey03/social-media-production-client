import { Container, Box } from "@mui/material";
import MenuBar from "./MenuBar";
import Footer from "./footer";

const Layout = ({ children }) => {
  return (
    <>
      <MenuBar />
      <Container style={{ minHeight: "75vh" }}>
        <Box style={{ marginTop: 20 }}>{children}</Box>
      </Container>
      <Footer />
    </>
  );
};
export default Layout;
