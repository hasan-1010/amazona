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
    Card,
    List,
    ListItem,
    CircularProgress,
} from '@material-ui/core';
import React, { useContext, useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { Store } from '../../utils/store';
import NextLink from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import useStyles from '../../utils/styles';
import { useRouter } from 'next/router';
import { getError } from '../../utils/error';
import axios from 'axios';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {
                ...state,
                loading: true,
                error: '',
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                order: action.payload,
                error: '',
            };
        case 'FETCH_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case 'PAY_REQUEST':
            return {
                ...state,
                loadingPay: true,
            };
        case 'PAY_SUCCESS':
            return {
                ...state,
                loadingPay: false,
                successPay: true,
            };
        case 'PAY_FAIL':
            return {
                ...state,
                loadingPay: false,
                errorPay: action.payload,
            };
        case 'PAY_RESET':
            return {
                ...state,
                loadingPay: false,
                successPay: false,
                errorPay: '',
            };
    }
}

function Order({ params }) {
    const orderId = params.id;
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
    const classes = useStyles();
    const router = useRouter();
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, order, successPay }, dispatch] = useReducer(
        reducer,
        {
            loading: true,
            order: {},
            error: {},
        }
    );

    const {
        shippingInfo,
        paymentMethod,
        orderItems,
        itemsPrice,
        shippingPrice,
        totalPrice,
        isDelivered,
        deliveredAt,
        isPaid,
        paidAt,
    } = order;

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        }
        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        if (!order._id || successPay || (order._id && order._id !== orderId)) {
            fetchOrder();
            if (successPay) {
                dispatch({ type: 'PAY_RESET' });
            }
        } else {
            const loadPaypalScript = async () => {
                const { data: clientId } = await axios.get('/api/keys/paypal', {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': clientId,
                        currency: 'USD',
                    },
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            };
            loadPaypalScript();
        }
    }, [order, successPay]);

    const createOrder = (data, actions) => {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: { value: totalPrice },
                    },
                ],
            })
            .then((orderID) => {
                return orderID;
            });
    };

    const onApprove = (data, actions) => {
        return actions.order.capture().then(async (details) => {
            try {
                dispatch({ type: 'PAY_REQUEST' });
                const { data } = await axios.put(
                    `/api/orders/${order._id}/pay`,
                    details,
                    {
                        headers: { authorization: `Bearer ${userInfo.token}` },
                    }
                );
                dispatch({ type: 'PAY_SUCCESS', payload: data });
                toast('Order is paid', { type: 'success' });
            } catch (err) {
                dispatch({ type: 'PAY_FAIL', payload: getError(err) });
                toast(getError(err), { type: 'error' });
            }
        });
    };

    const onError = (err) => {
        toast(getError(err), { type: 'error' });
    };

    return (
        <Layout title={`Order ${orderId}`}>
            <Typography component="h1" variant="h1">
                Order {orderId}
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography className={classes.error}>{error}</Typography>
            ) : (
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
                                <ListItem>
                                    <Typography>
                                        Status:{' '}
                                        {isDelivered
                                            ? `Delivered at ${deliveredAt}`
                                            : 'Not Delivered'}
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
                                <ListItem>
                                    <Typography>
                                        Status:{' '}
                                        {isPaid
                                            ? `Paid at ${paidAt}`
                                            : 'Not Paid'}
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
                                                    <TableCell>Image</TableCell>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell align="right">
                                                        Quantity
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        Price
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {orderItems.map((item) => (
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
                                                                        width={
                                                                            50
                                                                        }
                                                                        height={
                                                                            50
                                                                        }
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
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </Typography>
                                                                </Link>
                                                            </NextLink>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography>
                                                                {item.quantity}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography>
                                                                {item.price} TK
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
                        <Card className={classes.section}>
                            <List>
                                <ListItem>
                                    <Typography variant="h2">
                                        Order Summary
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
                                            <Typography>
                                                <strong>Total: </strong>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography align="right">
                                                <strong>{totalPrice} TK</strong>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                {!isPaid && (
                                    <ListItem>
                                        {isPending ? (
                                            <CircularProgress />
                                        ) : (
                                            <div className={classes.fullWidth}>
                                                <PayPalButtons
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                ></PayPalButtons>
                                            </div>
                                        )}
                                    </ListItem>
                                )}
                            </List>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Layout>
    );
}

export async function getServerSideProps({ params }) {
    return { props: { params } };
}

export default dynamic(() => Promise.resolve(Order), {
    ssr: false,
});
