import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Menu from './core/Menu';
import Profile from './user/Profile';
import EditProfile from './user/EditProfile';
import PrivateRoute from './auth/PrivateRoute';
import NewPost from './post/NewPost';
import NewSeries from './series/NewSeries';
import SinglePost from './post/SinglePost';
import EditPost from './post/EditPost';

const MainRouter = () => (
    <div style={{marginLeft: "64px"}}>
        <Menu />
        <Switch>
            <Route exact path="/" component={ Home } />
            <PrivateRoute exact path="/post/create" component={ NewPost } />
            <PrivateRoute exact path="/post/edit/:postId" component={ EditPost } />
            <Route exact path="/signup" component={ Signup } />
            <Route exact path="/signin" component={ Signin } />
            <Route exact path="/user/:userId" component={ Profile } />
            <PrivateRoute exact path="/user/edit/:userId" component={ EditProfile } />
            <Route exact path="/post/:postId" component={ SinglePost } />
            <PrivateRoute exact path="/series/create" component={ NewSeries } />
        </Switch>
    </div>
);

export default MainRouter;
