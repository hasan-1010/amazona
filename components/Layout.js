import React, { useContext, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
    AppBar,
    Container,
    createTheme,
    Link,
    Toolbar,
    Typography,
    ThemeProvider,
    CssBaseline,
    Switch,
    Badge,
    Button,
    Menu,
    MenuItem,
} from '@material-ui/core';
import useStyles from '../utils/styles';
import { Store } from '../utils/store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Layout({ title, description, children }) {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const {
        darkMode,
        cart: { cartItems },
        userInfo,
    } = state;
    const theme = createTheme({
        typography: {
            h1: {
                fontSize: '1.6rem',
                fontWeight: 400,
                margin: '1rem',
            },
            h2: {
                fontSize: '1.4rem',
                fontWeight: 400,
                margin: '1rem',
            },
            h3: {
                fontSize: '1.2rem',
                fontWeight: 400,
                margin: '1rem',
            },
            body1: {
                fontWeight: 'normal',
            },
        },
        palette: {
            type: darkMode ? 'dark' : 'light',
            primary: {
                main: '#f0c000',
            },
            secondary: {
                main: '#208080',
            },
        },
    });
    const classes = useStyles();
    const darkModeChangeHandler = () => {
        dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
        const newDarkMode = !darkMode;
        Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const loginClickHandler = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const loginMenuCloseHandler = () => {
        setAnchorEl(null);
    };
    const logoutClickHandler = () => {
        setAnchorEl(null);
        dispatch({ type: 'USER_LOGOUT' });
        Cookies.remove('userInfo');
        router.push('/');
    };
    return (
        <div>
            <Head>
                <title>
                    {title ? `${title} - Next Amazona` : 'Next Amazona'}
                </title>
                {description && (
                    <meta name="description" content={description} />
                )}
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position="static" className={classes.navbar}>
                    <Container maxWidth="lg">
                        <Toolbar>
                            <NextLink href="/" passHref>
                                <Link>
                                    <Typography className={classes.brand}>
                                        Amazona
                                    </Typography>
                                </Link>
                            </NextLink>
                            <div className={classes.grow}></div>
                            <div>
                                <Switch
                                    checked={darkMode}
                                    onChange={darkModeChangeHandler}
                                ></Switch>
                                <NextLink href="/cart" passHref>
                                    <Link>
                                        {cartItems.length > 0 ? (
                                            <Badge
                                                color="secondary"
                                                badgeContent={cartItems.length}
                                            >
                                                Cart
                                            </Badge>
                                        ) : (
                                            'Cart'
                                        )}
                                    </Link>
                                </NextLink>
                                {userInfo ? (
                                    <>
                                        <Button
                                            className={classes.navbarButton}
                                            arial-controls="simple-menu"
                                            arial-haspopup="true"
                                            onClick={loginClickHandler}
                                        >
                                            {userInfo.name}
                                        </Button>
                                        <Menu
                                            id="simple-menu"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={loginMenuCloseHandler}
                                        >
                                            <MenuItem
                                                onClick={loginMenuCloseHandler}
                                            >
                                                Profile
                                            </MenuItem>
                                            <MenuItem
                                                onClick={loginMenuCloseHandler}
                                            >
                                                My Account
                                            </MenuItem>
                                            <MenuItem
                                                onClick={logoutClickHandler}
                                            >
                                                Logout
                                            </MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <NextLink href="/login" passHref>
                                        <Link>Login</Link>
                                    </NextLink>
                                )}
                            </div>
                        </Toolbar>
                    </Container>
                </AppBar>
                <Container className={classes.main}>{children}</Container>
                <footer className={classes.footer}>
                    <Typography>All right reserved. Amazona</Typography>
                </footer>
            </ThemeProvider>
        </div>
    );
}
