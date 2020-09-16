import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Posts from './post/Posts';
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
import Activate from './user/Activate';
import Search from './misc/Search';
import Admin from './admin/Admin';
import NewCategory from './category/NewCategory';
import EditCategory from './category/EditCategory';
import SingleCategory from './category/SingleCategory';
import CategoriesList from './category/CatogoriesList';
import Join from './chat/Join';
import Main from './chat/Component/Main/Main';
import ChatProfile from './chat/Component/Profile/Profile';
import Welcome from './misc/Welcome';
import Help from './misc/Help';
import PostType from './post/create/PostType';
import NewArticle from './post/create/article/NewArticle';
import NewComic from './post/create/comic/NewComic';
import NewDiscussion from './post/create/discussion/NewDiscussion';
import NewNovel from './post/create/novel/NewNovel';
import NewArtworks from './post/create/artworks/NewArtworks';
import NotFound from './core/NotFound';

const MainRouter = () => (
    <div>
        <Menu />
        <Switch>
            <Route exact path="/" component={Posts} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword} />
            <PrivateRoute exact path="/post/create" component={NewPost} />
            <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/signin" component={Signin} />
            <PrivateRoute exact path="/user/:userId" component={Profile} />
            <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
            <Route exact path="/post/:postId" component={SinglePost} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/series" component={Series} />
            <Route exact path="/categories" component={CategoriesList} />
            <Route exact path="/series/:seriesId" component={SingleSeries} />
            <Route exact path="/category/:catId" component={SingleCategory} />
            <Route exact path="/account/activate/:token" component={Activate} />
            <PrivateRoute exact path="/series/new/create" component={NewSeries} />
            <PrivateRoute exact path="/series/edit/:seriesId" component={EditSeries} />
            <PrivateRoute exact path="/admin" component={Admin} />
            <PrivateRoute exact path="/category/new/create" component={NewCategory} />
            <PrivateRoute exact path="/category/edit/:catId" component={EditCategory} />
            <PrivateRoute exact path="/chat/join" component={Join} />
            <PrivateRoute exact path="/chat/message" component={Main} />
            <PrivateRoute exact path="/chat/profile" component={ChatProfile} />
            <Route exact path="/welcome" component={Welcome} />
            <Route exact path="/help" component={Help} />

            <Route exact path="/post/type/select" component={PostType} />
            <PrivateRoute exact path="/post/article/create" component={NewArticle} />
            <PrivateRoute exact path="/post/comic/create" component={NewComic} />
            <PrivateRoute exact path="/post/discussion/create" component={NewDiscussion} />
            <PrivateRoute exact path="/post/novel/create" component={NewNovel} />
            <PrivateRoute exact path="/post/artworks/create" component={NewArtworks} />

            <Route component={NotFound} />
        </Switch>
    </div>
);

export default MainRouter;
