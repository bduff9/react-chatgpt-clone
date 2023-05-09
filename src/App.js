import { useEffect, useState } from 'react';

const App = () => {
	const [value, setValue] = useState('');
	const [message, setMessage] = useState(null);
	const [previousChats, setPreviousChats] = useState([]);
	const [currentTitle, setCurrentTitle] = useState(null);

	const createNewChat = () => {
		setCurrentTitle(null);
		setMessage(null);
		setValue('');
	};

	const switchChat = (title) => {
		setCurrentTitle(title);
		setMessage(null);
		setValue('');
	};

	const getMessages = async () => {
		const options = {
			method: 'POST',
			body: JSON.stringify({
				message: value,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const response = await fetch(
				'http://localhost:8000/completions',
				options
			);
			const data = await response.json();

			setMessage(data.choices[0].message);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!currentTitle && value && message) {
			setCurrentTitle(value);
		}

		if (currentTitle && value && message) {
			setPreviousChats((prevChats) => [
				...prevChats,
				{ title: currentTitle, role: 'user', content: value },
				{ title: currentTitle, role: message.role, content: message.content },
			]);
		}
	}, [message, currentTitle]);

	const currentChat = previousChats.filter(
		(previousChat) => previousChat.title === currentTitle
	);
	const uniqueTitles = Array.from(
		new Set(previousChats.map((previousChat) => previousChat.title))
	);

	return (
		<div className="app">
			<section className="side-bar">
				<button type="button" onClick={createNewChat}>
					+ New chat
				</button>
				<ul className="history">
					{uniqueTitles?.map((title) => (
						<li key={title} onClick={() => switchChat(title)}>
							{title}
						</li>
					))}
				</ul>
				<nav>
					<p>Made by Brian</p>
				</nav>
			</section>
			<section className="main">
				{!currentTitle && <h1>BrianGPT</h1>}
				<ul className="feed">
					{currentChat.map((chatMessage) => (
						<li key={chatMessage.content}>
							<p className="role">{chatMessage.role}</p>
							<p>{chatMessage.content}</p>
						</li>
					))}
				</ul>
				<div className="bottom-section">
					<div className="input-container">
						<input value={value} onChange={(ev) => setValue(ev.target.value)} />
						<div id="submit" onClick={getMessages}>
							➢
						</div>
					</div>
					<p className="info">
						Chat GPT Mar 14 Version. Free Research Preview. Our goal is to make
						AI systems more natural and safe to interact with. Your feedback
						will help us improve.
					</p>
				</div>
			</section>
		</div>
	);
};

export default App;
