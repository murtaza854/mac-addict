import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PinDropIcon from '@material-ui/icons/PinDrop';
import PublicIcon from '@material-ui/icons/Public';
import api from '../../api';
import MoreIcon from '@material-ui/icons/MoreVert';
import WebIcon from '@material-ui/icons/Web';
import LockIcon from '@material-ui/icons/Lock';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import { StyledTreeItem } from '../components';
import PaletteIcon from '@material-ui/icons/Palette';
import FormatSizeIcon from '@material-ui/icons/FormatSize';
import TreeView from '@material-ui/lab/TreeView';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import StoreIcon from '@material-ui/icons/Store';
import './AdminLayout.scss';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import { Menu, MenuItem } from '@material-ui/core';
import {
    // BrowserRouter as Router,
    Switch as RouterSwitch,
    Link,
    Route,
} from "react-router-dom";
import EnhancedTable from '../table/EnhancedTable';
import AdminForm from '../adminForm/AdminForm';

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
};

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    tree: {
        height: 264,
        flexGrow: 1,
        maxWidth: 400,
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    title: {
        flexGrow: 1
    },
}));

function AdminLayout(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);

    const handleThemeChange = async () => {
        // console.log(!props.darkState)
        props.setDarkState(!props.darkState);
        // console.log(props.darkState)
        // await fetch('http://localhost:4000/api/set-darktheme', {
        //   method: 'POST',
        //   headers: {'Content-Type': 'application/json'},
        //   credentials: 'include',
        //   withCredentials: true,
        //   body: JSON.stringify({darkState:!props.darkState})
        // }); 
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = async e => {
        // console.log(123);
        e.preventDefault();
        await fetch(`${api}/user/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            withCredentials: true,
        });
        props.user.setUserState(null);
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        MAC Addict Admin
                    </Typography>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleThemeChange}
                    >
                        <InvertColorsIcon
                        />
                    </IconButton>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <MoreIcon />
                    </IconButton>
                    <Menu
                        // className={classes.root}
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={openMenu}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={_ => window.location.pathname = '/'}>
                            <ListItemIcon className={classes.listItemIcon}>
                                <WebIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="body2">Go to website</Typography>
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon className={classes.listItemIcon}>
                                <LockIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="body2">Change password</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon className={classes.listItemIcon}>
                                <ExitToAppIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="body2">Logout</Typography>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />

                <TreeView
                    className={classes.tree}
                    defaultExpanded={['3', '13']}
                    defaultCollapseIcon={<ArrowDropDownIcon />}
                    defaultExpandIcon={<ArrowRightIcon />}
                    defaultEndIcon={<div style={{ width: 24 }} />}
                >
                    <Link to="/admin" style={{ textDecoration: 'none' }}>
                        <StyledTreeItem nodeId="1" labelText="Dashboard" labelIcon={DashboardIcon} />
                    </Link>
                    <Link to="/admin" style={{ textDecoration: 'none' }}>
                        <StyledTreeItem nodeId="2" labelText="User" labelIcon={SupervisorAccountIcon} />
                    </Link>
                    <StyledTreeItem nodeId="3" labelText="Shop" labelIcon={StoreIcon}>
                        <Link to="/admin/brand" style={{ textDecoration: 'none' }}>
                            <StyledTreeItem
                                nodeId="4"
                                labelText="Brand"
                                labelIcon={BookmarkIcon}
                                // labelInfo="90"
                                color="#000000"
                                bgColor="#f5daab"
                            />
                        </Link>
                        <Link to="/admin/category" style={{ textDecoration: 'none' }}>
                            <StyledTreeItem
                                nodeId="5"
                                labelText="Category"
                                labelIcon={BookmarkIcon}
                                // labelInfo="90"
                                color="#000000"
                                bgColor="#f5daab"
                            />
                        </Link>
                        <Link to="/admin/sub-category" style={{ textDecoration: 'none' }}>
                            <StyledTreeItem
                                nodeId="6"
                                labelText="Sub Category"
                                labelIcon={BookmarkIcon}
                                color="#000000"
                                bgColor="#f5daab"
                            />
                        </Link>
                        <Link to="/admin/further-sub-category" style={{ textDecoration: 'none' }}>
                            <StyledTreeItem
                                nodeId="7"
                                labelText="Further Sub Category"
                                labelIcon={BookmarkIcon}
                                color="#000000"
                                bgColor="#f5daab"
                            />
                        </Link>
                        <Link to="/admin/product" style={{ textDecoration: 'none' }}>
                            <StyledTreeItem
                                nodeId="8"
                                labelText="Product"
                                labelIcon={LocalOfferIcon}
                                color="#000000"
                                bgColor="#f5daab"
                            />
                        </Link>
                        <Link to="/admin/color" style={{ textDecoration: 'none' }}>
                            <StyledTreeItem
                                nodeId="9"
                                labelText="Color"
                                labelIcon={PaletteIcon}
                                color="#000000"
                                bgColor="#f5daab"
                            />
                        </Link>
                        <Link to="/admin/size" style={{ textDecoration: 'none' }}>
                            <StyledTreeItem
                                nodeId="10"
                                labelText="Size"
                                labelIcon={FormatSizeIcon}
                                color="#000000"
                                bgColor="#f5daab"
                            />
                        </Link>
                    </StyledTreeItem>
                    <Link to="/admin" style={{ textDecoration: 'none' }}>
                        <StyledTreeItem nodeId="11" labelText="Order" labelIcon={MonetizationOnIcon} />
                    </Link>
                    <Link to="/admin" style={{ textDecoration: 'none' }}>
                        <StyledTreeItem nodeId="12" labelText="Discount" labelIcon={MoneyOffIcon} />
                    </Link>
                    <StyledTreeItem nodeId="13" labelText="Location" labelIcon={PublicIcon}>
                        <Link to="/admin/country" style={{ textDecoration: 'none' }}>
                            <StyledTreeItem
                                nodeId="14"
                                labelText="Country"
                                labelIcon={LocationOnIcon}
                                // labelInfo="90"
                                color="#000000"
                                bgColor="#f5daab"
                            />
                        </Link>
                        <Link to="/admin/province" style={{ textDecoration: 'none' }}>
                            <StyledTreeItem
                                nodeId="15"
                                labelText="Province"
                                labelIcon={LocationOnIcon}
                                color="#000000"
                                bgColor="#f5daab"
                            />
                        </Link>
                        <Link to="/admin/city" style={{ textDecoration: 'none' }}>
                            <StyledTreeItem
                                nodeId="16"
                                labelText="City"
                                labelIcon={LocationCityIcon}
                                color="#000000"
                                bgColor="#f5daab"
                            />
                        </Link>
                        <Link to="/admin/area" style={{ textDecoration: 'none' }}>
                            <StyledTreeItem
                                nodeId="17"
                                labelText="Area"
                                labelIcon={PinDropIcon}
                                color="#000000"
                                bgColor="#f5daab"
                            />
                        </Link>
                    </StyledTreeItem>
                </TreeView>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                {/* <Router> */}
                {/* <TransitionGroup>
            <CSSTransition
              key={location.key}
              classNames="fade"
              timeout={300}
            > */}
                <RouterSwitch>
                    {/* <Route path="/admin/orders" children={<OrdersTable />} /> */}
                    <Route path="/admin/:model/edit/:id" children={<AdminForm />} />
          <Route path="/admin/:model/add" children={<AdminForm />} />
          {/* <Route path="/admin/:model/delete" children={<DeleteConfirmation />} /> */}
                    <Route path="/admin/:model" children={<EnhancedTable />} />
                </RouterSwitch>
                {/* </CSSTransition>
          </TransitionGroup> */}
                {/* </Router> */}
            </main>
        </div>
    );
}

export default AdminLayout;