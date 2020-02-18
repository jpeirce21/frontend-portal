import React from 'react'
import CountUp from 'react-countup'
import Tooltip from '../../Shared/Tooltip'

class Counter extends React.Component {

    constructor(props){
        super(props);
        this.state={
            speed: 3000,
            count: 0,

        }
    }

    render() {
        return (
                <div className="item count-cardy z-depth-1">
                    <br/><br/>
                    <div className="icon">
                        <i className={this.props.icon}></i>
                    </div>
                    <div className="count-outer">
                        <CountUp end={this.props.end} duration={3}/>
                    </div>
                    {this.props.info ?
                    <Tooltip title={this.props.title} text={this.props.info} dir="right">
                    <h6 className="">{this.props.title} {this.props.unit && `(in ${this.props.unit})`}
                    <span className="fa fa-info-circle" style={{ color: "#428a36" }}></span></h6>
                    </Tooltip>                    
                    :
                    <h6 className="">{this.props.title} {this.props.unit && `(in ${this.props.unit})`}</h6>
                    }
                </div>
        );
    }
}
export default Counter;



