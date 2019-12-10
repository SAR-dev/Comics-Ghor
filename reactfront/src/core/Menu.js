import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth/auth';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import ClickOutside from 'react-click-outside';

class Menu extends Component {
    constructor() {
        super()
        this.state = {
            expanded: false
        }
    };

    render() {
        return (
            <ClickOutside
                onClickOutside={() => {
                    this.setState({ expanded: false });
                }}>
                <SideNav
                    style={{ position: "fixed" }}
                    expanded={this.state.expanded}
                    onToggle={(expanded) => {
                        this.setState({ expanded });
                    }}>
                    <SideNav.Toggle />
                    <SideNav.Nav>

                        <NavItem
                            onClick={() => this.props.history.push("/")}
                            active={this.props.history.location.pathname === "/" ? true : false}>
                            <NavIcon>
                                <i className="fas fa-home"></i>
                            </NavIcon>
                            <NavText> Home </NavText>
                        </NavItem>

                        {isAuthenticated() && (
                            <>
                            <NavItem
                                onClick={() => this.props.history.push(`/user/${isAuthenticated().user._id}`)}
                                active={this.props.history.location.pathname === `/user/${isAuthenticated().user._id}` ? true : false}>
                                <NavIcon>
                                    <i className="fas fa-user-cog"></i>
                                </NavIcon>
                                <NavText>
                                    {isAuthenticated().user.name}
                                </NavText>
                            </NavItem>

                            <NavItem
                                onClick={() => this.props.history.push("/post/create")}
                                active={this.props.history.location.pathname === "/post/create" ? true : false}>
                                <NavIcon>
                                    <i className="fas fa-edit"></i>
                                </NavIcon>
                                <NavText>Create Post</NavText>
                            </NavItem>

                            <NavItem
                                onClick={() => this.props.history.push("/series/create")}
                                active={this.props.history.location.pathname === "/series/create" ? true : false}>
                                <NavIcon>
                                    <i className="fas fa-layer-group"></i>
                                </NavIcon>
                                <NavText>Create Series</NavText>
                            </NavItem>
                            </>
                        )}

                        {!isAuthenticated() && (
                            <>
                                <NavItem
                                    onClick={() => this.props.history.push("/signin")}
                                    active={this.props.history.location.pathname === "/signin" ? true : false}>
                                    <NavIcon>
                                        <i className="fas fa-user-shield"></i>
                                    </NavIcon>
                                    <NavText> Sign In </NavText>
                                </NavItem>

                                <NavItem
                                    onClick={() => this.props.history.push("/signup")}
                                    active={this.props.history.location.pathname === "/signup" ? true : false}>
                                    <NavIcon>
                                        <i className="fas fa-user-plus"></i>
                                    </NavIcon>
                                    <NavText> Sign Up </NavText>
                                </NavItem>
                            </>
                        )}

                        {isAuthenticated() && (
                            <>
                                <NavItem
                                    onClick={() => signout(() => this.props.history.push("/"))}>
                                    <NavIcon>
                                        <i className="fas fa-sign-out-alt"></i>
                                    </NavIcon>
                                    <NavText> Sign Out </NavText>
                                </NavItem>
                            </>
                        )}
                    </SideNav.Nav>
                </SideNav>
            </ClickOutside>
        )
    }
}

export default withRouter(Menu);