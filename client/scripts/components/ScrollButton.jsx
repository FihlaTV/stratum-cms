import React from 'react';

const ScrollButton = () => {
	var pageIsCropped =
		document.body.scrollHeight > window.innerHeight ? '' : 'hidden';
	return (
		<a
			onClick={function scrollToTop() {
				scroll(0, 0);
			}}
			className={`scrollbutton ${pageIsCropped}`}
		>
			<span className="scrollbutton-symbol">
				<svg width="100%" height="100%" viewBox="0 0 7 12">
					<g id="Startsida" fill="none" fillRule="evenodd">
						<g
							transform="translate(-562.000000, -470.000000)"
							strokeLinecap="round"
						>
							<g
								id="Ladda-ner-senaste-år-+-Path-136-Copy-3"
								transform="translate(274.000000, 466.000000)"
							>
								<path
									d="M286,7.37867394 L291.310663,12.689337 L297,7"
									id="Path-136-Copy-3"
									transform="translate(291.500000, 9.844668) rotate(-180.000000) translate(-291.500000, -9.844668) "
								/>
							</g>
						</g>
					</g>
				</svg>
			</span>
			<span className="scrollbutton-text">UPP</span>
		</a>
	);
};
export default ScrollButton;
