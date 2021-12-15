import { Button, List, ListItem, TextField, Typography } from '@material-ui/core'
import {useRouter} from 'next/router'
import React, { useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout'
import { Store } from '../utils/store'
import useStyles from '../utils/styles'

export default function Shipping() {
    const {handleSubmit, control, formState: {errors}, setValue} = useForm();
    const router = useRouter();
    const {state, dispatch} = useContext(Store);
    const {userInfo, cart:{shippingInfo}} = state;
    useEffect(() => {
        if(!userInfo){
            router.push('/login?redirect=/shipping');
        }
        if(shippingInfo){
            setValue('name', shippingInfo.name);
            setValue('phone', shippingInfo.phone);
            setValue('address', shippingInfo.address);
            setValue('city', shippingInfo.city);
        }
    });
    
    const classes = useStyles();
    const submitHandler = ({name, phone, address, city }) => {
        dispatch({type: 'SAVE_SHIPPING_INFO', payload: {name, phone, address, city }});
        toast('Shipping information is saved successfully.', {type: 'success'});
        router.push('/payment');
    }
    return (
        <Layout title="Shipping">
            <CheckoutWizard activeStep={1}/>
            <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
                <Typography variant="h1">
                    Shipping
                </Typography>
                <List>
                   <ListItem>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                                min: 3
                            }}
                            render={({field}) => (
                                <TextField 
                                    variant="outlined"
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    inputProps={{type: 'text'}}
                                    error={Boolean(errors.name)}
                                    helperText={errors.name ? errors.name.type === 'min' ? 'Name should be at least 3 characters.' : 'Name is Required' : ''}
                                    {...field}
                                ></TextField>
                            )}>
                        </Controller>
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="phone"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                                min: 11
                            }}
                            render={({field}) => (
                                <TextField 
                                    variant="outlined"
                                    fullWidth
                                    id="phone"
                                    label="Phone"
                                    inputProps={{type: 'text'}}
                                    error={Boolean(errors.phone)}
                                    helperText={errors.phone ? errors.phone.type === 'min' ? 'Phone should be at least 11 digits.' : 'Phone is Required' : ''}
                                    {...field}
                                ></TextField>
                            )}>
                        </Controller>
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="address"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                            }}
                            render={({field}) => (
                                <TextField 
                                    variant="outlined"
                                    fullWidth
                                    id="address"
                                    label="Address"
                                    inputProps={{type: 'text'}}
                                    error={Boolean(errors.address)}
                                    helperText={errors.address && 'Address is Required'}
                                    {...field}
                                ></TextField>
                            )}>
                        </Controller>
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="city"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                            }}
                            render={({field}) => (
                                <TextField 
                                    variant="outlined"
                                    fullWidth
                                    id="city"
                                    label="City"
                                    inputProps={{type: 'text'}}
                                    error={Boolean(errors.city)}
                                     helperText={errors.city && 'City is Required'}
                                    {...field}
                                ></TextField>
                            )}>
                        </Controller>
                    </ListItem>
                    <ListItem>
                        <Button 
                            variant="contained" 
                            type="submit"
                            fullWidth
                            color="primary">Continue</Button>
                    </ListItem>
                </List>
            </form>
        </Layout>
    )
}
