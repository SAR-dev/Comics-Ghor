import React, { Component } from 'react'
import { Helmet } from 'react-helmet';

export default class SeoHelmet extends Component {
    render() {
        const {title, desc, image} = this.props
        return (
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{`CGSN | ${title === undefined ? '' : title}`}</title>
                    <meta name="title" content={`CGSN | ${title}`} />
                    <meta name="description" content={desc} />

                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={process.env.REACT_APP_WEBSITE} />
                    <meta property="og:title" content={`CGSN | ${title === undefined ? '' : title}`} />
                    <meta property="og:description" content={desc} />
                    <meta property="og:image" content={image ? image : "https://i.imgur.com/zITILWs.png"} />
                    
                    <meta property="twitter:card" content={desc} />
                    <meta property="twitter:site" content={process.env.REACT_APP_WEBSITE} />
                    <meta property="twitter:url" content={process.env.REACT_APP_WEBSITE} />
                    <meta property="twitter:title" content={`CGSN | ${title === undefined ? '' : title}`} />
                    <meta property="twitter:description" content={desc} />
                    <meta property="twitter:image" content={image ? image : "https://i.imgur.com/zITILWs.png"} />
                </Helmet>
        )
    }
}
