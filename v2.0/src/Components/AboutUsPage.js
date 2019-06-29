import React from 'react'
import CONST from './Constants.js';
import LoadingPage from './LoadingPage.js';
import NavBar from './NavBar.js';
import WelcomeImages from './WelcomeImages.js'
import Video from './Video.js'
import TeamMembers from './TeamMembers.js'
import DonateBar from './DonateBar.js'
import Footer from './Footer';

class AboutUs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null,
            menuData: null,
            userData: null,
        }
    }
    componentDidMount() {
        fetch(CONST.URL.USER).then(data => {
            return data.json()
        }).then(myJson => {
            this.setState({
                pageData: myJson.pageData,
                menuData: myJson.menuData,
                userData: myJson.userData,
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
    }

    render() {
        if(!this.state.menuData) return <LoadingPage/>;
        const {
            navLinks,
            footerData
        } = this.state.menuData;

        return (
            <div className="boxed_wrapper">
                <NavBarBurger
                    navLinks={navLinks}
                    userData={this.state.userData}
                />
                <WelcomeImages
                    data="" title="About Us"
                />
                <div className="row m-0 mt-3">
                    <div className="col-sm-12 col-md-6">
                        <Video link="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"/>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <p>This is a paragraph woohoo</p>
                    </div>
                </div>
                <TeamMembers data="" />
                <DonateBar />
                <Footer
                    data={footerData}
                />
            </div>
        );
    }
}
export default AboutUs;