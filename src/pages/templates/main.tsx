import Flash from '../../components/flash';
import Sidebar from '../../components/sidebar';

import './styles.scss';

interface PropTypes {
    children?: any,
}

export default function MainTemplate(props: PropTypes) {
    return (
        <>
            <div className="main-template">
                <div className="body">
                    {props.children}
                </div>
                <Sidebar />
            </div>
            <Flash />
        </>
    );
}