import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    body: {
        backgroundColor: '#F6F6F6',
    },
    navbar: {
        backgroundColor: '#203040',
        '& a': {
            color: '#ffffff',
            marginLeft: 10,
        },
    },
    brand: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
    },
    grow: {
        flexGrow: 1,
    },
    main: {
        minHeight: '80vh',
    },
    footer: {
        textAlign: 'center',
    },
    section: {
        marginTop: 10,
        marginBottom: 10,
    },
    form: {
        maxWidth: 600,
        margin: '0 auto',
    },
    navbarButton: {
        color: '#ffffff',
        textTransform: 'initial',
    },
    transparentBg: {
        backgroundColor: 'transparent',
    },
    error: {
        color: '#f04040',
    },
    fullWidth: {
        width: '100%',
    },
    priceBtn: {
        flexGrow: 1,
        textAlign: 'left',
        background: '#f8d352',
        padding: '5px 10px',
        fontWeight: 'bold',
        color: '#222',
    },
    cartBtn: {
        float: 'right',
        background: '#f8d352',
        color: '#222',
        padding: '5px 10px',
        borderRadius: 0,
        fontWeight: 'bold',
        fontSize: '1.4rem',
    },
    productTitle: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default useStyles;
