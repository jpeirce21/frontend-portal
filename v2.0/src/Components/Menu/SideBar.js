import React from 'react';
import '../../assets/css/style.css';
import Accordian from './Accordian';

/** Renders the sidebar on the actions page, optons to filter by category, tags, difficulty and impact
 *  @props
    taggroups list
    @TODO need to update how this takes in input, should take in a json with a list of tag titles with sub tags in them
    need to make the tags accordian dropdown
*/
class SideBar extends React.Component {
	render() {
		//avoids trying to render before the promise from the server is fulfilled
		return (
			<div className=" event-filter wrapper shop-sidebar mb-5 raise" style={{padding:36,borderRadius:15}}>
				{/* <div className="sidebar_search">
					<form action="#">
						<input type="text" placeholder="Search...." id='action-searchbar' onChange={this.props.onChange} />
						<button className="tran3s color1_bg" onClick={this.props.onChange}><i className="fa fa-search" aria-hidden="true"></i></button>
					</form>
				</div> */}
				<br />
				<h4>Filter by...</h4>
				{this.renderTagCollections(this.props.tagCols)}
			</div>
		);
	}

	renderTagCollection(tagCol) {
		if (!tagCol) {
			return <p>No Filter Available</p>;
		}
		return Object.keys(tagCol).map(key => {
			var tag = tagCol[key];
			return (
				<label className="checkbox-container" onClick={this.props.onChange} key={key}>
					<p style={{
						marginLeft: "25px",
						marginBottom: "0",
						padding: "4px 0 5px 0"
					}}>{tag.name}</p>
					<input className="checkbox" type="checkbox" name="boxes" id={"filtertag" + tag.id} value={tag.name} />
					<span className="checkmark"></span>
				</label>
			);
		});
	}

	makeTagsSystematic = (tagCols) =>{
		//arrange side filters in this order: Categories, Impact, difficulty
		if(!tagCols) return tagCols;
		var arr = []; 
		arr[0] =  tagCols.filter(item =>item.name ==="Category")[0];
		arr[1] =  tagCols.filter(item =>item.name ==="Impact")[0];
		arr[2] =  tagCols.filter(item =>item.name ==="Difficulty")[0];
		var the_rest = tagCols.filter( item =>{
			return item.name !=="Category" && item.name !=="Impact" && item.name !=="Difficulty";
		});
		var available= arr.filter( item => item !==undefined);
		return[ ...available, ...the_rest];
	}
	renderTagCollections(tagCols) {
		tagCols = this.makeTagsSystematic(tagCols);
		if (!tagCols) {
			return <p>No Filters Available</p>;
		}
		return Object.keys(tagCols).map(key => {
			var tagCol = tagCols[key];
			const header = (
				<div className="section-title w-100">
					<span>{tagCol.name}</span>
				</div>
			);
			const content = (
				<form className="list">
					{this.renderTagCollection(tagCol.tags)}
				</form>
			); 
			return (
				<div className="category-style-one" key={key}>
					<Accordian
						open={tagCol.name === "Category"}
						header={header}
						content={content}
						onChange={this.props.onChange}
					/>
				</div >
			)
		});
	}
}
export default SideBar;