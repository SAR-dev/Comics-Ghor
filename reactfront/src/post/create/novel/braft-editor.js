import 'braft-editor/dist/index.css'
import React from 'react'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import { imageupload } from '../../../post/apiPost';
import Modal from 'react-modal';
import LoadingModal from '../../../core/LoadingModal';
import { Prompt } from 'react-router-dom';
import Emoticon, { defaultEmoticons } from 'braft-extensions/dist/emoticon';
import ColorPicker from 'braft-extensions/dist/color-picker';

const emoticons = defaultEmoticons.map(item => require(`braft-extensions/dist/assets/${item}`))

BraftEditor.use(Emoticon({
  includeEditors: ['CGSNEditor'],
  emoticons: emoticons
}))

BraftEditor.use(ColorPicker({
  includeEditors: ['CGSNEditor'],
  theme: 'light'
}))


export default class CGSNEditor extends React.Component {

  constructor(){
    super()
    this.handleImage = this.handleImage.bind(this);
  }

  uploader = () => {
    this.setState({uploader: true})
  }

  handleImage(event) {
		this.setState({ uploader: false, uploading: true });
		var fileInput = false;
		if (!event.target.files[0] || event.target.files[0].size > 19922944) {
			this.setState({ error: true, uploading: false });
		}
		if (event.target.files[0]) {
			fileInput = true;
		}
		if (fileInput) {
			var img = event.target.files[0];
			imageupload(img)
				.then((res) => {
					if (res.data.error){
						this.setState({uploading: false ,error: res.data.error.message})
					} else {
            this.insertMediItem(res.data.id)
						this.setState({ error: false, uploading: false });
					}
				})
		}
	}

  state = {
    editorState: BraftEditor.createEditorState(),
    outputHTML: '',
    uploading: false,
    error: false,
    uploader: false,
    leave: false,
  }

  componentDidMount () {
    this.braftFinder = this.editorInstance.getFinderInstance()
    this.isLivinig = true
    setTimeout(this.setEditorContentAsync, 3000)
  }

  componentWillUnmount () {
    this.isLivinig = false
  }

  handleChange = (editorState) => {
    this.setState({
      editorState: editorState,
      outputHTML: editorState.toHTML()
    })
    this.props.data(editorState.toHTML())
  }

  setEditorContentAsync = () => {
    this.isLivinig && this.setState({
      editorState: BraftEditor.createEditorState('')
    })
  }

  insertMediItem = (id) => {

    const editorState = ContentUtils.insertMedias(this.state.editorState, [
      {
        type: 'IMAGE',
        url: `https://i.imgur.com/${id}l.jpg`
      }
    ])

    this.setState({ editorState })

  }

  render () {

    const { editorState } = this.state
    const extendControls = [
      'separator',
      {
        key: 'insert-media',
        type: 'button',
        text: <i class="fas fa-camera-retro"></i>,
        onClick: this.uploader
      },
    ]

    const excludeControls = [
      'media',
      'font-size',
      'line-height',
      'letter-spacing',
      'fullscreen',
      'superscript',
      'subscript',
      'text-indent',
      'text-align',
      'clear',
      'text-color',
      'italic',
      'underline',
      'strike-through',
      'headings',
      'code',
      'emoji',
      'list-ul',
      'list-ol'
    ]

    return (
      <>
      <div className="editor-wrapper">
        <BraftEditor
          ref={instance => this.editorInstance = instance}
          value={editorState}
          onChange={this.handleChange}
          extendControls={extendControls}
          excludeControls={excludeControls}
          onChange={this.handleChange}
          language="en"
          stripPastedStyles={true}
          placeholder="Start writing here ..."
        />
      </div>
      <Modal
        isOpen={this.state.uploader}
        contentLabel="Minimal Modal Example"
        className="border-0 bg-transparent max-w-lg mx-auto mt-10"
      >
        <div
            className="bg-gray-900 rounded py-5 px-10 border-gray-600 mt-10 mx-5 md:mx-0"
            style={{ marginTop: 150 }}
          >
        <div className="border border-dashed border-gray-500 relative">
          <input
            type="file"
            accept="image/*"
            className="cursor-pointer relative block opacity-0 w-full h-full p-20 z-50"
            onChange={this.handleImage}
            id="image-input"
          />
          <div className="text-center p-10 absolute top-0 right-0 left-0 m-auto">
            <i className="fas fa-camera text-5xl text-gray-500" />
            <h4 className="text-gray-600 text-xl">Click and select image to upload</h4>
          </div>
        </div>
        <div onClick={() => this.setState({uploader: false})} className="cursor-pointer text-center tracking-wider py-2 my-1 bg-gray-700 rounded text-white text-sm">Cancel</div>
        </div>
      </Modal>
      <LoadingModal trigger={this.state.uploading} text="UPLOADING" />
      <Prompt when={this.state.leave} />
    </>
    )

  }

}