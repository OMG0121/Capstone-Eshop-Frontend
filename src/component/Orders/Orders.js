import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../../common/Header/Header";
import './Orders.css';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Orders(props) {
    const isLogin = sessionStorage.getItem("token")==null? false: true;
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const quantity = new URLSearchParams(search).get('quantity');
    console.log(id, quantity);
    const steps = ['Items', 'Select Address', 'Confirm Order'];
    const [activeStep, setActiveStep] = React.useState(0);
    const [productsData, setProductsData] = React.useState([]);
    const [address, setAddress] = React.useState('');
    const [newAddress, setNewAddress] = React.useState('');
    const [addressObj, setAddressObj] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [snackSverity, setSnackSeverity] = React.useState("success");
    const [snackMessage, setSnackMessage] = React.useState("Addresss Added");
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


    const selectHandleChange = (event) => {
        setAddress(event.target.value);
    };


    const handleNext = () => {

        if (activeStep ===1 && address === "") {
            setSnackSeverity("error");
            setSnackMessage("Please select Address");
            handleSnackClick();
            return;
        }

        if (activeStep === 2) {
            let xhr = new XMLHttpRequest();

            let ordersData = JSON.stringify({
                "productId": id,
                "addressId": addressObj._id,
                "quantity": quantity,
            })

            xhr.addEventListener("readystatechange", function() {
                if (this.readyState === 4) {
                    console.log(this.responseText);

                    let responseObj = JSON.parse(this.responseText);

                    if (responseObj.status === "success") {
                        setSnackSeverity("success");
                        setSnackMessage("Order Placed Successfully");
                        handleSnackClick();
                        alert("Order Placed Successfully")
                        navigate('/products');
                    }
                }
            });

            xhr.open("POST", props.baseURL + `orders`);

            xhr.setRequestHeader("x-access-token", sessionStorage.getItem("token"));
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Cache-Control", "no-cache");

            xhr.send(ordersData);

            return;
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    React.useEffect(() => {

        let xhrProduct = new XMLHttpRequest();

        xhrProduct.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                console.log(this.responseText);

                let data = JSON.parse(this.responseText);

                setProductsData(data);
            }
        });

        xhrProduct.open("GET", `http://localhost:8085/products/${id}`);

        xhrProduct.send();
    },[])


    function onClickSaveAddress() {
        let name = document.getElementById("address-name").value;
        let contact = document.getElementById("address-contact").value;
        let street = document.getElementById("address-street").value;
        let city = document.getElementById("address-city").value;
        let state = document.getElementById("address-state").value;
        let landmark = document.getElementById("address-landmark").value;
        let zip = document.getElementById("address-zip").value;

        console.log(name, contact, street, city, state, landmark, zip);

        if (name === "" || contact === "" || street === "" || city === "" || city === "" || state === "" || landmark === "" || zip === "") {
            alert("Please enter all the fields");
            return;
        }

        let xhr = new XMLHttpRequest();

        let addressData = JSON.stringify({
            "zipcode": zip,
            "state": state,
            "street": street,
            "landmark": landmark,
            "city": city,
            "contactNumber": contact,
            "name": name
        })

        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                console.log(this.responseText);

                let responseObj = JSON.parse(this.responseText);

                if (responseObj.status === "success") {
                    alert("Address saved! Please select from dropdown")
                    setAddressObj(responseObj.data);
                    setNewAddress(street + " " + city + " " + landmark + " " + state);
                }
                else {
                    alert("Invalid address field");
                }
            }
        });

        xhr.open("POST", props.baseURL + `addresses`);

        xhr.setRequestHeader("x-access-token", sessionStorage.getItem("token"));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Cache-Control", "no-cache");

        xhr.send(addressData);
    }

    return (
        <div>
            {
            !isLogin ?
                <Header loginModal={props.loginModal} baseURL={props.baseURL} regitersModal={props.regitersModal}/> :
            <div>
                <Header loginModal={props.loginModal} baseURL={props.baseURL} regitersModal={props.regitersModal}/>

                <div id="stepper-div">
                    <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        return (
                            <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                        })}
                    </Stepper>
                    
                    {
                        activeStep === 0 ?
                        <div id="main-stepper-div">
                            <div>
                            {
                                productsData.map((product) => (
                                    <div id="details-main-container" key={product._id}>
                                        <div id="img-div">
                                            <img src={product.imageURL} alt={product.name} id="products-img" />
                                        </div>
                                        <div id="product-detail-div">
                                            <div id="product-name-div">
                                                <Typography variant="h5" component="div" id="product-name">
                                                    <strong>{product.name}</strong>
                                                </Typography>
                                            </div>

                                            <div id="product-quantity-div">
                                                <Typography variant="h6" component="div">
                                                    Quantity:
                                                </Typography>
                                                <Typography variant="h5" component="div" id="product-category-typography">
                                                    <strong>{quantity}</strong>
                                                </Typography>
                                            </div>

                                            <div id="product-category-div">
                                                <Typography variant="h6" component="div">
                                                    Category:
                                                </Typography>
                                                <Typography variant="h5" component="div" id="product-category-typography">
                                                    <strong>{product.category}</strong>
                                                </Typography>
                                            </div>

                                            <div id="product-description-div">
                                                <Typography variant="body2" component="div">
                                                    {product.description}
                                                </Typography>
                                            </div>

                                            <div id="product-price-div">
                                                <Typography variant="h5" component="div" id="product-price-typography">
                                                    Total Price: <CurrencyRupeeIcon />{product.price * quantity}
                                                </Typography>
                                            </div>

                                        </div>
                                    </div>
                                ))
                            }
                            </div>
                            <div className="button-div">
                                <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                                >
                                Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />

                                <Button onClick={handleNext} variant="contained" color="primary">
                                {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
                                </Button>
                            </div>
                        </div> :
                        ""
                    }

                    {
                        activeStep === 1 ?
                        <div>
                            <div id="stepper-address-div">
                                <FormControl className="stepper-form-control">
                                    <InputLabel id="demo-simple-select-label">Select Address</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Select Address"
                                        value={address}
                                        onChange={selectHandleChange}
                                    >
                                        <MenuItem value={newAddress}>{newAddress}</MenuItem>
                                    </Select>
                                </FormControl>

                                <Typography
                                    variant="h5"
                                    noWrap
                                    component="div"
                                    sx={{ display: { xs: 'none', sm: 'block' } }}
                                >
                                    Or
                                </Typography>

                                <Typography
                                    variant="h5"
                                    noWrap
                                    component="div"
                                    sx={{ display: { xs: 'none', sm: 'block' } }}
                                >
                                    Add New Address
                                </Typography>

                                <FormControl required={true} className="stepper-form-control">
                                    <TextField id="address-name" label="Name" variant="outlined" type="text"/>
                                </FormControl> <br/> <br/>

                                <FormControl required={true} className="stepper-form-control">
                                    <TextField id="address-contact" label="Contact Number" variant="outlined" type="number"/>
                                </FormControl> <br/> <br/>

                                <FormControl required={true} className="stepper-form-control">
                                    <TextField id="address-street" label="Street" variant="outlined" type="text"/>
                                </FormControl> <br/> <br/>

                                <FormControl required={true} className="stepper-form-control">
                                    <TextField id="address-city" label="City" variant="outlined" type="text"/>
                                </FormControl> <br/> <br/>

                                <FormControl required={true} className="stepper-form-control">
                                    <TextField id="address-state" label="State" variant="outlined" type="text"/>
                                </FormControl> <br/> <br/>

                                <FormControl required={true} className="stepper-form-control">
                                    <TextField id="address-landmark" label="Landmark" variant="outlined" type="text"/>
                                </FormControl> <br/> <br/>

                                <FormControl required={true} className="stepper-form-control">
                                    <TextField id="address-zip" label="Zip Code" variant="outlined" type="text"/>
                                </FormControl> <br/> <br/>

                                <FormControl required={true} className="stepper-form-control">
                                    <Button variant="contained" color="primary" onClick={onClickSaveAddress}>Save Address</Button>
                                </FormControl> <br/> <br/>

                            </div>
                            <div className="button-div">
                                <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                                >
                                Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />

                                <Button onClick={handleNext} variant="contained" color="primary">
                                {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
                                </Button>
                            </div>
                        </div> :
                        ""
                    }

                    {
                        activeStep === 2 ?
                        <div>
                            <div id="order-div">
                                <div id="order-products-div">
                                    <div id="product-name-div">
                                        <Typography variant="h5" component="div" id="product-name">
                                            <strong>{productsData[0].name}</strong>
                                        </Typography>
                                    </div>

                                    <div id="product-quantity-div">
                                        <Typography variant="h6" component="div">
                                            Quantity:
                                        </Typography>
                                        <Typography variant="h5" component="div" id="product-category-typography">
                                            <strong>{quantity}</strong>
                                        </Typography>
                                    </div>

                                    <div id="product-category-div">
                                        <Typography variant="h6" component="div">
                                            Category:
                                        </Typography>
                                        <Typography variant="h5" component="div" id="product-category-typography">
                                            <strong>{productsData[0].category}</strong>
                                        </Typography>
                                    </div>

                                    <div id="product-description-div">
                                        <Typography variant="body2" component="div">
                                            {productsData[0].description}
                                        </Typography>
                                    </div>

                                    <div id="product-price-div">
                                        <Typography variant="h5" component="div" id="product-price-typography">
                                            Total Price: <CurrencyRupeeIcon />{productsData[0].price * quantity}
                                        </Typography>
                                    </div>
                                </div>

                                <div id="orders-address-div">
                                    <Typography variant="h5" component="div">
                                        <strong>Address Details:</strong>
                                    </Typography>

                                    <Typography variant="body2" component="div">
                                        {addressObj.street}
                                    </Typography>

                                    <Typography variant="body2" component="div">
                                        {addressObj.city}
                                    </Typography>

                                    <Typography variant="body2" component="div">
                                        {addressObj.state}
                                    </Typography>

                                    <Typography variant="body2" component="div">
                                        Contact Number: {addressObj.contactNumber}
                                    </Typography>

                                    <Typography variant="body2" component="div">
                                        Zip Code: {addressObj.zipCode}
                                    </Typography>
                                </div>
                            </div>
                            <div className="button-div">
                                <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                                >
                                Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />

                                <Button onClick={handleNext} variant="contained" color="primary">
                                {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
                                </Button>
                            </div>
                        </div> :
                        ""
                    }
                    </Box>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleSnackClose}>
                        <Alert onClose={handleSnackClose} severity={snackSverity} sx={{ width: '100%' }}>
                            {snackMessage}
                        </Alert>
                    </Snackbar>
                </div>
            </div>
            }
        </div>
    );
}