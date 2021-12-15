import {
    Button,
    FormControl,
    FormControlLabel,
    List,
    ListItem,
    Radio,
    RadioGroup,
    Typography,
} from '@material-ui/core';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/store';
import useStyles from '../utils/styles';
import { toast } from 'react-toastify';

export default function Payment() {
    const classes = useStyles();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState('');
    const { state, dispatch } = useContext(Store);
    const {
        cart: { shippingInfo },
    } = state;

    useEffect(() => {
        if (!shippingInfo) {
            router.push('/shipping');
        } else {
            setPaymentMethod(Cookies.get('paymentMethod') || '');
        }
    }, [setPaymentMethod, router, shippingInfo]);
    const submitHandler = (e) => {
        e.preventDefault();
        if (!paymentMethod) {
            toast('Payment Method is required', { type: 'error' });
        } else {
            dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
            toast('Payment Method is added.', { type: 'success' });
            router.push('/placeorder');
        }
    };
    return (
        <Layout title="Payment Method">
            <CheckoutWizard activeStep={3} />
            <form className={classes.form} onSubmit={submitHandler}>
                <Typography>Payment Method</Typography>
                <List>
                    <ListItem>
                        <FormControl component="fieldset">
                            <RadioGroup
                                arial-label="Payment Method"
                                name="paymentMethod"
                                value={paymentMethod}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                            >
                                <FormControlLabel
                                    label="Paypal"
                                    value="paypal"
                                    control={<Radio />}
                                ></FormControlLabel>
                                <FormControlLabel
                                    label="Stripe"
                                    value="stripe"
                                    control={<Radio />}
                                ></FormControlLabel>
                                <FormControlLabel
                                    label="Cash"
                                    value="cash"
                                    control={<Radio />}
                                ></FormControlLabel>
                                <FormControlLabel
                                    label="Cash on Delivery"
                                    value="cod"
                                    control={<Radio />}
                                ></FormControlLabel>
                            </RadioGroup>
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Continue
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Button
                            fullWidth
                            type="button"
                            variant="outlined"
                            color="primary"
                            onClick={() => router.push('/shipping')}
                        >
                            Back
                        </Button>
                    </ListItem>
                </List>
            </form>
        </Layout>
    );
}
