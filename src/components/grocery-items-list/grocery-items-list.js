import React, { Component } from 'react';
import GroceryItem from '../grocery-item/grocery-item';


import firebase from '../../firebase/firebase';

import "./grocery-items-list.css";

import { Button, Modal, Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

export default class GroceryItemsList extends Component {

    state = {
        groceryList: [],
        show: false,
        id: uuidv4(),
        imageUrl: null,
        name: null,
        count: null,
        width: null,
        height: null,
        weight: null
    };

    fetchProducts = () => {
        const db = firebase.firestore();
        let newItems = [];
        db.collection("Product").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                newItems.push({
                    id: doc.id,
                    imageUrl: doc.data().imageUrl,
                    name: doc.data().name,
                    count: doc.data().count,
                    size: doc.data().size,
                    weight: doc.data().weight
                })
            });
            this.setState({
                groceryList: newItems
            });
        });
    }

    componentDidMount = () => {
        this.fetchProducts();
    }

    deleteProduct = (id) => {
        const db = firebase.firestore();
        db.collection("Product").doc(id).delete().then(() => {
            this.fetchProducts();
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        
    }

    handleAdd = () => {
        const { id, imageUrl, name, count, width, height, weight } = this.state;
        const db = firebase.firestore();
        db.collection("Product").doc(id).set({
            imageUrl: imageUrl,
            name: name,
            count: count,
            size: {
                width: width,
                height: height
            },
            weight: weight,
            comment: []
        })
        .then(() => {
            this.fetchProducts();
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
        this.setState({ show: false });
    };
    
    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });
    
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    render() {
        const { groceryList } = this.state;

        const elements = groceryList && groceryList.map( item => {
            return(
                <li key={item.id} className="list-group-item">
                    <GroceryItem {...item} deleteProduct={this.deleteProduct}/>
                </li>
            );
        });

        return(
            <div className="grocery-list">
                {elements}

                <Button className="add-product-btn" variant="primary" onClick={this.handleShow}>
                    Add product
                </Button>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group >
                                <Form.Label>Name</Form.Label>
                                <Form.Control id="name" onChange={this.handleChange} type="text" placeholder="Enter name" />
                            </Form.Group>

                            <Form.Group >
                                <Form.Label>Count</Form.Label>
                                <Form.Control id="count" onChange={this.handleChange} type="text" placeholder="Enter count" />
                            </Form.Group>

                            <Form.Group >
                                <Form.Label>Size</Form.Label>
                                <Form.Control id="width" onChange={this.handleChange} type="text" placeholder="Enter width" />
                                <Form.Control id="height" onChange={this.handleChange} type="text" placeholder="Enter height" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Weight</Form.Label>
                                <Form.Control id="weight" onChange={this.handleChange} type="text" placeholder="Enter weight" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Photo url</Form.Label>
                                <Form.Control id="imageUrl" onChange={this.handleChange} type="text" placeholder="Enter url" />
                            </Form.Group>
                            
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={() => this.handleAdd()}>
                                Save Changes
                            </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}