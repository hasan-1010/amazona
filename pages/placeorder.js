import {
    Link,
    Grid,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    Typography,
    Button,
    Card,
    List,
    ListItem,
    CircularProgress,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/store';
import NextLink from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import useStyles from '../utils/styles';
import CheckoutWizard from '../components/CheckoutWizard';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import axios from 'axios';

function PlaceOrder() {
    const classes = useStyles();
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const {
        userInfo,
        cart: { cartItems, shippingInfo, paymentMethod },
    } = state;
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    const itemsPrice = round2(
        cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    );
    const shippingPrice = round2(
        shippingInfo.city.toLowerCase() == 'dhaka' ? 60 : 130
    );
    const totalPrice = round2(itemsPrice + shippingPrice);

    useEffect(() => {
        if (!paymentMethod) {
            router.push('/payment');
        }
        if (cartItems.length === 0) {
            router.push('/cart');
        }
    }, []);
    const [loading, setLoading] = useState(false);
    const placeOrderHandler = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: cartItems,
                    shippingInfo,
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            setLoading(false);
            dispatch({ type: 'CART_CLEAR' });
            router.push(`/order/${data._id}`);
        } catch (err) {
            setLoading(false);
            toast(getError(err), { type: 'error' });
        }
    };

    return (
        <Layout title="Place Order">
            <CheckoutWizard activeStep={3} />
            <Typography component="h1" variant="h1">
                Place Order
            </Typography>
            <Grid container spacing={1}>
                <Grid item md={9} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <ListItem>
                                <Typography component="h2" variant="h2">
                                    Shipping Information
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Typography>
                                    Name: {shippingInfo.name}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Typography>
                                    Phone: {shippingInfo.phone}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Typography>
                                    Address: {shippingInfo.address}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Typography>
                                    City: {shippingInfo.city}
                                </Typography>
                            </ListItem>
                        </List>
                    </Card>
                    <Card className={classes.section}>
                        <List>
                            <ListItem>
                                <Typography component="h2" variant="h2">
                                    Payment Method
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Typography>
                                    {paymentMethod == 'cod'
                                        ? 'Cash on delivery'
                                        : paymentMethod}
                                </Typography>
                            </ListItem>
                        </List>
                    </Card>
                    <Card className={classes.section}>
                        <List>
                            <ListItem>
                                <Typography component="h2" variant="h2">
                                    Order Items
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell> Image </TableCell>
                                                <TableCell> Name </TableCell>
                                                <TableCell align="right">
                                                    {' '}
                                                    Quantity{' '}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {' '}
                                                    Price{' '}
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cartItems.map((item) => (
                                                <TableRow key={item._id}>
                                                    <TableCell>
                                                        <NextLink
                                                            href={`/product/${item.slug}`}
                                                            passHref
                                                        >
                                                            <Link>
                                                                <Image
                                                                    src={
                                                                        item.image
                                                                    }
                                                                    alt={
                                                                        item.title
                                                                    }
                                                                    width={50}
                                                                    height={50}
                                                                ></Image>
                                                            </Link>
                                                        </NextLink>
                                                    </TableCell>
                                                    <TableCell>
                                                        <NextLink
                                                            href={`/product/${item.slug}`}
                                                            passHref
                                                        >
                                                            <Link>
                                                                <Typography>
                                                                    {' '}
                                                                    {
                                                                        item.name
                                                                    }{' '}
                                                                </Typography>
                                                            </Link>
                                                        </NextLink>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography>
                                                            {' '}
                                                            {item.quantity}{' '}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography>
                                                            {item.price}
                                                            TK
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Card>
                        <List>
                            <ListItem>
                                <Typography variant="h2">
                                    {' '}
                                    Order Summary{' '}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Items: </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography align="right">
                                            {itemsPrice} TK
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Shipping: </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography align="right">
                                            {shippingPrice} TK
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Total: </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography align="right">
                                            {totalPrice} TK
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={placeOrderHandler}
                                >
                                    Place Order
                                </Button>
                            </ListItem>
                            {loading && (
                                <ListItem>
                                    <CircularProgress />
                                </ListItem>
                            )}
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(PlaceOrder), {
    ssr: false,
});
