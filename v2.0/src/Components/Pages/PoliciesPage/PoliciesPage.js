import React from 'react';
import LoadingCircle from '../../Shared/LoadingCircle';
import PageTitle from '../../Shared/PageTitle';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import {connect} from 'react-redux';
import BreadCrumbBar from '../../Shared/BreadCrumbBar'

class PoliciesPage extends React.Component {
    render() {
        if(!this.props.policies) return <LoadingCircle/>;
        return (
            <>
            <BreadCrumbBar links={[{ name: 'Policies' }]} />
            <div className='boxed-wrapper'>
                <div className="container p-5">
                    <PageTitle>Policies</PageTitle>
                    <Accordion defaultActiveKey="0">
                        {this.renderPolicies(this.props.policies)}
                    </Accordion>
                </div>
            </div>
            </>
        );
    }

    renderPolicies(policies) {
        return Object.keys(policies).map((key) => {
            const policy = policies[key];
            return (
                <Card key={key}>
                    <Accordion.Toggle as={Card.Header} eventKey={key}>
                    {policy.name}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={key}>
                    <Card.Body dangerouslySetInnerHTML={{__html: policy.description}}></Card.Body>
                    </Accordion.Collapse>
                </Card>
            );
        });
    }
}

const mapStoreToProps = (store) => {
    return {
        policies: store.page.policies
    }
}
export default connect(mapStoreToProps, null)(PoliciesPage);