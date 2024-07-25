import React from "react";
import { useRouteError } from "react-router-dom";

function ErrorPage() {
	const error = useRouteError();
	console.log(error);
	return (
		<div>
			ErrorPage
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>{error.statusText || error.message}</p>
		</div>
	);
}

export default ErrorPage;
