import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import "./grocery-item.css";

const  GroceryItem = ({ id, imageUrl, name, count , size:{ width, height}, weight, deleteProduct}) =>  {
    const [show, setShow] = useState(false);
    
    const handleSave = () => {
        deleteProduct(id);
        setShow(false);
    };
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return(
        <div className="grocery-list-item ">
            <div className="item-cover">
                <img src={imageUrl} alt="cover" />
            </div>
            <div className="grocery-details">
                <Link to={"/" + id} key={id}>
                    <span href="#" className="grocery-name">{name}</span>
                </Link>
                <div className="item-prop">Count: {count}</div>
                <div className="item-prop">Weight: {weight}</div>
                <div className="item-prop">Size: width: {width}, height: {height} </div>
            </div>

            <Button className="delete-product-btn" variant="primary" onClick={handleShow}>
                    Delete product
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete this product?</Modal.Title>
                </Modal.Header>
                <Modal.Body>If you sure click - YES</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Yes
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default GroceryItem;