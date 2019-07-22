import React from 'react'
import { Link } from 'react-router-dom'
import URLS, { getJson } from '../api_v2'
import LoadingCircle from './LoadingCircle'
/**
 * Cart component
 * renders a list of actions
 * @props title
 *      action list: title, image, id
 * 
 * 
 Promise.all([
                getJson(URLS.USER + "/" + this.state.user.id + "/actions?status=TODO"),
                getJson(URLS.USER + "/" + this.state.user.id + "/actions?status=DONE"),
            ]).then(myJsons => {
                
                this.setState({
                    ...this.state,
                    todo: myJsons[0].data,
                    done: myJsons[1].data
                });
            });
 */
class Cart extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        }
    }
    componentDidMount() {
        this._isMounted = true;
        if (this.props.uid) {
            getJson(URLS.USER + "/" + this.props.uid + "/actions" + (this.props.status ? "?status=" + this.props.status : "")).then(myJson => {
                if (this._isMounted) {
                    this.setState({
                        actionRels: myJson.data,
                        loaded: true
                    })
                }
            }).catch(err => {
                console.log(err)
            });
        }
    }
    componentWillMount() {
        this._isMounted = false;
    }
    render() {
        if (!this.state.loaded) return <LoadingCircle />;
        console.log(this.state.actionRels);
        return (
            // <!--Cart Outer-->
            <div className="cart-outer">
                <h3 className="center">{this.props.title}</h3>
                <div className="table-outer">
                    {this.state.actionRels ?
                        <table className="cart-table">

                            <thead className="cart-header">
                                <tr>
                                    <th className="prod-column">Image</th>
                                    <th className="prod-column">Action</th>
                                    <th className="prod-column"></th>
                                    <th className="prod-column">Remove</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.renderActions(this.state.actionRels)}
                            </tbody>
                        </table> : null
                    }
                </div>
            </div>
        );
    }
    renderActions(actionRelations) {
        if (!actionRelations) {
            return <li>Empty</li>;
        }
        //returns a list of action components
        return Object.keys(actionRelations).map(key => {
            var actionRel = actionRelations[key];
            var action = actionRel.action;
            return (
                <tr key={key}>
                    <td colSpan="1" className="prod-column">
                        <div className="column-box">
                            <figure className="prod-thumb"><Link to={"/actions/" + action.id}><img src={action.image.file} alt={action.image.name} /></Link></figure>
                        </div>
                    </td>
                    <td colSpan="2" className="prod-column">
                        <div className="column-box">
                            <h4 className="prod-title padd-top-20">{action.title}</h4>
                        </div>
                    </td>
                    <td colSpan="1" className="prod-column">
                        {actionRel.status.toLowerCase() === "todo" ?
                            <div>
                                <button onClick={() => this.moveToDone(actionRel)} className="done-btn"> <i className="fa fa-check"></i> </button>
                                <button className="remove-btn"> <i className="fa fa-trash"></i> </button>
                            </div>
                            :
                            null
                        }
                    </td>
                </tr>
            );
        });
    }

    moveToDone(actionRel) {
        console.log(URLS.USER + "/" + this.props.uid + "/action/" + actionRel.id);
        fetch(URLS.USER + "/" + this.props.uid + "/action/" + actionRel.id, {
            method: 'post',
            body : JSON.stringify({
                status: "DONE",
                action: actionRel.action.id,
                real_estate_unit:actionRel.real_estate_unit.id,
            })
        }).then(response => {
            return response.json()
        }).then(json=>{
            console.log(json);
        }).catch(err =>{
            console.log(err)
        })
    }
} export default Cart;