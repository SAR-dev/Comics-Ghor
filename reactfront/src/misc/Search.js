import React, { Component } from 'react';
import PrimaryLayout from '../core/PrimaryLayout';
import { listSearch, userSearch, bloodSearch } from './apiMisc';
import SeoHelmet from '../core/SeoHelmet';
import SearchPostCard from './SearchPostCard';
import SearchUserCard from './SearchUserCard';
import './checkbox.css';
import LoadingModal from '../core/LoadingModal';

class Search extends Component {
    constructor() {
        super()
        this.state = {
            search: undefined,
            results: [],
            searched: false,
            message: '',
            option: 1,
            loading: false
        }
    }

    handleChange = (e) => {
        this.setState({ search: e.target.value })
    }

    clickSubmit = (e) => {
        e.preventDefault();
        if (this.state.search) {
            this.setState({loading: true})
        let search = this.state.search
        if (this.state.option === 1) {
            listSearch({ search }).then(data => {
                this.setState({ results: data, loading: false, searched: true, message: `${data.length} posts found` })
            })
        } else if (this.state.option === 2) {
            userSearch({ search }).then(data => {
                this.setState({ results: data, loading: false, searched: true, message: `${data.length} people found` })
            })
        } else {
            bloodSearch({ search }).then(data => {
                this.setState({ results: data, loading: false, searched: true, message: `${data.length} potential donors found` })
            })
        }
        }
    }

    render() {
        const { searched, results, message, option, loading } = this.state
        return (
            <>
                <SeoHelmet title="Search Posts" />
                <PrimaryLayout>
                    <div className="max-w-screen-md mx-auto px-4">
                        <form className="w-full max-w-screen-md mt-10 mb-5" onSubmit={this.clickSubmit}>
                            <div className="mb-4 relative">
                                <label className="block text-white text-2xl tracking-wider font-semibold mb-2" htmlFor="username">
                                    Search
                                </label>
                                <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="search" type="text" placeholder="Type and press Enter...." autoComplete="new-password" onChange={this.handleChange} />
                                <button type="submit" className="absolute text-gray-700 border-l-2 bg-white border-gray-800 rounded-r pr-2 pl-3 right-0" style={{ paddingTop: '.45rem', paddingBottom: '.45rem' }}>
                                    <i className="fas fa-search pr-2"></i>
                                </button>
                                <div className="flex flex-wrap my-5 text-white text-base font-semibold">
                                    <div className="flex mr-5 pretty p-default p-round p-smooth">
                                        <input checked={option === 1} onClick={() => this.setState({ option: 1, results: [], message: '' })} type="checkbox" />
                                        <div className="state p-primary">
                                            <label>Posts</label>
                                        </div>
                                    </div>
                                    <div className="flex mr-5 pretty p-default p-round p-smooth">
                                        <input checked={option === 2} onClick={() => this.setState({ option: 2, results: [], message: '' })} type="checkbox" />
                                        <div className="state p-primary">
                                            <label>People</label>
                                        </div>
                                    </div>
                                    <div className="flex mr-5 pretty p-default p-round p-smooth">
                                        <input checked={option === 3} onClick={() => this.setState({ option: 3, results: [], message: '' })} type="checkbox" />
                                        <div className="state p-primary">
                                            <label>Blood</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        {searched && (
                            <>
                                {message && (
                                    <div>
                                        <h1 className="text-2xl tracking-wider font-semibold text-white pb-3 mb-5 border-b border-white">{message}</h1>
                                    </div>
                                )}
                                {results.length > 0 && option === 1 && (
                                    <>
                                        {results.map((post, i) => (
                                            <SearchPostCard post={post} key={i} />
                                        ))}
                                    </>
                                )}
                                {results.length > 0 && option === 2 && (
                                    <>
                                        {results.map((user, i) => (
                                            <SearchUserCard user={user} key={i} />
                                        ))}
                                    </>
                                )}
                                {results.length > 0 && option === 3 && (
                                    <>
                                        {results.map((user, i) => (
                                            <SearchUserCard user={user} key={i} />
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </PrimaryLayout>
                <LoadingModal trigger={loading} text="SEARCHING..." />
            </>
        )
    }
}

export default Search;