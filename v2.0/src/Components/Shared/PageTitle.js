import React from 'react'

/**
 * Renders a page title with h1
 */
export default class PageTitle extends React.Component {
    render() {
        return (
            <div className="row text-center justify-content-center mb-5 border-bottom">
                <h1 className="cool-font">{this.props.children}</h1>
            </div>
        );
    }
}