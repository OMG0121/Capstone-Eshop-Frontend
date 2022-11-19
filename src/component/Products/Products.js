import * as React from 'react';
import './Products.css';
import Header from "../../common/Header/Header";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

export default function Products(props) {
    const isLogin = sessionStorage.getItem("token")==null? false: true;
    const role = sessionStorage.getItem("role");
    const [productsData, setProductsData] = React.useState([]);
    const [categoriesData, setCategoriesData] = React.useState([]);
    const [tabCategory, setTabCategory] = React.useState('All');
    const [sort, setSort] = React.useState('');

    const selectHandleChange = (event) => {
        let newSort = event.target.value;
        let category = tabCategory;

        if (newSort === "default") {
            if (category === "All") {
                let xhrProduct = new XMLHttpRequest();

                xhrProduct.addEventListener("readystatechange", function() {
                    if (this.readyState === 4) {
                        console.log(this.responseText);

                        let data = JSON.parse(this.responseText);

                        setProductsData(data);
                    }
                });

                xhrProduct.open("GET", props.baseURL + `products`);

                xhrProduct.send();
            }
            else {
                let xhrProduct = new XMLHttpRequest();

                xhrProduct.addEventListener("readystatechange", function() {
                    if (this.readyState === 4) {
                        console.log(this.responseText);

                        let data = JSON.parse(this.responseText);

                        setProductsData(data);
                    }
                });

                xhrProduct.open("GET", props.baseURL + `products?category=${category}`);

                xhrProduct.send();
            }
        }
        else if (newSort === "high" || newSort === "low") {
            let direction = (newSort === "high" ? "DES" : "ASC");
            let sortBy = "price";

            if (category === "All") {
                let xhrProduct = new XMLHttpRequest();

                xhrProduct.addEventListener("readystatechange", function() {
                    if (this.readyState === 4) {
                        console.log(this.responseText);

                        let data = JSON.parse(this.responseText);

                        setProductsData(data);
                    }
                });

                xhrProduct.open("GET", props.baseURL + `products?direction=${direction}&sort=${sortBy}`);

                xhrProduct.send();
            }
            else {
                let xhrProduct = new XMLHttpRequest();

                xhrProduct.addEventListener("readystatechange", function() {
                    if (this.readyState === 4) {
                        console.log(this.responseText);

                        let data = JSON.parse(this.responseText);

                        setProductsData(data);
                    }
                });

                xhrProduct.open("GET", props.baseURL + `products?category=${category}&direction=${direction}&sort=${sortBy}`);

                xhrProduct.send();
            }
        }
        else {
            let direction = "DES";
            let sortBy = "updateAt";

            if (category === "All") {
                let xhrProduct = new XMLHttpRequest();

                xhrProduct.addEventListener("readystatechange", function() {
                    if (this.readyState === 4) {
                        console.log(this.responseText);

                        let data = JSON.parse(this.responseText);

                        setProductsData(data);
                    }
                });

                xhrProduct.open("GET", props.baseURL + `products?direction=${direction}&sort=${sortBy}`);

                xhrProduct.send();
            }
            else {
                let xhrProduct = new XMLHttpRequest();

                xhrProduct.addEventListener("readystatechange", function() {
                    if (this.readyState === 4) {
                        console.log(this.responseText);

                        let data = JSON.parse(this.responseText);

                        setProductsData(data);
                    }
                });

                xhrProduct.open("GET", props.baseURL + `products?category=${category}&direction=${direction}&sort=${sortBy}`);

                xhrProduct.send();
            }
        }

        setSort(event.target.value);
    };

    const tabsHandleChange = (event, newCategory) => {
        let category = newCategory;

        if (category === "All") {
            let xhrProduct = new XMLHttpRequest();

            xhrProduct.addEventListener("readystatechange", function() {
                if (this.readyState === 4) {
                    console.log(this.responseText);

                    let data = JSON.parse(this.responseText);

                    setProductsData(data);
                }
            });

            xhrProduct.open("GET", props.baseURL + `products`);

            xhrProduct.send();
        }
        else {
            let xhrProduct = new XMLHttpRequest();

            xhrProduct.addEventListener("readystatechange", function() {
                if (this.readyState === 4) {
                    console.log(this.responseText);

                    let data = JSON.parse(this.responseText);

                    setProductsData(data);
                }
            });

            xhrProduct.open("GET", props.baseURL + `products?category=${category}`);

            xhrProduct.send();
        }

        setSort("default");
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

        xhrProduct.open("GET", `http://localhost:8085/products`);

        xhrProduct.send();
    },[])

    return (
        <div>
        {
            !isLogin ?
            <Header loginModal={props.loginModal} baseURL={props.baseURL} regitersModal={props.regitersModal}/> :
            <div>
                <Header loginModal={props.loginModal} baseURL={props.baseURL} regitersModal={props.regitersModal} setProductsData={setProductsData} setSort={setSort} setTabCategory={setTabCategory}/>

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

                <div id="sort-div">
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Sort By:</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sort}
                        label="Sort By"
                        onChange={selectHandleChange}
                        >
                        <MenuItem value={"default"}>Default</MenuItem>
                        <MenuItem value={"high"}>Price: High to Low</MenuItem>
                        <MenuItem value={"low"}>Price: Low to High</MenuItem>
                        <MenuItem value={"new"}>Newest</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                
                <div id="card-main-container">

                {
                    productsData.map((product) => (
                        <Card sx={{ maxWidth: 345 }} className="products-cards" key={product._id}>
                            <CardActionArea>
                                <CardMedia
                                component="img"
                                height="140"
                                image={product.imageURL}
                                alt={product.name}
                                />
                                <CardContent>
                                <Typography gutterBottom variant="h5" component="div" className="card-detail">
                                <span>{product.name}</span> <span> <CurrencyRupeeIcon/>{product.price}</span>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                {product.description}
                                </Typography>

                                </CardContent>
                            </CardActionArea>

                            <div>
                                {
                                    role === "user" ?
                                    <Button variant="contained" color="primary" id="buy-btn">Buy</Button> :
                                    <div id="btn-div">
                                        <div>
                                            <Button variant="contained" color="primary" id="buy-btn">Buy</Button>
                                        </div>
                                        <div>
                                            <EditIcon id="edit-btn"/> <DeleteIcon id="delete-btn"/>
                                        </div>
                                    </div>
                                    
                                }
                                
                            </div>
                                
                        </Card>
                    ))
                }
                    
                </div>
                
            </div>   
        }
        </div>
    );
}