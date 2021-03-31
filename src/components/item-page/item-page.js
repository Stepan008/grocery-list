import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from "react-router-dom";
import { Button, Modal, Form } from 'react-bootstrap';
import firebase from '../../firebase/firebase';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import './item-page.css';
const ItemPage = () => {
    const initialState = {
        comment: [],
        count: null,
        imageUrl: null,
        name: null,
        width: null,
        height: null,
        weight: null,
    }

    const [item, setItem] = useState(initialState);

    const { id } = useParams();

    const fetchProduct = () => {
        var db = firebase.firestore();
        db.collection("Product").doc(id).get().then((doc) => {
            setItem({
                id: doc.id,
                imageUrl: doc.data().imageUrl,
                name: doc.data().name,
                count: doc.data().count,
                width: doc.data().size.width,
                height: doc.data().size.height,
                weight: doc.data().weight,
                comment: doc.data().comment
            });
        });
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    const [show, setShow] = useState(false);
    const [showComment, setShowComment] = useState(false);

    const handleAdd = () =>{
        const db = firebase.firestore();
        db.collection("Product").doc(id).set({
            imageUrl: item.imageUrl,
            name: item.name,
            count: item.count,
            size: {
                width: item.width,
                height: item.height
            },
            weight: item.weight,
            comment: item.comment
        })
        .then(() => {
            fetchProduct();
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
        setShow(false)
    };

    const handleClose = () =>{ 
        fetchProduct();
        setShow(false);
    }
    const handleCloseComment = () => setShowComment(false);

    const handleShow = () => setShow(true);
    const handleShowComment = () => setShowComment(true);


    const handleDeleteComment = (commId) => {
        const idx = item.comment.findIndex(comm => {
            return comm.id === commId;
        });
        const db = firebase.firestore();
        db.collection("Product").doc(id).update({
            "comment":  [
                ...item.comment.slice(0, idx),
                ...item.comment.slice(idx + 1)
            ]
        })
        .then(() => {
            fetchProduct();
            console.log("Comment successfully deleted!");
        })
        .catch((error) => {
            console.error("Error deleting comment: ", error);
        });
    }

    const [description, setDescription] = useState("");

    const handleChangeComment = (e) => {
        setDescription(e.target.value);
    };

    const handleAddComment = () => {
        const db = firebase.firestore();
        db.collection("Product").doc(id).update({
            "comment":  [
                ...item.comment,
                {
                    id: uuidv4(),
                    productId: id,
                    description: description,
                    date: new Date()
                }
            ]
        })
        .then(() => {
            fetchProduct();
            setShowComment(false);
            console.log("Comment successfully added!");
        })
        .catch((error) => {
            console.error("Error adding comment: ", error);
        });
    }

    const handleChange = (e) => {
        setItem({
            ...item,
            [e.target.id]: e.target.value
        });
    };
    const {  imageUrl, name, count , width, height, weight} = item;

    const elements = item && item.comment.map( comment => {
        return(
            <li key={comment.id} className="list-group-item">
                <div className="comment-desc">{comment.description}</div>
                <div className="comment-date">date: {moment().seconds(comment.date.seconds).format("ddd, hA")}</div>
                <Button className="btn" variant="primary" onClick={() => handleDeleteComment(comment.id)}>
                    Delete comment
                </Button>
            </li>
        );
    });

    return(
        <div>
            <div className="grocery-item">
                <div className="item-cover">
                    <img src={imageUrl} alt="cover" />
                </div>
                <div className="item-details">
                    <div className="item-prop">{name}</div>
                    <div className="item-prop">Count: {count}</div>
                    <div className="item-prop">Weight: {weight}</div>
                    <div className="item-prop">Size: width: {width}, height: {height} </div>
                </div>
            </div>
            

            <Button className="item-page-btn" variant="primary" onClick={handleShow}>
                Edit product
            </Button>

            <div className="grocery-comments">
                {elements}
            </div>

            <Button className="item-page-btn" variant="primary" onClick={handleShowComment}>
                Add comment
            </Button>

            <Modal show={showComment} onHide={handleCloseComment}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group >
                            <Form.Control id="description" onChange={handleChangeComment}  type="text"  placeholder="Enter your comment" />
                        </Form.Group>
                        
                        <Button variant="secondary" onClick={handleCloseComment}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleAddComment}>
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    
                </Modal.Footer>
            </Modal>



            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group >
                            <Form.Label>Name</Form.Label>
                            <Form.Control id="name" onChange={handleChange}  type="text" value={item.name ? item.name : " "} placeholder="Enter name" />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Count</Form.Label>
                            <Form.Control id="count" onChange={handleChange} type="text" value={item.count} placeholder="Enter count" />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Size</Form.Label>
                            <Form.Control id="width" onChange={handleChange} type="text" value={item.width} placeholder="Enter width" />
                            <Form.Control id="height" onChange={handleChange} type="text" value={item.height} placeholder="Enter height" />
                        </Form.Group>
                        <Form.Group >
                            <Form.Label>Weight</Form.Label>
                            <Form.Control id="weight" onChange={handleChange} type="text" value={item.weight} placeholder="Enter weight" />
                        </Form.Group>
                        <Form.Group >
                            <Form.Label>Photo url</Form.Label>
                            <Form.Control id="imageUrl" onChange={handleChange} type="text" value={item.imageUrl} placeholder="Enter url" />
                        </Form.Group>
                        
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleAdd}>
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

export default ItemPage;