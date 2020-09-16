import React, { Component } from 'react'
import WelcomeImage from '../images/welcome-page.jpg'
import { Link } from 'react-router-dom';
import SeoHelmet from '../core/SeoHelmet';

export default class Welcome extends Component {
    render() {
        return (
            <>
            <SeoHelmet title="Welcome" />
            <div className="w-screen h-screen absolute top-0 overflow-hidden">
                <img src={WelcomeImage} className="w-screen h-screen object-cover" />
            </div>
            <div className="relative">
                <h1 className="text-white px-5 tracking-wide md:pl-16 text-5xl md:text-6xl font-black welcome-font">WELCOME TO <span className="text-yellow-400">CGSN</span></h1>
                <h1 className="text-2xl text-white px-5 md:pl-16 tracking-wide">A CANVAS TO PAINT YOUR MIND OUT</h1>
                <h1 className="max-w-screen-md text-xl text-white px-5 md:pl-16 my-5">
                The purpose of Comics Ghor is to create a free platform for all the Bangladeshi people.
                We want nothing but to unleash your latent talents without hesitation. So join us today and start your journey.
                </h1>
                <div className="pl-5 md:pl-16 block mt-10">
                    <Link to="/signin" className="text-lg md:text-xl text-white bg-pink-600 focus:shadow-outline px-5 md:px-8 font-semibold py-2 uppercase tracking-wide rounded-lg shadow hover:bg-pink-800 mr-2">Sign In</Link>
                    <Link to="/signup" className="text-lg md:text-xl text-white bg-pink-600 focus:shadow-outline px-5 md:px-8 font-semibold py-2 uppercase tracking-wide rounded-lg shadow hover:bg-pink-800 ml-2">Join Us</Link>
                </div>
            </div>
            </>
        )
    }
}
