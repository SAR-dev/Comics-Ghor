import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';
import './RichTextEditor.css';

class CEditor extends Component {
	static propTypes = {
		onChange: PropTypes.func
	};

	state = {
		value: RichTextEditor.createEmptyValue()
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
			</>
		);
	}

}

export default CEditor;

