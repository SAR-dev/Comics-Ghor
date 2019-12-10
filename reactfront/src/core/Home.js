import React from 'react';
import Posts from '../post/Posts';

const Home = () => (
    <>
        <div className="container">
            <div className="row">
                <div className="col-md-8 col-sm-12 p-lg-4 p-md-2">
                    <Posts />
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
    </>
)

export default Home;