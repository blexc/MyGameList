import React from 'react';
import ReactDOM from 'react-dom';
import mario64 from './mario64.jpg';
import touhou from './th4.jpg';
import rabiribi from './rabiribi.jpg';
import kirby from './kirby.jpg';
import './mygamelist.css';

class Title extends React.Component {
	render(){
		return (
			<div className = "Title">
				<h1>My Game List</h1>
				<img src={mario64} alt="mario 64"/>
				<img src={touhou} alt="th4"/>
				<img src={rabiribi} alt="rabi ribi"/>
				<img src={kirby} alt="kirby" width="300px"/>
			</div>
		);
	}
}

class CurrentUser extends React.Component {
	render(){
		let msg;
		if (this.props.currentUser === ""){
			msg = "Not logged in";
		} else {
			msg = "Logged In As: " + this.props.currentUser + "";
		}

		return (
			<div className = "CurrentUser">
				<h2>{msg}</h2>
			</div>
		);
	}
}

class AddUser extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: '',
			pass: '',
			errorMsg: '',
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleUserChange = this.handleUserChange.bind(this);
		this.handlePassChange = this.handlePassChange.bind(this);
	}

	// make sure user is in the list and matches the password
	// or make sure the user entered is unique, to create a new one
	handleSubmit(event){ 
		event.preventDefault();
		var uniqueUser = true;

		// error checking...
		if (this.state.pass === '' || this.state.user === ''){
			this.setState({ errorMsg: 'ERROR: username and password cannot be blank.'});
			return;
		}

		for (let i=0; i < this.state.user.length; i++){
			if (this.state.user[i] === ' '){
				this.setState({ errorMsg: 'ERROR: can not have spaces in username.'});
				return;
			}
		}

		for (let i=0; i < this.state.pass.length; i++){
			if (this.state.pass[i] === ' '){
				this.setState({ errorMsg: 'ERROR: can not have spaces in password.'});
				return;
			}
		}

		// scan list, either log in or create new account
		for (let i=0; i < this.props.list.length; i++){
			if (this.props.list[i].username === this.state.user){
				uniqueUser = false;
				// login
				if (this.props.list[i].pass === this.state.pass){
					this.setState({ errorMsg: ''});
					this.props.handleLogin(this.state.user);
					return;
				}
			}
		}
		
		// create new account
		if (uniqueUser){
			this.setState({ errorMsg: ''});
			this.props.handleAddUser(this.state.user, this.state.pass); 
		}
		else{
			this.setState({ errorMsg: 'ERROR: either username already taken or incorrect password.'});
		}
	}

	handleUserChange(event){ this.setState({ user: event.target.value }); }
	handlePassChange(event){ this.setState({ pass: event.target.value }); }

	render(){
		return (
			<div className = "AddUser">
				<h2>Login/ create an account:</h2>
				<p id="red"><i>{this.state.errorMsg}</i></p>
				<form onSubmit={this.handleSubmit}>
					<label>
						Username: <br />
						<input type="text" name="username" required={true} onChange={this.handleUserChange}/> <br /> <br />
						Password: <br />
						<input type="password" name="password" required={true} onChange={this.handlePassChange}/> <br />
					</label>	
					<br />
					<input type="submit" name="Submit" />
				</form>
			</div>
		);
	}
}

class AddGame extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			gameName: '',
			score: -1,
			date: '01/01/2001',
			review: '',
			errorMsg: '',
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleGameNameChange = this.handleGameNameChange.bind(this);
		this.handleScoreChange = this.handleScoreChange.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleReviewChange = this.handleReviewChange.bind(this);
	}

	handleGameNameChange(event){ this.setState({ gameName: event.target.value, }) }
	handleScoreChange(event){ this.setState({ score: event.target.value, }) }
	handleDateChange(event){ this.setState({ date: event.target.value, }) }
	handleReviewChange(event){ this.setState({ review: event.target.value, }) }
	
	handleSubmit(event){
		event.preventDefault();

		let alreadyAdded = false;

		if (this.props.loggedInUser === ''){
			this.setState({ errorMsg: "You must be logged in to add games!" });
			return;
		}

		for (let i=0; i < this.props.list.length; i++){
			if (this.props.list[i].gameName === this.state.gameName && 
				this.props.list[i].username === this.props.loggedInUser){

				alreadyAdded = true;
			}
		}

		if (!alreadyAdded) {
			this.setState({ errorMsg: "Game added to list." });
			this.props.handleAddGame(this.state.gameName, this.state.score,
				this.state.date, this.state.review);
		} else {
			this.setState({ errorMsg: "Game already added to list! Updating!" });
			this.props.handleUpdateGame(this.state.gameName, this.state.score,
				this.state.date, this.state.review);
		}

	}

	render(){
		var today = new Date();
		var dd = today.getDate();
		if (dd < 10) dd='0'+dd;
		var mm = today.getMonth()+1;
		if (mm < 10) mm='0'+mm;
		var yyyy = today.getFullYear();
		today = yyyy + "-" + mm + "-" + dd;
		return (
			<div className = "AddGame">
				<h2>Add/ update a game:</h2>
				<p id="red"><i>{this.state.errorMsg}</i></p>
				<form onSubmit={this.handleSubmit}>
					<label>
						Game name:
						<input type="text" name="gamename" required={true}
							onChange={this.handleGameNameChange}
						/>
					</label> <br /><br />
					<label>
						Score:
						<input type="number" name="score" min="1" max="10"
							required={true} onChange={this.handleScoreChange}
						/> /10
					</label> <br /><br />
					<label>
						Date Finished:
						<input type="date" name="datefinished" required={true}
							min="1900-01-01" max={today}
							onChange={this.handleDateChange}
						/>
					</label> <br /><br />
					<label>
						Review:
						<textarea id="largeInput" type="text" name="review"
							maxLength="65500" resizeable="true"
							onChange={this.handleReviewChange}
						/>
					</label> <br /><br />
					<input type="submit" name="Submit"/>
				</form>
			</div>
		);
	}
}

