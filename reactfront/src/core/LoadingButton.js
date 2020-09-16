import React, { Component } from 'react'

export default class LoadingButton extends Component {
    render() {
        return (
            <button
					className="w-full rounded bg-gray-800 hover:bg-gray-900 py-2 text-gray-100 uppercase tracking-wide font-semibold"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						style={{ margin: 'auto', background: 'none', display: 'block' }}
						width="18px"
						height="18px"
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
				</button>
        )
    }
}
