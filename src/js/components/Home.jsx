import React, { useEffect, useState } from "react";

const API_URL = "https://playground.4geeks.com/todo";
const USER_NAME = "tecnogas2010-spec";

const Home = () => {
	const [tasks, setTasks] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	const createUserIfNeeded = async () => {
		try {
			await fetch(`${API_URL}/users/${USER_NAME}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				}
			});
		} catch (error) {
			console.error("Error al crear el usuario:", error);
		}
	};

	const getTodos = async () => {
		try {
			setErrorMessage("");

			const response = await fetch(`${API_URL}/users/${USER_NAME}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error("No se pudieron cargar las tareas");
			}

			setTasks(data.todos || []);
		} catch (error) {
			console.error("Error al cargar las tareas:", error);
			setErrorMessage("Hubo un problema al cargar las tareas");
			setTasks([]);
		} finally {
			setLoading(false);
		}
	};

	const addTask = async () => {
		const cleanTask = inputValue.trim();

		if (cleanTask === "") return;

		try {
			setErrorMessage("");

			const response = await fetch(`${API_URL}/todos/${USER_NAME}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					label: cleanTask,
					is_done: false
				})
			});

			if (!response.ok) {
				throw new Error("No se pudo agregar la tarea");
			}

			setInputValue("");
			await getTodos();
		} catch (error) {
			console.error("Error al agregar la tarea:", error);
			setErrorMessage("No se pudo agregar la tarea");
		}
	};

	const deleteTask = async (taskId) => {
		try {
			setErrorMessage("");

			const response = await fetch(`${API_URL}/todos/${taskId}`, {
				method: "DELETE"
			});

			if (!response.ok) {
				throw new Error("No se pudo eliminar la tarea");
			}

			await getTodos();
		} catch (error) {
			console.error("Error al eliminar la tarea:", error);
			setErrorMessage("No se pudo eliminar la tarea");
		}
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			addTask();
		}
	};

	useEffect(() => {
		const initializeApp = async () => {
			await createUserIfNeeded();
			await getTodos();
		};

		initializeApp();
	}, []);

	return (
		<div className="page">
			<div className="todo-wrapper">
				<h1 className="todo-title">todos</h1>

				<div className="todo-card">
					<div className="input-row">
						<span className="input-arrow">❯</span>
						<input
							type="text"
							className="todo-input"
							placeholder="What needs to be done?"
							value={inputValue}
							onChange={(event) => setInputValue(event.target.value)}
							onKeyDown={handleKeyDown}
							aria-label="Nueva tarea"
						/>
					</div>

					{loading && <p className="message-text">Cargando tareas...</p>}

					{!loading && errorMessage !== "" && (
						<p className="message-text error-text">{errorMessage}</p>
					)}

					{!loading && errorMessage === "" && tasks.length === 0 && (
						<p className="message-text">No hay tareas, añade una</p>
					)}

					{!loading && errorMessage === "" && tasks.length > 0 && (
						<ul className="task-list">
							{tasks.map((task) => (
								<li className="task-item" key={task.id}>
									<span className="task-label">{task.label}</span>
									<button
										type="button"
										className="delete-button"
										onClick={() => deleteTask(task.id)}
										aria-label={`Eliminar tarea ${task.label}`}>
										×
									</button>
								</li>
							))}
						</ul>
					)}

					<div className="task-footer">
						<span>
							{tasks.length} {tasks.length === 1 ? "item left" : "items left"}
						</span>
					</div>
				</div>

				<div className="shadow-line shadow-line-1"></div>
				<div className="shadow-line shadow-line-2"></div>
			</div>
		</div>
	);
};

export default Home;