class Users extends React.Component {
	onClick(name){
		this.props.handleUserClick(name.user);
	}
	render(){
		var users = [];
		for (let i=0; i < this.props.list.length; i++){
			let unique = true;
			for (let j=0; j < users.length; j++){
				if (this.props.list[i].username === users[j]){
					unique = false;
				}
			}
				
			if (unique === true){
				users.push(this.props.list[i].username);
			}
		}

		return (
			<div className = "Users">
				<h2>Users:</h2>
				<ul>
					{users.map((user, index) =>
						<li key={index}><button onClick={() => this.onClick({user})}>
							{user}
						</button></li>
					)}
				</ul>
			</div>
		);
	}
}

class UserList extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			errorMsg: "",
		};

		this.handleButton = this.handleButton.bind(this);
	}

	handleButton(event) {
		event.preventDefault();
		if (this.props.loggedInUser !== this.props.currentUser){
			this.setState({ 
				errorMsg: "You must be logged in to this account in order " +
					"to remove games."
			});
		
			return;

		}
		this.setState({ errorMsg: ""});
		this.props.handleGameDelete(event.target.value);
	}

	render(){
		const currentUserText = this.props.currentUser + "'s List";
		var userList = [];

		for (let i=0; i < this.props.list.length; i++){
			if (this.props.list[i].username === this.props.currentUser &&
				this.props.list[i].gameName !== ""){

				var date = this.props.list[i].finishDate;
				date = date.slice(0, 10);
				var dd = date.substr(5,2);
				var mm = date.substr(8,2);
				var yyyy = date.substr(0,4);
				date = dd + "/" + mm + "/" + yyyy;
				
				userList.push({
					id: this.props.list[i].id,
					gameName: this.props.list[i].gameName,
					gameScore: this.props.list[i].gameScore,
					finishDate: date,
					review: this.props.list[i].review,
				});
			}
		}

		if (this.props.currentUser !== ""){
			return (
				<div className = "UserList">
					<h2>{currentUserText}</h2>
					<p id="red"><i>{this.state.errorMsg}</i></p>
					<table><tbody>
						<tr id="first">
							<th>Game Name</th>
							<th id="score">Score</th>
							<th>Date Completed</th>
							<th>Review</th>
						</tr>
						{userList.map(game =>
							<tr id="notfirst" key={game.id}>
								<td>{game.gameName}</td>
								<td id="score">{game.gameScore}</td>
								<td id="date">{game.finishDate}</td>
								<td id="review"><i>{game.review}</i></td>
								<td id="deletebutton"> <button 
									value={game.gameName}
									onClick={this.handleButton}>
									x
								</button>
								</td>
							</tr>
						)}
					</tbody></table>
				</div>
			);
		} else {
			return (
				<div className = "UserList">
					<h2>Click a user to view their list.</h2>
				</div>
			);
		}
	}
}

