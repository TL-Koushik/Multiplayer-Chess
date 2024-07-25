import React from "react";

function About() {
	return (
		<div className='h-screen flex flex-col justify-center items-center bg-gray-900 text-white'>
			<div className='max-w-4xl px-6 py-12 bg-gray-800 shadow-lg rounded-lg'>
				<h1 className='text-3xl font-bold text-gray-200 mb-6'>About Us</h1>
				<p className='text-lg leading-relaxed'>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod
					diam nec neque sollicitudin, at volutpat justo molestie. Nullam vitae
					suscipit tortor. Suspendisse potenti. Nullam ac libero quis mi laoreet
					mollis eget et eros. Vivamus sed ultricies lorem. Cras sagittis
					consectetur eros, a placerat felis interdum nec. Mauris ullamcorper
					justo ac nulla congue, sed aliquet eros pharetra. Proin pulvinar risus
					a augue varius, ac condimentum magna tincidunt. Nulla facilisi. Nullam
					vitae viverra dui.
				</p>
				<p className='text-lg leading-relaxed mt-4'>
					Integer sed arcu arcu. Duis ultrices felis non consequat sodales.
					Vivamus auctor odio ligula, non vehicula metus rutrum at. Pellentesque
					aliquam sapien id aliquam ultricies. Ut ultricies malesuada congue.
					Maecenas vel felis ut nulla tempus pellentesque. Morbi rutrum lacus
					eget lorem mollis, eget eleifend lacus rutrum. Nunc sed odio sed nibh
					pellentesque consectetur. Nullam eget malesuada purus. Fusce suscipit
					vestibulum eros non tincidunt. Curabitur imperdiet felis ut ex
					fermentum, nec rhoncus eros finibus. In vitae ex nec mi vestibulum
					ultrices.
				</p>
			</div>
		</div>
	);
}

export default About;
