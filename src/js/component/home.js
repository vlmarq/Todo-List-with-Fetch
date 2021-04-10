import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

//include images into your bundle

export function Home() {
	// Creates todo list
	const [list, setList] = useState([]);

	const userURL = "https://assets.breatheco.de/apis/fake/todos/user/vlmarq";

	// Creates todo item
	const [todo, setTodo] = useState("");

	const getTodo = () => {
		fetch(userURL)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`${response.status} - ${response.statusText}`
					);
				}
				return response.json();
			})
			.then(data => setList(data))
			.catch(err => console.error(err));
	};

	useEffect(() => {
		getTodo();
	}, []);

	// e = event | Function handles submit
	const addTodo = e => {
		if (e.key === "Enter" && todo !== "") {
			fetch(userURL, {
				method: "PUT",
				body: JSON.stringify(
					setList(
						list.concat({
							// Assigns todo value to label
							label: todo,
							isDone: false
						})
					)
				),
				header: {
					"Content-Type": "application/json"
				}
			})
				.then(response => response.json)
				.then(response =>
					console.log("Success:", JSON.stringify(response))
				)
				.catch(error => console.error("Error:", error));
		}
	};

	const removeTodo = index => {
		setList(list.filter((item, i) => index != i));
	};

	return (
		<div className="d-flex flex-column align-items-center justify-content-center h-100">
			<h1>To Do</h1>
			{/* When enter is pressed, the function "addTodo" runs */}
			<form onSubmit={e => e.preventDefault()}>
				<ul className="list-unstyled d-flex flex-column p-0">
					<li>
						<input
							type="text"
							placeholder="What has to be done?"
							className="form-control"
							value={todo}
							/* When user changes content of input field, event will trigger setTodo */
							onChange={e => setTodo(e.target.value)}
							onKeyPress={e => addTodo(e)}
						/>
					</li>
					{// Loop to create li
					list.map((item, index) => {
						return (
							<li key={index} className="d-flex listItem">
								{item.label}
								<span
									className="ml-auto"
									role="button"
									tabIndex="0"
									onClick={() => removeTodo(index)}>
									<FontAwesomeIcon
										className="icon"
										icon={faTimes}
									/>
								</span>
							</li>
						);
					})}
					<li className="mt-3 d-inline-flex align-items-center">
						<span id="number">{list.length}</span>
						&nbsp;item
						{list.length > 1 || list.length === 0 ? "s" : null} left
						<span className="ml-auto">
							<a
								href="#"
								className="btn btn-small btn-outline-info"
								// Messes up add todo and leaves one empty li
								onClick={() => setList([])}>
								Clear List
							</a>
						</span>
					</li>
				</ul>
			</form>
		</div>
	);
}
