import { Editor, EditorState, RichUtils, convertToRaw, ContentState } from 'draft-js';
import React, { Component } from 'react';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

class DraftEditor extends Component {
	constructor(props) {
		super(props);
		this.state = { editorState: EditorState.createEmpty(), init: true };

        this.focus = () => this.refs.editor.focus();
        
		this.handleKeyCommand = (command) => this._handleKeyCommand(command);
		this.onTab = (e) => this._onTab(e);
		this.toggleBlockType = (type) => this._toggleBlockType(type);
		this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    }
    
    onChange = (editorState) => {
        this.setState({ editorState })
        this.props.data(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    };

	_handleKeyCommand(command) {
		const { editorState } = this.state;
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			this.onChange(newState);
			return true;
		}
		return false;
	}

	_onTab(e) {
		const maxDepth = 4;
		this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
	}

	_toggleBlockType(blockType) {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
	}

	_toggleInlineStyle(inlineStyle) {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
    }
    
    loadBody = (e) => {
		e.preventDefault();
		const html = this.props.value;
		const contentBlock = htmlToDraft(html);
		const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
		const editorState = EditorState.createWithContent(contentState);
		this.setState({editorState, init: false})
	}

	render() {
		const { editorState } = this.state;

		// If the user changes block type before entering any text, we can
		// either style the placeholder or hide it. Let's just hide it now.
		let className = 'RichEditor-editor';
		var contentState = editorState.getCurrentContent();
		if (!contentState.hasText()) {
			if (contentState.getBlockMap().first().getType() !== 'unstyled') {
				className += ' RichEditor-hidePlaceholder';
			}
		}

		return (
			<div className="RichEditor-root">
				<BlockStyleControls editorState={editorState} onToggle={this.toggleBlockType} />
				<InlineStyleControls editorState={editorState} onToggle={this.toggleInlineStyle} />
				<div className={className} onClick={this.focus}>
					<Editor
						blockStyleFn={getBlockStyle}
						customStyleMap={styleMap}
						editorState={editorState}
						handleKeyCommand={this.handleKeyCommand}
						onChange={this.onChange}
						onTab={this.onTab}
						placeholder="Tell a story..."
						ref="editor"
						spellCheck={true}
					/>
				</div>
                {this.state.init && <button className="bg-gray-400 w-full text-gray-700 hover:bg-gray-500 py-2 rounded-b" onClick={this.loadBody}>Click Here to Load Previous Contents</button>}
			</div>
		);
	}
}

// Custom overrides for "code" style.
const styleMap = {
	CODE: {
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
		fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
		fontSize: 16,
		padding: 2
	}
};

function getBlockStyle(block) {
	switch (block.getType()) {
		case 'blockquote':
			return 'RichEditor-blockquote';
		default:
			return null;
	}
}

class StyleButton extends React.Component {
	constructor() {
		super();
		this.onToggle = (e) => {
			e.preventDefault();
			this.props.onToggle(this.props.style);
		};
	}

	render() {
		let className = 'RichEditor-styleButton';
		if (this.props.active) {
			className += ' RichEditor-activeButton';
		}

		return (
			<span className={className} onMouseDown={this.onToggle}>
				{this.props.label}
			</span>
		);
	}
}

const BLOCK_TYPES = [
	// { label: 'H1', style: 'header-one' },
	// { label: 'H2', style: 'header-two' },
	// { label: 'H3', style: 'header-three' },
	{ label: 'H4', style: 'header-four' },
	{ label: 'H5', style: 'header-five' },
	{ label: 'H6', style: 'header-six' },
	{ label: 'Quote', style: 'blockquote' },
	{ label: 'UL', style: 'unordered-list-item' },
	{ label: 'OL', style: 'ordered-list-item' },
	// { label: 'Code Block', style: 'code-block' }
];

const BlockStyleControls = (props) => {
	const { editorState } = props;
	const selection = editorState.getSelection();
	const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();

	return (
		<div className="RichEditor-controls">
			{BLOCK_TYPES.map((type) => (
				<StyleButton
					key={type.label}
					active={type.style === blockType}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			))}
		</div>
	);
};

var INLINE_STYLES = [
	{ label: 'B', style: 'BOLD' },
	{ label: 'I', style: 'ITALIC' },
	{ label: 'U', style: 'UNDERLINE' },
	// { label: 'Monospace', style: 'CODE' }
];

const InlineStyleControls = (props) => {
	var currentStyle = props.editorState.getCurrentInlineStyle();
	return (
		<div className="RichEditor-controls">
			{INLINE_STYLES.map((type) => (
				<StyleButton
					key={type.label}
					active={currentStyle.has(type.style)}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			))}
		</div>
	);
};

export default DraftEditor;