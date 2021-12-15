import { Button, Link, List, ListItem, TextField, Typography } from '@material-ui/core'
import axios from 'axios'
import NextLink from 'next/link'
import {useRouter} from 'next/router'
import React, { useContext } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Layout from '../components/Layout'
import { Store } from '../utils/store'
import useStyles from '../utils/styles'

export default function Login() {
    const {handleSubmit, control, formState: {errors}} = useForm();
    const router = useRouter();
    const {redirect} = router.query;
    const {state, dispatch} = useContext(Store);
    const {userInfo} = state;
    if(userInfo){
        router.push(redirect || '/');
    }
    const classes = useStyles();
    const submitHandler = async ({email, password}) => {
        try{
            const {data} = await axios.post('/api/users/login', {email, password});
            dispatch({type: 'USER_LOGIN', payload: data});
            router.push(redirect || '/');
        }catch(err) {
            toast(err.response.data? err.response.data.message : err.message, {type: 'error'})
        }
    }
    return (
        <Layout title="Login">
            <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
                <Typography variant="h1">
                    Login
                </Typography>
                <List>
                   <ListItem>
                       <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: true,
                            pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,5}$/,
                        }}
                        render={({field}) => (
                            <TextField 
                                variant="outlined"
                                fullWidth
                                id="email"
                                label="Email"
                                inputProps={{type: 'email'}}
                                error={Boolean(errors.email)}
                                helperText={errors.email ? errors.email.type === 'pattern' ? 'Email is not valid' : 'Email is Required' : ''}
                                {...field}
                            ></TextField>
                        )}>
                        </Controller>
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                                minLength: 6
                            }}
                            render={({field}) => (
                                <TextField 
                                    variant="outlined"
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    inputProps={{type: 'password'}}
                                    error={Boolean(errors.password)}
                                    helperText={errors.password ? errors.password.type === 'minLength' ? 'Password must be more than 5 characters' : 'Password is Required' : ''}
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
                            color="primary">Login</Button>
                    </ListItem>
                    <ListItem>
                        <Typography>Create an account. &nbsp; <NextLink href={`/register?redirect=${redirect || '/'}`} passHref><Link>Register</Link></NextLink></Typography>
                    </ListItem>
                </List>
            </form>
        </Layout>
    )
}
