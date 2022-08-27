import Sidebar from '../../components/sidebar';

import './styles.scss';

interface TypeProps {
    children?: any,
}

export default function MainTemplate(props: TypeProps) {
    return (
        <div className="main-template">
            <div className="body">
                {props.children}
            </div>
            <Sidebar />
        </div>
    );
}