import React from "react";
import WelcomeImages from "../../Shared/WelcomeImages";
import Graphs from "./Graphs";
import ErrorPage from "./../Errors/ErrorPage";
import IconBoxTable from "./IconBoxTable";
import Events from "./EventHomepageSection";
import Tooltip from "../Widgets/CustomTooltip";
import { connect } from "react-redux";
import { IS_SANDBOX } from "../../../config";

/*
 * The Home Page of the MassEnergize
 */
class HomePage extends React.Component {
  render() {
    if (!this.props.pageData) {
      return (
        <ErrorPage
          errorMessage="Unable to load this Community"
          invalidCommunity
        />
      );
    }
    if (!IS_SANDBOX && !this.props.pageData.is_published) {
      return (
        <ErrorPage
          errorMessage="Sorry, your community isn't live at the moment."
          invalidCommunity
        />
      );
    }
    const title = this.props.pageData ? this.props.pageData.title : "";
    const comGoals = this.props.pageData ? this.props.pageData.goal : null;

    // switching Tagline from description to sub_title (if filled), to use description for description
    const communityTagline =
      this.props.pageData.sub_title || this.props.pageData.description;
    // description now will show on hover if filled
    const communityDescription =
      this.props.pageData.description.length > 1 &&
      communityTagline !== this.props.pageData.description
        ? this.props.pageData.description
        : null;
    const events = this.props.pageData
      ? this.props.pageData.featured_events
      : [];
    const welcomeImagesData = this.props.pageData
      ? this.props.pageData.images
      : [];
    const iconQuickLinks = this.props.pageData
      ? this.props.pageData.featured_links
      : [];
    //const header = section(pageData, "HomeHeader");

    const graphs = [
      {
        title: "Actions Completed",
        data: comGoals
          ? {
              target: comGoals.target_number_of_actions,
              attained:
                comGoals.attained_number_of_actions +
                comGoals.organic_attained_number_of_actions,
            }
          : null,
      },
      {
        title: "Households Engaged",
        data: comGoals
          ? {
              target: comGoals.target_number_of_households,
              attained:
                comGoals.attained_number_of_households +
                comGoals.organic_attained_number_of_households,
            }
          : null,
      },
    ];
    if (comGoals && comGoals.target_carbon_footprint_reduction > 0) {
      graphs.push({
        title: "Carbon Reduction",
        data: comGoals
          ? {
              target: comGoals.target_carbon_footprint_reduction,
              attained:
                comGoals.attained_carbon_footprint_reduction +
                comGoals.organic_attained_carbon_footprint_reduction,
            }
          : null,
      });
    }

    return (
      <div className="boxed_wrapper">
        {welcomeImagesData ? (
          <WelcomeImages data={welcomeImagesData} title={title} />
        ) : null}
        <div
          className=""
          style={{ padding: 30, background: "white", color: "#383838" }}
        >
          <div className="text-center">
            {communityDescription ? (
              <Tooltip
                text={communityDescription}
                paperStyle={{ maxWidth: "100vh" }}
              >
                <h4 align="center" className="cool-font mob-font-lg">
                  {communityTagline}
                  <span
                    className="fa fa-info-circle"
                    style={{ color: "#428a36", padding: "5px" }}
                  ></span>
                </h4>
              </Tooltip>
            ) : (
              <h4 align="center" className="cool-font mob-font-lg">
                {communityTagline}
              </h4>
            )}
          </div>
        </div>

        {this.props.pageData.show_featured_links ? (
          <IconBoxTable
            title="Get started - See your local options!"
            boxes={iconQuickLinks}
          />
        ) : null}
        {this.props.pageData.show_featured_stats ? (
          <Graphs
            graphs={graphs}
            size={120}
            goals={comGoals}
            subtitle={this.props.pageData.featured_stats_subtitle}
            info={this.props.pageData.featured_stats_description}
          />
        ) : null}

        {this.props.pageData.show_featured_events ? (
          <Events
            events={events}
            subtitle={this.props.pageData.featured_events_subtitle}
            info={this.props.pageData.featured_events_description}
          />
        ) : null}
      </div>
    );
  }
}

const mapStoreToProps = (store) => {
  return {
    pageData: store.page.homePage,
    events: store.page.events,
    graphsData: store.page.communityData,
    links: store.links,
  };
};
export default connect(mapStoreToProps, null)(HomePage);
