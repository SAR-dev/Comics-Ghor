import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class CKEditorComponent extends Component {
    constructor(){
        super();
        this.state = {
            data: '',
        }
    }
    
    render() {
        return (
            <div>
                <CKEditor
                    editor={ ClassicEditor }
                    data={this.state.data}
                    onInit={ editor => {
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        this.setState({data})
                        this.props.data(data)
                    } }
                />
            </div>
        );
    }
}

export default CKEditorComponent;