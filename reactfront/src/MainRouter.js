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
import Series from './series/Series';
import SingleSeries from './series/SingleSeries';
import EditSeries from './series/EditSeries';
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";

const MainRouter = () => (
    <div>
        <Menu />
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword} />
            <PrivateRoute exact path="/post/create" component={NewPost} />
            <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/signin" component={Signin} />
            <PrivateRoute exact path="/user/:userId" component={Profile} />
            <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
            <Route exact path="/post/:postId" component={SinglePost} />
            <Route exact path="/series" component={Series} />
            <Route exact path="/series/:seriesId" component={SingleSeries} />
            <PrivateRoute exact path="/series/new/create" component={NewSeries} />
            <PrivateRoute exact path="/series/edit/:seriesId" component={EditSeries} />
        </Switch>
    </div>
);

export default MainRouter;
