import React from 'react';
import { combineReducers, applyMiddleware, compose, createStore } from 'redux';
import { reduxReactRouter, routerStateReducer, ReduxRouter } from 'redux-router';
import { createHistory } from 'history';
import { Route } from 'react-router';

// Configure routes like normal
const routes = (
    <Route path="/" component={App}>
        <Route path="parent" component={Parent}>
            <Route path="child" component={Child} />
            <Route path="child/:id" component={Child} />
        </Route>
    </Route>
);

// Configure reducer to store state at state.router
// You can store it elsewhere by specifying a custom `routerStateSelector`
// in the store enhancer below
const reducer = combineReducers({
    router: routerStateReducer,
    //app: rootReducer, //you can combine all your other reducers under a single namespace like so
});

// Compose reduxReactRouter with other store enhancers
const store = compose(
    applyMiddleware(m1, m2, m3),
    reduxReactRouter({
        routes,
        createHistory
    }),
    devTools()
)(createStore)(reducer);


// Elsewhere, in a component module...
import { connect } from 'react-redux';
import { push } from 'redux-router';

connect(
    // Use a selector to subscribe to state
    state => ({ q: state.router.location.query.q }),

    // Use an action creator for navigation
    { push }
)(SearchBox);