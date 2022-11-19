import * as React from 'react';
import './Header.css'
import { styled, alpha } from '@mui/material/styles';
import {AppBar, Box, Toolbar, Typography, InputBase, Button} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ShoppingCart } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { InputLabel, FormControl, Input} from '@material-ui/core';
import LockIcon from '@mui/icons-material/Lock';
import CopyrightIcon from '@mui/icons-material/Copyright';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { TextField} from '@mui/material';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement(document.getElementById('root'));

export default function Header(props) {
    const [loginModal, setLoginModal] = React.useState(props.loginModal);
    const [registerModal, setRegisterModal] = React.useState(props.regitersModal)
    const [isLogin, setLogin] = React.useState(sessionStorage.getItem("token") == null ? false : true)
    const [role, setRole] = React.useState(sessionStorage.getItem("role"));
    const [open, setOpen] = React.useState(false);
    const [snackSverity, setSnackSeverity] = React.useState("success");
    const [snackMessage, setSnackMessage] = React.useState("Addresss Added");
    const [addProductModal, setAddProductModal] = React.useState(false);
    const navigate = useNavigate();

    const handleSnackClick = () => {
        setOpen(true);
    };

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpen(false);
    };

    function openLoginModal() {
        setLoginModal(true);
    }

    function closeLoginModal() {
        setLoginModal(false);
        navigate('/');
    }

    function openRegisterModal() {
        setRegisterModal(true);
    }

    function closeRegisterModal() {
        setRegisterModal(false);
        navigate('/');
    }

    function openProductModal() {
        setAddProductModal(true);
    }

    function closeProductModal() {
        setAddProductModal(false);
    }

    function onClickNoAccount() {
        closeLoginModal();
        openRegisterModal();
    }

    function onClickAccount() {
        closeRegisterModal();
        openLoginModal();
    }

    function onClickLoginModal() {
        let email = document.getElementById("modal-login-email").value;
        let password = document.getElementById("modal-login-password").value;

        let xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                let data = JSON.parse(this.responseText);
                if (data.isAuthenticated === true) {
                    sessionStorage.setItem("token", data.token);
                    sessionStorage.setItem("role", data.role);
                    setLogin(true);
                    setRole(data.role);
                    window.alert("Login Successfull");
                    closeLoginModal();
                    navigate('/products');
                }
                else {
                    window.alert("Invalid Credentials");
                }
            }
        });

        xhr.open("POST", props.baseURL + `auth/${email}/${password}`);

        xhr.send();
    }

    function onClickLogoutModal() {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                let data = JSON.parse(this.responseText);

                if (data.isAuthenticated === false) {
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("role");
                    setLogin(false);
                    setRole(sessionStorage.getItem("role"));
                    window.alert("Logout Successfull");
                    navigate('/');
                }
            }
        });

        xhr.open("POST", props.baseURL + `logout`);

        xhr.setRequestHeader("x-access-token", sessionStorage.getItem("token"));

        xhr.send();
    }

    function onClickRegisterModal() {
        let firstName = document.getElementById("modal-register-fname").value;
        let lastName = document.getElementById("modal-register-lname").value;
        let email = document.getElementById("modal-register-email").value;
        let contactNumber = document.getElementById("modal-register-contact-number").value;
        let password = document.getElementById("modal-register-confirm-password").value;

        let xhr = new XMLHttpRequest();

        let dataSignup = JSON.stringify({
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "contactNumber": contactNumber,
            "password": password
        })

        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                let data = JSON.parse(this.responseText);

                if (data.status === "Try any other email, this email is already registered!") {
                    window.alert("Email already registered!");
                }
                else if (data.status === "Invalid email-id format!") {
                    window.alert("Invalid Email Id");
                }
                else if (data.status === "Invalid contact number!") {
                    window.alert("Invalid contact number!");
                }
                else if (data.status === "Registration Successfull!") {
                    window.alert("Registration Successfull! Please login");
                    closeRegisterModal();
                }
            }
        });

        xhr.open("POST", props.baseURL + `users`);

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Cache-Control", "no-cache");

        xhr.send(dataSignup);


    }

    function onChangeSearchBar(e) {
        let name = e.target.value;
        
        if (props.setProductsData === undefined) {
            return;
        }

        if (name === "") {
            let xhr = new XMLHttpRequest();


            xhr.addEventListener("readystatechange", function() {
                if (this.readyState === 4) {
                    let data = JSON.parse(this.responseText);

                    props.setProductsData(data);
                    props.setSort("default");
                    props.setTabCategory("All");

                }
            });

            xhr.open("GET", props.baseURL + `products`);

            xhr.send();
        }
        else {
            let xhr = new XMLHttpRequest();


            xhr.addEventListener("readystatechange", function() {
                if (this.readyState === 4) {
                    let data = JSON.parse(this.responseText);

                    props.setProductsData(data);
                    props.setSort("default");
                    props.setTabCategory("All");
                }
            });

            xhr.open("GET", props.baseURL + `products?name=${name}`);

            xhr.send();
        }
        
    }

    function onClickProductModal() {
        let name = document.getElementById("product-name").value;
        let category = document.getElementById("product-category").value;
        let manufacturer = document.getElementById("product-manufacturer").value;
        let available = document.getElementById("product-available").value;
        let price = document.getElementById("product-price").value;
        let image = document.getElementById("product-image").value;
        let description = document.getElementById("product-description").value;

        if (name === "" || category === "" || manufacturer === "" || available === "" || price === "" || image === "" || description === "") {
            alert("Please enter all the field");
            return;
        }

        let xhr = new XMLHttpRequest();

        let productsObj = JSON.stringify({
            "name": name,
            "availableItems": available,
            "price": price,
            "category": category,
            "description": description,
            "imageURL": image,
            "manufacturer": manufacturer
        })

        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                let responseObj = JSON.parse(this.responseText);

                if (responseObj.status === "success") {
                    setSnackSeverity("success");
                    setSnackMessage(`Product ${name} Added Successfully`);
                    handleSnackClick();
                    closeProductModal();
                    alert(`Product ${name} Added Successfully`)
                    navigate('/');
                    navigate('/products');
                }
                else {
                    alert("Invalid Product Details!")
                }
            }
        });

        xhr.open("POST", props.baseURL + `products`);

        xhr.setRequestHeader("x-access-token", sessionStorage.getItem("token"));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Cache-Control", "no-cache");

        xhr.send(productsObj);
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
                id="logo"
            >
                <ShoppingCart />
            </Typography>

            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
                id="logo-name"
            >
                upGrad E-Shop
            </Typography>

            {
                !isLogin ?
                "" :
                <Search id="search-bar" onChange={(e) => onChangeSearchBar(e)}>
                    <SearchIconWrapper>
                    <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>
            }

            {
                !isLogin ?
                "" :
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    <Link to="/" className="links">Home</Link>
                </Typography>
            }

            {
                role === "admin" ?
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    <span id="add-product-span" onClick={openProductModal}>Add Product</span>
                </Typography> :
                ""
            }

            {
                !isLogin ?
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    <Link to="/login" className="links" onClick={openLoginModal} id="login-btn">Login</Link>
                </Typography> :
                ""
            }

            {
                !isLogin ?
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    <Link to="/signup" className="links" onClick={openRegisterModal} id="signup-btn">Sing Up</Link>
                </Typography> :
                ""
            }

            {
                !isLogin ?
                "" :
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    <Button variant="contained" id="logout-btn" onClick={onClickLogoutModal}>Logout</Button>
                </Typography>
            }

            <Modal
                isOpen={loginModal}
                onRequestClose={closeLoginModal}
                style={customStyles}
                contentLabel="Login Modal"
                id="login-modal"
            >

                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    <LockIcon id="lock-icon"/>
                </Typography>

                <Typography
                    variant="h5"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    Sign in
                </Typography>

                <FormControl required={true} className="login-modal-form">
                    <InputLabel htmlFor="modal-login-email" >Email</InputLabel>
                    <Input type="text" id="modal-login-email" />
                </FormControl> <br/> <br/>

                <FormControl required={true} className="login-modal-form">
                    <InputLabel htmlFor="modal-login-password">Password</InputLabel>
                    <Input type='password' id="modal-login-password" />
                </FormControl> <br/> <br/>

                <Button variant="contained" color="primary" id="modal-login-btn" onClick={onClickLoginModal}>LOGIN</Button>

                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                    id="no-account-link"
                >
                    <Link to="/signup" onClick={onClickNoAccount}>Don't have an account? Sign Up</Link>
                </Typography>

                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                    id="copyright"
                >
                    <CopyrightIcon/> upGrad 2022
                </Typography>


            </Modal>

            <Modal
                isOpen={registerModal}
                onRequestClose={closeRegisterModal}
                style={customStyles}
                contentLabel="Register Modal"
                id="register-modal"
            >

                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    <LockIcon id="lock-icon"/>
                </Typography>

                <Typography
                    variant="h5"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    Sign up
                </Typography>

                <FormControl required={true} className="register-modal-form">
                    <InputLabel htmlFor="modal-register-fname" >First Name</InputLabel>
                    <Input type="text" id="modal-register-fname" />
                </FormControl> <br/> <br/>

                <FormControl required={true} className="register-modal-form">
                    <InputLabel htmlFor="modal-register-lname" >Last Name</InputLabel>
                    <Input type="text" id="modal-register-lname" />
                </FormControl> <br/> <br/>

                <FormControl required={true} className="register-modal-form">
                    <InputLabel htmlFor="modal-register-email" >Email</InputLabel>
                    <Input type="email" id="modal-register-email" />
                </FormControl> <br/> <br/>

                <FormControl required={true} className="register-modal-form">
                    <InputLabel htmlFor="modal-login-password">Password</InputLabel>
                    <Input type='password' id="modal-register-password" />
                </FormControl> <br/> <br/>

                <FormControl required={true} className="register-modal-form">
                    <InputLabel htmlFor="modal-register-password">Confirm Password</InputLabel>
                    <Input type='password' id="modal-register-confirm-password" />
                </FormControl> <br/> <br/>

                <FormControl required={true} className="register-modal-form">
                    <InputLabel htmlFor="modal-register-contact-number">Contact Number</InputLabel>
                    <Input type='text' id="modal-register-contact-number" />
                </FormControl> <br/> <br/>

                <Button variant="contained" color="primary" id="modal-register-btn" onClick={onClickRegisterModal}>SIGN UP</Button>

                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                    id="account-link"
                >
                    <Link to="/login" onClick={onClickAccount}>Already have an account? Sign in</Link>
                </Typography>

                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                    id="copyright"
                >
                    <CopyrightIcon/> upGrad 2022
                </Typography>


            </Modal>

            <Modal
                isOpen={addProductModal}
                onRequestClose={closeProductModal}
                style={customStyles}
                contentLabel="Product Modal"
                id="product-modal"
            >

                <Typography
                    variant="h5"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    Add Product
                </Typography>

                <FormControl required={true} className="add-product-modal-form">
                    <TextField id="product-name" label="Name" variant="outlined" type="text"/>
                </FormControl> <br/> <br/>

                <FormControl required={true} className="add-product-modal-form">
                    <TextField id="product-category" label="Category" variant="outlined" type="text"/>
                </FormControl> <br/> <br/>

                <FormControl required={true} className="add-product-modal-form">
                    <TextField id="product-manufacturer" label="Manufacturer" variant="outlined" type="text"/>
                </FormControl> <br/> <br/>

                <FormControl required={true} className="add-product-modal-form">
                    <TextField id="product-available" label="Available Items" variant="outlined" type="number"/>
                </FormControl> <br/> <br/>

                <FormControl required={true} className="add-product-modal-form">
                    <TextField id="product-price" label="Price" variant="outlined" type="number"/>
                </FormControl> <br/> <br/>

                <FormControl required={true} className="add-product-modal-form">
                    <TextField id="product-image" label="Image URL" variant="outlined" type="text"/>
                </FormControl> <br/> <br/>

                <FormControl required={true} className="add-product-modal-form">
                    <TextField id="product-description" label="Product Description" variant="outlined" type="text"/>
                </FormControl> <br/> <br/>

                <Button variant="contained" color="primary" id="modal-product-btn" onClick={onClickProductModal}>Save Product</Button>

            </Modal>
            
            </Toolbar>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity={snackSverity} sx={{ width: '100%' }}>
                    {snackMessage}
                </Alert>
            </Snackbar>
        </AppBar>
        </Box>
  );
  
}