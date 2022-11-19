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
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { TextField} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

export default function Products(props) {
    const isLogin = sessionStorage.getItem("token")==null? false: true;
    const role = sessionStorage.getItem("role");
    const [productsData, setProductsData] = React.useState([]);
    const [categoriesData, setCategoriesData] = React.useState([]);
    const [tabCategory, setTabCategory] = React.useState('All');
    const [sort, setSort] = React.useState('');
    const [addProductModal, setAddProductModal] = React.useState(false);
    const [deleteProductModal, setDeleteProductModal] = React.useState(false);
    const [id, setId] = React.useState("");
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


    function openProductModal(id) {
        setAddProductModal(true);
        setId(id)
    }

    function closeProductModal() {
        setAddProductModal(false);
    }

    function openDeleteProductModal(id) {
        setDeleteProductModal(true);
        setId(id);
    }

    function closeDeleteProductModal() {
        setDeleteProductModal(false);
    }

    const selectHandleChange = (event) => {
        let newSort = event.target.value;
        let category = tabCategory;

        if (newSort === "default") {
            if (category === "All") {
                let xhrProduct = new XMLHttpRequest();

                xhrProduct.addEventListener("readystatechange", function() {
                    if (this.readyState === 4) {

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

    function onCLickBuyHandler (id) {
        navigate(`/details?id=${id}`)
    }

    React.useEffect(() => {
        let xhrCategory = new XMLHttpRequest();

        xhrCategory.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {

                let data = JSON.parse(this.responseText);

                setCategoriesData(data);
            }
        });

        xhrCategory.open("GET", `http://localhost:8085/products/categories`);

        xhrCategory.send();

        let xhrProduct = new XMLHttpRequest();

        xhrProduct.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {

                let data = JSON.parse(this.responseText);

                setProductsData(data);
            }
        });

        xhrProduct.open("GET", `http://localhost:8085/products`);

        xhrProduct.send();
    },[])

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
                    setSnackMessage(`Product ${name} Updated Successfully`);
                    handleSnackClick();
                    alert(`Product ${name} Updated Successfully`)
                    closeProductModal();
                    navigate('/');
                    navigate('/products');
                }
                else {
                    alert("Invalid Product Details!")
                }
            }
        });

        xhr.open("PUT", props.baseURL + `products/${id}`);

        xhr.setRequestHeader("x-access-token", sessionStorage.getItem("token"));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Cache-Control", "no-cache");

        xhr.send(productsObj);
    }

    function onClickDeleteProductModal() {

        let xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {

                let responseObj = JSON.parse(this.responseText);

                if (responseObj.status === "success") {
                    setSnackSeverity("success");
                    setSnackMessage("Product Deleted Successfully");
                    handleSnackClick();
                    alert("Product Deleted Successfully")
                    closeDeleteProductModal();
                    navigate('/');
                    navigate('/products');
                }
                else {
                    alert("Delete Unsuccessfull")
                }
            }
        });

        xhr.open("DELETE", props.baseURL + `products/${id}`);

        xhr.setRequestHeader("x-access-token", sessionStorage.getItem("token"));

        xhr.send();
    }

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
                                    <Button variant="contained" color="primary" id="buy-btn" onClick={() => {onCLickBuyHandler(product._id)}}>Buy</Button> :
                                    <div id="btn-div">
                                        <div>
                                            <Button variant="contained" color="primary" id="buy-btn" onClick={() => {onCLickBuyHandler(product._id)}}>Buy</Button>
                                        </div>
                                        <div>
                                            <EditIcon id="edit-btn" onClick={() => {openProductModal(product._id)}}/> <DeleteIcon id="delete-btn" onClick={() => {openDeleteProductModal(product._id)}}/>
                                        </div>
                                    </div>
                                    
                                }
                                
                            </div>
                                
                        </Card>
                    ))
                }

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
                        Modify Product
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

                    <Button variant="contained" color="primary" id="modal-product-btn" onClick={onClickProductModal}>Modify Product</Button>

                </Modal>

                <Modal
                    isOpen={deleteProductModal}
                    onRequestClose={closeDeleteProductModal}
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
                        Confirm Deletion Of Product
                    </Typography> <br/> <br/>

                    <Typography
                        variant="body2"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        Are you sure you want to delete the product?
                    </Typography> <br/> <br/>

                    <Button variant="contained" color="primary" id="modal-product-btn" onClick={onClickDeleteProductModal}>Delete</Button>
                    <Button id="modal-product-btn" onClick={closeDeleteProductModal}>Cancel</Button>

                </Modal>
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