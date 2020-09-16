import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LoaderSvg from '../images/rings.svg';
import Img from 'react-image';

export default class SearchUserCard extends Component {
    render() {
        const { user, key } = this.props;
        return (
            <div className="w-full p-4 bg-gray-800 shadow rounded my-4" key={key}>
                <div className="flex flex-wrap">
                    <div className="w-48 mx-auto md:mx-0">
                        <Link to={`/user/${user._id}`}>
                            <Img
                                src={`https://i.imgur.com/${user.avatar}.png`}
                                alt="User"
                                className="h-32 w-32 object-cover rounded-full border-2 mx-auto border-white shadow"
                                loader={<img src={LoaderSvg} className="h-32 mx-auto" />}
                            />
                        </Link>
                        <div className="flex justify-center my-3">
                            <div className="flex flex-wrap">
                                {user.Sinstagram && (
                                    <a
                                        className="mb-2 mr-2 text-sm rounded bg-pink-700 px-2 py-1 text-white"
                                        href={`${user.Sinstagram}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fab fa-instagram" />
                                    </a>
                                )}
                                {user.Sfacebook && (
                                    <a
                                        className="mb-2 mr-2 text-sm rounded bg-blue-700 px-2 py-1 text-white"
                                        href={`${user.Sfacebook}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fab fa-facebook" />
                                    </a>
                                )}
                                {user.Stwitter && (
                                    <a
                                        className="mb-2 mr-2 text-sm rounded bg-blue-500 px-2 py-1 text-white"
                                        href={`${user.Stwitter}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fab fa-twitter" />
                                    </a>
                                )}
                                {user.Syoutube && (
                                    <a
                                        className="mb-2 mr-2 text-sm rounded bg-red-600 px-2 py-1 text-white"
                                        href={`${user.Syoutube}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fab fa-youtube" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="block">
                        <Link to={`/user/${user._id}`}>
                            <h1 className="w-full text-2xl mb-2 font-semibold text-white">
                                {user.name}
                            </h1>
                            {user.fullname && <h1 className="w-full text-base my-1 font-semibold text-white">
                                {user.fullname}
                            </h1>}
                            <h1 className="w-full mb-1 text-xs font-semibold text-white">
                                <i className="far fa-envelope mr-2" />
                                {user.email}
                            </h1>
                            {user.contact && <h1 className="w-full mb-1 text-xs font-semibold text-white">
                                <i className="fas fa-phone-square-alt mr-2" />
                                {user.contact}
                            </h1>}
                            {user.blood && <h1 className="w-full mb-1 text-xs font-semibold text-white">
                                <i className="fas fa-tint mr-2" />
                                {user.blood}
                            </h1>}
                            <h1 className="w-full mb-1 text-xs font-semibold text-white">
                                {user.gender === 'Male' && (
                                    <>
                                        <i className="fab fa-phoenix-squadron mr-2" />
                                        {user.gender}
                                    </>
                                )}
                                {user.gender === 'Female' && (
                                    <>
                                        <i className="fab fa-phoenix-framework mr-2" />
                                        {user.gender}
                                    </>
                                )}
                                {user.gender === 'Other' && (
                                    <>
                                        <i className="fab fa-phoenix-framework mr-2" />
                                        {user.gender}
                                    </>
                                )}
                            </h1>
                            <h1 className="w-full mb-1 text-xs font-semibold text-white">
                                <i className="fas fa-map-marker mr-2" />
                                {`Joined ${new Date(user.created).getFullYear()}`}
                            </h1>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}
