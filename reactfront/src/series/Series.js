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
                <h2 className="my-5">Series Collection</h2>
                <div className="row">
                    {series.map((single, i) => (
                        <div className="col-lg-10 col-12 mx-auto series-card bg-light" key={i}>
                            <div className="row pt-2 pb-3">
                                <div className="col-lg-3 col-md-6 col-12 cover p-2">
                                    <img src={`https://i.imgur.com/${single.image}m.png`} />
                                </div>
                                <div className="col-lg-9 col-md-6 col-12 summary p-0">
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
                                    <div className="writer">
                                        <div className="avatar mt-1 d-inline">
                                            <img src={`https://i.imgur.com/${single.createdBy.avatar}s.png`} />
                                        </div>
                                        <div className="name d-inline">
                                            {single.createdBy.name}
                                        </div>
                                        <div className="d-flex social-icons justify-content-start">
                                            {single.createdBy.Sinstagram && (<a className="text-primary mr-2" href={`${single.createdBy.Sinstagram}`} target="_blank"><i className="fab fa-instagram"></i></a>)}
                                            {single.createdBy.Sfacebook && (<a className="text-primary mr-2" href={`${single.createdBy.Sfacebook}`} target="_blank"><i className="fab fa-facebook"></i></a>)}
                                            {single.createdBy.Stwitter && (<a className="text-primary mr-2" href={`${single.createdBy.Stwitter}`} target="_blank"><i className="fab fa-twitter"></i></a>)}
                                            {single.createdBy.Syoutube && (<a className="text-primary mr-2" href={`${single.createdBy.Syoutube}`} target="_blank"><i className="fab fa-youtube"></i></a>)}
                                            <div className="Explore">
                                                <Link to={`/series/${single._id}`} className="btn btn-primary btn-sm">
                                                    <i class="fas fa-external-link-square-alt"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Series;