class MyGameList extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			list: [],
			loggedInUser: "",	// means no one is logged in 
			userViewing: "",	// means no user's list is being viewed 
		};
		this.handleUserClick = this.handleUserClick.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleAddUser = this.handleAddUser.bind(this);
		this.handleAddGame = this.handleAddGame.bind(this);
		this.handleUpdateGame = this.handleUpdateGame.bind(this);
		this.handleGameDelete = this.handleGameDelete.bind(this);
	}

	// creates the database
	startDB(){
		fetch('/initdb')
			.then(response => {
				if (response.status !== 200) {
					console.log('initdb fetch problem: ' + response.status);
					return;
				}
			})
		.catch(err => {
			console.log('initdb fetch error :-S', err);
		})
	}

	// loads the data into list
	loadDB(){
		fetch('/loadall')
			.then(response => {
				if (response.status !== 200) {
					console.log('loadall fetch problem: ' + response.status);
					return;
				}
				response.json()
				.then(loadall => {
					if (this._isMounted){
						this.setState({list: loadall});
					}
				});
			})
		.catch(err => {
			console.log('loadall fetch error :-S', err);
		})
	}

	// assigns stats to db stats during loadup
	componentDidMount() {
		this._isMounted = true;
		/*this.startDB();*/
		this.loadDB();
	}

	// to ensure no memory leaks
	componentWillUnmount() {
		this._isMounted = false;
	}

	// look at a new user list (doesn't change who's logged in!)
	handleUserClick(name) {
		this.setState({
			userViewing: name,
		});
	}

	// registers a new user account
	handleAddUser(user, pass){
		fetch('/adduser/name/' + user + '/pass/' + pass)
			.then(response => {
				if (response.status !== 200){
					console.log('error creating user: '+ response.status);
					return;
				}
				this.loadDB();
				this.setState({
					loggedInUser: user,
					userViewing: user,
				});
			})
		.catch(err => {
			console.log('adduser fetch error :-S', err);
		})
	}

	// login
	handleLogin(user){
		this.setState({
			loggedInUser: user,
			userViewing: user,
		});
	}

	handleAddGame(gamename, score, date, review){
		// get pass of cur user
		let pass = "";
		for (let i=0; i < this.state.list.length; i++){
			if (this.state.list[i].username === this.state.loggedInUser){
				pass = this.state.list[i].pass;
				break;
			}
		}
		if (pass === ""){
			console.log("user has password as blank in add new game?");
			return;
		}
	
		// add game 
		fetch('/addgame/' + this.state.loggedInUser + '/' + pass + 
				'/' + gamename + '/' + score + '/' + date + '/' + review)
			.then(response => {
				if (response.status !== 200){
					console.log('error adding game: '+ response.status);
					return;
				}
				this.loadDB();
				this.setState({
					userViewing: this.state.loggedInUser,
				});
			})
		.catch(err => {
			console.log('addgame fetch error :-S', err);
		})
	}

	handleUpdateGame(gamename, score, date, review){
		// get pass of cur user
		let pass = "";
		for (let i=0; i < this.state.list.length; i++){
			if (this.state.list[i].username === this.state.loggedInUser){
				pass = this.state.list[i].pass;
				break;
			}
		}
		if (pass === ""){
			console.log("user has password as blank in updatenewgame?");
			return;
		}
	
		// add game 
		fetch('/updategame/' + this.state.loggedInUser + 
				'/' + gamename + '/' + score + '/' + date + '/' + review)
			.then(response => {
				if (response.status !== 200){
					console.log('error updtating game: '+ response.status);
					return;
				}
				this.loadDB();
				this.setState({
					userViewing: this.state.loggedInUser,
				});
			})
		.catch(err => {
			console.log('updategame fetch error :-S', err);
		})
	}

	// deletes game from user's game list
	handleGameDelete(gamename){
		fetch('/removegame/' + this.state.loggedInUser + '/' + gamename)
			.then(response => {
				if (response.status !== 200){
					console.log('error removing game: '+ response.status);
					return;
				}
				this.loadDB();
			})
		.catch(err => {
			console.log('updategame fetch error :-S', err);
		})
	}

	render() {
		return (
			<div>
				<Title/>
				<br/ >
				<CurrentUser currentUser={this.state.loggedInUser}/>
				<br/ >
				<table><tbody>
					<tr>
						<td><AddUser
							handleAddUser={this.handleAddUser}
							handleLogin={this.handleLogin}
							list={this.state.list}
						/></td>
						<td><AddGame
							handleAddGame={this.handleAddGame}	
							handleUpdateGame={this.handleUpdateGame}	
							loggedInUser={this.state.loggedInUser}
							list={this.state.list}
						/></td>
					</tr>
				</tbody></table>
				<br/ >
				<table><tbody>
					<tr>
						<td id="largeCell"> 
							<UserList
								list={this.state.list}
								currentUser={this.state.userViewing}
								loggedInUser={this.state.loggedInUser}
								handleGameDelete={this.handleGameDelete}
							/>
						</td>
						<td>
							<Users
								list={this.state.list}
								handleUserClick={this.handleUserClick}
							/>
						</td>
					</tr>
				</tbody></table>
			</div>
		);
	}
}

ReactDOM.render( <MyGameList />, document.getElementById('root'));
export default MyGameList;
