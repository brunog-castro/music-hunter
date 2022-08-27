import { useFlash } from '../../stores/flashStore';

import './styles.scss';

export default function Flash() {
    const flash = useFlash();
    const options = flash.getOptions();

    const onClose = () => flash.close();

    if (!options.active)
        return <div id="flash-message"></div>;

    return (
        <div id="flash-message" className={"flash-content " + options.type}>
            <button className="close-btn" onClick={onClose}>X</button>
            <div className="message">{options.message}</div>
        </div>
    );
};