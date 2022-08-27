import loadingIcon from '../../assets/loaders/loader.svg';
import loadingIconInverted from '../../assets/loaders/loader-inverted.svg';
import './styles.scss';

interface PropTypes {
    inverted?: boolean;
    className?: string;
}

const Loader = (props: PropTypes) => {
    return (
        <div className={"loader " + (props.className || "")}>
            <img 
                alt="loader" 
                src={
                    props.inverted 
                        ? loadingIconInverted 
                        : loadingIcon
                }
            />
        </div>
    );
};

export default Loader;