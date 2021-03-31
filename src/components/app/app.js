import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import GroceryItemsList from '../grocery-items-list/grocery-items-list';
import ItemPage from '../item-page/item-page';
import "./app.css";

export default class App extends Component {
    render() {
        return (
            <main role="main" className="container">
                <Switch>
                    <Route 
                        path="/"
                        component={GroceryItemsList} 
                        exact />
                    <Route 
                        path="/:id"
                        children={<ItemPage />} />
                </Switch>
            </main>
        );
    };
};
