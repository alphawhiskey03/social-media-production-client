import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { makeStyles } from "@mui/styles";
import { Colors } from "../utils/theme";
import { ListItemText, ListItemIcon } from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LogoutIcon from "@mui/icons-material/Logout";
const useStyles = makeStyles({
  paper: {
    "& .MuiMenu-paper": {
      backgroundColor: Colors.secondary,
    },
    "& .MuiMenu-list": {
      color: Colors.primary,
    },
  },
});
export default function MenuBar({ theme }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const { user, logout } = React.useContext(AuthContext);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        color="primary"
        style={{
          borderBottom: "none",
        }}
      >
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography
            variant="h4"
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={() => {
              navigate("/");
              setAnchorEl(null);
            }}
            color="secondary"
            style={{ cursor: "pointer" }}
          >
            <Typography variant="h6">[R I C K - E D]</Typography>
          </Typography>
          <Typography>{user && user.username ? user.username : ""}</Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle sx={{ color: "text.primary" }} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            className={classes.paper}
          >
            {user ? (
              <MenuItem
                onClick={() => {
                  logout();
                  setAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  <LogoutIcon color="primary" size={"small"} />
                </ListItemIcon>
                <ListItemText>logout</ListItemText>
              </MenuItem>
            ) : (
              <div>
                <MenuItem
                  onClick={() => {
                    navigate("/register");
                    setAnchorEl(null);
                  }}
                >
                  <ListItemIcon>
                    <AppRegistrationIcon color="primary" size={"small"} />
                  </ListItemIcon>
                  <ListItemText>Register</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/login");
                    setAnchorEl(null);
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon color="primary" size={"small"} />
                  </ListItemIcon>
                  <ListItemText>Login</ListItemText>
                </MenuItem>
              </div>
            )}
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
