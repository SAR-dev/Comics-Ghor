import React, { Component } from 'react';
import { seriesById } from './apiSeries';
import './SeriesData.css';
import { isAuthenticated } from '../auth/auth';
import { Link } from "react-router-dom";

export default class SeriesData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            series: "",
            createdBy: "",
            avatar: "",
            creatorId: ""
        }
    }
    componentDidMount() {
        const seriesId = this.props.seriesDataId
        seriesById(seriesId)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    console.log(data)
                    this.setState({
                        series: data,
                        createdBy: data.createdBy.name,
                        avatar: data.createdBy.avatar,
                        creatorId: data.createdBy._id
                    })
                }
            })
    }
    render() {
        return (
            <div className="container">
                <div className="row my-4 series-info">
                    <div className="col-lg-4 col-md-6 col-12 series-image">
                        <img className="w-100" src={`https://i.imgur.com/${this.state.series.image}m.png`} />
                    </div>
                    <div className="col-lg-8 col-md-6 col-12 series-sum">
                        <h4 className="mt-2">{this.state.series.name}</h4>
                        <p className="date">Created at: {new Date(this.state.series.created).toDateString()}</p>
                        <div className="author">
                            <img className="d-inline" src={`https://i.imgur.com/${this.state.avatar}s.png`} />
                            <h6 className="d-inline">{this.state.createdBy}</h6>
                        </div>

                        <div className="pre-line bg-light my-3">
                            {this.state.series.summary}
                        </div>
                        {isAuthenticated().user && isAuthenticated().user._id === this.state.creatorId && <>
                            <div>
                                <Link style={{ fontSize: "10px" }} className="btn btn-sm btn-secondary" to={`/series/edit/${this.state.series._id}`}>Update</Link>
                            </div>
                        </>}
                    </div>
                </div>
            </div>
        )
    }
}
