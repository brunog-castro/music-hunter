import Router from './pages/router';
import UserStorage from './utils/userStorage';
import AuthService from './services/auth-service';

export default function App() {
    const init = () => {
        if (!UserStorage.hasToken())
            AuthService.init();
    };

    return (
        <div className="App" onLoad={init}>
            <Router />
        </div>
    );
}
