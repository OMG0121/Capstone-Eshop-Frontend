import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../../common/Header/Header";
import './Details.css';
import { Button, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

export default function Details(props) {
    const isLogin = sessionStorage.getItem("token")==null? false: true;
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    console.log(id);
    const navigate = useNavigate();
    const [productsData, setProductsData] = React.useState([]);
    const [categoriesData, setCategoriesData] = React.useState([]);
    const [tabCategory, setTabCategory] = React.useState('All');
    console.log(productsData);

    const tabsHandleChange = (event, newCategory) => {
        navigate('/products');
        setTabCategory(newCategory);
    };

    React.useEffect(() => {
        let xhrCategory = new XMLHttpRequest();

        xhrCategory.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                console.log(this.responseText);

                let data = JSON.parse(this.responseText);

                setCategoriesData(data);
            }
        });

        xhrCategory.open("GET", `http://localhost:8085/products/categories`);

        xhrCategory.send();

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

    function onClickOrderBtn() {
        let quantity = document.getElementById("product-quantity").value;
        
        if (quantity > productsData[0].availableItems) {
            alert("Please add lesser quantity than availabel items");
        }
        else {
            alert("Added to Cart");
        }
    }

    return (
        <div>
            {
                !isLogin ?
                <Header loginModal={props.loginModal} baseURL={props.baseURL} regitersModal={props.regitersModal}/> :
                <div>
                    <Header loginModal={props.loginModal} baseURL={props.baseURL} regitersModal={props.regitersModal}/>
                    
                    <div id="tabs-div">
                        <ToggleButtonGroup
                            color="primary"
                            value={tabCategory}
                            exclusive
                            onChange={tabsHandleChange}
                            >
                            <ToggleButton value="All">All</ToggleButton>
                            {
                                categoriesData.map((category) => (
                                    <ToggleButton value={category} key={category}>{category}</ToggleButton>
                                ))
                            }
                        </ToggleButtonGroup>
                    </div>

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
                                        <Button variant="contained" color="primary" id="available-btn">Available Quantity: {product.availableItems}</Button>
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
                                            <CurrencyRupeeIcon />{product.price}
                                        </Typography>
                                    </div>

                                    <div id="product-quantity-div">
                                        <TextField id="product-quantity" label="Enter Quantity" variant="outlined" type="number"/>
                                    </div>

                                    <div id="product-place-order-div">
                                        <Button variant="contained" color="primary" id="order-btn" onClick={onClickOrderBtn}>Place Order</Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                </div>
            }
        </div>
    );
}