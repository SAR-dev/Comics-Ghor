import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class PostType extends Component {
    render() {
        return (
            <div className="max-w-screen-md mx-auto my-10 py-10 px-5 bg-gray-800 rounded flex flex-wrap">
                <div className="w-full text-3xl text-center text-gray-400 uppercase px-2 pb-5">What type of post do you want to create ?</div>
                <div className="w-1/2 p-2">
                    <Link className="block rounded p-5 bg-gray-900 text-center hover:bg-gray-700 text-gray-200 font-semibold tracking-widest text-2xl" to="/post/comic/create">COMIC</Link>
                </div>
                <div className="w-1/2 p-2">
                    <Link className="block rounded p-5 bg-gray-900 text-center hover:bg-gray-700 text-gray-200 font-semibold tracking-widest text-2xl" to="/post/novel/create">NOVEL</Link>
                </div>
                <div className="w-1/2 p-2">
                    <Link className="block rounded p-5 bg-gray-900 text-center hover:bg-gray-700 text-gray-200 font-semibold tracking-widest text-2xl" to="/post/article/create">ARTICLE</Link>
                </div>
                <div className="w-1/2 p-2">
                    <Link className="block rounded p-5 bg-gray-900 text-center hover:bg-gray-700 text-gray-200 font-semibold tracking-widest text-2xl" to="/post/artworks/create">ARTWORK</Link>
                </div>
                <div className="w-1/2 p-2">
                    <Link className="block rounded p-5 bg-gray-900 text-center hover:bg-gray-700 text-gray-200 font-semibold tracking-widest text-2xl" to="/post/discussion/create">DISCUSSION</Link>
                </div>
                <div className="w-1/2 p-2">
                    <Link className="block rounded p-5 bg-gray-900 text-center hover:bg-gray-700 text-gray-200 font-semibold tracking-widest text-2xl" to="/post/create">RICH TEXT</Link>
                </div>
            </div>
        )
    }
}
