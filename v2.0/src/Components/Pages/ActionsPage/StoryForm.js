import React from "react";
import { apiCall } from "../../../api/functions";
import { connect } from "react-redux";
import Toast from "../Notification/Toast";
import MEModal from "../Widgets/MEModal";
import MEFormGenerator from "../Widgets/FormGenerator/MEFormGenerator";
import { getPropsArrayFromJsonArray } from "../../Utils";

/********************************************************************/
/**                        SUBSCRIBE FORM                          **/
/********************************************************************/
const INITIAL_STATE = {
  title: "",
  body: "",
  aid: "--",
  vid: "--",
  vendor: "",
  preferredName: "",
  picFile: null,
  message: "Already completed an action? Tell Us Your Story",
  limit: 9000,
};

class StoryForm extends React.Component {
  constructor(props) {
    super(props);
    this.closeToast = this.closeToast.bind(this);
    var message = "Already completed an action? Tell Us Your Story";
    if (props.aid)
      message = "Already completed this action? Tell Us Your Story";
    // if (props.vid) message = "Already used this vendor? Tell Us Your Story";

    this.state = {
      ...INITIAL_STATE,
      vid: props.vid ? props.vid : "--",
      aid: props.aid ? props.aid : "--",
      captchaConfirmed: false,
      message: message,
      picFile: null,
      //selected_tags: [],
      //anonymous: false,
      preferred_name: "",
      notificationState: null,
      spinner: false,
      formNotification: null,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  categories() {
    const cat = this.props.tagCollections;
    if (cat) {
      return cat.filter((item) => item.name === "Category")[0];
    }
    return null;
  }
  ejectCategories() {
    if (this.categories()) {
      return this.categories().tags.map((cat) => <option>{cat.name}</option>);
    }
  }

  ejectSelectedTags() {
    return this.state.selected_tags.map((item, key) => {
      return (
        <small
          onClick={() => {
            this.removeTag(item.id);
          }}
          key={key.toString()}
          className="sm-tag-hover"
          style={{
            cursor: "pointer",
            border: "solid 1px #f5f4f4",
            color: "#888",
            borderRadius: 55,
            margin: 5,
            padding: "5px 40px",
          }}
        >
          {" "}
          {item.name} <i style={{ marginLeft: 5 }} className="fa fa-close " />
        </small>
      );
    });
  }
  handlePreferredName(event) {
    const val = event.target.value;
    var string = val.trim() !== "" ? val.trim() : null;
    this.setState({ preferredName: string });
  }

  closeToast() {
    this.setState({ notificationState: null });
  }
  chooseFile(e) {
    e.preventDefault();
    document.getElementById("picFile").click();
  }

  getNeededFormFields() {
    const actionTitles = getPropsArrayFromJsonArray(
      this.props.actions,
      "title"
    );
    const actionIds = getPropsArrayFromJsonArray(this.props.actions, "id");
    const vendorTitles = getPropsArrayFromJsonArray(this.props.vendors, "name");
    const vendorIds = getPropsArrayFromJsonArray(this.props.vendors, "id");
    return [
      {
        name: "action_id",
        hasLabel: true,
        label: "Which action is this testimonial about?",
        type: "dropdown",
        placeholder: "Select Action",
        data: ["--", ...actionTitles],
        dataValues: ["--", ...actionIds],
        value: "--",
      },
      {
        name: "vendor_id",
        hasLabel: true,
        label: "Who helped you complete this action?",
        type: "dropdown",
        placeholder: "Select Action",
        data: ["--", ...vendorTitles],
        dataValues: ["--", ...vendorIds],
        value: "--",
      },
      {
        type: "input",
        name: "other_vendor",
        hasLabel: true,
        label: "Specify vendor if  not on the list (optional) ",
        placeholder: "Name of vendor...",
        value:""
      },
      {
        type: "input",
        name: "preferred_name",
        hasLabel: true,
        label:
          "Your name and email will be known to the Community Organizer but how would you like it to be displayed?",
        placeholder: "Name...",
        value:""
      },
      {
        type: "input",
        name: "title",
        hasLabel: true,
        label: "Story Title *",
        placeholder: "Add a title... *",
        required:true,
        value:""
      },
      {
        type: "file",
        name: "image",
        hasLabel: true,
        label:
          "You can add an image to your testimonial. It should be your own picture, or one you are sure is not copyrighted material",
      },
      {
        type: "textarea",
        name: "body",
        hasLabel: true,
        label: "Your Story * ( limit: 9000 Char's)",
        placeholder: "Your story...*",
        value:""
      },
    ];
  }
  render() {
    // const cols = this.props.tagCollections;
    if (!this.props.actions || this.props.actions.length === 0)
      return (
        <div className="text-center">
          <p> Sorry, there are no actions to submit a story about </p>
        </div>
      );
    if (this.state.vid !== "other" && this.state.vendor !== "")
      this.setState({ vendor: "" });
    if (this.state.preferred_name === "")
      this.setState({ preferred_name: this.props.user.preferred_name });
    return (
      // <MEModal className="z-depth-3" closeModal={this.props.close}>
      <MEFormGenerator
        style={{ background: "white", borderRadius: 10 }}
        className="z-depth-1"
        fields={this.getNeededFormFields()}
        title={this.state.message}
        onSubmit={this.onSubmit}
        info={this.state.formNotification}
      />
      // </MEModal>
      // <div
      //   className="review-form mob-story-form-tweak"
      //   style={{ border: "1px solid lightgray", borderRadius: 10, padding: 25 }}
      // >
      //   {/* {this.state.notificationState ? (
      //     <Toast msg={this.state.notificationMessage} closeFxn={this.closeToast} notificationState={this.state.notificationState} />
      //   ) : null} */}

      //   {this.props.noMessage ? null : (
      //     <div className="tab-title-h4 text center">
      //       <h4 className="p-2">{this.state.message}</h4>
      //     </div>
      //   )}f
      //   <form onSubmit={this.onSubmit} style={{ margin: "20px" }}>
      //     {this.props.aid ? null : (
      //       <>
      //         <p className="make-me-dark">
      //           {" "}
      //           Which action is this testimonial about?{" "}
      //         </p>
      //         <div className="combo-box-wrapper">
      //           <select
      //             name="action_id"
      //             className="w-100 select-undefault "
      //             value={this.state.aid}
      //             onChange={(event) =>
      //               this.setState({ aid: event.target.value })
      //             }
      //           >
      //             <option value={"--"}>--</option>
      //             {this.renderOptions(this.props.actions)}
      //           </select>
      //         </div>
      //         <br />
      //       </>
      //     )}
      //     {/* <div>
      // 			<p>How would you like  your name to be displayed? </p>
      // 			<input  type="checkbox" id = "real_name"value="false" style={{display:'inline-block'}} onClick ={()=>{this.check(false)}}/>	<small onClick ={()=>{this.check(false)}} style={{ fontSize:15, fontWeight:'600' , cursor:'pointer'}}>'John Doe'</small> <br/>
      // 			<input  type="checkbox" id="ano" value = "true" style={{display:'inline-block'}} onClick ={()=>{this.check(true)}}/>	<small onClick ={()=>{this.check(true)}} style={{ fontSize:15, fontWeight:'600' , cursor:'pointer'}}>Anonymous</small>
      // 		</div> */}
      //     {this.props.vid ? null : (
      //       <>
      //         <p className="make-me-dark">
      //           {" "}
      //           Who helped you complete this action?{" "}
      //         </p>
      //         <div className="combo-box-wrapper">
      //           <select
      //             name="vendor_id"
      //             className="w-100 select-undefault"
      //             value={this.state.vid}
      //             onChange={(event) =>
      //               this.setState({ vid: event.target.value })
      //             }
      //           >
      //             <option value={"--"}>--</option>
      //             {this.renderOptions(this.props.vendors)}
      //             <option value={"other"}>Other</option>
      //           </select>
      //         </div>{" "}
      //         &nbsp; &nbsp; &nbsp;
      //         {this.state.vid === "other" ? (
      //           <div style={{ display: "inline-block", marginTop: 5 }}>
      //             <input
      //               name="other_vendor"
      //               placeholder="Who helped you? "
      //               className="form-control"
      //               type="text"
      //               //value={this.state.vendor}
      //               onChange={this.onChange}
      //               autoFocus={true}
      //               required
      //             />
      //           </div>
      //         ) : (
      //           <br />
      //         )}
      //       </>
      //     )}

      //     <div className="make-me-dark">
      //       <p>
      //         Your name and email will be known to the{" "}
      //         <b>Community Organizer</b>, but how would you like it to be
      //         displayed?
      //       </p>

      //       <input
      //         onChange={(event) => this.handlePreferredName(event)}
      //         type="text"
      //         maxLength="15"
      //         className="form-control"
      //         placeholder="Write the name you prefer ( max - 15 Char )"
      //         defaultValue={this.props.user.preferred_name}
      //         required
      //         name="preferred_name"
      //       />
      //     </div>

      //     <div className="field-label make-me-dark">
      //       <p>Story Title*</p>
      //       <input
      //         type="text"
      //         style={{ borderRadius: 5 }}
      //         name="title"
      //         value={this.state.title}
      //         onChange={this.onChange}
      //         required
      //       />
      //     </div>
      //     <div className="row">
      //       <div
      //         className="col-md-12 "
      //         style={{
      //           padding: 10,
      //           border: "solid 1px #f5f3f3",
      //           borderRadius: 10,
      //         }}
      //       >
      //         <p style={{ margin: 15 }}>
      //           You can add an image to your testimonial.  It should be your own picture, or one you are sure is not copyrighted material.
      //         </p>
      //         <button
      //           onClick={(e) => {
      //             this.chooseFile(e);
      //           }}
      //           className="thm-btn bg-cl-1 round-me testimonials-choose-img-btn-tweaks"
      //         >
      //           Choose An Image
      //         </button>
      //         <p
      //           className={this.state.picFile ? "testimonials-image-desc" : ""}
      //           style={{ fontSize: "medium" }}
      //         >
      //           <i style={{ marginRight: 5 }} className="fa fa-image" />
      //           {this.state.picFile
      //             ? `"${this.state.picFile.name}" selected`
      //             : "No image has been selected"}
      //         </p>
      //         <input
      //           type="file"
      //           name="image"
      //           onChange={this.handleImageChange}
      //           className="form-control"
      //           style={{ paddingTop: 4 , display: "none" }}
      //         />
      //       </div>
      //     </div>
      //     <div className="row">
      //       <div className="col-md-12">
      //         <div className="field-label make-me-dark">
      //           <p style={{ display: "inline-block", float: "left" }}>
      //             Your Story*
      //           </p>
      //           <p
      //             className={
      //               this.state.body.length > this.state.limit
      //                 ? "text-danger"
      //                 : null
      //             }
      //             style={{ display: "inline-block", float: "right" }}
      //           >
      //             {this.state.body.length + " / " + this.state.limit + "chars"}
      //           </p>
      //           <textarea
      //             name="body"
      //             value={this.state.body}
      //             onChange={this.onChange}
      //             style={{
      //               width: "100%",
      //               borderColor: "lightgray",
      //               color: "#9e9e9e",
      //               borderRadius: 6,
      //             }}
      //             required
      //           ></textarea>
      //         </div>
      //       </div>
      //     </div>
      //     <br></br>
      //     <div className="row">
      //       <div className="col-md-12">
      //         <button className="thm-btn bg-cl-1 btn-finishing" type="submit">
      //           Submit Now{" "}
      //           <i
      //             style={{
      //               display: this.state.spinner ? "inline-block" : "none",
      //             }}
      //             className="fa fa-spinner fa-spin"
      //           ></i>
      //         </button>
      //         {this.state.notificationState ? (
      //           <Toast
      //             msg={this.state.notificationMessage}
      //             closeFxn={this.closeToast}
      //             notificationState={this.state.notificationState}
      //           />
      //         ) : null}
      //       </div>
      //     </div>
      //     {this.state.message ? (
      //       <i></i>
      //     ) : // <p className="text-success">{this.state.message}</p>
      //     null}
      //     {this.state.error ? (
      //       <p className="text-danger">{this.state.error}</p>
      //     ) : null}
      //   </form>
      // </div>
    );
  }
  count = (words) => {
    // return words.split(' ').length //word count
    return words.length; //char count
  };
  //updates the state when form elements are changed
  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      error: null,
    });
  }

  handleImageChange(e) {
    e.preventDefault();

    let file = e.target.files[0];
    this.setState({
      [e.target.name]: file,
      error: null,
    });
  }

  toggleSpinner(val) {
    this.setState({ spinner: val });
  }

  cleanUp() {
    //if(this.refs.category_select){
    //  this.refs.category_select.value = "--";
    //}
    //this.refs.picFile.value = "";
    if (this.refs.category_select) {
      this.refs.category_select.value = "--";
    }
  }
  renderOptions(choices) {
    return Object.keys(choices).map((key) => {
      var choice = choices[key];
      return (
        <option value={choice.id} key={key}>
          {" "}
          {choice.title ? choice.title : choice.name}{" "}
        </option>
      );
    });
  }
  onSubmit(event, data, resetForm) {
    event.preventDefault();
    this.setState({
      formNotification: {
        icon: "fa fa-spinner fa-spin",
        type: "good",
        text: "We are sending now...",
      },
    });
    const body = { ...data, rank: 0 };
    if (this.count(this.state.body) > this.state.limit) {
      this.setState({
        formNotification: {
          icon: "fa fa-times",
          type: "bad",
          text: "Sorry, you story is a bit too long..",
        },
      });
     
    } else {
      apiCall(`testimonials.add`, body).then((json) => {
        if (json && json.success) {
          this.setState({
            formNotification: {
              icon: "fa fa-check",
              type: "good",
              text:
                "Nicely done! Your story will be reviewed and publish as soon as possible. Stay tuned!",
            },
          });
          resetForm();
        } else {
          this.setState({
            formNotification: {
              icon: "fa fa-times",
              type: "bad",
              text: "Something happened, we could not send your story!",
            },
          });
        }
      });
    }
  }
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    actions: store.page.actions,
    vendors: store.page.serviceProviders,
    community: store.page.community,
    //tagCollections: store.page.tagCols
  };
};
//composes the login form by using higher order components to make it have routing and firebase capabilities
export default connect(mapStoreToProps)(StoryForm);
