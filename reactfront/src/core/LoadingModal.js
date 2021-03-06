import React, { Component } from 'react';
import Modal from 'react-modal';

export default class LoadingModal extends Component {
    render() {
        const {trigger, text} = this.props
        return (
            <Modal
					isOpen={trigger}
                    contentLabel="Minimal Modal"
					className="border-0 bg-gray-800 mx-auto"
					ariaHideApp={false}
                >
                    <div className="h-screen w-full" style={{zIndex: 999999999}}>
                        <div style={{paddingTop: 200}}>
						<svg
									xmlns="http://www.w3.org/2000/svg"
									xmlnsXlink="http://www.w3.org/1999/xlink"
									style={{ margin: 'auto', background: 'none', display: 'block' }}
									width="100px"
									height="100px"
									viewBox="0 0 100 100"
									preserveAspectRatio="xMidYMid"
								>
									<circle cx={50} cy={50} r={30} stroke="#001f2d" strokeWidth={10} fill="none" />
									<circle
										cx={50}
										cy={50}
										r={30}
										stroke="#008fd4"
										strokeWidth={8}
										strokeLinecap="round"
										fill="none"
										transform="rotate(108.569 50 50)"
									>
										<animateTransform
											attributeName="transform"
											type="rotate"
											repeatCount="indefinite"
											dur="1s"
											values="0 50 50;180 50 50;720 50 50"
											keyTimes="0;0.5;1"
										/>
										<animate
											attributeName="stroke-dasharray"
											repeatCount="indefinite"
											dur="1s"
											values="18.84955592153876 169.64600329384882;94.2477796076938 94.24777960769377;18.84955592153876 169.64600329384882"
											keyTimes="0;0.5;1"
										/>
									</circle>
								</svg>
                            <h1 className="text-xl text-white text-center my-5 tracking-widest">{text}</h1>
                        </div>
                    </div>
                </Modal>
        )
    }
}
