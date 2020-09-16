import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class CKUpdaterComponent extends Component {
    constructor(){
        super();
        this.state = {
            data: '',
            loaded: false
        }
    }

    loadData = (e) => {
        e.preventDefault();
        this.setState({data: this.props.value, loadData: true})
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
                {!this.state.loaded &&
                    <button onClick={this.loadData} className="w-full bg-gray-200 text-gray-800 py-1">Load Previous Body</button>
                }
            </div>
        );
    }
}

export default CKUpdaterComponent;