import React, { Component } from "react";
import { list } from "./apiSeries";
import { Link } from "react-router-dom";
import ShowMoreText from 'react-show-more-text';
import './Series.css';

class Series extends Component {
    constructor() {
        super();
        this.state = {
            series: []
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        list().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ series: data.series });
            }
        });
    }

    render() {
        const { series } = this.state;
        return (
            <div className="container">
                <div className="row my-5">
                    <div className="col-lg-8 col-12">
                        {series.map((single, i) => (
                            <div className="col-lg-12 col-md-10 col-12 mx-auto series-card bg-light" key={i}>
                                <div className="row pt-2 pb-3">
                                    <div className="col-lg-4 col-md-6 col-12 cover px-2">
                                        <img src={`https://i.imgur.com/${single.image}m.png`} />
                                    </div>
                                    <div className="col-lg-8 col-md-6 col-12 summary p-0">
                                        <Link to={`/series/${single._id}`} className="text-decoration-none">
                                            <h5>{single.name}</h5>
                                        </Link>
                                        <div className="pre-line pb-1">
                                            <ShowMoreText
                                                lines={4}
                                                more='Show more'
                                                less='Show less'
                                                anchorclassName=''
                                                onClick={this.executeOnClick}
                                                expanded={false}
                                            >
                                                {single.summary}
                                            </ShowMoreText>
                                        </div>
                                        <div className="writer mt-2">
                                            <div className="avatar mt-1 d-inline">
                                                <img src={`https://i.imgur.com/${single.createdBy.avatar}s.png`} />
                                            </div>
                                            <div className="name d-inline">
                                                <Link to={`/user/${single.createdBy._id}`} className="text-decoration-none">{single.createdBy.name}</Link>
                                            </div>
                                            <div className="Explore d-inline">
                                                <Link to={`/series/${single._id}`} className="btn text-white btn-sm">
                                                    <i className="fas fa-hand-point-up mr-2"></i>Explore
                                            </Link>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-lg-4 d-sm-none d-lg-block promotions-list">
                    <div className="row">
                        <div className="col-12 pronotions">
                            <div className="rounded m-4" style={{ background: "#d7e3da", height: "250px" }}>
                                <div className="text-center" style={{ fontSize: "25px", fontWeight: "300", color: "white", paddingTop: "100px" }}>UPCOMING EVENTS</div>
                            </div>
                        </div>
                        <div className="col-12 pronotions">
                            <div className="rounded m-4" style={{ background: "#d7e3da", height: "250px" }}>
                                <div className="text-center" style={{ fontSize: "25px", fontWeight: "300", color: "white", paddingTop: "100px" }}>UPCOMING EVENTS</div>
                            </div>
                        </div>
                        <div className="col-12 pronotions">
                            <div className="rounded m-4" style={{ background: "#d7e3da", height: "250px" }}>
                                <div className="text-center" style={{ fontSize: "25px", fontWeight: "300", color: "white", paddingTop: "100px" }}>UPCOMING EVENTS</div>
                            </div>
                        </div>
                        <div className="col-12 pronotions">
                            <div className="rounded m-4" style={{ background: "#d7e3da", height: "250px" }}>
                                <div className="text-center" style={{ fontSize: "25px", fontWeight: "300", color: "white", paddingTop: "100px" }}>UPCOMING EVENTS</div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

export default Series;