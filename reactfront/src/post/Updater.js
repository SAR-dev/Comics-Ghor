import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';
import './RichTextEditor.css';

class CUpdated extends Component {
	constructor(props) {
		super(props);
	  }
	static propTypes = {
		onChange: PropTypes.func
	};

	state = {
		value: RichTextEditor.createEmptyValue()
	}

	loadBody = (e) => {
		e.preventDefault();
		const value = RichTextEditor.createValueFromString(this.props.value, 'html')
		this.setState({value})
	}

	onChange = (value) => {
		this.setState({ value });
		this.props.data(value.toString('html'))
		if (this.props.onChange) {
			this.props.onChange(
				value.toString('html')
			);
		}
	};

	render() {

		return (
			<>
				<RichTextEditor
					value={this.state.value}
					onChange={this.onChange}
					className="CEditor"
				/>
				<button className="btn btn-small btn-secondary btn-block mt-1" style={{fontSize: "12px"}} onClick={this.loadBody}>DO YOU WANT TO LOAD PREVIOUS BODY?</button>
			</>
		);
	}

}

export default CUpdated;

