import NextLink from 'next/link';
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    Typography,
} from '@material-ui/core';
import Layout from '../components/Layout';
import Product from '../models/Product';
import db from '../utils/db';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../utils/store';
import router from 'next/router';
import useStyles from '../utils/styles';
import { FaCartPlus } from 'react-icons/fa';

export default function Home({ products }) {
    const classes = useStyles();
    const { dispatch, state } = useContext(Store);

    const addToCartHandler = async (product) => {
        const { data } = await axios.get(`/api/products/${product._id}`);
        const existItem = state.cart.cartItems.find(
            (x) => x._id === product._id
        );
        const quantity = existItem ? existItem.quantity + 1 : 1;
        if (data.countInStock <= quantity) {
            window.alert('Sorry, Product is out of stock.');
            return;
        }
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
        router.push('/cart');
    };
    return (
        <Layout>
            <div>
                <h1>Products</h1>
                <Grid container spacing={2}>
                    {products.map((product) => (
                        <Grid item md={3} key={product.name}>
                            <Card>
                                <NextLink
                                    href={`/product/${product.slug}`}
                                    passHref
                                >
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            image={product.image}
                                            title={product.name}
                                        ></CardMedia>
                                        <CardContent>
                                            <Typography
                                                className={classes.productTitle}
                                            >
                                                {product.name}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </NextLink>
                                <CardActions>
                                    <Typography className={classes.priceBtn}>
                                        {product.price} TK
                                    </Typography>
                                    <Button
                                        className={classes.cartBtn}
                                        size="small"
                                        color="primary"
                                        onClick={() =>
                                            addToCartHandler(product)
                                        }
                                    >
                                        <FaCartPlus />
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </Layout>
    );
}

export async function getServerSideProps() {
    await db.connect();
    const products = await Product.find({}).lean();
    await db.disconnect();
    return {
        props: {
            products: products.map(db.convertDocToObj),
        },
    };
}
